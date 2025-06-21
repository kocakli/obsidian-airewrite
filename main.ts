import { App, Editor, MarkdownView, Modal, Notice, Plugin, Menu, debounce } from 'obsidian';
import { AIRewriteSettings, WritingStyle } from './src/types';
import { DEFAULT_SETTINGS, AIRewriteSettingsTab } from './src/settings';
import { GeminiClient } from './src/gemini-client';
import { RewriteEngine, RewriteStrategy, RewriteResult } from './src/rewriter';
import { ProgressModal, PreviewModal, StyleSelectorModal, ErrorModal } from './src/modals';
import { MobileProgressModal, MobilePreviewModal } from './src/mobile-ui';
import { MobileCommandManager } from './src/mobile-commands';
import { PlatformDetector } from './src/platform-detector';
import { IconManager } from './src/icon-manager';
import { SecurityEducationManager } from './src/security-education';
import { DynamicPromptManager } from './src/dynamic-prompt-manager';
import { getTranslation } from './src/i18n';

export default class AIRewritePlugin extends Plugin {
	settings: AIRewriteSettings;
	geminiClient: GeminiClient;
	rewriteEngine: RewriteEngine;
	private statusBarItem: HTMLElement;
	private isProcessing: boolean = false;
	public platformDetector: PlatformDetector;
	private mobileCommandManager: MobileCommandManager;
	private iconManager: IconManager;
	public securityEducationManager: SecurityEducationManager;
	public promptManager: DynamicPromptManager;

	async onload() {
		await this.loadSettings();
		
		// Initialize platform detection
		this.platformDetector = new PlatformDetector(this.app);
		
		// Initialize icon manager with platform detection
		this.iconManager = new IconManager(this.platformDetector);
		
		this.geminiClient = new GeminiClient(this.settings);
		
		// Initialize dynamic prompt manager
		this.promptManager = new DynamicPromptManager(this.settings);
		
		this.rewriteEngine = new RewriteEngine(this.geminiClient, this.promptManager);

		// Initialize security education manager
		this.securityEducationManager = new SecurityEducationManager(
			this.app,
			this.platformDetector,
			this.settings,
			this.saveSettings.bind(this)
		);

		// Initialize mobile command manager
		this.mobileCommandManager = new MobileCommandManager(
			this.app,
			this.platformDetector,
			this.handleMobileRewrite.bind(this)
		);

		this.addCommands();
		this.addContextMenu();
		this.addStatusBar();
		this.addSettingTab(new AIRewriteSettingsTab(this.app, this));
		
		// Add platform-specific CSS classes
		this.addPlatformClasses();
		
		// Register mobile-specific features
		if (this.platformDetector.isMobile()) {
			this.registerMobileFeatures();
		}
	}

	private addCommands() {
		const t = getTranslation();
		
		// Main rewrite command - rewrite selected text or entire note
		this.addCommand({
			id: 'rewrite-selected-text',
			name: this.promptManager.getCommandName(t.rewriteSelectedText),
			icon: this.iconManager.getCommandIcon('rewrite'),
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.handleRewriteCommand(editor, view, false);
			}
		});

