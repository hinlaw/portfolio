import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import ProductLayout from '@/components/layouts/product.layout';
import ExpenseSidebar from './expense-sidebar';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { AiExpenseSettingsProvider } from '@/components/ai-expense/ai-expense-settings-provider';
import LocaleSelector from '@/components/locale-selector';
type ProductInfo = {
    name: string;
    icon: string;
    description?: string;
    accent?: string;
    actions?: ReactNode;
};

interface ExpensePageLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    product?: Partial<ProductInfo>;
}

export default function ExpensePageLayout({
    children,
    title,
    description,
    product: customProduct,
}: ExpensePageLayoutProps) {
    const router = useRouter();
    const currentPath = router.pathname;

    // Default product config
    const defaultProduct: ProductInfo = {
        name: 'AI Expense',
        icon: '',
        description: 'Manage your expenses with AI',
        accent: 'from-emerald-500 to-teal-500',
        actions: (
            <div className="flex items-center gap-3">
                <LocaleSelector className="w-[140px]" />
                <Link
                    href="/"
                    className={buttonVariants({ variant: 'outline', size: 'default' })}
                >
                    Back to home
                </Link>
            </div>
        ),
    };

    // Merge custom product with defaults
    const product: ProductInfo = {
        ...defaultProduct,
        ...customProduct,
        actions: customProduct?.actions ?? defaultProduct.actions,
    };

    return (
        <AiExpenseSettingsProvider>
            <ProductLayout
                title={title || 'Expenses'}
                description={description || 'Manage your expenses with AI'}
                product={product}
                hideHeaderOnMobile
            >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="flex min-h-0 flex-1 overflow-hidden">
                        {/* Sidebar - Desktop only */}
                        <div className="hidden shrink-0 md:block">
                            <ExpenseSidebar currentPath={currentPath} />
                        </div>

                        {/* Main Content */}
                        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </ProductLayout>
        </AiExpenseSettingsProvider>
    );
}
