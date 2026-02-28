/** Supported currencies (hardcoded, no API) */
export const SUPPORTED_CURRENCIES = ['USD', 'CNY', 'HKD'] as const;

/** Exchange rates to USD: 1 unit of currency = X USD (hardcoded) */
export const EXCHANGE_RATES_TO_USD: Record<string, number> = {
    USD: 1,
    CNY: 0.14,   // ~7.14 CNY per 1 USD
    HKD: 0.128,  // ~7.8 HKD per 1 USD
};

/** Get exchange rate from currency to USD */
export function getExchangeRateToUsd(currency: string): number {
    return EXCHANGE_RATES_TO_USD[currency] ?? 1;
}

/**
 * Format currency with a specific currency code
 * Returns formatted amount with currency code appended (e.g., "100.00 USD")
 * Note: Removes the currency symbol prefix to avoid duplication with currency code
 */
export function formatCurrencyWithCode(amount: number, currencyCode: string): string {
    try {
        // Format as number (without currency symbol) to avoid duplication
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
        // Append currency code
        return `${formatted} ${currencyCode}`;
    } catch (error) {
        // Fallback to USD if currency code is invalid
        console.warn(`Invalid currency code: ${currencyCode}, falling back to USD`);
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
        return `${formatted} USD`;
    }
}

/**
 * Hook to format currency based on workspace currency (USD)
 * @returns A function to format amounts as currency
 */
export function useCurrencyFormatter(): (amount: number) => string {
    const currency = 'USD';
    return (amount: number) => formatCurrencyWithCode(amount, currency);
}
