import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import OrientationDial from '@/components/home/OrientationDial';
import FeaturesShowcase from '@/components/home/FeaturesShowcase';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background selection:bg-amber-300 selection:text-black">
      <Navbar />
      <main className="flex-1 flex flex-col gap-16 sm:gap-24 pb-20">
        <Hero />
        <Stats />
        <OrientationDial />
        <FeaturesShowcase />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
