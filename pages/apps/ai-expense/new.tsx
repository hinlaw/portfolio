import { useRouter } from 'next/router';
import Head from 'next/head';
import ExpenseForm from '@/components/ai-expense/expense-form';
import { ExpenseDTO } from '@/types/expense';

export default function NewExpensePage() {
    const router = useRouter();

    const handleCreateSuccess = (expense: ExpenseDTO, saveAndNew?: boolean) => {
        if (!saveAndNew) {
            // Navigate to list page after creation
            router.push('/apps/ai-expense');
        }
        // If saveAndNew, form will reset internally without unmounting
    };

    const handleFormClose = () => {
        // Navigate back to previous page when form is closed
        router.back();
    };

    return (
        <>
            <Head>
                <title>Create expense | AI Expense</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            <ExpenseForm
                onSuccess={handleCreateSuccess}
                onClose={handleFormClose}
            />
        </>
    );
}
