import { SupportedLanguage } from './types';

export interface LanguageStrings {
	// Plugin name and descriptions
	pluginName: string;
	pluginDescription: string;
	
	// Commands
	rewriteSelectedText: string;
	rewriteEntireNote: string;
	quickRewrite: string;
	rewriteWithStyle: string;
	appendRewrite: string;
	
	// Settings
	settingsTitle: string;
	apiKeyLabel: string;
	apiKeyDesc: string;
	testApiKey: string;
	modelLabel: string;
	modelDesc: string;
	systemPromptLabel: string;
	systemPromptDesc: string;
	temperatureLabel: string;
	temperatureDesc: string;
	maxTokensLabel: string;
	maxTokensDesc: string;
	languageLabel: string;
	languageDesc: string;
	resetToDefault: string;
	usageInstructions: string;
	
	// Models
	geminiFlashLite: string;
	geminiPro: string;
	
	// Writing styles
	defaultStyle: string;
	professionalStyle: string;
	academicStyle: string;
	casualStyle: string;
	blogStyle: string;
	technicalStyle: string;
	creativeStyle: string;
	
	// Style descriptions
	defaultStyleDesc: string;
	professionalStyleDesc: string;
	academicStyleDesc: string;
	casualStyleDesc: string;
	blogStyleDesc: string;
	technicalStyleDesc: string;
	creativeStyleDesc: string;
	
	// Modals
	progressTitle: string;
	previewTitle: string;
	styleSelectTitle: string;
	styleSelectDesc: string;
	errorTitle: string;
	originalText: string;
	rewrittenText: string;
	accept: string;
	reject: string;
	cancel: string;
	
	// Status messages
	processing: string;
	ready: string;
	error: string;
	
	// Notifications
	selectTextFirst: string;
	configureApiKey: string;
	emptyTextError: string;
	textTooLong: string;
	processingInProgress: string;
	rewriteSuccess: string;
	appendSuccess: string;
	changesRejected: string;
	
	// Errors
	invalidApiKey: string;
	quotaExceeded: string;
	rateLimitExceeded: string;
	networkError: string;
	safetyError: string;
	timeoutError: string;
	unknownError: string;
}

