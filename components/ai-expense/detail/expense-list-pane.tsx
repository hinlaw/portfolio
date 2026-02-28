'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExpenseDTO } from '@/types/expense';
import { formatDateLong } from '@/lib/date';
import { useCurrencyFormatter } from '@/lib/currency';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpenseListPaneProps {
    expenses: ExpenseDTO[];
    selectedExpenseId?: string;
    loading: boolean;
    onExpenseClick: (expenseId: string) => void;
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
}

export default function ExpenseListPane({
    expenses,
    selectedExpenseId,
    loading,
    onExpenseClick,
    page,
    size,
    total,
    onPageChange,
}: ExpenseListPaneProps) {
    const formatCurrency = useCurrencyFormatter();

    const formatDate = (timestamp: number) => formatDateLong(timestamp);

    const totalPages = Math.ceil(total / size);

    return (
        <div className="hidden xl:flex w-80 border-r bg-white flex-col overflow-hidden">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">All expenses</h2>
                    <Link href="/apps/ai-expense/new">
                        <Button variant="default" size="sm">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        Loading...
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No expenses found
                    </div>
                ) : (
                    <>
                        <div className="divide-y">
                            {expenses.map((exp) => {
                                const isSelected = exp.id === selectedExpenseId;
                                return (
                                    <div
                                        key={exp.id}
                                        onClick={() => onExpenseClick(exp.id)}
                                        className={`
                                            p-4 cursor-pointer transition-colors
                                            ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}
                                        `}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(exp.date)}
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(exp.amount)}
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {exp.merchant || 'Expense'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t flex items-center justify-between">
                                <div className="text-xs text-muted-foreground">
                                    {`Showing ${(page - 1) * size + 1} to ${Math.min(page * size, total)} of ${total} expenses`}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
