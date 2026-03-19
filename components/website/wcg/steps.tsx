import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";
import router from "next/router";
import { useTranslations } from "next-intl";

const IMAGE_CONFIG = {
  phone: "/wcg/phone_14.png",
  steps: [
    "/wcg/wcg-open-account-step-by-step-screen-01.png",
    "/wcg/wcg-open-account-step-by-step-screen-02.png",
    "/wcg/wcg-open-account-step-by-step-screen-03.png",
  ],
};

const STEP_HEIGHT = {
  desktop: "600px",
  mobile: "300px",
};

export default function Steps() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const desktopSectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const t = useTranslations('steps');

  const handleStepChange = (step: number) => {
    if (step === activeStep) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveStep(step);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // 检测 section 是否进入视口，触发初始动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // 延迟设置 step 1 为激活状态，让动画效果更明显
            setTimeout(() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveStep(1);
                setTimeout(() => {
                  setIsTransitioning(false);
                }, 50);
              }, 300);
            }, 200);
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
      {/* Desktop Steps Section */}
      <section ref={desktopSectionRef} className="hidden md:block py-20 bg-[#000635]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-12 max-w-5xl mx-auto">
            {/* Phone Mockup - Left Side */}
            <div className={`flex-shrink-0 -ml-[100px] relative ${hasAnimated ? styles.stepsPhoneDesktop : 'opacity-0'}`}>
              <Image
                src={IMAGE_CONFIG.phone}
                alt="iphone"
                width={600}
                height={1000}
                className="object-contain"
                priority
              />
              {/* Screen Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-auto overflow-hidden rounded-[40px]"
                  style={{ height: STEP_HEIGHT.desktop }}
                >
                  <Image
                    key={activeStep}
                    src={IMAGE_CONFIG.steps[activeStep === 0 ? 0 : activeStep - 1]}
                    alt={`Step ${activeStep || 1} Screen`}
                    width={280}
                    height={600}
                    className={`object-cover w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                  />
                </div>
              </div>
            </div>

            {/* All Content - Right Side */}
            <div className={`w-[631px] flex-shrink-0 -ml-[150px] ${hasAnimated ? styles.stepsContent : 'opacity-0'}`}>
              {/* Title */}
              <h2 className={`text-[42px] font-bold mb-6 ${hasAnimated ? styles.stepsTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
                  {t('title')}
                </span>
              </h2>

              {/* Steps with connecting lines */}
              <div className="relative">
                {/* Step 01 - Active with pink circle */}
                <div className={`flex gap-6 items-start relative ${hasAnimated ? styles.stepsStep : 'opacity-0'}`}>
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-[50px] h-[50px] rounded-full flex items-center justify-center text-lg font-medium bg-[#000635] border-2 z-10 relative cursor-pointer ${activeStep === 1 ? 'border-[#ff0099] text-[#ff0099]' : 'border-white text-white'}`}
                      style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif' }}
                      onClick={() => handleStepChange(1)}
                    >
                      01
                    </div>
                    {/* Connecting line down from Step 01 */}
                    <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 w-[3px] h-[140px] bg-white"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                      {t('step1.title')}
                    </h3>
                    <p className="text-white text-base">
                      {t('step1.description')}
                    </p>
                  </div>
                </div>

                {/* Step 02 - White circle with black text */}
                <div className={`flex gap-6 items-start relative ${hasAnimated ? styles.stepsStep : 'opacity-0'}`}>
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-[50px] h-[50px] rounded-full flex items-center justify-center text-lg font-medium bg-[#000635] border-2 z-10 relative cursor-pointer ${activeStep === 2 ? 'border-[#ff0099] text-[#ff0099]' : 'border-white text-white'}`}
                      style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif' }}
                      onClick={() => handleStepChange(2)}
                    >
                      02
                    </div>
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                      {t('step2.title')}
                    </h3>
                    <p className="text-white text-base">
                      {t('step2.description')}
                    </p>
                  </div>
                </div>

                {/* Step 03 - White circle with black text */}
                <div className={`flex gap-6 items-start relative ${hasAnimated ? styles.stepsStep : 'opacity-0'}`}>
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-[50px] h-[50px] rounded-full flex items-center justify-center text-lg font-medium bg-[#000635] border-2 z-10 relative cursor-pointer ${activeStep === 3 ? 'border-[#ff0099] text-[#ff0099]' : 'border-white text-white'}`}
                      style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif' }}
                      onClick={() => handleStepChange(3)}
                    >
                      03
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                      {t('step3.title')}
                    </h3>
                    <p className="text-white text-base">
                      {t('step3.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="mt-12 flex justify-center">
                <button className={`bg-[#ff0099] text-white px-8 py-3 rounded-full text-lg font-bold cursor-pointer ${hasAnimated ? styles.stepsButton : 'opacity-0'}`}
                  onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
                >
                  {t('cta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Steps Section */}
      <section ref={mobileSectionRef} className="md:hidden py-12 bg-[#000635] relative">
        <div className="px-4">
          <h2 className={`text-[32px] font-bold text-center mb-6 ${hasAnimated ? styles.stepsTitle : 'opacity-0'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
            <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>

          {/* Horizontal Steps Indicator */}
          <div className={`flex items-center justify-center gap-0 mb-6 relative ${hasAnimated ? styles.stepsContent : 'opacity-0'}`}>
            {/* Step 01 - Active */}
            <div className="relative cursor-pointer" onClick={() => handleStepChange(1)}>
              <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-base font-medium bg-[#000635] border-2 z-10 relative ${activeStep === 1 ? 'border-[#ff0099] text-[#ff0099]' : 'border-white text-white'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif' }}>
                01
              </div>
            </div>

            {/* Connecting Line 1 */}
            <div className="h-[2px] w-[80px] bg-white relative">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/30"></div>
            </div>

            {/* Step 02 */}
            <div className="relative cursor-pointer" onClick={() => handleStepChange(2)}>
              <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-base font-medium bg-[#000635] border-2 z-10 relative ${activeStep === 2 ? 'border-[#ff0099] text-[#ff0099]' : 'border-white text-white'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif' }}>
                02
              </div>
            </div>

            {/* Connecting Line 2 */}
            <div className="h-[2px] w-[80px] bg-white relative">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/30"></div>
            </div>

            {/* Step 03 */}
            <div className="relative cursor-pointer" onClick={() => handleStepChange(3)}>
              <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-base font-medium bg-[#000635] border-2 z-10 relative ${activeStep === 3 ? 'border-[#ff0099] text-[#ff0099]' : 'border-white text-white'}`} style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif' }}>
                03
              </div>
            </div>
          </div>

          {/* Step Description - Dynamic based on activeStep */}
          <div className={`mb-6 ${hasAnimated ? styles.stepsStep : 'opacity-0'}`}>
            <div
              key={activeStep}
              className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              {activeStep === 1 && (
                <>
                  <h3 className="text-[18px] font-bold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                    <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
                      {t('step1.title')}
                    </span>
                  </h3>
                  <p className="text-white text-[16px] leading-relaxed" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                    {t('step1.description')}
                  </p>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <h3 className="text-[18px] font-bold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                    <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
                      {t('step2.title')}
                    </span>
                  </h3>
                  <p className="text-white text-[16px] leading-relaxed" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                    {t('step2.description')}
                  </p>
                </>
              )}
              {activeStep === 3 && (
                <>
                  <h3 className="text-[18px] font-bold mb-2" style={{ fontFamily: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif', fontWeight: 700 }}>
                    <span className="bg-gradient-to-r from-[#e4af71] via-[#ffd589] to-[#ffe8c7] bg-clip-text text-transparent">
                      {t('step3.title')}
                    </span>
                  </h3>
                  <p className="text-white text-[16px] leading-relaxed" style={{ fontFamily: 'var(--font-open-sans), var(--font-noto-sans-jp), sans-serif' }}>
                    {t('step3.description')}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Call-to-Action Button */}
          <div className="flex justify-center mb-8">
            <button className={`bg-[#ff0099] text-white px-8 py-3 rounded-full text-base font-bold w-full max-w-[192px] ${hasAnimated ? styles.stepsButton : 'opacity-0'}`}
              onClick={() => { router.push('https://clientportal.wcgmarkets-apac.in/register/trader?link_id=2f2dv6td&referrer_id=PLUS'); }}
            >
              {t('cta')}
            </button>
          </div>

          {/* Phone Image - positioned below */}
          <div className={`relative flex justify-center ${hasAnimated ? styles.stepsPhoneMobile : 'opacity-0'}`}>
            <div className="relative">
              <Image
                src={IMAGE_CONFIG.phone}
                alt="iphone"
                width={300}
                height={500}
                className="object-contain"
                priority
              />
              {/* Screen Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-auto overflow-hidden rounded-[20px]"
                  style={{ height: STEP_HEIGHT.mobile }}
                >
                  <Image
                    key={activeStep}
                    src={IMAGE_CONFIG.steps[activeStep === 0 ? 0 : activeStep - 1]}
                    alt={`Step ${activeStep || 1} Screen`}
                    width={140}
                    height={300}
                    className={`object-cover w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

