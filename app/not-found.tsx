import Link from "next/link";
import { WhatsAppCta } from "@/components/WhatsAppCta";

/* Custom static-export 404 page. Keep the same editorial grid and brand tokens. */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 md:px-8">
        <Link href="/" className="w-fit font-heading text-lg tracking-[-0.03em] text-paper" aria-label="Hope Theory Labs — home">
          Hope Theory Labs<span className="text-teal">.</span>
        </Link>
        <div className="grid flex-1 grid-cols-12 items-center gap-8 py-16">
          <section className="col-span-12 md:col-span-8 md:col-start-3" aria-labelledby="not-found-title">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-teal">404 / NOT FOUND</p>
            <h1 id="not-found-title" className="mt-6 max-w-3xl font-heading text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
              This page doesn&apos;t exist. Let&apos;s get you back.
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/" className="inline-flex min-h-11 items-center rounded-md bg-teal px-5 py-3 text-sm font-semibold text-ink hover:opacity-90">Go home</Link>
              <WhatsAppCta href="https://wa.me/8801718463471">Talk to us on WhatsApp</WhatsAppCta>
            </div>
          </section>
        </div>
        <p className="border-t border-paper/10 pt-6 font-mono text-xs text-paper/50">Hope Theory Labs · Dhaka, Bangladesh</p>
      </div>
    </main>
  );
}
