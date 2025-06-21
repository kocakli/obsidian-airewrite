import { PlatformDetector } from './platform-detector';

// Mobile-safe icons that are guaranteed to work on both desktop and mobile
export const MOBILE_SAFE_ICONS = {
	// Core rewrite actions
	rewrite: 'edit-3',           // ✏️ Main rewrite action
	rewriteDocument: 'file-text', // 📄 Document rewrite
	quickRewrite: 'zap',         // ⚡ Quick rewrite
	
	// Style and preview
	preview: 'eye',              // 👁️ Preview modal
	style: 'palette',            // 🎨 Style selector
	
	// Mobile-specific actions
	mobileRewrite: 'smartphone', // 📱 Mobile rewrite
	touchAction: 'hand',         // 👆 Touch actions
	fabButton: 'edit-3',         // 📝 Floating Action Button
	
	// UI states and feedback
	success: 'check-circle',     // ✅ Success states
	error: 'x-circle',          // ❌ Error states
	warning: 'alert-triangle',   // ⚠️ Warning states
	info: 'info',               // ℹ️ Information
	
	// Navigation and controls
	settings: 'settings',        // ⚙️ Settings
	refresh: 'refresh-cw',       // 🔄 Refresh/retry
	close: 'x',                 // ✖️ Close/cancel
	check: 'check',             // ✔️ Accept/confirm
	
	// Text editing
	append: 'plus-circle',      // ➕ Append text
	replace: 'replace',         // 🔄 Replace text
	
	// Command types
	smart: 'brain',             // 🧠 Smart selection
	voice: 'mic',               // 🎤 Voice (future feature)
	
	// Fallback
	default: 'edit-3'           // Default fallback icon
};

// Desktop-specific icons (can use more advanced icons)
export const DESKTOP_ICONS = {
	rewrite: 'wand-2',          // Magic wand for desktop
	rewriteDocument: 'scroll',   // Scroll for document
	quickRewrite: 'zap',        
	preview: 'eye',             
	style: 'palette',           
	settings: 'settings',       
	refresh: 'refresh-cw',      
	default: 'wand-2'
};

export class IconManager {
	private platformDetector: PlatformDetector;
	private iconSet: typeof MOBILE_SAFE_ICONS;

	constructor(platformDetector: PlatformDetector) {
		this.platformDetector = platformDetector;
		
		// Always use mobile-safe icons to ensure compatibility
		// Desktop can handle mobile icons, but mobile can't handle desktop-specific ones
		this.iconSet = MOBILE_SAFE_ICONS;
	}

	/**
	 * Get the appropriate icon for the current platform
	 */
	getIcon(action: keyof typeof MOBILE_SAFE_ICONS): string {
		return this.iconSet[action] || this.iconSet.default;
	}

	/**
	 * Get icon with fallback safety
	 */
	getSafeIcon(action: string): string {
		const typedAction = action as keyof typeof MOBILE_SAFE_ICONS;
		return this.iconSet[typedAction] || this.iconSet.default;
	}

	/**
	 * Test icon compatibility - useful for debugging
	 */
	getTestIcons(): Array<{name: string, icon: string}> {
		return Object.entries(this.iconSet).map(([name, icon]) => ({
			name,
			icon
		}));
	}

	/**
	 * Get platform-specific recommendations
	 */
	getPlatformInfo() {
		return {
			isMobile: this.platformDetector.isMobile(),
			isDesktop: this.platformDetector.isDesktop(),
			iconSet: this.platformDetector.isMobile() ? 'mobile-safe' : 'mobile-safe-universal',
			totalIcons: Object.keys(this.iconSet).length
		};
	}

	/**
	 * Get icon for command based on action type
	 */
	getCommandIcon(commandType: 'rewrite' | 'preview' | 'style' | 'quick' | 'mobile' | 'settings'): string {
		const iconMap = {
			'rewrite': this.getIcon('rewrite'),
			'preview': this.getIcon('preview'),
			'style': this.getIcon('style'),
			'quick': this.getIcon('quickRewrite'),
			'mobile': this.getIcon('mobileRewrite'),
			'settings': this.getIcon('settings')
		};

		return iconMap[commandType] || this.getIcon('default');
	}

	/**
	 * Get icon for modal states
	 */
	getStateIcon(state: 'success' | 'error' | 'warning' | 'info' | 'loading'): string {
		const stateMap = {
			'success': this.getIcon('success'),
			'error': this.getIcon('error'),
			'warning': this.getIcon('warning'),
			'info': this.getIcon('info'),
			'loading': this.getIcon('refresh')
		};

		return stateMap[state] || this.getIcon('default');
	}

	/**
	 * Validate if an icon exists in our safe set
	 */
	isIconSafe(iconName: string): boolean {
		return Object.values(this.iconSet).includes(iconName);
	}
}