import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { recordNav } from "@/lib/site";
import { RecordMotion } from "./record-motion";
import "@/app/records.css";

export function TrustShell({ code, title, summary, children, visual, current, chapters=[], accent="blue" }: { code:string; title:ReactNode; summary:string; children:ReactNode; visual?:ReactNode; current?:string; chapters?:{id:string;label:string}[];accent?:"blue"|"cyan"|"steel" }) {
 return <main className={`trust-document record-page record-${accent}`} data-theme="dark"><RecordMotion/>
  <a className="record-skip" href="#record-content">Skip to the record</a>
  <SiteHeader current={current} theme="dark"/>
  <section className={`trust-hero ${visual?'has-visual':''}`} data-theme="dark"><div className="record-hero-copy"><nav className="record-subnav" aria-label="Company pages">{recordNav.map(item=><Link key={item.href} href={item.href} aria-current={current===item.href?"page":undefined}>{item.label}</Link>)}</nav><span className="record-eyebrow" data-scramble-in>{code}</span><h1 data-split>{title}</h1><p>{summary}</p><div className="record-hero-foot"><span><i/>Public record · 20 September 2026</span><a href="#record-content">Explore the record <b>↓</b></a></div></div>{visual&&<div className="record-hero-visual">{visual}</div>}</section>
  <div className="record-main" id="record-content" data-theme="light">{chapters.length>0&&<aside className="record-index"><span>IN THIS RECORD</span><nav aria-label="On this page">{chapters.map((chapter,index)=><a key={chapter.id} href={`#${chapter.id}`}><small>{String(index+1).padStart(2,'0')}</small>{chapter.label}<b>↗</b></a>)}</nav><p>A product claim, a source and a status. Read them together.</p></aside>}<div className="trust-body">{children}</div></div>
  <section className="record-next" data-theme="dark"><span>THE COMPANY BEHIND THE WORK</span><Link href="/about" data-cursor="About">Two products.<br/><em>One bigger picture.</em><b>↗</b></Link></section>
  <SiteFooter/>
 </main>;
}
export function Status({children,tone="neutral"}:{children:ReactNode;tone?:"live"|"concept"|"limited"|"neutral"}){return <span className={`trust-status is-${tone}`}>{children}</span>;}
export function Disclosure({label,value,status}:{label:string;value:string;status:ReactNode}){return <div className="trust-disclosure"><span>{label}</span><strong>{value}</strong>{status}</div>;}
export function SectionHeading({number,label,title,description}:{number:string;label:string;title:ReactNode;description?:string}){return <div className="record-section-heading"><span data-scramble-in>{number} / {label}</span><h2 data-split>{title}</h2>{description&&<p data-reveal>{description}</p>}</div>;}
export function RecordLink({href,children,external=false,download}:{href:string;children:ReactNode;external?:boolean;download?:boolean}){return <a className="record-action" href={href} download={download} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined}>{children}<span>↗</span></a>;}
