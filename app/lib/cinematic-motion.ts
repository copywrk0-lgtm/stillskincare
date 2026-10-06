import type {gsap as Gsap} from 'gsap';
import type {ScrollTrigger as ScrollTriggerType} from 'gsap/ScrollTrigger';

// Runs inside the page's GSAP context and reduced-motion matchMedia scope.
export function cinematicMotion(gsap:typeof Gsap,ScrollTrigger:typeof ScrollTriggerType,root:HTMLElement){
 const small=window.matchMedia('(max-width:760px)').matches;
 const disposers:Array<()=>void>=[];
 const opening=gsap.timeline({defaults:{ease:'power3.out'}});
 opening.fromTo('.hero-visual',{scale:1.13},{scale:1,duration:2.1},0)
  .fromTo('.hero-stay',{yPercent:65,clipPath:'inset(0 0 100% 0)'},{yPercent:0,clipPath:'inset(0 0 0% 0)',duration:1.25},.1)
  .fromTo('.hero-you',{yPercent:45,opacity:0,rotate:-5},{yPercent:0,opacity:1,rotate:0,duration:1.35},.45)
  .fromTo('.hero-intro,.hero-lower,.hero-bottom,.age-rail',{opacity:0,y:15},{opacity:1,y:0,stagger:.09,duration:.85},.65)
  .fromTo('.hero-glint',{xPercent:-140,opacity:0},{xPercent:140,opacity:.55,duration:1.7,ease:'sine.inOut'},.2)
  .to('.hero-glint',{opacity:0,duration:.35},1.9);
 gsap.to('.hero-you',{xPercent:small?5:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}});
 gsap.to('.journey-progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:root,start:'top top',end:'bottom bottom',scrub:.25}});
 gsap.to('.time-scan',{scale:2.8,opacity:0,ease:'none',scrollTrigger:{trigger:'.changes',start:'top top',end:'+=100%',scrub:1}});
 gsap.fromTo('.skin-diagram',{y:small?12:40,rotateY:-12},{y:0,rotateY:8,ease:'none',scrollTrigger:{trigger:'.science',start:'top 75%',end:'bottom 15%',scrub:1}});
 gsap.utils.toArray<HTMLElement>('.ingredient-scene').forEach((scene,i)=>{
  const st={trigger:scene,start:'top bottom',end:'bottom top',scrub:1};
  gsap.fromTo(scene.querySelector('.ingredient-product-media'),{y:small?14:35,rotation:i===2?10:-12,scale:.94},{y:small?-14:-35,rotation:i===2?-4:5,scale:1.03,ease:'none',scrollTrigger:st});
  gsap.fromTo(scene.querySelectorAll('.ingredient-scene-copy>*'),{y:40,opacity:0},{y:0,opacity:1,stagger:.1,duration:.85,ease:'power3.out',scrollTrigger:{trigger:scene,start:'top 60%'}});
 });
 gsap.utils.toArray<HTMLElement>('.manifesto-bottom,.results-heading h2,.reflections,.quiz-section h2,.faq-item,.cta h2,.cta-grid').forEach(el=>{
  gsap.fromTo(el,{y:30,opacity:0},{y:0,opacity:1,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 93%'}});
 });
 // Pointer effects animate inner imagery, leaving selection and swipe transforms intact.
 if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  root.querySelectorAll<HTMLElement>('.vessel,.hero-quiz>i,.round-link,.product-controls button').forEach(el=>{
   const target=el.querySelector(el.classList.contains('vessel')?'img':'svg');
   if(!target)return;
   const x=gsap.quickTo(target,'x',{duration:.6,ease:'power3.out'});
   const y=gsap.quickTo(target,'y',{duration:.6,ease:'power3.out'});
   const rotate=gsap.quickTo(target,'rotation',{duration:.65,ease:'power3.out'});
   const move=(event:PointerEvent)=>{const b=el.getBoundingClientRect();const nx=(event.clientX-b.left)/b.width-.5,ny=(event.clientY-b.top)/b.height-.5;x(nx*14);y(ny*12);rotate(nx*5)};
   const reset=()=>{x(0);y(0);rotate(0)};
   el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);
   disposers.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset)});
  });
 }
 const refresh=()=>ScrollTrigger.refresh();
 const images=[...root.querySelectorAll('img')].filter(img=>!img.complete);
 images.forEach(img=>img.addEventListener('load',refresh,{once:true}));
 disposers.push(()=>images.forEach(img=>img.removeEventListener('load',refresh)));
 // Re-measure pins after font loading without accumulating handlers.
 let alive=true;void document.fonts.ready.then(()=>{if(alive)refresh()});
 disposers.push(()=>{alive=false});
 return()=>disposers.forEach(dispose=>dispose());
}

