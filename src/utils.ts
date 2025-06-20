import { Notice } from 'obsidian';

export class AIRewriteNotice extends Notice {
	constructor(message: string, timeout?: number) {
		super(message, timeout || 5000);
	}
}

export function showError(message: string): void {
	new AIRewriteNotice(`❌ ${message}`, 8000);
}

export function showSuccess(message: string): void {
	new AIRewriteNotice(`✅ ${message}`, 3000);
}

export function showInfo(message: string): void {
	new AIRewriteNotice(`ℹ️ ${message}`, 5000);
}

export function showWarning(message: string): void {
	new AIRewriteNotice(`⚠️ ${message}`, 6000);
}

export function sanitizeText(text: string): string {
	// Remove potentially problematic characters while preserving content
	return text
		.replace(/\u0000/g, '') // Remove null characters
		.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Remove control characters
		.trim();
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + '...';
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function estimateReadingTime(text: string): number {
	// Average reading speed: 200-250 words per minute
	const wordsPerMinute = 225;
	const wordCount = text.split(/\s+/).length;
	return Math.ceil(wordCount / wordsPerMinute);
}

// Memory cleanup helper
export function cleanupMemory(): void {
	if (global.gc) {
		global.gc();
	}
}

// Simple cache implementation
export class SimpleCache<T> {
	private cache: Map<string, { value: T; timestamp: number }> = new Map();
	private ttl: number;

	constructor(ttlMinutes: number = 10) {
		this.ttl = ttlMinutes * 60 * 1000;
	}

	set(key: string, value: T): void {
		this.cache.set(key, {
			value,
			timestamp: Date.now()
		});
		
		// Cleanup old entries
		this.cleanup();
	}

	get(key: string): T | null {
		const entry = this.cache.get(key);
		
		if (!entry) return null;
		
		if (Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(key);
			return null;
		}
		
		return entry.value;
	}

	clear(): void {
		this.cache.clear();
	}

	private cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp > this.ttl) {
				this.cache.delete(key);
			}
		}
	}
}