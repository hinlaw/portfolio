'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6">
        <Link href="/apps/ai-expense">
          <Button size="lg" variant="default" className="min-w-[200px]">
            AI 記帳展示
          </Button>
        </Link>
        <Link href="/website/wcg">
          <Button size="lg" variant="default" className="min-w-[200px]">
            Figma 設計網站展示
          </Button>
        </Link>
      </div>
    </div>
  );
}
