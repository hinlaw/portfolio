'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExpenseDTO, ApiExpenseUpdateRequest } from '@/api/types/expense';
import { updateExpense } from '@/api/client/expenses';
import { ArrowLeft, ChevronLeft, ChevronRight, Edit, Paperclip, Plus, Star, Trash2, X } from 'lucide-react';
import { formatDateLong, dayjs } from '@/lib/date';
import { useCurrencyFormatter, formatCurrencyWithCode } from '@/lib/currency';
import ImageViewer from '@/components/ai-expense/image-viewer';
import { isPdfUrl, isImageUrl } from '@/components/ai-expense/file-utils';
import { toast } from 'sonner';
import MediaGallery from './media-gallery';
import { cn } from '@/lib/utils';

interface ExpenseDetailsPaneProps {
    expense: ExpenseDTO | null;
    loading: boolean;
    error: string | null;
    onEdit: () => void;
    onDelete: () => void;
    onReload: () => void;
    onListReload?: () => void;
}

export default function ExpenseDetailsPane({
    expense,
    loading,
    error,
    onEdit,
    onDelete,
    onReload,
    onListReload,
}: ExpenseDetailsPaneProps) {
    const formatCurrency = useCurrencyFormatter();
    const workspaceCurrency = 'USD';
    const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState<'details'>('details');
    const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
    const [mobileSelectedMediaIndex, setMobileSelectedMediaIndex] = useState<number>(0);
    const mobileAttachmentsRef = useRef<HTMLDivElement | null>(null);
    const mobileFileInputRef = useRef<HTMLInputElement | null>(null);

    const formatDate = (timestamp: number) => formatDateLong(timestamp);

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

    const handleFileUpload = async (fileList: FileList) => {
        if (!expense || !fileList || fileList.length === 0) return;

        setUploadingMedia(true);
        try {
            const fileArray = Array.from(fileList);
            const newMedia: string[] = [...(expense.media || [])];
            const newMediaFiles: string[] = [];

            for (const file of fileArray) {
                const isImage = file.type.startsWith('image/');
                const isPDF = file.type === 'application/pdf';
                const isVideo = file.type.startsWith('video/');
                const isAudio = file.type.startsWith('audio/');

                if (!isImage && !isPDF && !isVideo && !isAudio) {
                    toast.error(`${file.name} file type not supported`);
                    continue;
                }

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
                    currency: expense.currency || workspaceCurrency,
                    exchange_rate: expense.exchange_rate || 1,
                    amount: expense.amount,
                    media: newMedia,
                };

                await updateExpense(expense.id, updateRequest);
                toast.success('Files uploaded successfully');

                // Calculate the index of the last uploaded media (newest one) before reload
                const lastMediaIndex = newMedia.length - 1;

                await onReload();
                await onListReload?.();

                // After reload completes, set mobileSelectedMediaIndex to the last uploaded media
                // Use setTimeout to ensure the state has updated after onReload
                setTimeout(() => {
                    setMobileSelectedMediaIndex(lastMediaIndex);
                }, 100);
            }
        } catch (error: any) {
            console.error('Failed to upload files:', error);
            toast.error(error?.response?.data?.message || 'Failed to upload files');
        } finally {
            setUploadingMedia(false);
        }
    };

    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await handleFileUpload(e.target.files);
        }
    };

    const handleMoveToFirst = async () => {
        if (!expense || allMediaUrls.length === 0 || selectedMediaIndex === 0) return;

        try {
            const newMedia = [...(expense.media || [])];
            const selectedMediaUrl = allMediaUrls[selectedMediaIndex];
            const selectedIndexInMedia = newMedia.indexOf(selectedMediaUrl);

            if (selectedIndexInMedia === -1) return;

            newMedia.splice(selectedIndexInMedia, 1);
            newMedia.unshift(selectedMediaUrl);

            const dateTimestamp = expense.date;
            const updateRequest: ApiExpenseUpdateRequest = {
                date: dateTimestamp,
                merchant: expense.merchant ?? undefined,
                description: expense.description || '',
                original_amount: expense.original_amount || expense.amount,
                currency: expense.currency || workspaceCurrency,
                exchange_rate: expense.exchange_rate || 1,
                amount: expense.amount,
                    media: newMedia,
            };

            await updateExpense(expense.id, updateRequest);
            await onReload();
            await onListReload?.();
            setSelectedMediaIndex(0);
            toast.success('Image moved to first position');
        } catch (error: any) {
            console.error('Failed to move image:', error);
            toast.error(error?.response?.data?.error || 'Failed to move image');
        }
    };

    const handleRemoveImage = async () => {
        if (!expense || allMediaUrls.length === 0) return;

        if (!confirm('Are you sure you want to remove this image?')) {
            return;
        }

        try {
            const selectedMediaUrl = allMediaUrls[selectedMediaIndex];
            const newMedia = (expense.media || []).filter(url => url !== selectedMediaUrl);

            const dateTimestamp = expense.date;
            const updateRequest: ApiExpenseUpdateRequest = {
                date: dateTimestamp,
                merchant: expense.merchant ?? undefined,
                description: expense.description || '',
                original_amount: expense.original_amount || expense.amount,
                currency: expense.currency || workspaceCurrency,
                exchange_rate: expense.exchange_rate || 1,
                amount: expense.amount,
                    media: newMedia,
            };

            await updateExpense(expense.id, updateRequest);
            await onReload();
            await onListReload?.();

            const remainingMedia = newMedia.filter(url => isImageUrl(url) || isPdfUrl(url));
            if (remainingMedia.length > 0) {
                setSelectedMediaIndex(0);
            }

            toast.success('Image removed successfully');
        } catch (error: any) {
            console.error('Failed to remove image:', error);
            toast.error(error?.response?.data?.error || 'Failed to remove image');
        }
    };

    // Mobile-specific handler to move selected attachment to first position
    const handleMobileMoveToFirst = async (indexToMove: number) => {
        if (!expense || allMediaUrls.length === 0 || indexToMove === 0) return;

        try {
            const newMedia = [...(expense.media || [])];
            const selectedMediaUrl = allMediaUrls[indexToMove];
            const selectedIndexInMedia = newMedia.indexOf(selectedMediaUrl);

            if (selectedIndexInMedia === -1) return;

            newMedia.splice(selectedIndexInMedia, 1);
            newMedia.unshift(selectedMediaUrl);

            const dateTimestamp = expense.date;
            const updateRequest: ApiExpenseUpdateRequest = {
                date: dateTimestamp,
                merchant: expense.merchant ?? undefined,
                description: expense.description || '',
                original_amount: expense.original_amount || expense.amount,
                currency: expense.currency || workspaceCurrency,
                exchange_rate: expense.exchange_rate || 1,
                amount: expense.amount,
                    media: newMedia,
            };

            await updateExpense(expense.id, updateRequest);
            await onReload();
            await onListReload?.();
            setMobileSelectedMediaIndex(0); // After moving to first, show the first one
            toast.success('Image moved to first position');
        } catch (error: any) {
            console.error('Failed to move image:', error);
            toast.error(error?.response?.data?.error || 'Failed to move image');
        }
    };
    const { imageUrls, allMediaUrls, firstMediaUrl } = useMemo(() => {
        const all = expense?.media?.filter(url => isImageUrl(url) || isPdfUrl(url)) || [];
        const imgs = all.filter(url => isImageUrl(url));
        return {
            imageUrls: imgs,
            allMediaUrls: all,
            firstMediaUrl: all[0] || null,
        };
    }, [expense?.media]);

    const mobileAttachmentCount = allMediaUrls.length;
    const mobileHasAttachments = mobileAttachmentCount > 0;
    const mobileCanPreviewImages = imageUrls.length > 0;

    // Sync mobileSelectedMediaIndex when attachments change
    useEffect(() => {
        if (mobileSelectedMediaIndex >= allMediaUrls.length && allMediaUrls.length > 0) {
            setMobileSelectedMediaIndex(Math.max(0, allMediaUrls.length - 1));
        } else if (allMediaUrls.length === 0) {
            setMobileSelectedMediaIndex(0);
        }
    }, [allMediaUrls.length, mobileSelectedMediaIndex]);

    return (
        <div className="flex-1 overflow-y-auto bg-white">
            {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                    Loading...
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-destructive mb-4">{error}</p>
                    <Link href="/apps/ai-expense">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to list
                        </Button>
                    </Link>
                </div>
            ) : !expense ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Expense not found</p>
                    <Link href="/apps/ai-expense">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to list
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile (< md) */}
                    <div className="md:hidden bg-slate-100 min-h-full">
                        {/* Hidden file input for attachments */}
                        <input
                            ref={mobileFileInputRef}
                            type="file"
                            accept="image/*,application/pdf,video/*,audio/*"
                            multiple
                            onChange={handleFileInputChange}
                            className="hidden"
                            disabled={uploadingMedia}
                        />

                        {/* Mobile sticky header */}
                        <div className="sticky top-0 z-20 px-4 pt-4 pb-3 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
                            <div className="flex items-center justify-between gap-3">
                                <Link
                                    href="/apps/ai-expense"
                                    className="h-11 w-11 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-200 transition-colors inline-flex items-center justify-center"
                                    aria-label="Back to list"
                                >
                                    <ArrowLeft className="h-5 w-5 text-slate-700" />
                                </Link>
                                <div className="flex-1 min-w-0 text-center">
                                    <div className="text-lg font-semibold text-slate-900 leading-tight truncate">
                                        {expense.description || expense.merchant || 'Expense'}
                                    </div>
                                </div>
                                <div className="h-11 w-11" />
                            </div>
                        </div>

                        <div className="px-4 py-4 space-y-4 pb-[calc(env(safe-area-inset-bottom)+96px)]">
                            {/* Summary card (light mode) */}
                            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                                <div className="px-4 py-4">
                                    <div className="flex items-center justify-between gap-3">

                                        {/* No report status in current system; keep empty to avoid fake feature */}
                                    </div>
                                    <div className="mt-1">
                                        {(expense.original_amount ?? 0) > 0 && expense.currency && expense.currency.trim() !== '' ? (
                                            <div className="space-y-1">
                                                <div className="text-4xl font-semibold tracking-tight text-slate-900">
                                                    {formatCurrencyWithCode(expense.original_amount ?? expense.amount, expense.currency)}
                                                </div>
                                                {expense.currency !== workspaceCurrency && expense.amount !== expense.original_amount && (
                                                    <div className="text-lg text-slate-500">
                                                        equals {formatCurrencyWithCode(expense.amount, workspaceCurrency)}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-4xl font-semibold tracking-tight text-slate-900">
                                                {formatCurrencyWithCode(expense.amount, workspaceCurrency)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 space-y-1 text-slate-700">
                                        <div className="text-base">
                                            Merchant: <span className="text-slate-900 font-medium">{expense.merchant || '-'}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-base text-slate-500">
                                                {dayjs.unix(expense.date).format('DD MMM YYYY')}
                                            </div>
                                            {/* Attachments shortcut */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Always scroll to attachment section, never trigger upload
                                                    mobileAttachmentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-800"
                                                aria-label="Attachments"
                                            >
                                                <span className="relative">
                                                    <Paperclip className="h-4 w-4" />
                                                    {mobileHasAttachments && (
                                                        <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-amber-400 text-slate-900 text-xs font-semibold inline-flex items-center justify-center">
                                                            {mobileAttachmentCount}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Segmented tabs (only show existing feature) */}
                            <div className="rounded-full bg-slate-200 p-1 flex">
                                <button
                                    type="button"
                                    onClick={() => setMobileTab('details')}
                                    className={cn(
                                        'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                                        mobileTab === 'details'
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-800'
                                    )}
                                >
                                    Expense details
                                </button>
                            </div>

                            {/* Details */}
                            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                                <div className="px-4 py-4 space-y-6">
                                    <div>
                                        <div className="text-sm text-slate-500">Description</div>
                                        <div className="mt-1 text-base font-medium text-slate-900 whitespace-pre-wrap">
                                            {expense.description || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attachments */}
                            <div ref={mobileAttachmentsRef} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                                <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
                                    <div className="text-base font-semibold text-slate-900">
                                        Attachments {mobileHasAttachments ? `(${mobileAttachmentCount})` : ''}
                                    </div>

                                </div>

                                <div className="px-4 pb-4 space-y-3">
                                    {mobileHasAttachments ? (
                                        <>
                                            {/* Image display with navigation arrows */}
                                            <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                                <button
                                                    type="button"
                                                    className="w-full aspect-[4/3] relative"
                                                    onClick={() => {
                                                        if (mobileCanPreviewImages) {
                                                            setImageViewerOpen(true);
                                                        }
                                                    }}
                                                >
                                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                                        {allMediaUrls[mobileSelectedMediaIndex] && isPdfUrl(allMediaUrls[mobileSelectedMediaIndex]) ? (
                                                            <div className="text-slate-600 text-sm font-medium">
                                                                PDF
                                                            </div>
                                                        ) : allMediaUrls[mobileSelectedMediaIndex] ? (
                                                            <img
                                                                src={allMediaUrls[mobileSelectedMediaIndex]}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : null}
                                                    </div>
                                                </button>

                                                {/* Left arrow */}
                                                {allMediaUrls.length > 1 && mobileSelectedMediaIndex > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMobileSelectedMediaIndex(mobileSelectedMediaIndex - 1);
                                                        }}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center z-10"
                                                        aria-label="Previous"
                                                    >
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </button>
                                                )}

                                                {/* Right arrow */}
                                                {allMediaUrls.length > 1 && mobileSelectedMediaIndex < allMediaUrls.length - 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMobileSelectedMediaIndex(mobileSelectedMediaIndex + 1);
                                                        }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center z-10"
                                                        aria-label="Next"
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Navigation dots */}
                                            {allMediaUrls.length > 1 && (
                                                <div className="flex items-center justify-center gap-2">
                                                    {allMediaUrls.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => setMobileSelectedMediaIndex(index)}
                                                            className={cn(
                                                                "h-2 rounded-full transition-all",
                                                                index === mobileSelectedMediaIndex
                                                                    ? "w-8 bg-blue-500"
                                                                    : "w-2 bg-slate-300"
                                                            )}
                                                            aria-label={`Go to attachment ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Action buttons: Attach More, Star, Delete */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-10 rounded-xl"
                                                    onClick={() => mobileFileInputRef.current?.click()}
                                                    disabled={uploadingMedia}
                                                >
                                                    <Paperclip className="h-4 w-4 mr-2" />
                                                    Attach more
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 rounded-xl p-0"
                                                    onClick={() => handleMobileMoveToFirst(mobileSelectedMediaIndex)}
                                                    disabled={mobileSelectedMediaIndex === 0 || allMediaUrls.length <= 1}
                                                >
                                                    <Star className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 rounded-xl p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={async () => {
                                                        const originalIndex = selectedMediaIndex;
                                                        setSelectedMediaIndex(mobileSelectedMediaIndex);
                                                        // Remove the currently selected attachment
                                                        if (!expense || allMediaUrls.length === 0) return;

                                                        if (!confirm('Are you sure you want to remove this image?')) {
                                                            setSelectedMediaIndex(originalIndex);
                                                            return;
                                                        }

                                                        try {
                                                            const selectedMediaUrl = allMediaUrls[mobileSelectedMediaIndex];
                                                            const newMedia = (expense.media || []).filter(url => url !== selectedMediaUrl);

                                                            const dateTimestamp = expense.date;
                                                            const updateRequest: ApiExpenseUpdateRequest = {
                                                                date: dateTimestamp,
                                                                merchant: expense.merchant ?? undefined,
                                                                description: expense.description || '',
                                                                original_amount: expense.original_amount || expense.amount,
                                                                currency: expense.currency || workspaceCurrency,
                                                                exchange_rate: expense.exchange_rate || 1,
                                                                amount: expense.amount,
                    media: newMedia,
                                                            };

                                                            await updateExpense(expense.id, updateRequest);
                                                            await onReload();
                                                            await onListReload?.();

                                                            // Adjust mobileSelectedMediaIndex after deletion
                                                            if (newMedia.length > 0) {
                                                                setMobileSelectedMediaIndex(Math.min(mobileSelectedMediaIndex, newMedia.length - 1));
                                                            } else {
                                                                setMobileSelectedMediaIndex(0);
                                                            }
                                                            setSelectedMediaIndex(0);

                                                            toast.success('Image removed successfully');
                                                        } catch (error: any) {
                                                            console.error('Failed to remove image:', error);
                                                            toast.error(error?.response?.data?.error || 'Failed to remove image');
                                                            setSelectedMediaIndex(originalIndex);
                                                        }
                                                    }}
                                                    disabled={allMediaUrls.length === 0}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => mobileFileInputRef.current?.click()}
                                            className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center hover:bg-slate-100 active:bg-slate-100"
                                            disabled={uploadingMedia}
                                        >
                                            <div className="text-sm font-semibold text-slate-700">Attach receipt</div>
                                            <div className="mt-1 text-xs text-slate-500">Tap to attach</div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom action bar (mobile) */}
                        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
                            <div className="mx-auto w-full max-w-md flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="default"
                                    className="flex-1 h-12 rounded-full"
                                    onClick={onEdit}
                                >
                                    Edit
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 w-12 rounded-full p-0"
                                    onClick={() => setMobileActionsOpen(true)}
                                    aria-label="More"
                                >
                                    <span className="text-xl leading-none">•••</span>
                                </Button>
                            </div>
                        </div>

                        {/* Mobile actions sheet (only existing actions) */}
                        {mobileActionsOpen && (
                            <div className="fixed inset-0 z-[40]">
                                <button
                                    type="button"
                                    className="absolute inset-0 bg-black/30"
                                    onClick={() => setMobileActionsOpen(false)}
                                    aria-label="Close"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-base font-semibold text-slate-900">Actions</div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-full"
                                            onClick={() => setMobileActionsOpen(false)}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="grid gap-2">

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="h-12 rounded-xl justify-start"
                                            onClick={() => {
                                                setMobileActionsOpen(false);
                                                onDelete();
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop (md+) */}
                    <div className="hidden md:block p-4 max-w-6xl mx-auto h-full flex flex-col">
                        {/* Header with Actions */}
                        <div className="flex items-center justify-end mb-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onEdit}
                                    className="flex items-center gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={onDelete}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Content Card: Photo on left, Details on right */}
                        <div className="bg-slate-50/10 rounded-lg border p-6 flex-1 flex flex-col">
                            <div className="flex ">
                                {/* Left Side - Media Gallery Section */}
                                <MediaGallery
                                    mediaUrls={allMediaUrls}
                                    imageUrls={imageUrls}
                                    selectedMediaIndex={selectedMediaIndex}
                                    onMediaSelect={setSelectedMediaIndex}
                                    uploadingMedia={uploadingMedia}
                                    onFileInputChange={handleFileInputChange}
                                    onMoveToFirst={handleMoveToFirst}
                                    onRemoveMedia={handleRemoveImage}
                                    onImageClick={() => setImageViewerOpen(true)}
                                />

                                {/* Right Side - Expense Details Section */}
                                <div className="flex-1 h-full overflow-y-auto">
                                    <div className="p-4">
                                        {/* Date */}
                                        <div className="mb-1">
                                            <div className="text-sm font-medium">{formatDate(expense.date)}</div>
                                        </div>

                                        {/* Merchant */}
                                        <div className="mb-4">
                                            <span className="text-xs text-muted-foreground mr-1">Merchant:</span>
                                            <span className="text-sm font-medium">{expense.merchant || '-'}</span>
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            {(expense.original_amount ?? 0) > 0 && expense.currency && expense.currency.trim() !== '' ? (
                                                <div className="space-y-1">
                                                    <div className="text-3xl text-primary">
                                                        {formatCurrencyWithCode(expense.original_amount ?? expense.amount, expense.currency)}
                                                    </div>
                                                    {expense.currency !== workspaceCurrency && expense.amount !== expense.original_amount && (
                                                        <div className="text-base text-muted-foreground">
                                                            equals {formatCurrencyWithCode(expense.amount, workspaceCurrency)}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-3xl text-primary">
                                                    {formatCurrencyWithCode(expense.amount, workspaceCurrency)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Divider Line */}
                                        <div className="border-t pt-4 mt-4"></div>

                                        {/* Details Section */}
                                        <div>
                                            <div className="text-sm font-semibold mb-2">Details</div>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                                                    <div className="text-sm whitespace-pre-wrap">{expense.description || '-'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Image Viewer Modal */}
            {imageUrls.length > 0 && (
                <ImageViewer
                    images={imageUrls}
                    initialIndex={allMediaUrls.length > 0 && !isPdfUrl(allMediaUrls[selectedMediaIndex])
                        ? imageUrls.indexOf(allMediaUrls[selectedMediaIndex])
                        : 0}
                    open={imageViewerOpen}
                    onOpenChange={setImageViewerOpen}
                    expense={expense}
                />
            )}
        </div>
    );
}
