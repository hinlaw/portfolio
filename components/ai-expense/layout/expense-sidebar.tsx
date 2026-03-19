'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BarChart3, Plus, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IoReceiptOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import LocaleSelector from '@/components/locale-selector';
import WorkspaceSwitcher from './workspace-switcher';

interface ExpenseSidebarProps {
    currentPath: string;
    variant?: 'sidebar' | 'sheet';
    onNavigate?: () => void;
}

export default function ExpenseSidebar({ currentPath, variant = 'sidebar', onNavigate }: ExpenseSidebarProps) {
    const router = useRouter();
    const t = useTranslations('aiExpense');

    const isExpensesActive = currentPath === '/apps/ai-expense' || (currentPath.startsWith('/apps/ai-expense/') && currentPath !== '/apps/ai-expense/statistics' && currentPath !== '/apps/ai-expense/settings' && currentPath !== '/apps/ai-expense/new');
    const isReportsActive = currentPath === '/apps/ai-expense/statistics';
    const isSettingsActive = currentPath === '/apps/ai-expense/settings';

    const handleExpensesClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onNavigate?.();
        router.push('/apps/ai-expense');
    };

    const handleCreateClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onNavigate?.();
        router.push('/apps/ai-expense/new');
    };

    return (
        <aside
            className={cn(
                "bg-white flex flex-col",
                variant === 'sidebar' ? "w-64 border-r border-slate-200 h-[calc(100vh-64px)]" : "w-full flex-1 min-h-0"
            )}
        >
            <div className="p-4 border-b border-slate-200 shrink-0">
                <WorkspaceSwitcher variant={variant} />
            </div>
            <nav className={cn("flex-1 p-4 space-y-1 overflow-y-auto", variant === 'sheet' ? "pb-4" : undefined)}>
                {/* Expenses Item */}
                <div className="group">
                    <div
                        className={cn(
                            "flex items-center justify-between pl-3 rounded-md text-sm font-medium transition-colors cursor-pointer",
                            isExpensesActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-700 hover:bg-slate-50"
                        )}
                        onClick={handleExpensesClick}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <IoReceiptOutline className="h-4 w-4" />
                            <span>{t('expenses')}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-tl-none rounded-bl-none group-hover:bg-slate-200 hover:bg-slate-300 cursor-pointer"
                            onClick={handleCreateClick}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Reports Item */}
                <Link
                    href="/apps/ai-expense/statistics"
                    onClick={() => onNavigate?.()}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        isReportsActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-700 hover:bg-slate-50"
                    )}
                >
                    <BarChart3 className="h-4 w-4" />
                    <span>{t('reports')}</span>
                </Link>

                {/* My Settings Item */}
                <Link
                    href="/apps/ai-expense/settings"
                    onClick={() => onNavigate?.()}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        isSettingsActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-700 hover:bg-slate-50"
                    )}
                >
                    <Settings className="h-4 w-4" />
                    <span>{t('my settings')}</span>
                </Link>
            </nav>
            {variant === 'sheet' && (
                <div className="shrink-0 p-4 pt-0 border-t border-slate-200 space-y-3">
                    <LocaleSelector className="w-full" />
                    <Link
                        href="/"
                        onClick={() => onNavigate?.()}
                        className={cn(buttonVariants({ variant: 'outline', size: 'default' }), "w-full justify-center")}
                    >
                        Back to home
                    </Link>
                </div>
            )}
        </aside>
    );
}
