'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import {
    fetchAiExpenseSettings,
    DEFAULT_BASE_CURRENCY,
    type AiExpenseSettingsResponse,
} from '@/lib/ai-expense-settings';

interface AiExpenseSettingsContextValue {
    baseCurrency: string;
    settings: AiExpenseSettingsResponse | null;
    isLoading: boolean;
    refreshSettings: () => Promise<void>;
}

const AiExpenseSettingsContext = createContext<AiExpenseSettingsContextValue | null>(null);

export function useAiExpenseSettings(): AiExpenseSettingsContextValue {
    const ctx = useContext(AiExpenseSettingsContext);
    if (!ctx) {
        return {
            baseCurrency: DEFAULT_BASE_CURRENCY,
            settings: null,
            isLoading: true,
            refreshSettings: async () => {},
        };
    }
    return ctx;
}

interface AiExpenseSettingsProviderProps {
    children: ReactNode;
}

export function AiExpenseSettingsProvider({ children }: AiExpenseSettingsProviderProps) {
    const [settings, setSettings] = useState<AiExpenseSettingsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSettings = useCallback(async () => {
        try {
            const data = await fetchAiExpenseSettings();
            setSettings(data);
        } catch {
            setSettings(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSettings();
    }, [refreshSettings]);

    const baseCurrency = (settings?.base_currency ?? DEFAULT_BASE_CURRENCY) as string;

    const value: AiExpenseSettingsContextValue = {
        baseCurrency,
        settings,
        isLoading,
        refreshSettings,
    };

    return (
        <AiExpenseSettingsContext.Provider value={value}>
            {children}
        </AiExpenseSettingsContext.Provider>
    );
}
