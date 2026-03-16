'use client';

import { Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { FieldGroup } from '@/components/ui/field';
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
    onFileClick = () => { },
    hasFormChanges = false,
    isSubmitting = false,
    onCancel = () => { },
    onSave = () => { },
}: ExpenseFormProps) {
    const t = useTranslations('aiExpense');
    const formatCurrency = useCurrencyFormatter();

    if (isMobile) {
        return (
            <MobileExpenseForm
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
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <FieldGroup className="gap-4">
                {/* Date */}
                <FormField<ExpenseFormData>
                    id="date"
                    label={t('date')}
                    required
                    controller={{
                        name: 'date',
                        control,
                        render: ({ field, fieldState }) => (
                            <DatePicker
                                date={field.value ? dayjs(field.value).toDate() : undefined}
                                onDateChange={(date) => {
                                    if (date) {
                                        field.onChange(dayjs(date).format('YYYY-MM-DD'));
                                    } else {
                                        field.onChange('');
                                    }
                                }}
                                disabled={isScanning}
                                placeholder={t('select date')}
                                error={!!fieldState.invalid}
                                dateFormat="YYYY-MM-DD"
                                showIcon={true}
                                buttonClassName={cn(
                                    "w-1/2",
                                    fieldState.invalid ? 'border-destructive' : ''
                                )}
                            />
                        ),
                    }}
                />

                {/* Merchant */}
                <FormField<ExpenseFormData>
                    id="merchant"
                    label={t('merchant')}
                    required
                    controller={{
                        name: 'merchant',
                        control,
                        render: ({ field, fieldState }) => (
                            <Input
                                {...field}
                                id="merchant"
                                aria-invalid={fieldState.invalid}
                                placeholder={t('enter merchant name')}
                                className={fieldState.invalid ? 'border-destructive' : ''}
                                disabled={isScanning}
                            />
                        ),
                    }}
                />

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
                    <FormField
                        id="exchange-rate"
                        label={
                            <>
                                {t('exchange rate')} ({selectedCurrency} → {workspaceCurrency})
                            </>
                        }
                        hint={`${t('amount will be converted to')} ${workspaceCurrency}`}
                    >
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
                    </FormField>
                )}

                {/* Amount */}
                <FormField<ExpenseFormData>
                    id="amount"
                    label={
                        <>
                            {t('amount')} {selectedCurrency !== workspaceCurrency && `(${selectedCurrency})`}
                        </>
                    }
                    required
                    hint={
                        selectedCurrency !== workspaceCurrency && amountValue > 0 && exchangeRate > 0
                            ? `${t('equals')} ${formatCurrency(amountValue * exchangeRate)} (${workspaceCurrency})`
                            : undefined
                    }
                    hintClassName="text-sm"
                    controller={{
                        name: 'amount',
                        control,
                        render: ({ field, fieldState }) => (
                            <Input
                                {...field}
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                aria-invalid={fieldState.invalid}
                                placeholder="0.00"
                                className={fieldState.invalid ? 'border-destructive' : ''}
                                disabled={isScanning}
                            />
                        ),
                    }}
                />

                {/* Description */}
                <FormField<ExpenseFormData>
                    id="description"
                    label={t('description')}
                    controller={{
                        name: 'description',
                        control,
                        render: ({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                id="description"
                                rows={5}
                                aria-invalid={fieldState.invalid}
                                disabled={isScanning}
                            />
                        ),
                    }}
                />
            </FieldGroup>
        </form>
    );
}
