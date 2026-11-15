import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";

export default function AboutPage() {
  return (
    <LanguageProvider>
      <div className="site-shell">
        <Header />
        <main id="main" tabIndex={-1}>
          <About />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
