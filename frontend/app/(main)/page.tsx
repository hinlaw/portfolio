import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import CategoriesSection from './components/CategoriesSection';
import ApiStatusSection from './components/ApiStatusSection';
import FooterSection from './components/FooterSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />
      <ApiStatusSection />
      <FooterSection />
    </div>
  );
}