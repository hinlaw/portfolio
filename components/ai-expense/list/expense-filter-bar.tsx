'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/components/contexts/translation.context';
import { format } from 'date-fns';

interface ExpenseFilterBarProps {
    showFilters: boolean;
    keyword: string;
    onKeywordChange: (value: string) => void;
    fromDate: string;
    onFromDateChange: (value: string) => void;
    toDate: string;
    onToDateChange: (value: string) => void;
    minAmount: string;
    onMinAmountChange: (value: string) => void;
    maxAmount: string;
    onMaxAmountChange: (value: string) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export default function ExpenseFilterBar({
    showFilters,
    keyword,
    onKeywordChange,
    fromDate,
    onFromDateChange,
    toDate,
    onToDateChange,
    minAmount,
    onMinAmountChange,
    maxAmount,
    onMaxAmountChange,
    hasActiveFilters,
    onClearFilters,
}: ExpenseFilterBarProps) {
    const { t } = useTranslation();

    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
        >
            <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-4">
                {/* Filter Icon */}
                <Filter className="h-5 w-5 text-muted-foreground shrink-0" />

                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                    <Label htmlFor="fromDate" className="text-sm whitespace-nowrap">
                        {t('date')}
                    </Label>
                    <div className="flex items-center gap-1">
                        <DatePicker
                            date={fromDate ? new Date(fromDate + 'T00:00:00') : undefined}
                            onDateChange={(date) => {
                                if (date) {
                                    const newFromDate = format(date, 'yyyy-MM-dd');
                                    // If selected date is after toDate, adjust toDate to match
                                    if (toDate && new Date(newFromDate + 'T00:00:00') > new Date(toDate + 'T00:00:00')) {
                                        onToDateChange(newFromDate);
                                    }
                                    onFromDateChange(newFromDate);
                                } else {
                                    onFromDateChange('');
                                }
                            }}
                            placeholder={t('from date')}
                            dateFormat="yyyy-MM-dd"
                            showIcon={false}
                            buttonClassName="w-32 h-9 text-sm"
                            disabledDates={toDate ? (date) => date > new Date(toDate + 'T00:00:00') : undefined}
                        />
                        <span className="text-muted-foreground">-</span>
                        <DatePicker
                            date={toDate ? new Date(toDate + 'T00:00:00') : undefined}
                            onDateChange={(date) => {
                                if (date) {
                                    const newToDate = format(date, 'yyyy-MM-dd');
                                    // If selected date is before fromDate, adjust fromDate to match
                                    if (fromDate && new Date(newToDate + 'T00:00:00') < new Date(fromDate + 'T00:00:00')) {
                                        onFromDateChange(newToDate);
                                    }
                                    onToDateChange(newToDate);
                                } else {
                                    onToDateChange('');
                                }
                            }}
                            placeholder={t('to date')}
                            dateFormat="yyyy-MM-dd"
                            showIcon={false}
                            buttonClassName="w-32 h-9 text-sm"
                            disabledDates={fromDate ? (date) => date < new Date(fromDate + 'T00:00:00') : undefined}
                        />
                    </div>
                </div>

                {/* Amount Range Filter */}
                <div className="flex items-center gap-2">
                    <Label htmlFor="minAmount" className="text-sm whitespace-nowrap">
                        {t('amount')}
                    </Label>
                    <div className="flex items-center gap-1">
                        <Input
                            id="minAmount"
                            type="number"
                            step="0.01"
                            placeholder={t('min')}
                            value={minAmount}
                            onChange={(e) => onMinAmountChange(e.target.value)}
                            className="w-24 h-9 text-sm"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            id="maxAmount"
                            type="number"
                            step="0.01"
                            placeholder={t('max')}
                            value={maxAmount}
                            onChange={(e) => onMaxAmountChange(e.target.value)}
                            className="w-24 h-9 text-sm"
                        />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 ml-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="keyword"
                        placeholder={t('search merchant, description...')}
                        value={keyword}
                        onChange={(e) => onKeywordChange(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>

                {/* Reset Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    disabled={!hasActiveFilters}
                    className="shrink-0"
                >
                    {t('reset')}
                </Button>
            </div>
        </div>
    );
}
