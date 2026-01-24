'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QRGenerator() {
    const [url, setUrl] = useState('');
    const [qrValue, setQrValue] = useState('');
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Set default URL to current page if in browser
        if (typeof window !== 'undefined') {
            setUrl(window.location.origin);
            setQrValue(window.location.origin);
        }
    }, []);

    const handleGenerate = () => {
        if (url.trim()) {
            setQrValue(url.trim());
        }
    };

    const handleDownload = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'qrcode.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    const handleCopy = async () => {
        if (qrValue) {
            try {
                await navigator.clipboard.writeText(qrValue);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                <div
                    className={`transform transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 mb-8 backdrop-blur-md rounded-full border border-white/20 colorful-shadow`}>
                            <span className="text-sm font-medium text-foreground/80">
                                QR Code Generator
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
                            <span className={`block bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent animate-gradient`}>
                                Generate QR Code
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto">
                            Convert any URL or text into a QR code instantly
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className={`glass-card colorful-shadow p-8 rounded-2xl mb-8`}>
                        <div className="space-y-4">
                            <label htmlFor="url-input" className="block text-sm font-semibold text-foreground/90 mb-2">
                                Enter URL or Text
                            </label>
                            <div className="flex gap-4">
                                <input
                                    id="url-input"
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                                    placeholder="https://example.com or any text"
                                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                />
                                <Button
                                    onClick={handleGenerate}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    Generate
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Display */}
                    {qrValue && (
                        <div className={`glass-card colorful-shadow p-8 rounded-2xl mb-8`}>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center p-6 bg-white rounded-xl mb-6 shadow-xl">
                                    <QRCodeSVG
                                        id="qr-code-svg"
                                        value={qrValue}
                                        size={256}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>

                                {/* QR Value Display */}
                                <div className="w-full mb-6">
                                    <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 break-all">
                                        <p className="text-sm text-foreground/80 font-mono">{qrValue}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 w-full">
                                    <Button
                                        onClick={handleDownload}
                                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download PNG
                                    </Button>
                                    <Button
                                        onClick={handleCopy}
                                        className={`flex-1 px-6 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                                            copied
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-foreground'
                                        }`}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-5 h-5 mr-2" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5 mr-2" />
                                                Copy URL
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
