import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ExpensePageLayout from '@/components/ai-expense/layout/expense-page-layout';
import { buttonVariants } from '@/components/ui/button';
import { ExpenseDTO } from '@/api/types/expense';
import { getExpense, deleteExpense, listExpenses } from '@/api/client/expenses';
import { useWorkspace } from '@/components/ai-expense/workspace-provider';
import DeleteExpenseDialog from '@/components/ai-expense/delete-expense-dialog';
import ExpenseFormDialog from '@/components/ai-expense/expense-form-dialog';
import { toast } from 'sonner';
import ExpenseListPane from '@/components/ai-expense/detail/expense-list-pane';
import ExpenseDetailsPane from '@/components/ai-expense/detail/expense-details-pane';

export default function ExpenseDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { activeWorkspaceId } = useWorkspace();
    const [expense, setExpense] = useState<ExpenseDTO | null>(null);
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [listLoading, setListLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [showFullscreenForm, setShowFullscreenForm] = useState(false);
    const [listPage, setListPage] = useState(1);
    const [listTotal, setListTotal] = useState(0);
    const listSize = 15;

    const loadExpense = async () => {
        if (!id || typeof id !== 'string') return;
        setLoading(true);
        setError(null);
        try {
            const response = await getExpense(id);
            if (response) {
                setExpense(response);
            } else {
                setError('Unable to load expense. Please try again.');
            }
        } catch (err: any) {
            setError(err?.message || 'Unable to load expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadExpenses = useCallback(async () => {
        if (!activeWorkspaceId) return;
        setListLoading(true);
        try {
            const response = await listExpenses({
                workspace_id: activeWorkspaceId,
                page: listPage,
                size: listSize,
                field: 'date',
                asc: 0,
            });
            setExpenses(response.data || []);
            setListTotal(response.page?.total || 0);
        } catch (err: any) {
            console.error('Failed to load expenses:', err);
        } finally {
            setListLoading(false);
        }
    }, [activeWorkspaceId, listPage, listSize]);

    useEffect(() => {
        loadExpense();
    }, [id]);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    const handleExpenseClick = (expenseId: string) => {
        router.push(`/apps/ai-expense/${expenseId}`);
    };

    const handleEditClick = () => {
        setShowFullscreenForm(true);
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!expense) return;
        try {
            await deleteExpense(expense.id);
            toast.success('Expense deleted successfully');
            router.push('/apps/ai-expense');
        } catch (error: any) {
            console.error('Failed to delete expense:', error);
            toast.error('Failed to delete expense');
        }
    };

    const handleSaveSuccess = async (updatedExpense: ExpenseDTO, saveAndNew?: boolean) => {
        setShowFullscreenForm(false);
        await loadExpense();
        await loadExpenses();
        if (!saveAndNew) {
            toast.success('Expense updated successfully');
        }
    };

    const handleFormClose = () => {
        setShowFullscreenForm(false);
    };

    return (
        <>
            <Head>
                <title>{expense ? `${expense.merchant} - Expense` : 'Expense'} | AI Expense</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            <ExpensePageLayout
                title="Expenses"
                product={{
                    actions: (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/apps/ai-expense/new"
                                className={buttonVariants({ variant: 'default', size: 'default' })}
                            >
                                New expense
                            </Link>
                        </div>
                    ),
                }}
            >
                <div className="h-full flex overflow-hidden">
                    {/* Left Pane - Expense List */}
                    <ExpenseListPane
                        expenses={expenses}
                        selectedExpenseId={expense?.id}
                        loading={listLoading}
                        onExpenseClick={handleExpenseClick}
                        page={listPage}
                        size={listSize}
                        total={listTotal}
                        onPageChange={setListPage}
                    />

                    {/* Right Pane - Expense Details */}
                    <ExpenseDetailsPane
                        expense={expense}
                        loading={loading}
                        error={error}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onReload={loadExpense}
                        onListReload={loadExpenses}
                    />
                </div>
            </ExpensePageLayout>

            {/* Delete Confirmation Dialog */}
            <DeleteExpenseDialog
                expense={expense}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />

            {/* Fullscreen Expense Form */}
            {showFullscreenForm && expense && (
                <ExpenseFormDialog
                    expense={expense}
                    onSuccess={handleSaveSuccess}
                    onClose={handleFormClose}
                />
            )}
        </>
    );
}
