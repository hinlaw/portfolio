import router from "next/router";
import { useTranslations } from "next-intl";

export default function PlatformComparison() {
  const t = useTranslations('platformComparison');

  return (
    <>
      {/* Desktop View */}
      <section className="hidden md:block py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-10">
          <h2 className="text-[42px] font-bold text-[#000635] text-center mb-12" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            <span className="text-[#ff0099]">{t('title.part1')}</span>{t('title.part2')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-[144px_1fr_1fr] gap-4">
              {/* Left Label Card */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <div>
                  <div className="h-[72px] flex items-center px-8 border-b border-gray-200"></div>
                  <div className="h-[50px] flex items-center justify-center px-8 border-b border-gray-200">
                    <span className="text-sm font-semibold text-[#000635] text-center">{t('labels.positioning')}</span>
                  </div>
                  <div className="h-[112px] flex items-center justify-center px-8 border-b border-gray-200">
                    <span className="text-sm font-semibold text-[#000635] text-center">{t('labels.advantages')}</span>
                  </div>
                  <div className="h-[52px] flex items-center justify-center px-8">
                    <span className="text-sm font-semibold text-[#000635] text-center">{t('labels.targetAudience')}</span>
                  </div>
                </div>
              </div>

              {/* MT5 Card */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <div>
                  <div className="h-[72px] flex flex-col items-center justify-center gap-1 px-8 border-b border-gray-200">
                    <span className="bg-[#000635] text-white px-2 py-1 rounded text-[10px]">{t('mt5.badge')}</span>
                    <h3 className="text-[21px] font-bold text-[#000635] text-center" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('mt5.name')}</h3>
                  </div>
                  <div className="h-[50px] flex items-center justify-center px-8 border-b border-gray-200">
                    <p className="text-sm text-[#000635] text-center">{t('mt5.positioning')}</p>
                  </div>
                  <div className="h-[112px] flex items-center justify-center px-8 border-b border-gray-200">
                    <p className="text-sm text-[#000635] text-center">{t('mt5.advantages')}</p>
                  </div>
                  <div className="h-[52px] flex items-center justify-center px-8">
                    <p className="text-sm text-[#000635] text-center">{t('mt5.targetAudience')}</p>
                  </div>
                </div>
              </div>

              {/* WCG App Card */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-[#000635] text-white">
                <div>
                  <div className="h-[72px] flex flex-col items-center justify-center gap-1 px-8 border-b border-gray-200">
                    <span className="bg-[#ff0099] text-white px-2 py-1 rounded text-[10px]">{t('wcgApp.badge')}</span>
                    <h3 className="text-[21px] font-bold text-center" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('wcgApp.name')}</h3>
                  </div>
                  <div className="h-[50px] flex items-center justify-center px-8 border-b border-gray-200">
                    <p className="text-sm text-center">{t('wcgApp.positioning')}</p>
                  </div>
                  <div className="h-[112px] flex items-center justify-center px-3.5 border-b border-gray-200">
                    <ul className="text-sm list-disc list-inside text-start">
                      <li>{t('wcgApp.advantages.line1')}</li>
                      <li>{t('wcgApp.advantages.line2')}</li>
                      <li>{t('wcgApp.advantages.line3')}</li>
                      <li>{t('wcgApp.advantages.line4')}</li>
                    </ul>
                  </div>
                  <div className="h-[52px] flex items-center justify-center px-8">
                    <p className="text-sm text-center">{t('wcgApp.targetAudience')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons outside table */}
            <div className="grid grid-cols-[144px_1fr_1fr] gap-4 mt-[29.5px]">
              <div></div>
              <div className="flex justify-center">
                <button className="bg-[#ff0099] text-white px-12 py-3 rounded-full text-lg font-bold cursor-pointer"
                  onClick={() => { router.push('https://clientportal.wcgmarkets-zh.com/custom/z7hftv2n'); }}
                >
                  {t('mt5.cta')}
                </button>
              </div>
              <div className="flex justify-center">
                <button className="bg-[#ff0099] text-white px-12 py-3 rounded-full text-lg font-bold cursor-not-allowed"
                // onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                >
                  {t('wcgApp.cta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile View */}
      <section className="md:hidden py-12 bg-white">
        <div className="px-4">
          <h2 className="text-[32px] font-bold text-[#000635] text-center" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 700 }}>
            <span className="text-[#ff0099]">{t('title.part1')}</span>{t('title.part2')}
          </h2>

          {/* WCG App Card */}
          <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-[#000635] text-white mb-4">
            <div className="flex flex-col items-center gap-2 mb-4 pb-4 border-b border-gray-200 -mx-6 px-6">
              <span className="bg-[#ff0099] text-white px-2 py-1 rounded text-[10px]">{t('wcgApp.badge')}</span>
              <h3 className="text-[21px] font-bold" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('wcgApp.name')}</h3>
            </div>
            <div className="text-center">
              <div className="pb-4 border-b border-gray-200 -mx-6 px-6">
                <p className="text-sm">{t('wcgApp.positioning')}</p>
              </div>
              <div className="py-4 border-b border-gray-200 -mx-6 px-6">
                <ul className="text-sm list-disc list-inside text-start">
                  <li>{t('wcgApp.advantages.line1')}</li>
                  <li>{t('wcgApp.advantages.line2')}</li>
                  <li>{t('wcgApp.advantages.line3')}...</li>
                </ul>
              </div>
              <div className="py-4 -mx-6 px-6">
                <p className="text-sm">{t('wcgApp.targetAudience')}</p>
              </div>
              <div className="flex justify-center pt-4">
                <button className="bg-[#ff0099] text-white px-8 py-2 rounded-full text-[18px] font-bold w-[168px] cursor-not-allowed"
                // onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                >
                  {t('wcgApp.cta')}
                </button>
              </div>
            </div>
          </div>

          {/* MT5 Card */}
          <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
            <div className="flex flex-col items-center gap-2 mb-4 pb-4 border-b border-gray-200 -mx-6 px-6">
              <span className="bg-[#000635] text-white px-2 py-1 rounded text-[10px]">{t('mt5.badge')}</span>
              <h3 className="text-[21px] font-bold text-[#000635]" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{t('mt5.name')}</h3>
            </div>
            <div className="text-center">
              <div className="pb-4 border-b border-gray-200 -mx-6 px-6">
                <p className="text-sm text-[#000635]">{t('mt5.positioning')}</p>
              </div>
              <div className="py-4 border-b border-gray-200 -mx-6 px-6">
                <p className="text-sm text-[#000635]">{t('mt5.advantages')}</p>
              </div>
              <div className="py-4 -mx-6 px-6">
                <p className="text-sm text-[#000635]">{t('mt5.targetAudience')}</p>
              </div>
              <div className="flex justify-center pt-4">
                <button className="bg-[#ff0099] text-white px-8 py-2 rounded-full text-[18px] font-bold w-[168px] cursor-pointer"
                  onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                >
                  {t('mt5.cta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

