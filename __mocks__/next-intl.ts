import React from 'react';

// Mock useTranslations - returns the key as the translated string (for testing)
export function useTranslations(_namespace?: string) {
  return (key: string, values?: Record<string, string | number>) => {
    if (values) {
      let result = key;
      for (const [k, v] of Object.entries(values)) {
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
      return result;
    }
    return key;
  };
}

// Mock NextIntlClientProvider - just renders children
export function NextIntlClientProvider({
  children,
}: {
  children: React.ReactNode;
  locale?: string;
  messages?: Record<string, unknown>;
}) {
  return React.createElement(React.Fragment, null, children);
}
