'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/components/ai-expense/workspace-provider';
import WorkspaceDialog from '@/components/ai-expense/workspace-dialog';

interface WorkspaceSwitcherProps {
    variant?: 'sidebar' | 'sheet';
}

export default function WorkspaceSwitcher({ variant = 'sidebar' }: WorkspaceSwitcherProps) {
    const t = useTranslations('aiExpense');
    const { workspaces, activeWorkspaceId, activeWorkspace, setActiveWorkspaceId, isLoading } = useWorkspace();
    const [dialogOpen, setDialogOpen] = useState(false);

    if (isLoading || workspaces.length === 0) {
        return (
            <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50 animate-pulse">
                <div className="h-5 w-32 rounded bg-slate-200" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-1">
                <Select
                    value={activeWorkspaceId ?? ''}
                    onValueChange={(v) => v && setActiveWorkspaceId(v)}
                >
                    <SelectTrigger
                        className={variant === 'sheet' ? 'w-full' : 'w-full max-w-[220px]'}
                    >
                        <SelectValue>
                            {activeWorkspace ? `${activeWorkspace.name} (${activeWorkspace.base_currency})` : t('workspace')}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {workspaces.map((w) => (
                            <SelectItem key={w.id} value={w.id}>
                                {w.name} ({w.base_currency})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-600"
                    onClick={() => setDialogOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('add workspace')}
                </Button>
            </div>
            <WorkspaceDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    );
}
