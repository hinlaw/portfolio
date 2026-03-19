import { useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";
import { useTranslations } from "next-intl";

export default function ComparisonTable() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations('comparisonTable');

  // 检测 section 是否进入视口，触发初始动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.2, // 当 20% 的元素可见时触发
        rootMargin: '0px 0px -100px 0px', // 提前一点触发
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasAnimated]);
  const rows = [
    {
      label: t('rows.regulation.label'),
      wcg: t('rows.regulation.wcg'),
      wcgBadge: t('rows.regulation.wcgBadge'),
      traditional: t('rows.regulation.traditional'),
      traditionalBadge: t('rows.regulation.traditionalBadge'),
      offshore: t('rows.regulation.offshore'),
      offshoreBadge: t('rows.regulation.offshoreBadge')
    },
    {
      label: t('rows.cost.label'),
      wcg: t('rows.cost.wcg'),
      wcgBadge: t('rows.cost.wcgBadge'),
      traditional: t('rows.cost.traditional'),
      traditionalBadge: t('rows.cost.traditionalBadge'),
      offshore: t('rows.cost.offshore'),
      offshoreBadge: t('rows.cost.offshoreBadge')
    },
    {
      label: t('rows.threshold.label'),
      wcg: t('rows.threshold.wcg'),
      wcgBadge: t('rows.threshold.wcgBadge'),
      traditional: t('rows.threshold.traditional'),
      traditionalBadge: t('rows.threshold.traditionalBadge'),
      offshore: t('rows.threshold.offshore'),
      offshoreBadge: t('rows.threshold.offshoreBadge')
    },
    {
      label: t('rows.leverage.label'),
      wcg: t('rows.leverage.wcg'),
      wcgBadge: t('rows.leverage.wcgBadge'),
      traditional: t('rows.leverage.traditional'),
      traditionalBadge: t('rows.leverage.traditionalBadge'),
      offshore: t('rows.leverage.offshore'),
      offshoreBadge: t('rows.leverage.offshoreBadge')
    },
    {
      label: t('rows.access.label'),
      wcg: t('rows.access.wcg'),
      wcgBadge: t('rows.access.wcgBadge'),
      traditional: t('rows.access.traditional'),
      traditionalBadge: t('rows.access.traditionalBadge'),
      offshore: t('rows.access.offshore'),
      offshoreBadge: t('rows.access.offshoreBadge')
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-0">
        <h2 className={`text-[32px] md:text-[42px] font-bold text-[#000635] text-center mb-12 ${hasAnimated ? styles.comparisonTableTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
          <span>{t('title.part1')}</span>
          <span className="text-[#ff0099] px-2 md:px-4">{t('title.part2')}</span>
          <span>{t('title.part3')}</span>
          <span className="text-[#ff0099] px-2 md:px-4">{t('title.part4')}</span>
          <span>{t('title.part5')}</span>
        </h2>
        <div className="overflow-x-auto mb-8">

          {/* Mobile Layout (md:hidden) */}
          <div className="flex gap-2 min-w-fit md:hidden">
            {/* Column 1: Label - Sticky for Mobile */}
            <div className="sticky left-0 z-20 flex-shrink-0 bg-white">
              <div className={`w-[120px] rounded-2xl border border-gray-200 overflow-hidden ${hasAnimated ? styles.comparisonTableColumn : 'opacity-0'} bg-white`}>
                <div className="h-[48px] p-4 text-center border-b border-gray-200 bg-white text-[#000635] flex items-center justify-center"></div>
                {rows.map((row, idx) => (
                  <div key={idx} className="h-[81px] p-4 bg-white font-bold text-center text-[#000635] border-b border-gray-200 last:border-b-0 flex items-center justify-center">
                    {row.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: WCG PLUS 帳戶 */}
            <div className={`flex-shrink-0 w-[305px] rounded-2xl border border-gray-200 overflow-hidden ${hasAnimated ? styles.comparisonTableColumn : 'opacity-0'}`}>
              <div className="h-[48px] p-4 text-center border-b border-gray-200 bg-[#000635] text-white font-medium flex items-center justify-center">
                <div className="flex items-center justify-center gap-2 font-bold" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                  <span className="text-[21px]">WCG Markets</span>
                  <span className="bg-[#ff0099] text-white px-4 py-1 rounded-full text-xs font-bold">{t('columns.wcgPlus')}</span>
                </div>
              </div>
              {rows.map((row, idx) => (
                <div key={idx} className="h-[81px] p-4 bg-[#000635] text-white text-center border-b border-gray-200 last:border-b-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-[#ff0099]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{row.wcg}</span>
                    </div>
                    <span className="bg-[#ff0099] text-white px-2 py-1 rounded text-[10px]">{row.wcgBadge}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3: 傳統銀行 / 金行 */}
            <div className={`flex-shrink-0 w-[280px] rounded-2xl border border-gray-200 overflow-hidden ${hasAnimated ? styles.comparisonTableColumn : 'opacity-0'}`}>
              <div className="h-[48px] text-[21px] p-4 text-center border-b border-gray-200 bg-white font-bold text-[#000635] flex items-center justify-center" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('columns.traditional')}</div>
              {rows.map((row, idx) => (
                <div key={idx} className="h-[81px] p-4 bg-white text-center text-[#000635] border-b border-gray-200 last:border-b-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <span>{row.traditional}</span>
                    <span className="border border-[#000635] text-[#000635] px-2 py-1 rounded text-[10px]">{row.traditionalBadge}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 4: 一般離岸交易商 */}
            <div className={`flex-shrink-0 w-[280px] rounded-2xl border border-gray-200 overflow-hidden ${hasAnimated ? styles.comparisonTableColumn : 'opacity-0'}`}>
              <div className="h-[48px] text-[21px] p-4 text-center border-b border-gray-200 bg-white font-bold text-[#000635] flex items-center justify-center" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('columns.offshore')}</div>
              {rows.map((row, idx) => (
                <div key={idx} className="h-[81px] p-4 bg-white text-center border-b border-gray-200 last:border-b-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-[#000635]">{row.offshore}</span>
                    </div>
                    <span className="border border-[#000635] text-[#000635] px-2 py-1 rounded text-[10px]">{row.offshoreBadge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Layout (hidden md:flex) */}
          <div className="hidden md:flex md:justify-center min-w-fit gap-2">
            {/* Column 1: Label - Normal Flow */}
            <div className={`flex-shrink-0 w-[144px] rounded-2xl border border-gray-200 overflow-hidden ${hasAnimated ? styles.comparisonTableColumn : 'opacity-0'} bg-white`}>
              <div className="h-[48px] p-4 text-center border-b border-gray-200 bg-white text-[#000635] flex items-center justify-center"></div>
              {rows.map((row, idx) => (
                <div key={idx} className="h-[81px] p-4 bg-white font-bold text-center text-[#000635] border-b border-gray-200 last:border-b-0 flex items-center justify-center">
                  {row.label}
                </div>
              ))}
            </div>

            {/* Column 2: WCG PLUS 帳戶 */}
            <div className={`flex-shrink-0 w-[305px] rounded-2xl border border-gray-200 overflow-hidden ${hasAnimated ? styles.comparisonTableColumn : 'opacity-0'}`}>
              <div className="h-[48px] p-4 text-center border-b border-gray-200 bg-[#000635] text-white font-medium flex items-center justify-center">
                <div className="flex items-center justify-center gap-2 font-bold" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                  <span className="text-[21px]">WCG Markets</span>
                  <span className="bg-[#ff0099] text-white px-4 py-1 rounded-full text-xs font-bold">{t('columns.wcgPlus')}</span>
                </div>
              </div>
              {rows.map((row, idx) => (
                <div key={idx} className="h-[81px] p-4 bg-[#000635] text-white text-center border-b border-gray-200 last:border-b-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-[#ff0099]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{row.wcg}</span>
                    </div>
                    <span className="bg-[#ff0099] text-white px-2 py-1 rounded text-[10px]">{row.wcgBadge}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3: 傳統銀行 / 金行 */}
            <div className={`flex-shrink-0 w-[280px] rounded-2xl border border-gray-200 overflow-hidden ${hasAnimated ? styles.comparisonTableColumn : 'opacity-0'}`}>
              <div className="h-[48px] text-[21px] p-4 text-center border-b border-gray-200 bg-white font-bold text-[#000635] flex items-center justify-center" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('columns.traditional')}</div>
              {rows.map((row, idx) => (
                <div key={idx} className="h-[81px] p-4 bg-white text-center text-[#000635] border-b border-gray-200 last:border-b-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <span>{row.traditional}</span>
                    <span className="border border-[#000635] text-[#000635] px-2 py-1 rounded text-[10px]">{row.traditionalBadge}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 4: 一般離岸交易商 */}
            <div className={`flex-shrink-0 w-[280px] rounded-2xl border border-gray-200 overflow-hidden ${hasAnimated ? styles.comparisonTableColumn : 'opacity-0'}`}>
              <div className="h-[48px] text-[21px] p-4 text-center border-b border-gray-200 bg-white font-bold text-[#000635] flex items-center justify-center" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('columns.offshore')}</div>
              {rows.map((row, idx) => (
                <div key={idx} className="h-[81px] p-4 bg-white text-center border-b border-gray-200 last:border-b-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-[#000635]">{row.offshore}</span>
                    </div>
                    <span className="border border-[#000635] text-[#000635] px-2 py-1 rounded text-[10px]">{row.offshoreBadge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

