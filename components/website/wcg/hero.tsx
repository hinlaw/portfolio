import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import styles from "./landing-page.module.css";
import router from "next/router";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  banner: "/wcg/wcg-banner.jpg",
};

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <>
      {/* Desktop Hero Section */}
      <div className="h-[80px] md:h-[100px] bg-[#000635]"></div>
      <section className="hidden md:block relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={IMAGE_CONFIG.banner}
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#000635] to-70% to-transparent"></div>
        <div className="relative max-w-[1280px] mx-auto px-10 pt-[81px]">
          <div className="max-w-[726px]">
            <h1 className={`text-[60px] font-bold leading-[70px] tracking-[3px] ${styles.heroDesktopTitle}`}>
              <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                {t('headline.main')}
              </span>
              <br />
              <span className="text-white" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 500 }}>{t('headline.sub')}</span>
            </h1>
            <div className={`text-white text-base leading-6 py-6 ${styles.heroDesktopText}`} style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
              <p>— {t('subheadline.line1')}</p>
              {t('subheadline.line2') && <p>— {t('subheadline.line2')}</p>}
            </div>
            <div className={`flex gap-4 ${styles.heroDesktopButtons}`}>
              <button className="bg-[#ff0099] text-white px-12 py-3 rounded-full text-lg font-bold cursor-pointer"
                style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
              >
                {t('cta.openAccount')}
              </button>
              <button className="bg-white text-[#ff0099] px-8 py-3 rounded-full text-lg font-bold cursor-pointer"
                style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
              >
                {t('cta.upgradePlus')}
              </button>
            </div>
            <div className={`mt-[60px] flex items-center gap-8 text-white text-sm ${styles.heroDesktopBadges}`} style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-4" />
                <span>{t('badges.hkgx')}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-4" />
                <span>{t('badges.customs')}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-4" />
                <span>{t('badges.award')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Hero Section */}
      <section className="md:hidden relative h-[568px] overflow-hidden">
        <div className="absolute top-30 bottom-20 left-0 right-0">
          <Image
            src={IMAGE_CONFIG.banner}
            alt="Hero"
            fill
            className="object-cover object-[80%_center]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#000424] via-transparent to-[#000424] from-25% via-45% to-90%"></div>
        <div className="relative px-4 pt-[29px]">
          <div className="text-center">
            <h1 className={`text-[32px] font-bold leading-[38px] mb-4 ${styles.heroMobileTitle}`}>
              <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                {t('headline.main')}
              </span>
              <br />
              <span className="text-white" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 500 }}>{t('headline.sub')}</span>
            </h1>
            <div className={`text-white text-sm leading-5 space-y-2 mb-[118px] ${styles.heroMobileText}`} style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
              <p>— {t('subheadline.line1')}</p>
              {t('subheadline.line2') && <p>— {t('subheadline.line2')}</p>}
            </div>
            <div className={`flex flex-col gap-3 items-center ${styles.heroMobileButtons}`}>
              <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-base font-bold w-[200px] cursor-pointer" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
              >
                {t('cta.openAccount')}
              </button>
              <button className="bg-white text-[#ff0099] px-8 py-3 rounded-full text-base font-bold w-[200px] cursor-pointer" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
              >
                {t('cta.upgradePlus')}
              </button>
            </div>
          </div>
        </div>
        <div className={`relative px-4 mt-8 space-y-4 text-white text-xs ${styles.heroMobileBadges}`} style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-4 flex-shrink-0" />
            <span>{t('badges.hkgx')}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-4 flex-shrink-0" />
            <span>{t('badges.customs')}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-4 flex-shrink-0" />
            <span>{t('badges.award')}</span>
          </div>
        </div>
        <div className={`relative px-4 mt-6 text-center ${styles.heroMobileBottomText}`}>
          <p className="text-[#ff0099] text-[28px] font-bold mb-2">{t('mobile.breakRule')}</p>
          <p className="text-white text-base">
            {t('mobile.wholesale')}
            <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
              {t('mobile.tradeGold')}
            </span>
          </p>
        </div>
      </section>
    </>
  );
}

