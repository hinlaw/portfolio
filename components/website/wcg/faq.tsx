'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations('faq');

  const toggleFAQ = (idx: number) => {
    setOpenIndex(prev => prev === idx ? null : idx);
  };

  const faqs = [
    { q: t('items.q1'), a: t('items.a1') },
    { q: t('items.q2'), a: t('items.a2') },
    { q: t('items.q3'), a: t('items.a3') },
    { q: t('items.q4'), a: t('items.a4') },
    { q: t('items.q5'), a: t('items.a5') },
    { q: t('items.q6'), a: t('items.a6') },
    { q: t('items.q7'), a: t('items.a7') },
  ];

  return (
    <section className="pb-20 bg-white">
      <div className="max-w-[1016px] mx-auto px-4 md:px-0">
        <h2 className="text-[32px] md:text-[42px] font-bold text-[#000635] text-center mb-6" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
          {t('title')}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="rounded-[40px] rounded-bl-none p-6 bg-[#F1F3F4] relative cursor-pointer" onClick={() => toggleFAQ(idx)}>
                <div className="flex items-start mb-4 pr-8">
                  <h3 className="text-[21px] font-bold text-[#000635] flex-1" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{faq.q}</h3>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-[#FF0099] absolute top-6 right-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-base text-gray-600 pt-2" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

