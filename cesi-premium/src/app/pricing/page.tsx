import Navbar from '@/components/Navbar';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

export default function PricingPage() {
    return (
        <main className="min-h-screen pt-20">
            <Navbar />
            <Pricing />
            <Footer />
        </main>
    );
}
