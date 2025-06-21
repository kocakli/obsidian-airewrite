import { App, Modal, Setting, ButtonComponent, Notice, setIcon } from 'obsidian';
import { WritingStyle } from './types';
import { RewriteResult } from './rewriter';
import { PlatformDetector } from './platform-detector';
import { IconManager } from './icon-manager';

export class MobileFloatingButton {
	private app: App;
	private platformDetector: PlatformDetector;
	private iconManager: IconManager;
	private buttonEl: HTMLElement | null = null;
	private isVisible: boolean = false;

	constructor(app: App, platformDetector: PlatformDetector) {
		this.app = app;
		this.platformDetector = platformDetector;
		this.iconManager = new IconManager(platformDetector);
	}

	show(onRewrite: () => void) {
		if (!this.platformDetector.isMobile() || this.isVisible) return;

		this.buttonEl = createDiv('airewrite-floating-button');
		setIcon(this.buttonEl, this.iconManager.getIcon('fabButton'));
		this.buttonEl.setAttribute('aria-label', 'Rewrite with AI');
		
		this.buttonEl.addEventListener('click', () => {
			onRewrite();
			this.hide();
		});

		document.body.appendChild(this.buttonEl);
		this.isVisible = true;

		// Auto-hide after 5 seconds
		setTimeout(() => this.hide(), 5000);
	}

	hide() {
		if (this.buttonEl && this.isVisible) {
			this.buttonEl.remove();
			this.buttonEl = null;
			this.isVisible = false;
		}
	}
}

export class MobileProgressModal extends Modal {
	private progressBar: HTMLElement;
	private statusText: HTMLElement;
	private progress: number = 0;
	private platformDetector: PlatformDetector;
	private iconManager: IconManager;

	constructor(app: App, platformDetector: PlatformDetector) {
		super(app);
		this.platformDetector = platformDetector;
		this.iconManager = new IconManager(platformDetector);
		this.modalEl.addClass('airewrite-progress-modal');
		
		if (platformDetector.isMobile()) {
			this.modalEl.addClass('airewrite-mobile-modal');
		}
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		const config = this.platformDetector.getOptimalUIConfig();

		contentEl.createEl('h2', { 
			text: '🤖 AIRewrite Working...',
			cls: 'airewrite-modal-title'
		});
		
		const progressContainer = contentEl.createDiv('airewrite-progress-container');
		this.progressBar = progressContainer.createDiv('airewrite-progress-bar');
		
		this.statusText = contentEl.createEl('p', { 
			text: 'Starting...',
			cls: 'airewrite-progress-status'
		});

		if (this.platformDetector.isMobile()) {
			// Add touch-friendly cancel button for mobile
			const cancelButton = contentEl.createEl('button', {
				text: 'Cancel',
				cls: 'airewrite-cancel-button-mobile'
			});
			
			cancelButton.addEventListener('click', () => {
				this.close();
			});
		}
	}

	updateProgress(progress: number, status: string) {
		this.progress = Math.max(0, Math.min(100, progress));
		this.progressBar.style.width = `${this.progress}%`;
		this.statusText.textContent = status;
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export class MobilePreviewModal extends Modal {
	private result: RewriteResult;
	private onAccept: (result: RewriteResult) => void;
	private onReject: () => void;
	private platformDetector: PlatformDetector;
	private iconManager: IconManager;

	constructor(
		app: App, 
		result: RewriteResult, 
		onAccept: (result: RewriteResult) => void, 
		onReject: () => void,
		platformDetector: PlatformDetector
	) {
		super(app);
		this.result = result;
		this.onAccept = onAccept;
		this.onReject = onReject;
		this.platformDetector = platformDetector;
		this.iconManager = new IconManager(platformDetector);
		this.modalEl.addClass('airewrite-preview-modal');
		
		if (platformDetector.isMobile()) {
			this.modalEl.addClass('airewrite-mobile-modal');
		}
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { 
			text: '✨ AI Rewrite Preview',
			cls: 'airewrite-modal-title'
		});

		// Original text section
		const originalSection = contentEl.createDiv('airewrite-preview-section');
		originalSection.createEl('h3', { text: 'Original:' });
		const originalTextEl = originalSection.createEl('div', { 
			cls: 'airewrite-preview-text airewrite-original-text' 
		});
		originalTextEl.textContent = this.result.originalText;

		// Rewritten text section
		const rewrittenSection = contentEl.createDiv('airewrite-preview-section');
		rewrittenSection.createEl('h3', { text: 'AI Rewrite:' });
		const rewrittenTextEl = rewrittenSection.createEl('div', { 
			cls: 'airewrite-preview-text airewrite-rewritten-text' 
		});
		rewrittenTextEl.textContent = this.result.rewrittenText;

		// Mobile-optimized button layout
		const buttonContainer = contentEl.createDiv('airewrite-button-container');
		
		if (this.platformDetector.isMobile()) {
			buttonContainer.addClass('airewrite-mobile-buttons');
			
			// Large touch-friendly buttons for mobile
			const acceptButton = buttonContainer.createEl('button', {
				text: '✅ Apply Changes',
				cls: 'airewrite-button-primary-mobile'
			});
			
			const rejectButton = buttonContainer.createEl('button', {
				text: '❌ Keep Original',
				cls: 'airewrite-button-secondary-mobile'
			});

			acceptButton.addEventListener('click', () => {
				this.onAccept(this.result);
				this.close();
			});

			rejectButton.addEventListener('click', () => {
				this.onReject();
				this.close();
			});

			// Add swipe gestures for mobile
			this.addSwipeGestures(contentEl);
		} else {
			// Desktop button layout (existing)
			const acceptButton = new ButtonComponent(buttonContainer)
				.setButtonText('Apply Changes')
				.setCta()
				.onClick(() => {
					this.onAccept(this.result);
					this.close();
				});

			const rejectButton = new ButtonComponent(buttonContainer)
				.setButtonText('Keep Original')
				.onClick(() => {
					this.onReject();
					this.close();
				});
		}
	}

	private addSwipeGestures(element: HTMLElement) {
		if (!this.platformDetector.prefersTouchUI()) return;

		let startX: number;
		let startY: number;

		element.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		});

