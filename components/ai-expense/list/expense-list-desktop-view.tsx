import ExpenseList from '@/components/ai-expense/list/expense-list';
import ExpenseFilterBar from '@/components/ai-expense/list/expense-filter-bar';
import ExpenseListDesktopHeader from '@/components/ai-expense/list/expense-list-desktop-header';
import { Upload } from 'lucide-react';

export type ExpenseListDesktopViewProps = {
    onNewExpenseClick: () => void;
    onFilterClick: () => void;
    showFilters: boolean;
    keyword: string;
    onKeywordChange: (v: string) => void;
    fromDate: string;
    onFromDateChange: (v: string) => void;
    toDate: string;
    onToDateChange: (v: string) => void;
    minAmount: string;
    onMinAmountChange: (v: string) => void;
    maxAmount: string;
    onMaxAmountChange: (v: string) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onUploadClick: () => void;
    onViewStatistics: () => void;
    onToggleFilters: () => void;
    uploadText: string;
};

export default function ExpenseListDesktopView({
    onNewExpenseClick,
    onFilterClick,
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
    onDrop,
    onDragOver,
    onUploadClick,
    onViewStatistics,
    onToggleFilters,
    uploadText,
}: ExpenseListDesktopViewProps) {
    return (
        <div className="hidden md:block">
            <ExpenseListDesktopHeader
                onNewExpenseClick={onNewExpenseClick}
                onFilterClick={onFilterClick}
            />

            <div className="sticky top-[47px] z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <ExpenseFilterBar
                        showFilters={showFilters}
                        keyword={keyword}
                        onKeywordChange={onKeywordChange}
                        fromDate={fromDate}
                        onFromDateChange={onFromDateChange}
                        toDate={toDate}
                        onToDateChange={onToDateChange}
                        minAmount={minAmount}
                        onMinAmountChange={onMinAmountChange}
                        maxAmount={maxAmount}
                        onMaxAmountChange={onMaxAmountChange}
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={onClearFilters}
                    />
                </div>
            </div>

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <div
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onClick={onUploadClick}
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="rounded-full bg-muted p-3">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                </div>
                                <p className="text-base font-medium text-muted-foreground">{uploadText}</p>
                            </div>
                        </div>
                    </div>

                    <ExpenseList
                        onViewStatistics={onViewStatistics}
                        showFilters={showFilters}
                        onToggleFilters={onToggleFilters}
                        keyword={keyword}
                        onKeywordChange={onKeywordChange}
                        fromDate={fromDate}
                        toDate={toDate}
                        minAmount={minAmount}
                        maxAmount={maxAmount}
                    />
                </div>
            </div>
        </div>
    );
}
