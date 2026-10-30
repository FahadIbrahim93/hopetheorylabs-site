import { HomeMotion } from "@/components/home/HomeMotion";
import { en } from "@/content/en";
import { whatsappLink, whatsappOrderLink } from "@/content/types";

const ticker = [...en.footer.ticker, ...en.footer.ticker];
const [headlineLead, headlineAccent] = en.hero.heading.split(" / ");

export default function Home() {
  return (
    <div className="lock">
      <HomeMotion />
      <button className="skip" id="sk" type="button">
        {en.header.skip}
      </button>
      <canvas id="c" aria-hidden="true" />
      <header>
        <span className="brand">{en.header.wordmark}</span>
        <nav aria-label="Primary">
          {en.header.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-go={item.href.slice(1)}
              className={item.href === "#contact" ? "out" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <div className="hud" aria-hidden="true">
        State
        <br />
        <b id="hs">Scattered</b>
        <div className="bar">
          <i id="hb" />
        </div>
      </div>
      <main id="main" tabIndex={-1}>
        <section id="top" className="vis">
          <div className="in" style={{ maxWidth: 900 }}>
            <p className="eyebrow">{en.hero.eyebrow}</p>
            <h1 style={{ fontSize: "clamp(38px, 5vw, 72px)" }}>
              <span>
                <i>{headlineLead}</i>
              </span>
              <span>
                <i>{headlineAccent}</i>
              </span>
            </h1>
            <p style={{ maxWidth: 520 }}>{en.hero.subheading}</p>
            <div className="ct" style={{ marginTop: 34 }}>
              <a className="cta" style={{ margin: 0 }} href={whatsappOrderLink} target="_blank" rel="noopener noreferrer">
                {en.hero.primaryCta}
              </a>
              <a className="lm" style={{ margin: 0 }} href="#method" data-go="method">
                {en.hero.secondaryCta} ›
              </a>
            </div>
          </div>
        </section>

        <section id="method">
          <div className="in">
            <p className="eyebrow">{en.story.methodEyebrow}</p>
            <h2>{en.story.methodHeading}</h2>
            <p>{en.story.methodText}</p>
          </div>
        </section>

        <section id="shift">
          <div className="in">
            <p className="eyebrow">{en.story.shiftEyebrow}</p>
            <h2>{en.story.shiftHeading}</h2>
            <p>{en.story.shiftText}</p>
            <a className="lm" href="#services" data-go="services">
              {en.story.shiftCta} ›
            </a>
          </div>
        </section>

        <section className="fl" id="flow">
          <div className="in">
            <p className="eyebrow">{en.story.flowEyebrow}</p>
            <h2>{en.story.flowHeading}</h2>
          </div>
          <div className="pil">
            {en.story.flowItems.map((item) => (
              <div key={item.title}>
                <b>{item.title}</b>
                {item.text}
              </div>
            ))}
          </div>
        </section>

        <section id="how">
          <div className="in" style={{ maxWidth: 1000 }}>
            <p className="eyebrow">{en.howItWorks.eyebrow}</p>
            <h2>{en.howItWorks.heading}</h2>
            <div className="stp" role="group" aria-label={en.howItWorks.heading}>
              {en.howItWorks.steps.map((step, index) => (
                <button
                  type="button"
                  key={step.label}
                  data-i={index}
                  data-text={step.description}
                  aria-current={index === 0 ? "true" : undefined}
                >
                  <b>0{index + 1}</b>
                  {step.label}
                </button>
              ))}
            </div>
            <p className="stx" id="stx" aria-live="polite">
              {en.howItWorks.steps[0]?.description}
            </p>
          </div>
        </section>

        <section id="services">
          <div className="in" style={{ maxWidth: 900 }}>
            <p className="eyebrow">{en.services.eyebrow}</p>
            <h2>{en.services.heading}</h2>
            <div className="cols">
              {en.services.items.map((item, index) => (
                <div key={item.title}>
                  <b>{item.title}</b>
                  <span>
                    {item.description}
                    {index === 2 ? <em className="tag">{en.services.earlyAccessTag}</em> : null}
                  </span>
                </div>
              ))}
            </div>
            <div className="pk" id="pricing">
              <p className="eyebrow">{en.pricing.eyebrow}</p>
              <h3 className="pk-h">{en.pricing.heading}</h3>
              <p className="pk-b">{en.pricing.base}</p>
              <ul className="pk-l">
                {en.pricing.tiers.map((tier, index) => (
                  <li key={tier.name}>
                    <span className="pk-i" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pk-n">{tier.name}</span>
                    <span className="pk-p">{tier.price}</span>
                  </li>
                ))}
              </ul>
              <p className="pk-t">{en.pricing.terms}</p>
            </div>
            <p style={{ maxWidth: 640 }}>{en.services.founding}</p>
            <div className="ct" style={{ marginTop: 8 }}>
              <a className="lm" style={{ margin: 0 }} href={whatsappOrderLink} target="_blank" rel="noopener noreferrer">
                {en.pricing.cta} ›
              </a>
            </div>
          </div>
        </section>

        <section id="work">
          <div className="in">
            <p className="eyebrow">{en.work.eyebrow}</p>
            <h2>{en.work.heading}</h2>
            <p>{en.work.description}</p>
            <span className="tag">{en.work.tag}</span>
            <p>
              <a className="lk" href={en.work.link} target="_blank" rel="noopener noreferrer">
                {en.work.linkLabel} ›
              </a>
            </p>
          </div>
          <div className="ph" role="img" aria-label="Illustrative phone mockup: a customer adds an item and orders on WhatsApp">
            {en.work.phoneItems.map((item) => (
              <div className="pr" key={item}>
                {item}
                <s>ADD</s>
              </div>
            ))}
            <div className="cr">{en.work.phoneCta}</div>
            <div className="bb">{en.work.phoneMessage}</div>
          </div>
        </section>

        <section id="about">
          <div className="in">
            <p className="eyebrow">{en.about.eyebrow}</p>
            <h2>{en.about.heading}</h2>
            <p>{en.about.text}</p>
          </div>
        </section>

        <section id="contact">
          <div className="in">
            <p className="eyebrow">{en.contact.eyebrow}</p>
            <h2>{en.contact.heading}</h2>
            <p>{en.contact.note}</p>
            <form className="fm" id="fm">
              <label>
                {en.contact.nameLabel}
                <input id="fn" name="name" autoComplete="name" />
              </label>
              <label>
                {en.contact.needLabel}
                <textarea id="ft" name="need" />
              </label>
              <button className="cta" style={{ margin: 0 }} type="submit">
                {en.contact.submit}
              </button>
            </form>
            <div className="ct" style={{ marginTop: 28 }}>
              <a className="cta" style={{ margin: 0 }} href={whatsappOrderLink} target="_blank" rel="noopener noreferrer">
                {en.contact.whatsappCta}
              </a>
              <a className="lk" href={"mailto:" + en.contact.email}>
                {en.contact.email}
              </a>
            </div>
            <p style={{ fontSize: 16, marginTop: 18 }}>{en.contact.phone}</p>
          </div>
          <div className="mq" aria-hidden="true">
            <div className="tr">
              {ticker.map((item, index) => (
                <span key={item + index}>{item}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer>{en.footer.text}</footer>
      <a className="wa" id="wa" href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label={en.hero.primaryCta}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.7-5.2A8.5 8.5 0 1 1 21 12z" />
        </svg>
      </a>
      <div id="nds" aria-hidden="true">
        <div className="nd" data-side="label" style={{ ["--c" as string]: "#FF9A3C" }}>
          Productivity<i />
        </div>
        <div className="nd" data-side="label" style={{ ["--c" as string]: "#4F8CFF" }}>
          CRM<i />
        </div>
        <div className="nd" data-side="label" style={{ ["--c" as string]: "#B07CFF" }}>
          Databases<i />
        </div>
        <div className="nd" data-side="label" style={{ ["--c" as string]: "#44D6A0" }}>
          Files<i />
        </div>
        <div className="nd" data-side="mark" style={{ ["--c" as string]: "#FFB347" }}>
          <i />
          Apps
        </div>
        <div className="nd" data-side="mark" style={{ ["--c" as string]: "#4FB8FF" }}>
          <i />
          APIs
        </div>
        <div className="nd" data-side="mark" style={{ ["--c" as string]: "#C48CFF" }}>
          <i />
          Systems
        </div>
        <div className="nd" data-side="mark" style={{ ["--c" as string]: "#5EE6B0" }}>
          <i />
          People
        </div>
        <div className="mono" id="mn">
          H
        </div>
      </div>
    </div>
  );
}
