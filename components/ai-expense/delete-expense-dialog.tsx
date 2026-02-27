'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExpenseDTO } from '@/types/expense';
import { useCurrencyFormatter } from '@/lib/currency';

interface DeleteExpenseDialogProps {
    expense: ExpenseDTO | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function DeleteExpenseDialog({ expense, open, onOpenChange, onConfirm }: DeleteExpenseDialogProps) {
    const formatCurrencyAmount = useCurrencyFormatter();

    if (!expense) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete expense</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this expense? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Merchant:</span>
                            <span className="text-sm font-medium">{expense.merchant}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Amount:</span>
                            <span className="text-sm font-medium">{formatCurrencyAmount(expense.amount)}</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
