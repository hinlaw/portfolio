'use client';

import { useTranslations } from 'next-intl';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { ReceiptLanguageOption } from '@/lib/ai-expense-settings';

interface ExpenseSettingsPreferencesSectionProps {
    receiptLanguage: ReceiptLanguageOption;
    onReceiptLanguageChange: (v: ReceiptLanguageOption) => void;
    onSave: () => void;
    isLoading?: boolean;
    isSaving?: boolean;
}

export default function ExpenseSettingsPreferencesSection({
    receiptLanguage,
    onReceiptLanguageChange,
    onSave,
    isLoading = false,
    isSaving = false,
}: ExpenseSettingsPreferencesSectionProps) {
    const t = useTranslations('aiExpense');

    return (
        <section>
            <h2 className="text-lg font-semibold mb-6">{t('preferences')}</h2>
            <div className="space-y-6">
                <div>
                    <Label htmlFor="receipt-language" className="block mb-3">{t('receipt output language')}</Label>
                    <Select
                        value={receiptLanguage}
                        onValueChange={(v) => onReceiptLanguageChange(v as ReceiptLanguageOption)}
                        disabled={isLoading}
                    >
                        <SelectTrigger id="receipt-language" className="w-full max-w-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">{t('english')}</SelectItem>
                            <SelectItem value="zh">{t('simplified chinese')}</SelectItem>
                            <SelectItem value="zh_HK">{t('traditional chinese')}</SelectItem>
                            <SelectItem value="receipt">{t('based on receipt language')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                    {t('base currency per workspace hint')}
                </p>
                <Button
                    onClick={onSave}
                    disabled={isLoading || isSaving}
                    className="mt-4"
                >
                    {isSaving ? t('loading') : t('save')}
                </Button>
            </div>
        </section>
    );
}
