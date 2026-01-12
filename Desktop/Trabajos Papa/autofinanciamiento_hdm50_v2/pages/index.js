import NavigationBar from '../components/NavigationBar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import PaymentSection from '../components/PaymentSection';
import Footer from '../components/Footer';
import AutoSlider from '../components/AutoSlider';

export default function Home() {
  return (
    <div>
      <NavigationBar />
      <HeroSection />
      <AutoSlider />  {/* ✅ Aquí se integra el slider sin perder lo demás */}
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <PaymentSection />
      <Footer />
    </div>
  );
}
