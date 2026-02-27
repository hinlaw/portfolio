'use client';

import { useState, useEffect, useRef } from 'react';

interface InlinePdfViewerProps {
    url: string;
    filename?: string;
}

export default function InlinePdfViewer({ url, filename }: InlinePdfViewerProps) {
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const blobUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if (!url) {
            setPreviewUrl('');
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
            return;
        }

        // Check if URL is a base64 data URI
        if (url.startsWith('data:')) {
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
            // Use direct URL - PDFs now have Content-Disposition: inline set
            // so they will display inline in browsers without forcing downloads
            setPreviewUrl(url);
        }

        return () => {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
        };
    }, [url]);

    if (!previewUrl) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Loading PDF...</p>
            </div>
        );
    }

    // Use object tag for better PDF handling, especially for external URLs
    // Object tag can sometimes bypass Content-Disposition headers
    const isBlobUrl = previewUrl.startsWith('blob:');
    const displayUrl = isBlobUrl ? previewUrl : `${previewUrl}#toolbar=1&navpanes=1&scrollbar=1`;

    return (
        <object
            data={displayUrl}
            type="application/pdf"
            className="w-full h-full"
            title={filename || 'PDF Preview'}
        >
            <iframe
                src={displayUrl}
                className="w-full h-full border-0"
                title={filename || 'PDF Preview'}
            />
            <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">
                    Your browser does not support PDF preview. 
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary underline">
                        Open PDF
                    </a>
                </p>
            </div>
        </object>
    );
}
