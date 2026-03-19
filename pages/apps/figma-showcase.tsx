'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FigmaShowcasePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-semibold">Figma Design Website Showcase</h1>
        <p className="text-muted-foreground">
          This page will showcase your Figma design websites. Add your projects here.
        </p>
      </div>
    </div>
  );
}