		element.addEventListener('touchend', (e) => {
			if (!startX || !startY) return;

			const endX = e.changedTouches[0].clientX;
			const endY = e.changedTouches[0].clientY;

			const diffX = startX - endX;
			const diffY = startY - endY;

			// Swipe right to accept, swipe left to reject
			if (Math.abs(diffX) > Math.abs(diffY)) {
				if (diffX > 50) {
					// Swipe left - reject
					this.onReject();
					this.close();
				} else if (diffX < -50) {
					// Swipe right - accept
					this.onAccept(this.result);
					this.close();
				}
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export class MobileStyleSelector extends Modal {
	private onStyleSelected: (style: WritingStyle) => void;
	private platformDetector: PlatformDetector;
	private iconManager: IconManager;

	constructor(app: App, onStyleSelected: (style: WritingStyle) => void, platformDetector: PlatformDetector) {
		super(app);
		this.onStyleSelected = onStyleSelected;
		this.platformDetector = platformDetector;
		this.iconManager = new IconManager(platformDetector);
		this.modalEl.addClass('airewrite-style-modal');
		
		if (platformDetector.isMobile()) {
			this.modalEl.addClass('airewrite-mobile-modal');
		}
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { 
			text: '🎨 Choose Writing Style',
			cls: 'airewrite-modal-title'
		});

		const styles: { value: WritingStyle; label: string; description: string; emoji: string }[] = [
			{ value: WritingStyle.ACADEMIC, label: 'Academic', description: 'Formal, well-researched tone', emoji: '🎓' },
			{ value: WritingStyle.CASUAL, label: 'Casual', description: 'Friendly, conversational tone', emoji: '😊' },
			{ value: WritingStyle.BUSINESS, label: 'Business', description: 'Professional and concise', emoji: '💼' },
			{ value: WritingStyle.CREATIVE, label: 'Creative', description: 'Imaginative and expressive', emoji: '🎨' },
			{ value: WritingStyle.TECHNICAL, label: 'Technical', description: 'Precise, detailed explanations', emoji: '⚙️' },
			{ value: WritingStyle.SIMPLE, label: 'Simple', description: 'Clear, easy to understand', emoji: '✨' }
		];

		const stylesContainer = contentEl.createDiv('airewrite-styles-container');
		
		if (this.platformDetector.isMobile()) {
			stylesContainer.addClass('airewrite-mobile-styles');
		}

		styles.forEach(style => {
			const styleButton = stylesContainer.createEl('button', {
				cls: this.platformDetector.isMobile() ? 'airewrite-style-button-mobile' : 'airewrite-style-button'
			});

			styleButton.innerHTML = `
				<div class="airewrite-style-emoji">${style.emoji}</div>
				<div class="airewrite-style-label">${style.label}</div>
				<div class="airewrite-style-description">${style.description}</div>
			`;

			styleButton.addEventListener('click', () => {
				this.onStyleSelected(style.value);
				this.close();
			});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}