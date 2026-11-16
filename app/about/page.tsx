import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";

export default function AboutPage() {
  return (
    <LanguageProvider>
      <div className="site-shell standalone-route">
        <Header />
        <main id="main" tabIndex={-1}>
          <About headingLevel={1} />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
