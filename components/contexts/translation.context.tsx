'use client';

import { createContext, useContext, ReactNode } from 'react';

// Pass-through: returns key as-is (no translation for now)
function t(key: string): string {
  return key;
}

const TranslationContext = createContext({ t });

export function TranslationProvider({ children }: { children: ReactNode }) {
  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    return { t };
  }
  return context;
}
