'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Camera } from 'lucide-react';
import { useTranslation } from '@/components/contexts/translation.context';

interface ExpenseListMobileHeaderProps {
    onMenuClick: () => void;
    onCameraClick: () => void;
}

export default function ExpenseListMobileHeader({
    onMenuClick,
    onCameraClick,
}: ExpenseListMobileHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="sticky top-[0px] z-20 px-4 pt-3 pb-2 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="flex items-center justify-between gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5 text-slate-700" />
                </Button>
                <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-slate-900 leading-tight truncate">
                        {t('expenses')}
                    </div>
                    <div className="text-xs text-slate-500 leading-tight truncate">
                        {t('all expenses')}
                    </div>
                </div>
                <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                    onClick={onCameraClick}
                >
                    <Camera className="h-5 w-5 text-white" />
                </Button>
            </div>
        </div>
    );
}
