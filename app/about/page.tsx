import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark, Lockup } from "@/components/brand/logo";
import { PostCard } from "@/components/blog/post-card";
import { Magnetic, Tilt, VelocityMarquee } from "@/components/motion/interactions";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { BrandCore } from "@/components/three/brand-core";
import { posts } from "@/lib/blog";
import { company, products } from "@/lib/product-family";
import "../pages.css";

export const metadata: Metadata = {
  title: "About — Tetheric Systems",
  description: "Tetheric Systems Private Limited is the Indian company behind SeerFlow and Auctra: software for clearer decisions and more expressive brands.",
};

const panels = [
  { tone: "seer", index: "01", status: "LIVE PRODUCT", name: "SeerFlow", title: "See the business behind the order.", text: products.seerflow.description, chips: ["Orders", "Payouts", "Costs", "Returns"], href: products.seerflow.record, external: products.seerflow.url, cta: "Read the product record" },
  { tone: "foundry", index: "02", status: "PRIVATE PILOT", name: "Auctra", title: "Make what matters.", text: products.foundry.description, chips: ["Research", "Copy", "Images", "Video drafts"], href: products.foundry.record, external: products.foundry.url, cta: "Read the pilot record" },
  { tone: "bridge", index: "03", status: "PILOT IMPLEMENTATION", name: "The bridge", title: "Context that flows both ways.", text: "A brand-specific grant and a manual snapshot bridge connect the two products in the private pilot. Live data transfer remains a separate step, and brands are not connected by default.", chips: ["Grant", "Snapshot", "Review"], href: "/records/auctra#bridge", cta: "Inspect the bridge boundary" },
  { tone: "horizon", index: "04", status: "DIRECTION", name: "The horizon", title: "AI, automation, robotics.", text: "The territory in our name. We add to this list only when there is something real to show, and we label direction as direction.", chips: ["AI", "Automation", "Robotics"], href: "/philosophy", cta: "Read our philosophy" },
];

const principles = [
  { title: "Connect the context.", text: "A settlement means more beside an order. A creative idea means more beside its brand." },
  { title: "Make the work visible.", text: "Show the source, the draft and the gap. An estimate stays an estimate." },
  { title: "Keep people in control.", text: "Access, data availability and approval stay explicit. The final call stays yours." },
];

