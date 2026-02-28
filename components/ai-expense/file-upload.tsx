'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { isPdfUrl, extractFilenameFromUrl } from './file-utils';
import PdfPreview from './pdf-preview';

export interface FileWithPreview {
    file: File;
    preview: string;
    base64: string;
}

interface FileUploadProps {
    files: FileWithPreview[];
    onFilesChange: (files: FileWithPreview[]) => void;
    maxFiles?: number;
    maxSizePerFile?: number; // in bytes
    accept?: string;
    className?: string;
}

export default function FileUpload({
    files,
    onFilesChange,
    maxFiles = 10,
    maxSizePerFile = 5 * 1024 * 1024, // 5MB default
    accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt',
    className,
}: FileUploadProps) {
    const t = useTranslations('aiExpense');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
    const [previewPdfFilename, setPreviewPdfFilename] = useState<string>('');

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
            // Validate file type (images or documents)
            const isImage = file.type.startsWith('image/');
            const isPDF = file.type === 'application/pdf';
            const isDOC = file.type === 'application/msword';
            const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            const isXLS = file.type === 'application/vnd.ms-excel';
            const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const isCSV = file.type === 'text/csv' || file.type === 'application/csv';
            const isTXT = file.type === 'text/plain';
            
            if (!isImage && !isPDF && !isDOC && !isDOCX && !isXLS && !isXLSX && !isCSV && !isTXT) {
                alert(`${file.name} ${t('toast.file type not supported. supported types: images, pdf, doc, docx, xls, xlsx, csv, txt')}`);
                continue;
            }

            // Validate file size
            if (file.size > maxSizePerFile) {
                alert(`${file.name} ${t('toast.file exceeds maximum size')} ${maxSizePerFile / 1024 / 1024}MB`);
                continue;
            }

            // Check max files limit
            if (files.length + newFiles.length >= maxFiles) {
                alert(t('toast.maximum {count} files allowed', { count: maxFiles }));
                break;
            }

            try {
                const base64 = await convertFileToBase64(file);
                // For documents, we still convert to base64 but use a document marker for preview
                const fileIsDocument = isPDF || isDOC || isDOCX || isXLS || isXLSX || isCSV || isTXT;
                newFiles.push({
                    file,
                    preview: fileIsDocument ? 'document' : base64, // Use 'document' as marker for document files
                    base64,
                });
            } catch (error) {
                console.error(`Failed to process ${file.name}:`, error);
                alert(`${t('toast.failed to process file')} ${file.name}`);
            }
        }

        if (newFiles.length > 0) {
            onFilesChange([...files, ...newFiles]);
        }
    }, [files, maxFiles, maxSizePerFile, onFilesChange, t]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                await processFiles(e.dataTransfer.files);
            }
        },
        [processFiles]
    );

    const handleFileInputChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                await processFiles(e.target.files);
            }
            // Reset input so same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [processFiles]
    );

    const removeFile = useCallback(
        (index: number) => {
            const newFiles = files.filter((_, i) => i !== index);
            onFilesChange(newFiles);
        },
        [files, onFilesChange]
    );

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn('w-full', className)}>
            {/* Combined Drop Zone with Preview Grid */}
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'border-2 border-dashed rounded-lg p-4 transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                />
                
                {/* File Preview Grid */}
                {files.length > 0 ? (
                    <div className="relative w-full h-full">
                        <div 
                            onClick={handleClick}
                            className="absolute inset-0 cursor-pointer z-0"
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative z-10">
                            {files.map((fileWithPreview, index) => {
                                // Check if it's a document: by preview marker, file type, or URL
                                const isPDF = fileWithPreview.file.type === 'application/pdf' ||
                                    (typeof fileWithPreview.base64 === 'string' && isPdfUrl(fileWithPreview.base64));
                                const isDOC = fileWithPreview.file.type === 'application/msword';
                                const isDOCX = fileWithPreview.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                                const isXLS = fileWithPreview.file.type === 'application/vnd.ms-excel';
                                const isXLSX = fileWithPreview.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                                const isCSV = fileWithPreview.file.type === 'text/csv' || fileWithPreview.file.type === 'application/csv';
                                const isTXT = fileWithPreview.file.type === 'text/plain';
                                const isDocument = fileWithPreview.preview === 'document' || fileWithPreview.preview === 'pdf' || 
                                    isPDF || isDOC || isDOCX || isXLS || isXLSX || isCSV || isTXT;
                                
                                // Get document type label
                                const getDocumentLabel = () => {
                                    if (isPDF) return 'PDF';
                                    if (isDOC || isDOCX) return 'DOC';
                                    if (isXLS || isXLSX) return 'XLS';
                                    if (isCSV) return 'CSV';
                                    if (isTXT) return 'TXT';
                                    return 'DOC';
                                };
                                
                                const handlePreviewClick = (e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    if (isPDF) {
                                        // Get URL from base64 or use the base64 data URI directly
                                        const pdfUrl = fileWithPreview.base64.startsWith('data:') 
                                            ? fileWithPreview.base64 
                                            : fileWithPreview.base64;
                                        setPreviewPdfUrl(pdfUrl);
                                        setPreviewPdfFilename(fileWithPreview.file.name || extractFilenameFromUrl(fileWithPreview.base64));
                                    }
                                };

                                return (
                                    <div
                                        key={index}
                                        className="relative group aspect-square rounded-lg overflow-hidden border border-muted bg-muted/50"
                                        onClick={handlePreviewClick}
                                    >
                                        {isDocument ? (
                                            <div 
                                                className="w-full h-full flex flex-col items-center justify-center bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                                            >
                                                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                                                <span className="text-xs text-muted-foreground px-2 text-center truncate w-full">
                                                    {getDocumentLabel()}
                                                </span>
                                            </div>
                                        ) : (
                                            <img
                                                src={fileWithPreview.preview}
                                                alt=""
                                                className="w-full h-full object-cover cursor-pointer"
                                            />
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                            className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                            
                            {/* Add More Button */}
                            {files.length < maxFiles && (
                                <div
                                    className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 flex flex-col items-center justify-center transition-colors pointer-events-none"
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground text-center px-2">
                                        {t('add more')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Empty State - Drop Zone */
                    <div
                        onClick={handleClick}
                        className="p-8 text-center cursor-pointer"
                    >
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-sm font-medium mb-2">
                            {t('drag and drop files here, or click to select')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {t('images and documents • max {size}mb per file • up to {count} files', { size: maxSizePerFile / 1024 / 1024, count: maxFiles })}
                        </p>
                    </div>
                )}
            </div>

            {/* PDF Preview Dialog */}
            {previewPdfUrl && (
                <PdfPreview
                    url={previewPdfUrl}
                    filename={previewPdfFilename}
                    open={!!previewPdfUrl}
                    onOpenChange={(open) => {
                        if (!open) {
                            setPreviewPdfUrl(null);
                            setPreviewPdfFilename('');
                        }
                    }}
                />
            )}
        </div>
    );
}
