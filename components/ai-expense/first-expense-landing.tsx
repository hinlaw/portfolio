'use client';

import { Button } from '@/components/ui/button';
import { Plus, Scan, Upload } from 'lucide-react';

type FirstExpenseLandingProps = {
    onManualCreate: () => void;
    onAiCreate: () => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
};

export default function FirstExpenseLanding({
    onManualCreate,
    onAiCreate,
    onDrop,
    onDragOver,
}: FirstExpenseLandingProps) {
    return (
        <div className="px-4 py-10 md:py-16">
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                    <div>
                        <div className="inline-flex items-center gap-3 rounded-2xl bg-muted px-4 py-2">

                            <div className="text-sm font-semibold text-slate-900">
                                AI Expense
                            </div>
                        </div>

                        <h1 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                            Create your first expense
                        </h1>
                        <p className="mt-3 text-slate-600">
                            Start by adding one manually, or scan a receipt with AI to auto-fill the form.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Button
                                type="button"
                                onClick={onAiCreate}
                                className="h-12 rounded-xl gap-2"
                            >
                                <Scan className="h-5 w-5" />
                                AI Create
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onManualCreate}
                                className="h-12 rounded-xl gap-2"
                            >
                                <Plus className="h-5 w-5" />
                                Manual Create
                            </Button>
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <div
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onClick={onAiCreate}
                            className="cursor-pointer rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-white p-8 hover:border-primary/50 hover:bg-muted/30 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-muted p-3 flex-shrink-0">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-base font-medium text-slate-900">
                                        Drag & drop receipts or click here to upload
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        We will auto-scan and open the expense form for you.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