		// Rewrite entire note
		this.addCommand({
			id: 'rewrite-entire-note',
			name: this.promptManager.getCommandName(t.rewriteEntireNote),
			icon: this.iconManager.getIcon('rewriteDocument'),
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.handleRewriteCommand(editor, view, true);
			}
		});

		// Add mobile-specific commands
		if (this.platformDetector.isMobile()) {
			const mobileCommands = this.mobileCommandManager.registerMobileCommands();
			mobileCommands.forEach(command => {
				this.addCommand(command);
			});
		}

		// Quick rewrite (no preview)
		this.addCommand({
			id: 'quick-rewrite',
			name: t.quickRewrite,
			icon: this.iconManager.getCommandIcon('quick'),
			hotkeys: [{ modifiers: ['Ctrl', 'Shift'], key: 'g' }],
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.handleRewriteCommand(editor, view, false, RewriteStrategy.REPLACE);
			}
		});

		// Rewrite with style selector
		this.addCommand({
			id: 'rewrite-with-style',
			name: t.rewriteWithStyle,
			icon: this.iconManager.getCommandIcon('style'),
			hotkeys: [{ modifiers: ['Ctrl', 'Alt'], key: 'g' }],
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const styleModal = new StyleSelectorModal(this.app, async (style) => {
					await this.handleRewriteCommand(editor, view, false, RewriteStrategy.PREVIEW, style);
				});
				styleModal.open();
			}
		});

		// Append rewritten version
		this.addCommand({
			id: 'append-rewrite',
			name: t.appendRewrite,
			icon: this.iconManager.getIcon('append'),
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.handleRewriteCommand(editor, view, false, RewriteStrategy.APPEND);
			}
		});
	}

	private addContextMenu() {
		// Only add context menu for desktop platforms
		if (this.platformDetector.supportsContextMenu()) {
			this.registerEvent(
				this.app.workspace.on('editor-menu', (menu: Menu, editor: Editor, view: MarkdownView) => {
					const selection = editor.getSelection();
					const t = getTranslation();
					
					menu.addSeparator();

				if (selection.trim()) {
					menu.addItem((item) => {
						item
							.setTitle('🤖 ' + t.rewriteSelectedText)
							.setIcon('wand-glyph')
							.onClick(async () => {
								await this.handleRewriteCommand(editor, view, false);
							});
					});

					menu.addItem((item) => {
						item
							.setTitle('✨ ' + t.rewriteWithStyle)
							.setIcon('palette')
							.onClick(async () => {
								const styleModal = new StyleSelectorModal(this.app, async (style) => {
									await this.handleRewriteCommand(editor, view, false, RewriteStrategy.PREVIEW, style);
								});
								styleModal.open();
							});
					});
				} else {
					menu.addItem((item) => {
						item
							.setTitle('🤖 ' + t.rewriteEntireNote)
							.setIcon('file-text')
							.onClick(async () => {
								await this.handleRewriteCommand(editor, view, true);
							});
					});
				}
			})
		);
		}
	}

	private addStatusBar() {
		this.statusBarItem = this.addStatusBarItem();
		this.updateStatusBar('ready');
	}

	private updateStatusBar(status: 'ready' | 'processing' | 'error') {
		const t = getTranslation();
		const icons = {
			ready: '🤖',
			processing: '⚙️',
			error: '❌'
		};
		
		const texts = {
			ready: t.ready,
			processing: t.processing,
			error: t.error
		};
		
		this.statusBarItem.setText(`${icons[status]} ${texts[status]}`);
	}

	private handleRewriteCommand = debounce(
		async (
			editor: Editor, 
			view: MarkdownView, 
			entireNote: boolean = false,
			strategy: RewriteStrategy = RewriteStrategy.PREVIEW,
			style?: WritingStyle | null
		) => {
			const t = getTranslation();
			
			if (!this.geminiClient.isConfigured()) {
				new Notice('❌ ' + t.configureApiKey);
				return;
			}

			if (this.isProcessing) {
				new Notice('⏳ ' + t.processingInProgress);
				return;
			}

			// Check text context
			const context = this.rewriteEngine.detectTextContext(editor);
			
			if (!entireNote && !context.hasSelection) {
				new Notice('❌ ' + t.selectTextFirst);
				return;
			}

			// Validate text length
			const textToCheck = entireNote ? editor.getValue() : context.selectedText;
			if (!textToCheck.trim()) {
				new Notice('❌ ' + t.emptyTextError);
				return;
			}
			
			if (!this.rewriteEngine.validateTextLength(textToCheck, this.settings.maxTokens)) {
				const estimatedTokens = this.rewriteEngine.estimateTokens(textToCheck);
				new Notice(`❌ ${t.textTooLong.replace('${tokens}', estimatedTokens.toString()).replace('${limit}', this.settings.maxTokens.toString())}`);
				return;
			}

			this.isProcessing = true;
			this.updateStatusBar('processing');

			// Show progress modal for preview strategy
			let progressModal: ProgressModal | null = null;
			if (strategy === RewriteStrategy.PREVIEW) {
				progressModal = new ProgressModal(this.app);
				progressModal.open();
				
				this.rewriteEngine.setProgressCallback((progress, status) => {
					progressModal?.updateProgress(progress, status);
				});
			} else {
				new Notice('🤖 ' + t.processing);
			}

			try {
			let result: RewriteResult;
			
			if (entireNote) {
				result = await this.rewriteEngine.rewriteEntireNote(editor, view, { 
					style: style || undefined,
					strategy 
				});
			} else {
				result = await this.rewriteEngine.rewriteSelectedText(editor, view, { 
					style: style || undefined,
					strategy 
				});
			}

			if (!result.success) {
				progressModal?.close();
				const errorModal = new ErrorModal(this.app, result.error || 'Bilinmeyen hata oluştu');
				errorModal.open();
				return;
			}

			if (strategy === RewriteStrategy.PREVIEW) {
				progressModal?.close();
				
				const previewModal = new PreviewModal(
					this.app,
					result,
					() => {
						// Accept - replace text
						this.rewriteEngine.executeRewriteStrategy(result, editor, RewriteStrategy.REPLACE);
					},
					() => {
						// Reject - do nothing
						new Notice('❌ ' + t.changesRejected);
					}
				);
				previewModal.open();
			} else {
				// Execute strategy directly
				await this.rewriteEngine.executeRewriteStrategy(result, editor, strategy);
			}

			} catch (error: any) {
				progressModal?.close();
				this.updateStatusBar('error');
				const errorModal = new ErrorModal(this.app, `Beklenmeyen hata: ${error.message}`);
				errorModal.open();
			} finally {
				this.isProcessing = false;
				setTimeout(() => {
					this.updateStatusBar('ready');
				}, 3000);
			}
		},
		300, // 300ms debounce
		true  // Leading edge
	);


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	updateGeminiClient() {
		if (this.geminiClient) {
			this.geminiClient.updateSettings(this.settings);
			this.promptManager.updateSettings(this.settings);
			this.rewriteEngine = new RewriteEngine(this.geminiClient, this.promptManager);
		}
	}

	// Mobile-specific methods
	private addPlatformClasses() {
		const bodyEl = document.body;
		
		if (this.platformDetector.isMobile()) {
			bodyEl.addClass('is-mobile');
			
			if (this.platformDetector.isIOS()) {
				bodyEl.addClass('is-ios');
			}
			
			if (this.platformDetector.isAndroid()) {
				bodyEl.addClass('is-android');
			}
		} else {
			bodyEl.addClass('is-desktop');
		}
	}

	private registerMobileFeatures() {
		// Register touch events
		this.mobileCommandManager.registerTouchEvents();
		
		// Register selection change handler for floating button
		this.registerEvent(
			this.app.workspace.on('active-leaf-change', () => {
				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (activeView) {
					// Use document selection events instead of editor events
					document.addEventListener('selectionchange', () => {
						this.mobileCommandManager.handleSelectionChange(activeView.editor);
					});
				}
			})
		);
	}

	private async handleMobileRewrite(text: string, style: WritingStyle, instructions?: string) {
		if (this.isProcessing) {
			new Notice('🔄 Already processing a rewrite...');
			return;
		}

		this.isProcessing = true;
		this.updateStatusBar('processing');

		const config = this.platformDetector.getAPIConfig();
		let progressModal: MobileProgressModal | ProgressModal;

		try {
			// Use mobile-optimized modal if on mobile
			if (this.platformDetector.isMobile()) {
				progressModal = new MobileProgressModal(this.app, this.platformDetector);
			} else {
				progressModal = new ProgressModal(this.app);
			}
			
			progressModal.open();
			progressModal.updateProgress(10, 'Connecting to AI...');

			const result = await this.rewriteEngine.rewrite(
				text,
				style,
				instructions,
				config.timeout,
				(progress: number, status: string) => {
					progressModal.updateProgress(progress, status);
				}
			);

			progressModal.close();

			if (result.success) {
				// Show mobile-optimized preview modal
				if (this.platformDetector.isMobile()) {
					const previewModal = new MobilePreviewModal(
						this.app,
						result,
						(acceptedResult: RewriteResult) => {
							this.applyRewriteResult(acceptedResult);
						},
						() => {
							new Notice('✋ Rewrite cancelled');
						},
						this.platformDetector
					);
					previewModal.open();
				} else {
					const previewTitle = this.promptManager.getPreviewTitle();
					const previewModal = new PreviewModal(
						this.app,
						result,
						() => {
							this.applyRewriteResult(result);
						},
						() => {
							new Notice('✋ Rewrite cancelled');
						},
						previewTitle
					);
					previewModal.open();
				}
			} else {
				throw new Error(result.error || 'Unknown error occurred');
			}

		} catch (error) {
			progressModal?.close();
			const errorModal = new ErrorModal(this.app, error.message);
			errorModal.open();
			this.updateStatusBar('error');
		} finally {
			this.isProcessing = false;
			this.updateStatusBar('ready');
		}
	}

	private applyRewriteResult(result: RewriteResult) {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			new Notice('❌ No active editor found');
			return;
		}

		const editor = activeView.editor;
		
		// Find and replace the original text with rewritten text
		const content = editor.getValue();
		const newContent = content.replace(result.originalText, result.rewrittenText);
		
		if (newContent !== content) {
			editor.setValue(newContent);
			new Notice('✅ Text rewritten successfully!');
		} else {
			new Notice('⚠️ Could not apply changes - text may have been modified');
		}
	}

	onunload() {
		// Clean up mobile features
		if (this.mobileCommandManager) {
			this.mobileCommandManager.hideFloatingButton();
		}
	}
}