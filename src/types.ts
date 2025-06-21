export interface AIRewriteSettings {
	apiKey: string;
	model: string;
	systemPrompt: string;
	temperature: number;
	maxTokens: number;
	securityEducationShown: boolean;
	mobileSecurityAcknowledged: boolean;
	languageRewrite: {
		enabled: boolean;
		targetLanguage: string;
		customLanguage?: string;
		preserveFormatting: boolean;
		culturalAdaptation: boolean;
	};
}

export interface GeminiResponse {
	text: string;
	success: boolean;
	error?: string;
}

export interface RewriteOptions {
	text: string;
	style?: WritingStyle;
	customPrompt?: string;
}

export enum WritingStyle {
	PROFESSIONAL = 'professional',
	ACADEMIC = 'academic',
	CASUAL = 'casual',
	BLOG = 'blog',
	TECHNICAL = 'technical',
	CREATIVE = 'creative',
	BUSINESS = 'business',
	SIMPLE = 'simple'
}

export enum GeminiModel {
	FLASH = 'gemini-2.5-flash',
	FLASH_LITE = 'gemini-2.5-flash-lite-preview-06-17',
	PRO = 'gemini-2.5-pro'
}

export enum SupportedLanguage {
	TURKISH = 'tr',
	ENGLISH = 'en'
}