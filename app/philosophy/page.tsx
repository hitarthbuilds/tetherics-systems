import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import { SignalField } from "@/components/family/family-motion";
import { VelocityMarquee } from "@/components/motion/interactions";
import { PhilosophyMotion } from "@/components/pages/philosophy-motion";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { getPost } from "@/lib/blog";
import "../pages.css";

export const metadata: Metadata = {
  title: "Philosophy — Tetheric Systems",
  description: "Six beliefs that shape how Tetheric Systems builds, writes and decides: context, visible work, honest gaps, scoped access, human judgment and systems thinking.",
};

const beliefs = [
  { kicker: "CONTEXT", title: "Context before content.", text: "A number means more beside its source. An idea means more beside its brand. We design for the relationship first, and the screen second.", link: { href: "/blog/one-idea-two-products", label: "One idea, two products" } },
  { kicker: "EVIDENCE", title: "Make the claim. Show the work.", text: "Name the object, give it a state, attach the trail and draw the boundary. A claim is only as strong as what stands behind it.", link: { href: "/blog/make-the-claim-show-the-work", label: "Read the six moves" } },
  { kicker: "HONESTY", title: "Missing is not zero.", text: "Gaps are information. An empty field should look like a question, because it is one. Clarity includes being clear about what you do not know.", link: { href: "/blog/missing-input-is-not-zero", label: "Missing input is not zero" } },
  { kicker: "SECURITY", title: "Access is a scope. Action is a decision.", text: "Seeing and changing are different permissions. Preparing work is not publishing it. Every consequential step should have an owner.", link: { href: "/blog/access-is-a-scope-action-is-a-decision", label: "Read on scope and action" } },
  { kicker: "JUDGMENT", title: "People make the final call.", text: "Software should help people move with judgment, not quietly replace it. Review stays visible. Approval stays explicit." },
  { kicker: "SYSTEMS", title: "Everything is a system.", text: "A settlement, a campaign, a team, a company. Understand the loop—inputs, state, decision, action, feedback—and you can improve any part of it." },
];

export default function PhilosophyPage() {
  const reading = ["make-the-claim-show-the-work", "missing-input-is-not-zero", "access-is-a-scope-action-is-a-decision"].map((slug) => getPost(slug)!);
  return (
    <div className="page page--philosophy">
      <SiteHeader current="/philosophy" theme="dark" />
      <main id="main">
        <section className="page-hero page-hero--bars" data-theme="dark">
          <div className="phil-bars" aria-hidden="true"><i /><i /><i /></div>
          <div className="page-hero__content site-wrap">
            <p className="site-kicker" data-scramble-in>OUR PHILOSOPHY</p>
            <h1 data-split>Clarity inside.<br /><em>Possibility outside.</em></h1>
            <p className="page-hero__lead" data-reveal>Six beliefs that shape how we build, how we write about what we build, and how we decide what comes next.</p>
          </div>
          <span className="page-hero__scroll" aria-hidden="true">Scroll <b>↓</b></span>
        </section>

        <section className="phil-manifesto site-wrap" data-theme="light">
          <p className="site-kicker" data-scramble-in>THE SHORT VERSION</p>
          <p className="phil-manifesto__text" data-fill>We believe software should make complex work clearer and meaningful work easier to create. It should show its sources, admit its gaps and leave the final call with a person. Everything we build is a system—and a system is only as good as the connections it keeps.</p>
        </section>

        <section className="beliefs site-wrap" data-theme="light" aria-label="Six beliefs">
          <div className="beliefs__rail" aria-hidden="true">
            <div className="beliefs__sticky">
              <span className="beliefs__label">BELIEF</span>
              <div className="beliefs__dial">
                <svg viewBox="0 0 120 120"><defs><linearGradient id="belief-ring" x1="0" x2="1"><stop offset="0" stopColor="#0a4fa0" /><stop offset="1" stopColor="#20d2ee" /></linearGradient></defs><circle cx="60" cy="60" r="54" className="beliefs__track" /><circle cx="60" cy="60" r="54" className="beliefs__progress" /></svg>
                <strong className="beliefs__number">01</strong>
              </div>
              <span className="beliefs__total">OF 06</span>
            </div>
          </div>
          <ol className="beliefs__list">
            {beliefs.map((belief, index) => (
              <li key={belief.title} className={`belief${index === 0 ? " is-active" : ""}`}>
                <span className="belief__kicker">{String(index + 1).padStart(2, "0")} / {belief.kicker}</span>
                <h2>{belief.title}</h2>
                <p>{belief.text}</p>
                {belief.link && <Link className="btn-link" href={belief.link.href} data-cursor="Read">{belief.link.label} <span aria-hidden="true">↗</span></Link>}
              </li>
            ))}
          </ol>
        </section>

        <section className="phil-system" data-theme="dark">
          <SignalField />
          <div className="phil-system__inner site-wrap">
            <p className="site-kicker">THE LOOP</p>
            <h2 className="phil-system__word" aria-label="Everything is a system."><span>Everything</span> <span>is a</span> <em><span>system.</span></em></h2>
            <ol className="phil-system__loop">{["Observe", "Model", "Decide", "Act", "Learn"].map((step, index) => <li key={step}><b>0{index + 1}</b>{step}</li>)}</ol>
            <p className="phil-system__note">Click anywhere in the field to send a signal through it.</p>
          </div>
          <VelocityMarquee className="phil-system__marquee">{["Clarity", "Context", "Control", "Evidence", "Judgment"].map((word) => <span key={word} className="band__item"><b>{word}</b><i aria-hidden="true">✳</i></span>)}</VelocityMarquee>
        </section>

        <section className="page-journal site-wrap" data-theme="light">
          <div className="page-head"><p className="site-kicker" data-scramble-in>KEEP READING</p><h2 data-split>The thinking, <em>in long form.</em></h2></div>
          <div className="page-journal__grid page-journal__grid--three" data-reveal="stagger">{reading.map((post) => <PostCard key={post.slug} post={post} />)}</div>
        </section>
      </main>
      <SiteFooter />
      <PhilosophyMotion />
    </div>
  );
}
