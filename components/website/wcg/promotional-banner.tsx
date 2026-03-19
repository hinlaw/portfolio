import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";
import router from "next/router";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  banner: "/wcg/WCG-PLUS-account-banner-01.jpg",
  arrow: "/wcg/Arrow.svg",
};

export default function PromotionalBanner() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const desktopSectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const t = useTranslations('promotionalBanner');

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
      {/* Desktop Promotional Banner Section */}
      <section ref={desktopSectionRef} className="hidden md:block py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-10">
          <div className="text-center mb-4">
            <h2 className={`text-[42px] font-bold ${hasAnimated ? styles.promotionalBannerTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
              <span className="text-[#ff0099]">{t('title.part1')}</span>
              <span> </span>
              <span className="text-[#000635]">{t('title.part2')}</span>
            </h2>
          </div>
          <div className="relative w-[973px] h-[239px] mx-auto">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src={IMAGE_CONFIG.banner}
                alt="Promotional Background"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0C1938] to-transparent z-[5]"></div>
            <div className={`absolute bottom-[1px] right-[44px] w-[731px] h-[287px] z-20 ${hasAnimated ? styles.promotionalBannerArrow : ''}`}>
              <Image
                src={IMAGE_CONFIG.arrow}
                alt="Arrow"
                width={731}
                height={287}
                className="object-contain w-full h-full"
              />
            </div>
            <div className={`relative px-20 pt-[66px] pb-12 flex flex-col gap-6 items-start z-10 ${hasAnimated ? styles.promotionalBannerContent : 'opacity-0'}`}>
              <h3 className="text-white text-2xl font-semibold" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                {t('subtitle')}
              </h3>
              <button className={`bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer ${hasAnimated ? styles.promotionalBannerButton : 'opacity-0'}`}
                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
              >
                {t('cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Promotional Banner Section */}
      <section ref={mobileSectionRef} className="md:hidden py-12 bg-white">
        <div className="px-4">
          <div className="text-center mb-4 w-[288px] mx-auto">
            <h2 className={`text-[32px] font-bold ${hasAnimated ? styles.promotionalBannerTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
              <span className="text-[#ff0099]">{t('title.part1')}</span>
              <span> </span>
              <span className="text-[#000635]">{t('title.part2')}</span>
            </h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-[300px] mx-auto">
            <div className="absolute inset-0">
              <Image
                src={IMAGE_CONFIG.banner}
                alt="Promotional Background"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C1938] to-transparent z-[5]"></div>
            <div className={`absolute bottom-0 left-[4px] w-[272px] h-[107px] z-20 ${hasAnimated ? styles.promotionalBannerArrow : ''}`}>
              <Image
                src={IMAGE_CONFIG.arrow}
                alt="Arrow"
                width={272}
                height={107}
                className="object-contain w-full h-full"
              />
            </div>
            <div className={`relative px-6 py-8 flex flex-col gap-4 items-start z-10 ${hasAnimated ? styles.promotionalBannerContent : 'opacity-0'}`}>
              <h3 className="text-white text-2xl font-semibold leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                {t('subtitle')}
              </h3>
              <button className={`bg-[#ff0099] text-white px-8 py-3 rounded-full text-base font-bold cursor-pointer ${hasAnimated ? styles.promotionalBannerButton : 'opacity-0'}`}
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

