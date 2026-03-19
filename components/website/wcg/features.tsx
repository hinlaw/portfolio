import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";
import router from "next/router";
import { useTranslations } from "next-intl";

export default function Features() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const desktopSectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const t = useTranslations('features');

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
  const features = [
    { title: t('items.dualRegulation.title'), desc: t('items.dualRegulation.desc'), imageUrl: "/wcg/Hong-Kong-dual-regulation.svg" },
    { title: t('items.fastAccess.title'), desc: t('items.fastAccess.desc'), imageUrl: "/wcg/Ultra‑fast-deposits-and-withdrawals.svg" },
    { title: t('items.flexibleLeverage.title'), desc: t('items.flexibleLeverage.desc'), imageUrl: "/wcg/Flexible-leverage.svg" },
    { title: t('items.zeroCommission.title'), desc: t('items.zeroCommission.desc'), imageUrl: "/wcg/no-commission.svg" },
    { title: t('items.negativeBalance.title'), desc: t('items.negativeBalance.desc'), imageUrl: "/wcg/Negative-balance-protection.svg" },
    { title: t('items.tradingHours.title'), desc: t('items.tradingHours.desc'), imageUrl: "/wcg/24‑hour-trading.svg" },
  ];

  return (
    <>
      {/* Desktop Features Section */}
      <section ref={desktopSectionRef} className="hidden md:block py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-10">
          <h2 className={`text-[42px] font-bold text-[#000635] text-center mb-12 ${hasAnimated ? styles.featuresTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            {t('title')}
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-12">
            {features.map((feature, idx) => (
              <div key={idx} className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${hasAnimated ? styles.featuresCard : 'opacity-0'}`}>
                <div className="bg-[#000635] flex items-center justify-center pt-8">
                  {feature.imageUrl ? (
                    <Image
                      src={feature.imageUrl}
                      alt={feature.title}
                      width={280}
                      height={400}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-600 rounded"></div>
                  )}
                </div>
                <div className="bg-[#000635] text-white p-6">
                  <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-base">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={`text-[21px] text-[#000635] text-center mb-6 ${hasAnimated ? styles.featuresBottomText : 'opacity-0'}`}>
            {t('bottomText')}
          </p>
          <div className="flex justify-center">
            <button className={`bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer ${hasAnimated ? styles.featuresButton : 'opacity-0'}`}
              onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
            >
              {t('cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Features Section */}
      <section ref={mobileSectionRef} className="md:hidden py-12 bg-white">
        <div className="px-4">
          <h2 className={`text-[32px] font-bold text-[#000635] text-center mb-8 ${hasAnimated ? styles.featuresTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            {t('title')}
          </h2>
          <div className="flex flex-col gap-4 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className={`bg-[#000635] rounded-xl shadow-sm overflow-hidden p-6 ${hasAnimated ? styles.featuresCard : 'opacity-0'}`}>
                <div className="flex flex-col">
                  <div className="flex justify-center mb-4">
                    {feature.imageUrl ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src={feature.imageUrl}
                          alt={feature.title}
                          width={133}
                          height={133}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-600 rounded flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-400 rounded"></div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-base text-white leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={`text-base text-[#000635] text-center mb-6 ${hasAnimated ? styles.featuresBottomText : 'opacity-0'}`}>
            {t('bottomText')}
          </p>
          <div className="flex justify-center">
            <button className={`bg-[#ff0099] text-white px-6 py-3 rounded-full text-base font-bold w-full max-w-[244px] cursor-pointer ${hasAnimated ? styles.featuresButton : 'opacity-0'}`}
              onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
            >
              {t('cta')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

