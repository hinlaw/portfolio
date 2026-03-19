'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <Link href="/apps/figma-showcase">
          <Button size="lg" variant="default" className="min-w-[200px]">
            Figma Design Website Showcase
          </Button>
        </Link>
        <Link href="/apps/ai-expense">
          <Button size="lg" variant="default" className="min-w-[200px]">
            AI Expense Showcase
          </Button>
        </Link>
      </div>
    </div>
  );
}
