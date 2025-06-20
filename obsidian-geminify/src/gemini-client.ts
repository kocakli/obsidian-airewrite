import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponse, RewriteOptions, AIRewriteSettings } from './types';
import { buildPrompt } from './prompts';
import { Notice } from 'obsidian';

export class GeminiClient {
	private genAI: GoogleGenerativeAI | null = null;
	private settings: AIRewriteSettings;

	constructor(settings: AIRewriteSettings) {
		this.settings = settings;
		this.initializeClient();
	}

	private initializeClient(): void {
		if (!this.settings.apiKey) {
			return;
		}

		try {
			this.genAI = new GoogleGenerativeAI(this.settings.apiKey);
			console.log('Gemini API client initialized with model:', this.settings.model);
		} catch (error) {
			console.error('Gemini API client initialization failed:', error);
		}
	}

	public updateSettings(settings: AIRewriteSettings): void {
		this.settings = settings;
		this.initializeClient();
	}

	public async validateApiKey(): Promise<boolean> {
		if (!this.genAI) {
			return false;
		}

		try {
			const model = this.genAI.getGenerativeModel({ model: this.settings.model });
			const result = await model.generateContent({
				contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
			});
			const response = await result.response;
			const text = response.text();
			return text && text.length > 0;
		} catch (error: any) {
			console.error('API key validation error:', error);
			
			// Log detailed error for debugging
			if (error.message) {
				console.error('Error message:', error.message);
			}
			if (error.status) {
				console.error('Error status:', error.status);
			}
			
			return false;
		}
	}

	public async rewriteText(options: RewriteOptions): Promise<GeminiResponse> {
		if (!this.genAI) {
			return {
				text: '',
				success: false,
				error: 'API anahtarı ayarlanmamış. Lütfen ayarlar sekmesinden API anahtarınızı girin.'
			};
		}

		if (!options.text.trim()) {
			return {
				text: '',
				success: false,
				error: 'Yeniden yazılacak metin boş olamaz.'
			};
		}

		const prompt = buildPrompt(options.text, options.style, options.customPrompt);

		return await this.generateWithRetry(prompt);
	}

	private async generateWithRetry(prompt: string, maxRetries: number = 3): Promise<GeminiResponse> {
		let lastError: string = '';
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				const model = this.genAI!.getGenerativeModel({ 
					model: this.settings.model,
					generationConfig: {
						temperature: this.settings.temperature,
						maxOutputTokens: this.settings.maxTokens,
					}
				});

				const result = await model.generateContent({
					contents: [{ role: 'user', parts: [{ text: prompt }] }],
				});
				
				clearTimeout(timeoutId);
				const response = await result.response;
				const text = response.text();

				if (text) {
					return {
						text: text.trim(),
						success: true
					};
				} else {
					lastError = 'Gemini API boş yanıt döndürdü.';
				}
			} catch (error: any) {
				if (error.name === 'AbortError') {
					lastError = 'İstek zaman aşımına uğradı (30 saniye)';
				} else {
					lastError = this.handleError(error);
				}
				
				if (attempt < maxRetries && !this.isRateLimitError(error)) {
					new Notice(`Deneme ${attempt} başarısız, tekrar deneniyor...`);
					await this.delay(1000 * Math.pow(2, attempt - 1)); // Exponential backoff
				} else if (this.isRateLimitError(error)) {
					break; // Don't retry rate limit errors
				}
			}
		}

		clearTimeout(timeoutId);
		return {
			text: '',
			success: false,
			error: `${maxRetries} deneme sonrası başarısız: ${lastError}`
		};
	}

	private handleError(error: any): string {
		if (error.message) {
			if (error.message.includes('API_KEY_INVALID')) {
				return 'Geçersiz API anahtarı. Lütfen ayarlardan API anahtarınızı kontrol edin.';
			} else if (error.message.includes('QUOTA_EXCEEDED')) {
				return 'API kullanım limitiniz aşıldı. Lütfen daha sonra tekrar deneyin.';
			} else if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
				return 'Çok fazla istek gönderildi. Lütfen bir süre bekleyin.';
			} else if (error.message.includes('SAFETY')) {
				return 'İçerik güvenlik politikalarına uygun değil.';
			} else if (error.message.includes('NETWORK_ERROR') || error.message.includes('ENOTFOUND')) {
				return 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
			} else if (error.message.includes('INVALID_ARGUMENT')) {
				return 'Geçersiz istek. Metin çok uzun veya desteklenmeyen karakterler içeriyor olabilir.';
			}
		}

		return `Gemini API hatası: ${error.message || 'Bilinmeyen hata'}`;
	}

	private isRateLimitError(error: any): boolean {
		return error.message && (
			error.message.includes('RATE_LIMIT_EXCEEDED') ||
			error.message.includes('QUOTA_EXCEEDED')
		);
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	public isConfigured(): boolean {
		return !!this.settings.apiKey && !!this.genAI;
	}
}