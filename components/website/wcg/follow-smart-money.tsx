import Image from "next/image";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  bloomberg: "/wcg/bloomberg-square.png",
  reuters: "/wcg/Reuters-logo.jpg",
  ufAwards: "/wcg/UFAwards-logo.jpeg",
};

export default function FollowSmartMoney() {
  const t = useTranslations('followSmartMoney');

  const items = [
    {
      source: t('items.bloomberg.source'),
      quote: t('items.bloomberg.quote'),
      quoteZh: t('items.bloomberg.quoteZh'),
      imageUrl: IMAGE_CONFIG.bloomberg
    },
    {
      source: t('items.reuters.source'),
      quote: t('items.reuters.quote'),
      quoteZh: t('items.reuters.quoteZh'),
      imageUrl: IMAGE_CONFIG.reuters
    },
    {
      source: t('items.ufAwards.source'),
      quote: t('items.ufAwards.quote'),
      quoteZh: '',
      imageUrl: IMAGE_CONFIG.ufAwards
    }
  ];

  return (
    <>
      {/* Desktop View */}
      <section className="hidden md:block py-20 bg-[#000635]">
        <div className="max-w-[1280px] mx-auto px-10">
          <h2 className="text-[42px] font-bold text-white text-center mb-6" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            {t('title')}
          </h2>
          <div className="grid grid-cols-[279px_279px_279px] gap-6 mx-auto justify-center">
            {items.map((item, idx) => (
              <div key={idx} className="text-center">
                {item.imageUrl ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden mx-auto mb-4 flex items-center justify-center bg-gray-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.source}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover bg-black"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-600 rounded-lg mx-auto mb-4"></div>
                )}
                <h4 className="text-[#ff0099] text-base font-semibold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 600 }}>{item.source}</h4>
                <p className="text-white text-base">
                  {item.quote}
                  {item.quoteZh && <><br />{item.quoteZh}</>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile View */}
      <section className="md:hidden py-10 bg-[#000635]">
        <div className="px-4">
          <h2 className="text-[32px] font-bold text-white text-center mb-6" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            {t('title')}
          </h2>
          <div className="text-center">
            {items[1].imageUrl ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden mx-auto mb-4 flex items-center justify-center bg-gray-100">
                <Image
                  src={items[1].imageUrl}
                  alt={items[1].source}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-600 rounded-lg mx-auto mb-4"></div>
            )}
            <h4 className="text-[#ff0099] text-base font-semibold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 600 }}>{items[1].source}</h4>
            <p className="text-white text-base">
              {items[1].quote}
              {items[1].quoteZh && <><br />{items[1].quoteZh}</>}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

