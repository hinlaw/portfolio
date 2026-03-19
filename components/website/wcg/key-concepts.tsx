import Image from "next/image";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";
import router from "next/router";
import { useTranslations } from "next-intl";

const getConceptImage = (concept: number): string => {
  switch (concept) {
    case 1:
      return "/wcg/Ultra‑fast-deposits-and-withdrawals.svg";
    case 2:
      return "/wcg/no-commission.svg";
    case 3:
      return "/wcg/Flexible-leverage.svg";
    default:
      return "/wcg/no-commission.svg";
  }
};

interface KeyConceptsProps {
  activeConcept: number;
  setActiveConcept: (num: number) => void;
}

export default function KeyConcepts({ activeConcept, setActiveConcept }: KeyConceptsProps) {
  const prevConceptRef = useRef<number>(activeConcept);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [animationKey, setAnimationKey] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [imageAnimationKey, setImageAnimationKey] = useState(0);
  const desktopSectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const t = useTranslations('keyConcepts');

  // 检测 section 是否进入视口，触发初始动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // 触发初始动画，通过更新 animationKey
            setAnimationKey(prev => prev + 1);
          }
        });
      },
      {
        threshold: 0.2, // 当 20% 的元素可见时触发
        rootMargin: '0px 0px -100px 0px', // 提前一点触发
      }
    );

    const desktopSection = desktopSectionRef.current;
    const mobileSection = mobileSectionRef.current;

    if (desktopSection) {
      observer.observe(desktopSection);
    }
    if (mobileSection) {
      observer.observe(mobileSection);
    }

    return () => {
      if (desktopSection) {
        observer.unobserve(desktopSection);
      }
      if (mobileSection) {
        observer.unobserve(mobileSection);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (prevConceptRef.current !== activeConcept) {
      // 判断动画方向：数字增大（1->2, 2->3）从右到左，数字减小（3->2, 2->1）从左到右
      setAnimationDirection(activeConcept > prevConceptRef.current ? 'right' : 'left');
      setAnimationKey(prev => prev + 1); // 更新 key 以强制重新渲染动画
      setImageAnimationKey(prev => prev + 1); // 更新图片动画 key 以触发淡入动画
      prevConceptRef.current = activeConcept;
    }
  }, [activeConcept]);
  // 共用的按鈕組件
  const MobileActionButtons = () => (
    <div className="text-center">
      <div className="flex flex-col gap-3 items-center">
        <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-base font-bold w-[200px] cursor-pointer"
          onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
        >
          {t('concept1.cta.openAccount')}
        </button>
        <button className="bg-white border-2 border-[#ff0099] text-[#ff0099] px-6 py-3 rounded-full text-base font-bold w-[200px] cursor-pointer"
          onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
        >
          {t('concept1.cta.upgradePlus')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Key Concepts Section */}
      <section ref={desktopSectionRef} className="hidden lg:block py-20 bg-white">
        <div className="max-w-[1280px] mx-auto ">
          <div className="flex">
            {/* Left Side - Image */}
            <div
              key={`desktop-image-container-${imageAnimationKey}`}
              className={`flex-shrink-0 w-[558px] h-[480px] relative z-10 ${hasAnimated ? styles.keyConceptsImage : 'opacity-0'}`}
            >
              <Image
                src={getConceptImage(activeConcept)}
                alt="Key Concept"
                fill
                className="object-contain object-left"
              />
            </div>

            {/* Right Side - Content - overlapping by 40px */}
            <div className="w-[768px] -ml-[55px] relative z-20 h-[467px] mb-8">
              <div className="w-full max-w-3xl mb-8">
                <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
                  {/* Button 1 */}
                  <button
                    type="button"
                    onClick={() => setActiveConcept(1)}
                    className={[
                      "relative flex items-center justify-center gap-3 px-5 py-4 select-none",
                      "flex-1 text-center focus:outline-none",
                      "transition-all duration-300 ease-in-out",
                      "cursor-pointer",
                      "z-30",
                      "-ml-[2px]",
                      activeConcept === 1 ? "bg-[#ff0099] text-white" : "bg-white text-[#000635]",
                    ].join(" ")}
                  >
                    {/* 右側斜角箭頭 */}
                    <span
                      aria-hidden
                      className={[
                        "pointer-events-none absolute inset-y-0 -right-8",
                        "w-8",
                        "[clip-path:polygon(0_0,50%_50%,0_100%)]",
                        "transition-all duration-300 ease-in-out",
                        activeConcept === 1 ? "bg-[#ff0099]" : "bg-white",
                        "z-30",
                      ].join(" ")}
                    />

                    {/* 編號圓徽章 */}
                    <span
                      className={[
                        "inline-flex items-center justify-center font-bold rounded-full",
                        "w-10 h-10",
                        "transition-all duration-300 ease-in-out",
                        activeConcept === 1
                          ? "text-white border-white/90 bg-white/20"
                          : "text-[#000635] border-[#ff0099] bg-white",
                        "border-2",
                        "flex-shrink-0",
                      ].join(" ")}
                    >
                      01
                    </span>

                    {/* 文字 */}
                    <span
                      className={[
                        "font-semibold text-[21px]",
                        "transition-colors duration-300 ease-in-out",
                        activeConcept === 1 ? "text-white" : "text-[#000635]",
                        "whitespace-nowrap",
                      ].join(" ")}
                    >
                      {t('concept1.title')}
                    </span>

                    {/* 可及性焦點樣式 */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-none focus:outline-none"
                      aria-hidden
                    />
                  </button>

                  {/* Button 2 */}
                  <button
                    type="button"
                    onClick={() => setActiveConcept(2)}
                    className={[
                      "relative flex items-center justify-center gap-3 px-5 py-4 select-none",
                      "flex-1 text-center focus:outline-none",
                      "transition-all duration-300 ease-in-out",
                      "cursor-pointer",
                      "z-20",
                      activeConcept === 2 ? "bg-[#ff0099] text-white" : "bg-white text-[#000635]",
                    ].join(" ")}
                  >
                    {/* 右側斜角箭頭 */}
                    <span
                      aria-hidden
                      className={[
                        "pointer-events-none absolute inset-y-0 -right-8",
                        "w-8",
                        "[clip-path:polygon(0_0,50%_50%,0_100%)]",
                        "transition-all duration-300 ease-in-out",
                        activeConcept === 2 ? "bg-[#ff0099]" : "bg-white",
                        "z-20",
                      ].join(" ")}
                    />

                    {/* 編號圓徽章 */}
                    <span
                      className={[
                        "inline-flex items-center justify-center font-bold rounded-full",
                        "w-10 h-10",
                        "transition-all duration-300 ease-in-out",
                        activeConcept === 2
                          ? "text-white border-white/90 bg-white/20"
                          : "text-[#000635] border-[#ff0099] bg-white",
                        "border-2",
                        "flex-shrink-0",
                      ].join(" ")}
                    >
                      02
                    </span>

                    {/* 文字 */}
                    <span
                      className={[
                        "font-semibold text-[21px]",
                        "transition-colors duration-300 ease-in-out",
                        activeConcept === 2 ? "text-white" : "text-[#000635]",
                        "whitespace-nowrap",
                      ].join(" ")}
                    >
                      {t('concept2.title')}
                    </span>

                    {/* 可及性焦點樣式 */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-none focus:outline-none"
                      aria-hidden
                    />
                  </button>

                  {/* Button 3 */}
                  <button
                    type="button"
                    onClick={() => setActiveConcept(3)}
                    className={[
                      "relative flex items-center justify-center gap-3 px-5 py-4 select-none",
                      "flex-1 text-center focus:outline-none",
                      "transition-all duration-300 ease-in-out",
                      "cursor-pointer",
                      // 基底
                      activeConcept === 3 ? "bg-[#ff0099] text-white z-10" : "bg-white text-[#000635]",
                    ].join(" ")}
                  >

                    {/* 編號圓徽章 */}
                    <span
                      className={[
                        "inline-flex items-center justify-center font-bold rounded-full",
                        "w-10 h-10",
                        "transition-all duration-300 ease-in-out",
                        activeConcept === 3
                          ? "text-white border-white/90 bg-white/20"
                          : "text-[#000635] border-[#ff0099] bg-white",
                        "border-2",
                        "flex-shrink-0",
                      ].join(" ")}
                    >
                      03
                    </span>

                    {/* 文字 */}
                    <span
                      className={[
                        "font-semibold text-[21px]",
                        "transition-colors duration-300 ease-in-out",
                        activeConcept === 3 ? "text-white" : "text-[#000635]",
                        "whitespace-nowrap",
                      ].join(" ")}
                    >
                      {t('concept3.title')}
                    </span>

                    {/* 可及性焦點樣式 */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-none focus:outline-none"
                      aria-hidden
                    />
                  </button>
                </div>
              </div>

              {/* Concept 1 Content */}
              {activeConcept === 1 && (
                <div className={hasAnimated ? (animationDirection === 'right' ? styles.keyConceptsContentSlideRight : styles.keyConceptsContentSlideLeft) : 'opacity-0'} key={`concept-1-${animationKey}`}>
                  <ul className="text-base text-gray-600 mb-8 space-y-4">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{t('concept1.items.item1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{t('concept1.items.item2')}</span>
                    </li>
                  </ul>
                  <div className="">
                    <div className="flex justify-start gap-4">
                      <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer"
                        onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                      >
                        {t('concept1.cta.openAccount')}
                      </button>
                      <button className="bg-white border-2 border-[#ff0099] text-[#ff0099] px-6 py-3 rounded-full text-lg font-bold cursor-pointer"
                        onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                      >
                        {t('concept1.cta.upgradePlus')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Concept 2 Content - Point Spread Comparison */}
              {activeConcept === 2 && (
                <div className={hasAnimated ? (animationDirection === 'right' ? styles.keyConceptsContentSlideRight : styles.keyConceptsContentSlideLeft) : 'opacity-0'} key={`concept-2-${animationKey}`}>
                  <ul className="text-base text-gray-600 mb-8 space-y-4">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{t('concept2.items.item1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{t('concept2.items.item2')}</span>
                    </li>
                  </ul>
                  <div className="overflow-x-auto mb-8">
                    <div className="flex gap-2">
                      {/* Column 1: 買賣方式 */}
                      <div className="flex-shrink-0 w-[144px] rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4 text-center border-b border-gray-200 bg-white font-bold text-[#000635] text-sm">{t('concept2.table.label')}</div>
                        <div className="p-4 bg-white font-bold text-sm text-center text-[#000635] border-b border-gray-200">
                          {t('concept2.table.row1')}
                        </div>
                        <div className="p-4 bg-white font-bold text-sm text-center text-[#000635] border-b border-gray-200 last:border-b-0">
                          {t('concept2.table.row2')}
                        </div>
                      </div>

                      {/* Column 2: WCG PLUS 帳戶 */}
                      <div className="flex-shrink-0 w-[200px] rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4 text-center border-b border-gray-200 bg-[#000635] text-white font-bold">{t('concept2.table.wcgPlus')}</div>
                        <div className="p-4 bg-[#000635] text-white text-center border-b border-gray-200">
                          <div className="flex items-center justify-center gap-1">
                            <Check className="w-5 h-5 text-[#ff0099]" />
                            <span className="tracking-tighter">{t('concept2.table.wcgRow1')}</span>
                          </div>
                        </div>
                        <div className="p-4 bg-[#000635] text-white text-center border-b border-gray-200 last:border-b-0">
                          <div className="flex items-center justify-center gap-1">
                            <Check className="w-5 h-5 text-[#ff0099]" />
                            <span className="tracking-tighter">{t('concept2.table.wcgRow2')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Column 3: 傳統銀行買紙黃金 */}
                      <div className="flex-shrink-0 w-[200px] rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4 text-center border-b border-gray-200 bg-white font-bold text-[#000635]">{t('concept2.table.traditional')}</div>
                        <div className="p-4 bg-white text-center text-[#000635] border-b border-gray-200">
                          {t('concept2.table.traditionalRow1')}
                        </div>
                        <div className="p-4 bg-white text-center text-[#000635] border-b border-gray-200 last:border-b-0">
                          {t('concept2.table.traditionalRow2')}
                        </div>
                      </div>

                      {/* Column 4: 實體金行買金 */}
                      <div className="flex-shrink-0 w-[200px] rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4 text-center border-b border-gray-200 bg-white font-bold text-[#000635]">{t('concept2.table.physical')}</div>
                        <div className="p-4 bg-white text-center border-b border-gray-200">
                          <div className="flex items-center justify-start gap-1">
                            <X className="w-5 h-5" />
                            <span className="text-[#000635] tracking-tighter">{t('concept2.table.physicalRow1')}</span>
                          </div>
                        </div>
                        <div className="p-4 bg-white text-center border-b border-gray-200 last:border-b-0">
                          <div className="flex items-center justify-start gap-1">
                            <X className="w-5 h-5" />
                            <span className="text-[#000635] tracking-tighter">{t('concept2.table.physicalRow2')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-start">
                    <p className="text-base text-gray-600 mb-6">
                      {t('concept2.description')}
                    </p>
                    <div className="flex justify-start gap-4">
                      <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer"
                        onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                      >
                        {t('concept2.cta.openAccount')}
                      </button>
                      <button className="bg-white border-2 border-[#ff0099] text-[#ff0099] px-6 py-3 rounded-full text-lg font-bold cursor-pointer"
                        onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                      >
                        {t('concept2.cta.upgradePlus')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Concept 3 Content - Leverage */}
              {activeConcept === 3 && (
                <div className={hasAnimated ? (animationDirection === 'right' ? styles.keyConceptsContentSlideRight : styles.keyConceptsContentSlideLeft) : 'opacity-0'} key={`concept-3-${animationKey}`}>
                  <ul className="text-base text-gray-600 mb-8 space-y-4">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{t('concept3.items.item1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{t('concept3.items.item2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{t('concept3.items.item3')}</span>
                    </li>
                  </ul>
                  <div className="">
                    <div className="flex justify-start gap-4">
                      <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer"
                        onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                      >
                        {t('concept3.cta.openAccount')}
                      </button>
                      <button className="bg-white border-2 border-[#ff0099] text-[#ff0099] px-6 py-3 rounded-full text-lg font-bold cursor-pointer"
                        onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                      >
                        {t('concept3.cta.upgradePlus')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Key Concepts Section */}
      <section ref={mobileSectionRef} className="lg:hidden py-12 bg-white">
        <div className="px-4">
          {/* Mobile Image */}
          <div className="w-full">
            <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
              {/* Button 1 */}
              <button
                type="button"
                onClick={() => setActiveConcept(1)}
                className={[
                  "relative flex items-center justify-center gap-2 py-3 select-none",
                  // 選中時使用 flex-1 佔用更多空間，未選中時使用 flex-none 只顯示徽章
                  activeConcept === 1 ? "flex-1" : "flex-none",
                  "text-center focus:outline-none",
                  "transition-all duration-300 ease-in-out",
                  "cursor-pointer",
                  "z-30",
                  "-mr-[2px]",
                  activeConcept === 1 ? "bg-[#ff0099] text-white px-3" : "bg-white text-[#000635] px-6",
                ].join(" ")}
              >
                {/* 右側斜角箭頭 */}
                <span
                  aria-hidden
                  className={[
                    "pointer-events-none absolute inset-y-0",
                    "-right-6",
                    "w-6",
                    // 用 clip-path 畫三角形
                    "[clip-path:polygon(0_0,50%_50%,0_100%)]",
                    "transition-all duration-300 ease-in-out",
                    activeConcept === 1 ? "bg-[#ff0099]" : "bg-white",
                  ].join(" ")}
                />

                {/* 編號圓徽章 */}
                <span
                  className={[
                    "inline-flex items-center justify-center font-bold rounded-full",
                    "w-8 h-8",
                    "transition-all duration-300 ease-in-out",
                    activeConcept === 1
                      ? "text-white border-white/90 bg-white/20"
                      : "text-[#000635] border-[#ff0099] bg-white",
                    "border-2",
                    "flex-shrink-0",
                  ].join(" ")}
                >
                  01
                </span>

                {/* 文字 - 未選取時隱藏 */}
                <span
                  className={[
                    "font-semibold text-base",
                    "transition-all duration-300 ease-in-out",
                    activeConcept === 1 ? "text-white" : "hidden",
                    "whitespace-nowrap",
                  ].join(" ")}
                >
                  {t('concept1.title')}
                </span>

                {/* 可及性焦點樣式 */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-none focus:outline-none"
                  aria-hidden
                />
              </button>

              {/* Button 2 */}
              <button
                type="button"
                onClick={() => setActiveConcept(2)}
                className={[
                  "relative flex items-center justify-center gap-2 py-3 select-none",
                  // 選中時使用 flex-1 佔用更多空間，未選中時使用 flex-none 只顯示徽章
                  activeConcept === 2 ? "flex-1" : "flex-none",
                  "text-center focus:outline-none",
                  "transition-all duration-300 ease-in-out",
                  "cursor-pointer",
                  "-mr-[2px]",
                  "z-20",
                  activeConcept === 2 ? "bg-[#ff0099] text-white px-3" : "bg-white text-[#000635] px-6",
                ].join(" ")}
              >
                {/* 右側斜角箭頭 */}
                <span
                  aria-hidden
                  className={[
                    "pointer-events-none absolute inset-y-0",
                    "-right-6",
                    "w-6",
                    // 用 clip-path 畫三角形
                    "[clip-path:polygon(0_0,50%_50%,0_100%)]",
                    "transition-all duration-300 ease-in-out",
                    activeConcept === 2 ? "bg-[#ff0099]" : "bg-white",
                    // 疊在下一段上面，避免接縫露底色
                    "z-20",
                  ].join(" ")}
                />

                {/* 編號圓徽章 */}
                <span
                  className={[
                    "inline-flex items-center justify-center font-bold rounded-full",
                    "w-8 h-8",
                    "transition-all duration-300 ease-in-out",
                    activeConcept === 2
                      ? "text-white border-white/90 bg-white/20"
                      : "text-[#000635] border-[#ff0099] bg-white",
                    "border-2",
                    "flex-shrink-0",
                  ].join(" ")}
                >
                  02
                </span>

                {/* 文字 - 未選取時隱藏 */}
                <span
                  className={[
                    "font-semibold text-base",
                    "transition-all duration-300 ease-in-out",
                    activeConcept === 2 ? "text-white" : "hidden",
                    "whitespace-nowrap",
                  ].join(" ")}
                >
                  {t('concept2.title')}
                </span>

                {/* 可及性焦點樣式 */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-none focus:outline-none"
                  aria-hidden
                />
              </button>

              {/* Button 3 */}
              <button
                type="button"
                onClick={() => setActiveConcept(3)}
                className={[
                  "relative flex items-center justify-center gap-2 py-3 select-none",
                  // 選中時使用 flex-1 佔用更多空間，未選中時使用 flex-none 只顯示徽章
                  activeConcept === 3 ? "flex-1" : "flex-none",
                  "text-center focus:outline-none",
                  "transition-all duration-300 ease-in-out",
                  "cursor-pointer",
                  activeConcept === 3 ? "bg-[#ff0099] text-white z-10 px-3" : "bg-white text-[#000635] px-6",
                ].join(" ")}
              >
                {/* 編號圓徽章 */}
                <span
                  className={[
                    "inline-flex items-center justify-center font-bold rounded-full",
                    "w-8 h-8",
                    "transition-all duration-300 ease-in-out",
                    activeConcept === 3
                      ? "text-white border-white/90 bg-white/20"
                      : "text-[#000635] border-[#ff0099] bg-white",
                    "border-2",
                    "flex-shrink-0",
                  ].join(" ")}
                >
                  03
                </span>

                {/* 文字 - 未選取時隱藏 */}
                <span
                  className={[
                    "font-semibold text-base",
                    "transition-all duration-300 ease-in-out",
                    activeConcept === 3 ? "text-white" : "hidden",
                    "whitespace-nowrap",
                  ].join(" ")}
                >
                  {t('concept3.title')}
                </span>

                {/* 可及性焦點樣式 */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-none focus:outline-none"
                  aria-hidden
                />
              </button>
            </div>
          </div>
          <div
            key={`mobile-image-container-${imageAnimationKey}`}
            className={`w-full relative ${hasAnimated ? styles.keyConceptsImage : 'opacity-0'}`}
            style={{ height: '300px' }}
          >
            <Image
              src={getConceptImage(activeConcept)}
              alt="Key Concept"
              fill
              className="object-contain"
            />
          </div>

          {/* Mobile Concept 1 Content */}
          {activeConcept === 1 && (
            <div className={hasAnimated ? (animationDirection === 'right' ? styles.keyConceptsContentSlideRight : styles.keyConceptsContentSlideLeft) : 'opacity-0'} key={`mobile-concept-1-${animationKey}`}>
              <ul className="text-base text-gray-600 mb-6 space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 text-[#ff0099]">•</span>
                  <span>{t('concept1.items.item1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-[#ff0099]">•</span>
                  <span>{t('concept1.items.item2')}</span>
                </li>
              </ul>
              <MobileActionButtons />
            </div>
          )}

          {/* Mobile Concept 2 Content */}
          {activeConcept === 2 && (
            <div className={hasAnimated ? (animationDirection === 'right' ? styles.keyConceptsContentSlideRight : styles.keyConceptsContentSlideLeft) : 'opacity-0'} key={`mobile-concept-2-${animationKey}`}>
              <ul className="text-base text-gray-600 mb-6 space-y-3">
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span>{t('concept2.items.item1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span>{t('concept2.items.item2')}</span>
                </li>
              </ul>
              <div className="overflow-x-auto mb-6">
                <div className="flex gap-2">
                  {/* Column 1: Label */}
                  <div className="flex-shrink-0 w-[106px] rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-2 bg-white font-bold text-[#000635] border-b border-gray-200 text-xs">
                      {t('concept2.table.label')}
                    </div>
                    <div className="p-2 bg-white font-bold text-[#000635] border-b border-gray-200 text-xs">
                      {t('concept2.table.row1')}
                    </div>
                    <div className="p-2 bg-white font-bold text-[#000635] border-b border-gray-200 last:border-b-0 text-xs">
                      {t('concept2.table.row2')}
                    </div>
                  </div>

                  {/* Column 2: WCG PLUS 帳戶 */}
                  <div className="flex-shrink-0 w-[169px] rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-2 text-center border-b border-gray-200 bg-[#000635] text-white font-medium text-xs">{t('concept2.table.wcgPlus')}</div>
                    <div className="p-2 bg-[#000635] text-white text-center border-b border-gray-200">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-[#ff0099]" />
                        <span className="text-xs">{t('concept2.table.wcgRow1')}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-[#000635] text-white text-center border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-[#ff0099]" />
                        <span className="text-xs">{t('concept2.table.wcgRow2')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: 傳統銀行買紙黃金 */}
                  <div className="flex-shrink-0 w-[143px] rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-2 text-center border-b border-gray-200 bg-white font-medium text-[#000635] text-xs">{t('concept2.table.traditional')}</div>
                    <div className="p-2 bg-white text-center text-[#000635] text-xs border-b border-gray-200">
                      {t('concept2.table.traditionalRow1')}
                    </div>
                    <div className="p-2 bg-white text-center text-[#000635] text-xs border-b border-gray-200 last:border-b-0">
                      {t('concept2.table.traditionalRow2')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-6">
                  {t('concept2.description')}
                </p>
                <MobileActionButtons />
              </div>
            </div>
          )}

          {/* Mobile Concept 3 Content */}
          {activeConcept === 3 && (
            <div className={hasAnimated ? (animationDirection === 'right' ? styles.keyConceptsContentSlideRight : styles.keyConceptsContentSlideLeft) : 'opacity-0'} key={`mobile-concept-3-${animationKey}`}>
              <ul className="text-base text-gray-600 mb-6 space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 text-[#ff0099]">•</span>
                  <span>{t('concept3.items.item1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-[#ff0099]">•</span>
                  <span>{t('concept3.items.item2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-[#ff0099]">•</span>
                  <span>{t('concept3.items.item3')}</span>
                </li>
              </ul>
              <MobileActionButtons />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

