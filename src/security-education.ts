import { App, Modal, Notice, Setting, ButtonComponent, setIcon } from 'obsidian';
import { PlatformDetector } from './platform-detector';
import { IconManager } from './icon-manager';
import { AIRewriteSettings } from './types';

export interface SecurityStatus {
	level: 'excellent' | 'good' | 'fair' | 'needs-attention';
	score: number;
	issues: string[];
	recommendations: string[];
}

export class SecurityEducationManager {
	private app: App;
	private platformDetector: PlatformDetector;
	private iconManager: IconManager;
	private settings: AIRewriteSettings;
	private saveSettings: () => Promise<void>;

	constructor(
		app: App, 
		platformDetector: PlatformDetector, 
		settings: AIRewriteSettings,
		saveSettings: () => Promise<void>
	) {
		this.app = app;
		this.platformDetector = platformDetector;
		this.iconManager = new IconManager(platformDetector);
		this.settings = settings;
		this.saveSettings = saveSettings;
	}

	async onFirstApiKeyEntry(): Promise<void> {
		// Check if this is the first time user is entering an API key
		if (!this.settings.apiKey && !this.settings.securityEducationShown) {
			await this.showWelcomeSecurityGuide();
			this.settings.securityEducationShown = true;
			await this.saveSettings();
		}
	}

	async onApiKeyChange(newApiKey: string): Promise<void> {
		// Show security tips when API key is changed
		if (newApiKey && !this.settings.securityEducationShown) {
			await this.showWelcomeSecurityGuide();
			this.settings.securityEducationShown = true;
			await this.saveSettings();
		}
	}

	async showWelcomeSecurityGuide(): Promise<void> {
		const modal = new SecurityWelcomeModal(this.app, this.platformDetector, this.iconManager);
		modal.open();
	}

	showSecurityTipsModal(): void {
		const modal = new SecurityTipsModal(this.app, this.platformDetector, this.iconManager);
		modal.open();
	}

	getSecurityStatus(): SecurityStatus {
		const issues: string[] = [];
		const recommendations: string[] = [];
		let score = 100;

		// Check API key security
		if (!this.settings.apiKey) {
			issues.push('No API key configured');
			recommendations.push('Add your Google Gemini API key to enable features');
			score -= 50;
		} else if (this.settings.apiKey.length < 20) {
			issues.push('API key appears to be invalid');
			recommendations.push('Verify your API key from Google AI Studio');
			score -= 30;
		}

		// Platform-specific security checks
		if (this.platformDetector.isMobile()) {
			if (!this.settings.mobileSecurityAcknowledged) {
				recommendations.push('Review mobile security tips');
				score -= 10;
			}
		}

		// Determine security level
		let level: SecurityStatus['level'];
		if (score >= 90) level = 'excellent';
		else if (score >= 70) level = 'good';
		else if (score >= 50) level = 'fair';
		else level = 'needs-attention';

		return {
			level,
			score,
			issues,
			recommendations
		};
	}

	getSecurityStatusText(): string {
		const status = this.getSecurityStatus();
		const icons = {
			'excellent': '🛡️ Excellent',
			'good': '✅ Good',
			'fair': '⚠️ Fair',
			'needs-attention': '🔴 Needs Attention'
		};
		return icons[status.level];
	}

	getSecurityStatusColor(): string {
		const status = this.getSecurityStatus();
		const colors = {
			'excellent': 'var(--color-green)',
			'good': 'var(--color-green)',
			'fair': 'var(--color-yellow)',
			'needs-attention': 'var(--color-red)'
		};
		return colors[status.level];
	}

	getMobileSecurityTips(): string[] {
		return [
			'🔒 Enable device lock (PIN/biometric) for protection',
			'☁️ Be careful with cloud sync - your API key syncs with your vault',
			'📱 Consider using app-specific passwords if available',
			'🔄 Rotate your API key every 3-6 months',
			'💡 Set usage quotas on Google AI Studio',
			'📋 Review API usage regularly in Google Cloud Console'
		];
	}

