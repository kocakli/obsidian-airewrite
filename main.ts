import { App, Editor, MarkdownView, Modal, Notice, Plugin, Menu, debounce } from 'obsidian';
import { AIRewriteSettings, WritingStyle } from './src/types';
import { DEFAULT_SETTINGS, AIRewriteSettingsTab } from './src/settings';
import { GeminiClient } from './src/gemini-client';
import { RewriteEngine, RewriteStrategy, RewriteResult } from './src/rewriter';
import { ProgressModal, PreviewModal, StyleSelectorModal, ErrorModal } from './src/modals';
import { getTranslation } from './src/i18n';

export default class AIRewritePlugin extends Plugin {
	settings: AIRewriteSettings;
	geminiClient: GeminiClient;
	rewriteEngine: RewriteEngine;
	private statusBarItem: HTMLElement;
	private isProcessing: boolean = false;

	async onload() {
		await this.loadSettings();
		
		this.geminiClient = new GeminiClient(this.settings);
		this.rewriteEngine = new RewriteEngine(this.geminiClient);

		this.addCommands();
		this.addContextMenu();
		this.addStatusBar();
		this.addSettingTab(new AIRewriteSettingsTab(this.app, this));
	}

	private addCommands() {
		const t = getTranslation();
		
		// Main rewrite command - rewrite selected text or entire note
		this.addCommand({
			id: 'rewrite-selected-text',
			name: t.rewriteSelectedText,
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.handleRewriteCommand(editor, view, false);
			}
		});

		// Rewrite entire note
		this.addCommand({
			id: 'rewrite-entire-note',
			name: t.rewriteEntireNote,
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.handleRewriteCommand(editor, view, true);
			}
		});

		// Quick rewrite (no preview)
		this.addCommand({
			id: 'quick-rewrite',
			name: t.quickRewrite,
			hotkeys: [{ modifiers: ['Ctrl', 'Shift'], key: 'g' }],
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.handleRewriteCommand(editor, view, false, RewriteStrategy.REPLACE);
			}
		});

		// Rewrite with style selector
		this.addCommand({
			id: 'rewrite-with-style',
			name: t.rewriteWithStyle,
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
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.handleRewriteCommand(editor, view, false, RewriteStrategy.APPEND);
			}
		});
	}

	private addContextMenu() {
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

	onunload() {
		
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	updateGeminiClient() {
		if (this.geminiClient) {
			this.geminiClient.updateSettings(this.settings);
			this.rewriteEngine = new RewriteEngine(this.geminiClient);
		}
	}
}