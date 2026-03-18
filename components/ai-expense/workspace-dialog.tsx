'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { createWorkspace } from '@/api/client/workspaces';
import { useWorkspace } from '@/components/ai-expense/workspace-provider';

interface WorkspaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function WorkspaceDialog({ open, onOpenChange }: WorkspaceDialogProps) {
    const t = useTranslations('aiExpense');
    const { setActiveWorkspaceId, refreshWorkspaces } = useWorkspace();
    const [name, setName] = useState('');
    const [baseCurrency, setBaseCurrency] = useState<'USD' | 'CNY' | 'HKD'>('USD');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsSubmitting(true);
        try {
            const workspace = await createWorkspace({
                name: name.trim(),
                base_currency: baseCurrency,
            });
            await refreshWorkspaces();
            setActiveWorkspaceId(workspace.id);
            onOpenChange(false);
            setName('');
            setBaseCurrency('USD');
            toast.success(t('workspace created'));
        } catch {
            toast.error(t('toast.failed to save settings'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setName('');
            setBaseCurrency('USD');
        }
        onOpenChange(next);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('new workspace')}</DialogTitle>
                        <DialogDescription>
                            {t('workspace description')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="workspace-name">{t('workspace name')}</Label>
                            <Input
                                id="workspace-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('enter workspace name')}
                                maxLength={100}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="workspace-currency">{t('base currency')}</Label>
                            <Select
                                value={baseCurrency}
                                onValueChange={(v) => setBaseCurrency(v as 'USD' | 'CNY' | 'HKD')}
                            >
                                <SelectTrigger id="workspace-currency">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUPPORTED_CURRENCIES.map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            {t('cancel')}
                        </Button>
                        <Button type="submit" disabled={!name.trim() || isSubmitting}>
                            {isSubmitting ? t('loading') : t('save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
