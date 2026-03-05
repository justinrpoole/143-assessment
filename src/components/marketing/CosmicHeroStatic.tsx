import Image from "next/image";
import Link from "next/link";

import "./cosmic-hero-static.css";

export default function CosmicHeroStatic() {
  return (
    <div data-cosmic-hero-static>
      <section className="hero" aria-label="143 Leadership hero">
        <div className="starfield" aria-hidden="true" />
        <div className="nebula" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />

        <div className="hero-content content-wrap--wide">
          <div className="hero-copy">
            <div className="hero-clockline" aria-label="143 digital clock inspiration">
              <span className="hero-digital-clock">1:43</span>
              <span className="hero-clock-caption">THE I LOVE CHALLENGE</span>
            </div>
            <h1 className="hero-h1">
              <span className="hero-hl-yellow">YOUR LIGHT WAS NEVER GONE.</span>
              <span className="hero-hl-purple">IT WAS ONLY ECLIPSED.</span>
            </h1>

            <p className="hero-subheadline">
              143 means I love you. The I Love Challenge teaches self-love by helping you retrain your
              attention filter and prove your signal can shift in real life.
            </p>

            <div className="hero-cta-row">
              <Link href="/challenge" className="cta">
                Start The 143 Challenge
              </Link>
              <p className="pill pill--yellow" data-tone="yellow">
                <span className="dot" /> FREE • 3 DAYS • SELF-DIRECTED PROOF
              </p>
            </div>

            <p className="hero-social-proof">
              10,000+ leaders who saw 143 everywhere and recognized their filter
            </p>

            <Link href="/assessment" className="hero-secondary-link">
              Or skip to the full assessment
            </Link>
          </div>

          <div className="hero-visual-wrap">
            <div className="eclipse-stage" aria-hidden="true">
              <Image
                className="hero-square-logo"
                src="/images/143-square-logo.svg"
                alt=""
                width={420}
                height={420}
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
