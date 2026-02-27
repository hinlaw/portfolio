import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import ProductLayout from '@/components/layouts/product.layout';
import ExpenseSidebar from './expense-sidebar';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
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
        description: 'Manage your expenses with AI',
        icon: '/apps/app-ai-expense.png',
        accent: 'from-emerald-500 to-teal-500',
        actions: (
            <div className="flex items-center gap-3">
                <Link
                    href="/apps"
                    className={buttonVariants({ variant: 'outline', size: 'default' })}
                >
                    Back to apps
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
        <ProductLayout
            title={title || 'Expenses'}
            description={description || 'Manage your expenses with AI'}
            product={product}
        >
            <div className="h-[calc(100vh-53px)] -mx-6 -mb-12 flex flex-col overflow-hidden">
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - Desktop only */}
                    <div className="hidden md:block">
                        <ExpenseSidebar currentPath={currentPath} />
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProductLayout>
    );
}
