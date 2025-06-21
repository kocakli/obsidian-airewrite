import { AIRewriteSettings, WritingStyle } from './types';
import { getLanguagePromptAddition, getLanguageModeIndicator, getTargetLanguageName } from './language-config';
import { DEFAULT_SYSTEM_PROMPT } from './prompts';

export class DynamicPromptManager {
	private originalPrompts: Map<string, string> = new Map();
	private settings: AIRewriteSettings;

	constructor(settings: AIRewriteSettings) {
		this.settings = settings;
		this.saveOriginalPrompts();
	}

	updateSettings(settings: AIRewriteSettings): void {
		this.settings = settings;
	}

	generateSystemPrompt(style?: WritingStyle): string {
		let basePrompt = this.getPromptByStyle(style);
		
		// Add language rewrite instructions if enabled
		if (this.settings.languageRewrite.enabled) {
			const languageAddition = getLanguagePromptAddition(this.settings.languageRewrite);
			basePrompt += languageAddition;
		}

		return basePrompt;
	}

	private getPromptByStyle(style?: WritingStyle): string {
		if (!style) {
			return this.settings.systemPrompt || DEFAULT_SYSTEM_PROMPT;
		}

		// Return style-specific prompts
		switch (style) {
			case WritingStyle.PROFESSIONAL:
				return 'You are a professional writing assistant. Rewrite the text in a formal, business-appropriate style. Use clear, concise language and maintain a professional tone throughout.';
			
			case WritingStyle.ACADEMIC:
				return 'You are an academic writing assistant. Rewrite the text in a scholarly style appropriate for academic papers. Use formal language, proper citations format, and objective tone.';
			
			case WritingStyle.CASUAL:
				return 'You are a casual writing assistant. Rewrite the text in a friendly, conversational style. Use simple language and a relaxed tone as if talking to a friend.';
			
			case WritingStyle.BLOG:
				return 'You are a blog writing assistant. Rewrite the text in an engaging, readable style suitable for online content. Use active voice, compelling headlines, and reader-friendly formatting.';
			
			case WritingStyle.TECHNICAL:
				return 'You are a technical writing assistant. Rewrite the text with precision and clarity. Use specific terminology, step-by-step explanations, and maintain accuracy in technical details.';
			
			case WritingStyle.CREATIVE:
				return 'You are a creative writing assistant. Rewrite the text with vivid imagery, engaging narrative, and compelling storytelling elements. Feel free to use metaphors and creative language.';
			
			case WritingStyle.BUSINESS:
				return 'You are a business writing assistant. Rewrite the text for business communication. Be direct, action-oriented, and focus on results and outcomes.';
			
			case WritingStyle.SIMPLE:
				return 'You are a simple writing assistant. Rewrite the text using the simplest language possible. Break down complex ideas into easy-to-understand concepts.';
			
			default:
				return this.settings.systemPrompt || DEFAULT_SYSTEM_PROMPT;
		}
	}

	private saveOriginalPrompts(): void {
		// Save original prompts for each style
		Object.values(WritingStyle).forEach(style => {
			const originalPrompt = this.getPromptByStyle(style);
			this.originalPrompts.set(style, originalPrompt);
		});
		
		// Save base system prompt
		this.originalPrompts.set('system', this.settings.systemPrompt || DEFAULT_SYSTEM_PROMPT);
	}

	enableLanguageMode(): void {
		// Language mode is handled dynamically in generateSystemPrompt
		// This method can be used for any setup needed when enabling language mode
	}

	disableLanguageMode(): void {
		// Language mode is handled dynamically in generateSystemPrompt
		// This method can be used for any cleanup needed when disabling language mode
	}

	restoreOriginalPrompt(style?: WritingStyle): string {
		const key = style || 'system';
		return this.originalPrompts.get(key) || DEFAULT_SYSTEM_PROMPT;
	}

	getLanguageIndicator(): string {
		return getLanguageModeIndicator(this.settings.languageRewrite);
	}

	getTargetLanguageName(): string {
		return getTargetLanguageName(this.settings.languageRewrite);
	}

	isLanguageModeEnabled(): boolean {
		return this.settings.languageRewrite.enabled;
	}

	// Helper method to get language-aware command names
	getCommandName(baseName: string): string {
		if (!this.settings.languageRewrite.enabled) {
			return baseName;
		}

		const targetLang = this.getTargetLanguageName();
		return `${baseName} → ${targetLang}`;
	}

	// Helper method to get preview modal title
	getPreviewTitle(baseTitle: string = 'AIRewrite Preview'): string {
		const indicator = this.getLanguageIndicator();
		return indicator ? `${baseTitle} ${indicator}` : baseTitle;
	}

	// Helper method to generate user prompt for rewriting
	generateUserPrompt(originalText: string, style?: WritingStyle, customInstructions?: string): string {
		let prompt = `Please rewrite the following text:\n\n${originalText}`;
		
		if (style) {
			prompt += `\n\nStyle: ${style}`;
		}
		
		if (customInstructions) {
			prompt += `\n\nAdditional instructions: ${customInstructions}`;
		}
		
		return prompt;
	}

	// Helper method to validate language settings
	validateLanguageSettings(): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];
		
		if (this.settings.languageRewrite.enabled) {
			if (!this.settings.languageRewrite.targetLanguage) {
				errors.push('Target language is required when language rewrite is enabled');
			}
			
			if (this.settings.languageRewrite.targetLanguage === 'custom' && 
			    !this.settings.languageRewrite.customLanguage?.trim()) {
				errors.push('Custom language name is required when "Custom Language" is selected');
			}
		}
		
		return {
			isValid: errors.length === 0,
			errors
		};
	}
}