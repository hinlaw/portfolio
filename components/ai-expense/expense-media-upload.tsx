'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileWithPreview } from './file-upload';
import { isPdfUrl } from './file-utils';
import {
    Upload,
    FileText,
    RotateCw,
    Trash2,
    Plus,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Scan,
    Loader2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import InlinePdfViewer from './inline-pdf-viewer';

interface ExpenseMediaUploadProps {
    files: FileWithPreview[];
    onFilesChange: (files: FileWithPreview[]) => void;
    onFileSelect: (fileList: FileList) => Promise<void>;
    isScanning: boolean;
    onAiScan: (imageIndex: number) => void;
    useReceiptLanguage?: boolean;
    onUseReceiptLanguageChange?: (value: boolean) => void;
}

export default function ExpenseMediaUpload({
    files,
    onFilesChange,
    onFileSelect,
    isScanning,
    onAiScan,
    useReceiptLanguage = false,
    onUseReceiptLanguageChange,
}: ExpenseMediaUploadProps) {
    const t = useTranslations('aiExpense');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [imageScales, setImageScales] = useState<Record<number, number>>({});
    const [imageRotations, setImageRotations] = useState<number[]>([]);
    const [shouldAnimateTransform, setShouldAnimateTransform] = useState(false);
    const prevSelectedIndexRef = useRef<number>(0);

    // Update selected index when files change
    useEffect(() => {
        if (files.length > 0 && selectedImageIndex >= files.length) {
            setSelectedImageIndex(Math.max(0, files.length - 1));
        } else if (files.length === 0) {
            setSelectedImageIndex(0);
        }
    }, [files.length, selectedImageIndex]);

    // Auto-select newly added files
    const prevFilesLengthRef = useRef(files.length);
    useEffect(() => {
        if (files.length > prevFilesLengthRef.current) {
            setSelectedImageIndex(prevFilesLengthRef.current);
        }
        prevFilesLengthRef.current = files.length;
    }, [files.length]);

    // Disable animation when switching images
    useEffect(() => {
        if (prevSelectedIndexRef.current !== selectedImageIndex) {
            setShouldAnimateTransform(false);
            prevSelectedIndexRef.current = selectedImageIndex;
            requestAnimationFrame(() => {
                setShouldAnimateTransform(false);
            });
        }
    }, [selectedImageIndex]);

    // Initialize transform states
    useEffect(() => {
        if (files.length > 0 && selectedImageIndex < files.length) {
            setImageRotations((prev) => {
                if (prev.length <= selectedImageIndex) {
                    const newRotations = [...prev];
                    while (newRotations.length <= selectedImageIndex) {
                        newRotations.push(0);
                    }
                    return newRotations;
                }
                return prev;
            });
            setImageScales((prev) => {
                if (!prev[selectedImageIndex]) {
                    return {
                        ...prev,
                        [selectedImageIndex]: 1,
                    };
                }
                return prev;
            });
        }
    }, [selectedImageIndex, files.length]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                await onFileSelect(e.target.files);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [onFileSelect]
    );

    const removeFile = useCallback(
        (index: number) => {
            const newFiles = files.filter((_: FileWithPreview, i: number) => i !== index);
            onFilesChange(newFiles);

            setImageRotations((prev) => {
                const newRotations = [...prev];
                newRotations.splice(index, 1);
                return newRotations;
            });
            setImageScales((prev) => {
                const newScales: Record<number, number> = {};
                Object.keys(prev).forEach((key) => {
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
        [files, selectedImageIndex, onFilesChange]
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

    return (
        <div className="flex-[2] flex flex-col border-r bg-muted/30 relative min-w-0">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,video/*,audio/*"
                multiple
                onChange={handleFileInputChange}
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
                        {files[selectedImageIndex] &&
                            (() => {
                                const currentFile = files[selectedImageIndex];
                                const isPDF =
                                    currentFile.preview === 'pdf' ||
                                    currentFile.file.type === 'application/pdf' ||
                                    (typeof currentFile.base64 === 'string' &&
                                        isPdfUrl(currentFile.base64));

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
                                const currentRotation =
                                    imageRotations[selectedImageIndex] || 0;
                                const transformStyle = {
                                    transform: `scale(${currentScale}) rotate(${currentRotation}deg)`,
                                    transition: shouldAnimateTransform
                                        ? 'transform 0.2s ease-out'
                                        : 'none',
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

                    {/* Action Bar */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center min-w-0 pointer-events-none">
                        <div className="bg-white rounded-2xl border px-3 py-1.5 shadow-sm inline-flex min-w-0 pointer-events-auto">
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Thumbnails */}
                                <div className="flex items-center gap-2 min-w-0 overflow-x-auto">
                                    {files.map((fileWithPreview: FileWithPreview, index: number) => {
                                        const isPDF =
                                            fileWithPreview.preview === 'pdf' ||
                                            fileWithPreview.file.type ===
                                                'application/pdf' ||
                                            (typeof fileWithPreview.base64 === 'string' &&
                                                isPdfUrl(fileWithPreview.base64));
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
                                                    'flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all',
                                                    isSelected
                                                        ? 'border-primary ring-2 ring-primary/20'
                                                        : 'border-muted hover:border-primary/50',
                                                    isScanning && 'opacity-50 cursor-not-allowed'
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
                                                'flex-shrink-0 w-10 h-10 rounded-lg border-2 border-dashed border-muted hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-center',
                                                isScanning && 'opacity-50 cursor-not-allowed'
                                            )}
                                        >
                                            <Plus className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    )}
                                </div>

                                {/* AI Scan Button & Use Receipt Language */}
                                {files.length > 0 && (
                                    <div className="flex items-center gap-2 border-l pl-3">
                                        {onUseReceiptLanguageChange && (
                                            <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
                                                <input
                                                    type="checkbox"
                                                    checked={useReceiptLanguage}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        onUseReceiptLanguageChange(e.target.checked);
                                                    }}
                                                    disabled={isScanning}
                                                    className="h-3.5 w-3.5 rounded border-muted-foreground"
                                                />
                                                <span>{t('use receipt language')}</span>
                                            </label>
                                        )}
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAiScan(selectedImageIndex);
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

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 border-l pl-3">
                                    {(() => {
                                        const currentFile = files[selectedImageIndex];
                                        const isPDF =
                                            currentFile &&
                                            (currentFile.preview === 'pdf' ||
                                                currentFile.file.type === 'application/pdf' ||
                                                (typeof currentFile.base64 === 'string' &&
                                                    isPdfUrl(currentFile.base64)));
                                        const isTransformDisabled =
                                            files.length === 0 || isPDF || isScanning;

                                        return (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShouldAnimateTransform(true);
                                                        const currentScale =
                                                            imageScales[selectedImageIndex] || 1;
                                                        setImageScales({
                                                            ...imageScales,
                                                            [selectedImageIndex]: Math.min(
                                                                currentScale + 0.25,
                                                                3
                                                            ),
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
                                                        const currentScale =
                                                            imageScales[selectedImageIndex] || 1;
                                                        setImageScales({
                                                            ...imageScales,
                                                            [selectedImageIndex]: Math.max(
                                                                currentScale - 0.25,
                                                                0.25
                                                            ),
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
                                                        setImageRotations((prev) => {
                                                            const newRotations = [...prev];
                                                            const currentRotation =
                                                                newRotations[selectedImageIndex] ||
                                                                0;
                                                            newRotations[selectedImageIndex] =
                                                                currentRotation - 90;
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
                                                        setImageRotations((prev) => {
                                                            const newRotations = [...prev];
                                                            const currentRotation =
                                                                newRotations[selectedImageIndex] ||
                                                                0;
                                                            newRotations[selectedImageIndex] =
                                                                currentRotation + 90;
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
    );
}
