import { App, Modal, Setting, Notice, ButtonComponent } from 'obsidian';
import { WritingStyle } from './types';
import { RewriteResult } from './rewriter';

export class ProgressModal extends Modal {
	private progressBar: HTMLElement;
	private statusText: HTMLElement;
	private progress: number = 0;

	constructor(app: App) {
		super(app);
		this.modalEl.addClass('geminify-progress-modal');
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: '🤖 Geminify Çalışıyor...' });
		
		const progressContainer = contentEl.createDiv('progress-container');
		progressContainer.style.cssText = `
			width: 100%;
			background-color: var(--background-modifier-border);
			border-radius: 10px;
			overflow: hidden;
			margin: 20px 0;
		`;

		this.progressBar = progressContainer.createDiv('progress-bar');
		this.progressBar.style.cssText = `
			height: 20px;
			background: linear-gradient(90deg, #4f46e5, #7c3aed);
			width: 0%;
			transition: width 0.3s ease;
			border-radius: 10px;
		`;

		this.statusText = contentEl.createEl('p', { 
			text: 'Başlatılıyor...',
			cls: 'progress-status' 
		});
		this.statusText.style.cssText = `
			text-align: center;
			margin: 10px 0;
			color: var(--text-muted);
		`;
	}

	updateProgress(progress: number, status: string) {
		this.progress = Math.max(0, Math.min(100, progress));
		this.progressBar.style.width = `${this.progress}%`;
		this.statusText.setText(status);

		if (this.progress >= 100) {
			setTimeout(() => this.close(), 1000);
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export class PreviewModal extends Modal {
	private result: RewriteResult;
	private onAccept: () => void;
	private onReject: () => void;

	constructor(
		app: App, 
		result: RewriteResult, 
		onAccept: () => void, 
		onReject: () => void
	) {
		super(app);
		this.result = result;
		this.onAccept = onAccept;
		this.onReject = onReject;
		this.modalEl.addClass('geminify-preview-modal');
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: '📝 Yeniden Yazılan İçerik Önizlemesi' });

		// Original text section
		const originalSection = contentEl.createDiv('original-section');
		originalSection.createEl('h3', { text: '📄 Orijinal Metin:' });
		const originalContainer = originalSection.createDiv('text-container original');
		originalContainer.style.cssText = `
			background: var(--background-secondary);
			padding: 15px;
			border-radius: 8px;
			margin: 10px 0;
			border-left: 4px solid var(--interactive-accent);
			max-height: 200px;
			overflow-y: auto;
		`;
		originalContainer.createEl('pre', { 
			text: this.result.originalText,
			cls: 'text-preview'
		});

		// Rewritten text section
		const rewrittenSection = contentEl.createDiv('rewritten-section');
		rewrittenSection.createEl('h3', { text: '✨ Yeniden Yazılan Metin:' });
		const rewrittenContainer = rewrittenSection.createDiv('text-container rewritten');
		rewrittenContainer.style.cssText = `
			background: var(--background-secondary);
			padding: 15px;
			border-radius: 8px;
			margin: 10px 0;
			border-left: 4px solid #10b981;
			max-height: 200px;
			overflow-y: auto;
		`;
		rewrittenContainer.createEl('pre', { 
			text: this.result.rewrittenText,
			cls: 'text-preview'
		});

		// Stats
		const statsContainer = contentEl.createDiv('stats-container');
		statsContainer.style.cssText = `
			display: flex;
			justify-content: space-around;
			margin: 15px 0;
			padding: 10px;
			background: var(--background-modifier-border);
			border-radius: 6px;
		`;

		const originalLength = this.result.originalText.length;
		const rewrittenLength = this.result.rewrittenText.length;
		const changePercent = ((rewrittenLength - originalLength) / originalLength * 100).toFixed(1);
		const changePercentNum = parseFloat(changePercent);

		statsContainer.createEl('span', { text: `📊 Orijinal: ${originalLength} karakter` });
		statsContainer.createEl('span', { text: `📊 Yeni: ${rewrittenLength} karakter` });
		statsContainer.createEl('span', { 
			text: `📈 Değişim: ${changePercentNum > 0 ? '+' : ''}${changePercent}%`,
			cls: changePercentNum > 0 ? 'positive-change' : 'negative-change'
		});

		// Action buttons
		const buttonContainer = contentEl.createDiv('button-container');
		buttonContainer.style.cssText = `
			display: flex;
			gap: 10px;
			justify-content: flex-end;
			margin-top: 20px;
		`;

		const rejectButton = new ButtonComponent(buttonContainer);
		rejectButton
			.setButtonText('❌ Reddet')
			.setTooltip('Değişiklikleri reddet ve orijinal metni koru')
			.onClick(() => {
				this.onReject();
				this.close();
			});

		const acceptButton = new ButtonComponent(buttonContainer);
		acceptButton
			.setButtonText('✅ Kabul Et')
			.setCta()
			.setTooltip('Değişiklikleri kabul et ve metni değiştir')
			.onClick(() => {
				this.onAccept();
				this.close();
			});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export class StyleSelectorModal extends Modal {
	private onStyleSelect: (style: WritingStyle | null) => void;

	constructor(app: App, onStyleSelect: (style: WritingStyle | null) => void) {
		super(app);
		this.onStyleSelect = onStyleSelect;
		this.modalEl.addClass('geminify-style-modal');
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: '✍️ Yazım Stili Seçin' });
		contentEl.createEl('p', { 
			text: 'Metninizi nasıl yeniden yazmak istediğinizi seçin:',
			cls: 'style-description'
		});

		const styleOptions = [
			{
				style: null,
				name: '🎯 Varsayılan',
				description: 'Genel amaçlı, açık ve anlaşılır yazım'
			},
			{
				style: WritingStyle.PROFESSIONAL,
				name: '💼 Profesyonel',
				description: 'İş dünyasına uygun, resmi ve etkili dil'
			},
			{
				style: WritingStyle.ACADEMIC,
				name: '🎓 Akademik',
				description: 'Bilimsel, objektif ve detaylı yaklaşım'
			},
			{
				style: WritingStyle.CASUAL,
				name: '😊 Günlük',
				description: 'Samimi, rahat ve anlaşılır ton'
			},
			{
				style: WritingStyle.BLOG,
				name: '📝 Blog',
				description: 'İlgi çekici, akıcı ve bağlantı kuran üslup'
			},
			{
				style: WritingStyle.TECHNICAL,
				name: '⚙️ Teknik',
				description: 'Açık, kesin ve adım adım anlaşılır'
			},
			{
				style: WritingStyle.CREATIVE,
				name: '🎨 Yaratıcı',
				description: 'Etkileyici, özgün ve çekici anlatım'
			}
		];

		const optionsContainer = contentEl.createDiv('style-options');
		optionsContainer.style.cssText = `
			display: grid;
			gap: 10px;
			margin: 20px 0;
		`;

		styleOptions.forEach(option => {
			const optionEl = optionsContainer.createDiv('style-option');
			optionEl.style.cssText = `
				padding: 15px;
				border: 2px solid var(--background-modifier-border);
				border-radius: 8px;
				cursor: pointer;
				transition: all 0.2s ease;
			`;

			optionEl.addEventListener('mouseenter', () => {
				optionEl.style.borderColor = 'var(--interactive-accent)';
				optionEl.style.backgroundColor = 'var(--background-modifier-hover)';
			});

			optionEl.addEventListener('mouseleave', () => {
				optionEl.style.borderColor = 'var(--background-modifier-border)';
				optionEl.style.backgroundColor = 'transparent';
			});

			optionEl.addEventListener('click', () => {
				this.onStyleSelect(option.style);
				this.close();
			});

			optionEl.createEl('h3', { text: option.name, cls: 'style-name' });
			optionEl.createEl('p', { text: option.description, cls: 'style-desc' });
		});

		// Cancel button
		const buttonContainer = contentEl.createDiv('button-container');
		buttonContainer.style.cssText = `
			display: flex;
			justify-content: center;
			margin-top: 20px;
		`;

		const cancelButton = new ButtonComponent(buttonContainer);
		cancelButton
			.setButtonText('❌ İptal')
			.onClick(() => this.close());
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export class ErrorModal extends Modal {
	private error: string;

	constructor(app: App, error: string) {
		super(app);
		this.error = error;
		this.modalEl.addClass('geminify-error-modal');
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: '❌ Hata Oluştu' });
		
		const errorContainer = contentEl.createDiv('error-container');
		errorContainer.style.cssText = `
			background: var(--background-secondary);
			padding: 15px;
			border-radius: 8px;
			margin: 15px 0;
			border-left: 4px solid #ef4444;
		`;

		errorContainer.createEl('p', { text: this.error });

		// Close button
		const buttonContainer = contentEl.createDiv('button-container');
		buttonContainer.style.cssText = `
			display: flex;
			justify-content: center;
			margin-top: 20px;
		`;

		const closeButton = new ButtonComponent(buttonContainer);
		closeButton
			.setButtonText('Tamam')
			.setCta()
			.onClick(() => this.close());
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}