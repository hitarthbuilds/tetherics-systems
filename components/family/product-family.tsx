import Link from "next/link";
import { BrandMark } from "@/components/brand/logo";
import { PostCard } from "@/components/blog/post-card";
import { Magnetic, Tilt, VelocityMarquee } from "@/components/motion/interactions";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { BrandCore } from "@/components/three/brand-core";
import { getAllPosts } from "@/lib/posts";
import { company, products } from "@/lib/product-family";
import { BrandIntro } from "./brand-intro";
import { BrandSequence, HERO_PROGRESS, HeroScroll, HeroTitle, HomeMotion, LockupDraw, SignalField, ZoomStatement } from "./family-motion";
import "@/app/family.css";

function Arrow(){return <span aria-hidden="true">↗</span>;}
const disciplines=["AI","Automation","Robotics","Clarity","Context","Control"];
const principles=[
  {label:"CONNECT THE CONTEXT",title:"The details belong together.",text:"A settlement means more beside an order. A creative idea means more beside its brand. The product should keep the relationship visible."},
  {label:"MAKE THE WORK VISIBLE",title:"Clarity earns confidence.",text:"Show the source, the draft and the gap. An idea is an idea; an estimate is an estimate. The interface should make that easy to understand."},
  {label:"KEEP PEOPLE IN CONTROL",title:"The final call stays yours.",text:"Useful software helps you move with judgment. Product access, data availability and approval should stay explicit."},
];

