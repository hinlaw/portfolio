export default function Footer() {
  return (
    <footer className="bg-[#000635] text-white py-20">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="mb-12">
          <h3 className="text-[48px] font-bold mb-8 bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            解鎖黃金價值以信心交易
          </h3>
          <div className="grid grid-cols-4 gap-8 mb-12">
            <div>
              <div className="w-[200px] h-[55px] bg-gray-600 mb-4"></div>
              <p className="text-base mb-4" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                Risk policy: All trades involve risks. Your trading loss may be greater than your total deposit.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-base" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>Follow us on:</span>
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>Company</h4>
              <ul className="space-y-2 text-base" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                <li>About WCG</li>
                <li>Market News</li>
                <li>Tools</li>
                <li>Learning Center</li>
                <li>Promotions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>Trading</h4>
              <ul className="space-y-2 text-base" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                <li>Meta Trader 5</li>
                <li>Day Day Trade</li>
                <li>Social Trade</li>
                <li>PAMM</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>Legal & Regulatory</h4>
              <ul className="space-y-2 text-base" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                <li>Privacy & Policy</li>
                <li>Terms & Condition</li>
                <li>Dispute Settlement</li>
                <li>Risk Claimer</li>
                <li>AML Policy</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-base font-bold mb-4" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>網站性質</h4>
              <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                本網站上的資訊屬於一般性質，並未考慮您的個人目標、財務狀況或需求。所有資訊不針對任何特定國家/地區的公眾，也無意非法或違反監管要求地分發給任何司法管轄區的居民。
              </p>
            </div>
            <div>
              <h4 className="text-base font-bold mb-4" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>營運實體</h4>
              <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                本網站 www.wcghk.com 是由 WCG MARKETS (HK) LIMITED 文傳金業有限公司 (商業名稱：文傳金業 / WCG HK) 營運的官方網站。WCG HK 於香港特別行政區註冊成立 (商業登記號碼：62653924) ，是香港金黃金交易所 (HKGX) 12號交易所參與者 (牌照號碼：MEC-2312006) ，及持有香港海關貴金屬及寶石業務A類註冊牌照 (註冊號碼：A-B-23-05-00171) 。
              </p>
            </div>
          </div>
          <div className="bg-[#0f1115] p-6 rounded-lg mb-8">
            <h4 className="text-base font-bold mb-4" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>風險警告</h4>
            <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
              場外式貴金屬交易由 WCG MARKETS (HK) LIMITED 文傳金業有限公司提供。場外式貴金屬交易涉及高度風險，未必適合所有投資者。高度的槓桿可為閣下帶來負面或正面的影響。場外式貴金屬交易並非受香港證券及期貨事務監察委員會「證監會」監管，因此買賣場外式貴金屬將不會受到證監會所頒布的規則或規例所約束，包括（但不限於）客戶款項規則。閣下在決定買賣場外式貴金屬之前應審慎考慮自己的投資目標、交易經驗以及風險接受程度。可能出現的情況包括蒙受部分或全部初始投資額的損失，或在極端情況下（例如相關市場跳空）產生更多的損失。因此，閣下不應將無法承受損失的資金用於投資。投資應知悉買賣場外式貴金屬有關的一切風險，如有需要，請向獨立財務顧問尋求意見。
            </p>
          </div>
          <div className="border-t border-white/20 pt-8">
            <p className="text-center text-base" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>© WCG All rights reserved, no reprint</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

