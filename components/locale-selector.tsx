'use client';

import { useRouter } from 'next/router';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const LOCALES = ['en', 'zh', 'zh_HK'] as const;
type Locale = (typeof LOCALES)[number];

interface LocaleSelectorProps {
    className?: string;
}

export default function LocaleSelector({ className }: LocaleSelectorProps) {
    const router = useRouter();
    const currentLocale = useLocale() as Locale;
    const t = useTranslations('common.locales');

    const handleLocaleChange = (value: string) => {
        router.push(router.pathname, router.asPath, { locale: value });
    };

    return (
        <Select
            value={currentLocale}
            onValueChange={handleLocaleChange}
        >
            <SelectTrigger className={className}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {LOCALES.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                        {t(locale)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
