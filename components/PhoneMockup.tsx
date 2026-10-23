/*
  Fixed-size decorative placeholder for the WhatsApp order-flow demo.
  Step 5 replaces the skeleton bars with the real HTML/CSS loop.
  Fixed dimensions per breakpoint so the page has zero layout shift (CLS < 0.1).
  Decorative: aria-hidden (the visible hero carries an sr-only description).
*/
export function PhoneMockup() {
  return (
    <div
      aria-hidden="true"
      className="h-[560px] w-[280px] rounded-[2.25rem] border border-paper/15 bg-paper/5 md:h-[600px] md:w-[300px]"
    >
      <div className="flex h-full flex-col p-4">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-paper/20" />
        <div className="mt-6 space-y-3">
          <div className="h-8 w-40 rounded-md bg-paper/10" />
          <div className="h-2 w-52 self-end rounded-full bg-paper/10" />
          <div className="h-2 w-44 self-end rounded-full bg-paper/10" />
        </div>
        <div className="mt-auto space-y-3 border-t border-paper/10 pt-4">
          <div className="h-2 w-32 rounded-full bg-paper/10" />
          <div className="h-10 w-full rounded-md bg-teal/25" />
        </div>
      </div>
    </div>
  );
}
