/**
 * Extract filename from a URL
 * @param url - The URL to extract filename from
 * @returns The filename or a default name if extraction fails
 */
export function extractFilenameFromUrl(url: string): string {
    if (!url) return 'file';
    
    try {
        // Remove query parameters and hash
        const urlWithoutParams = url.split('?')[0].split('#')[0];
        
        // Get the last segment of the path
        const segments = urlWithoutParams.split('/');
        const filename = segments[segments.length - 1];
        
        // If filename is empty or doesn't look like a filename, return default
        if (!filename || filename === '' || !filename.includes('.')) {
            return 'file';
        }
        
        return decodeURIComponent(filename);
    } catch (error) {
        console.error('Failed to extract filename from URL:', error);
        return 'file';
    }
}

/**
 * Detect if a URL points to a PDF file
 * @param url - The URL to check
 * @returns true if the URL points to a PDF
 */
export function isPdfUrl(url: string): boolean {
    if (!url) return false;
    
    const filename = extractFilenameFromUrl(url);
    return filename.toLowerCase().endsWith('.pdf');
}

/**
 * Detect if a URL points to an image file
 * @param url - The URL to check
 * @returns true if the URL points to an image
 */
export function isImageUrl(url: string): boolean {
    if (!url) return false;
    
    const filename = extractFilenameFromUrl(url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(ext);
}

/**
 * Count files by type from an array of URLs
 * @param urls - Array of file URLs
 * @returns Object with pdfCount and imageCount
 */
export function countFilesByType(urls: string[]): { pdfCount: number; imageCount: number } {
    if (!urls || urls.length === 0) {
        return { pdfCount: 0, imageCount: 0 };
    }
    
    let pdfCount = 0;
    let imageCount = 0;
    
    urls.forEach(url => {
        if (isPdfUrl(url)) {
            pdfCount++;
        } else if (isImageUrl(url)) {
            imageCount++;
        }
    });
    
    return { pdfCount, imageCount };
}
