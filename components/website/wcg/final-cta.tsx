import Image from "next/image";
import router from "next/router";
import { useTranslations } from "next-intl";

export default function FinalCTA() {
  const t = useTranslations('finalCta');

  return (
    <>
      {/* Desktop Final CTA Section */}
      <section className="hidden md:block py-20 bg-[#000635] relative">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-b from-[#000635] to-black"></div>
          <Image src="/wcg/WCG-PLUS-account-banner-03.jpg"
            alt="Final CTA Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-30 text-start">
          <h2 className="text-[42px] font-bold mb-4" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <p className="text-white font-semibold text-2xl mb-8" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
            {t('subtitle.part1')}<span className="text-[#ff0099]">{t('subtitle.part2')}</span>{t('subtitle.part3')}<span className="text-[#ff0099]">{t('subtitle.part4')}</span>{t('subtitle.part5')}
          </p>
          <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer"
            onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
          >
            {t('cta')}
          </button>
        </div>
      </section>

      {/* Mobile Final CTA Section */}
      <section className="md:hidden py-10 bg-[#000635] relative">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-b from-[#000635] to-black"></div>
          <Image src="/wcg/WCG-PLUS-account-banner-03.jpg"
            alt="Final CTA Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 text-center">
          <h2 className="text-[32px] font-bold mb-4" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <p className="text-white font-semibold text-[16px] mb-8" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
            {t('subtitle.part1')}<span className="text-[#ff0099]">{t('subtitle.part2')}</span>{t('subtitle.part3')}<span className="text-[#ff0099]">{t('subtitle.part4')}</span>{t('subtitle.part5')}
          </p>
          <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer"
            onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
          >
            {t('cta')}
          </button>
        </div>
      </section>
    </>
  );
}

