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
  // Hero upgrade: real WebGL jar (Three.js). Falls back to the CSS jar if Three.js or WebGL is unavailable.
  function initJar(){
    const cv=$('#jar-canvas');if(!window.THREE||!cv)return;
    let renderer;try{renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){return}
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,1,.1,50);
    // Procedural studio environment so the metal and glaze have something to reflect
    const ec=document.createElement('canvas');ec.width=1024;ec.height=512;const ex=ec.getContext('2d');
    const eg=ex.createLinearGradient(0,0,0,512);eg.addColorStop(0,'#3a2a22');eg.addColorStop(.55,'#120e0c');eg.addColorStop(1,'#070605');ex.fillStyle=eg;ex.fillRect(0,0,1024,512);
    [[110,110,90,260,'#ffe2c4'],[470,80,60,300,'#fff1e0'],[760,140,110,220,'#e8a06c'],[950,90,50,280,'#ffffff']].forEach(b=>{ex.fillStyle=b[4];ex.fillRect(b[0],b[1],b[2],b[3])});
    const et=new THREE.CanvasTexture(ec);et.mapping=THREE.EquirectangularReflectionMapping;et.encoding=THREE.sRGBEncoding;
    const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromEquirectangular(et).texture;et.dispose();pm.dispose();
    scene.add(new THREE.AmbientLight(0xffffff,.15));
    const key=new THREE.DirectionalLight(0xffd9b8,1.1);key.position.set(3,4,5);scene.add(key);
    const rimL=new THREE.PointLight(0xd08055,1.4);rimL.position.set(-4,1,-3);scene.add(rimL);
    // Lathe profile: a cylinder with rounded top and bottom edges
    function profile(r,h,rad){const p=[new THREE.Vector2(0,0),new THREE.Vector2(r-rad,0)],n=10;
      for(let i=1;i<=n;i++){const a=i/n*Math.PI/2;p.push(new THREE.Vector2(r-rad+Math.sin(a)*rad,rad-Math.cos(a)*rad))}
      for(let i=1;i<=n;i++){const a=i/n*Math.PI/2;p.push(new THREE.Vector2(r-rad+Math.cos(a)*rad,h-rad+Math.sin(a)*rad))}
      p.push(new THREE.Vector2(0,h));return p}
    const jar=new THREE.Group();jar.position.y=-1.06;scene.add(jar);
    const bodyMat=new THREE.MeshPhysicalMaterial({color:0x1b1411,metalness:.35,roughness:.3,clearcoat:1,clearcoatRoughness:.18});
    const lidMat=new THREE.MeshStandardMaterial({color:0x4a3528,metalness:1,roughness:.3});
    const body=new THREE.Mesh(new THREE.LatheGeometry(profile(1,1.5,.14),96),bodyMat);jar.add(body);
    const cream=new THREE.Mesh(new THREE.SphereGeometry(.88,48,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xe3cdb5,roughness:.4,metalness:0,envMapIntensity:.6}));
    cream.scale.y=.14;cream.position.y=1.5;jar.add(cream);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.02,12,96),new THREE.MeshStandardMaterial({color:0xd08055,metalness:1,roughness:.25}));ring.rotation.x=Math.PI/2;ring.position.y=1.5;jar.add(ring);
    const lid=new THREE.Mesh(new THREE.LatheGeometry(profile(1.04,.62,.12),96),lidMat);lid.position.y=1.52;jar.add(lid);
    // Label drawn on a 2D canvas and wrapped round the front of the body
    const lc=document.createElement('canvas');lc.width=1400;lc.height=490;const g=lc.getContext('2d');
    const lt=new THREE.CanvasTexture(lc);lt.anisotropy=8;lt.encoding=THREE.sRGBEncoding;
    const serif='"Bodoni MT","Didot","Times New Roman",Georgia,serif',sans='"Helvetica Neue",Arial,sans-serif';
    function spaced(t,cx,y,sp){const w=[...t].map(c=>g.measureText(c).width),tot=w.reduce((a,b)=>a+b,0)+sp*(t.length-1);let x=cx-tot/2;[...t].forEach((c,i)=>{g.fillText(c,x,y);x+=w[i]+sp})}
    function drawLabel(){g.clearRect(0,0,1400,490);g.fillStyle='#e6d4bf';g.textAlign='left';g.textBaseline='middle';
      g.font='190px '+serif;spaced('STILL',700,150,28);
      g.fillStyle='rgba(230,212,191,.6)';g.fillRect(550,255,300,2);
      g.fillStyle='#e6d4bf';g.font='40px '+sans;spaced('RENEWING MASK',700,320,12);
      g.font='17px '+sans;spaced('HYDRATE  /  RESTORE  /  PROTECT',700,385,6);
      g.globalAlpha=.55;g.font='15px '+sans;spaced('50 ML / CONCEPT',700,440,6);g.globalAlpha=1;lt.needsUpdate=true}
    drawLabel();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawLabel);
    const L=2;const label=new THREE.Mesh(new THREE.CylinderGeometry(1.004,1.004,.7,64,1,true,-L/2,L),new THREE.MeshBasicMaterial({map:lt,transparent:true,depthWrite:false}));label.position.y=.78;jar.add(label);
    // Scroll-driven state, eased toward its target each frame
    const st={rot:-19,tilt:5,lift:0},tg={rot:-19,tilt:5,lift:0};let visible=true,raf=0;
    window.stillJar={set(p,spin){tg.rot=-19+p*295+spin;tg.tilt=5+p*10;const k=clamp((p-.6)/.3);tg.lift=k*k*(3-2*k);wake()}};
    function size(){const w=jarZone.clientWidth,h=jarZone.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,0,9*Math.max(1,.6/camera.aspect));camera.updateProjectionMatrix();wake()}
    function frame(t){raf=0;if(!visible)return;const e=reduceMotion?1:.12;
      st.rot+=(tg.rot-st.rot)*e;st.tilt+=(tg.tilt-st.tilt)*e;st.lift+=(tg.lift-st.lift)*e;
      jar.rotation.set(st.tilt*Math.PI/180,st.rot*Math.PI/180,0);
      lid.position.y=1.52+st.lift*.95;lid.rotation.z=st.lift*.12;
      jar.position.y=-1.06+(reduceMotion?0:Math.sin(t/1400)*.03);
      rimL.position.x=-4+Math.sin(st.rot*Math.PI/180)*1.5;
      renderer.render(scene,camera);
      if(!reduceMotion||Math.abs(tg.rot-st.rot)>.05||Math.abs(tg.lift-st.lift)>.001)wake()}
    function wake(){if(!raf&&visible)raf=requestAnimationFrame(frame)}
    new IntersectionObserver(en=>{visible=en[0].isIntersecting;if(visible)wake()}).observe(runway);
    if(window.ResizeObserver)new ResizeObserver(size).observe(jarZone);addEventListener('resize',size);
    jarZone.classList.add('gl');size();
  }
  initJar();

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
  let selectedProduct='mask';
  $$('.product-tab').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.product;selectedProduct=key;$$('.product-tab').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',String(b===btn))});const info=productContent[key];const image=$('#collection-image');image.classList.add('fading');setTimeout(()=>{image.src=info.image;image.alt=info.alt;$('#collection-type').textContent=info.type;$('#collection-title').innerHTML=info.title;$('#collection-copy').textContent=info.copy;$('#collection-benefits').replaceChildren(...info.benefits.map(name=>{let li=document.createElement('li');li.textContent=name;return li}));image.classList.remove('fading')},230)}));
  $('#collection-cta').addEventListener('click',()=>{document.getElementById('consult').scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'})});

  const questions=[
    {title:'What season of life are you in?',label:'QUESTION ONE / ALL AGES WELCOME',choices:['18–24','25–34','35–44','45+']},
    {title:'What does your skin need most today?',label:'QUESTION TWO / THE PRIORITY',choices:['Hydration','Comfort','Even-looking tone','A simpler routine']},
    {title:'How does your skin usually feel?',label:'QUESTION THREE / SKIN FEEL',choices:['Dry or tight','Balanced','Oily or shiny','Easily irritated']}
  ];
  let qIndex=0,answers=[null,null,null],showResult=false;
  const content=$('#quiz-content'),quizNext=$('#quiz-next'),quizBack=$('#quiz-back');
  function getRecommendation(){if(answers[2]==='Easily irritated')return {name:'Start with comfort.',copy:'If your skin reacts easily, introduce one product at a time and consult a qualified skin professional about a suitable routine. Patch testing is sensible.',product:'GENTLE GUIDANCE'};if(answers[1]==='Hydration'||answers[2]==='Dry or tight')return{name:'The Hydration Booster.',copy:'Your answers point toward a simple hydration-focused routine. The concept Hydration Booster highlights humectants such as glycerin and hyaluronic acid.',product:'THE DAILY RESET'};return{name:'The Renewing Mask.',copy:'Your answers suggest a calm, pared-back ritual might appeal to you. Our concept Renewing Mask is an occasional moment of comfort, not a substitute for a daily routine.',product:'THE SLOW MOMENT'}}
  function renderQuiz(){content.innerHTML='';if(showResult){let rec=getRecommendation();$('#quiz-counter').textContent='YOUR STILL';$('#quiz-progress').style.width='100%';content.innerHTML=`<div class="quiz-result"><span class="result-tag">YOUR CONCEPT RITUAL</span><h3>Your skin.<br><em>Your pace.</em></h3><strong>${rec.name}</strong><p>${rec.copy}</p><a href="#collection" id="result-collection">SEE THE COLLECTION ↗</a><p>Illustrative recommendation only. Not a diagnosis or personalised medical advice.</p></div>`;$('#quiz-next').innerHTML='START AGAIN <span>↺</span>';$('#quiz-next').disabled=false;$('#quiz-back').disabled=false;$('#quiz-back').textContent='← REVIEW';$('#result-collection').addEventListener('click',()=>{});return}
    const q=questions[qIndex];$('#quiz-counter').textContent=`0${qIndex+1} / 03`;$('#quiz-progress').style.width=`${(qIndex+1)*33.333}%`;
    const title=document.createElement('span');title.className='quiz-question-label';title.textContent=q.label;const h=document.createElement('h3');h.textContent=q.title;
    const grid=document.createElement('div');grid.className='quiz-choices';grid.setAttribute('role','group');grid.setAttribute('aria-label',q.title);
    q.choices.forEach(choice=>{let b=document.createElement('button');b.className='quiz-choice'+(answers[qIndex]===choice?' selected':'');b.type='button';b.setAttribute('aria-pressed',String(answers[qIndex]===choice));b.innerHTML=`<span aria-hidden="true">${answers[qIndex]===choice?'●':'○'}</span>`;b.prepend(document.createTextNode(choice));b.addEventListener('click',()=>{answers[qIndex]=choice;renderQuiz()});grid.appendChild(b)});
    content.append(title,h,grid);quizBack.disabled=qIndex===0;quizNext.disabled=!answers[qIndex];quizBack.textContent='← PREVIOUS';quizNext.innerHTML=qIndex===2?'GET YOUR EDIT <span>↗</span>':'NEXT QUESTION <span>↗</span>';
  }
  quizNext.addEventListener('click',()=>{if(showResult){qIndex=0;answers=[null,null,null];showResult=false}else if(answers[qIndex]){if(qIndex===2)showResult=true;else qIndex++}renderQuiz()});
  quizBack.addEventListener('click',()=>{if(showResult){showResult=false;qIndex=2}else qIndex=Math.max(0,qIndex-1);renderQuiz()});renderQuiz();
})();
