import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createExpenseAiJob, getExpenseAiJob, createExpense, updateExpense } from '@/api/client/expenses';
import { ExpenseDTO, ApiExpenseCreateRequest, ApiExpenseUpdateRequest } from '@/api/types/expense';
import { FileWithPreview } from './file-upload';
import { extractFilenameFromUrl, isPdfUrl } from './file-utils';
import { toast } from 'sonner';
import { Loader2, X, Upload, FileText, RotateCw, Trash2, Plus, ZoomIn, ZoomOut, RotateCcw, Scan } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CurrencySelect } from './currency-select';
import { cn } from '@/lib/utils';
import { formatDateYMD, todayYMD, parseToTimestamp, dayjs } from '@/lib/date';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExpenseSchema, ExpenseFormData } from './form/schema';
import MobileExpenseForm from './mobile-expense-form';
import ReceiptViewer from './receipt-viewer';
import InlinePdfViewer from './inline-pdf-viewer';
import { useCurrencyFormatter, SUPPORTED_CURRENCIES, getExchangeRateToUsd } from '@/lib/currency';

interface ExpenseFormProps {
    expense?: ExpenseDTO;
    initialFiles?: FileWithPreview[];
    autoScan?: boolean;
    onSuccess?: (expense: ExpenseDTO, saveAndNew?: boolean) => void;
    onClose?: () => void;
    isMobile?: boolean;
}

// Hook to detect mobile screen size
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        // Check on mount
        checkIsMobile();

        // Listen for resize events
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return isMobile;
}

