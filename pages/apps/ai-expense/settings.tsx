'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import ExpensePageLayout from '@/components/ai-expense/layout/expense-page-layout';
import ExpenseSidebar from '@/components/ai-expense/layout/expense-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
    fetchAiExpenseSettings,
    updateAiExpenseSettings,
    getDefaultReceiptLanguage,
    type ReceiptLanguageOption,
} from '@/lib/ai-expense-settings';
import ExpenseSettingsMobileHeader from '@/components/ai-expense/settings/expense-settings-mobile-header';
import ExpenseSettingsPreferencesSection from '@/components/ai-expense/settings/expense-settings-preferences-section';

export default function AiExpenseSettingsPage() {
    const router = useRouter();
    const t = useTranslations('aiExpense');
    const locale = useLocale();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [receiptLanguage, setReceiptLanguage] = useState<ReceiptLanguageOption>('en');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAiExpenseSettings()
            .then((data) => {
                const lang = data.receipt_language;
                if (lang === 'en' || lang === 'zh' || lang === 'zh_HK' || lang === 'receipt') {
                    setReceiptLanguage(lang as ReceiptLanguageOption);
                } else {
                    setReceiptLanguage(getDefaultReceiptLanguage(locale));
                }
            })
            .catch(() => setReceiptLanguage(getDefaultReceiptLanguage(locale)))
            .finally(() => setIsLoading(false));
    }, [locale]);

    const handleReceiptLanguageChange = (value: ReceiptLanguageOption) => {
        setReceiptLanguage(value);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateAiExpenseSettings({ receipt_language: receiptLanguage });
            toast.success(t('settings saved'));
        } catch {
            toast.error(t('toast.failed to save settings'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Head>
                <title>{t('my settings')} | AI Expense</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            <ExpensePageLayout title={t('my settings')}>
                <div className="hidden md:block">
                    <div className="sticky top-[0px] z-20 px-6 py-3 border-b border-slate-200 bg-white">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{t('my settings')}</h2>
                        </div>
                    </div>
                    <div className="p-6 max-w-2xl">
                        <div className="space-y-8">
                            <ExpenseSettingsPreferencesSection
                                receiptLanguage={receiptLanguage}
                                onReceiptLanguageChange={handleReceiptLanguageChange}
                                onSave={handleSave}
                                isLoading={isLoading}
                                isSaving={isSaving}
                            />
                        </div>
                    </div>
                </div>

                <div className="md:hidden">
                    <ExpenseSettingsMobileHeader onMenuClick={() => setIsSheetOpen(true)} />
                    <div className="p-6 pb-[calc(80px+env(safe-area-inset-bottom))]">
                        <div className="space-y-8">
                            <ExpenseSettingsPreferencesSection
                                receiptLanguage={receiptLanguage}
                                onReceiptLanguageChange={handleReceiptLanguageChange}
                                onSave={handleSave}
                                isLoading={isLoading}
                                isSaving={isSaving}
                            />
                        </div>
                    </div>
                </div>
            </ExpensePageLayout>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="left" className="w-64 p-0 pt-12">
                    <ExpenseSidebar
                        currentPath={router.pathname}
                        variant="sheet"
                        onNavigate={() => setIsSheetOpen(false)}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
