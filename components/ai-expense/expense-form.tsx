'use client';

import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencySelect } from './currency-select';
import { useTranslations } from 'next-intl';
import { useCurrencyFormatter } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { ExpenseFormData } from './form/schema';
import { dayjs } from '@/lib/date';
import MobileExpenseForm from './mobile-expense-form';
import { FileWithPreview } from './file-upload';

export interface ExpenseFormProps {
    register: UseFormRegister<ExpenseFormData>;
    control: Control<ExpenseFormData>;
    errors: FieldErrors<ExpenseFormData>;
    isScanning: boolean;
    selectedCurrency: string;
    workspaceCurrency: string;
    exchangeRate: number;
    manualExchangeRate: string;
    supportedCurrencies: string[];
    currencySearchKeyword: string;
    filteredCurrencies: string[];
    isCurrencyPopoverOpen: boolean;
    amountValue: number;
    onCurrencyChange: (currency: string) => void;
    onCurrencySearchChange: (keyword: string) => void;
    onCurrencyPopoverOpenChange: (open: boolean) => void;
    onManualExchangeRateChange: (value: string) => void;
    // Mobile-only props
    isMobile?: boolean;
    files?: FileWithPreview[];
    onFileClick?: () => void;
    hasFormChanges?: boolean;
    isSubmitting?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
}

export default function ExpenseForm({
    register,
    control,
    errors,
    isScanning,
    selectedCurrency,
    workspaceCurrency,
    exchangeRate,
    manualExchangeRate,
    supportedCurrencies,
    currencySearchKeyword,
    filteredCurrencies,
    isCurrencyPopoverOpen,
    amountValue,
    onCurrencyChange,
    onCurrencySearchChange,
    onCurrencyPopoverOpenChange,
    onManualExchangeRateChange,
    isMobile = false,
    files = [],
    onFileClick = () => {},
    hasFormChanges = false,
    isSubmitting = false,
    onCancel = () => {},
    onSave = () => {},
}: ExpenseFormProps) {
    const t = useTranslations('aiExpense');
    const formatCurrency = useCurrencyFormatter();

    if (isMobile) {
        return (
            <MobileExpenseForm
                register={register}
                control={control}
                errors={errors}
                isScanning={isScanning}
                files={files}
                onFileClick={onFileClick}
                hasFormChanges={hasFormChanges}
                isSubmitting={isSubmitting}
                onCancel={onCancel}
                onSave={onSave}
                selectedCurrency={selectedCurrency}
                workspaceCurrency={workspaceCurrency}
                exchangeRate={exchangeRate}
                manualExchangeRate={manualExchangeRate}
                isLoadingExchangeRate={false}
                supportedCurrencies={supportedCurrencies}
                currencySearchKeyword={currencySearchKeyword}
                isCurrencyPopoverOpen={isCurrencyPopoverOpen}
                amountValue={amountValue}
                onCurrencyChange={onCurrencyChange}
                onCurrencySearchChange={onCurrencySearchChange}
                onCurrencyPopoverOpenChange={onCurrencyPopoverOpenChange}
                onManualExchangeRateChange={onManualExchangeRateChange}
            />
        );
    }

    // Desktop form fields
    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {/* Date */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="date">{t('date')} *</Label>
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => {
                        const dateValue = field.value ? dayjs(field.value).toDate() : undefined;
                        return (
                            <DatePicker
                                date={dateValue}
                                onDateChange={(date) => {
                                    if (date) {
                                        field.onChange(dayjs(date).format('YYYY-MM-DD'));
                                    } else {
                                        field.onChange('');
                                    }
                                }}
                                disabled={isScanning}
                                placeholder={t('select date')}
                                error={!!errors.date}
                                dateFormat="YYYY-MM-DD"
                                showIcon={true}
                                buttonClassName={cn(
                                    "w-1/2",
                                    errors.date ? 'border-destructive' : ''
                                )}
                            />
                        );
                    }}
                />
                {errors.date && (
                    <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
            </div>

            {/* Merchant */}
            <div className="space-y-2">
                <Label htmlFor="merchant">{t('merchant')} *</Label>
                <Input
                    id="merchant"
                    {...register('merchant')}
                    placeholder={t('enter merchant name')}
                    className={errors.merchant ? 'border-destructive' : ''}
                    disabled={isScanning}
                />
                {errors.merchant && (
                    <p className="text-sm text-destructive">{errors.merchant.message}</p>
                )}
            </div>

            {/* Currency and Amount */}
            <CurrencySelect
                id="currency"
                label={t('currency')}
                selectedCurrency={selectedCurrency}
                currencySearchKeyword={currencySearchKeyword}
                filteredCurrencies={filteredCurrencies}
                isOpen={isCurrencyPopoverOpen}
                onOpenChange={onCurrencyPopoverOpenChange}
                onCurrencyChange={onCurrencyChange}
                onSearchChange={onCurrencySearchChange}
                placeholder={t('select currency')}
                emptyMessage={t('no currencies found')}
                searchPrompt={t('start typing to search...')}
                disabled={isScanning}
            />

            {/* Exchange Rate (show only if currency differs from workspace) */}
            {selectedCurrency !== workspaceCurrency && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="exchange-rate">
                            {t('exchange rate')} ({selectedCurrency} → {workspaceCurrency})
                        </Label>
                    </div>
                    <Input
                        id="exchange-rate"
                        type="number"
                        step="0.000001"
                        min="0"
                        value={manualExchangeRate}
                        onChange={(e) => onManualExchangeRateChange(e.target.value)}
                        placeholder="1.000000"
                        disabled={isScanning}
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('amount will be converted to')} {workspaceCurrency}
                    </p>
                </div>
            )}

            {/* Amount */}
            <div className="space-y-2">
                <Label htmlFor="amount">
                    {t('amount')} {selectedCurrency !== workspaceCurrency && `(${selectedCurrency})`} *
                </Label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('amount', { valueAsNumber: true })}
                    placeholder="0.00"
                    className={errors.amount ? 'border-destructive' : ''}
                    disabled={isScanning}
                />
                {selectedCurrency !== workspaceCurrency && amountValue > 0 && exchangeRate > 0 && (
                    <p className="text-sm text-muted-foreground">
                        {t('equals')} {formatCurrency(amountValue * exchangeRate)} ({workspaceCurrency})
                    </p>
                )}
                {errors.amount && (
                    <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    rows={5}
                    disabled={isScanning}
                />
            </div>
        </form>
    );
}
