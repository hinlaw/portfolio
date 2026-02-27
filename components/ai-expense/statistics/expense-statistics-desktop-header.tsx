'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ExpenseStatisticsDesktopHeaderProps {
    onFilterClick?: () => void;
}

export default function ExpenseStatisticsDesktopHeader({
    onFilterClick,
}: ExpenseStatisticsDesktopHeaderProps) {
    const t = useTranslations('aiExpense');

    return (
        <div className="sticky top-[0px] z-20 px-6 py-3 border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('reports')}</h2>
            </div>
        </div>
    );
}
