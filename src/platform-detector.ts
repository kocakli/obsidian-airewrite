import { App } from 'obsidian';

export interface PlatformInfo {
	isMobile: boolean;
	isDesktop: boolean;
	isAndroid: boolean;
	isIOS: boolean;
	supportsContextMenu: boolean;
	prefersTouchUI: boolean;
}

export class PlatformDetector {
	private app: App;
	private platformInfo: PlatformInfo;

	constructor(app: App) {
		this.app = app;
		this.platformInfo = this.detectPlatform();
	}

	private detectPlatform(): PlatformInfo {
		const isMobile = (this.app as any).isMobile || false;
		const isDesktop = !isMobile;
		
		// Detect specific mobile platforms
		const userAgent = navigator.userAgent.toLowerCase();
		const isAndroid = isMobile && /android/.test(userAgent);
		const isIOS = isMobile && /iphone|ipad|ipod/.test(userAgent);

		return {
			isMobile,
			isDesktop,
			isAndroid,
			isIOS,
			supportsContextMenu: isDesktop,
			prefersTouchUI: isMobile
		};
	}

	public getPlatformInfo(): PlatformInfo {
		return this.platformInfo;
	}

	public isMobile(): boolean {
		return this.platformInfo.isMobile;
	}

	public isDesktop(): boolean {
		return this.platformInfo.isDesktop;
	}

	public isAndroid(): boolean {
		return this.platformInfo.isAndroid;
	}

	public isIOS(): boolean {
		return this.platformInfo.isIOS;
	}

	public supportsContextMenu(): boolean {
		return this.platformInfo.supportsContextMenu;
	}

	public prefersTouchUI(): boolean {
		return this.platformInfo.prefersTouchUI;
	}

	public getOptimalUIConfig() {
		if (this.isMobile()) {
			return {
				modalSize: 'fullscreen',
				buttonSize: 'large',
				spacing: 'generous',
				showFloatingButton: true,
				useSwipeGestures: true,
				commandPriority: 'high'
			};
		} else {
			return {
				modalSize: 'medium',
				buttonSize: 'normal',
				spacing: 'compact',
				showFloatingButton: false,
				useSwipeGestures: false,
				commandPriority: 'normal'
			};
		}
	}

	public getAPIConfig() {
		if (this.isMobile()) {
			return {
				timeout: 15000, // Longer timeout for mobile networks
				maxTokens: 2000, // Smaller chunks for mobile
				retryAttempts: 3,
				batchSize: 1 // Process one at a time on mobile
			};
		} else {
			return {
				timeout: 10000,
				maxTokens: 4000,
				retryAttempts: 2,
				batchSize: 3
			};
		}
	}
}