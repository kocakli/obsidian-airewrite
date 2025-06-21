import { WritingStyle } from './types';

export const DEFAULT_SYSTEM_PROMPT = "Bu metni daha açık, anlaşılır ve profesyonel bir şekilde yeniden yaz. Anahtar bilgileri koruyarak daha iyi bir akış ve yapı oluştur. SADECE yeniden yazılan metni ver, hiçbir açıklama, giriş veya ek yorum ekleme.";

export const STYLE_PROMPTS: Record<WritingStyle, string> = {
	[WritingStyle.PROFESSIONAL]: "Bu metni profesyonel ve resmi bir dille yeniden yaz. İş dünyasına uygun, net ve etkili bir üslup kullan. SADECE yeniden yazılan metni ver, hiçbir açıklama ekleme.",
	
	[WritingStyle.ACADEMIC]: "Bu metni akademik yazım kurallarına uygun şekilde yeniden yaz. Bilimsel, objektif ve detaylı bir yaklaşım benimse. SADECE yeniden yazılan metni ver, hiçbir açıklama ekleme.",
	
	[WritingStyle.CASUAL]: "Bu metni günlük konuşma diline yakın, samimi ve anlaşılır bir şekilde yeniden yaz. Dostça ve rahat bir ton kullan. SADECE yeniden yazılan metni ver, hiçbir açıklama ekleme.",
	
	[WritingStyle.BLOG]: "Bu metni blog yazısına uygun şekilde yeniden yaz. Okuyucuyla bağlantı kuran, ilgi çekici ve akıcı bir üslup kullan. SADECE yeniden yazılan metni ver, hiçbir açıklama ekleme.",
	
	[WritingStyle.TECHNICAL]: "Bu metni teknik dokümantasyon standartlarına uygun şekilde yeniden yaz. Açık, kesin ve adım adım anlaşılır olacak şekilde düzenle. SADECE yeniden yazılan metni ver, hiçbir açıklama ekleme.",
	
	[WritingStyle.CREATIVE]: "Bu metni yaratıcı ve etkileyici bir şekilde yeniden yaz. Çekici anlatım teknikleri ve özgün ifadeler kullan. SADECE yeniden yazılan metni ver, hiçbir açıklama ekleme.",
	
	[WritingStyle.BUSINESS]: "Bu metni iş dünyasına uygun, profesyonel ve özlü bir şekilde yeniden yaz. Net, etkili ve sonuç odaklı bir üslup kullan. SADECE yeniden yazılan metni ver, hiçbir açıklama ekleme.",
	
	[WritingStyle.SIMPLE]: "Bu metni herkesın kolayca anlayabileceği basit ve açık bir dille yeniden yaz. Karmaşık kelimeler yerine sade ifadeler kullan. SADECE yeniden yazılan metni ver, hiçbir açıklama ekleme."
};

export function buildPrompt(baseText: string, style?: WritingStyle, customPrompt?: string): string {
	const baseInstruction = "ÖNEMLİ: Sadece yeniden yazılan metni ver. Hiçbir açıklama, giriş cümlesi, son söz veya yorum ekleme. Meta açıklamalar yapma. Direkt yeniden yazılan içeriği ver.\n\n";
	
	if (customPrompt) {
		return `${baseInstruction}${customPrompt}\n\nYeniden yazılacak metin:\n${baseText}`;
	}
	
	const systemPrompt = style ? STYLE_PROMPTS[style] : DEFAULT_SYSTEM_PROMPT;
	return `${baseInstruction}${systemPrompt}\n\nYeniden yazılacak metin:\n${baseText}`;
}