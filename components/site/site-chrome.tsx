import Link from "next/link";
import { Lockup, Wordmark } from "@/components/brand/logo";
import { Magnetic, ScrollProgress } from "@/components/motion/interactions";
import { SiteChoreography } from "@/components/motion/site-motion";
import { company } from "@/lib/product-family";
import { footerNav, primaryNav } from "@/lib/site";
import { HeaderController, SiteMenu } from "./header-controls";

export function SiteHeader({ current, theme = "light" }: { current?: string; theme?: "light" | "dark" }) {
  return (
    <header className="site-header" data-theme={theme}>
      <HeaderController />
      <div className="site-header__inner">
        <Link href="/" className="site-logo" aria-label="Tetheric Systems home" data-cursor="Home"><Wordmark label={null} /></Link>
        <nav className="site-nav" aria-label="Main navigation">
          {primaryNav.map((item) => <Link key={item.href} href={item.href} aria-current={current === item.href ? "page" : undefined} data-scramble>{item.label}</Link>)}
        </nav>
        <Magnetic className="site-cta-wrap"><a className="site-cta" href={`mailto:${company.email}`} data-cursor="Write">Let’s talk <span aria-hidden="true">↗</span></a></Magnetic>
        <SiteMenu current={current} />
      </div>
      <ScrollProgress className="site-header__progress" />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" data-theme="dark">
      <div className="site-footer__cta site-wrap">
        <p className="site-kicker">START A CONVERSATION</p>
        <Magnetic strength={0.18}><a href={`mailto:${company.email}`} className="site-footer__mail" data-cursor="Write">Let’s build<br /><em>what’s next.</em><b aria-hidden="true">↗</b></a></Magnetic>
      </div>
      <div className="site-footer__grid site-wrap">
        <div className="site-footer__brand">
          <Link href="/" className="site-footer__lockup" aria-label="Tetheric Systems home"><Lockup tone="light" /></Link>
          <p>{company.legalName}<br />The company behind SeerFlow and Auctra.</p>
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </div>
        {footerNav.map((column) => (
          <div key={column.title} className="site-footer__col">
            <span>{column.title}</span>
            {column.links.map((link) => "external" in link
              ? <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <b aria-hidden="true">↗</b></a>
              : <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </div>
        ))}
      </div>
      <div className="site-footer__giant" aria-hidden="true"><Wordmark tone="light" label={null} /></div>
      <div className="site-footer__base site-wrap"><span>© 2026 {company.legalName}</span><span>AI | Automation | Robotics</span><span>India</span></div>
      <SiteChoreography />
    </footer>
  );
}

