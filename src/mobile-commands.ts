import { App, Editor, MarkdownView, Command, Notice } from 'obsidian';
import { PlatformDetector } from './platform-detector';
import { MobileFloatingButton, MobileStyleSelector } from './mobile-ui';
import { IconManager } from './icon-manager';
import { WritingStyle } from './types';

export class MobileCommandManager {
	private app: App;
	private platformDetector: PlatformDetector;
	private floatingButton: MobileFloatingButton;
	private iconManager: IconManager;
	private onRewriteCallback: (text: string, style: WritingStyle, instructions?: string) => Promise<void>;

	constructor(
		app: App, 
		platformDetector: PlatformDetector,
		onRewriteCallback: (text: string, style: WritingStyle, instructions?: string) => Promise<void>
	) {
		this.app = app;
		this.platformDetector = platformDetector;
		this.iconManager = new IconManager(platformDetector);
		this.floatingButton = new MobileFloatingButton(app, platformDetector);
		this.onRewriteCallback = onRewriteCallback;
	}

	registerMobileCommands(): Command[] {
		const commands: Command[] = [];

		if (this.platformDetector.isMobile()) {
			// Quick Mobile Rewrite - Shows style selector immediately
			commands.push({
				id: 'mobile-quick-rewrite',
				name: '📱 Quick Mobile Rewrite',
				icon: this.iconManager.getCommandIcon('mobile'),
				editorCallback: (editor: Editor) => {
					this.handleQuickMobileRewrite(editor);
				}
			});

			// Mobile Style Selector - Direct access to style selection
			commands.push({
				id: 'mobile-style-selector',
				name: '🎨 Mobile Style Selector',
				icon: this.iconManager.getCommandIcon('style'),
				editorCallback: (editor: Editor) => {
					this.showMobileStyleSelector(editor);
				}
			});

			// Touch Preview - Optimized for touch interaction
			commands.push({
				id: 'mobile-touch-preview',
				name: '👆 Touch Preview & Rewrite',
				icon: this.iconManager.getCommandIcon('preview'),
				editorCallback: (editor: Editor) => {
					this.handleTouchPreview(editor);
				}
			});

			// Smart Selection Rewrite - Auto-detects best text to rewrite
			commands.push({
				id: 'mobile-smart-selection',
				name: '🧠 Smart Selection Rewrite',
				icon: this.iconManager.getIcon('smart'),
				editorCallback: (editor: Editor) => {
					this.handleSmartSelection(editor);
				}
			});

			// Voice-to-Text Style (Future feature placeholder)
			commands.push({
				id: 'mobile-voice-rewrite',
				name: '🎤 Voice Rewrite (Coming Soon)',
				icon: this.iconManager.getIcon('voice'),
				callback: () => {
					new Notice('Voice rewriting feature coming in next update! 🎤');
				}
			});
		}

		return commands;
	}

	private async handleQuickMobileRewrite(editor: Editor) {
		const selectedText = editor.getSelection();
		
		if (!selectedText || selectedText.trim().length === 0) {
			new Notice('📱 Please select some text first');
			return;
		}

		// Show style selector optimized for mobile
		this.showMobileStyleSelector(editor, selectedText);
	}

	private showMobileStyleSelector(editor: Editor, preSelectedText?: string) {
		const selectedText = preSelectedText || editor.getSelection();
		
		if (!selectedText || selectedText.trim().length === 0) {
			new Notice('📱 Please select some text first');
			return;
		}

		const styleModal = new MobileStyleSelector(
			this.app,
			async (style: WritingStyle) => {
				await this.onRewriteCallback(selectedText, style);
			},
			this.platformDetector
		);

		styleModal.open();
	}

	private async handleTouchPreview(editor: Editor) {
		const selectedText = editor.getSelection();
		
		if (!selectedText || selectedText.trim().length === 0) {
			new Notice('👆 Select text, then use this command for touch-optimized preview');
			return;
		}

		// Use casual style as default for quick touch preview
		await this.onRewriteCallback(selectedText, WritingStyle.CASUAL);
	}

