"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export default function FloatingCard() {
    const [isVisible, setIsVisible] = useState(true);
    const router = useRouter();
    const t = useTranslations('floatingCard');

    if (!isVisible) return null;

    return (
        <div className="hidden md:block fixed top-[387px] right-[40px] z-[1000] overflow-visible">
            <div className="relative w-[150px] h-[185px] rounded-lg bg-gradient-to-b from-[#000635] via-[#93036F] to-[#FF0099] overflow-visible">
                {/* Close button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-0.5 right-0.5 z-20 w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-transform"
                    aria-label="Close"
                >
                    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                        <defs>
                            <linearGradient id="closeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#e4af71" />
                                <stop offset="50%" stopColor="#ffd589" />
                                <stop offset="100%" stopColor="#ffe8c7" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <X className="w-4 h-4" stroke="url(#closeGradient)" strokeWidth={2} />
                </button>
                {/* Gift boxes image */}
                <div className="absolute -top-[62px] left-1/2 -translate-x-1/2 z-10">
                    <Image
                        src="/wcg/pink-gift.png"
                        alt="Gift"
                        width={119}
                        height={119}
                        className="w-[119px] h-[119px] object-contain max-w-none"
                    />
                </div>

                {/* Text content */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 text-white">
                    <div className="flex flex-col gap-1 mt-[45px] items-center text-center">
                        <div className="flex items-center gap-1 text-[16px] justify-center">
                            <span>🔥</span>
                            <span style={{ fontFamily: 'var(--font-noto-sans-tc), sans-serif' }}>{t('newCustomer')}</span>
                        </div>
                        <div className="text-[14px] font-bold text-center" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-tc), sans-serif', fontWeight: 700 }}>
                            <span style={{ fontFamily: 'var(--font-noto-sans-tc), sans-serif' }}>{t('professionalAccount')}</span>
                        </div>
                        <div className="text-[14px] text-center" style={{ fontFamily: 'var(--font-noto-sans-tc), sans-serif' }}>
                            {t('threshold')}
                        </div>
                    </div>

                    {/* Button */}
                    <button className="bg-[#000635] text-white rounded-full py-1.5 px-3 text-[16px] font-medium mx-auto cursor-pointer" style={{ fontFamily: 'var(--font-noto-sans-tc), sans-serif' }}
                        onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                    >
                        {t('openApplication')}
                    </button>
                </div>
            </div>
        </div>
    );
}

