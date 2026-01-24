import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome</h1>
        <Link href="/apps/gen-qr">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Generate QR Code
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