export async function ProductFamily(){
  const posts=await getAllPosts();
  return <div className="product-family"><a className="family-skip" href="#main">Skip to content</a>
    <BrandIntro/>
    <SiteHeader current="/" theme="dark"/>
    <main id="main">
      <section className="hero" data-theme="dark" data-core-host>
        <BrandCore className="hero__core" progressEvent={HERO_PROGRESS}/>
        <div className="hero__veil" aria-hidden="true"/>
        <HeroScroll/>
        <div className="hero__content site-wrap">
          <p className="hero__tagline" data-hero-item><span>AI</span><i/><span>Automation</span><i/><span>Robotics</span></p>
          <HeroTitle/>
          <p className="hero__intro" data-hero-item>We build software for the decisions you need to make—and the things you want to create.</p>
          <div className="hero__actions" data-hero-item><Magnetic><a className="btn btn--glow" href="#products" data-cursor="Explore">Meet our products <span aria-hidden="true">↓</span></a></Magnetic><Link className="btn-link btn-link--light" href="/philosophy" data-cursor="Read">Our philosophy <Arrow/></Link></div>
        </div>
        <div className="hero__hud site-wrap" data-hero-item>
          <div className="hero__products"><a href={products.seerflow.url} target="_blank" rel="noreferrer" data-cursor="Visit"><i className="is-live"/>SeerFlow<small>{products.seerflow.status}</small></a><a href={products.foundry.url} target="_blank" rel="noreferrer" data-cursor="Visit"><i/>Auctra<small>{products.foundry.status}</small></a></div>
          <span className="hero__hint">Move · Click the core · Scroll</span>
          <span className="hero__scroll">Scroll <b aria-hidden="true">↓</b></span>
        </div>
        <div className="hero__wipe" aria-hidden="true"><i/><b/></div>
      </section>

      <BrandSequence/>

      <section className="band" aria-label="What Tetheric works on">
        <VelocityMarquee className="band__row">{disciplines.map(word=><span key={word} className="band__item"><b>{word}</b><BrandMark tile={false}/></span>)}</VelocityMarquee>
        <VelocityMarquee className="band__row band__row--outline" speed={-1.8}>{[...disciplines].reverse().map(word=><span key={word} className="band__item"><b>{word}</b><i aria-hidden="true">✳</i></span>)}</VelocityMarquee>
      </section>

      <section id="products" className="family-products family-wrap"><div className="family-section-head"><div><p className="family-eyebrow" data-scramble-in>BUILT FOR THE WORK THAT MATTERS</p><h2 data-split>A clearer business.<br/><em>A more expressive brand.</em></h2></div><p data-reveal>Start with the problem in front of you. Each product has its own focus, its own workspace, and a place in the same family.</p></div>
        <article className="family-product family-product-seer"><div className="family-product-copy" data-reveal="stagger"><div className="family-product-meta"><span>01 / DECISION INTELLIGENCE</span><span className="family-status live"><i/>{products.seerflow.status}</span></div><h3 className="seer-wordmark">seerflow</h3><h4>Less reconciling.<br/><em>More understanding.</em></h4><p>{products.seerflow.description}</p><ul><li>Follow cash from order to settlement.</li><li>Understand contribution, costs and returns.</li><li>Keep sources and missing inputs visible.</li></ul><div className="family-actions"><Magnetic><a className="family-button" href={products.seerflow.url} target="_blank" rel="noreferrer" data-cursor="Visit">Explore SeerFlow <Arrow/></a></Magnetic><Link className="family-text-link" href={products.seerflow.record}>Product record <Arrow/></Link></div><small>For Indian D2C teams. Decisions depend on connected records and explicit cost inputs.</small></div>
        <Tilt className="family-product-stage"><div className="family-product-visual seer-product-visual" aria-label="Illustrative SeerFlow operating view"><div className="family-window-bar"><span className="seer-wordmark">seerflow</span><span>THE OPERATING PICTURE</span><i>•••</i></div><div className="seer-window-body"><aside><b>YOUR BUSINESS</b><span className="active">◉ &nbsp; Overview</span><span>↳ &nbsp; Cash flow</span><span>↳ &nbsp; Settlements</span><span>↳ &nbsp; Contribution</span><span>↳ &nbsp; Returns</span><small>One source.<br/>A clearer decision.</small></aside><div className="seer-workspace"><div className="seer-workspace-heading"><span>FROM ORDERS TO UNDERSTANDING</span><h5>Follow the money.</h5><p>The parts belong to one picture.</p></div><div className="seer-source-path"><span>Orders</span><i>→</i><span>Payments</span><i>→</i><span>Settlements</span></div><div className="seer-trail"><svg viewBox="0 0 350 115" aria-hidden="true"><defs><linearGradient id="seer-trail-stroke" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#0a4fa0"/><stop offset="1" stopColor="#20d2ee"/></linearGradient></defs><path className="seer-grid" d="M0 25H350M0 65H350M0 105H350"/><path className="seer-line-shadow" d="M0 92C40 92 40 72 80 72S125 89 155 63S210 67 250 35S310 54 350 15"/><path className="seer-line" d="M0 92C40 92 40 72 80 72S125 89 155 63S210 67 250 35S310 54 350 15"/></svg><span>TRACEABLE OPERATING CONTEXT</span></div><div className="seer-insight"><span>↗</span><div><b>A question worth asking.</b><p>What was sold, what settled, and what is still expected?</p></div></div></div></div><div className="family-visual-disclosure">Illustrative interface · no customer data or performance result</div></div></Tilt></article>
        <article className="family-product family-product-foundry"><div className="family-product-copy" data-reveal="stagger"><div className="family-product-meta"><span>02 / MARKETING & CREATIVE</span><span className="family-status">{products.foundry.status}</span></div><h3 className="foundry-wordmark">auctra<i>.</i></h3><h4>One good thought.<br/><em>A world of creative.</em></h4><p>{products.foundry.description}</p><ul><li>Bring your brand, sources and ideas together.</li><li>Create copy, imagery and narrated drafts.</li><li>See the work. Refine it. Make the final call.</li></ul><div className="family-actions"><Magnetic><a className="family-button" href={products.foundry.url} target="_blank" rel="noreferrer" data-cursor="Visit">Explore Auctra <Arrow/></a></Magnetic><Link className="family-text-link" href={products.foundry.record}>Pilot details <Arrow/></Link></div><small>In pilot with SeerFlow. Preparation and review; publishing and account access depend on separate configuration and permissions.</small></div>
        <Tilt className="family-product-stage"><div className="family-product-visual foundry-product-visual" aria-label="Illustrative Auctra creative workspace"><div className="family-window-bar"><span className="foundry-wordmark">auctra<i>.</i></span><span>THE CREATIVE WORKSPACE</span><i>•••</i></div><div className="foundry-window-body"><div className="foundry-mini-chat"><span>THE CLARITY SERIES / PROJECT CHAT</span><h5>What should we make next?</h5><div className="foundry-mini-prompt">A fresh way to tell our story.<br/>Start with what makes the brand useful.</div><div className="foundry-mini-answer"><b>✳</b><div><strong>Your creative lead</strong><p>Let’s bring the brand, the idea and the work into one conversation.</p><span>Brand research <i>↗</i></span><span>Creative directions <i>↗</i></span><span>Drafts for review <i>↗</i></span></div></div><div className="foundry-mini-input">Keep the thought going… <b>↑</b></div></div><div className="foundry-mini-board"><span>WORKING CANVAS</span><div className="foundry-mini-poster">MAKE<br/>ROOM FOR<br/><em>possibility.</em><i/><i/><i/><small>CREATIVE DIRECTION / 01</small></div><div className="foundry-mini-reel"><b>▶</b><span>A story in motion.<small>Narrated reel draft</small></span></div></div></div><div className="family-visual-disclosure">Illustrative workspace · drafts and agent activity shown as a concept</div></div></Tilt></article>
      </section>

      <ZoomStatement/>

      <section className="family-loop" data-theme="dark"><SignalField/><div className="family-wrap family-loop-inner"><div className="family-loop-heading"><p className="family-eyebrow" data-scramble-in>THE BIGGER PICTURE</p><h2 data-split>Build the brand.<br/><em>Understand the business.</em></h2><p data-reveal>Creative ambition meets operating intelligence. Our direction is a connected journey from the first idea to the next informed decision.</p></div><div className="family-loop-diagram"><Tilt className="family-loop-card"><a href={products.foundry.url} data-cursor="Visit"><span>01 / CREATE</span><strong className="foundry-wordmark">auctra<i>.</i></strong><p>Brand, creative, websites<br/>and the work of marketing.</p><b>Explore the creative workspace ↗</b></a></Tilt><div className="family-loop-bridge" aria-hidden="true"><svg viewBox="0 0 200 120" className="loop-bridge-svg"><path id="loop-path-forward" d="M4 44C60 8 140 8 196 44"/><path id="loop-path-back" d="M196 76C140 112 60 112 4 76"/></svg><span className="loop-packets">{[0,1,2,3,4,5].map(index=><b key={index} className="loop-packet"/>)}</span><i>CONTEXT FLOWS BOTH WAYS</i></div><Tilt className="family-loop-card"><a href={products.seerflow.url} data-cursor="Visit"><span>02 / UNDERSTAND</span><strong className="seer-wordmark">seerflow</strong><p>Orders, revenue, cash flow<br/>and the operating picture.</p><b>Explore business intelligence ↗</b></a></Tilt></div><p className="family-loop-note">Product direction · connected workflows depend on configuration and supported integrations. Click the field to send a signal.</p></div></section>

      <section id="approach" className="family-principles family-wrap"><div className="family-section-head"><div><p className="family-eyebrow" data-scramble-in>A SHARED WAY OF THINKING</p><h2 data-split>Different products.<br/><em>The same care underneath.</em></h2></div><p data-reveal>We start with real work, build around its context, and make room for human judgment. <Link href="/philosophy">Read our philosophy ↗</Link></p></div>
        <div className="stack">{principles.map((item,index)=><article key={item.label} className="stack__card" style={{"--i":index} as React.CSSProperties}><div className="stack__index"><span>{String(index+1).padStart(2,"0")}</span><small>/ 03</small></div><div className="stack__body"><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div><div className="stack__art" aria-hidden="true"><BrandMark tile={false}/><i/><i/><i/></div></article>)}</div>
      </section>

      <section className="home-journal family-wrap"><div className="family-section-head"><div><p className="family-eyebrow" data-scramble-in>FROM THE JOURNAL</p><h2 data-split>Notes on building<br/><em>clearer systems.</em></h2></div><p data-reveal>How we think about products, brand, security and the work in between. <Link href="/blog">All articles ↗</Link></p></div><div className="home-journal__grid" data-reveal="stagger">{posts.slice(0,3).map(post=><PostCard key={post.slug} post={post}/>)}</div></section>

      <section className="family-company family-wrap"><LockupDraw/><div><p className="family-eyebrow" data-scramble-in>TETHERIC SYSTEMS PRIVATE LIMITED</p><h2 data-split>Building what comes next.<br/><em>One useful product at a time.</em></h2><p data-reveal>We are the company behind SeerFlow and Auctra. Our focus is software that makes complex work clearer and meaningful work easier to create.</p><div className="family-company-links" data-reveal="stagger"><Link href="/about">About Tetheric <Arrow/></Link><Link href="/philosophy">Our philosophy <Arrow/></Link><Link href="/methodology">How we describe our work <Arrow/></Link><Link href="/security">Security boundaries <Arrow/></Link></div><p className="family-company-note"><BrandMark tile={false}/>{company.legalName} · India</p></div></section>
    </main>
    <SiteFooter/>
    <HomeMotion/>
  </div>;
}
