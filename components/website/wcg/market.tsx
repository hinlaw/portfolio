import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  chart: "/wcg/WCG - Chart-04.png",
};

export default function Market() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const desktopSectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const t = useTranslations('market');

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
      {/* Desktop Market Section */}
      <section ref={desktopSectionRef} className="hidden md:block py-20 bg-[#000635]">
        <div className="max-w-[1280px] mx-auto px-10">
          <h2 className={`text-[42px] font-bold text-center mb-12 ${hasAnimated ? styles.marketTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
              {t('title.part1')}
            </span>
            <span className="text-white">{t('title.part2')}</span>
          </h2>
          <div className={`max-w-[1080px] mx-auto h-[530px] rounded-lg relative overflow-hidden ${hasAnimated ? styles.marketChart : 'opacity-0'}`}>
            <Image
              src={IMAGE_CONFIG.chart}
              alt="Gold Price Chart"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Mobile Market Section */}
      <section ref={mobileSectionRef} className="md:hidden py-12 bg-[#000635]">
        <div className="px-4">
          <h2 className={`text-[32px] font-bold text-center mb-8 ${hasAnimated ? styles.marketTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
              {t('title.part1')}
            </span>
            <span className="text-white">{t('title.part2')}</span>
          </h2>
          <div className={`w-full mx-auto h-[300px] rounded-lg relative overflow-hidden ${hasAnimated ? styles.marketChart : 'opacity-0'}`}>
            <Image
              src={IMAGE_CONFIG.chart}
              alt="Gold Price Chart"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
}