const turkishStrings: LanguageStrings = {
	// Plugin name and descriptions
	pluginName: 'AIRewrite',
	pluginDescription: 'Notlarınızı Google Gemini AI ile dönüştürün - anında yeniden yazın, geliştirin ve iyileştirin',
	
	// Commands
	rewriteSelectedText: 'AIRewrite: Seçili Metni Yeniden Yaz',
	rewriteEntireNote: 'AIRewrite: Tüm Notu Yeniden Yaz',
	quickRewrite: 'AIRewrite: Hızlı Yeniden Yaz',
	rewriteWithStyle: 'AIRewrite: Stil ile Yeniden Yaz',
	appendRewrite: 'AIRewrite: Yeniden Yazılan Sürümü Ekle',
	
	// Settings
	settingsTitle: 'AIRewrite Ayarları',
	apiKeyLabel: 'Google Gemini API Anahtarı',
	apiKeyDesc: 'Google AI Studio\'dan aldığınız API anahtarını girin. Ücretsiz API anahtarı için: https://aistudio.google.com/app/apikey',
	testApiKey: 'Test Et',
	modelLabel: 'Gemini Modeli',
	modelDesc: 'Kullanılacak Gemini modelini seçin. Flash Lite daha hızlı, Pro daha kaliteli sonuçlar verir.',
	systemPromptLabel: 'Sistem Promptu',
	systemPromptDesc: 'Gemini AI\'ın nasıl davranacağını belirleyen temel talimat',
	temperatureLabel: 'Yaratıcılık Seviyesi (Temperature)',
	temperatureDesc: '0.0 (daha tutarlı) ile 1.0 (daha yaratıcı) arasında bir değer',
	maxTokensLabel: 'Maksimum Token Sayısı',
	maxTokensDesc: 'Gemini\'ın üretebileceği maksimum kelime sayısı (yaklaşık)',
	languageLabel: 'Arayüz Dili',
	languageDesc: 'Plugin arayüz dilini seçin',
	resetToDefault: 'Varsayılana Dön',
	usageInstructions: 'Kullanım Talimatları',
	
	// Models
	geminiFlashLite: 'Gemini 2.5 Flash Lite (Çok Hızlı)',
	geminiPro: 'Gemini 2.5 Pro (Yüksek Kalite)',
	
	// Writing styles
	defaultStyle: '🎯 Varsayılan',
	professionalStyle: '💼 Profesyonel',
	academicStyle: '🎓 Akademik',
	casualStyle: '😊 Günlük',
	blogStyle: '📝 Blog',
	technicalStyle: '⚙️ Teknik',
	creativeStyle: '🎨 Yaratıcı',
	
	// Style descriptions
	defaultStyleDesc: 'Genel amaçlı, açık ve anlaşılır yazım',
	professionalStyleDesc: 'İş dünyasına uygun, resmi ve etkili dil',
	academicStyleDesc: 'Bilimsel, objektif ve detaylı yaklaşım',
	casualStyleDesc: 'Samimi, rahat ve anlaşılır ton',
	blogStyleDesc: 'İlgi çekici, akıcı ve bağlantı kuran üslup',
	technicalStyleDesc: 'Açık, kesin ve adım adım anlaşılır',
	creativeStyleDesc: 'Etkileyici, özgün ve çekici anlatım',
	
	// Modals
	progressTitle: '🤖 AIRewrite Çalışıyor...',
	previewTitle: '📝 Yeniden Yazılan İçerik Önizlemesi',
	styleSelectTitle: '✍️ Yazım Stili Seçin',
	styleSelectDesc: 'Metninizi nasıl yeniden yazmak istediğinizi seçin:',
	errorTitle: '❌ Hata Oluştu',
	originalText: '📄 Orijinal Metin:',
	rewrittenText: '✨ Yeniden Yazılan Metin:',
	accept: '✅ Kabul Et',
	reject: '❌ Reddet',
	cancel: '❌ İptal',
	
	// Status messages
	processing: 'İşleniyor...',
	ready: 'AIRewrite Hazır',
	error: 'AIRewrite Hatası',
	
	// Notifications
	selectTextFirst: 'Lütfen yeniden yazmak istediğiniz metni seçin',
	configureApiKey: 'Lütfen önce API anahtarınızı ayarlar sekmesinden girin',
	emptyTextError: 'Boş metin yeniden yazılamaz',
	textTooLong: 'Metin çok uzun! (Tahmini: ${tokens} token, Limit: ${limit})',
	processingInProgress: 'Bir işlem zaten devam ediyor, lütfen bekleyin...',
	rewriteSuccess: 'Metin başarıyla yeniden yazıldı!',
	appendSuccess: 'Yeniden yazılan metin note sonuna eklendi!',
	changesRejected: 'Değişiklikler reddedildi',
	
	// Errors
	invalidApiKey: 'Geçersiz API anahtarı. Lütfen ayarlardan API anahtarınızı kontrol edin.',
	quotaExceeded: 'API kullanım limitiniz aşıldı. Lütfen daha sonra tekrar deneyin.',
	rateLimitExceeded: 'Çok fazla istek gönderildi. Lütfen bir süre bekleyin.',
	networkError: 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.',
	safetyError: 'İçerik güvenlik politikalarına uygun değil.',
	timeoutError: 'İstek zaman aşımına uğradı (30 saniye)',
	unknownError: 'Bilinmeyen hata oluştu'
};

