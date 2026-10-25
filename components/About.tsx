import { useContent } from "./LanguageProvider";
export function About() {
  const content = useContent();
  return <section id="about" className="about-section border-b border-paper/10" aria-labelledby="about-heading">
    <div className="about-inner"><p className="eyebrow">{content.about.eyebrow}</p><h2 id="about-heading">{content.about.heading}</h2><p>{content.about.text}</p></div>
  </section>;
}
