'use client';

import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileWithPreview } from './file-upload';
import { Paperclip, Loader2, Search, Check } from 'lucide-react';
import { useTranslation } from '@/components/contexts/translation.context';
import { useCurrencyFormatter } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { ExpenseFormData } from './form/schema';
import { format } from 'date-fns';
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
    const { t } = useTranslation();
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
                                <div className="space-y-1">
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
                                            // Parse date string as local time to avoid timezone issues
                                            const dateValue = field.value ? (() => {
                                                const [year, month, day] = field.value.split('-').map(Number);
                                                return new Date(year, month - 1, day);
                                            })() : undefined;
                                            return (
                                                <DatePicker
                                                    date={dateValue}
                                                    onDateChange={(date) => {
                                                        if (date) {
                                                            field.onChange(format(date, 'yyyy-MM-dd'));
                                                        } else {
                                                            field.onChange('');
                                                        }
                                                    }}
                                                    disabled={isScanning}
                                                    placeholder={t('select date')}
                                                    error={!!errors.date}
                                                    dateFormat="yyyy-MM-dd"
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
                        <div className="space-y-2">
                            <Label htmlFor="currency-mobile">{t('currency')}</Label>
                            <Popover open={isCurrencyPopoverOpen} onOpenChange={onCurrencyPopoverOpenChange}>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                                        <Input
                                            id="currency-mobile"
                                            value={selectedCurrency || currencySearchKeyword}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                onCurrencySearchChange(value);
                                                onCurrencyPopoverOpenChange(true);
                                                if (selectedCurrency && value !== selectedCurrency) {
                                                    onCurrencyChange('');
                                                }
                                            }}
                                            onFocus={() => {
                                                onCurrencyPopoverOpenChange(true);
                                            }}
                                            placeholder={t('select currency')}
                                            className="pl-9 w-full"
                                            disabled={isScanning}
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] p-0"
                                    align="start"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                >
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {filteredCurrencies.length === 0 ? (
                                            <div className="p-4 text-sm text-muted-foreground text-center">
                                                {currencySearchKeyword.trim()
                                                    ? t('no currencies found')
                                                    : t('start typing to search...')}
                                            </div>
                                        ) : (
                                            filteredCurrencies.map((currency) => (
                                                <button
                                                    key={currency}
                                                    type="button"
                                                    onClick={() => {
                                                        onCurrencyChange(currency);
                                                        onCurrencyPopoverOpenChange(false);
                                                    }}
                                                    className={cn(
                                                        'w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center justify-between',
                                                        selectedCurrency === currency && 'bg-primary/5'
                                                    )}
                                                >
                                                    <span>{currency}</span>
                                                    {selectedCurrency === currency && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
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

                    {/* Remark */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                        <div className="text-sm font-medium text-slate-500 mb-2">
                            {t('remark')}
                        </div>
                        <Textarea
                            id="remark-mobile"
                            {...register('remark')}
                            rows={5}
                            placeholder={t('additional notes or remarks')}
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
