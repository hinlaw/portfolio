import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useState, useRef, useCallback, useEffect } from 'react';
import ExpensePageLayout from '@/components/ai-expense/layout/expense-page-layout';
import ExpenseSidebar from '@/components/ai-expense/layout/expense-sidebar';
import ExpenseList from '@/components/ai-expense/list/expense-list';
import ExpenseFilterBar from '@/components/ai-expense/list/expense-filter-bar';
import ExpenseListDesktopHeader from '@/components/ai-expense/list/expense-list-desktop-header';
import ExpenseListMobileHeader from '@/components/ai-expense/list/expense-list-mobile-header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Upload, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ExpenseForm from '@/components/ai-expense/expense-form';
import { FileWithPreview } from '@/components/ai-expense/file-upload';
import { toast } from 'sonner';
import { listExpenses } from '@/lib/api/client/expenses';
import FirstExpenseLanding from '@/components/ai-expense/first-expense-landing';

export default function AiExpenseListPage() {
    const router = useRouter();
    const t = useTranslations('aiExpense');
    const [showFilters, setShowFilters] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [showFullscreenForm, setShowFullscreenForm] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
    const [autoScan, setAutoScan] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasAnyExpenses, setHasAnyExpenses] = useState<boolean | null>(null);

    // Filter states
    const [keyword, setKeyword] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    // Check if any filters are active
    const hasActiveFilters = !!(fromDate || toDate || minAmount || maxAmount || keyword);

    // Clear all filters
    const clearAllFilters = () => {
        setFromDate('');
        setToDate('');
        setMinAmount('');
        setMaxAmount('');
        setKeyword('');
    };


    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await listExpenses({
                    page: 1,
                    size: 1,
                    field: 'date',
                    asc: 0,
                });
                const total = response.page?.total ?? response.data.length ?? 0;
                if (!cancelled) {
                    setHasAnyExpenses(total > 0);
                }
            } catch (error) {
                if (!cancelled) {
                    setHasAnyExpenses(true);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = useCallback(async (fileList: FileList) => {
        if (!fileList || fileList.length === 0) return;

        const newFiles: FileWithPreview[] = [];
        const fileArray = Array.from(fileList);

        for (const file of fileArray) {
            // Validate file type - images and documents
            const isImage = file.type.startsWith('image/');
            const isPDF = file.type === 'application/pdf';
            const isDOC = file.type === 'application/msword';
            const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            const isXLS = file.type === 'application/vnd.ms-excel';
            const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const isCSV = file.type === 'text/csv' || file.type === 'application/csv';
            const isTXT = file.type === 'text/plain';

            if (!isImage && !isPDF && !isDOC && !isDOCX && !isXLS && !isXLSX && !isCSV && !isTXT) {
                toast.error(`${file.name} ${t('toast.file type not supported. supported types: images, pdf, doc, docx, xls, xlsx, csv, txt')}`);
                continue;
            }

            // Check max files limit (10 files)
            if (newFiles.length >= 10) {
                toast.error(t('toast.maximum files allowed: {count}', { count: '10' }));
                break;
            }

            try {
                const base64 = await convertFileToBase64(file);
                newFiles.push({
                    file,
                    preview: base64,
                    base64,
                });
            } catch (error) {
                console.error(`Failed to process ${file.name}:`, error);
                toast.error(`${t('toast.failed to process file')} ${file.name}`);
            }
        }

        if (newFiles.length > 0) {
            setUploadedFiles(newFiles);
            setAutoScan(true);
            setShowFullscreenForm(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileInputChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                await handleFileUpload(e.target.files);
            }
            // Reset input so same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [handleFileUpload]
    );

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                await handleFileUpload(e.dataTransfer.files);
            }
        },
        [handleFileUpload]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFormSuccess = useCallback(() => {
        setShowFullscreenForm(false);
        setUploadedFiles([]);
        setAutoScan(false);
        // Reload the page to refresh the list
        router.reload();
    }, [router]);

    const handleFormClose = useCallback(() => {
        setShowFullscreenForm(false);
        setUploadedFiles([]);
        setAutoScan(false);
    }, []);

    return (
        <>
            <Head>
                <title>Expenses | AI Expense</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            <ExpensePageLayout
                title={t('title')}
            >
                {/* Hidden file input (used by AI create / auto-scan) */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                />

                {hasAnyExpenses === false ? (
                    <FirstExpenseLanding
                        onAiCreate={handleClick}
                        onManualCreate={() => {
                            setUploadedFiles([]);
                            setAutoScan(false);
                            setShowFullscreenForm(true);
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />
                ) : hasAnyExpenses === null ? (
                    <div className="p-6">
                        <div className="max-w-7xl mx-auto text-sm text-muted-foreground">
                            {t('loading')}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop */}
                        <div className="hidden md:block">
                            {/* Desktop Header */}
                            <ExpenseListDesktopHeader
                                onNewExpenseClick={() => router.push('/apps/ai-expense/new')}
                                onFilterClick={() => setShowFilters(!showFilters)}
                            />

                            {/* Sticky Filter Bar - slides down from header */}
                            <div className="sticky top-[47px] z-10 overflow-hidden">
                                <div className="max-w-7xl mx-auto ">
                                    <ExpenseFilterBar
                                        showFilters={showFilters}
                                        keyword={keyword}
                                        onKeywordChange={setKeyword}
                                        fromDate={fromDate}
                                        onFromDateChange={setFromDate}
                                        toDate={toDate}
                                        onToDateChange={setToDate}
                                        minAmount={minAmount}
                                        onMinAmountChange={setMinAmount}
                                        maxAmount={maxAmount}
                                        onMaxAmountChange={setMaxAmount}
                                        hasActiveFilters={hasActiveFilters}
                                        onClearFilters={clearAllFilters}
                                    />
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="max-w-7xl mx-auto">
                                    {/* Upload Section */}
                                    <div className="mb-6">
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onClick={handleClick}
                                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="rounded-full bg-muted p-3">
                                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                </div>
                                                <p className="text-base font-medium text-muted-foreground">
                                                    {t('drag & drop receipts or click here to upload')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <ExpenseList
                                        onViewStatistics={() => router.push('/apps/ai-expense/statistics')}
                                        showFilters={showFilters}
                                        onToggleFilters={() => setShowFilters(!showFilters)}
                                        keyword={keyword}
                                        onKeywordChange={setKeyword}
                                        fromDate={fromDate}
                                        toDate={toDate}
                                        minAmount={minAmount}
                                        maxAmount={maxAmount}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden">
                            {/* Mobile Header */}
                            <ExpenseListMobileHeader
                                onMenuClick={() => setIsSheetOpen(true)}
                                onCameraClick={handleClick}
                            />

                            {/* Mobile Content */}
                            <div className="px-4 pt-3 pb-[calc(80px+env(safe-area-inset-bottom))]">
                                <ExpenseList
                                    onViewStatistics={() => router.push('/apps/ai-expense/statistics')}
                                    showFilters={showFilters}
                                    onToggleFilters={() => setShowFilters(!showFilters)}
                                    keyword={keyword}
                                    onKeywordChange={setKeyword}
                                    fromDate={fromDate}
                                    toDate={toDate}
                                    minAmount={minAmount}
                                    maxAmount={maxAmount}
                                />
                            </div>
                        </div>
                    </>
                )}
            </ExpensePageLayout>

            {hasAnyExpenses === true && (
                <>
                    {/* Mobile Fixed Bottom Search Bar */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pt-1 pb-[calc(env(safe-area-inset-bottom)+16px)] bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-sm border-t border-slate-200/50">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder={t('search merchant, description...')}
                                    className="h-12 rounded-full pl-12 pr-4 bg-slate-100 border-slate-200 focus-visible:ring-slate-300"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={() => router.push('/apps/ai-expense/new')}
                                className="h-12 w-12 rounded-full p-0 shadow-sm"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Sheet for Sidebar */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetContent side="left" className="w-64 p-0 pt-12">
                            <ExpenseSidebar
                                currentPath={router.pathname}
                                variant="drawer"
                                onNavigate={() => setIsSheetOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                </>
            )}

            {/* Expense Form */}
            {showFullscreenForm && (
                <ExpenseForm
                    initialFiles={uploadedFiles}
                    autoScan={autoScan}
                    onSuccess={handleFormSuccess}
                    onClose={handleFormClose}
                />
            )}
        </>
    );
}
