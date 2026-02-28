'use client';

import { useState, useRef, MouseEvent, CSSProperties } from 'react';

interface ImageMagnifierProps {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    zoomLevel?: number;
    magnifierSize?: number;
    className?: string;
    imageClassName?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: (e?: React.MouseEvent) => void;
    onError?: () => void;
}

export default function ImageMagnifier({
    src,
    alt = '',
    width,
    height,
    zoomLevel = 2,
    magnifierSize = 200,
    className = '',
    imageClassName = '',
    onMouseEnter,
    onMouseLeave,
    onClick,
    onError,
}: ImageMagnifierProps) {
    const MAGNIFIER_PADDING = 60;
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [magnifierStyle, setMagnifierStyle] = useState<CSSProperties>({});
    const [backgroundPosition, setBackgroundPosition] = useState('50% 50%');
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;

        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentage position within the image
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        // Update background position for the magnified image
        setBackgroundPosition(`${percentX}% ${percentY}%`);

        // Calculate magnifier position (to the right of cursor, or left if near right edge)
        const offset = 20;
        let magnifierX = e.clientX + offset;
        let magnifierY = e.clientY + offset;

        // Boundary detection - adjust position if magnifier would go off screen
        if (magnifierX + magnifierSize > window.innerWidth) {
            magnifierX = e.clientX - magnifierSize - offset;
        }
        if (magnifierY + magnifierSize > window.innerHeight) {
            magnifierY = e.clientY - magnifierSize - offset;
        }
        if (magnifierX < 0) {
            magnifierX = offset;
        }
        if (magnifierY < 0) {
            magnifierY = offset;
        }

        setMagnifierStyle({
            display: 'block',
            left: `${magnifierX}px`,
            top: `${magnifierY}px`,
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
        });
    };

    const handleMouseEnter = () => {
        setShowMagnifier(true);
        onMouseEnter?.();
    };

    const handleMouseLeave = () => {
        setShowMagnifier(false);
        onMouseLeave?.();
    };

    return (
        <div
            ref={containerRef}
            className={`relative inline-block ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={imageClassName}
                onClick={(e) => {
                    e?.stopPropagation();
                    onClick?.(e);
                }}
                onError={() => {
                    setShowMagnifier(false);
                    onError?.();
                }}
            />
            {showMagnifier && (
                <div
                    className="fixed pointer-events-none border-2 border-white shadow-2xl rounded-lg z-[9999] bg-white"
                    style={{
                        ...magnifierStyle,
                        transition: 'opacity 0.1s ease-in-out',
                    }}
                >
                    <div
                        className="w-full h-full rounded"
                        style={{
                            backgroundImage: `url(${src})`,
                            backgroundPosition: backgroundPosition,
                            backgroundSize: `${zoomLevel * 100}%`,
                            backgroundRepeat: 'no-repeat',
                            padding: `${MAGNIFIER_PADDING}px`,
                            boxSizing: 'border-box',
                            backgroundOrigin: 'padding-box',
                        }}
                    />
                </div>
            )}
        </div>
    );
}
