import { Wordmark } from "@/components/brand/logo";

/** First-visit loader: the wordmark assembles, a counter runs, and three bars pull away. */
export function BrandIntro() {
  return (
    <div className="brand-intro" aria-hidden="true">
      <div className="brand-intro__slices"><i /><i /><i /></div>
      <div className="brand-intro__stage">
        <div className="brand-intro__mark"><Wordmark tone="light" label={null} trademark /></div>
        <div className="brand-intro__meta"><span>SYSTEMS PRIVATE LIMITED</span><span className="brand-intro__count">000</span></div>
        <div className="brand-intro__progress"><i /></div>
        <p className="brand-intro__tag"><span>AI</span><span>AUTOMATION</span><span>ROBOTICS</span></p>
      </div>
    </div>
  );
}
