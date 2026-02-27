'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Filter } from 'lucide-react';
import { useTranslation } from '@/components/contexts/translation.context';

interface DateRangePreset {
    value: string;
    label: string;
}

interface ExpenseStatisticsFilterBarProps {
    dateRangePreset: string;
    onDateRangePresetChange: (preset: string) => void;
    fromDate: string;
    onFromDateChange: (date: string) => void;
    toDate: string;
    onToDateChange: (date: string) => void;
    rangeType: 'day' | 'month' | 'quarter';
    onRangeTypeChange: (type: 'day' | 'month' | 'quarter') => void;
    dateRangePresets: DateRangePreset[];
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export default function ExpenseStatisticsFilterBar({
    dateRangePreset,
    onDateRangePresetChange,
    fromDate,
    onFromDateChange,
    toDate,
    onToDateChange,
    rangeType,
    onRangeTypeChange,
    dateRangePresets,
    hasActiveFilters,
    onClearFilters,
}: ExpenseStatisticsFilterBarProps) {
    const { t } = useTranslation();

    const handleFromDateChange = (date: Date | undefined) => {
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
    };

    const handleToDateChange = (date: Date | undefined) => {
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
    };

    return (
        <>
            {/* Desktop Filter Bar - Sticky, always visible */}
            <div className="hidden md:block">
                <div className="sticky top-[0px] z-10">
                    <div className="bg-muted/50 rounded-lg p-2 flex items-center gap-4">
                        {/* Filter Icon */}
                        <Filter className="h-5 w-5 text-muted-foreground shrink-0" />

                        {/* Date Range Preset Selector */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="dateRangePreset" className="text-sm whitespace-nowrap">
                                {t('date range')}
                            </Label>
                            <Select value={dateRangePreset} onValueChange={onDateRangePresetChange}>
                                <SelectTrigger className="w-[180px] h-9 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent side="bottom">
                                    {dateRangePresets.map((preset) => (
                                        <SelectItem key={preset.value} value={preset.value}>
                                            {preset.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range Filter - Only show when custom is selected */}
                        {dateRangePreset === 'custom' && (
                            <div className="flex items-center gap-2">
                                <Label htmlFor="fromDate" className="text-sm whitespace-nowrap">
                                    {t('date')}
                                </Label>
                                <div className="flex items-center gap-1">
                                    <DatePicker
                                        date={fromDate ? new Date(fromDate + 'T00:00:00') : undefined}
                                        onDateChange={handleFromDateChange}
                                        placeholder={t('from date')}
                                        dateFormat="yyyy-MM-dd"
                                        showIcon={false}
                                        buttonClassName="w-32 h-9 text-sm"
                                        disabledDates={toDate ? (date) => date > new Date(toDate + 'T00:00:00') : undefined}
                                    />
                                    <span className="text-muted-foreground">-</span>
                                    <DatePicker
                                        date={toDate ? new Date(toDate + 'T00:00:00') : undefined}
                                        onDateChange={handleToDateChange}
                                        placeholder={t('to date')}
                                        dateFormat="yyyy-MM-dd"
                                        showIcon={false}
                                        buttonClassName="w-32 h-9 text-sm"
                                        disabledDates={fromDate ? (date) => date < new Date(fromDate + 'T00:00:00') : undefined}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Range Type */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="rangeType" className="text-sm whitespace-nowrap">
                                {t('group by')}
                            </Label>
                            <Select value={rangeType} onValueChange={onRangeTypeChange}>
                                <SelectTrigger className="w-[140px] h-9 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">{t('day')}</SelectItem>
                                    <SelectItem value="month">{t('month')}</SelectItem>
                                    <SelectItem value="quarter">{t('quarter')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            disabled={!hasActiveFilters}
                            className="shrink-0 h-9"
                        >
                            {t('reset')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Bar - Always visible, similar to desktop but without custom option */}
            <div className="md:hidden">
                <div className="sticky top-[0px] z-10">
                    <div className="bg-muted/50 rounded-lg p-3 mx-4 flex items-center gap-3 flex-wrap">
                        {/* Filter Icon */}
                        <Filter className="h-5 w-5 text-muted-foreground shrink-0" />

                        {/* Date Range Preset Selector */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="dateRangePreset" className="text-sm whitespace-nowrap">
                                {t('date range')}
                            </Label>
                            <Select value={dateRangePreset} onValueChange={onDateRangePresetChange}>
                                <SelectTrigger className="w-[160px] h-9 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent side="bottom">
                                    {dateRangePresets
                                        .filter((preset) => preset.value !== 'custom')
                                        .map((preset) => (
                                            <SelectItem key={preset.value} value={preset.value}>
                                                {preset.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Range Type */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="rangeType" className="text-sm whitespace-nowrap">
                                {t('group by')}
                            </Label>
                            <Select value={rangeType} onValueChange={onRangeTypeChange}>
                                <SelectTrigger className="w-[120px] h-9 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">{t('day')}</SelectItem>
                                    <SelectItem value="month">{t('month')}</SelectItem>
                                    <SelectItem value="quarter">{t('quarter')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            disabled={!hasActiveFilters}
                            className="shrink-0 h-9 ml-auto"
                        >
                            {t('reset')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
