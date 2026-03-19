import Image from "next/image";
import { useRouter } from "next/router";

// Navigation links configuration - update URLs here when ready
const navigationLinks = {
  about: "https://www.wcghk.com/zh/home/", // 關於WCG
  trading: "https://www.wcghk.com/zh/home/", // 交易
  marketInfo: "https://www.wcghk.com/zh/home/", // 市場資訊
  pressRelease: "https://www.wcghk.com/zh/home/", // 新聞稿
};

export default function Header() {
  const router = useRouter();

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-[100px]">
        <div className="max-w-[1280px] mx-auto px-10 py-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-18">
            <div className="w-[94px] h-[45px] ">
              <Image src="/wcg/WCG-LOGO-01.svg" alt="WCG Logo" width={94} height={45} />
            </div>
            <nav className="flex items-center gap-6">
              <a href={navigationLinks.about} className="text-[#ff0099] text-base font-semibold" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>關於WCG</a>
              <a href={navigationLinks.trading} className="text-[#000635] text-base font-semibold flex items-center gap-1" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                交易
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a href={navigationLinks.marketInfo} className="text-[#000635] text-base font-semibold" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>市場資訊</a>
              <a href={navigationLinks.pressRelease} className="text-[#000635] text-base font-semibold" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>新聞稿</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#ff0099] text-white px-8 py-3 rounded-full text-sm font-bold cursor-pointer" style={{ fontFamily: 'var(--font-lato), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
              onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
            >
              立即註冊
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-[48px]">
        <div className="px-5 py-3 flex items-center justify-between">
          <button className="w-8 h-8 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-[66px] h-[32px] ">
            <Image src="/wcg/WCG-LOGO-01.svg" alt="WCG Logo" width={66} height={32} />
          </div>
          <button className="bg-[#ff0099] text-white px-4 py-2 rounded-full text-xs font-bold cursor-pointer" style={{ fontFamily: 'var(--font-lato), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}
            onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
          >
            立即註冊
          </button>
        </div>
      </header>
    </>
  );
}

