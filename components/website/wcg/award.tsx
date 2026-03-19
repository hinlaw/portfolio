import Image from "next/image";
import router from "next/router";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  award: "/wcg/WCG-Best-Award-01.svg",
};

export default function Award() {
  const t = useTranslations('award');

  return (
    <>
      {/* Desktop Award Section */}
      <section className="hidden md:block py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-30">
          <div className="flex items-center gap-4">
            <div className="w-[400px] h-[400px] rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src={IMAGE_CONFIG.award}
                alt="WCG Best Award"
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <span className="inline-block bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] text-[#000635] px-4 py-2 rounded-lg text-lg font-bold mb-4">
                {t('badge')}
              </span>
              <h2 className="text-[32px] font-bold text-[#000635] mb-4" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                {t('title')}
              </h2>
              <p className="text-base text-gray-600 mb-8 leading-relaxed w-[574px]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                {t('description')}
              </p>
              <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer"
                onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
              >
                {t('cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Award Section */}
      <section className="md:hidden bg-white">
        <div className="px-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] text-[#000635] px-4 py-2 rounded-lg text-[18px] font-bold mb-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              {t('badge')}
            </span>
            <h2 className="text-[32px] font-bold text-[#000635] mb-4" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
              {t('title')}
            </h2>
          </div>
          <div className="w-full h-[288px] rounded-lg flex items-center justify-center mb-6 overflow-hidden">
            <Image
              src={IMAGE_CONFIG.award}
              alt="WCG Best Award"
              width={400}
              height={288}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mb-6">
            <p className="text-[16px] text-gray-600 leading-relaxed text-justify" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              {t('description')}
            </p>
          </div>
          <div className="text-center">
            <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-base font-bold">
              {t('cta')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

