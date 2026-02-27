'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExpenseDTO } from '@/types/expense';
import { useCurrencyFormatter } from '@/lib/currency';
import { useTranslations } from 'next-intl';

interface DeleteExpenseDialogProps {
    expense: ExpenseDTO | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function DeleteExpenseDialog({ expense, open, onOpenChange, onConfirm }: DeleteExpenseDialogProps) {
    const formatCurrencyAmount = useCurrencyFormatter();
    const t = useTranslations('aiExpense');

    if (!expense) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('delete expense')}</DialogTitle>
                    <DialogDescription>
                        {t('are you sure you want to delete this expense? this action cannot be undone.')}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-muted-foreground">{t('merchant')}:</span>
                            <span className="text-sm font-medium">{expense.merchant}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-muted-foreground">{t('amount')}:</span>
                            <span className="text-sm font-medium">{formatCurrencyAmount(expense.amount)}</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('cancel')}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        {t('delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
