import { useContent } from "./LanguageProvider";
export function Footer() {
  const content = useContent();
  return <footer className="site-footer"><p>{content.footer.text}</p><span>HTL / END OF TRANSMISSION</span></footer>;
}
