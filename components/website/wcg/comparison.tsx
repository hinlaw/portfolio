"use client";

import Image from "next/image";
import { X, Check } from "lucide-react";
import { useState } from "react";
import styles from "./landing-page.module.css";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  plan: "/wcg/plan.jpg",
};

export default function Comparison() {
  const [isSwapped, setIsSwapped] = useState(false);
  const t = useTranslations('comparison');

  return (
    <>
      {/* Desktop Comparison Section */}
      <section className="hidden md:block relative py-20 bg-[#000635]">
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <Image
            src={IMAGE_CONFIG.plan}
            alt="Plan"
            fill
            className="object-cover opacity-30 mix-blend-screen"
          />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-10">
          <div className={`text-center mb-12 ${styles.comparisonDesktopTitle}`}>
            <p className="text-[#ff0099] text-[42px] font-bold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('title.part1')}</p>
            <p className="text-white text-xl" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
              {t('title.part2')}
              <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
                {t('title.part3')}
              </span>
            </p>
          </div>
          <div className="flex justify-center items-center">
            {/* General Platform Card */}
            <div className={`bg-white border border-gray-200 rounded-[20px] p-8 w-[314px] mr-[-18px] ${styles.comparisonDesktopCardLeft}`}>
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-[#000635] text-2xl font-bold text-center" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('generalPlatform.name')}</h3>
              </div>
              <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4 w-[240px]"></div>
              <ul className="flex flex-col gap-4 text-sm text-gray-600" style={{ fontFamily: 'var(--font-inter), var(--font-noto-sans-jp), var(--font-open-sans), sans-serif' }}>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>{t('generalPlatform.items.highThreshold')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>{t('generalPlatform.items.wideSpread')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>{t('generalPlatform.items.expensive')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>{t('generalPlatform.items.lowLeverage')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>{t('generalPlatform.items.timeLimit')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>{t('generalPlatform.items.interest')}</span>
                </li>
              </ul>
            </div>

            {/* WCG PLUS Card */}
            <div className={`bg-white rounded-[20px] px-8 py-[42px] w-[320px] shadow-2xl relative z-10 ${styles.comparisonDesktopCardRight}`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <h3 className="text-[#000635] text-2xl font-bold" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>{t('wcgPlus.name')}</h3>
                <span className="bg-[#ff0099] text-white px-6 py-2 rounded-full text-[16px] font-bold" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('wcgPlus.badge')}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4 w-[250px]"></div>
              <ul className="flex flex-col gap-4 text-sm text-gray-600" style={{ fontFamily: 'var(--font-inter), var(--font-noto-sans-jp), var(--font-open-sans), sans-serif' }}>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>{t('wcgPlus.items.noThreshold')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>{t('wcgPlus.items.spreadRebate')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>{t('wcgPlus.items.zeroCommission')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>{t('wcgPlus.items.highLeverage')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>{t('wcgPlus.items.fastAccess')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>{t('wcgPlus.items.negativeBalance')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Comparison Section */}
      <section className="md:hidden relative py-12 bg-[#000635] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={IMAGE_CONFIG.plan}
            alt="Plan"
            fill
            className="object-cover opacity-30 mix-blend-screen"
          />
        </div>
        <div className="relative pl-4">
          <div className={`text-center mb-8 ${styles.comparisonMobileTitle}`}>
            <p className="text-[#ff0099] text-[32px] font-bold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('title.part1')}</p>
            <p className="text-white text-base" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
              {t('title.part2')}
              <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
                {t('title.part3')}
              </span>
            </p>
          </div>
          <div className="flex flex-row items-center overflow-hidden pb-4 relative" style={{ minHeight: '400px' }}>
            {/* WCG PLUS Card - Mobile */}
            <div
              className={`bg-white border border-gray-200 rounded-[20px] flex-shrink-0 ${styles.comparisonMobileCard} ${styles.mobileCardTransition} absolute ${isSwapped ? 'cursor-pointer' : ''}`}
              style={{
                width: '252px',
                minHeight: isSwapped ? '300px' : 'auto',
                maxHeight: isSwapped ? '300px' : 'none',
                left: isSwapped ? '256px' : '0',
                marginLeft: isSwapped ? '-12px' : '0',
                padding: '1rem',
                transform: 'translateX(0)',
                zIndex: isSwapped ? 1 : 2,
                transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1), min-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: isSwapped ? 'hidden' : 'visible',
              }}
              onClick={isSwapped ? () => setIsSwapped(false) : undefined}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#000635] text-xl font-bold" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('wcgPlus.name')}</h3>
                <span className="bg-[#ff0099] text-white px-4 py-2 rounded-full text-[14px] font-bold">{t('wcgPlus.badge')}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4"></div>
              <ul className={`space-y-3 ${isSwapped ? 'text-xs' : 'text-sm'} text-gray-600`} style={{ transition: 'font-size 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('wcgPlus.items.noThreshold')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('wcgPlus.items.spreadRebate')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('wcgPlus.items.zeroCommission')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('wcgPlus.items.highLeverage')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('wcgPlus.items.fastAccess')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('wcgPlus.items.negativeBalance')}</span>
                </li>
              </ul>
            </div>
            {/* General Platform Card - Mobile */}
            <div
              className={`bg-white border border-gray-200 rounded-[20px] flex-shrink-0 ${styles.comparisonMobileCard} ${styles.mobileCardTransition} ${!isSwapped ? 'cursor-pointer' : ''} absolute`}
              style={{
                width: '252px',
                minHeight: isSwapped ? 'auto' : '300px',
                maxHeight: isSwapped ? 'none' : '300px',
                left: isSwapped ? '0' : '256px',
                marginLeft: isSwapped ? '0' : '-12px',
                padding: '1.5rem',
                transform: 'translateX(0)',
                zIndex: isSwapped ? 2 : 1,
                transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1), min-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: isSwapped ? 'visible' : 'hidden',
              }}
              onClick={!isSwapped ? () => setIsSwapped(true) : undefined}
            >
              <h3 className="text-[#000635] text-xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('generalPlatform.name')}</h3>
              <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4"></div>
              <ul className={`space-y-3 ${isSwapped ? 'text-sm' : 'text-xs'} text-gray-600`} style={{ transition: 'font-size 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('generalPlatform.items.highThreshold')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('generalPlatform.items.wideSpread')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('generalPlatform.items.expensive')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('generalPlatform.items.lowLeverage')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('generalPlatform.items.timeLimit')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{t('generalPlatform.items.interest')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

