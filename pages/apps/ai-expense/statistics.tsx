import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ExpensePageLayout from '@/components/ai-expense/layout/expense-page-layout';
import ExpenseSidebar from '@/components/ai-expense/layout/expense-sidebar';
import ExpenseStatistics from '@/components/ai-expense/statistics/expense-statistics';
import ExpenseStatisticsDesktopHeader from '@/components/ai-expense/statistics/expense-statistics-desktop-header';
import ExpenseStatisticsMobileHeader from '@/components/ai-expense/statistics/expense-statistics-mobile-header';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function AiExpenseStatisticsPage() {
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <>
            <Head>
                <title>Reports | AI Expense</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            <ExpensePageLayout title="Reports">
                {/* Desktop - header fixed, only report content scrolls */}
                <div className="hidden min-h-0 flex-1 flex-col md:flex">
                    <ExpenseStatisticsDesktopHeader />
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="mx-auto max-w-7xl">
                            <ExpenseStatistics />
                        </div>
                    </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    {/* Mobile Header */}
                    <ExpenseStatisticsMobileHeader
                        onMenuClick={() => setIsSheetOpen(true)}
                    />

                    {/* Mobile Content */}
                    <div className="pb-[calc(80px+env(safe-area-inset-bottom))]">
                        <ExpenseStatistics />
                    </div>
                </div>
            </ExpensePageLayout>


            {/* Mobile Sheet for Sidebar */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="left" className="w-64 p-0 pt-12 flex flex-col">
                    <ExpenseSidebar
                        currentPath={router.pathname}
                        variant="sheet"
                        onNavigate={() => setIsSheetOpen(false)}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
