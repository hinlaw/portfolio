const STORAGE_KEY = 'ai-expense-receipt-language';

export type ReceiptLanguageOption = 'en' | 'zh' | 'zh_HK' | 'receipt';

export function getReceiptLanguagePreference(
    fallbackLocale: string
): ReceiptLanguageOption {
    if (typeof window === 'undefined') {
        return (['en', 'zh', 'zh_HK'].includes(fallbackLocale) ? fallbackLocale : 'en') as ReceiptLanguageOption;
    }
    const stored = localStorage.getItem(STORAGE_KEY) as ReceiptLanguageOption | null;
    if (stored && (stored === 'receipt' || stored === 'en' || stored === 'zh' || stored === 'zh_HK')) {
        return stored;
    }
    return (['en', 'zh', 'zh_HK'].includes(fallbackLocale) ? fallbackLocale : 'en') as ReceiptLanguageOption;
}

export function setReceiptLanguagePreference(value: ReceiptLanguageOption): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, value);
    }
}
