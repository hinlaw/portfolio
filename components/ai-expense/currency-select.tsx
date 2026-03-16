'use client';

import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrencySelectProps {
    id: string;
    label: string;
    selectedCurrency: string;
    currencySearchKeyword: string;
    filteredCurrencies: string[];
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCurrencyChange: (currency: string) => void;
    onSearchChange: (keyword: string) => void;
    placeholder: string;
    emptyMessage: string;
    searchPrompt: string;
    disabled?: boolean;
    className?: string;
}

export function CurrencySelect({
    id,
    label,
    selectedCurrency,
    currencySearchKeyword,
    filteredCurrencies,
    isOpen,
    onOpenChange,
    onCurrencyChange,
    onSearchChange,
    placeholder,
    emptyMessage,
    searchPrompt,
    disabled = false,
    className,
}: CurrencySelectProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return;
        const handleMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onOpenChange(false);
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [isOpen, onOpenChange]);

    const handleSelect = (currency: string) => {
        onCurrencyChange(currency);
        onOpenChange(false);
    };

    const handleClear = () => {
        onCurrencyChange('');
        onSearchChange('');
        onOpenChange(false);
    };

    const hasContent = (!!selectedCurrency || !!currencySearchKeyword) && !disabled;

    return (
        <div className={cn('space-y-2', className)} ref={containerRef}>
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                    id={id}
                    value={selectedCurrency || currencySearchKeyword}
                    onChange={(e) => {
                        const value = e.target.value;
                        onSearchChange(value);
                        onOpenChange(true);
                        if (selectedCurrency && value !== selectedCurrency) {
                            onCurrencyChange('');
                        }
                    }}
                    onFocus={() => onOpenChange(true)}
                    onClick={() => onOpenChange(true)}
                    placeholder={placeholder}
                    className={cn('pl-9 w-full', hasContent && 'pr-9')}
                    disabled={disabled}
                />
                {hasContent && (
                    <button
                        type="button"
                        onClick={handleClear}
                        onMouseDown={(e) => e.preventDefault()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-sm opacity-70 ring-offset-background hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
                {isOpen && (
                    <div
                        className="absolute left-0 right-0 top-full mt-1 z-50 rounded-md border bg-popover p-0 text-popover-foreground shadow-md overflow-hidden"
                        style={{ minWidth: 'var(--radix-popover-trigger-width, 100%)' }}
                    >
                        <div className="max-h-[300px] overflow-y-auto">
                            {filteredCurrencies.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground text-center">
                                    {currencySearchKeyword.trim() ? emptyMessage : searchPrompt}
                                </div>
                            ) : (
                                filteredCurrencies.map((currency) => (
                                    <button
                                        key={currency}
                                        type="button"
                                        onClick={() => handleSelect(currency)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className={cn(
                                            'w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center justify-between',
                                            selectedCurrency === currency && 'bg-primary/5'
                                        )}
                                    >
                                        <span>{currency}</span>
                                        {selectedCurrency === currency && (
                                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
