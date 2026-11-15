import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/PricingSection";

export default function PricingPage() {
  return (
    <LanguageProvider>
      <div className="site-shell">
        <Header />
        <main id="main" tabIndex={-1}>
          <PricingSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
