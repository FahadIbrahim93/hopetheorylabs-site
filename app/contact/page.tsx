import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";

export default function ContactPage() {
  return (
    <LanguageProvider>
      <div className="site-shell">
        <Header />
        <main id="main" tabIndex={-1}>
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
