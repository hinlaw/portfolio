'use client';

import { FileText, Image as ImageIcon } from 'lucide-react';
import { isPdfUrl, isImageUrl, extractFilenameFromUrl } from './file-utils';
import { useState, useEffect } from 'react';
import React from 'react';
import ImageMagnifier from './image-magnifier';

interface FileThumbnailProps {
    url: string;
    size?: 'small' | 'medium' | 'large';
    onClick?: (e?: React.MouseEvent) => void;
    className?: string;
}

const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
};

const iconSizeMap = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
};

export default function FileThumbnail({ url, size = 'small', onClick, className = '' }: FileThumbnailProps) {
    const [imageError, setImageError] = useState(false);
    const isPDF = isPdfUrl(url);
    const filename = extractFilenameFromUrl(url);
    const sizeClass = sizeMap[size];
    const iconSizeClass = iconSizeMap[size];

    // Reset error state when URL changes
    useEffect(() => {
        setImageError(false);
    }, [url]);

    if (isPDF) {
        return (
            <div
                className={`${sizeClass} rounded border flex items-center justify-center bg-muted cursor-pointer hover:bg-muted/80 transition-colors ${className}`}
                onClick={(e) => {
                    e?.stopPropagation();
                    onClick?.(e);
                }}
                title={filename}
            >
                <FileText className={`${iconSizeClass} text-muted-foreground`} />
            </div>
        );
    }

    if (imageError) {
        return (
            <div
                className={`${sizeClass} rounded border flex items-center justify-center bg-muted cursor-pointer hover:bg-muted/80 transition-colors ${className}`}
                onClick={(e) => {
                    e?.stopPropagation();
                    onClick?.(e);
                }}
                title={filename}
            >
                <ImageIcon className={`${iconSizeClass} text-muted-foreground`} />
            </div>
        );
    }

    // Use ImageMagnifier for images, regular img for other file types
    if (isImageUrl(url) && !imageError) {
        return (
            <ImageMagnifier
                src={url}
                alt={filename}
                className={className}
                imageClassName={`${sizeClass} rounded border object-cover cursor-pointer ${className}`}
                zoomLevel={1.25}
                magnifierSize={450}
                onClick={(e) => {
                    e?.stopPropagation();
                    onClick?.(e);
                }}
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <img
            src={url}
            alt={filename}
            className={`${sizeClass} rounded border object-cover cursor-pointer hover:opacity-80 transition-opacity ${className}`}
            onClick={(e) => {
                e?.stopPropagation();
                onClick?.(e);
            }}
            onError={() => setImageError(true)}
            title={filename}
        />
    );
}
