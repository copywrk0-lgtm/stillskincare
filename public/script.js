(()=>{
  'use strict';
  const $=(selector,parent=document)=>parent.querySelector(selector);
  const $$=(selector,parent=document)=>[...parent.querySelectorAll(selector)];
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall=()=>innerWidth<800;
  const load=$('#load');
  document.body.classList.add('enhanced');
  function dismissLoad(){load.classList.add('done');setTimeout(()=>load.remove(),1100)}
  if(document.readyState==='complete')setTimeout(dismissLoad,450);
  else window.addEventListener('load',()=>setTimeout(dismissLoad,450),{once:true});
  setTimeout(dismissLoad,2300);

  // Site navigation: fully working, keyboard accessible, and scroll aware.
  const header=$('#header');const menu=$('#menu-panel');const menuToggle=$('#menu-toggle');
  let lastFocus=null;
  function openMenu(){lastFocus=document.activeElement;menu.classList.add('open');document.body.classList.add('menu-open');menuToggle.setAttribute('aria-expanded','true');menu.setAttribute('aria-hidden','false');$('.menu-caption',menuToggle).textContent='CLOSE';$$('.menu-inner>a')[0].focus();}
  function closeMenu(){menu.classList.remove('open');document.body.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');menu.setAttribute('aria-hidden','true');$('.menu-caption',menuToggle).textContent='MENU';lastFocus?.focus();}
  menuToggle.addEventListener('click',()=>menu.classList.contains('open')?closeMenu():openMenu());
  $$('[data-nav]').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))closeMenu();if(e.key==='Tab'&&menu.classList.contains('open')){let targets=[menuToggle,...$$('a',menu)].filter(x=>x.getClientRects().length);let first=targets[0],last=targets[targets.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});

  // Hero: CSS 3D jar (fallback) plus a WebGL jar when Three.js loads.
  const runway=$('#top'),jarZone=$('#jar-zone'),model=$('#product-model'),heroCopy=$('#hero-copy'),chapter=$('#hero-chapter');
  const heroWords=[$('.hero-word-one'),$('.hero-word-two')];
  let manualSpin=0,dragging=false,dragStartX=0,dragSpin=0,latestProgress=0,atRest=0;
  // Locally bundled WebGL jar initializes separately in jar-engine.js.
  // CSS jar remains visible as a reliable fallback.

  function updateModel(p){window.stillJar&&window.stillJar.set(p,manualSpin);const current=-19+(p*295)+manualSpin;model.style.setProperty('--spin',`${current}deg`);model.style.setProperty('--tilt',`${5+p*10}deg`);}
  jarZone.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;dragging=true;dragStartX=e.clientX;dragSpin=manualSpin;jarZone.classList.add('dragging');jarZone.setPointerCapture?.(e.pointerId)});
  jarZone.addEventListener('pointermove',e=>{if(dragging){manualSpin=dragSpin+(e.clientX-dragStartX)*.8;updateModel(latestProgress)}});
  const stopDragging=()=>{dragging=false;jarZone.classList.remove('dragging')};
  jarZone.addEventListener('pointerup',stopDragging);jarZone.addEventListener('pointercancel',stopDragging);
  $('#drag-hint').addEventListener('click',()=>{manualSpin+=65;updateModel(latestProgress)});

  let frameRequested=false;
  function scrollFrame(){frameRequested=false;const y=scrollY,full=Math.max(1,document.documentElement.scrollHeight-innerHeight);$('#page-progress').style.height=`${y/full*100}%`;
    header.classList.toggle('scrolled',y>30);
    const center=header.getBoundingClientRect().height+5;let activeSection=null;
    $$('[data-header]').forEach(s=>{const r=s.getBoundingClientRect();if(r.top<=center&&r.bottom>center)activeSection=s});
    header.classList.toggle('light',!!activeSection&&activeSection.dataset.header==='light'&&!menu.classList.contains('open'));
    const rect=runway.getBoundingClientRect();const p=clamp(-rect.top/Math.max(1,rect.height-innerHeight));latestProgress=p;
    let desktop=!isSmall();let disappear=clamp((p-.13)/.28);let second=clamp((p-.37)/.27);let final=clamp((p-.58)/.30);
    heroCopy.style.opacity=String(1-disappear);heroCopy.style.translate=`0 ${(-30*disappear)}px`;
    heroCopy.style.pointerEvents=disappear>.82?'none':'auto';
    heroWords[0].style.opacity=String((second*(1-final))*0.9);heroWords[1].style.opacity=String((final*(1-clamp((p-.92)/.08)))*0.92);
    heroWords[0].style.transform=`translate3d(${-60+65*second}px,${-15*second}px,0)`;
    heroWords[1].style.transform=`translate3d(${90-100*final}px,${-20*final}px,0)`;
    jarZone.style.setProperty('--hero-zoom',String(1+0.50*second-0.42*final));
    jarZone.style.setProperty('--hero-x',`${desktop ?(-140*second+200*final):(-60*second+45*final)}px`);
    jarZone.style.setProperty('--hero-y',`${desktop?(15*second+80*final):(-10*second+45*final)}px`);
    $('.hero-portrait').style.opacity=String(.2+.10*second);
    chapter.textContent=p<.36?'01 / THE MOMENT':p<.67?'02 / THE PRESENT':'03 / YOUR RITUAL';
    updateModel(p);
    const scienceImg=$('.science-image');const scienceRect=$('#science').getBoundingClientRect();let scienceP=clamp(1-(scienceRect.top+scienceRect.height)/(innerHeight+scienceRect.height));scienceImg.style.transform=`scale(${1.1+scienceP*.13}) translateY(${-scienceP*18}px)`;
    // The liquid lens grows as the reader passes between the skin and formula chapters.
    const bridge=$('#journey');if(bridge){const br=bridge.getBoundingClientRect();const d=clamp(-br.top/Math.max(1,br.height-innerHeight));bridge.style.setProperty('--depth',d.toFixed(4));}
    const ritualImg=$('.ritual-image');const rr=$('#ritual').getBoundingClientRect();const rp=clamp((innerHeight-rr.top)/(innerHeight+rr.height));ritualImg.style.transform=`scale(1.16) translateY(${(rp-.5)*-35}px)`;
  }
  function requestScroll(){if(!frameRequested){frameRequested=true;requestAnimationFrame(scrollFrame)}}
  addEventListener('scroll',requestScroll,{passive:true});addEventListener('resize',requestScroll,{passive:true});requestScroll();
  // CSS variables above avoid hijacking the mobile's distinct opening composition.
  const scanner=$('#scanner');const science=$('#science');
  science.addEventListener('pointermove',e=>{if(reduceMotion||isSmall())return;const b=science.getBoundingClientRect();const dx=(e.clientX-(b.left+b.width*.72))*.065,dy=(e.clientY-(b.top+b.height*.42))*.065;scanner.style.translate=`${clamp(dx,-33,33)}px ${clamp(dy,-30,30)}px`});
  science.addEventListener('pointerleave',()=>scanner.style.translate='0px 0px');
  // Reveal sections: intersection observer, no opacity gates if JS is unavailable.
  const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
  $$('.reveal').forEach(x=>revealObserver.observe(x));

  const ingredients=[
    {name:'Hyaluronic acid',image:'assets/hyalu-drop.webp',watermark:'H₂O',alt:'Translucent hyaluronic gel orb',description:'Helps skin attract water, leaving it feeling supple, hydrated and comfortable.'},
    {name:'Glycerin',image:'assets/glycerin-drop.webp',watermark:'GLY',alt:'Clear liquid droplet',description:'A familiar humectant that helps attract moisture and support skin’s hydration.'},
    {name:'Niacinamide',image:'assets/niacin-drop.webp',watermark:'B₃',alt:'Amber-colored serum orb',description:'Commonly used to support the skin barrier and a more even-looking complexion.'},
    {name:'Panthenol',image:'assets/panthenol-drop.webp',watermark:'B₅',alt:'Luminous skincare gel orb',description:'A moisturising ingredient often used in formulas for skin that needs comfort.'}
  ];
  const tabs=$$('.ingredient-tab'),stage=$('.ingredient-stage');let ingredientIndex=0;
  function setIngredient(i){ingredientIndex=(i+ingredients.length)%ingredients.length;let ing=ingredients[ingredientIndex];tabs.forEach((t,j)=>{t.classList.toggle('active',j===ingredientIndex);t.setAttribute('aria-selected',String(j===ingredientIndex))});stage.classList.add('switching');setTimeout(()=>{$('#ingredient-image').src=ing.image;$('#ingredient-image').alt=ing.alt;$('#ingredient-watermark').textContent=ing.watermark;$('#ingredient-current').textContent=`0${ingredientIndex+1} / 04`;$('#ingredient-description').textContent=ing.description;stage.setAttribute('aria-labelledby',`ing-tab-${ingredientIndex}`);stage.classList.remove('switching')},170)}
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>setIngredient(i));t.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();tabs[(i+1)%tabs.length].focus();setIngredient(i+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();tabs[(i+tabs.length-1)%tabs.length].focus();setIngredient(i-1)}})});
  const productContent={
    mask:{type:'THE SLOW-DOWN RITUAL / 50 ML',title:'The Renewing<br><em>Mask.</em>',copy:'A comforting, hydration-focused concept mask. Made for the moments when your skin—and your day—need a little softness.',benefits:['Hyaluronic acid','Panthenol','Glycerin'],image:'assets/mask-product.webp',alt:'STILL Renewing Mask product illustration'},
    booster:{type:'THE DAILY RESET / 30 ML',title:'The Hydration<br><em>Booster.</em>',copy:'A lightweight, layerable hydration concept for skin that feels dry or tight. A little reminder to start with what you need.',benefits:['Hyaluronic acid','Glycerin','Daily hydration'],image:'assets/hydration-booster.svg',alt:'STILL Hydration Booster illustrative bottle'}
  };
  let selectedProduct='mask',productTimer=0;
  function setProduct(key,{instant=false}={}){
    if(!productContent[key])return;
    selectedProduct=key;
    $$('.product-tab').forEach(b=>{const current=b.dataset.product===key;b.classList.toggle('active',current);b.setAttribute('aria-selected',String(current));b.tabIndex=current?0:-1});
    const info=productContent[key],image=$('#collection-image');
    clearTimeout(productTimer);if(!instant)image.classList.add('fading');
    productTimer=setTimeout(()=>{
      image.src=info.image;image.alt=info.alt;$('#collection-type').textContent=info.type;
      $('#collection-title').innerHTML=info.title;$('#collection-copy').textContent=info.copy;
      $('#collection-benefits').replaceChildren(...info.benefits.map(name=>{const li=document.createElement('li');li.textContent=name;return li}));
      image.classList.remove('fading');
    },instant||reduceMotion?0:190);
}
  const productTabs=$$('.product-tab');
  productTabs.forEach((btn,i)=>{btn.tabIndex=i===0?0:-1;
    btn.addEventListener('click',()=>setProduct(btn.dataset.product));
    btn.addEventListener('keydown',e=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){
      e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?productTabs.length-1:(i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1)+productTabs.length)%productTabs.length;
      productTabs[j].focus();setProduct(productTabs[j].dataset.product);
    }});
  });
  $('#collection-cta').addEventListener('click',()=>{document.getElementById('consult').scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'})});

  const questions=[
    {title:'What does your skin need most today?',label:'QUESTION ONE / THE PRIORITY',choices:['Hydration','Comfort','Even-looking tone','A simpler routine']},
    {title:'How does your skin usually feel?',label:'QUESTION TWO / SKIN FEEL',choices:['Dry or tight','Balanced','Oily or shiny','Easily irritated']},
    {title:'What kind of ritual fits your life?',label:'QUESTION THREE / YOUR PACE',choices:['A quick daily step','A few mindful minutes','An occasional slow ritual','I need some guidance']}
  ];
  let qIndex=0,answers=[null,null,null],showResult=false;
  const content=$('#quiz-content'),quizNext=$('#quiz-next'),quizBack=$('#quiz-back');
  function getRecommendation(){
    const [focus,feel,pace]=answers;
    if(feel==='Easily irritated'||pace==='I need some guidance')return {
      name:'Comfort before complexity.',copy:'Because you described easily irritated skin or asked for guidance, consider checking your routine with a qualified skin professional before introducing something new. Gentle care and patch testing matter.',product:null,tag:'AN INDIVIDUAL APPROACH'};
    if(focus==='Hydration'||feel==='Dry or tight'||pace==='A quick daily step')return {
      name:'The Hydration Booster.',copy:'Your priorities suggest a simple, hydration-first concept. The Hydration Booster illustrates a lightweight daily step featuring hyaluronic acid and glycerin.',product:'booster',tag:'THE DAILY RESET'};
    if(pace==='An occasional slow ritual'||focus==='Comfort')return {
      name:'The Renewing Mask.',copy:'Your answers favour a slower moment of self-care. The Renewing Mask is an illustrative occasional hydration ritual, not a replacement for a complete routine.',product:'mask',tag:'THE SLOW MOMENT'};
    return {name:'A considered daily ritual.',copy:'For a simpler routine or a focus on more even-looking tone, begin with gentle cleansing, moisturiser, and daily sun protection. Our Hydration Booster is one optional concept step, not a claim to treat pigmentation.',product:'booster',tag:'A SIMPLE START'};
}
  function renderQuiz(){
    content.replaceChildren();
    if(showResult){
      const rec=getRecommendation();$('#quiz-counter').textContent='YOUR STILL';$('#quiz-progress').style.width='100%';
      content.innerHTML=`<div class="quiz-result"><span class="result-tag">YOUR CONCEPT RITUAL / ${rec.tag}</span><h3>Your skin.<br><em>Your pace.</em></h3><strong>${rec.name}</strong><p>${rec.copy}</p><a href="#collection" id="result-collection">${rec.product?'EXPLORE YOUR CONCEPT PRODUCT':'EXPLORE THE COLLECTION'} ↗</a><p>Illustrative recommendation only. Not a diagnosis or personalised medical advice.</p></div>`;
      quizNext.innerHTML='START AGAIN <span>↺</span>';quizNext.disabled=false;quizBack.disabled=false;quizBack.textContent='← REVIEW';
      $('#result-collection').addEventListener('click',()=>{if(rec.product)setProduct(rec.product,{instant:true})});
      return;
    }
    const q=questions[qIndex];$('#quiz-counter').textContent=`0${qIndex+1} / 03`;$('#quiz-progress').style.width=`${(qIndex+1)*33.333}%`;
    const title=document.createElement('span');title.className='quiz-question-label';title.textContent=q.label;
    const h=document.createElement('h3');h.textContent=q.title;
    const grid=document.createElement('div');grid.className='quiz-choices';grid.setAttribute('role','group');grid.setAttribute('aria-label',q.title);
    q.choices.forEach(choice=>{
      const b=document.createElement('button');b.className='quiz-choice'+(answers[qIndex]===choice?' selected':'');b.type='button';
      b.setAttribute('aria-pressed',String(answers[qIndex]===choice));
      b.append(document.createTextNode(choice));const bullet=document.createElement('span');bullet.setAttribute('aria-hidden','true');bullet.textContent=answers[qIndex]===choice?'●':'○';b.append(bullet);
      b.addEventListener('click',()=>{answers[qIndex]=choice;renderQuiz()});grid.appendChild(b)
    });
    content.append(title,h,grid);quizBack.disabled=qIndex===0;quizNext.disabled=!answers[qIndex];quizBack.textContent='← PREVIOUS';quizNext.innerHTML=qIndex===2?'GET YOUR EDIT <span>↗</span>':'NEXT QUESTION <span>↗</span>';
}
  quizNext.addEventListener('click',()=>{if(showResult){qIndex=0;answers=[null,null,null];showResult=false}else if(answers[qIndex]){if(qIndex===2)showResult=true;else qIndex++}renderQuiz()});
  quizBack.addEventListener('click',()=>{if(showResult){showResult=false;qIndex=2}else qIndex=Math.max(0,qIndex-1);renderQuiz()});
  renderQuiz();
})();
