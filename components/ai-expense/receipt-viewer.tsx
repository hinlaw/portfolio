'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileWithPreview } from './file-upload';
import { isPdfUrl } from './file-utils';
import { X, Plus, ZoomIn, ZoomOut, RotateCcw, RotateCw, Trash2, FileText, Scan, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ReceiptViewerProps {
    files: FileWithPreview[];
    onFilesChange: (files: FileWithPreview[]) => void;
    onClose: () => void;
    onDone?: () => void;
    onAiScan?: (imageIndex?: number) => void;
    isScanning?: boolean;
}

export default function ReceiptViewer({
    files,
    onFilesChange,
    onClose,
    onDone,
    onAiScan,
    isScanning = false,
}: ReceiptViewerProps) {
    const t = useTranslations('aiExpense');
    const [isVisible, setIsVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [imageScales, setImageScales] = useState<Record<number, number>>({});
    const [imageRotations, setImageRotations] = useState<number[]>([]);
    const [shouldAnimateTransform, setShouldAnimateTransform] = useState(false);
    const prevSelectedIndexRef = useRef<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryScrollRef = useRef<HTMLDivElement>(null);
    const prevFilesLengthRef = useRef<number>(files.length);

    // Trigger slide-in animation
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Update selected index when files change
    useEffect(() => {
        if (files.length > 0 && selectedImageIndex >= files.length) {
            setSelectedImageIndex(Math.max(0, files.length - 1));
        } else if (files.length === 0) {
            setSelectedImageIndex(0);
        }
    }, [files.length, selectedImageIndex]);

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

    // Initialize transform states when switching images or files change
    useEffect(() => {
        if (files.length > 0 && selectedImageIndex < files.length) {
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
    }, [selectedImageIndex, files.length]);

    // Scroll gallery to the right when new files are added
    useEffect(() => {
        if (files.length > prevFilesLengthRef.current && galleryScrollRef.current) {
            // Wait for DOM to update, then scroll to the right
            setTimeout(() => {
                if (galleryScrollRef.current) {
                    galleryScrollRef.current.scrollTo({
                        left: galleryScrollRef.current.scrollWidth,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
        prevFilesLengthRef.current = files.length;
    }, [files.length]);

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

    const handleFileInputChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                const fileList = e.target.files;
                const newFiles: FileWithPreview[] = [];
                const fileArray = Array.from(fileList);

                for (const file of fileArray) {
                    if (files.length + newFiles.length >= 10) {
                        break;
                    }

                    try {
                        const base64 = await convertFileToBase64(file);
                        const fileIsPDF = file.type === 'application/pdf';
                        newFiles.push({
                            file,
                            preview: fileIsPDF ? 'pdf' : base64,
                            base64,
                        });
                    } catch (error) {
                        console.error(`Failed to process ${file.name}:`, error);
                    }
                }

                if (newFiles.length > 0) {
                    const updatedFiles = [...files, ...newFiles];
                    onFilesChange(updatedFiles);
                    setSelectedImageIndex(files.length);
                }
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [files, onFilesChange]
    );

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = useCallback(
        (index: number) => {
            const newFiles = files.filter((_, i) => i !== index);
            onFilesChange(newFiles);
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
        [files, selectedImageIndex, onFilesChange]
    );

    const handleDone = () => {
        if (onDone) {
            onDone();
        } else {
            onClose();
        }
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-[60] bg-black flex flex-col transition-transform duration-300 ease-out",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-black">
                <button
                    onClick={onClose}
                    className="text-white text-base font-medium"
                >
                    {t('cancel')}
                </button>
                <div className="flex items-center gap-6">
                    {/* AI Scan button */}
                    {files.length > 0 && onAiScan && (
                        <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAiScan(selectedImageIndex);
                                    // Close dialog after starting scan
                                    onClose();
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                                    isScanning
                                        ? "bg-blue-600/80 text-white"
                                        : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                                )}
                                disabled={isScanning || files.length === 0}
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>{t('scanning')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Scan className="h-4 w-4" />
                                        <span>{t('ai scan')}</span>
                                </>
                            )}
                        </button>
                    )}
                    {/* Delete button */}
                    {files.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile(selectedImageIndex);
                            }}
                            className="text-white"
                            disabled={files.length === 0 || isScanning}
                        >
                            <Trash2 className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                    )}
                    {/* Rotate/Crop button */}
                    {files.length > 0 && (() => {
                        const currentFile = files[selectedImageIndex];
                        const isPDF = currentFile && (
                            currentFile.preview === 'pdf' ||
                            currentFile.file.type === 'application/pdf' ||
                            (typeof currentFile.base64 === 'string' && isPdfUrl(currentFile.base64))
                        );
                        if (isPDF) return null;
                        return (
                            <button
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
                                className="text-white"
                                disabled={isScanning}
                            >
                                <RotateCw className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                        );
                    })()}
                </div>
                <button
                    onClick={handleDone}
                    className="text-white bg-blue-600 px-5 py-2 rounded-full text-base font-medium"
                >
                    {t('done')}
                </button>
            </div>

            {/* Main Image Display Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center relative bg-black">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf,video/*,audio/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                />

                {files.length === 0 ? (
                    <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={handleClick}
                    >
                        <div className="text-center space-y-4">
                            <Plus className="mx-auto h-16 w-16 text-white/50" />
                            <p className="text-sm font-medium text-white/70">
                                {t('attach receipts from computer or phone')}
                            </p>
                        </div>
                    </div>
                ) : (
                    files[selectedImageIndex] && (() => {
                        const currentFile = files[selectedImageIndex];
                        const isPDF =
                            currentFile.preview === 'pdf' ||
                            currentFile.file.type === 'application/pdf' ||
                            (typeof currentFile.base64 === 'string' && isPdfUrl(currentFile.base64));

                        if (isPDF) {
                            return (
                                <div className="w-full max-w-4xl flex flex-col items-center justify-center bg-white rounded-lg p-8">
                                    <FileText className="h-24 w-24 text-muted-foreground mb-4" />
                                    <p className="text-lg font-medium text-muted-foreground mb-2">
                                        {currentFile.file.name || 'PDF Document'}
                                    </p>
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
                            <div className="w-full min-h-full flex items-start justify-center p-4">
                                <img
                                    key={`image-${selectedImageIndex}`}
                                    src={currentFile.preview}
                                    alt=""
                                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                                    style={transformStyle}
                                />
                            </div>
                        );
                    })()
                )}
            </div>

            {/* Bottom Gallery */}
            {files.length > 0 && (
                <div className="px-4 py-4 bg-black">
                    <div
                        ref={galleryScrollRef}
                        className="flex items-center gap-2 overflow-x-auto"
                    >
                        {files.map((fileWithPreview, index) => {
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
                                        setSelectedImageIndex(index);
                                    }}
                                    className={cn(
                                        "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                                        isSelected
                                            ? "border-blue-500"
                                            : "border-white/20"
                                    )}
                                >
                                    {isPDF ? (
                                        <div className="w-full h-full flex items-center justify-center bg-white/10">
                                            <FileText className="h-6 w-6 text-white/70" />
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
                                    handleClick();
                                }}
                                className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 transition-all flex items-center justify-center bg-white/5"
                            >
                                <Plus className="h-5 w-5 text-white/50" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
