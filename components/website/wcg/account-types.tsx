import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";
import router from "next/router";
import { useTranslations } from "next-intl";

export default function AccountTypes() {
    const [hasAnimated, setHasAnimated] = useState(false);
    const desktopSectionRef = useRef<HTMLElement>(null);
    const mobileSectionRef = useRef<HTMLElement>(null);
    const t = useTranslations('accountTypes');

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

    return (
        <>
            {/* Desktop Account Types Section */}
            <section ref={desktopSectionRef} className="hidden md:block py-20 bg-[#000635]">
                <div className="max-w-[1280px] mx-auto px-10">
                    <div className={`text-center mb-12 ${hasAnimated ? styles.accountTypesDesktopTitle : 'opacity-0'}`}>
                        <h2 className="text-[42px] font-bold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                            <span className="text-[#ff0099]">{t('title.part1')}</span>
                            <span className="text-white">{t('title.part2')}</span>
                        </h2>
                        <p className="text-white text-xl" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>{t('subtitle')}</p>
                    </div>
                    <div className="flex justify-center gap-0">
                        {/* STD Account */}
                        <div className="bg-white border border-gray-200 rounded-tl-[20px] rounded-bl-[20px] p-8 pb-10 w-[304px] h-[456px] mt-[51px] flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[#000635] text-2xl font-bold" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('std.name')}</h3>
                                <span className="bg-[#000635] text-white px-2 py-2.5 rounded text-xs font-semibold" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 600 }}>{t('std.badge')}</span>
                            </div>
                            <div className="text-center mb-4">
                                <p className="text-[12px] text-[#000635] mb-1" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>{t('std.minDeposit')}</p>
                                <p className="text-[30px] font-bold text-[#000635]" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>$100 USD</p>
                            </div>
                            <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4"></div>
                            <ul className="space-y-4 text-sm text-gray-600 mb-6">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[#000635] flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <span>{t('std.target')}</span>
                                        <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('std.targetBadge')}</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#000635]" />
                                    <span>{t('std.spread')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('std.spreadBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#000635]" />
                                    <span>{t('std.promotion')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#000635]" />
                                    <span>{t('std.leverage')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('std.leverageBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#000635]" />
                                    <span>{t('std.lotSize')}</span>
                                </li>
                            </ul>
                            <button className={`w-full bg-[#000635] text-white py-3 rounded-full text-lg font-bold cursor-pointer ${styles.accountTypesButton}`} style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
                                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                            >
                                {t('std.cta')}
                            </button>
                        </div>

                        {/* PLUS Account */}
                        <div className="flex flex-col items-center w-[320px] relative z-10">
                            <div className="bg-[#ff0099] text-white text-center h-[51px] w-full flex items-center justify-center rounded-t-[20px] text-base font-bold tracking-widest" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                                {t('plus.promoBanner')}
                            </div>
                            <div className="bg-white border-[5px] border-[#ff0099] border-t-0 rounded-b-[20px] rounded-t-none p-8 pt-6 pb-10 w-full h-[508px] shadow-xl flex flex-col">
                                <div className="text-center mb-4">
                                    <h3 className="text-[#ff0099] text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('plus.name')}</h3>
                                </div>
                                <div className="text-center mb-4">
                                    <p className="text-[12px] text-[#ff0099] mb-1" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>{t('plus.minDeposit')}</p>
                                    <p className="text-[32px] font-bold text-[#ff0099]" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>$0 USD</p>
                                    <p className="text-[21px] font-bold text-[#000635] line-through" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>{t('plus.originalPrice')}</p>
                                </div>
                                <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4"></div>
                                <ul className="space-y-4 text-sm text-gray-600 mb-6" style={{ fontFamily: 'var(--font-inter), var(--font-noto-sans-jp), var(--font-open-sans), sans-serif' }}>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-[#ff0099] flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div>
                                                <span>{t('plus.target')}</span>
                                                <span className="ml-2 border border-[#ff0099] text-[#ff0099] px-0.5 py-0.5 rounded text-[10px] ">{t('plus.targetBadge')}</span>
                                            </div>
                                            <div>
                                                <span>{t('plus.target2')}</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-[#ff0099]" />
                                        <span>{t('plus.spread')} <span className="ml-2 border border-[#ff0099] text-[#ff0099] px-0.5 py-0.5 rounded text-[10px]">{t('plus.spreadBadge')}</span></span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-[#ff0099]" />
                                        <span>{t('plus.noFee')} <span className="ml-2 border border-[#ff0099] text-[#ff0099] px-0.5 py-0.5 rounded text-[10px]">{t('plus.noFeeBadge')}</span></span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-[#ff0099]" />
                                        <span>{t('plus.leverage')} <span className="ml-2 border border-[#ff0099] text-[#ff0099] px-0.5 py-0.5 rounded text-[10px]">{t('plus.leverageBadge')}</span></span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-[#ff0099]" />
                                        <span>{t('plus.lotSize')}</span>
                                    </li>
                                </ul>
                                <button className={`w-full bg-[#ff0099] text-white py-3 rounded-full text-lg font-bold cursor-pointer ${styles.accountTypesButton}`} style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
                                    onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                                >
                                    {t('plus.cta')}
                                </button>
                            </div>
                        </div>

                        {/* PRO Account */}
                        <div className="bg-white border border-gray-200 rounded-tr-[20px] rounded-br-[20px] p-8 pb-10 w-[306px] h-[456px] mt-[51px] flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[#000635] text-2xl font-bold" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('pro.name')}</h3>
                                <span className="bg-[#000635] text-white px-2 py-2.5 rounded text-xs font-semibold" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 600 }}>{t('pro.badge')}</span>
                            </div>
                            <div className="text-center mb-4">
                                <p className="text-[12px] text-[#000635] mb-1" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>{t('pro.minDeposit')}</p>
                                <p className="text-[30px] font-bold text-[#000635]" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>$50,000 USD</p>
                            </div>
                            <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4"></div>
                            <ul className="space-y-4 text-sm text-gray-600 mb-6" style={{ fontFamily: 'var(--font-inter), var(--font-noto-sans-jp), var(--font-open-sans), sans-serif' }}>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[#000635] flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <span>{t('pro.target')}</span>
                                        <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('pro.targetBadge')}</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#000635]" />
                                    <span>{t('pro.spread')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('pro.spreadBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#000635]" />
                                    <span>{t('pro.noFee')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('pro.noFeeBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#000635]" />
                                    <span>{t('pro.leverage')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('pro.leverageBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#000635]" />
                                    <span>{t('pro.lotSize')}</span>
                                </li>
                            </ul>
                            <button className={`w-full bg-[#000635] text-white py-3 rounded-full text-lg font-bold cursor-pointer ${styles.accountTypesButton}`} style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
                                onClick={() => {
                                    if (typeof window !== 'undefined' && window.LiveChatWidget) {
                                        window.LiveChatWidget.call('maximize');
                                    }
                                }}
                            >
                                {t('pro.cta')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Account Types Section */}
            <section ref={mobileSectionRef} className="md:hidden py-12 bg-[#000635]">
                <div className="px-4">
                    <div className={`text-center mb-8 ${hasAnimated ? styles.accountTypesMobileTitle : 'opacity-0'}`}>
                        <h2 className="text-[32px] font-bold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                            <span className="text-[#ff0099]">{t('title.part1')}</span>
                            <span className="text-white">{t('title.part2')}</span>
                        </h2>
                        <p className="text-white text-base">{t('subtitle')}</p>
                    </div>
                    <div className="flex flex-col gap-6">
                        {/* PLUS Account - Mobile (First) */}
                        <div className={`flex flex-col items-center w-full ${hasAnimated ? styles.accountTypesMobileCard : 'opacity-0'}`}>
                            <div className="bg-[#ff0099] text-white text-center h-[51px] w-full flex items-center justify-center rounded-t-[20px] text-base font-bold tracking-widest" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                                {t('plus.promoBanner')}
                            </div>
                            <div className="bg-white border-[5px] border-[#ff0099] border-t-0 rounded-b-[20px] rounded-t-none p-6 w-full">
                                <div className="text-center mb-4">
                                    <h3 className="text-[#ff0099] text-2xl font-bold mb-2 " style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('plus.name')}</h3>
                                </div>
                                <div className="text-center mb-4">
                                    <p className="text-xs text-[#ff0099] mb-1">{t('plus.minDeposit')}</p>
                                    <p className="text-3xl font-bold text-[#ff0099]" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>$0 USD</p>
                                    <p className="text-xl font-bold text-[#000635] line-through" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>{t('plus.originalPrice')}</p>
                                </div>
                                <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4"></div>
                                <ul className="space-y-3 text-sm text-gray-600 mb-6">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-[#ff0099] flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div>
                                                <span>{t('plus.target')}</span>
                                                <span className="ml-2 border border-[#ff0099] text-[#ff0099] px-0.5 py-0.5 rounded text-[10px] font-bold">{t('plus.targetBadge')}</span>
                                            </div>
                                            <div>
                                                <span>{t('plus.target2')}</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#ff0099]" />
                                        <span>{t('plus.spread')} <span className="ml-2 border border-[#ff0099] text-[#ff0099] px-0.5 py-0.5 rounded text-[10px] font-bold">{t('plus.spreadBadge')}</span></span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#ff0099]" />
                                        <span>{t('plus.noFee')} <span className="ml-2 border border-[#ff0099] text-[#ff0099] px-0.5 py-0.5 rounded text-[10px] font-bold">{t('plus.noFeeBadge')}</span></span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#ff0099]" />
                                        <span>{t('plus.leverage')} <span className="ml-2 border border-[#ff0099] text-[#ff0099] px-0.5 py-0.5 rounded text-[10px] font-bold">{t('plus.leverageBadge')}</span></span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#ff0099]" />
                                        <span>{t('plus.lotSize')}</span>
                                    </li>
                                </ul>
                                <div className="flex justify-center">
                                    <button className={`bg-[#ff0099] text-white py-3 rounded-full text-lg font-bold px-12 cursor-pointer ${styles.accountTypesButton}`}
                                        onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                                    >
                                        {t('plus.cta')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* STD Account - Mobile */}
                        <div className={`bg-white border border-gray-200 rounded-[20px] p-6 ${hasAnimated ? styles.accountTypesMobileCard : 'opacity-0'}`}>
                            <div className="flex items-center justify-center gap-1 mb-4">
                                <h3 className="text-[#000635] text-2xl font-bold" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('std.name')}</h3>
                                <span className="bg-[#000635] text-white px-2 py-2.5 rounded text-sm font-semibold">{t('std.badge')}</span>
                            </div>
                            <div className="text-center mb-4">
                                <p className="text-xs text-[#000635] mb-1">{t('std.minDeposit')}</p>
                                <p className="text-3xl font-bold text-[#000635]" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>$100 USD</p>
                            </div>
                            <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4"></div>
                            <ul className="space-y-3 text-sm text-gray-600 mb-6">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-[#000635] flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <span>{t('std.target')}</span>
                                        <span className="ml-2 text-gray-600 px-2 py-0.5 border border-dark rounded text-[10px]">{t('std.targetBadge')}</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#000635]" />
                                    <span>{t('std.spread')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('std.spreadBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#000635]" />
                                    <span>{t('std.promotion')}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#000635]" />
                                    <span>{t('std.leverage')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('std.leverageBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#000635]" />
                                    <span>{t('std.lotSize')}</span>
                                </li>
                            </ul>
                            <div className="flex justify-center">
                                <button className={`bg-[#000635] text-white py-3 rounded-full text-lg font-bold px-12 cursor-pointer ${styles.accountTypesButton}`}
                                    onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                                >
                                    {t('std.cta')}
                                </button>
                            </div>
                        </div>
                        {/* PRO Account - Mobile */}
                        <div className={`bg-white border border-gray-200 rounded-[20px] p-6 ${hasAnimated ? styles.accountTypesMobileCard : 'opacity-0'}`}>
                            <div className="flex items-center justify-center gap-1 mb-4">
                                <h3 className="text-[#000635] text-2xl font-bold" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('pro.name')}</h3>
                                <span className="bg-[#000635] text-white px-2 py-2.5 rounded text-sm font-semibold">{t('pro.badge')}</span>
                            </div>
                            <div className="text-center mb-4">
                                <p className="text-xs text-[#000635] mb-1">{t('pro.minDeposit')}</p>
                                <p className="text-3xl font-bold text-[#000635]" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>$50,000 USD</p>
                            </div>
                            <div className="h-px bg-gradient-to-r from-[#000635] to-[#ff0099] mb-4"></div>
                            <ul className="space-y-3 text-sm text-gray-600 mb-6">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-[#000635] flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <span>{t('pro.target')}</span>
                                        <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('pro.targetBadge')}</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#000635]" />
                                    <span>{t('pro.spread')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('pro.spreadBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#000635]" />
                                    <span>{t('pro.noFee')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('pro.noFeeBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#000635]" />
                                    <span>{t('pro.leverage')} <span className="ml-2 border px-0.5 py-0.5 rounded text-[10px] font-bold">{t('pro.leverageBadge')}</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#000635]" />
                                    <span>{t('pro.lotSize')}</span>
                                </li>
                            </ul>
                            <div className="flex justify-center">
                                <button className={`bg-[#000635] text-white py-3 rounded-full text-lg font-bold px-12 cursor-pointer ${styles.accountTypesButton}`}
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && window.LiveChatWidget) {
                                            window.LiveChatWidget.call('maximize');
                                        }
                                    }}
                                >
                                    {t('pro.cta')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

