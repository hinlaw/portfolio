'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { updateExpense, listExpenses } from '@/api/client/expenses';
import { ExpenseDTO, ApiExpenseUpdateRequest, Response } from '@/api/types/expense';

interface ExpenseListFilters {
    fromDate?: number;
    toDate?: number;
    minAmount?: number;
    maxAmount?: number;
}
import { Button } from '@/components/ui/button';
import { useTimerEffect } from '@/lib/react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, Plus, Loader2 } from 'lucide-react';
import { formatDateShort, parseToTimestamp, dayjs } from '@/lib/date';
import { useCurrencyFormatter } from '@/lib/currency';
import { useWorkspace } from '@/components/ai-expense/workspace-provider';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import FileThumbnail from '../file-thumbnail';
import { isPdfUrl, isImageUrl } from '../file-utils';
import ImageViewer from '../image-viewer';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseListProps {
    onViewStatistics?: () => void;
    showFilters?: boolean;
    onToggleFilters?: () => void;
    keyword?: string;
    onKeywordChange?: (value: string) => void;
    fromDate?: string;
    toDate?: string;
    minAmount?: string;
    maxAmount?: string;
}

export default function ExpenseList({
    onViewStatistics,
    showFilters = false,
    onToggleFilters,
    keyword: externalKeyword = '',
    onKeywordChange: externalOnKeywordChange,
    fromDate: externalFromDate = '',
    toDate: externalToDate = '',
    minAmount: externalMinAmount = '',
    maxAmount: externalMaxAmount = '',
}: ExpenseListProps) {
    const t = useTranslations('aiExpense');
    const router = useRouter();
    const formatCurrency = useCurrencyFormatter();
    const { activeWorkspaceId, baseCurrency } = useWorkspace();
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size] = useState(15);
    const [total, setTotal] = useState(0);
    // Always sort by date descending
    const sortField = 'date';
    const sortAsc = false;

    // Filters - use external props (always provided from parent)
    const keyword = externalKeyword;
    const fromDate = externalFromDate;
    const toDate = externalToDate;
    const minAmount = externalMinAmount;
    const maxAmount = externalMaxAmount;

    const loadExpenses = useCallback(async () => {
        if (!activeWorkspaceId) return;
        // Don't load if date range is invalid
        if (fromDate && toDate && dayjs(fromDate).isAfter(dayjs(toDate))) {
            return;
        }

        setLoading(true);
        try {
            const filters: ExpenseListFilters = {};

            if (fromDate) {
                filters.fromDate = parseToTimestamp(fromDate);
            }
            if (toDate) {
                filters.toDate = parseToTimestamp(toDate);
            }
            if (minAmount) {
                filters.minAmount = parseFloat(minAmount);
            }
            if (maxAmount) {
                filters.maxAmount = parseFloat(maxAmount);
            }

            // Build URL with URLSearchParams to avoid undefined values in query string
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());
            params.append('field', sortField);
            params.append('asc', (sortAsc ? 1 : 0).toString());
            if (keyword && keyword.trim()) params.append('keyword', keyword.trim());
            if (filters.fromDate !== undefined && filters.fromDate !== null) params.append('from_date', filters.fromDate.toString());
            if (filters.toDate !== undefined && filters.toDate !== null) params.append('to_date', filters.toDate.toString());
            if (filters.minAmount !== undefined && filters.minAmount !== null) params.append('min_amount', filters.minAmount.toString());
            if (filters.maxAmount !== undefined && filters.maxAmount !== null) params.append('max_amount', filters.maxAmount.toString());

            const response = await listExpenses({
                workspace_id: activeWorkspaceId,
                page,
                size,
                keyword: keyword.trim() || undefined,
                from_date: filters.fromDate || undefined,
                to_date: filters.toDate || undefined,
                min_amount: filters.minAmount || undefined,
                max_amount: filters.maxAmount || undefined,
                field: sortField,
                asc: sortAsc ? 1 : 0,
            });
            setExpenses(response.data || []);
            setTotal(response.page?.total || 0);
        } catch (error: any) {
            console.error('Failed to load expenses:', error);
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    }, [activeWorkspaceId, page, size, keyword, fromDate, toDate, minAmount, maxAmount]);


    // Reset to page 1 when filters change (immediate, no debounce)
    useEffect(() => {
        setPage(1);
    }, [keyword, fromDate, toDate, minAmount, maxAmount]);

    // Load expenses on mount and when page changes (single effect, no duplicate calls)
    useEffect(() => {
        loadExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, activeWorkspaceId]);

    // Debounce API calls when filter inputs change (500ms) - skip initial mount to avoid duplicate load
    const isFirstFilterLoad = useRef(true);
    useTimerEffect(500, () => {
        if (isFirstFilterLoad.current) {
            isFirstFilterLoad.current = false;
            return;
        }
        loadExpenses();
    }, [keyword, fromDate, toDate, minAmount, maxAmount]);

    const handleRowClick = (expense: ExpenseDTO) => {
        router.push(`/apps/ai-expense/${expense.id}`);
    };

    const formatDate = (timestamp: number) => formatDateShort(timestamp);

    // Get first image URL from media array (prefer images over PDFs)
    const getFirstImageUrl = (media: string[] | undefined): string | null => {
        if (!media || media.length === 0) return null;
        // Prefer images over PDFs
        const firstImage = media.find(url => isImageUrl(url));
        return firstImage || media[0] || null;
    };

    // Get all image URLs from media array (filter out PDFs and other non-images)
    const getImageUrls = (media: string[] | undefined): string[] => {
        if (!media || media.length === 0) return [];
        return media.filter(url => isImageUrl(url));
    };

    // Count additional media files (excluding the first one)
    const getAdditionalMediaCount = (media: string[] | undefined): number => {
        if (!media || media.length <= 1) return 0;
        return media.length - 1;
    };

    // File upload handlers
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const [uploadingExpenseId, setUploadingExpenseId] = useState<string | null>(null);

    // Image viewer state
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [viewerImages, setViewerImages] = useState<string[]>([]);
    const [viewerInitialIndex, setViewerInitialIndex] = useState(0);
    const [viewerExpense, setViewerExpense] = useState<ExpenseDTO | null>(null);

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

    const handleFileUpload = async (expense: ExpenseDTO, fileList: FileList) => {
        if (!fileList || fileList.length === 0) return;

        setUploadingExpenseId(expense.id);
        try {
            const fileArray = Array.from(fileList);
            const newMedia: string[] = [...(expense.media || [])];
            const newMediaFiles: string[] = [];

            for (const file of fileArray) {
                // Validate file type
                const isImage = file.type.startsWith('image/');
                const isPDF = file.type === 'application/pdf';
                const isVideo = file.type.startsWith('video/');
                const isAudio = file.type.startsWith('audio/');

                if (!isImage && !isPDF && !isVideo && !isAudio) {
                    toast.error(`${file.name} file type not supported`);
                    continue;
                }

                // Check max files limit (10 files)
                if (newMedia.length + newMediaFiles.length >= 10) {
                    toast.error('Maximum files allowed: 10');
                    break;
                }

                try {
                    const base64 = await convertFileToBase64(file);
                    newMedia.push(base64);
                    newMediaFiles.push(file.name);
                } catch (error) {
                    console.error(`Failed to process ${file.name}:`, error);
                    toast.error(`Failed to process file ${file.name}`);
                }
            }

            if (newMediaFiles.length > 0) {
                const dateTimestamp = expense.date;
                const updateRequest: ApiExpenseUpdateRequest = {
                    date: dateTimestamp,
                    merchant: expense.merchant ?? undefined,
                    description: expense.description || '',
                    original_amount: expense.original_amount || expense.amount,
                    currency: expense.currency || baseCurrency,
                    exchange_rate: expense.exchange_rate || 1,
                    amount: expense.amount,
                    media: newMedia,
                };

                await updateExpense(expense.id, updateRequest);
                toast.success('Files uploaded successfully');
                // Reload expenses
                await loadExpenses();
            }
        } catch (error: any) {
            console.error('Failed to upload files:', error);
            toast.error(error?.response?.data?.message || 'Failed to upload files');
        } finally {
            setUploadingExpenseId(null);
        }
    };

    const handleFileInputChange = async (expense: ExpenseDTO, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await handleFileUpload(expense, e.target.files);
            // Reset input so same file can be selected again
            if (fileInputRefs.current[expense.id]) {
                fileInputRefs.current[expense.id]!.value = '';
            }
        }
    };

    const handleThumbnailClick = (e: React.MouseEvent, expense: ExpenseDTO) => {
        e.stopPropagation();
        const input = fileInputRefs.current[expense.id];
        if (input) {
            input.click();
        }
    };

    const handleImageClick = (e: React.MouseEvent, expense: ExpenseDTO) => {
        e.stopPropagation();
        const imageUrls = getImageUrls(expense.media);
        if (imageUrls.length > 0) {
            setViewerImages(imageUrls);
            setViewerInitialIndex(0);
            setViewerExpense(expense);
            setImageViewerOpen(true);
        }
    };

    const totalPages = Math.ceil(total / size);

    // Check if there are active filters
    const hasActiveFilters = !!(keyword || fromDate || toDate || minAmount || maxAmount);

    // Date validation
    const isDateRangeValid = !fromDate || !toDate || !dayjs(fromDate).isAfter(dayjs(toDate));

    // Format date for display
    const formatDateDisplay = (dateString: string) => {
        if (!dateString) return '';
        return dayjs(dateString).format('MMM DD, YYYY');
    };

    // Format amount for display
    const formatAmountDisplay = (amount: string) => {
        if (!amount) return '';
        return formatCurrency(parseFloat(amount));
    };

    // Clear all filters - only used internally if filters are managed internally
    const clearAllFilters = () => {
        // Filters are managed externally, so this function is not used
    };

    return (
        <div className="space-y-4">
            {/* Desktop (md+) */}
            <div className="hidden md:block space-y-4">

                {/* Results Count - Only show when filters are active */}
                {!loading && hasActiveFilters && (
                    <div className="text-sm text-muted-foreground">
                        {total === 1 ? t('resultCount', { count: 1 }) : t('resultCount', { count: total })}
                    </div>
                )}

                {/* Expenses Table */}
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">{t('expenseDetails')}</TableHead>
                                <TableHead>{t('merchant')}</TableHead>
                                <TableHead className="text-right">{t('amount')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-16 w-16 rounded flex-shrink-0" />
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <Skeleton className="h-4 w-20" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Skeleton className="h-4 w-16 ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        {t('no expenses found')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                expenses.map((expense) => {
                                    const firstImageUrl = getFirstImageUrl(expense.media);
                                    const additionalCount = getAdditionalMediaCount(expense.media);
                                    const hasMedia = expense.media && expense.media.length > 0;
                                    const isUploading = uploadingExpenseId === expense.id;

                                    return (
                                        <TableRow
                                            key={expense.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={(e) => {
                                                // Don't trigger row click if clicking on thumbnail area
                                                const target = e.target as HTMLElement;
                                                if (target.closest('.thumbnail-container')) {
                                                    return;
                                                }
                                                handleRowClick(expense);
                                            }}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {/* Thumbnail */}
                                                    <div
                                                        className="relative flex-shrink-0 thumbnail-container"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {/* Hidden file input */}
                                                        <input
                                                            ref={(el) => {
                                                                fileInputRefs.current[expense.id] = el;
                                                            }}
                                                            type="file"
                                                            accept="image/*,application/pdf,video/*,audio/*"
                                                            multiple
                                                            onChange={(e) => handleFileInputChange(expense, e)}
                                                            className="hidden"
                                                            disabled={isUploading}
                                                        />
                                                        {hasMedia && firstImageUrl ? (
                                                            <div className="relative">
                                                                <FileThumbnail
                                                                    url={firstImageUrl}
                                                                    size="medium"
                                                                    onClick={(e?: React.MouseEvent) => {
                                                                        if (e) {
                                                                            e.stopPropagation();
                                                                            // If there are images, open fullscreen viewer
                                                                            const imageUrls = getImageUrls(expense.media);
                                                                            if (imageUrls.length > 0) {
                                                                                handleImageClick(e, expense);
                                                                            } else {
                                                                                // No images, but has media (PDFs, etc.), open detail page
                                                                                handleRowClick(expense);
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                                <div
                                                                    className="absolute inset-0 bg-black/20 rounded pointer-events-none"
                                                                />
                                                                {additionalCount > 0 && (
                                                                    <div
                                                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                                    >
                                                                        <span
                                                                            className="text-white text-xl pointer-events-auto cursor-pointer rounded px-2 py-1 pointer-events-none"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                // Clicking on the badge opens fullscreen viewer if there are images
                                                                                const imageUrls = getImageUrls(expense.media);
                                                                                if (imageUrls.length > 0) {
                                                                                    handleImageClick(e, expense);
                                                                                } else {
                                                                                    handleThumbnailClick(e, expense);
                                                                                }
                                                                            }}
                                                                        >
                                                                            + {additionalCount}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="w-16 h-16 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleThumbnailClick(e, expense);
                                                                }}
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                {isUploading ? (
                                                                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                                                                ) : (
                                                                    <Plus className="h-5 w-5 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Date and Description */}
                                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                        <div className="text-sm font-medium text-primary">
                                                            {formatDate(expense.date)}
                                                        </div>
                                                        {expense.description && (
                                                            <div className="text-xs text-muted-foreground line-clamp-1">
                                                                {expense.description.length > 80
                                                                    ? `${expense.description.substring(0, 80)}`
                                                                    : expense.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{expense.merchant}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(expense.amount)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {t('paginationRange', { from: (page - 1) * size + 1, to: Math.min(page * size, total), total })}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {t('previous')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                {t('next')}
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile (< md) */}
            <div className="md:hidden">
                <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    {loading ? (
                        <>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex gap-4 items-center px-4 py-4">
                                    <Skeleton className="h-14 w-14 rounded flex-shrink-0" />
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : expenses.length === 0 ? (
                        <div className="py-10 text-center text-slate-500 text-sm">
                            {t('no expenses found')}
                        </div>
                    ) : (
                        expenses.map((expense) => {
                            const firstImageUrl = getFirstImageUrl(expense.media);
                            const additionalCount = getAdditionalMediaCount(expense.media);
                            const hasMedia = expense.media && expense.media.length > 0;
                            const isUploading = uploadingExpenseId === expense.id;
                            const primaryTitle = expense.description || t('expense');
                            const secondaryTitle = expense.merchant || '';

                            return (
                                <button
                                    key={expense.id}
                                    type="button"
                                    className="w-full text-left px-4 py-4 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('.thumbnail-container')) return;
                                        handleRowClick(expense);
                                    }}
                                >
                                    <div className="flex gap-4 items-center">
                                        {/* Thumbnail / Add receipt */}
                                        <div className="relative flex-shrink-0 thumbnail-container" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                ref={(el) => {
                                                    fileInputRefs.current[expense.id] = el;
                                                }}
                                                type="file"
                                                accept="image/*,application/pdf,video/*,audio/*"
                                                multiple
                                                onChange={(e) => handleFileInputChange(expense, e)}
                                                className="hidden"
                                                disabled={isUploading}
                                            />

                                            {hasMedia && firstImageUrl ? (
                                                <div className="relative">
                                                    <FileThumbnail
                                                        url={firstImageUrl}
                                                        size="medium"
                                                        className="rounded-xl"
                                                        onClick={(e?: React.MouseEvent) => {
                                                            if (e) {
                                                                e.stopPropagation();
                                                                const imageUrls = getImageUrls(expense.media);
                                                                if (imageUrls.length > 0) {
                                                                    handleImageClick(e, expense);
                                                                } else {
                                                                    handleRowClick(expense);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    {additionalCount > 0 ? (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="rounded-lg bg-black/40 px-2 py-1 text-xs font-semibold text-white">
                                                                +{additionalCount}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleThumbnailClick(e, expense);
                                                    }}
                                                >
                                                    {isUploading ? (
                                                        <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
                                                    ) : (
                                                        <Plus className="h-5 w-5 text-slate-400" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Text */}
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm text-slate-500">
                                                {formatDate(expense.date)}
                                            </div>
                                            <div className="text-2xl font-semibold tracking-tight text-slate-900">
                                                {formatCurrency(expense.amount)}
                                            </div>
                                            <div className="text-lg font-medium text-slate-900 truncate">
                                                {primaryTitle}
                                            </div>
                                            {secondaryTitle ? (
                                                <div className="text-sm text-slate-500 truncate">
                                                    {secondaryTitle}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            {t('paginationRange', { from: (page - 1) * size + 1, to: Math.min(page * size, total), total })}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="h-9 px-3"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="h-9 px-3"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Viewer */}
            <ImageViewer
                images={viewerImages}
                initialIndex={viewerInitialIndex}
                open={imageViewerOpen}
                onOpenChange={setImageViewerOpen}
                expense={viewerExpense}
            />

        </div>
    );
}
