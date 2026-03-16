'use client';

import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencySelect } from './currency-select';
import { FileWithPreview } from './file-upload';
import { Paperclip, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrencyFormatter } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { ExpenseFormData } from './form/schema';
import { dayjs } from '@/lib/date';
import FileThumbnail from './file-thumbnail';
import { isPdfUrl } from './file-utils';
import { useMemo } from 'react';

interface MobileExpenseFormProps {
    register: UseFormRegister<ExpenseFormData>;
    control: Control<ExpenseFormData>;
    errors: FieldErrors<ExpenseFormData>;
    isScanning: boolean;
    files: FileWithPreview[];
    onFileClick: () => void;
    hasFormChanges: boolean;
    isSubmitting: boolean;
    onCancel: () => void;
    onSave: () => void;
    // Currency props
    selectedCurrency: string;
    workspaceCurrency: string;
    exchangeRate: number;
    manualExchangeRate: string;
    isLoadingExchangeRate: boolean;
    supportedCurrencies: string[];
    currencySearchKeyword: string;
    isCurrencyPopoverOpen: boolean;
    amountValue: number;
    onCurrencyChange: (currency: string) => void;
    onCurrencySearchChange: (keyword: string) => void;
    onCurrencyPopoverOpenChange: (open: boolean) => void;
    onManualExchangeRateChange: (value: string) => void;
}

