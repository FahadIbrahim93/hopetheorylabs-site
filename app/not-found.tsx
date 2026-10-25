import Link from "next/link";
import { whatsappLink } from "@/content/types";

export default function NotFound() {
  return (
    <main className="miss">
      <p className="miss-kicker">404 / Not found</p>
      <h1>This page doesn&apos;t exist.</h1>
      <p>The rest of Hope Theory Labs is still here.</p>
      <div className="miss-actions">
        <Link className="cta" href="/">
          Go home
        </Link>
        <a className="lk" href={whatsappLink} target="_blank" rel="noopener noreferrer">
          Message us on WhatsApp
        </a>
      </div>
    </main>
  );
}
