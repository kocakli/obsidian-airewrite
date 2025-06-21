import { App, PluginSettingTab, Setting, Notice, setIcon } from 'obsidian';
import { AIRewriteSettings, GeminiModel, SupportedLanguage } from './types';
import { DEFAULT_SYSTEM_PROMPT } from './prompts';
import { getTranslation, translations } from './i18n';
import { SecurityEducationManager } from './security-education';
import { SUPPORTED_LANGUAGES, getSuggestedLanguages, getLanguageDisplayName } from './language-config';
import AIRewritePlugin from '../main';

export const DEFAULT_SETTINGS: AIRewriteSettings = {
	apiKey: '',
	model: GeminiModel.FLASH,
	systemPrompt: DEFAULT_SYSTEM_PROMPT,
	temperature: 0.7,
	maxTokens: 2048,
	securityEducationShown: false,
	mobileSecurityAcknowledged: false,
	languageRewrite: {
		enabled: false,
		targetLanguage: 'english',
		customLanguage: '',
		preserveFormatting: true,
		culturalAdaptation: false
	}
};

export class AIRewriteSettingsTab extends PluginSettingTab {
	plugin: AIRewritePlugin;
	private securityManager: SecurityEducationManager;

	constructor(app: App, plugin: AIRewritePlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.securityManager = new SecurityEducationManager(
			app,
			plugin.platformDetector,
			plugin.settings,
			plugin.saveSettings.bind(plugin)
		);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const t = getTranslation();
		containerEl.createEl('h2', { text: t.settingsTitle });

		// Security Status section
		const securitySection = containerEl.createDiv('security-section');
		securitySection.createEl('h3', { text: '🛡️ Security Status' });
		
		const securityStatusContainer = securitySection.createDiv('security-status-container');
		const securityStatusText = securityStatusContainer.createEl('span', {
			text: this.securityManager.getSecurityStatusText(),
			cls: 'security-status-text'
		});
		securityStatusText.style.color = this.securityManager.getSecurityStatusColor();
		
		// Security actions
		const securityActions = securitySection.createDiv('security-actions');
		
		const securityTipsButton = securityActions.createEl('button', {
			text: '📖 Security Tips',
			cls: 'mod-cta'
		});
		securityTipsButton.addEventListener('click', () => {
			this.securityManager.showSecurityTipsModal();
		});
		
		const securityCheckButton = securityActions.createEl('button', {
			text: '🔍 Security Check',
			cls: 'mod-muted'
		});
		securityCheckButton.addEventListener('click', () => {
			this.securityManager.showQuickSecurityCheck();
		});

		// API Key setting with enhanced security
		const apiKeySetting = new Setting(containerEl)
			.setName(t.apiKeyLabel)
			.setDesc(t.apiKeyDesc + ' • ' + this.securityManager.getApiKeyStorageInfo())
			.addText(text => {
				text
					.setPlaceholder('API Key')
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						const wasEmpty = !this.plugin.settings.apiKey;
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
						this.plugin.updateGeminiClient();
						
						// Show security education on first API key entry
						if (wasEmpty && value) {
							await this.securityManager.onFirstApiKeyEntry();
						}
						
						// Update security status display
						this.refreshSecurityStatus();
					});
				text.inputEl.type = 'password';
			})
			.addButton(button => {
				button
					.setButtonText(t.testApiKey)
					.setTooltip(t.testApiKey)
					.onClick(async () => {
						if (!this.plugin.settings.apiKey) {
							new Notice(t.configureApiKey);
							return;
						}

						const testing = t.processing;
						button.setButtonText(testing);
						button.setDisabled(true);

						const isValid = await this.plugin.geminiClient.validateApiKey();
						
						if (isValid) {
							const successMsg = getTranslation();
							new Notice('✅ ' + (successMsg === translations[SupportedLanguage.TURKISH] ? 'API anahtarı geçerli!' : 'API key valid!'));
							this.refreshSecurityStatus();
						} else {
							new Notice('❌ ' + t.invalidApiKey);
						}

						button.setButtonText(t.testApiKey);
						button.setDisabled(false);
					});
			});
			
		// Add security help icon
		const securityHelpIcon = apiKeySetting.controlEl.createEl('span', {
			cls: 'security-help-icon'
		});
		setIcon(securityHelpIcon, 'shield');
		securityHelpIcon.setAttribute('title', 'Click for security information');
		securityHelpIcon.addEventListener('click', () => {
			this.securityManager.showSecurityTipsModal();
		});

		// Model selection
		new Setting(containerEl)
			.setName(t.modelLabel)
			.setDesc(t.modelDesc)
			.addDropdown(dropdown => {
				dropdown
					.addOption(GeminiModel.FLASH, 'Gemini 2.5 Flash (Recommended)')
					.addOption(GeminiModel.FLASH_LITE, t.geminiFlashLite)
					.addOption(GeminiModel.PRO, t.geminiPro)
					.setValue(this.plugin.settings.model)
					.onChange(async (value: string) => {
						this.plugin.settings.model = value as GeminiModel;
						await this.plugin.saveSettings();
						this.plugin.updateGeminiClient();
					});
			});

		// System prompt setting
		new Setting(containerEl)
			.setName(t.systemPromptLabel)
			.setDesc(t.systemPromptDesc)
			.addTextArea(text => {
				text
					.setPlaceholder(DEFAULT_SYSTEM_PROMPT)
					.setValue(this.plugin.settings.systemPrompt)
					.onChange(async (value) => {
						this.plugin.settings.systemPrompt = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 4;
				text.inputEl.style.width = '100%';
			})
			.addButton(button => {
				button
					.setButtonText(t.resetToDefault)
					.setTooltip(t.resetToDefault)
					.onClick(async () => {
						this.plugin.settings.systemPrompt = DEFAULT_SYSTEM_PROMPT;
						await this.plugin.saveSettings();
						this.display();
					});
			});

		// Temperature setting
		new Setting(containerEl)
			.setName(t.temperatureLabel)
			.setDesc(t.temperatureDesc)
			.addSlider(slider => {
				slider
					.setLimits(0, 1, 0.1)
					.setValue(this.plugin.settings.temperature)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.temperature = value;
						await this.plugin.saveSettings();
					});
			});

		// Max tokens setting
		new Setting(containerEl)
			.setName(t.maxTokensLabel)
			.setDesc(t.maxTokensDesc)
			.addSlider(slider => {
				slider
					.setLimits(512, 8192, 256)
					.setValue(this.plugin.settings.maxTokens)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.maxTokens = value;
						await this.plugin.saveSettings();
					});
			});

		// Language Rewrite Settings
		this.renderLanguageSettings(containerEl);

		// Info section
		const currentLang = getTranslation();
		const isTurkish = currentLang === translations[SupportedLanguage.TURKISH];
		const instructions = isTurkish ? `
			<h3>📝 Kullanım Talimatları:</h3>
			<ol>
				<li>Yeniden yazmak istediğiniz metni seçin</li>
				<li>Komut paletini açın (Ctrl/Cmd + P)</li>
				<li>"AIRewrite" komutlarından birini seçin</li>
			</ol>
			<p><strong>💡 İpucu:</strong> Daha iyi sonuçlar için sistem promptunu ihtiyacınıza göre özelleştirin.</p>
		` : `
			<h3>📝 Usage Instructions:</h3>
			<ol>
				<li>Select the text you want to rewrite</li>
				<li>Open command palette (Ctrl/Cmd + P)</li>
				<li>Choose one of the "AIRewrite" commands</li>
			</ol>
			<p><strong>💡 Tip:</strong> Customize the system prompt to get better results for your needs.</p>
		`;

		containerEl.createEl('div', { cls: 'setting-item-description' }, (el) => {
			el.innerHTML = instructions;
		});
	}

	private refreshSecurityStatus(): void {
		// Update security status display
		const securityStatusText = this.containerEl.querySelector('.security-status-text') as HTMLElement;
		if (securityStatusText) {
			securityStatusText.textContent = this.securityManager.getSecurityStatusText();
			securityStatusText.style.color = this.securityManager.getSecurityStatusColor();
		}
	}

	private renderLanguageSettings(containerEl: HTMLElement): void {
		const languageSection = containerEl.createDiv({cls: 'airewrite-language-section'});
		
		// Section header
		languageSection.createEl('h3', { text: '🌍 Multi-Language Rewrite' });
		
		// Feature toggle
		const toggleSetting = new Setting(languageSection)
			.setName('Enable Multi-Language Rewrite')
			.setDesc('Rewrite content in different languages while preserving meaning and context')
			.addToggle(toggle => 
				toggle
					.setValue(this.plugin.settings.languageRewrite.enabled)
					.onChange(async (value) => {
						this.plugin.settings.languageRewrite.enabled = value;
						await this.plugin.saveSettings();
						this.plugin.promptManager?.updateSettings(this.plugin.settings);
						this.display(); // Refresh UI to show/hide language options
					})
			);

		// Language dropdown (only show if enabled)
		if (this.plugin.settings.languageRewrite.enabled) {
			new Setting(languageSection)
				.setName('Target Language')
				.setDesc('Select the language for rewriting content')
				.addDropdown(dropdown => {
					// Add mobile-friendly classes
					dropdown.selectEl.addClass('airewrite-mobile-dropdown');
					dropdown.selectEl.addClass('airewrite-clean-background');
					
					// Override any inherited styles
					dropdown.selectEl.style.background = 'var(--background-primary)';
					dropdown.selectEl.style.backgroundImage = 'none';
					
					// Add suggested languages first
					const suggestedLangs = getSuggestedLanguages();
					suggestedLangs.forEach(code => {
						dropdown.addOption(code, `⭐ ${getLanguageDisplayName(code)}`);
					});
					
					// Add separator
					dropdown.addOption('', '─────────────');
					
					// Add all other languages
					Object.entries(SUPPORTED_LANGUAGES).forEach(([code, name]) => {
						if (!suggestedLangs.includes(code) && code !== 'custom') {
							dropdown.addOption(code, name);
						}
					});
					
					// Add custom option at the end
					dropdown.addOption('custom', '🔧 Custom Language');
					
					dropdown
						.setValue(this.plugin.settings.languageRewrite.targetLanguage)
						.onChange(async (value) => {
							if (value === '') return; // Skip separator
							this.plugin.settings.languageRewrite.targetLanguage = value;
							await this.plugin.saveSettings();
							this.plugin.promptManager?.updateSettings(this.plugin.settings);
							this.display(); // Refresh for custom input
						});
				});

			// Custom language input (only show if "custom" is selected)
			if (this.plugin.settings.languageRewrite.targetLanguage === 'custom') {
				new Setting(languageSection)
					.setName('Custom Language')
					.setDesc('Enter any language name (e.g., Esperanto, Latin, Old English)')
					.addText(text =>
						text
							.setPlaceholder('Enter language name...')
							.setValue(this.plugin.settings.languageRewrite.customLanguage || '')
							.onChange(async (value) => {
								this.plugin.settings.languageRewrite.customLanguage = value;
								await this.plugin.saveSettings();
								this.plugin.promptManager?.updateSettings(this.plugin.settings);
							}));
			}

			// Advanced options
			new Setting(languageSection)
				.setName('Preserve Formatting')
				.setDesc('Keep markdown formatting, lists, headers, and links intact during translation')
				.addToggle(toggle =>
					toggle
						.setValue(this.plugin.settings.languageRewrite.preserveFormatting)
						.onChange(async (value) => {
							this.plugin.settings.languageRewrite.preserveFormatting = value;
							await this.plugin.saveSettings();
							this.plugin.promptManager?.updateSettings(this.plugin.settings);
						})
				);

			new Setting(languageSection)
				.setName('Cultural Adaptation')
				.setDesc('Adapt cultural references and expressions for the target language and culture')
				.addToggle(toggle =>
					toggle
						.setValue(this.plugin.settings.languageRewrite.culturalAdaptation)
						.onChange(async (value) => {
							this.plugin.settings.languageRewrite.culturalAdaptation = value;
							await this.plugin.saveSettings();
							this.plugin.promptManager?.updateSettings(this.plugin.settings);
						})
				);

			// Language preview
			const currentTarget = this.plugin.settings.languageRewrite.targetLanguage === 'custom' 
				? this.plugin.settings.languageRewrite.customLanguage || 'Custom Language'
				: getLanguageDisplayName(this.plugin.settings.languageRewrite.targetLanguage);
				
			const previewEl = languageSection.createDiv({cls: 'language-preview'});
			previewEl.innerHTML = `
				<div class="language-preview-box">
					<strong>🎯 Current Target:</strong> ${currentTarget}
					<br>
					<span class="language-preview-note">All rewrite commands will output in this language</span>
				</div>
			`;
		}
	}
}