	getDesktopSecurityTips(): string[] {
		return [
			'🗂️ Your key is stored in vault/.obsidian/plugins/airewrite/data.json',
			'🛡️ Keep your vault secure with proper file permissions',
			'🔒 Consider vault encryption for sensitive content',
			'💾 Regular backups recommended (exclude API keys from public repos)',
			'🔄 Rotate your API key periodically',
			'💡 Set usage quotas on Google AI Studio'
		];
	}

	getApiKeyStorageInfo(): string {
		if (this.platformDetector.isMobile()) {
			return 'Your API key is stored locally in your vault and syncs with iCloud/Google Drive if vault sync is enabled.';
		} else {
			return 'Your API key is stored locally in your vault folder at .obsidian/plugins/airewrite/data.json';
		}
	}

	async showQuickSecurityCheck(): Promise<void> {
		const status = this.getSecurityStatus();
		
		if (status.issues.length === 0) {
			new Notice('🛡️ Security check passed! All good.');
		} else {
			const modal = new SecurityCheckModal(this.app, status, this.platformDetector, this.iconManager);
			modal.open();
		}
	}
}

class SecurityWelcomeModal extends Modal {
	private platformDetector: PlatformDetector;
	private iconManager: IconManager;

	constructor(app: App, platformDetector: PlatformDetector, iconManager: IconManager) {
		super(app);
		this.platformDetector = platformDetector;
		this.iconManager = iconManager;
		this.modalEl.addClass('airewrite-security-welcome-modal');
		
		if (platformDetector.isMobile()) {
			this.modalEl.addClass('airewrite-mobile-modal');
		}
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		// Header
		const header = contentEl.createDiv('security-welcome-header');
		header.createEl('h2', {
			text: '🛡️ Welcome to AIRewrite!',
			cls: 'security-welcome-title'
		});

		header.createEl('p', {
			text: 'Let\'s secure your AI experience with a quick security overview.',
			cls: 'security-welcome-subtitle'
		});

		// Platform-specific content
		const platform = this.platformDetector.isMobile() ? 'mobile' : 'desktop';
		const content = contentEl.createDiv('security-welcome-content');

		// API Key Security Section
		const apiSection = content.createDiv('security-section');
		apiSection.createEl('h3', { text: '🔑 API Key Security' });
		
		const storageInfo = apiSection.createEl('p');
		if (this.platformDetector.isMobile()) {
			storageInfo.innerHTML = `
				<strong>📱 Mobile Security:</strong><br>
				• Your API key is stored locally in your vault<br>
				• It syncs with your cloud storage (iCloud/Google Drive)<br>
				• Enable device lock for maximum protection
			`;
		} else {
			storageInfo.innerHTML = `
				<strong>💻 Desktop Security:</strong><br>
				• Your API key is stored in: <code>.obsidian/plugins/airewrite/data.json</code><br>
				• Keep your vault folder secure<br>
				• Consider vault encryption for sensitive content
			`;
		}

		// Best Practices Section
		const practicesSection = content.createDiv('security-section');
		practicesSection.createEl('h3', { text: '✅ Security Best Practices' });
		
		const practicesList = practicesSection.createEl('ul');
		const practices = this.platformDetector.isMobile() 
			? [
				'Set usage quotas on Google AI Studio',
				'Rotate API keys every 3-6 months',
				'Monitor API usage regularly',
				'Be careful with vault cloud sync settings'
			]
			: [
				'Set usage quotas on Google AI Studio',
				'Rotate API keys every 3-6 months',
				'Keep vault backups secure',
				'Use vault encryption if needed'
			];

		practices.forEach(practice => {
			const li = practicesList.createEl('li');
			li.textContent = practice;
		});

		// Privacy Section
		const privacySection = content.createDiv('security-section');
		privacySection.createEl('h3', { text: '🔒 Privacy Commitment' });
		privacySection.createEl('p', {
			text: 'AIRewrite never collects, stores, or transmits your API key. All data stays between your device and Google\'s Gemini API.'
		});

		// Action buttons
		const buttonContainer = contentEl.createDiv('security-welcome-buttons');
		
		if (this.platformDetector.isMobile()) {
			buttonContainer.addClass('airewrite-mobile-buttons');
			
			const understoodButton = buttonContainer.createEl('button', {
				text: '✅ I Understand',
				cls: 'airewrite-button-primary-mobile'
			});
			
			const tipsButton = buttonContainer.createEl('button', {
				text: '📖 More Security Tips',
				cls: 'airewrite-button-secondary-mobile'
			});

			understoodButton.addEventListener('click', () => {
				this.close();
			});

			tipsButton.addEventListener('click', () => {
				this.close();
				const tipsModal = new SecurityTipsModal(this.app, this.platformDetector, this.iconManager);
				tipsModal.open();
			});
		} else {
			const understoodButton = new ButtonComponent(buttonContainer)
				.setButtonText('I Understand')
				.setCta()
				.onClick(() => {
					this.close();
				});

			const tipsButton = new ButtonComponent(buttonContainer)
				.setButtonText('More Security Tips')
				.onClick(() => {
					this.close();
					const tipsModal = new SecurityTipsModal(this.app, this.platformDetector, this.iconManager);
					tipsModal.open();
				});
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SecurityTipsModal extends Modal {
	private platformDetector: PlatformDetector;
	private iconManager: IconManager;

	constructor(app: App, platformDetector: PlatformDetector, iconManager: IconManager) {
		super(app);
		this.platformDetector = platformDetector;
		this.iconManager = iconManager;
		this.modalEl.addClass('airewrite-security-tips-modal');
		
		if (platformDetector.isMobile()) {
			this.modalEl.addClass('airewrite-mobile-modal');
		}
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		// Header
		contentEl.createEl('h2', {
			text: '🛡️ Security Tips & Best Practices',
			cls: 'airewrite-modal-title'
		});

		// Platform-specific tips
		const tipsContainer = contentEl.createDiv('security-tips-container');
		
		if (this.platformDetector.isMobile()) {
			this.renderMobileTips(tipsContainer);
		} else {
			this.renderDesktopTips(tipsContainer);
		}

		// General tips
		this.renderGeneralTips(tipsContainer);

		// Close button
		const buttonContainer = contentEl.createDiv('security-tips-buttons');
		
		if (this.platformDetector.isMobile()) {
			const closeButton = buttonContainer.createEl('button', {
				text: '✅ Got It',
				cls: 'airewrite-button-primary-mobile'
			});
			
			closeButton.addEventListener('click', () => {
				this.close();
			});
		} else {
			const closeButton = new ButtonComponent(buttonContainer)
				.setButtonText('Got It')
				.setCta()
				.onClick(() => {
					this.close();
				});
		}
	}

	private renderMobileTips(container: HTMLElement) {
		const section = container.createDiv('security-tips-section');
		section.createEl('h3', { text: '📱 Mobile Security' });
		
		const tips = [
			'🔒 Enable device lock (PIN/Face ID/Touch ID)',
			'☁️ Be mindful of cloud sync for your vault',
			'📱 Use app-specific locks if available',
			'🔄 Consider shorter API key rotation (3 months)',
			'👁️ Monitor API usage on mobile networks'
		];

		const list = section.createEl('ul');
		tips.forEach(tip => {
			list.createEl('li').textContent = tip;
		});
	}

	private renderDesktopTips(container: HTMLElement) {
		const section = container.createDiv('security-tips-section');
		section.createEl('h3', { text: '💻 Desktop Security' });
		
		const tips = [
			'🗂️ Secure your vault folder with proper permissions',
			'🔒 Consider full-disk encryption',
			'💾 Backup your vault (exclude API keys from repos)',
			'🛡️ Use antivirus and keep OS updated',
			'🔐 Consider using a password manager'
		];

		const list = section.createEl('ul');
		tips.forEach(tip => {
			list.createEl('li').textContent = tip;
		});
	}

	private renderGeneralTips(container: HTMLElement) {
		const section = container.createDiv('security-tips-section');
		section.createEl('h3', { text: '🌐 General Best Practices' });
		
		const tips = [
			'💡 Set usage quotas on Google AI Studio',
			'🔄 Rotate API keys every 3-6 months',
			'📊 Monitor API usage and costs regularly',
			'🚫 Never share your API key publicly',
			'📧 Enable Google account 2FA',
			'🔍 Review API permissions periodically'
		];

		const list = section.createEl('ul');
		tips.forEach(tip => {
			list.createEl('li').textContent = tip;
		});

		// Links section
		const linksSection = container.createDiv('security-tips-section');
		linksSection.createEl('h3', { text: '🔗 Useful Links' });
		
		const linksList = linksSection.createEl('ul');
		const links = [
			{ text: 'Google AI Studio', url: 'https://makersuite.google.com/' },
			{ text: 'Google Cloud Console', url: 'https://console.cloud.google.com/' },
			{ text: 'API Key Best Practices', url: 'https://cloud.google.com/docs/authentication/api-keys' }
		];

		links.forEach(link => {
			const li = linksList.createEl('li');
			const a = li.createEl('a', {
				text: link.text,
				href: link.url
			});
			a.setAttribute('target', '_blank');
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SecurityCheckModal extends Modal {
	private securityStatus: SecurityStatus;
	private platformDetector: PlatformDetector;
	private iconManager: IconManager;

	constructor(
		app: App, 
		securityStatus: SecurityStatus, 
		platformDetector: PlatformDetector, 
		iconManager: IconManager
	) {
		super(app);
		this.securityStatus = securityStatus;
		this.platformDetector = platformDetector;
		this.iconManager = iconManager;
		this.modalEl.addClass('airewrite-security-check-modal');
		
		if (platformDetector.isMobile()) {
			this.modalEl.addClass('airewrite-mobile-modal');
		}
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		// Header with status
		const header = contentEl.createDiv('security-check-header');
		const statusIcons = {
			'excellent': '🛡️',
			'good': '✅',
			'fair': '⚠️',
			'needs-attention': '🔴'
		};

		header.createEl('h2', {
			text: `${statusIcons[this.securityStatus.level]} Security Status: ${this.securityStatus.level.toUpperCase()}`,
			cls: 'airewrite-modal-title'
		});

		header.createEl('p', {
			text: `Security Score: ${this.securityStatus.score}/100`,
			cls: 'security-score'
		});

		// Issues section
		if (this.securityStatus.issues.length > 0) {
			const issuesSection = contentEl.createDiv('security-issues-section');
			issuesSection.createEl('h3', { text: '⚠️ Issues Found' });
			
			const issuesList = issuesSection.createEl('ul');
			this.securityStatus.issues.forEach(issue => {
				issuesList.createEl('li').textContent = issue;
			});
		}

		// Recommendations section
		if (this.securityStatus.recommendations.length > 0) {
			const recSection = contentEl.createDiv('security-recommendations-section');
			recSection.createEl('h3', { text: '💡 Recommendations' });
			
			const recList = recSection.createEl('ul');
			this.securityStatus.recommendations.forEach(rec => {
				recList.createEl('li').textContent = rec;
			});
		}

		// Close button
		const buttonContainer = contentEl.createDiv('security-check-buttons');
		
		if (this.platformDetector.isMobile()) {
			const closeButton = buttonContainer.createEl('button', {
				text: '✅ Understood',
				cls: 'airewrite-button-primary-mobile'
			});
			
			closeButton.addEventListener('click', () => {
				this.close();
			});
		} else {
			const closeButton = new ButtonComponent(buttonContainer)
				.setButtonText('Understood')
				.setCta()
				.onClick(() => {
					this.close();
				});
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}