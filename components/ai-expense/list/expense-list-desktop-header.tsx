'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ExpenseListDesktopHeaderProps {
    onNewExpenseClick: () => void;
    onFilterClick: () => void;
}

export default function ExpenseListDesktopHeader({
    onNewExpenseClick,
    onFilterClick,
}: ExpenseListDesktopHeaderProps) {
    const t = useTranslations('aiExpense');

    return (
        <div className="sticky top-[0px] z-20 px-6 py-3 border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('expenses')}</h2>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={onNewExpenseClick}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        {t('new expense')}
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onFilterClick}
                        className="h-9 w-9"
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
