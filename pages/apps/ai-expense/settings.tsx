'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ExpensePageLayout from '@/components/ai-expense/layout/expense-page-layout';
import ExpenseSidebar from '@/components/ai-expense/layout/expense-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
    getReceiptLanguagePreference,
    setReceiptLanguagePreference,
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

    useEffect(() => {
        setReceiptLanguage(getReceiptLanguagePreference(locale));
    }, [locale]);

    const handleReceiptLanguageChange = (value: ReceiptLanguageOption) => {
        setReceiptLanguage(value);
        setReceiptLanguagePreference(value);
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
