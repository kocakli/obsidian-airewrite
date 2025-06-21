export const SUPPORTED_LANGUAGES = {
	'english': 'English',
	'turkish': 'Türkçe',
	'spanish': 'Español',
	'french': 'Français',
	'german': 'Deutsch',
	'italian': 'Italiano',
	'portuguese': 'Português',
	'russian': 'Русский',
	'chinese': '中文',
	'japanese': '日本語',
	'korean': '한국어',
	'arabic': 'العربية',
	'hindi': 'हिन्दी',
	'dutch': 'Nederlands',
	'swedish': 'Svenska',
	'norwegian': 'Norsk',
	'danish': 'Dansk',
	'polish': 'Polski',
	'czech': 'Čeština',
	'hungarian': 'Magyar',
	'romanian': 'Română',
	'bulgarian': 'Български',
	'greek': 'Ελληνικά',
	'hebrew': 'עברית',
	'finnish': 'Suomi',
	'estonian': 'Eesti',
	'latvian': 'Latviešu',
	'lithuanian': 'Lietuvių',
	'slovenian': 'Slovenščina',
	'slovak': 'Slovenčina',
	'croatian': 'Hrvatski',
	'serbian': 'Српски',
	'bosnian': 'Bosanski',
	'montenegrin': 'Crnogorski',
	'albanian': 'Shqip',
	'macedonian': 'Македонски',
	'thai': 'ไทย',
	'vietnamese': 'Tiếng Việt',
	'indonesian': 'Bahasa Indonesia',
	'malay': 'Bahasa Melayu',
	'filipino': 'Filipino',
	'swahili': 'Kiswahili',
	'afrikaans': 'Afrikaans',
	'custom': 'Custom Language'
};

export const LANGUAGE_FAMILIES = {
	'Germanic': ['english', 'german', 'dutch', 'swedish', 'norwegian', 'danish', 'afrikaans'],
	'Romance': ['spanish', 'french', 'italian', 'portuguese', 'romanian'],
	'Slavic': ['russian', 'polish', 'czech', 'hungarian', 'bulgarian', 'serbian', 'croatian', 'bosnian', 'slovenian', 'slovak', 'montenegrin', 'macedonian'],
	'Turkic': ['turkish'],
	'Sino-Tibetan': ['chinese'],
	'Japonic': ['japanese'],
	'Koreanic': ['korean'],
	'Semitic': ['arabic', 'hebrew'],
	'Indo-Aryan': ['hindi'],
	'Finno-Ugric': ['finnish', 'estonian', 'hungarian'],
	'Baltic': ['latvian', 'lithuanian'],
	'Hellenic': ['greek'],
	'Albanian': ['albanian'],
	'Tai-Kadai': ['thai'],
	'Austroasiatic': ['vietnamese'],
	'Austronesian': ['indonesian', 'malay', 'filipino'],
	'Niger-Congo': ['swahili']
};

export interface LanguageRewriteSettings {
	enabled: boolean;
	targetLanguage: string;
	customLanguage?: string;
	preserveFormatting: boolean;
	culturalAdaptation: boolean;
}

export function getLanguageDisplayName(code: string): string {
	return SUPPORTED_LANGUAGES[code as keyof typeof SUPPORTED_LANGUAGES] || code;
}

export function getLanguageFamily(languageCode: string): string | null {
	for (const [family, languages] of Object.entries(LANGUAGE_FAMILIES)) {
		if (languages.includes(languageCode)) {
			return family;
		}
	}
	return null;
}

export function getTargetLanguageName(settings: LanguageRewriteSettings): string {
	if (!settings.enabled) return '';
	
	if (settings.targetLanguage === 'custom') {
		return settings.customLanguage || 'Custom Language';
	}
	
	return getLanguageDisplayName(settings.targetLanguage);
}

export function getLanguageModeIndicator(settings: LanguageRewriteSettings): string {
	if (!settings.enabled) return '';
	
	const targetLang = getTargetLanguageName(settings);
	return `🌍 → ${targetLang}`;
}

export function getSuggestedLanguages(): string[] {
	// Most commonly used languages for content creation
	return [
		'english',
		'spanish', 
		'french',
		'german',
		'italian',
		'portuguese',
		'russian',
		'chinese',
		'japanese',
		'korean',
		'arabic',
		'hindi',
		'turkish'
	];
}

export function getLanguagePromptAddition(settings: LanguageRewriteSettings): string {
	if (!settings.enabled) return '';
	
	const targetLang = getTargetLanguageName(settings);
	let prompt = `\n\nIMPORTANT: Rewrite the text in ${targetLang}. Maintain the original meaning and tone while translating accurately.`;
	
	if (settings.culturalAdaptation) {
		prompt += ' Adapt cultural references and expressions appropriately for the target language and culture.';
	}
	
	if (settings.preserveFormatting) {
		prompt += ' Preserve all formatting, including markdown syntax, lists, headers, and links.';
	}
	
	// Add language-specific instructions
	const family = getLanguageFamily(settings.targetLanguage);
	if (family) {
		switch (family) {
			case 'Sino-Tibetan':
				prompt += ' Use appropriate honorifics and formal language structure.';
				break;
			case 'Japonic':
				prompt += ' Use appropriate keigo (honorific language) when the context requires formality.';
				break;
			case 'Semitic':
				prompt += ' Ensure proper right-to-left text flow and cultural sensitivity.';
				break;
			case 'Turkic':
				prompt += ' Use appropriate formal/informal language based on context.';
				break;
		}
	}
	
	return prompt;
}