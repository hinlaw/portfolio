import Image from "next/image";
import router from "next/router";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  bloomberg: "/wcg/bloomberg-circle.png",
  hk01: "/wcg/HK01logo.jpg",
  vanEck: "/wcg/VanEck-logo.jpeg",
};

export default function MarketUrgency() {
  const t = useTranslations('marketUrgency');

  const newsItems = [
    {
      title: t('news.item1.title'),
      desc: t('news.item1.desc'),
      source: t('news.item1.source'),
      imageUrl: IMAGE_CONFIG.bloomberg,
      url: 'https://www.bloomberg.com/news/articles/2025-11-17/china-raised-gold-reserves-by-15-tons-in-september-goldman-says?embedded-checkout=true' // TODO: Add URL for Bloomberg news
    },
    {
      title: t('news.item2.title'),
      desc: t('news.item2.desc'),
      source: t('news.item2.source'),
      imageUrl: IMAGE_CONFIG.hk01,
      url: 'https://www.hk01.com/%E8%B2%A1%E7%B6%93%E5%BF%AB%E8%A8%8A/60293206/%E6%91%A9%E9%80%9A%E7%A7%81%E4%BA%BA%E9%8A%80%E8%A1%8C-%E5%88%B02026%E5%B9%B4%E5%BA%95-%E9%87%91%E5%83%B9%E5%8F%AF%E8%83%BD%E9%81%94%E5%88%B05200%E8%87%B35300%E7%BE%8E%E5%85%83' // TODO: Add URL for HK01 news
    },
    {
      title: t('news.item3.title'),
      desc: t('news.item3.desc'),
      source: t('news.item3.source'),
      imageUrl: IMAGE_CONFIG.vanEck,
      url: 'https://www.vaneck.com/us/en/blogs/gold-investing/gold-in-a-storm-how-gold-holds-up-during-market-crises/' // TODO: Add URL for VanEck news
    }
  ];

  const handleNewsClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* Desktop Market Urgency Section */}
      <section className="hidden md:block py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-10">
          <div className="text-center mb-12">
            <h2 className="text-[42px] font-bold mb-4" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
              <span className="text-[#ff0099]">{t('title.part1')}</span>
              <span className="text-[#000635]">{t('title.part2')}</span>
            </h2>
            <p className="text-[21px] text-gray-600">
              {t('subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-12 items-start">
            {newsItems.map((news, idx) => (
              <div
                key={idx}
                className={`bg-white border border-gray-200 rounded-xl p-8 shadow-sm transition-all duration-200 ${news.url ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}`}
                style={{ fontFamily: 'var(--font-noto-sans-tc), sans-serif' }}
                onClick={() => handleNewsClick(news.url)}
              >
                <h3 className="text-[21px] font-bold text-[#000635] mb-4" style={{ fontFamily: ' var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{news.title}</h3>
                <p className="text-sm text-[#000635] mb-6">{news.desc}</p>
                <div className="flex items-center gap-4">
                  {news.imageUrl ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gray-100">
                      <Image
                        src={news.imageUrl}
                        alt={news.source}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  )}
                  <span className="text-base text-gray-600">{news.source}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-[21px] text-gray-600 mb-8">
              {t('bottomText')}
            </p>
            <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer"
              onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
            >
              {t('cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Market Urgency Section */}
      <section className="md:hidden py-12 bg-white">
        <div className="px-4">
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-bold mb-3" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
              <span className="text-[#ff0099]">{t('title.part1')}</span>
              <span className="text-[#000635]">{t('title.part2')}</span>
            </h2>
            <p className="text-base text-gray-600">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-4 mb-8">
            {newsItems.map((news, idx) => (
              <div
                key={idx}
                className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all duration-200 ${news.url ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}`}
                style={{ fontFamily: 'var(--font-noto-sans-tc), sans-serif' }}
                onClick={() => handleNewsClick(news.url)}
              >
                <h3 className="text-lg font-bold text-[#000635] mb-3" style={{ fontFamily: ' var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>{news.title}</h3>
                <p className="text-sm text-[#000635] mb-4 leading-relaxed">{news.desc}</p>
                <div className="flex items-center gap-3">
                  {news.imageUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gray-100">
                      <Image
                        src={news.imageUrl}
                        alt={news.source}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                  )}
                  <span className="text-sm text-gray-600">{news.source}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              {t('bottomText')}
            </p>
            <button className="bg-[#ff0099] text-white px-6 py-3 rounded-full text-base font-bold w-full max-w-[244px] cursor-pointer"
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

