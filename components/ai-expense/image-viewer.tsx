import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useCurrencyFormatter } from '@/lib/currency';
import { ExpenseDTO } from '@/types/expense';
import { formatDateCompact } from '@/lib/date';

interface ImageViewerProps {
    images: string[];
    initialIndex?: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expense?: ExpenseDTO | null;
}

export default function ImageViewer({ images, initialIndex = 0, open, onOpenChange, expense }: ImageViewerProps) {
    const formatCurrency = useCurrencyFormatter();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    // Image transformation state - separate states for scale and rotation
    const [imageScales, setImageScales] = useState<Record<number, number>>({});
    const [imageRotations, setImageRotations] = useState<number[]>([]);
    const [shouldAnimateTransform, setShouldAnimateTransform] = useState(false);
    const prevSelectedIndexRef = useRef<number>(initialIndex);
    const [mounted, setMounted] = useState(false);

    // Reset to initial index when modal opens or initialIndex changes
    useEffect(() => {
        if (open) {
            setCurrentIndex(initialIndex);
            // Reset transforms when opening
            setImageScales({});
            setImageRotations([]);
            setShouldAnimateTransform(false);
            prevSelectedIndexRef.current = initialIndex;
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll when modal is closed
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open, initialIndex]);

    // Disable animation when switching images
    useEffect(() => {
        if (prevSelectedIndexRef.current !== currentIndex) {
            // Immediately disable animation when switching images
            setShouldAnimateTransform(false);
            prevSelectedIndexRef.current = currentIndex;
            // Use requestAnimationFrame to ensure the state update is applied before next render
            requestAnimationFrame(() => {
                // Keep animation disabled after switching
                setShouldAnimateTransform(false);
            });
        }
    }, [currentIndex]);

    // Initialize transform states when switching images
    useEffect(() => {
        if (images.length > 0 && currentIndex < images.length) {
            // Ensure rotation array has entry for current image
            setImageRotations(prev => {
                if (prev.length <= currentIndex) {
                    const newRotations = [...prev];
                    while (newRotations.length <= currentIndex) {
                        newRotations.push(0);
                    }
                    return newRotations;
                }
                return prev;
            });
            // Ensure scale has entry for current image
            setImageScales(prev => {
                if (!prev[currentIndex]) {
                    return {
                        ...prev,
                        [currentIndex]: 1
                    };
                }
                return prev;
            });
        }
    }, [currentIndex, images.length]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!images || images.length === 0) {
        return null;
    }

    if (!open || !mounted) {
        return null;
    }

    const currentImage = images[currentIndex];
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < images.length - 1;
    const currentScale = imageScales[currentIndex] || 1;
    const currentRotation = imageRotations[currentIndex] || 0;
    const transformStyle = {
        transform: `scale(${currentScale}) rotate(${currentRotation}deg)`,
        transition: shouldAnimateTransform ? 'transform 0.2s ease-out' : 'none',
    };

    const handlePrevious = () => {
        if (hasPrevious) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft' && hasPrevious) {
            handlePrevious();
        } else if (e.key === 'ArrowRight' && hasNext) {
            handleNext();
        } else if (e.key === 'Escape') {
            onOpenChange(false);
        }
    };

    const handleZoomIn = () => {
        setShouldAnimateTransform(true);
        const currentScale = imageScales[currentIndex] || 1;
        setImageScales({
            ...imageScales,
            [currentIndex]: Math.min(currentScale + 0.25, 3), // Max zoom 3x
        });
    };

    const handleZoomOut = () => {
        setShouldAnimateTransform(true);
        const currentScale = imageScales[currentIndex] || 1;
        setImageScales({
            ...imageScales,
            [currentIndex]: Math.max(currentScale - 0.25, 0.25), // Min zoom 0.25x
        });
    };

    const handleRotateLeft = () => {
        setShouldAnimateTransform(true);
        setImageRotations(prev => {
            const newRotations = [...prev];
            const currentRotation = newRotations[currentIndex] || 0;
            newRotations[currentIndex] = currentRotation - 90;
            return newRotations;
        });
    };

    const handleRotateRight = () => {
        setShouldAnimateTransform(true);
        setImageRotations(prev => {
            const newRotations = [...prev];
            const currentRotation = newRotations[currentIndex] || 0;
            newRotations[currentIndex] = currentRotation + 90;
            return newRotations;
        });
    };

    const formatDate = (timestamp: number) => formatDateCompact(timestamp);

    const content = (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            {/* Overlay - 50% opacity */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => onOpenChange(false)}
            />

            {/* Content */}
            <div className="relative w-full h-full flex flex-col">
                {/* Top Bar - Expense Info Header */}
                {expense && (
                    <div className="absolute top-0 left-0 right-0 z-[101] bg-black/80 backdrop-blur-sm">
                        <div className="flex items-center justify-between px-6 py-3">
                            <div className="flex items-center gap-3 text-white text-base">
                                <div className="font-medium">
                                    {formatDate(expense.date)}
                                </div>
                                <span className="text-white/50">|</span>
                                <div className="font-semibold">
                                    {formatCurrency(expense.amount)}
                                </div>
                                <span className="text-white/50">|</span>
                                <div className="text-white/90">
                                    {expense.merchant}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenChange(false)}
                                className="h-8 w-8 p-0 text-white hover:bg-white/20 border-none"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Close Button (fallback if no expense) */}
                {!expense && (
                    <div className="absolute top-0 left-0 right-0 z-[101] flex justify-end p-4 pointer-events-none">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white border-none pointer-events-auto"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                {/* Main Image Display Area */}
                <div className={`flex-1 overflow-y-auto overflow-x-hidden flex items-center justify-center p-6 relative ${expense ? 'pt-16' : ''}`}>
                    <div className="w-full max-w-4xl overflow-hidden">
                        <div className="flex items-center justify-center">
                            <img
                                key={`image-${currentIndex}`}
                                src={currentImage}
                                alt={`Image ${currentIndex + 1} of ${images.length}`}
                                className="w-full h-auto object-contain rounded-lg shadow-lg"
                                style={transformStyle}
                            />
                        </div>
                    </div>

                    {/* Previous Button */}
                    {hasPrevious && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrevious}
                            className="absolute left-4 z-[101] h-12 w-12 p-0 bg-black/50 hover:bg-black/70 text-white border-none rounded-full"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    )}

                    {/* Next Button */}
                    {hasNext && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNext}
                            className="absolute right-4 z-[101] h-12 w-12 p-0 bg-black/50 hover:bg-black/70 text-white border-none rounded-full"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    )}
                </div>

                {/* Action Bar - Absolute positioned at bottom */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center min-w-0 pointer-events-none">
                    <div className="bg-white rounded-2xl border px-3 py-1.5 shadow-sm inline-flex min-w-0 pointer-events-auto">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Thumbnails */}
                            <div className="flex items-center gap-2 min-w-0 overflow-x-auto">
                                {images.map((image, index) => {
                                    const isSelected = index === currentIndex;
                                    return (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentIndex(index);
                                            }}
                                            className={cn(
                                                "flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all",
                                                isSelected
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "border-muted hover:border-primary/50"
                                            )}
                                        >
                                            <img
                                                src={image}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 border-l pl-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleZoomIn();
                                    }}
                                    className="h-8 w-8"
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleZoomOut();
                                    }}
                                    className="h-8 w-8"
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRotateLeft();
                                    }}
                                    className="h-8 w-8"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRotateRight();
                                    }}
                                    className="h-8 w-8"
                                >
                                    <RotateCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