export default function ExpenseForm({
    expense,
    initialFiles = [],
    autoScan = false,
    onSuccess,
    onClose,
    isMobile: isMobileProp
}: ExpenseFormProps) {
    const t = useTranslations('aiExpense');
    const formatCurrency = useCurrencyFormatter();

    const detectedIsMobile = useIsMobile();
    // Use prop if provided, otherwise detect automatically
    const isMobile = isMobileProp !== undefined ? isMobileProp : detectedIsMobile;
    const [isVisible, setIsVisible] = useState(false);
    
    // Currency and exchange rate state
    const workspaceCurrency = 'USD';
    const [selectedCurrency, setSelectedCurrency] = useState<string>(workspaceCurrency);
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [manualExchangeRate, setManualExchangeRate] = useState<string>('');
    const supportedCurrencies = [...SUPPORTED_CURRENCIES];
    const [currencySearchKeyword, setCurrencySearchKeyword] = useState('');
    const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);

    // Form state
    const [files, setFiles] = useState<FileWithPreview[]>(initialFiles);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [initialFilesRef, setInitialFilesRef] = useState<FileWithPreview[]>(initialFiles);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Desktop specific state
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [imageScales, setImageScales] = useState<Record<number, number>>({});
    const [imageRotations, setImageRotations] = useState<number[]>([]);
    const [shouldAnimateTransform, setShouldAnimateTransform] = useState(false);
    const prevSelectedIndexRef = useRef<number>(0);
    const autoScanTriggeredRef = useRef<boolean>(false);
    const autoScanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [scanProgress, setScanProgress] = useState<number>(0);
    const [scanFailed, setScanFailed] = useState<boolean>(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [scanCompleteKey, setScanCompleteKey] = useState<number>(0);

    // Mobile specific state
    const [showReceiptViewer, setShowReceiptViewer] = useState(false);

    // Use hardcoded exchange rate when currency changes (no API)
    useEffect(() => {
        if (selectedCurrency === workspaceCurrency) {
            setExchangeRate(1);
            setManualExchangeRate('');
            return;
        }
        const rate = getExchangeRateToUsd(selectedCurrency);
        setExchangeRate(rate);
        setManualExchangeRate(rate.toFixed(6));
    }, [selectedCurrency, workspaceCurrency]);

    // Filter currencies based on search keyword
    const filteredCurrencies = useMemo(() => {
        if (!currencySearchKeyword.trim()) {
            return supportedCurrencies;
        }
        const keyword = currencySearchKeyword.toLowerCase().trim();
        return supportedCurrencies.filter((currency) =>
            currency.toLowerCase().includes(keyword)
        );
    }, [supportedCurrencies, currencySearchKeyword]);

    // Form setup
    const expenseSchema = createExpenseSchema(t);
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty },
        reset,
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: expense
            ? {
                date: formatDateYMD(expense.date),
                merchant: expense.merchant ?? '',
                amount: (expense.original_amount ?? 0) > 0 ? (expense.original_amount ?? expense.amount) : expense.amount,
                description: expense.description ?? '',
            }
            : {
                date: todayYMD(),
                merchant: '',
                amount: 0,
                description: '',
            },
    });

    // Watch amount value for conversion
    const amountValue = watch('amount');

    // Pre-fill files from expense media if editing and set initial files reference
    useEffect(() => {
        if (expense) {
            // Set currency and exchange rate from expense
            if (expense.currency && expense.currency.trim() !== '') {
                setSelectedCurrency(expense.currency);
                if (expense.exchange_rate != null && expense.exchange_rate > 0) {
                    setExchangeRate(expense.exchange_rate);
                    setManualExchangeRate(expense.exchange_rate.toFixed(6));
                }
            }
            
            if (expense.media && expense.media.length > 0) {
                const existingFiles: FileWithPreview[] = expense.media.map((url) => {
                    const filename = extractFilenameFromUrl(url);
                    const isPDF = isPdfUrl(url);
                    const mimeType = isPDF ? 'application/pdf' : 'image/jpeg';
                    return {
                        file: new File([], filename, { type: mimeType }),
                        preview: isPDF ? 'pdf' : url,
                        base64: url,
                    };
                });
                if (files.length === 0) {
                    setFiles(existingFiles);
                }
                setInitialFilesRef(existingFiles);
            } else {
                setInitialFilesRef([]);
            }
        }
    }, [expense?.id]);

    // Update files when initialFiles changes (for new expense creation)
    useEffect(() => {
        if (!expense && initialFiles.length > 0) {
            const currentFilesBase64 = files.map(f => f.base64).sort().join(',');
            const newFilesBase64 = initialFiles.map(f => f.base64).sort().join(',');
            if (currentFilesBase64 !== newFilesBase64) {
                setFiles(initialFiles);
                setInitialFilesRef(initialFiles);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFiles, expense]);

    // Check if files have been modified
    const filesChanged = useCallback(() => {
        if (files.length !== initialFilesRef.length) {
            return true;
        }
        const currentBase64s = files.map(f => f.base64).sort();
        const initialBase64s = initialFilesRef.map(f => f.base64).sort();
        return JSON.stringify(currentBase64s) !== JSON.stringify(initialBase64s);
    }, [files, initialFilesRef]);

    // Check if form has been modified (either form fields or files)
    const hasFormChanges = isDirty || filesChanged();

    // Reset form function
    const resetForm = useCallback(() => {
        reset({
            date: todayYMD(),
            merchant: '',
            amount: 0,
            description: '',
        });
        setFiles([]);
        setInitialFilesRef([]);
        // Reset currency to workspace currency
        setSelectedCurrency(workspaceCurrency);
        setExchangeRate(1);
        setManualExchangeRate('');
        setCurrencySearchKeyword('');
    }, [reset, workspaceCurrency]);

    // Handle manual exchange rate change
    const handleManualExchangeRateChange = (value: string) => {
        setManualExchangeRate(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            setExchangeRate(numValue);
        }
    };

    // Handle currency change
    const handleCurrencyChange = (currency: string) => {
        setSelectedCurrency(currency);
        setIsCurrencyPopoverOpen(false);
        setCurrencySearchKeyword('');
    };

    // Submit handler
    const onSubmit = async (data: ExpenseFormData, saveAndNew: boolean = false): Promise<boolean> => {
        setIsSubmitting(true);
        try {
            const dateTimestamp = parseToTimestamp(data.date);
            const media: string[] = files.map((f) => f.base64);

            // Calculate original amount and converted amount
            const originalAmount = data.amount; // Amount in selected currency
            const currency = selectedCurrency;
            const rate = selectedCurrency !== workspaceCurrency && exchangeRate > 0 ? exchangeRate : 1;
            const finalAmount = selectedCurrency !== workspaceCurrency && exchangeRate > 0 
                ? data.amount * exchangeRate 
                : data.amount; // Amount in workspace currency

            const request: ApiExpenseCreateRequest = {
                date: dateTimestamp,
                merchant: data.merchant,
                description: data.description || '',
                original_amount: originalAmount,
                currency: currency,
                exchange_rate: rate,
                amount: finalAmount,
                media,
            };

            let result: ExpenseDTO;
            if (expense) {
                const updateRequest: ApiExpenseUpdateRequest = {
                    date: dateTimestamp,
                    merchant: data.merchant,
                    description: data.description || '',
                    original_amount: originalAmount,
                    currency: currency,
                    exchange_rate: rate,
                    amount: finalAmount,
                    media,
                };
                result = await updateExpense(expense.id, updateRequest);
                toast.success(t('toast.expense updated successfully'));
            } else {
                result = await createExpense(request);
                toast.success(t('toast.expense created successfully'));
            }

            if (saveAndNew) {
                resetForm();
            }

            onSuccess?.(result, saveAndNew);
            return true;
        } catch (error: any) {
            console.error('Failed to save expense:', error);
            toast.error(error?.response?.data?.error || error?.message || t('toast.failed to save expense'));
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveAndClose = handleSubmit(
        async (data) => {
            await onSubmit(data, false);
        },
        (errors) => {
            // Handle validation errors - don't close if validation fails
            console.log('Validation errors:', errors);
        }
    );
    const handleSaveAndNew = handleSubmit((data) => onSubmit(data, true));

    // File upload handlers
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

    const processFiles = useCallback(async (fileList: FileList) => {
        const newFiles: FileWithPreview[] = [];
        const fileArray = Array.from(fileList);

        for (const file of fileArray) {
            const isImage = file.type.startsWith('image/');
            const isPDF = file.type === 'application/pdf';
            const isDOC = file.type === 'application/msword';
            const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            const isXLS = file.type === 'application/vnd.ms-excel';
            const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const isCSV = file.type === 'text/csv' || file.type === 'application/csv';
            const isTXT = file.type === 'text/plain';
            const isVideo = file.type.startsWith('video/');
            const isAudio = file.type.startsWith('audio/');

            if (!isImage && !isPDF && !isDOC && !isDOCX && !isXLS && !isXLSX && !isCSV && !isTXT && !isVideo && !isAudio) {
                toast.error(`${file.name} ${t('toast.file type not supported')}`);
                continue;
            }

            if (files.length + newFiles.length >= 10) {
                toast.error(t('toast.maximum files allowed: {count}', { count: '10' }));
                break;
            }

            try {
                const base64 = await convertFileToBase64(file);
                const fileIsPDF = file.type === 'application/pdf';
                const fileIsDocument = fileIsPDF || isDOC || isDOCX || isXLS || isXLSX || isCSV || isTXT;
                newFiles.push({
                    file,
                    preview: fileIsDocument ? 'document' : base64,
                    base64,
                });
            } catch (error) {
                console.error(`Failed to process ${file.name}:`, error);
                toast.error(`${t('toast.failed to process file')} ${file.name}`);
            }
        }

        if (newFiles.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    }, [files.length, t]);

    const handleFileInputChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                await processFiles(e.target.files);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [processFiles]
    );

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // Trigger slide-in animation
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // --- Desktop Logic Start ---

    // Update selected index when files change
    useEffect(() => {
        if (!isMobile && files.length > 0 && selectedImageIndex >= files.length) {
            setSelectedImageIndex(Math.max(0, files.length - 1));
        } else if (!isMobile && files.length === 0) {
            setSelectedImageIndex(0);
        }
    }, [files.length, selectedImageIndex, isMobile]);

    // Disable animation when switching images
    useEffect(() => {
        if (!isMobile && prevSelectedIndexRef.current !== selectedImageIndex) {
            setShouldAnimateTransform(false);
            prevSelectedIndexRef.current = selectedImageIndex;
            requestAnimationFrame(() => {
                setShouldAnimateTransform(false);
            });
        }
    }, [selectedImageIndex, isMobile]);

    // Initialize transform states
    useEffect(() => {
        if (!isMobile && files.length > 0 && selectedImageIndex < files.length) {
            setImageRotations(prev => {
                if (prev.length <= selectedImageIndex) {
                    const newRotations = [...prev];
                    while (newRotations.length <= selectedImageIndex) {
                        newRotations.push(0);
                    }
                    return newRotations;
                }
                return prev;
            });
            setImageScales(prev => {
                if (!prev[selectedImageIndex]) {
                    return {
                        ...prev,
                        [selectedImageIndex]: 1
                    };
                }
                return prev;
            });
        }
    }, [selectedImageIndex, files.length, isMobile]);

    // Handle file upload with auto-selection (Desktop)
    const handleFileInputChangeWithSelection = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const previousFilesCount = files.length;
            await handleFileInputChange(e);
            setTimeout(() => {
                setFiles((currentFiles: FileWithPreview[]) => {
                    if (currentFiles.length > previousFilesCount) {
                        setSelectedImageIndex(previousFilesCount);
                    }
                    return currentFiles;
                });
            }, 0);
        },
        [files.length, handleFileInputChange, setFiles]
    );

    const removeFile = useCallback(
        (index: number) => {
            const newFiles = files.filter((_: FileWithPreview, i: number) => i !== index);
            setFiles(newFiles);
            setImageRotations(prev => {
                const newRotations = [...prev];
                newRotations.splice(index, 1);
                return newRotations;
            });
            setImageScales(prev => {
                const newScales: Record<number, number> = {};
                Object.keys(prev).forEach(key => {
                    const keyNum = parseInt(key);
                    if (keyNum < index) {
                        newScales[keyNum] = prev[keyNum];
                    } else if (keyNum > index) {
                        newScales[keyNum - 1] = prev[keyNum];
                    }
                });
                return newScales;
            });
            if (index === selectedImageIndex) {
                if (newFiles.length > 0) {
                    setSelectedImageIndex(Math.min(index, newFiles.length - 1));
                } else {
                    setSelectedImageIndex(0);
                }
            } else if (index < selectedImageIndex) {
                setSelectedImageIndex(selectedImageIndex - 1);
            }
        },
        [files, selectedImageIndex, setFiles]
    );

    const handlePreviewClick = (fileWithPreview: FileWithPreview) => {
        const isPDF =
            fileWithPreview.preview === 'pdf' ||
            fileWithPreview.file.type === 'application/pdf' ||
            (typeof fileWithPreview.base64 === 'string' && isPdfUrl(fileWithPreview.base64));

        if (isPDF) {
            const pdfUrl = fileWithPreview.base64.startsWith('data:')
                ? fileWithPreview.base64
                : fileWithPreview.base64;
            window.open(pdfUrl, '_blank');
        } else {
            window.open(fileWithPreview.preview, '_blank');
        }
    };

    const handleAiScan = async (imageIndex?: number) => {
        if (files.length === 0) {
            toast.error(t('toast.please upload at least one file'));
            return;
        }

        // Use provided index or fall back to selectedImageIndex
        const indexToScan = imageIndex !== undefined ? imageIndex : selectedImageIndex;
        const currentFile = files[indexToScan];
        if (!currentFile) {
            toast.error(t('toast.please select a file'));
            return;
        }

        // Allow images and documents, but block videos and audio
        const isVideo = currentFile.file.type.startsWith('video/');
        const isAudio = currentFile.file.type.startsWith('audio/');

        if (isVideo || isAudio) {
            toast.error(t('toast.please select an image or document file'));
            return;
        }

        setIsScanning(true);
        setScanProgress(0);
        setScanFailed(false);

        // Smooth progress animation - processing status will control max 95%
        const progressDuration = 30000; // 30 seconds total duration
        const progressSteps = 300; // More steps for smoother animation
        const progressStepTime = progressDuration / progressSteps; // ~100ms per step
        const progressIncrement = 95 / progressSteps; // Max 95% during processing

        let currentProgress = 0;
        const startTime = Date.now();

        progressIntervalRef.current = setInterval(() => {
            // Calculate progress based on elapsed time for smoother animation
            const elapsed = Date.now() - startTime;
            const timeBasedProgress = Math.min((elapsed / progressDuration) * 95, 95);

            // Use the higher of time-based or incremental progress for smoothness
            currentProgress = Math.max(currentProgress + progressIncrement, timeBasedProgress);

            if (currentProgress >= 95) {
                currentProgress = 95;
                // Keep interval running but don't exceed 95% until status changes
            }
            setScanProgress(currentProgress);
        }, progressStepTime);

        try {
            const media = [currentFile.base64];
            const createResponse = await createExpenseAiJob(media);
            const jobId = createResponse.job_id;
            toast.success(t('toast.ai scan started'));

            const pollInterval = 1000;
            const maxAttempts = 60;
            let attempts = 0;

            const pollJobStatus = async (): Promise<void> => {
                try {
                    attempts++;
                    if (attempts > maxAttempts) {
                        throw new Error(t('toast.ai scan timeout'));
                    }

                    const job = await getExpenseAiJob(jobId);

                    // Update progress based on status
                    if (job.status === 'processing' || job.status === 'pending') {
                        // Keep progress at max 95% during processing
                        if (progressIntervalRef.current) {
                            // Ensure progress doesn't exceed 95%
                            setScanProgress((prev) => Math.min(prev, 95));
                        }
                        // Recursive call with error handling
                        setTimeout(() => {
                            pollJobStatus().catch((err) => {
                                // Handle error from recursive call
                                if (progressIntervalRef.current) {
                                    clearInterval(progressIntervalRef.current);
                                    progressIntervalRef.current = null;
                                }
                                // Show red progress bar on error
                                setScanFailed(true);
                                setScanProgress(100);
                                toast.error(err?.response?.data?.message || err?.message || t('toast.ai scan failed'));
                                setIsScanning(false);
                                setTimeout(() => {
                                    setScanProgress(0);
                                    setScanFailed(false);
                                }, 2000); // Keep red bar visible for 2 seconds
                            });
                        }, pollInterval);
                    } else if (job.status === 'completed') {
                        // Stop the progress interval
                        if (progressIntervalRef.current) {
                            clearInterval(progressIntervalRef.current);
                            progressIntervalRef.current = null;
                        }

                        // Animate to 100% first, then update form
                        setScanProgress(100);

                        // Wait for animation to complete before updating form
                        setTimeout(() => {
                            const extracted = job.result;
                            const currentValues = {
                                date: todayYMD(),
                                merchant: '',
                                amount: 0,
                                description: '',
                            };

                            if (extracted) {
                                if (typeof extracted.date === 'number') {
                                    currentValues.date = formatDateYMD(extracted.date);
                                }
                                currentValues.merchant = extracted.merchant || '';
                                currentValues.amount = extracted.amount ?? extracted.original_amount ?? 0;
                                currentValues.description = extracted.description || '';
                            }

                            // Reset form with all values, ensuring UI updates
                            reset(currentValues);

                            toast.success(t('toast.ai scan completed'));
                            setIsScanning(false);
                            // Force mobile form to re-render after scanning completes
                            setScanCompleteKey(prev => prev + 1);
                            setTimeout(() => {
                                setScanProgress(0);
                                setScanFailed(false);
                            }, 500);
                        }, 500); // Wait 500ms for progress bar animation
                    } else if (job.status === 'failed') {
                        // Stop the progress interval
                        if (progressIntervalRef.current) {
                            clearInterval(progressIntervalRef.current);
                            progressIntervalRef.current = null;
                        }

                        // Set failed state and show error
                        setScanFailed(true);
                        setScanProgress(100); // Show full red bar

                        // Show error message after a brief delay
                        setTimeout(() => {
                            toast.error(t('toast.ai scan failed'));
                            setIsScanning(false);
                            setTimeout(() => {
                                setScanProgress(0);
                                setScanFailed(false);
                            }, 2000); // Keep red bar visible for 2 seconds
                        }, 300);
                    } else {
                        // Unknown status, continue polling
                        setTimeout(() => {
                            pollJobStatus().catch((err) => {
                                // Handle error from recursive call
                                if (progressIntervalRef.current) {
                                    clearInterval(progressIntervalRef.current);
                                    progressIntervalRef.current = null;
                                }
                                // Show red progress bar on error
                                setScanFailed(true);
                                setScanProgress(100);
                                toast.error(err?.response?.data?.message || err?.message || t('toast.ai scan failed'));
                                setIsScanning(false);
                                setTimeout(() => {
                                    setScanProgress(0);
                                    setScanFailed(false);
                                }, 2000); // Keep red bar visible for 2 seconds
                            });
                        }, pollInterval);
                    }
                } catch (error: any) {
                    // Re-throw to be caught by outer try-catch
                    throw error;
                }
            };

            await pollJobStatus();
        } catch (error: any) {
            console.error('AI scan failed:', error);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            // Show red progress bar on error
            setScanFailed(true);
            setScanProgress(100);
            toast.error(error?.response?.data?.message || error?.message || t('toast.ai scan failed'));
            setIsScanning(false);
            setTimeout(() => {
                setScanProgress(0);
                setScanFailed(false);
            }, 2000); // Keep red bar visible for 2 seconds
        }
    };

    // Auto-scan logic
    useEffect(() => {
        if (!autoScan) {
            autoScanTriggeredRef.current = false;
            if (autoScanTimeoutRef.current) {
                clearTimeout(autoScanTimeoutRef.current);
                autoScanTimeoutRef.current = null;
            }
            return;
        }

        if (autoScanTriggeredRef.current || isScanning || files.length === 0) {
            return;
        }

        if (autoScanTimeoutRef.current) {
            return;
        }

        autoScanTriggeredRef.current = true;
        autoScanTimeoutRef.current = setTimeout(() => {
            autoScanTimeoutRef.current = null;
            // For mobile, scan the first image (index 0)
            // For desktop, scan the selected image
            const imageIndexToScan = isMobile ? 0 : selectedImageIndex;
            if (files.length > 0 && imageIndexToScan < files.length && !isScanning) {
                // For mobile, ensure we're scanning the first image
                if (isMobile && selectedImageIndex !== imageIndexToScan) {
                    setSelectedImageIndex(imageIndexToScan);
                }
                // Small delay to ensure state is updated, then scan
                setTimeout(() => {
                    handleAiScan();
                }, 100);
            }
        }, 500);

        return () => { };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoScan, files.length, isScanning, selectedImageIndex, isMobile]);

    // Cleanup progress interval
    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, []);

    // --- Desktop Logic End ---

    // --- Mobile Logic Start ---
    const handleFileClick = () => {
        setShowReceiptViewer(true);
    };

    const handleReceiptViewerClose = () => {
        setShowReceiptViewer(false);
    };
    // --- Mobile Logic End ---


    // Render Mobile View
    if (isMobile) {
        return (
            <>
                <div
                    className={cn(
                        "fixed inset-0 z-50 flex flex-col transition-transform duration-300 ease-out bg-slate-100",
                        isVisible ? "translate-y-0" : "translate-y-full"
                    )}
                >
                    {/* Header */}
                    <div className="border-b border-slate-200 bg-white px-4 py-2">
                        <div className="text-center text-2xl font-semibold tracking-tight text-slate-900">
                            {expense ? t('edit expense') : t('new expense')}
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,video/*,audio/*"
                        multiple
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    {/* Mobile Form Container - Relative for overlay positioning */}
                    <div className="flex-1 relative overflow-hidden">
                        <MobileExpenseForm
                            key={scanCompleteKey}
                            register={register}
                            control={control}
                            errors={errors}
                            isScanning={isScanning}
                            files={files}
                            onFileClick={handleFileClick}
                            hasFormChanges={hasFormChanges}
                            isSubmitting={isSubmitting}
                            onCancel={() => {
                                if (hasFormChanges) {
                                    setShowConfirmDialog(true);
                                } else {
                                    onClose?.();
                                }
                            }}
                            onSave={handleSaveAndClose}
                            selectedCurrency={selectedCurrency}
                            workspaceCurrency={workspaceCurrency}
                            exchangeRate={exchangeRate}
                            manualExchangeRate={manualExchangeRate}
                            isLoadingExchangeRate={false}
                            supportedCurrencies={supportedCurrencies}
                            currencySearchKeyword={currencySearchKeyword}
                            isCurrencyPopoverOpen={isCurrencyPopoverOpen}
                            amountValue={amountValue}
                            onCurrencyChange={handleCurrencyChange}
                            onCurrencySearchChange={setCurrencySearchKeyword}
                            onCurrencyPopoverOpenChange={setIsCurrencyPopoverOpen}
                            onManualExchangeRateChange={handleManualExchangeRateChange}
                        />

                        {/* Scanning Overlay - Mobile */}
                        {isScanning && (
                            <div
                                className="absolute inset-0 z-5 bg-black/50 flex items-center justify-center pointer-events-none"
                            >
                                <div className="bg-white rounded-2xl p-6 mx-4 shadow-lg max-w-sm w-full pointer-events-auto">
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            <span className="text-base font-semibold text-slate-900">{t('scanning')}</span>
                                        </div>
                                        <span className="text-base font-semibold text-slate-600">{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-300 ease-out",
                                                scanFailed ? "bg-red-500" : "bg-primary"
                                            )}
                                            style={{ width: `${scanProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Leave Dialog */}
                    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('discard changes')}</DialogTitle>
                                <DialogDescription>
                                    {t('you have unsaved changes. if you leave, they will be lost.')}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="default" onClick={() => setShowConfirmDialog(false)}>
                                    {t('keep editing')}
                                </Button>
                                <Button variant="outline" onClick={() => {
                                    setShowConfirmDialog(false);
                                    onClose?.();
                                }}>
                                    {t('discard and leave')}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Receipt Viewer */}
                {showReceiptViewer && (
                    <ReceiptViewer
                        files={files}
                        onFilesChange={setFiles}
                        onClose={handleReceiptViewerClose}
                        onDone={handleReceiptViewerClose}
                        onAiScan={handleAiScan}
                        isScanning={isScanning}
                    />
                )}
            </>
        );
    }

    // Render Desktop View
    return (
        <div
            className={cn(
                "fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-out",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-6">
                    <button
                        className={cn(
                            "text-lg font-bold transition-colors",
                            "text-primary border-primary"
                        )}
                    >
                        {expense ? t('edit expense') : t('add expense')}
                    </button>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (hasFormChanges) {
                            setShowConfirmDialog(true);
                        } else {
                            onClose?.();
                        }
                    }}
                    className="h-8 w-8"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Side - Receipt Upload Area */}
                <div className="flex-[2] flex flex-col border-r bg-muted/30 relative min-w-0">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,video/*,audio/*"
                        multiple
                        onChange={handleFileInputChangeWithSelection}
                        className="hidden"
                    />

                    {files.length === 0 ? (
                        <div
                            className="flex-1 flex items-center justify-center p-8 cursor-pointer"
                            onClick={handleClick}
                        >
                            <div className="text-center space-y-4">
                                <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('attach receipts from computer or phone')}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Main Image Display Area */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center p-6">
                                {files[selectedImageIndex] && (() => {
                                    const currentFile = files[selectedImageIndex];
                                    const isPDF =
                                        currentFile.preview === 'pdf' ||
                                        currentFile.file.type === 'application/pdf' ||
                                        (typeof currentFile.base64 === 'string' && isPdfUrl(currentFile.base64));

                                    if (isPDF) {
                                        const pdfUrl = currentFile.base64.startsWith('data:')
                                            ? currentFile.base64
                                            : `data:application/pdf;base64,${currentFile.base64}`;
                                        return (
                                            <div className="w-full max-w-4xl h-full flex flex-col bg-white rounded-lg border border-muted overflow-hidden">
                                                <div className="flex items-center justify-between p-4 border-b border-muted">
                                                    <p className="text-lg font-medium text-foreground">
                                                        {currentFile.file.name || 'PDF Document'}
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePreviewClick(currentFile)}
                                                    >
                                                        {t('open pdf')}
                                                    </Button>
                                                </div>
                                                <div className="flex-1 min-h-0">
                                                    <InlinePdfViewer
                                                        url={pdfUrl}
                                                        filename={currentFile.file.name}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }

                                    const currentScale = imageScales[selectedImageIndex] || 1;
                                    const currentRotation = imageRotations[selectedImageIndex] || 0;
                                    const transformStyle = {
                                        transform: `scale(${currentScale}) rotate(${currentRotation}deg)`,
                                        transition: shouldAnimateTransform ? 'transform 0.2s ease-out' : 'none',
                                    };

                                    return (
                                        <div className="w-full max-w-4xl">
                                            <div className="flex items-start justify-center">
                                                <img
                                                    key={`image-${selectedImageIndex}`}
                                                    src={currentFile.preview}
                                                    alt=""
                                                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                                                    style={transformStyle}
                                                />
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Action Bar - Absolute positioned at bottom of parent div */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center min-w-0 pointer-events-none">
                                <div className="bg-white rounded-2xl border px-3 py-1.5 shadow-sm inline-flex min-w-0 pointer-events-auto">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Thumbnails */}
                                        <div className="flex items-center gap-2 min-w-0 overflow-x-auto">
                                            {files.map((fileWithPreview: FileWithPreview, index: number) => {
                                                const isPDF =
                                                    fileWithPreview.preview === 'pdf' ||
                                                    fileWithPreview.file.type === 'application/pdf' ||
                                                    (typeof fileWithPreview.base64 === 'string' && isPdfUrl(fileWithPreview.base64));
                                                const isSelected = index === selectedImageIndex;

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isScanning) {
                                                                setSelectedImageIndex(index);
                                                            }
                                                        }}
                                                        disabled={isScanning}
                                                        className={cn(
                                                            "flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all",
                                                            isSelected
                                                                ? "border-primary ring-2 ring-primary/20"
                                                                : "border-muted hover:border-primary/50",
                                                            isScanning && "opacity-50 cursor-not-allowed"
                                                        )}
                                                    >
                                                        {isPDF ? (
                                                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={fileWithPreview.preview}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                            {/* Add Image Button - Only show if less than 10 files */}
                                            {files.length < 10 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isScanning) {
                                                            handleClick();
                                                        }
                                                    }}
                                                    disabled={isScanning}
                                                    className={cn(
                                                        "flex-shrink-0 w-10 h-10 rounded-lg border-2 border-dashed border-muted hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-center",
                                                        isScanning && "opacity-50 cursor-not-allowed"
                                                    )}
                                                >
                                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                                </button>
                                            )}
                                        </div>

                                        {/* AI Scan Button */}
                                        {files.length > 0 && (
                                            <div className="flex items-center border-l pl-3">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAiScan();
                                                    }}
                                                    disabled={isScanning || files.length === 0}
                                                    className="h-8 gap-2"
                                                >
                                                    {isScanning ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            <span className="text-xs">{t('scanning')}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Scan className="h-4 w-4" />
                                                            <span className="text-xs">{t('ai scan')}</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Action Buttons - Icons Only */}
                                        <div className="flex items-center gap-1 border-l pl-3">
                                            {(() => {
                                                const currentFile = files[selectedImageIndex];
                                                const isPDF = currentFile && (
                                                    currentFile.preview === 'pdf' ||
                                                    currentFile.file.type === 'application/pdf' ||
                                                    (typeof currentFile.base64 === 'string' && isPdfUrl(currentFile.base64))
                                                );
                                                const isTransformDisabled = files.length === 0 || isPDF || isScanning;

                                                return (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShouldAnimateTransform(true);
                                                                const currentScale = imageScales[selectedImageIndex] || 1;
                                                                setImageScales({
                                                                    ...imageScales,
                                                                    [selectedImageIndex]: Math.min(currentScale + 0.25, 3), // Max zoom 3x
                                                                });
                                                            }}
                                                            className="h-8 w-8"
                                                            disabled={isTransformDisabled}
                                                        >
                                                            <ZoomIn className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShouldAnimateTransform(true);
                                                                const currentScale = imageScales[selectedImageIndex] || 1;
                                                                setImageScales({
                                                                    ...imageScales,
                                                                    [selectedImageIndex]: Math.max(currentScale - 0.25, 0.25), // Min zoom 0.25x
                                                                });
                                                            }}
                                                            className="h-8 w-8"
                                                            disabled={isTransformDisabled}
                                                        >
                                                            <ZoomOut className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShouldAnimateTransform(true);
                                                                setImageRotations(prev => {
                                                                    const newRotations = [...prev];
                                                                    const currentRotation = newRotations[selectedImageIndex] || 0;
                                                                    newRotations[selectedImageIndex] = currentRotation - 90;
                                                                    return newRotations;
                                                                });
                                                            }}
                                                            className="h-8 w-8"
                                                            disabled={isTransformDisabled}
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShouldAnimateTransform(true);
                                                                setImageRotations(prev => {
                                                                    const newRotations = [...prev];
                                                                    const currentRotation = newRotations[selectedImageIndex] || 0;
                                                                    newRotations[selectedImageIndex] = currentRotation + 90;
                                                                    return newRotations;
                                                                });
                                                            }}
                                                            className="h-8 w-8"
                                                            disabled={isTransformDisabled}
                                                        >
                                                            <RotateCw className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!isScanning) {
                                                                    removeFile(selectedImageIndex);
                                                                }
                                                            }}
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            disabled={files.length === 0 || isScanning}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Side - Form */}
                <div className="flex-[1] flex-shrink-0 overflow-y-auto p-6 bg-white relative">
                    <form
                        className="space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        {/* Progress Bar - Show when scanning */}
                        {isScanning && (
                            <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">{t('scanning')}</span>
                                    <span className="text-sm font-medium text-muted-foreground">{Math.round(scanProgress)}%</span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-300 ease-out",
                                            scanFailed ? "bg-red-500" : "bg-primary"
                                        )}
                                        style={{ width: `${scanProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {/* Date */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="date">{t('date')} *</Label>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => {
                                    const dateValue = field.value ? dayjs(field.value).toDate() : undefined;
                                    return (
                                        <DatePicker
                                            date={dateValue}
                                            onDateChange={(date) => {
                                                if (date) {
                                                    field.onChange(dayjs(date).format('YYYY-MM-DD'));
                                                } else {
                                                    field.onChange('');
                                                }
                                            }}
                                            disabled={isScanning}
                                            placeholder={t('select date')}
                                            error={!!errors.date}
                                            dateFormat="YYYY-MM-DD"
                                            showIcon={true}
                                            buttonClassName={cn(
                                                "w-1/2",
                                                errors.date ? 'border-destructive' : ''
                                            )}
                                        />
                                    );
                                }}
                            />
                            {errors.date && (
                                <p className="text-sm text-destructive">{errors.date.message}</p>
                            )}
                        </div>

                        {/* Merchant */}
                        <div className="space-y-2">
                            <Label htmlFor="merchant">{t('merchant')} *</Label>
                            <Input
                                id="merchant"
                                {...register('merchant')}
                                placeholder={t('enter merchant name')}
                                className={errors.merchant ? 'border-destructive' : ''}
                                disabled={isScanning}
                            />
                            {errors.merchant && (
                                <p className="text-sm text-destructive">{errors.merchant.message}</p>
                            )}
                        </div>

                        {/* Currency and Amount */}
                        <CurrencySelect
                            id="currency"
                            label={t('currency')}
                            selectedCurrency={selectedCurrency}
                            currencySearchKeyword={currencySearchKeyword}
                            filteredCurrencies={filteredCurrencies}
                            isOpen={isCurrencyPopoverOpen}
                            onOpenChange={setIsCurrencyPopoverOpen}
                            onCurrencyChange={handleCurrencyChange}
                            onSearchChange={setCurrencySearchKeyword}
                            placeholder={t('select currency')}
                            emptyMessage={t('no currencies found')}
                            searchPrompt={t('start typing to search...')}
                            disabled={isScanning}
                        />

                        {/* Exchange Rate (show only if currency differs from workspace) */}
                        {selectedCurrency !== workspaceCurrency && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="exchange-rate">
                                        {t('exchange rate')} ({selectedCurrency} → {workspaceCurrency})
                                    </Label>
                                </div>
                                <Input
                                    id="exchange-rate"
                                    type="number"
                                    step="0.000001"
                                    min="0"
                                    value={manualExchangeRate}
                                    onChange={(e) => handleManualExchangeRateChange(e.target.value)}
                                    placeholder="1.000000"
                                    disabled={isScanning}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('amount will be converted to')} {workspaceCurrency}
                                </p>
                            </div>
                        )}

                        {/* Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">
                                {t('amount')} {selectedCurrency !== workspaceCurrency && `(${selectedCurrency})`} *
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                {...register('amount', { valueAsNumber: true })}
                                placeholder="0.00"
                                className={errors.amount ? 'border-destructive' : ''}
                                disabled={isScanning}
                            />
                            {selectedCurrency !== workspaceCurrency && amountValue > 0 && exchangeRate > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {t('equals')} {formatCurrency(amountValue * exchangeRate)} ({workspaceCurrency})
                                </p>
                            )}
                            {errors.amount && (
                                <p className="text-sm text-destructive">{errors.amount.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">{t('description')}</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                rows={5}
                                disabled={isScanning}
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t px-6 py-4 flex justify-end gap-3 bg-white">
                <Button
                    type="button"
                    variant="default"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Call handleSubmit - it can be called without an event
                        handleSaveAndClose();
                    }}
                    disabled={isSubmitting || isScanning}
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('save and close')}
                </Button>
                {!expense && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleSaveAndNew}
                        disabled={isSubmitting || isScanning}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('save and new')}
                    </Button>
                )}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        if (hasFormChanges) {
                            setShowConfirmDialog(true);
                        } else {
                            onClose?.();
                        }
                    }}
                    disabled={isSubmitting || isScanning}
                >
                    {t('cancel')}
                </Button>
            </div>


            {/* Confirm Leave Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('discard changes')}</DialogTitle>
                        <DialogDescription>
                            {t('you have unsaved changes. if you leave, they will be lost.')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="default" onClick={() => setShowConfirmDialog(false)}>
                            {t('keep editing')}
                        </Button>
                        <Button variant="outline" onClick={() => {
                            setShowConfirmDialog(false);
                            onClose?.();
                        }}>
                            {t('discard and leave')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
