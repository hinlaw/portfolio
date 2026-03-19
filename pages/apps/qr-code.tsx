'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function QRCodePage() {
  const [inputUrl, setInputUrl] = useState('');
  const [url, setUrl] = useState<string | null>(null);

  const handleGenerate = () => {
    const trimmed = inputUrl.trim();
    if (trimmed) {
      setUrl(trimmed);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex w-full gap-2">
          <Input
            type="url"
            placeholder="https://example.com"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="flex-1"
          />
          <Button onClick={handleGenerate}>Generate</Button>
        </div>
        {url ? (
          <div className="flex flex-col items-center gap-3">
            <QRCodeSVG
              value={url}
              size={256}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
              className="rounded-lg border"
            />
            <p className="break-all text-center text-sm text-muted-foreground">{url}</p>
          </div>
        ) : (
          <div className="flex h-64 w-64 items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30">
            <p className="text-sm text-muted-foreground">輸入網址後點擊 Generate</p>
          </div>
        )}
      </div>
    </div>
  );
}
