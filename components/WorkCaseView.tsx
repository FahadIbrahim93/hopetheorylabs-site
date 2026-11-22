import type { WorkCaseStudy } from "@/content/types";

function GamePreview({
  imageSrc,
  imageAlt,
  playHref,
  playLabel,
}: NonNullable<WorkCaseStudy["gamePreview"]>) {
  return (
    <div className="game-preview" role="group" aria-label={imageAlt}>
      <div className="game-preview-bezel">
        <img
          className="game-preview-shot"
          src={imageSrc}
          alt={imageAlt}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
        />
        <div className="game-preview-scan" aria-hidden="true" />
      </div>
      <a className="game-preview-cta" href={playHref} target="_blank" rel="noopener noreferrer">
        {playLabel} <span aria-hidden="true">›</span>
      </a>
    </div>
  );
}

function PhoneDemo({
  storeName,
  items,
  cta,
  message,
}: NonNullable<WorkCaseStudy["phoneDemo"]>) {
  return (
    <div
      className="phone-mockup"
      role="img"
      aria-label={`Illustrative phone mockup for ${storeName}: ${items.join(", ")}`}
    >
      <div className="phone-top">
        <span>09:41</span>
        <span>● ● ▰</span>
      </div>
      <div className="phone-store-name">
        {storeName} <span>SHOP</span>
      </div>
      {items.map((item) => (
        <div className="phone-product" key={item}>
          <span>{item}</span>
          <b>ADD</b>
        </div>
      ))}
      <div className="phone-order">{cta}</div>
      <div className="phone-message">{message}</div>
      <div className="phone-home" />
    </div>
  );
}

export function WorkCaseView({
  item,
  headingLevel,
  headingId,
  problemLabel,
  demonstratesLabel,
  pageHref,
  pageLabel,
}: {
  item: WorkCaseStudy;
  headingLevel: "h1" | "h3";
  headingId?: string;
  problemLabel: string;
  demonstratesLabel: string;
  pageHref?: string;
  pageLabel?: string;
}) {
  const Title = headingLevel;

  return (
    <div className="work-case">
      <div className="work-case-copy scene-copy">
        <div className="work-case-meta">
          <span className="tag">{item.tag}</span>
          <span className="work-case-discipline">{item.discipline}</span>
        </div>
        <Title className="work-case-title" id={headingId}>
          {pageHref ? (
            <a className="work-case-title-link" href={pageHref}>
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </Title>
        <p>{item.summary}</p>
        {item.problem && (
          <p className="work-case-fact">
            <span>{problemLabel}</span>
            {item.problem}
          </p>
        )}
        {item.demonstrates && (
          <p className="work-case-fact">
            <span>{demonstratesLabel}</span>
            {item.demonstrates}
          </p>
        )}
        <ul className="work-deliverables">
          {item.deliverables.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {(item.link || item.secondaryLink || (pageHref && pageLabel)) && (
          <p className="work-case-links">
            {item.link && (
              <a className="text-link" href={item.link.href} target="_blank" rel="noopener noreferrer">
                {item.link.label} <span aria-hidden="true">›</span>
              </a>
            )}
            {item.link && item.secondaryLink && (
              <span className="work-link-sep" aria-hidden="true">
                {" "}·{" "}
              </span>
            )}
            {item.secondaryLink && (
              <a
                className="text-link"
                href={item.secondaryLink.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.secondaryLink.label} <span aria-hidden="true">›</span>
              </a>
            )}
            {pageHref && pageLabel && (
              <>
                {(item.link || item.secondaryLink) && (
                  <span className="work-link-sep" aria-hidden="true">
                    {" "}·{" "}
                  </span>
                )}
                <a className="text-link" href={pageHref}>
                  {pageLabel} <span aria-hidden="true">›</span>
                </a>
              </>
            )}
          </p>
        )}
      </div>
      {item.gamePreview && <GamePreview {...item.gamePreview} />}
      {item.phoneDemo && <PhoneDemo {...item.phoneDemo} />}
    </div>
  );
}
