import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import { AIRewriteSettings, GeminiModel, SupportedLanguage } from './types';
import { DEFAULT_SYSTEM_PROMPT } from './prompts';
import { getTranslation, translations } from './i18n';
import AIRewritePlugin from '../main';

export const DEFAULT_SETTINGS: AIRewriteSettings = {
	apiKey: '',
	model: GeminiModel.FLASH,
	systemPrompt: DEFAULT_SYSTEM_PROMPT,
	temperature: 0.7,
	maxTokens: 2048
};

export class AIRewriteSettingsTab extends PluginSettingTab {
	plugin: AIRewritePlugin;

	constructor(app: App, plugin: AIRewritePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const t = getTranslation();
		containerEl.createEl('h2', { text: t.settingsTitle });

		// API Key setting
		new Setting(containerEl)
			.setName(t.apiKeyLabel)
			.setDesc(t.apiKeyDesc)
			.addText(text => {
				text
					.setPlaceholder('API Key')
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
						this.plugin.updateGeminiClient();
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
						} else {
							new Notice('❌ ' + t.invalidApiKey);
						}

						button.setButtonText(t.testApiKey);
						button.setDisabled(false);
					});
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
}