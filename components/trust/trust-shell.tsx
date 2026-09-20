import Link from "next/link";
import type { ReactNode } from "react";
import { company } from "@/lib/product-family";
import { RecordMotion } from "./record-motion";
import "@/app/secondary.css";

const navigation = [["Evidence", "/evidence"], ["SeerFlow", "/records/seerflow"], ["Foundry", "/records/foundry"], ["Methodology", "/methodology"], ["Security", "/security"]] as const;
export function TrustShell({ code, title, summary, children, visual, current, chapters=[], accent="violet" }: { code:string; title:ReactNode; summary:string; children:ReactNode; visual?:ReactNode; current?:string; chapters?:{id:string;label:string}[];accent?:"violet"|"green"|"coral" }) {
 return <main className={`trust-document record-page record-${accent}`}><RecordMotion/>
  <a className="record-skip" href="#record-content">Skip to the record</a>
  <header className="trust-header"><Link href="/" className="trust-mark"><span>T</span><strong>tetheric systems</strong></Link><nav aria-label="Company pages">{navigation.map(([label,href])=><Link key={href} href={href} aria-current={current===href?"page":undefined}>{label}</Link>)}</nav><Link className="record-home" href="/">The bigger picture ↗</Link></header>
  <section className={`trust-hero ${visual?'has-visual':''}`}><div className="record-hero-copy"><span className="record-eyebrow">{code}</span><h1>{title}</h1><p>{summary}</p><div className="record-hero-foot"><span><i/>Public record · 20 September 2026</span><a href="#record-content">Explore the record <b>↓</b></a></div></div>{visual&&<div className="record-hero-visual">{visual}</div>}</section>
  <div className="record-main" id="record-content">{chapters.length>0&&<aside className="record-index"><span>IN THIS RECORD</span><nav aria-label="On this page">{chapters.map((chapter,index)=><a key={chapter.id} href={`#${chapter.id}`}><small>{String(index+1).padStart(2,'0')}</small>{chapter.label}<b>↗</b></a>)}</nav><p>A product claim, a source and a status. Read them together.</p></aside>}<div className="trust-body">{children}</div></div>
  <section className="record-next"><span>THE COMPANY BEHIND THE WORK</span><Link href="/">Two products.<br/><em>One bigger picture.</em><b>↗</b></Link></section>
  <footer className="trust-footer"><span><strong>{company.legalName}</strong><br/>The company behind SeerFlow and Apex Foundry.</span><span>FACTS, STATUS AND LIMITATIONS<br/>ARE LABELED SEPARATELY.</span><a href={`mailto:${company.email}`}>Start a conversation ↗</a></footer>
 </main>;
}
export function Status({children,tone="neutral"}:{children:ReactNode;tone?:"live"|"concept"|"limited"|"neutral"}){return <span className={`trust-status is-${tone}`}>{children}</span>;}
export function Disclosure({label,value,status}:{label:string;value:string;status:ReactNode}){return <div className="trust-disclosure"><span>{label}</span><strong>{value}</strong>{status}</div>;}
export function SectionHeading({number,label,title,description}:{number:string;label:string;title:ReactNode;description?:string}){return <div className="record-section-heading"><span>{number} / {label}</span><h2>{title}</h2>{description&&<p>{description}</p>}</div>;}
export function RecordLink({href,children,external=false,download}:{href:string;children:ReactNode;external?:boolean;download?:boolean}){return <a className="record-action" href={href} download={download} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined}>{children}<span>↗</span></a>;}
