'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getExpenseStatistics } from '@/api/client/expenses';
import { useWorkspace } from '@/components/ai-expense/workspace-provider';
import { ExpenseStatisticItem } from '@/api/types/expense';
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
import { dayjs, formatChartDate } from '@/lib/date';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrencyFormatter } from '@/lib/currency';
import ExpenseStatisticsFilterBar from './expense-statistics-filter-bar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseStatisticsProps {
    showFilters?: boolean;
    onToggleFilters?: () => void;
}

export default function ExpenseStatistics({ showFilters = false, onToggleFilters }: ExpenseStatisticsProps) {
    const t = useTranslations('aiExpense');
    const formatCurrency = useCurrencyFormatter();
    const { activeWorkspaceId } = useWorkspace();
    const [statistics, setStatistics] = useState<ExpenseStatisticItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(() => dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
    const [toDate, setToDate] = useState(() => dayjs().format('YYYY-MM-DD'));
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
            const now = dayjs();
            setDateRangePreset('thisMonth');
            setFromDate(now.startOf('month').format('YYYY-MM-DD'));
            setToDate(now.endOf('month').format('YYYY-MM-DD'));
            hasSwitchedFromCustomRef.current = true;
        }
        if (!isMobile) {
            hasSwitchedFromCustomRef.current = false;
        }
    }, [isMobile, dateRangePreset]);

    const loadStatistics = useCallback(async () => {
        if (!activeWorkspaceId) return;
        if (!fromDate || !toDate) {
            toast.error(t('toast.please select both from and to dates'));
            return;
        }

        const from = dayjs(fromDate);
        const to = dayjs(toDate);
        if (from.isAfter(to)) {
            toast.error(t('toast.from date must be less than or equal to to date'));
            return;
        }

        setLoading(true);
        try {
            const fromTimestamp = from.startOf('day').unix();
            const toTimestamp = to.endOf('day').unix();

            const response = await getExpenseStatistics(activeWorkspaceId, fromTimestamp, toTimestamp, rangeType);
            setStatistics(response.data || []);
        } catch (error: any) {
            console.error('Failed to load statistics:', error);
            toast.error(t('toast.failed to load statistics'));
        } finally {
            setLoading(false);
        }
    }, [activeWorkspaceId, fromDate, toDate, rangeType, t]);

    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    const formatChartDateLocal = (value: number | string) => formatChartDate(value, rangeType);

    // Format currency for chart display (no decimals)
    const formatCurrencyForChart = (value: number) => {
        const formatted = formatCurrency(value);
        // Remove decimal part when it's .00 (e.g. "1,000.00 USD" -> "1,000 USD")
        return formatted.replace(/\.00(?=\s|$)/, '');
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
    const totalTransactions = statistics.reduce((sum, item) => sum + (item.transactions ?? item.count ?? 0), 0);
    const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    const chartData = statistics.map((item) => ({
        date: formatChartDateLocal(item.date),
        timestamp: item.date,
        amount: item.amount || 0,
        transactions: item.transactions ?? item.count ?? 0,
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
        const now = dayjs();
        let from: dayjs.Dayjs;
        let to: dayjs.Dayjs;

        switch (preset) {
            case 'thisWeek':
                from = now.startOf('isoWeek');
                to = now.endOf('isoWeek');
                break;
            case 'thisMonth':
                from = now.startOf('month');
                to = now.endOf('month');
                break;
            case 'thisQuarter':
                from = now.startOf('quarter');
                to = now.endOf('quarter');
                break;
            case 'thisYear':
                from = now.startOf('year');
                to = now.endOf('year');
                break;
            case 'today':
                from = now.startOf('day');
                to = now.endOf('day');
                break;
            case 'yesterday':
                const yesterday = now.subtract(1, 'day');
                from = yesterday.startOf('day');
                to = yesterday.endOf('day');
                break;
            case 'previousWeek':
                const lastWeek = now.subtract(1, 'week');
                from = lastWeek.startOf('isoWeek');
                to = lastWeek.endOf('isoWeek');
                break;
            case 'previousMonth':
                const lastMonth = now.subtract(1, 'month');
                from = lastMonth.startOf('month');
                to = lastMonth.endOf('month');
                break;
            case 'previousQuarter':
                const lastQuarter = now.subtract(1, 'quarter');
                from = lastQuarter.startOf('quarter');
                to = lastQuarter.endOf('quarter');
                break;
            case 'previousYear':
                const lastYear = now.subtract(1, 'year');
                from = lastYear.startOf('year');
                to = lastYear.endOf('year');
                break;
            case 'custom':
            default:
                return;
        }

        setFromDate(from.format('YYYY-MM-DD'));
        setToDate(to.format('YYYY-MM-DD'));
    };

    const hasActiveFilters = !!(fromDate || toDate);

    const clearAllFilters = () => {
        setDateRangePreset('custom');
        setFromDate(dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
        setToDate(dayjs().format('YYYY-MM-DD'));
    };

    return (
        <div className="space-y-6 pb-6">
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
                    {loading ? (
                        <>
                            <Skeleton className="h-8 w-24 rounded-md" />
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </>
                    ) : (
                        <>
                            <span className="inline-flex items-center rounded-md px-3 py-1 text-sm md:text-base font-semibold text-foreground font-mono tracking-wide">
                                {fromDate}
                            </span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            <span className="inline-flex items-center rounded-md px-3 py-1 text-sm md:text-base font-semibold text-foreground font-mono tracking-wide">
                                {toDate}
                            </span>
                        </>
                    )}
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="px-1 py-2 text-center">
                        <div className="text-sm text-muted-foreground">{t('total amount')}</div>
                        {loading ? (
                            <Skeleton className="h-8 w-24 mx-auto mt-1 rounded-md" />
                        ) : (
                            <div className="text-2xl font-bold mt-1">{formatCurrency(totalAmount)}</div>
                        )}
                    </div>
                    <div className="px-1 py-2 text-center">
                        <div className="text-sm text-muted-foreground">{t('total transactions')}</div>
                        {loading ? (
                            <Skeleton className="h-8 w-16 mx-auto mt-1 rounded-md" />
                        ) : (
                            <div className="text-2xl font-bold mt-1">{totalTransactions}</div>
                        )}
                    </div>
                    <div className="px-1 py-2 text-center">
                        <div className="text-sm text-muted-foreground">{t('average amount')}</div>
                        {loading ? (
                            <Skeleton className="h-8 w-24 mx-auto mt-1 rounded-md" />
                        ) : (
                            <div className="text-2xl font-bold mt-1">{formatCurrency(averageAmount)}</div>
                        )}
                    </div>
                </div>

                {/* Charts */}
                {loading ? (
                    <div className="space-y-6 px-0 pb-6 md:px-4">
                        <Card className="p-2 md:p-4 overflow-hidden">
                            <Skeleton className="h-6 w-48 mb-4 rounded-md" />
                            <Skeleton className="w-full h-[300px] rounded-md" />
                        </Card>
                        <Card className="p-2 md:p-4 overflow-hidden">
                            <Skeleton className="h-6 w-56 mb-4 rounded-md" />
                            <Skeleton className="w-full h-[300px] rounded-md" />
                        </Card>
                    </div>
                ) : statistics.length === 0 || chartData.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {t('no data available for the selected date range')}
                    </div>
                ) : (
                    <div className="space-y-6 px-0 pb-6 md:px-4">
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
                                            allowDecimals={false}
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
                    </div>
                )}
            </Card>
        </div>
    );
}