export default function AboutPage() {
  return (
    <div className="page page--about">
      <SiteHeader current="/about" theme="dark" />
      <main id="main">
        <section className="page-hero page-hero--core" data-theme="dark" data-core-host>
          <BrandCore className="page-hero__core" anchor="center" />
          <div className="page-hero__veil" aria-hidden="true" />
          <div className="page-hero__content site-wrap">
            <p className="site-kicker" data-scramble-in>ABOUT TETHERIC SYSTEMS</p>
            <h1 data-split>One company.<br /><em>Connected by design.</em></h1>
            <p className="page-hero__lead" data-reveal>We build software that makes complex work clearer and meaningful work easier to create—starting with SeerFlow and Auctra.</p>
            <div className="page-hero__meta" data-reveal="stagger"><span>{company.legalName}</span><span>India</span><span>AI · Automation · Robotics</span></div>
          </div>
          <span className="page-hero__scroll" aria-hidden="true">Scroll <b>↓</b></span>
        </section>

        <section className="about-idea site-wrap" data-theme="light">
          <p className="site-kicker" data-scramble-in>THE IDEA</p>
          <p className="about-idea__text" data-fill>A tether is a line that keeps two things connected without making them the same. That is the idea we build around: software that connects how a business understands itself with how it expresses itself—and keeps a person in control of both.</p>
        </section>

        <section className="about-numbers site-wrap" aria-label="The company in numbers">
          <div data-reveal><strong data-count="2">02</strong><span>Products in the family</span></div>
          <div data-reveal><strong data-count="1">01</strong><span>Live product: SeerFlow</span></div>
          <div data-reveal><strong data-count="1">01</strong><span>Private pilot: Auctra</span></div>
          <div data-reveal><strong data-count="3">03</strong><span>Disciplines in our name</span></div>
        </section>

        <section className="about-build" data-theme="dark" data-horizontal aria-label="What we build">
          <div className="about-build__track" data-horizontal-track>
            <div className="about-build__intro">
              <p className="site-kicker">WHAT WE BUILD</p>
              <h2 data-split>Two products.<br /><em>One direction.</em></h2>
              <p>Keep scrolling. The family moves sideways.</p>
              <span className="about-build__arrow" aria-hidden="true">→</span>
            </div>
            {panels.map((panel) => (
              <Tilt key={panel.name} className="about-panel-tilt" max={5}>
                <article className={`about-panel about-panel--${panel.tone}`}>
                  <div className="about-panel__top"><span>{panel.index}</span><em>{panel.status}</em></div>
                  <h3>{panel.name}</h3>
                  <strong>{panel.title}</strong>
                  <p>{panel.text}</p>
                  <div className="about-panel__chips">{panel.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
                  <div className="about-panel__links">
                    <Link href={panel.href} data-cursor="Open">{panel.cta} <b aria-hidden="true">↗</b></Link>
                    {panel.external && <a href={panel.external} target="_blank" rel="noreferrer" data-cursor="Visit">Visit the product <b aria-hidden="true">↗</b></a>}
                  </div>
                  <i className="about-panel__glow" aria-hidden="true" />
                </article>
              </Tilt>
            ))}
          </div>
        </section>

        <section className="about-mark site-wrap" data-theme="light">
          <div className="about-mark__visual" aria-hidden="true">
            <div className="about-mark__bars"><i /><i /><i /></div>
            <div className="about-mark__lockup"><Lockup /></div>
          </div>
          <div className="about-mark__copy">
            <p className="site-kicker" data-scramble-in>THE MARK</p>
            <h2 data-split>Structure outside.<br /><em>Signal through the middle.</em></h2>
            <p data-reveal>The first E of our wordmark has no spine. It is three bars: two for structure, and one carrying the only colour in the logo—a blue that becomes cyan as it moves. That is what we build: systems that hold complex information steady so something useful can pass through.</p>
            <ul className="about-mark__list" data-reveal="stagger">
              <li><i className="swatch swatch--navy" /><b>Navy</b><span>Structure and reading</span></li>
              <li><i className="swatch swatch--signal" /><b>Blue → cyan</b><span>Signal and connection</span></li>
              <li><i className="swatch swatch--white" /><b>White</b><span>Room for the work</span></li>
            </ul>
            <Link className="btn-link" href="/blog/a-new-mark-for-tetheric" data-cursor="Read">Read the story behind the mark <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className="band band--dark" data-theme="dark" aria-label="Our disciplines">
          <VelocityMarquee className="band__row">{["AI", "Automation", "Robotics", "Clarity", "Context", "Control"].map((word) => <span key={word} className="band__item"><b>{word}</b><BrandMark tile={false} /></span>)}</VelocityMarquee>
        </section>

        <section className="about-principles site-wrap" data-theme="light">
          <div className="page-head"><p className="site-kicker" data-scramble-in>HOW WE WORK</p><h2 data-split>Different products.<br /><em>The same care underneath.</em></h2></div>
          <div className="about-principles__grid" data-flip>
            {principles.map((principle, index) => (
              <article key={principle.title}><span>0{index + 1}</span><h3>{principle.title}</h3><p>{principle.text}</p></article>
            ))}
          </div>
          <Magnetic><Link className="btn btn--dark" href="/philosophy" data-cursor="Read">Read the full philosophy <span aria-hidden="true">↗</span></Link></Magnetic>
        </section>

        <section className="about-facts site-wrap" data-theme="light">
          <div className="page-head"><p className="site-kicker" data-scramble-in>COMPANY FACTS</p><h2 data-split>The short, <em>plain version.</em></h2></div>
          <dl className="about-facts__list" data-reveal="stagger">
            <div><dt>Legal name</dt><dd>{company.legalName}</dd></div>
            <div><dt>Based in</dt><dd>India</dd></div>
            <div><dt>Products</dt><dd>SeerFlow <small>Live product</small> · Auctra <small>Private pilot</small></dd></div>
            <div><dt>Focus</dt><dd>AI, automation and robotics</dd></div>
            <div><dt>Website</dt><dd>tethericsystems.com</dd></div>
            <div><dt>Contact</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
            <div><dt>Standards</dt><dd><Link href="/methodology">How we describe our work</Link> · <Link href="/security">Security boundaries</Link></dd></div>
          </dl>
        </section>

        <section className="page-journal site-wrap" data-theme="light">
          <div className="page-head"><p className="site-kicker" data-scramble-in>FROM THE JOURNAL</p><h2 data-split>Read how <em>we think.</em></h2></div>
          <div className="page-journal__grid" data-reveal="stagger">{[posts[4], posts[0]].map((post) => <PostCard key={post.slug} post={post} />)}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
