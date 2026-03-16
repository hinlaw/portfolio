import ExpenseList from '@/components/ai-expense/list/expense-list';
import ExpenseListMobileHeader from '@/components/ai-expense/list/expense-list-mobile-header';

export type ExpenseListMobileViewProps = {
    onMenuClick: () => void;
    onCameraClick: () => void;
    onViewStatistics: () => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    keyword: string;
    onKeywordChange: (v: string) => void;
    fromDate: string;
    toDate: string;
    minAmount: string;
    maxAmount: string;
};

export default function ExpenseListMobileView({
    onMenuClick,
    onCameraClick,
    onViewStatistics,
    showFilters,
    onToggleFilters,
    keyword,
    onKeywordChange,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
}: ExpenseListMobileViewProps) {
    return (
        <div className="md:hidden">
            <ExpenseListMobileHeader onMenuClick={onMenuClick} onCameraClick={onCameraClick} />

            <div className="px-4 pt-3 pb-[calc(80px+env(safe-area-inset-bottom))]">
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
    );
}
