"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/lib/product-family";

export function ProductConstellation() {
  const root=useRef<HTMLDivElement>(null);
  const [focus,setFocus]=useState<"both"|"seerflow"|"foundry">("both");
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    const node=root.current;if(!node)return;
    const media=gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)",()=>{
      const cards=node.querySelectorAll<HTMLElement>(".family-orbit-card");
      const drift=gsap.to(cards,{y:"-=10",rotationZ:i=>i?3:-3,duration:3.6,stagger:.5,ease:"sine.inOut",repeat:-1,yoyo:true,paused});
      let inView=false;
      const move=(event:PointerEvent)=>{if(event.pointerType==='touch'||paused)return;const bounds=node.getBoundingClientRect();gsap.to(node.querySelector('.family-constellation-world'),{rotationY:(event.clientX-bounds.left-bounds.width/2)/bounds.width*8,rotationX:-(event.clientY-bounds.top-bounds.height/2)/bounds.height*6,duration:1,overwrite:true,ease:'power3.out'});};
      const leave=()=>gsap.to(node.querySelector('.family-constellation-world'),{rotationX:0,rotationY:0,duration:1,overwrite:true});
      const visible=()=>{if(document.hidden||paused||!inView)drift.pause();else drift.resume();};
      visible();
      const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;visible();});observer.observe(node);
      node.addEventListener('pointermove',move);node.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visible);
      return ()=>{drift.kill();gsap.killTweensOf(node.querySelector('.family-constellation-world'));observer.disconnect();node.removeEventListener('pointermove',move);node.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visible);};
    });
    return ()=>media.revert();
  },[paused]);
  return <div ref={root} className={`family-constellation focus-${focus}`}>
    <div className="family-visual-label"><span>ONE COMPANY. TWO POINTS OF VIEW.</span><button type="button" onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?"Resume motion":"Pause motion"}</button></div>
    <div className="family-constellation-world"><svg className="family-tethers" viewBox="0 0 620 480" aria-hidden="true"><path d="M310 225V132Q310 99 267 99H162V126"/><path d="M310 250V340Q310 372 353 372H470V343"/><path className="family-tether-active" d="M162 126V99H267Q310 99 310 132V340Q310 372 353 372H470V343"/></svg>
      <div className="family-core"><div className="family-core-face"><span>T</span></div><div className="family-core-caption">TETHERIC SYSTEMS<small>The company behind the products</small></div></div>
      <button className="family-orbit-card family-seer-card" onClick={()=>setFocus(focus==="seerflow"?"both":"seerflow")} aria-pressed={focus==="seerflow"}><span className="family-orbit-status"><i/>LIVE PRODUCT</span><strong className="seer-wordmark">seerflow<span>↗</span></strong><p>See the whole picture.</p><div className="family-mini-data"><span>Orders</span><span>Settlements</span><span>Returns</span><i/><i/><i/></div><small>BUSINESS INTELLIGENCE</small></button>
      <button className="family-orbit-card family-foundry-card" onClick={()=>setFocus(focus==="foundry"?"both":"foundry")} aria-pressed={focus==="foundry"}><span className="family-orbit-status">PRIVATE PILOT</span><strong className="foundry-wordmark">apex<span>foundry</span><i>.</i></strong><p>Make the next possibility.</p><div className="family-mini-creative"><span>ONE<br/><em>good idea.</em></span><div><i/><i/><i/></div></div><small>MARKETING & CREATIVE</small></button>
      <span className="family-float-label family-float-a">FROM INFORMATION</span><span className="family-float-label family-float-b">TO POSSIBILITY</span>
    </div>
    <div className="family-visual-caption" aria-live="polite"><span>{focus==="both"?"Connected by purpose. Focused on different work.":focus==="seerflow"?products.seerflow.purpose:products.foundry.purpose}</span><span>Interactive product illustration</span></div>
  </div>;
}

export function FamilyMotion(){
  useEffect(()=>{
    gsap.registerPlugin(ScrollTrigger);const media=gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)",()=>{
      const context=gsap.context(()=>{
        gsap.from('.family-hero-copy>*',{y:22,opacity:0,stagger:.095,duration:1,ease:'power3.out'});
        gsap.from('.family-constellation',{opacity:0,y:30,duration:1.3,delay:.15,ease:'power3.out'});
        gsap.utils.toArray<HTMLElement>('[data-family-reveal]').forEach(element=>gsap.from(element,{y:40,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 92%',once:true}}));
        gsap.utils.toArray<HTMLElement>('.family-product-visual').forEach(element=>gsap.fromTo(element,{rotateX:9,y:45},{rotateX:0,y:0,transformPerspective:1100,ease:'none',scrollTrigger:{trigger:element,start:'top 90%',end:'top 35%',scrub:.7}}));
        gsap.fromTo('.family-path-fill',{scaleX:0},{scaleX:1,transformOrigin:'left',ease:'none',scrollTrigger:{trigger:'.family-principles',start:'top 78%',end:'bottom 65%',scrub:.8}});
      });
      return ()=>context.revert();
    });
    return ()=>media.revert();
  },[]);
  return null;
}