export default function MobileExpenseForm({
    register,
    control,
    errors,
    isScanning,
    files,
    onFileClick,
    hasFormChanges,
    isSubmitting,
    onCancel,
    onSave,
    selectedCurrency,
    workspaceCurrency,
    exchangeRate,
    manualExchangeRate,
    isLoadingExchangeRate,
    supportedCurrencies,
    currencySearchKeyword,
    isCurrencyPopoverOpen,
    amountValue,
    onCurrencyChange,
    onCurrencySearchChange,
    onCurrencyPopoverOpenChange,
    onManualExchangeRateChange,
}: MobileExpenseFormProps) {
    const t = useTranslations('aiExpense');
    const formatCurrency = useCurrencyFormatter();

    // Filter currencies based on search keyword
    const filteredCurrencies = useMemo(() => {
        if (!currencySearchKeyword.trim()) {
            return supportedCurrencies;
        }
        const keyword = currencySearchKeyword.toLowerCase().trim();
        return supportedCurrencies.filter((currency) =>
            currency.toLowerCase().includes(keyword)
        );
    }, [supportedCurrencies, currencySearchKeyword]);

    return (
        <>
            {/* Mobile Form Content */}
            <div className="md:hidden h-full overflow-y-auto px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+120px)]">
                <div className="mx-auto w-full max-w-md space-y-4">
                    {/* Date + Merchant + Attach */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-[1fr_132px] gap-4 p-4">
                            <div className="space-y-5">
                                {/* Date */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="date-mobile"
                                        className="text-sm font-medium text-slate-500 cursor-pointer"
                                    >
                                        {t('expense date')}
                                        <span className="text-red-500"> *</span>
                                    </label>
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
                                                    showIcon={false}
                                                    buttonClassName={cn(
                                                        "w-full bg-transparent text-2xl font-semibold tracking-tight text-slate-900 outline-none border-b-2 border-slate-300 focus:border-slate-500 justify-start h-auto hover:bg-transparent",
                                                        errors.date ? 'text-red-600 border-red-500' : undefined
                                                    )}
                                                />
                                            );
                                        }}
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-red-600">{errors.date.message}</p>
                                    )}
                                </div>

                                {/* Merchant */}
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-slate-500">
                                        {t('merchant')}
                                        <span className="text-red-500"> *</span>
                                    </div>
                                    <input
                                        id="merchant-mobile"
                                        {...register('merchant')}
                                        placeholder={t('enter merchant name')}
                                        className={cn(
                                            "w-full bg-transparent p-0 pb-2 text-xl font-medium text-slate-900 placeholder:text-slate-400 outline-none border-b-2 border-slate-300 focus:border-slate-500",
                                            errors.merchant ? 'text-red-600 placeholder:text-red-300 border-red-500' : undefined
                                        )}
                                        disabled={isScanning}
                                    />
                                    {errors.merchant && (
                                        <p className="text-sm text-red-600">{errors.merchant.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Attach receipt tile */}
                            <div className="relative">
                                {files.length > 0 && files[0] ? (
                                    <button
                                        type="button"
                                        onClick={onFileClick}
                                        className="h-[132px] w-full rounded-2xl overflow-hidden relative group"
                                        disabled={isScanning}
                                    >
                                        <FileThumbnail
                                            url={files[0].preview === 'pdf' ? files[0].base64 : files[0].preview}
                                            size="large"
                                            className="w-full h-full rounded-2xl"
                                            onClick={(e) => {
                                                e?.stopPropagation();
                                                onFileClick();
                                            }}
                                        />
                                        {files.length > 1 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                                                <div className="rounded-lg bg-black/60 px-3 py-1.5 text-lg font-semibold text-white">
                                                    +{files.length - 1}
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={onFileClick}
                                        className="h-[132px] w-full rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center gap-2 active:bg-slate-100"
                                        disabled={isScanning}
                                    >
                                        <Paperclip className="h-7 w-7 text-slate-500" />
                                        <div className="text-sm font-semibold text-slate-600 leading-tight">
                                            {t('attach receipt')}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {t('tap to attach')}
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Currency */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                        <CurrencySelect
                            id="currency-mobile"
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
                    </div>

                    {/* Exchange Rate (show only if currency differs from workspace) */}
                    {selectedCurrency !== workspaceCurrency && (
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="exchange-rate-mobile">
                                        {t('exchange rate')} ({selectedCurrency} → {workspaceCurrency})
                                    </Label>
                                    {isLoadingExchangeRate && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                                <Input
                                    id="exchange-rate-mobile"
                                    type="number"
                                    step="0.000001"
                                    min="0"
                                    value={manualExchangeRate}
                                    onChange={(e) => onManualExchangeRateChange(e.target.value)}
                                    placeholder="1.000000"
                                    disabled={isScanning || isLoadingExchangeRate}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('amount will be converted to')} {workspaceCurrency}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                        <div className="space-y-1">
                            <div className="text-sm font-medium text-slate-500">
                                {t('amount')} {selectedCurrency !== workspaceCurrency && `(${selectedCurrency})`}
                                <span className="text-red-500"> *</span>
                            </div>
                            <input
                                id="amount-mobile"
                                type="number"
                                step="0.01"
                                min="0"
                                {...register('amount', { valueAsNumber: true })}
                                placeholder="0.00"
                                className={cn(
                                    "w-full bg-transparent p-0 pb-2 text-4xl font-semibold tracking-tight text-slate-900 outline-none border-b-2 border-slate-300 focus:border-slate-500",
                                    errors.amount ? 'text-red-600 placeholder:text-red-300 border-red-500' : undefined
                                )}
                                disabled={isScanning}
                            />
                            {selectedCurrency !== workspaceCurrency && amountValue > 0 && exchangeRate > 0 && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t('equals')} {formatCurrency(amountValue * exchangeRate)} ({workspaceCurrency})
                                </p>
                            )}
                            {errors.amount && (
                                <p className="text-sm text-red-600">{errors.amount.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                        <div className="text-sm font-medium text-slate-500 mb-2">
                            {t('description')}
                        </div>
                        <Textarea
                            id="description-mobile"
                            {...register('description')}
                            rows={5}
                            placeholder={t('brief description of the expense')}
                            className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-slate-300 border-b-2 border-slate-300 focus:border-slate-500"
                            disabled={isScanning}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 bg-white px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                <div className="mx-auto w-full max-w-md grid grid-cols-2 gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="h-12 rounded-xl"
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Call handleSubmit - it can be called without an event
                            onSave();
                        }}
                        disabled={isSubmitting || isScanning}
                        className="h-12 rounded-xl"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('save')}
                    </Button>
                </div>
            </div>
        </>
    );
}
