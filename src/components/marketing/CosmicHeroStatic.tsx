import Image from "next/image";

import "./cosmic-hero-static.css";

const REVELATION_TEXT = "Just In A Ray Of Light";

export default function CosmicHeroStatic() {
  return (
    <div data-cosmic-hero-static>
      <section className="hero" aria-label="143 Leadership hero">
        <div className="starfield" aria-hidden="true" />
        <div className="nebula" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />

        <div className="eclipse-stage" aria-hidden="true">
          <Image
            className="sunnova-svg"
            src="/marketing/143-sun-nova.png"
            alt=""
            width={420}
            height={420}
            priority
          />
          <Image
            className="sun-svg"
            src="/marketing/Sun-143.svg"
            alt=""
            width={420}
            height={420}
            priority
          />
          <Image
            className="moon"
            src="/marketing/Purple-Moon-143.svg"
            alt=""
            width={320}
            height={320}
            priority
          />
        </div>

        <div className="hero-copy">
          <p className="row-never-gone">Never Gone</p>
          <p className="row-eclipsed">It was eclipsed</p>
          <div className="row-final">
            <p className="row-learn">Learn How To Live</p>
            <p className="row-revelation">{REVELATION_TEXT}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

