'use client';

import { useRef } from 'react';
import { Plus, Loader2, MoveUp, Trash2, FileText, Star } from 'lucide-react';
import { useTranslation } from '@/components/contexts/translation.context';
import FileThumbnail from '@/components/ai-expense/file-thumbnail';
import { isPdfUrl } from '@/components/ai-expense/file-utils';

interface MediaGalleryProps {
    mediaUrls: string[];
    imageUrls: string[];
    selectedMediaIndex: number;
    onMediaSelect: (index: number) => void;
    uploadingMedia: boolean;
    onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMoveToFirst: () => void;
    onRemoveMedia: () => void;
    onImageClick: () => void;
}

export default function MediaGallery({
    mediaUrls,
    imageUrls,
    selectedMediaIndex,
    onMediaSelect,
    uploadingMedia,
    onFileInputChange,
    onMoveToFirst,
    onRemoveMedia,
    onImageClick,
}: MediaGalleryProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleAddMediaClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-white rounded-lg border flex-shrink-0 flex flex-col w-[300px]">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,video/*,audio/*"
                multiple
                onChange={onFileInputChange}
                className="hidden"
                disabled={uploadingMedia}
            />
            <div className="px-4 pb-2 space-y-6 flex-1 overflow-y-auto">
                {/* Media Preview Section (Images + PDFs) */}
                {mediaUrls.length > 0 ? (
                    <div className="space-y-4">
                        {/* Main Preview Area */}
                        <div className="flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden h-[280px] w-full">
                            {mediaUrls[selectedMediaIndex] ? (
                                isPdfUrl(mediaUrls[selectedMediaIndex]) ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="h-24 w-24 text-muted-foreground" />
                                    </div>
                                ) : (
                                    <div
                                        className="w-full h-full cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => {
                                            if (imageUrls.length > 0) {
                                                // Find the index in imageUrls array
                                                const imageIndex = imageUrls.indexOf(mediaUrls[selectedMediaIndex]);
                                                if (imageIndex !== -1) {
                                                    onImageClick();
                                                }
                                            }
                                        }}
                                    >
                                        <img
                                            src={mediaUrls[selectedMediaIndex]}
                                            alt={`Preview ${selectedMediaIndex + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center text-muted-foreground">
                                    {t('no image')}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Grid - 5 columns */}
                        {mediaUrls.length > 0 && (
                            <div className="flex items-start gap-2">
                                {/* Grid container for 10 preview images */}
                                <div className="grid grid-cols-5 gap-2 flex-1">
                                    {mediaUrls.slice(0, 10).map((url, idx) => {
                                        const isSelected = idx === selectedMediaIndex;
                                        const isPDF = isPdfUrl(url);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => onMediaSelect(idx)}
                                                className={`w-full h-[25px] rounded border-2 overflow-hidden transition-all ${isSelected
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-muted hover:border-primary/50'
                                                    }`}
                                            >
                                                {isPDF ? (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        <FileThumbnail
                                                            url={url}
                                                            size="small"
                                                            onClick={(e) => {
                                                                e?.stopPropagation();
                                                                onMediaSelect(idx);
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={url}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                    {/* Add button when less than 10 files */}
                                    {mediaUrls.length < 10 && (
                                        <button
                                            onClick={handleAddMediaClick}
                                            disabled={uploadingMedia}
                                            className="w-full h-[25px] rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploadingMedia ? (
                                                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                                            ) : (
                                                <Plus className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                {/* Separator and Action buttons */}
                                <div className="flex items-center gap-1 self-center">
                                    <span className="text-muted-foreground/50 px-1">|</span>
                                    <button
                                        onClick={onMoveToFirst}
                                        disabled={selectedMediaIndex === 0 || mediaUrls.length === 0}
                                        className="h-5 w-5 p-0.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        title={t('move to first')}
                                    >
                                        <Star className="h-3 w-3" />
                                    </button>
                                    <button
                                        onClick={onRemoveMedia}
                                        disabled={mediaUrls.length === 0}
                                        className="h-5 w-5 p-0.5 rounded hover:bg-gray-100 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        title={t('remove')}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Empty State - Main Preview Area */}
                        <div
                            className="flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden w-full cursor-pointer hover:bg-muted/50 transition-colors"
                            style={{ height: '200px' }}
                            onClick={handleAddMediaClick}
                        >
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Plus className="h-12 w-12 mb-2" />
                                <span className="text-sm">{t('no image available')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
