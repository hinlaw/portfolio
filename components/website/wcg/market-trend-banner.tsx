import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";
import router from "next/router";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  banner: "/wcg/WCG-PLUS-account-banner-02.jpeg",
  arrow: "/wcg/Arrow.svg",
};

export default function MarketTrendBanner() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const desktopSectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const t = useTranslations('marketTrendBanner');

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
      {/* Desktop Market Trend Banner Section */}
      <section ref={desktopSectionRef} className="hidden md:block py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-10">
          <div className="text-center mb-4">
            <h2 className={`text-[42px] font-bold mb-[52px] ${hasAnimated ? styles.marketTrendBannerTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
              <span className="text-[#000635]">{t('title.part1')}</span>
              <span> </span>
              <span className="text-[#ff0099]">{t('title.part2')}</span>
              <span className="text-[#000635]">{t('title.part3')}</span>
            </h2>
          </div>
          <div className="relative w-[973px] h-[239px] mx-auto">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src={IMAGE_CONFIG.banner}
                alt="Market Trend Background"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0C1938] to-transparent z-[5]"></div>
            <div className={`absolute bottom-[1px] right-[134px] w-[731px] h-[287px] z-20 pointer-events-none ${hasAnimated ? styles.marketTrendBannerArrow : ''}`}>
              <Image
                src={IMAGE_CONFIG.arrow}
                alt="Arrow"
                width={731}
                height={287}
                className="object-contain w-full h-full"
              />
            </div>
            <div className={`relative px-22 pt-[48px] pb-12 flex flex-col gap-6 items-start z-30 ${hasAnimated ? styles.marketTrendBannerContent : 'opacity-0'}`}>
              <div className="flex flex-col gap-2 text-white text-[21px]">
                <h3 className="font-semibold" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {t('content.line1')}
                </h3>
                <p className=" font-semibold" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {t('content.line2')}
                </p>
              </div>
              <button className={`bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer ${hasAnimated ? styles.marketTrendBannerButton : 'opacity-0'}`}
                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
              >
                {t('cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Market Trend Banner Section */}
      <section ref={mobileSectionRef} className="md:hidden py-12 bg-white">
        <div className="px-4">
          <div className="text-center mb-4 w-[288px] mx-auto">
            <h2 className={`text-[32px] font-bold ${hasAnimated ? styles.marketTrendBannerTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
              <span className="text-[#000635]">{t('title.part1')}</span>
              <span> </span>
              <span className="text-[#ff0099]">{t('title.part2')}</span>
              <span className="text-[#000635]">{t('title.part3')}</span>
            </h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-[300px] mx-auto">
            <div className="absolute inset-0">
              <Image
                src={IMAGE_CONFIG.banner}
                alt="Market Trend Background"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C1938] to-transparent z-[5]"></div>
            <div className={`absolute bottom-0 right-[2px] w-[272px] h-[107px] z-20 pointer-events-none ${hasAnimated ? styles.marketTrendBannerArrow : ''}`}>
              <Image
                src={IMAGE_CONFIG.arrow}
                alt="Arrow"
                width={272}
                height={107}
                className="object-contain w-full h-full"
              />
            </div>
            <div className={`relative px-6 py-6 flex flex-col gap-4 items-start z-30 ${hasAnimated ? styles.marketTrendBannerContent : 'opacity-0'}`}>
              <div className="flex flex-col gap-2 text-white">
                <h3 className="text-[21px] font-semibold leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {t('content.line1')}
                </h3>
                <p className="text-[21px] font-semibold leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {t('content.line2')}
                </p>
              </div>
              <button className={`bg-[#ff0099] text-white px-6 py-3 rounded-full text-base font-bold self-center cursor-pointer ${hasAnimated ? styles.marketTrendBannerButton : 'opacity-0'}`}
                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
              >
                {t('cta')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