const englishStrings: LanguageStrings = {
	// Plugin name and descriptions
	pluginName: 'AIRewrite',
	pluginDescription: 'Transform your notes with Google Gemini AI - rewrite, enhance, and improve your content instantly',
	
	// Commands
	rewriteSelectedText: 'AIRewrite: Rewrite Selected Text',
	rewriteEntireNote: 'AIRewrite: Rewrite Entire Note',
	quickRewrite: 'AIRewrite: Quick Rewrite',
	rewriteWithStyle: 'AIRewrite: Rewrite with Style',
	appendRewrite: 'AIRewrite: Append Rewritten Version',
	
	// Settings
	settingsTitle: 'AIRewrite Settings',
	apiKeyLabel: 'Google Gemini API Key',
	apiKeyDesc: 'Enter your Google Gemini API key from Google AI Studio. Get free API key: https://aistudio.google.com/app/apikey',
	testApiKey: 'Test Key',
	modelLabel: 'Gemini Model',
	modelDesc: 'Choose the Gemini model to use. Flash Lite is faster, Pro provides higher quality results.',
	systemPromptLabel: 'System Prompt',
	systemPromptDesc: 'The base instruction that determines how Gemini AI behaves',
	temperatureLabel: 'Creativity Level (Temperature)',
	temperatureDesc: 'A value between 0.0 (more consistent) and 1.0 (more creative)',
	maxTokensLabel: 'Maximum Tokens',
	maxTokensDesc: 'Maximum number of words Gemini can generate (approximate)',
	languageLabel: 'Interface Language',
	languageDesc: 'Select the plugin interface language',
	resetToDefault: 'Reset to Default',
	usageInstructions: 'Usage Instructions',
	
	// Models
	geminiFlashLite: 'Gemini 2.5 Flash Lite (Very Fast)',
	geminiPro: 'Gemini 2.5 Pro (High Quality)',
	
	// Writing styles
	defaultStyle: '🎯 Default',
	professionalStyle: '💼 Professional',
	academicStyle: '🎓 Academic',
	casualStyle: '😊 Casual',
	blogStyle: '📝 Blog',
	technicalStyle: '⚙️ Technical',
	creativeStyle: '🎨 Creative',
	
	// Style descriptions
	defaultStyleDesc: 'General purpose, clear and understandable writing',
	professionalStyleDesc: 'Business-appropriate, formal and effective language',
	academicStyleDesc: 'Scientific, objective and detailed approach',
	casualStyleDesc: 'Friendly, relaxed and understandable tone',
	blogStyleDesc: 'Engaging, flowing and connecting style',
	technicalStyleDesc: 'Clear, precise and step-by-step understandable',
	creativeStyleDesc: 'Compelling, original and engaging narrative',
	
	// Modals
	progressTitle: '🤖 AIRewrite Working...',
	previewTitle: '📝 Rewritten Content Preview',
	styleSelectTitle: '✍️ Choose Writing Style',
	styleSelectDesc: 'Select how you want to rewrite your text:',
	errorTitle: '❌ Error Occurred',
	originalText: '📄 Original Text:',
	rewrittenText: '✨ Rewritten Text:',
	accept: '✅ Accept',
	reject: '❌ Reject',
	cancel: '❌ Cancel',
	
	// Status messages
	processing: 'Processing...',
	ready: 'AIRewrite Ready',
	error: 'AIRewrite Error',
	
	// Notifications
	selectTextFirst: 'Please select the text you want to rewrite',
	configureApiKey: 'Please configure your API key in settings first',
	emptyTextError: 'Empty text cannot be rewritten',
	textTooLong: 'Text too long! (Estimated: ${tokens} tokens, Limit: ${limit})',
	processingInProgress: 'Another operation is already in progress, please wait...',
	rewriteSuccess: 'Text successfully rewritten!',
	appendSuccess: 'Rewritten text added to the end of note!',
	changesRejected: 'Changes rejected',
	
	// Errors
	invalidApiKey: 'Invalid API key. Please check your API key in settings.',
	quotaExceeded: 'API quota exceeded. Please try again later.',
	rateLimitExceeded: 'Too many requests sent. Please wait a moment.',
	networkError: 'Network connection error. Check your internet connection.',
	safetyError: 'Content does not comply with safety policies.',
	timeoutError: 'Request timed out (30 seconds)',
	unknownError: 'Unknown error occurred'
};

export const translations: Record<SupportedLanguage, LanguageStrings> = {
	[SupportedLanguage.TURKISH]: turkishStrings,
	[SupportedLanguage.ENGLISH]: englishStrings
};

export function getTranslation(language?: string): LanguageStrings {
	// Auto-detect language from Obsidian locale or system
	let detectedLang = language;
	
	if (!detectedLang) {
		// Try to get Obsidian's language setting
		try {
			// @ts-ignore - accessing Obsidian's internal moment locale
			detectedLang = (window as any).moment?.locale() || navigator.language || 'en';
		} catch {
			detectedLang = navigator.language || 'en';
		}
	}
	
	// Extract language code (e.g., 'tr-TR' -> 'tr')
	const langCode = detectedLang.toLowerCase().split('-')[0];
	
	// Return Turkish for Turkish locale, English for everything else
	if (langCode === 'tr') {
		return translations[SupportedLanguage.TURKISH];
	}
	
	return translations[SupportedLanguage.ENGLISH];
}

export function formatString(template: string, values: Record<string, string | number>): string {
	return template.replace(/\$\{(\w+)\}/g, (match, key) => {
		return values[key]?.toString() || match;
	});
}