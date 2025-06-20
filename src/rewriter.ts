import { Editor, MarkdownView, Notice } from 'obsidian';
import { GeminiClient } from './gemini-client';
import { RewriteOptions, WritingStyle, GeminiResponse } from './types';

export interface RewriteResult {
	originalText: string;
	rewrittenText: string;
	success: boolean;
	error?: string;
	position?: {
		from: number;
		to: number;
	};
}

export enum RewriteStrategy {
	REPLACE = 'replace',
	APPEND = 'append',
	PREVIEW = 'preview'
}

export class RewriteEngine {
	private geminiClient: GeminiClient;
	private progressCallback?: (progress: number, status: string) => void;

	constructor(geminiClient: GeminiClient) {
		this.geminiClient = geminiClient;
	}

	setProgressCallback(callback: (progress: number, status: string) => void) {
		this.progressCallback = callback;
	}

	async rewriteSelectedText(
		editor: Editor, 
		view: MarkdownView, 
		options: {
			style?: WritingStyle;
			customPrompt?: string;
			strategy?: RewriteStrategy;
		} = {}
	): Promise<RewriteResult> {
		const selectedText = editor.getSelection();
		
		if (!selectedText.trim()) {
			return {
				originalText: '',
				rewrittenText: '',
				success: false,
				error: 'Lütfen yeniden yazmak istediğiniz metni seçin'
			};
		}

		return await this.rewriteText(selectedText, editor, options);
	}

	async rewriteEntireNote(
		editor: Editor, 
		view: MarkdownView, 
		options: {
			style?: WritingStyle;
			customPrompt?: string;
			strategy?: RewriteStrategy;
		} = {}
	): Promise<RewriteResult> {
		const entireText = editor.getValue();
		
		if (!entireText.trim()) {
			return {
				originalText: '',
				rewrittenText: '',
				success: false,
				error: 'Not boş, yeniden yazılacak içerik yok'
			};
		}

		return await this.rewriteText(entireText, editor, options);
	}

	private async rewriteText(
		text: string, 
		editor: Editor, 
		options: {
			style?: WritingStyle;
			customPrompt?: string;
			strategy?: RewriteStrategy;
		}
	): Promise<RewriteResult> {
		if (!this.geminiClient.isConfigured()) {
			return {
				originalText: text,
				rewrittenText: '',
				success: false,
				error: 'API anahtarı ayarlanmamış. Lütfen ayarlar sekmesinden API anahtarınızı girin.'
			};
		}

		this.updateProgress(10, 'Gemini API ile bağlantı kuruluyor...');

		const rewriteOptions: RewriteOptions = {
			text: text,
			style: options.style,
			customPrompt: options.customPrompt
		};

		this.updateProgress(30, 'Metin analiz ediliyor...');

		try {
			const response: GeminiResponse = await this.geminiClient.rewriteText(rewriteOptions);
			
			this.updateProgress(80, 'Sonuç işleniyor...');

			if (!response.success) {
				return {
					originalText: text,
					rewrittenText: '',
					success: false,
					error: response.error
				};
			}

			this.updateProgress(100, 'Tamamlandı!');

			// Get cursor position for replacement
			const cursor = editor.getCursor();
			const selection = editor.getSelection();
			let position;
			
			if (selection) {
				const selections = editor.listSelections();
				if (selections.length > 0) {
					position = {
						from: editor.posToOffset(selections[0].anchor),
						to: editor.posToOffset(selections[0].head)
					};
				}
			}

			return {
				originalText: text,
				rewrittenText: response.text,
				success: true,
				position: position
			};

		} catch (error: any) {
			this.updateProgress(0, 'Hata oluştu');
			return {
				originalText: text,
				rewrittenText: '',
				success: false,
				error: `Beklenmeyen hata: ${error.message || 'Bilinmeyen hata'}`
			};
		}
	}

	async executeRewriteStrategy(
		result: RewriteResult, 
		editor: Editor, 
		strategy: RewriteStrategy = RewriteStrategy.PREVIEW
	): Promise<void> {
		if (!result.success) {
			new Notice(`❌ ${result.error}`);
			return;
		}

		switch (strategy) {
			case RewriteStrategy.REPLACE:
				this.replaceText(editor, result);
				break;
			
			case RewriteStrategy.APPEND:
				this.appendText(editor, result);
				break;
			
			case RewriteStrategy.PREVIEW:
				// Preview will be handled by modal
				break;
		}
	}

	private replaceText(editor: Editor, result: RewriteResult): void {
		const selection = editor.getSelection();
		
		if (selection && result.position) {
			editor.replaceSelection(result.rewrittenText);
		} else {
			// If no selection, replace entire content
			editor.setValue(result.rewrittenText);
		}
		
		new Notice('✅ Metin başarıyla yeniden yazıldı!');
	}

	private appendText(editor: Editor, result: RewriteResult): void {
		const currentContent = editor.getValue();
		const separator = '\n\n### 🤖 Geminified Version\n\n';
		const newContent = currentContent + separator + result.rewrittenText;
		
		editor.setValue(newContent);
		
		// Move cursor to the end
		const lastLine = editor.lastLine();
		editor.setCursor(lastLine, editor.getLine(lastLine).length);
		
		new Notice('✅ Yeniden yazılan metin note sonuna eklendi!');
	}

	private updateProgress(progress: number, status: string): void {
		if (this.progressCallback) {
			this.progressCallback(progress, status);
		}
	}

	public detectTextContext(editor: Editor): {
		hasSelection: boolean;
		selectedText: string;
		totalLength: number;
		selectionLength: number;
	} {
		const selectedText = editor.getSelection();
		const totalText = editor.getValue();
		
		return {
			hasSelection: selectedText.length > 0,
			selectedText: selectedText,
			totalLength: totalText.length,
			selectionLength: selectedText.length
		};
	}

	public estimateTokens(text: string): number {
		// Rough estimation: 1 token ≈ 4 characters for Turkish
		return Math.ceil(text.length / 4);
	}

	public validateTextLength(text: string, maxTokens: number = 2048): boolean {
		const estimatedTokens = this.estimateTokens(text);
		return estimatedTokens <= maxTokens;
	}
}