'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PdfPreviewProps {
    url: string;
    filename?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PdfPreview({ url, filename, open, onOpenChange }: PdfPreviewProps) {
    const t = useTranslations('aiExpense');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const blobUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if (!open || !url) {
            setPreviewUrl('');
            // Cleanup previous blob URL if exists
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
            return;
        }

        // Check if URL is a base64 data URI
        if (url.startsWith('data:')) {
            // Convert base64 to blob URL for preview
            try {
                const base64Data = url.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const newBlobUrl = URL.createObjectURL(blob);
                
                // Cleanup previous blob URL if exists
                if (blobUrlRef.current) {
                    URL.revokeObjectURL(blobUrlRef.current);
                }
                
                blobUrlRef.current = newBlobUrl;
                setPreviewUrl(newBlobUrl);
            } catch (error) {
                console.error('Failed to convert base64 to blob:', error);
                setPreviewUrl(url);
            }
        } else {
            // Regular URL
            setPreviewUrl(url);
        }

        // Cleanup blob URL on unmount or when URL changes
        return () => {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
        };
    }, [open, url]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = url.startsWith('data:') ? previewUrl : url;
        link.download = filename || 'document.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenInNewTab = () => {
        const urlToOpen = url.startsWith('data:') ? previewUrl : url;
        window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="truncate pr-4">
                            {filename || t('pdf preview')}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                {t('download')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleOpenInNewTab}
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                {t('open in new tab')}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenChange(false)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    {previewUrl && (
                        <iframe
                            src={`${previewUrl}#toolbar=1`}
                            className="w-full h-full border-0"
                            title={filename || t('pdf preview')}
                            style={{ minHeight: '600px' }}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
