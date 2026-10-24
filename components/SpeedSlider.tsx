import { useContent } from "./LanguageProvider";

/*
  Before/after loading comparison. Step 2 ships the static placeholder;
  Step 5 makes it draggable + keyboard operable (range input). Decorative
  skeletons are aria-hidden; the only visible text is the required
  "Illustrative only" label from the content files — no numbers, ever.
*/
export function SpeedSlider() {
  const content = useContent();
  return (
    <div className="mt-16 border-t border-paper/10 pt-16">
      <div className="mt-8 grid gap-10 md:grid-cols-2" aria-hidden="true">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">
            {content.speedSlider.before}
          </p>
          <div className="mt-4 space-y-3">
            {[
              "w-2/3",
              "w-full",
              "w-5/6",
              "w-full",
              "w-1/2",
              "w-3/4",
              "w-full",
              "w-2/3",
              "w-5/6",
              "w-1/2",
            ].map((width, i) => (
              <div key={i} className={`h-2 rounded-full bg-paper/10 ${width}`} />
            ))}
          </div>
        </div>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-5 top-0 hidden h-full w-px bg-teal/40 md:block"
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            {content.speedSlider.after}
          </p>
          <div className="mt-4 space-y-3">
            <div className="h-6 w-1/2 rounded-md bg-teal/25" />
            <div className="h-2 w-full rounded-full bg-paper/15" />
            <div className="h-2 w-5/6 rounded-full bg-paper/15" />
            <div className="h-10 w-36 rounded-md bg-teal/70" />
          </div>
        </div>
      </div>
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
        {content.speedSlider.label}
      </p>
    </div>
  );
}
