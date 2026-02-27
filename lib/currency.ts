

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
 * Hook to format currency based on workspace currency setting
 * @returns A function to format amounts as currency
 */
// export function useCurrencyFormatter() {
//     const { currentWorkspace } = useLocalStorage();
    
//     // Get currency from workspace, default to USD if not set
//     const currency = currentWorkspace?.workspace?.currency?.trim() || 'USD';
    
//     const formatCurrency = (amount: number): string => {
//         return formatCurrencyWithCode(amount, currency);
//     };
    
//     return formatCurrency;
// }
