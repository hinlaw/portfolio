'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useTranslation } from '@/components/contexts/translation.context';

interface ExpenseStatisticsMobileHeaderProps {
    onMenuClick: () => void;
}

export default function ExpenseStatisticsMobileHeader({
    onMenuClick,
}: ExpenseStatisticsMobileHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="sticky top-[0px] z-20 px-4 pt-4 pb-3 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="flex items-center justify-between gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-slate-100 hover:bg-slate-200"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5 text-slate-700" />
                </Button>
                <div className="flex-1 min-w-0">
                    <div className="text-lg font-semibold text-slate-900 leading-tight truncate">
                        {t('reports')}
                    </div>
                    <div className="text-sm text-slate-500 leading-tight truncate">
                        {t('expense statistics')}
                    </div>
                </div>
                <div className="w-11" /> {/* Spacer for alignment */}
            </div>
        </div>
    );
}