	private async handleSmartSelection(editor: Editor) {
		let textToRewrite = editor.getSelection();

		// If no selection, try to intelligently select text
		if (!textToRewrite || textToRewrite.trim().length === 0) {
			textToRewrite = this.smartSelectText(editor);
		}

		if (!textToRewrite || textToRewrite.trim().length === 0) {
			new Notice('🧠 Could not find suitable text to rewrite. Please select some text manually.');
			return;
		}

		// Auto-select text and show floating button
		editor.setSelection(
			editor.getCursor('from'),
			{ 
				line: editor.getCursor('from').line, 
				ch: editor.getCursor('from').ch + textToRewrite.length 
			}
		);

		this.showFloatingButton(() => {
			this.showMobileStyleSelector(editor, textToRewrite);
		});
	}

	private smartSelectText(editor: Editor): string {
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);
		
		// Try to select current sentence
		const beforeCursor = line.substring(0, cursor.ch);
		const afterCursor = line.substring(cursor.ch);
		
		// Find sentence boundaries
		const sentenceStart = Math.max(
			beforeCursor.lastIndexOf('.'),
			beforeCursor.lastIndexOf('!'),
			beforeCursor.lastIndexOf('?'),
			0
		);
		
		const sentenceEnd = Math.min(
			afterCursor.indexOf('.') !== -1 ? afterCursor.indexOf('.') + cursor.ch + 1 : line.length,
			afterCursor.indexOf('!') !== -1 ? afterCursor.indexOf('!') + cursor.ch + 1 : line.length,
			afterCursor.indexOf('?') !== -1 ? afterCursor.indexOf('?') + cursor.ch + 1 : line.length
		);

		const sentence = line.substring(sentenceStart, sentenceEnd).trim();
		
		// If sentence is too short, try to select paragraph
		if (sentence.length < 10) {
			return this.selectParagraph(editor, cursor.line);
		}

		return sentence;
	}

	private selectParagraph(editor: Editor, lineNumber: number): string {
		const totalLines = editor.lineCount();
		let startLine = lineNumber;
		let endLine = lineNumber;

		// Find paragraph start
		while (startLine > 0 && editor.getLine(startLine - 1).trim() !== '') {
			startLine--;
		}

		// Find paragraph end
		while (endLine < totalLines - 1 && editor.getLine(endLine + 1).trim() !== '') {
			endLine++;
		}

		const paragraphLines = [];
		for (let i = startLine; i <= endLine; i++) {
			paragraphLines.push(editor.getLine(i));
		}

		return paragraphLines.join('\n').trim();
	}

	public showFloatingButton(onRewrite: () => void) {
		if (this.platformDetector.isMobile()) {
			this.floatingButton.show(onRewrite);
		}
	}

	public hideFloatingButton() {
		this.floatingButton.hide();
	}

	// Selection change handler for mobile
	public handleSelectionChange(editor: Editor) {
		if (!this.platformDetector.isMobile()) return;

		const selectedText = editor.getSelection();
		
		if (selectedText && selectedText.trim().length > 5) {
			// Show floating button when text is selected on mobile
			this.showFloatingButton(() => {
				this.showMobileStyleSelector(editor, selectedText);
			});
		} else {
			this.hideFloatingButton();
		}
	}

	// Touch event handlers
	public registerTouchEvents() {
		if (!this.platformDetector.isMobile()) return;

		// Long press detection for quick rewrite
		let longPressTimer: NodeJS.Timeout;
		
		document.addEventListener('touchstart', (e) => {
			longPressTimer = setTimeout(() => {
				// Check if we're in an editor
				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (activeView && activeView.editor.getSelection()) {
					this.showFloatingButton(() => {
						this.showMobileStyleSelector(activeView.editor);
					});
				}
			}, 800); // 800ms long press
		});

		document.addEventListener('touchend', () => {
			if (longPressTimer) {
				clearTimeout(longPressTimer);
			}
		});

		document.addEventListener('touchmove', () => {
			if (longPressTimer) {
				clearTimeout(longPressTimer);
			}
		});
	}
}