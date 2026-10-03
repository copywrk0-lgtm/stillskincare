'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import {Menu,X,Plus,ArrowDownRight} from 'lucide-react';

const ages=[21,25,30,35,40];
export default function Home(){
 const root=useRef<HTMLDivElement>(null); const [menu,setMenu]=useState(false); const [age,setAge]=useState(21);
 useEffect(()=>{let cancelled=false;let cleanup=()=>{};(async()=>{const [{gsap},{ScrollTrigger},{default:Lenis}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger'),import('lenis')]);if(cancelled)return;gsap.registerPlugin(ScrollTrigger);const lenis=new Lenis({duration:1.55,anchors:true});const tick=(t:number)=>lenis.raf(t*1000);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);const ctx=gsap.context(()=>{
  gsap.to('.hero-image',{scale:1.07,yPercent:4,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.5}});
  ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom top',onUpdate:s=>setAge(ages[Math.min(4,Math.floor(s.progress*5))])});
  gsap.to('.time-image',{scale:1.08,ease:'none',scrollTrigger:{trigger:'.time',start:'top bottom',end:'bottom top',scrub:2}});
  gsap.fromTo('.time-line i',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'.time',start:'top 75%',end:'bottom 35%',scrub:1.5}});
  gsap.fromTo('.macro-image',{scale:1.22,filter:'blur(7px)'},{scale:1,filter:'blur(0px)',ease:'none',scrollTrigger:{trigger:'.beneath',start:'top bottom',end:'center center',scrub:1.6}});
  gsap.fromTo('.still-word',{letterSpacing:'-.09em',opacity:.2},{letterSpacing:'-.045em',opacity:1,ease:'none',scrollTrigger:{trigger:'.stillness',start:'top 75%',end:'center center',scrub:1.8}});
  gsap.fromTo('.product-vessel',{yPercent:18,rotate:-7,scale:.9},{yPercent:-4,rotate:2,scale:1,ease:'none',scrollTrigger:{trigger:'.product',start:'top bottom',end:'bottom top',scrub:1.7}});
  gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>gsap.fromTo(el,{y:38,opacity:0},{y:0,opacity:1,duration:1.15,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
 },root);cleanup=()=>{ctx.revert();gsap.ticker.remove(tick);lenis.destroy()}})();return()=>{cancelled=true;cleanup()}},[]);
 return <div ref={root}>
 <header><a className="logo" href="#top">STILL.</a><nav><a href="#time">Time</a><a href="#beneath">Skin</a><a href="#product">Ritual</a></nav><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Menu">{menu?<X/>:<Menu/>}</button></header>
 {menu&&<div className="mobile-nav"><a onClick={()=>setMenu(false)} href="#time">Time</a><a onClick={()=>setMenu(false)} href="#beneath">Beneath the skin</a><a onClick={()=>setMenu(false)} href="#product">The ritual</a></div>}
 <main>
  <section className="hero" id="top">
   <div className="hero-image"><Image src="/images/skin.webp" fill priority sizes="100vw" alt="Close portrait of luminous skin"/></div><div className="hero-shade"/>
   <p className="hero-kicker">PROFESSIONAL SKINCARE.<br/>DEEPLY PERSONAL.</p>
   <h1><span>STAY</span><em>the age</em><strong>YOU'RE IN.</strong></h1>
   <div className="age-rail"><b>{age}</b><div>{ages.map(a=><span key={a} className={a===age?'active':''}>{a}<i/></span>)}</div></div>
   <a className="scroll-cue" href="#time">SCROLL TO MOVE THROUGH TIME <ArrowDownRight size={17}/></a>
  </section>

  <section className="time" id="time"><div className="time-image"><Image src="/images/skin-time.webp" fill sizes="100vw" alt="Skin portrait in soft directional light"/></div><div className="time-shade"/><div className="time-copy reveal"><p>01 / TIME</p><h2>Time moves.<br/><em>Skin responds.</em></h2><span>Your skin does not change all at once. It shifts quietly — texture, hydration, resilience. The ritual should be just as considered.</span></div><div className="time-line"><i/></div></section>

  <section className="beneath" id="beneath"><div className="macro-image"><Image src="/images/skin-time.webp" fill sizes="100vw" alt="Macro skin texture"/></div><div className="beneath-copy reveal"><p>02 / BENEATH THE SKIN</p><h2>A living<br/><em>surface.</em></h2><span>Layers working together. Changing a little every day. Care begins with supporting what is already there — not fighting time.</span></div></section>

  <section className="stillness"><p className="still-word">STILL.</p><div className="still-note reveal"><span>TIME MOVES.</span><em>you don't have to rush with it.</em></div></section>

  <section className="product" id="product"><div className="product-copy reveal"><p>03 / THE RITUAL</p><h2>One formula.<br/><em>One quiet moment.</em></h2><span>Hydration. Comfort. Consistency. A focused ritual designed to earn its place in the everyday.</span><a href="#ritual">DISCOVER THE RITUAL <Plus size={16}/></a></div><div className="product-vessel"><Image src="/images/booster.webp" fill sizes="(max-width:760px) 75vw, 42vw" alt="STILL skincare product"/></div></section>

  <section className="formula" id="ritual"><div className="formula-visual"><Image src="/images/mask.webp" fill sizes="100vw" alt="Skincare mask ritual"/></div><div className="formula-copy reveal"><p>04 / FORMULA</p><h2>Less noise.<br/><em>More ritual.</em></h2><div className="formula-list"><span><b>01</b> Hyaluronic acid <small>hydration</small></span><span><b>02</b> Glycerin <small>moisture support</small></span><span><b>03</b> Niacinamide <small>everyday care</small></span><span><b>04</b> Panthenol <small>comfort</small></span></div><small>Concept formulation. Final ingredient and efficacy claims require verification.</small></div></section>

  <section className="ritual"><div className="ritual-image"><Image src="/images/campaign.webp" fill sizes="100vw" alt="STILL campaign product image"/></div><div className="ritual-copy reveal"><p>05 / YOUR STILL</p><h2>A moment<br/><em>for your skin.</em></h2><span>No ten-step routine. No urgency. Start with what your skin needs and make space for consistency.</span></div></section>

  <section className="final"><p>06 / FIND YOUR STILL</p><h2>Stay beautifully<br/><em>you.</em></h2><a href="mailto:hello@still.skin">BEGIN A CONVERSATION <ArrowDownRight size={20}/></a><div className="final-word">STILL.</div></section>
 </main><footer><span>STILL.</span><span>Independent brand concept by Copywrk.</span><a href="#top">BACK TO TOP</a></footer>
 </div>
}
