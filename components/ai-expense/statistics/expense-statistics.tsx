'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getExpenseStatistics } from '@/lib/api-stubs';
import { ExpenseStatisticItem } from '@/types/expense';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { format, subDays, subMonths, subWeeks, subQuarters, subYears, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, startOfDay, endOfDay } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/components/contexts/translation.context';
import { useCurrencyFormatter } from '@/lib/currency';
import ExpenseStatisticsFilterBar from './expense-statistics-filter-bar';
import { Card } from '@/components/ui/card';

interface ExpenseStatisticsProps {
    showFilters?: boolean;
    onToggleFilters?: () => void;
}

export default function ExpenseStatistics({ showFilters = false, onToggleFilters }: ExpenseStatisticsProps) {
    const { t } = useTranslation();
    const formatCurrency = useCurrencyFormatter();
    const [statistics, setStatistics] = useState<ExpenseStatisticItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(() => {
        const date = subMonths(new Date(), 1);
        return format(date, 'yyyy-MM-dd');
    });
    const [toDate, setToDate] = useState(() => {
        return format(new Date(), 'yyyy-MM-dd');
    });
    const [rangeType, setRangeType] = useState<'day' | 'month' | 'quarter'>('day');
    const [dateRangePreset, setDateRangePreset] = useState<string>('custom');
    const [isMobile, setIsMobile] = useState(false);
    const hasSwitchedFromCustomRef = useRef(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        // Check on mount
        checkIsMobile();

        // Listen for resize events
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Auto-switch from custom to thisMonth on mobile (only once when mobile is detected)
    useEffect(() => {
        if (isMobile && dateRangePreset === 'custom' && !hasSwitchedFromCustomRef.current) {
            const now = new Date();
            const from = startOfMonth(now);
            const to = endOfMonth(now);
            setDateRangePreset('thisMonth');
            setFromDate(format(from, 'yyyy-MM-dd'));
            setToDate(format(to, 'yyyy-MM-dd'));
            hasSwitchedFromCustomRef.current = true;
        }
        // Reset ref when switching back to desktop
        if (!isMobile) {
            hasSwitchedFromCustomRef.current = false;
        }
    }, [isMobile, dateRangePreset]);

    const loadStatistics = useCallback(async () => {
        if (!fromDate || !toDate) {
            toast.error(t('please select both from and to dates'));
            return;
        }

        // Validate date range
        const from = new Date(fromDate + 'T00:00:00');
        const to = new Date(toDate + 'T00:00:00');
        if (from > to) {
            toast.error(t('from date must be less than or equal to to date'));
            return;
        }

        setLoading(true);
        try {
            const fromTimestamp = Math.floor(from.getTime() / 1000);
            const toTimestamp = Math.floor(to.getTime() / 1000);

            const response = await getExpenseStatistics(fromTimestamp, toTimestamp, rangeType);
            setStatistics(response.data.data || []);
        } catch (error: any) {
            console.error('Failed to load statistics:', error);
            toast.error(t('failed to load statistics'));
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate, rangeType, t]);

    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    const formatChartDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        switch (rangeType) {
            case 'day':
                return format(date, 'MMM dd');
            case 'month':
                return format(date, 'MMM yyyy');
            case 'quarter':
                return format(date, 'QQQ yyyy');
            default:
                return format(date, 'MMM dd');
        }
    };

    // Format currency for chart display (no decimals)
    const formatCurrencyForChart = (value: number) => {
        const formatted = formatCurrency(value);
        // Remove decimal part if it's .00
        return formatted.replace(/\.00$/, '');
    };

    const chartConfig: ChartConfig = {
        amount: {
            label: t('amount'),
        },
        transactions: {
            label: t('transactions'),
        },
    };

    const totalAmount = statistics.reduce((sum, item) => sum + item.amount, 0);
    const totalTransactions = statistics.reduce((sum, item) => sum + item.transactions, 0);
    const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    const chartData = statistics.map((item) => ({
        date: formatChartDate(item.date),
        timestamp: item.date,
        amount: item.amount || 0,
        transactions: item.transactions || 0,
    }));

    const dateRangePresets = [
        { value: 'thisWeek', label: t('this week') },
        { value: 'thisMonth', label: t('this month') },
        { value: 'thisQuarter', label: t('this quarter') },
        { value: 'thisYear', label: t('this year') },
        { value: 'today', label: t('today') },
        { value: 'yesterday', label: t('yesterday') },
        { value: 'previousWeek', label: t('previous week') },
        { value: 'previousMonth', label: t('previous month') },
        { value: 'previousQuarter', label: t('previous quarter') },
        { value: 'previousYear', label: t('previous year') },
        { value: 'custom', label: t('custom') },
    ];

    const applyDateRangePreset = (preset: string) => {
        setDateRangePreset(preset);
        const now = new Date();
        let from: Date;
        let to: Date;

        switch (preset) {
            case 'thisWeek':
                from = startOfWeek(now, { weekStartsOn: 1 }); // Monday
                to = endOfWeek(now, { weekStartsOn: 1 });
                break;
            case 'thisMonth':
                from = startOfMonth(now);
                to = endOfMonth(now);
                break;
            case 'thisQuarter':
                from = startOfQuarter(now);
                to = endOfQuarter(now);
                break;
            case 'thisYear':
                from = startOfYear(now);
                to = endOfYear(now);
                break;
            case 'today':
                from = startOfDay(now);
                to = endOfDay(now);
                break;
            case 'yesterday':
                const yesterday = subDays(now, 1);
                from = startOfDay(yesterday);
                to = endOfDay(yesterday);
                break;
            case 'previousWeek':
                const lastWeek = subWeeks(now, 1);
                from = startOfWeek(lastWeek, { weekStartsOn: 1 });
                to = endOfWeek(lastWeek, { weekStartsOn: 1 });
                break;
            case 'previousMonth':
                const lastMonth = subMonths(now, 1);
                from = startOfMonth(lastMonth);
                to = endOfMonth(lastMonth);
                break;
            case 'previousQuarter':
                const lastQuarter = subQuarters(now, 1);
                from = startOfQuarter(lastQuarter);
                to = endOfQuarter(lastQuarter);
                break;
            case 'previousYear':
                const lastYear = subYears(now, 1);
                from = startOfYear(lastYear);
                to = endOfYear(lastYear);
                break;
            case 'custom':
            default:
                // Don't change dates for custom, user will select manually
                return;
        }

        setFromDate(format(from, 'yyyy-MM-dd'));
        setToDate(format(to, 'yyyy-MM-dd'));
    };

    const hasActiveFilters = !!(fromDate || toDate);

    const clearAllFilters = () => {
        setDateRangePreset('custom');
        const date = subMonths(new Date(), 1);
        setFromDate(format(date, 'yyyy-MM-dd'));
        setToDate(format(new Date(), 'yyyy-MM-dd'));
    };

    return (
        <div className="space-y-6">
            <ExpenseStatisticsFilterBar
                dateRangePreset={dateRangePreset}
                onDateRangePresetChange={applyDateRangePreset}
                fromDate={fromDate}
                onFromDateChange={setFromDate}
                toDate={toDate}
                onToDateChange={setToDate}
                rangeType={rangeType}
                onRangeTypeChange={setRangeType}
                dateRangePresets={dateRangePresets}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
            />

            {/* Content Area */}
            <Card className="space-y-6">

                {/* Current Time Range Display */}
                <div className="flex items-center justify-center gap-2 px-1">
                    <span className="inline-flex items-center rounded-md px-3 py-1 text-sm md:text-base font-semibold text-foreground font-mono tracking-wide">
                        {fromDate}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    <span className="inline-flex items-center rounded-md px-3 py-1 text-sm md:text-base font-semibold text-foreground font-mono tracking-wide">
                        {toDate}
                    </span>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* No card UI for these two */}
                    <div className="px-1 py-2 text-center">
                        <div className="text-sm text-muted-foreground">{t('total amount')}</div>
                        <div className="text-2xl font-bold mt-1">{formatCurrency(totalAmount)}</div>
                    </div>
                    <div className="px-1 py-2 text-center">
                        <div className="text-sm text-muted-foreground">{t('total transactions')}</div>
                        <div className="text-2xl font-bold mt-1">{totalTransactions}</div>
                    </div>

                    <div className="px-1 py-2 text-center">
                        <div className="text-sm text-muted-foreground">{t('average amount')}</div>
                        <div className="text-2xl font-bold mt-1">{formatCurrency(averageAmount)}</div>
                    </div>
                </div>

                {/* Charts */}
                {loading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">{t('loading statistics...')}</p>
                    </div>
                ) : statistics.length === 0 || chartData.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {t('no data available for the selected date range')}
                    </div>
                ) : (
                    <div className="space-y-6 px-0 md:px-4">
                        {/* Amount Chart */}
                        <Card className="p-2 md:p-4 overflow-hidden">
                            <h3 className="text-lg font-semibold mb-4">{t('expense amount over time')}</h3>
                            <div className="w-full overflow-x-auto">
                                <ChartContainer config={chartConfig} className={`w-full h-[300px] ${isMobile ? 'min-w-[300px]' : ''}`}>
                                    <BarChart
                                        data={chartData}
                                        margin={isMobile ? {
                                            top: 10,
                                            right: 10,
                                            left: 0,
                                            bottom: 30
                                        } : {
                                            top: 10,
                                            right: 10,
                                            left: 0,
                                            bottom: 10
                                        }}
                                    >
                                        <CartesianGrid />
                                        <XAxis
                                            dataKey="date"
                                            angle={isMobile ? -45 : 0}
                                            textAnchor={isMobile ? 'end' : 'middle'}
                                            height={isMobile ? 60 : 30}
                                            tick={{ fontSize: isMobile ? 10 : 12 }}
                                        />
                                        <YAxis
                                            tickFormatter={formatCurrencyForChart}
                                            width={isMobile ? 50 : 80}
                                            tick={{ fontSize: isMobile ? 10 : 12 }}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                                        <ChartLegend
                                            content={<ChartLegendContent payload={[
                                                { dataKey: 'amount', type: 'rect', value: 'amount', color: '#a855f7' },
                                            ]} />}
                                        />
                                        <Bar
                                            dataKey="amount"
                                            name="amount"
                                            fill="#a855f7"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        </Card>

                        {/* Transactions Chart */}
                        <Card className="p-2 md:p-4 overflow-hidden">
                            <h3 className="text-lg font-semibold mb-4">{t('number of transactions')}</h3>
                            <div className="w-full overflow-x-auto">
                                <ChartContainer config={chartConfig} className={`w-full h-[300px] ${isMobile ? 'min-w-[300px]' : ''}`}>
                                    <BarChart
                                        data={chartData}
                                        margin={isMobile ? {
                                            top: 10,
                                            right: 10,
                                            left: 0,
                                            bottom: 30
                                        } : {
                                            top: 10,
                                            right: 10,
                                            left: 0,
                                            bottom: 10
                                        }}
                                    >
                                        <CartesianGrid />
                                        <XAxis
                                            dataKey="date"
                                            angle={isMobile ? -45 : 0}
                                            textAnchor={isMobile ? 'end' : 'middle'}
                                            height={isMobile ? 60 : 30}
                                            tick={{ fontSize: isMobile ? 10 : 12 }}
                                        />
                                        <YAxis
                                            width={isMobile ? 50 : 80}
                                            tick={{ fontSize: isMobile ? 10 : 12 }}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                                        <ChartLegend
                                            content={<ChartLegendContent payload={[
                                                { dataKey: 'transactions', type: 'rect', value: 'transactions', color: '#ec4899' },
                                            ]} />}
                                        />
                                        <Bar
                                            dataKey="transactions"
                                            name="transactions"
                                            fill="#ec4899"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        </Card>

                        {/* Combined Chart - Hidden on mobile */}
                        {!isMobile && (
                            <Card className="p-4">
                                <h3 className="text-lg font-semibold mb-4">{t('amount and transactions')}</h3>
                                <ChartContainer config={chartConfig} className="h-[400px]">
                                    <BarChart data={chartData}>
                                        <CartesianGrid />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" tickFormatter={formatCurrencyForChart} />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                                        <ChartLegend
                                            content={<ChartLegendContent payload={[
                                                { dataKey: 'amount', type: 'rect', value: 'amount', color: '#a855f7' },
                                                { dataKey: 'transactions', type: 'rect', value: 'transactions', color: '#ec4899' },
                                            ]} />}
                                        />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="amount"
                                            name="amount"
                                            fill="#a855f7"
                                            radius={[8, 8, 0, 0]}
                                        />
                                        <Bar
                                            yAxisId="right"
                                            dataKey="transactions"
                                            name="transactions"
                                            fill="#ec4899"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </Card>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}
