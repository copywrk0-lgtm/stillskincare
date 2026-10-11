/* STILL — local self-contained WebGL visual; CSS fallback remains available. */
(function stillEngine(){'use strict';
  const zone=document.getElementById('jar-zone'),canvas=document.getElementById('jar-canvas');
  if(!zone||!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) return;
  let gl;
  try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:false,preserveDrawingBuffer:false, powerPreference:'low-power'});}catch(_){return}
  if(!gl)return;
  const vertex=`precision highp float;attribute vec3 aP;attribute vec3 aN;attribute vec2 aUV;
  uniform mat4 uProj;uniform float uSpin;uniform float uTilt;uniform float uLift;uniform float uLid;
  varying vec3 vNormal;varying vec3 vWorld;varying vec2 vUV;
  void main(){vec3 p=aP;p.y+=uLid*uLift*.90;
    if(uLid>.5){float a=uLift*.17;float yy=p.y-(1.68+uLift*.90);p.y=cos(a)*yy-sin(a)*p.x+(1.68+uLift*.90);p.x=sin(a)*yy+cos(a)*p.x;}
    float ry=radians(uSpin);float rx=radians(uTilt);p.y-=1.10;
    p=vec3(cos(ry)*p.x+sin(ry)*p.z,p.y,-sin(ry)*p.x+cos(ry)*p.z);
    p=vec3(p.x,cos(rx)*p.y-sin(rx)*p.z,sin(rx)*p.y+cos(rx)*p.z);
    vec3 n=aN;
    n=vec3(cos(ry)*n.x+sin(ry)*n.z,n.y,-sin(ry)*n.x+cos(ry)*n.z);
    n=vec3(n.x,cos(rx)*n.y-sin(rx)*n.z,sin(rx)*n.y+cos(rx)*n.z);
    vNormal=normalize(n);vWorld=p;vUV=aUV;p.z-=7.3;
    gl_Position=uProj*vec4(p,1.);}`;
  const fragment=`precision highp float;varying vec3 vNormal;varying vec3 vWorld;varying vec2 vUV;
  uniform int uMaterial;uniform sampler2D uTexture;
  void main(){vec3 N=normalize(vNormal);vec3 V=normalize(vec3(0.,.0,7.)-vWorld);
    vec3 lightA=normalize(vec3(2.4,4.,5.8));vec3 lightB=normalize(vec3(-4.,1.4,-2.));
    float da=max(dot(N,lightA),0.);float db=max(dot(N,lightB),0.);
    float specA=pow(max(dot(N,normalize(lightA+V)),0.),48.);
    float specB=pow(max(dot(N,normalize(lightB+V)),0.),23.);
    float edge=pow(1.-max(dot(N,V),0.),3.);
    float strip1=pow(max(dot(N,normalize(vec3(.62,.12,.78))),0.),25.);
    float strip2=pow(max(dot(N,normalize(vec3(-.79,.19,.58))),0.),37.);
    vec3 color=vec3(.115,.078,.056);float alpha=1.;
    if(uMaterial==0){color*=.72+da*1.18+db*.26;
      color+=vec3(.64,.37,.22)*strip1*.68+vec3(.93,.75,.56)*strip2*.23;
      color+=vec3(.88,.58,.40)*specA*.55+vec3(.76,.42,.27)*specB*.26;
      color+=vec3(.19,.11,.075)*edge;
      color*=.90+.06*sin(vWorld.y*19.);}
    else if(uMaterial==1){color=vec3(.16,.12,.105)*(.66+da*.73+db*.48);
      color+=vec3(.90,.70,.53)*strip1*.42+vec3(.83,.67,.55)*strip2*.40;
      color+=vec3(1.,.79,.64)*specA*.49+vec3(.32,.19,.15)*edge;
      color*=.95+.045*sin(vWorld.y*33.);}
    else if(uMaterial==2){color=vec3(.45,.26,.15)*(1.0+da*.85)+vec3(1.,.72,.44)*specA*.8+vec3(.7,.38,.20)*strip1*.7;}
    else if(uMaterial==3){color=vec3(.68,.54,.41)*(.48+da*.5)+vec3(.7,.46,.31)*specA*.1;}
    else {vec4 c=texture2D(uTexture,vUV);color=c.rgb*(.45+da*.85);alpha=c.a;}
    gl_FragColor=vec4(pow(clamp(color,0.,1.),vec3(.90)),alpha);}`;
  function shader(type,source){let s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
  let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));}catch(_){return}
  const loc={};['aP','aN','aUV','uProj','uSpin','uTilt','uLift','uLid','uMaterial','uTexture'].forEach(k=>loc[k]=k[0]==='a'?gl.getAttribLocation(program,k):gl.getUniformLocation(program,k));
  const createMesh=(verts,material,lid=0)=>{let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);return {b,count:verts.length/8,material,lid}};
  const meshes=[];
  function lathe(profile,mat,lid=0,segments=72){let pts=[];
    for(let j=0;j<profile.length-1;j++){
      let [ra,ya]=profile[j],[rb,yb]=profile[j+1];let dr=rb-ra,dy=yb-ya;let h=Math.hypot(dy,dr)||1;
      let nr=dy/h,ny=-dr/h;
      for(let i=0;i<segments;i++){
        let t=i/segments*Math.PI*2,u=(i+1)/segments*Math.PI*2;
        let v=(r,y,a)=>[r*Math.sin(a),y,r*Math.cos(a),nr*Math.sin(a),ny,nr*Math.cos(a),a/(Math.PI*2),y/2.25];
        let p1=v(ra,ya,t),p2=v(rb,yb,t),p3=v(rb,yb,u),p4=v(ra,ya,u);
        pts.push(...p1,...p2,...p3,...p1,...p3,...p4);
      }
    }
    meshes.push(createMesh(pts,mat,lid));
  }
  lathe([[0,0],[.72,0],[.87,.018],[.945,.07],[.985,.145],[.985,1.30],[.965,1.39],[.9,1.48],[.76,1.50],[0,1.50]],0);
  lathe([[.945,1.43],[.98,1.46],[.98,1.515],[.945,1.55]],2);
  lathe([[0,1.49],[.78,1.49],[.91,1.505],[.95,1.53],[0,1.53]],3);
  lathe([[0,1.52],[.88,1.52],[1.002,1.54],[1.035,1.63],[1.035,2.01],[1.006,2.10],[.95,2.135],[.83,2.147],[0,2.147]],1,1);
  lathe([[.985,1.58],[1.038,1.60],[1.04,1.67]],2,1);
  const surface=document.createElement('canvas');surface.width=1024;surface.height=512;
  const ctx=surface.getContext('2d');
  const labelTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,labelTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  function drawLabel(){ctx.clearRect(0,0,1024,512);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ebddcc';
    ctx.font='160px Georgia,serif';ctx.fillText('S T I L L',512,157);
    ctx.globalAlpha=.6;ctx.fillRect(390,259,244,2);ctx.globalAlpha=1;
    ctx.font='35px Arial,sans-serif';ctx.fillText('R E N E W I N G   M A S K',512,322);
    ctx.globalAlpha=.65;ctx.font='14px Arial,sans-serif';ctx.fillText('HYDRATE  /  RESTORE  /  PROTECT',512,391);
    ctx.font='14px Arial,sans-serif';ctx.fillText('50 ML  /  CONCEPT',512,440);ctx.globalAlpha=1;
    gl.bindTexture(gl.TEXTURE_2D,labelTexture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,surface);}
  drawLabel();document.fonts?.ready?.then(drawLabel).catch(()=>{});
  {let verts=[];const seg=72,theta=1.14;for(let i=0;i<seg;i++){
    const t=-theta+2*theta*i/seg,n=-theta+2*theta*(i+1)/seg;
    const v=(ang,y,uv)=>[1.001*Math.sin(ang),y,1.001*Math.cos(ang),Math.sin(ang),0,Math.cos(ang),uv,(y-.32)/1.00];
    let a=v(t,.32,i/seg),b=v(n,.32,(i+1)/seg),c=v(n,1.32,(i+1)/seg),d=v(t,1.32,i/seg);
    verts.push(...a,...b,...c,...a,...c,...d);
  }meshes.push(createMesh(verts,4));}
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0,0,0,0);
  let state={spin:-19,tilt:5,lift:0},target={...state},raf=0,visible=true,dirty=true,lastFloat=0,rendered=false;
  const reduced=matchMedia('(max-width:550px)').matches;
  function size(){const w=zone.clientWidth,h=zone.clientHeight;if(!w||!h)return;let dpr=Math.min(devicePixelRatio||1,reduced?1.25:1.65);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);let fov=Math.PI*30/180,aspect=w/h,near=.1,far=30,f=1/Math.tan(fov/2);projection=[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];wake();}
  let projection=[];
  function frame(){raf=0;if(!visible||document.hidden)return;
    const ease=.16;let moving=false;
    for(let k of ['spin','tilt','lift']){const d=target[k]-state[k];if(Math.abs(d)>(k==='lift'?.002:.08)){state[k]+=d*ease;moving=true}else state[k]=target[k]}
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
    gl.uniformMatrix4fv(loc.uProj,false,projection);gl.uniform1f(loc.uSpin,state.spin);gl.uniform1f(loc.uTilt,state.tilt);gl.uniform1f(loc.uLift,state.lift);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,labelTexture);gl.uniform1i(loc.uTexture,0);
    gl.enableVertexAttribArray(loc.aP);gl.enableVertexAttribArray(loc.aN);gl.enableVertexAttribArray(loc.aUV);
    for(let mesh of meshes){gl.bindBuffer(gl.ARRAY_BUFFER,mesh.b);gl.vertexAttribPointer(loc.aP,3,gl.FLOAT,false,32,0);gl.vertexAttribPointer(loc.aN,3,gl.FLOAT,false,32,12);gl.vertexAttribPointer(loc.aUV,2,gl.FLOAT,false,32,24);gl.uniform1i(loc.uMaterial,mesh.material);gl.uniform1f(loc.uLid,mesh.lid);gl.drawArrays(gl.TRIANGLES,0,mesh.count)}
    if(!rendered){rendered=true;zone.classList.add('gl')}
    dirty=false;if(moving)wake();}
  function wake(){dirty=true;if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(frame)}
  const onContextLost=e=>{e.preventDefault();visible=false;zone.classList.remove('gl');cancelAnimationFrame(raf);raf=0};
  canvas.addEventListener('webglcontextlost',onContextLost,false);
  canvas.addEventListener('webglcontextrestored',()=>{zone.classList.remove('gl')},false);
  let observer=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)wake();else if(raf){cancelAnimationFrame(raf);raf=0;}},{rootMargin:'180px'});observer.observe(zone);
  const ro=window.ResizeObserver?new ResizeObserver(size):null;ro?.observe(zone);addEventListener('resize',size,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake()});
  window.stillJar={set(p,manual=0){target.spin=-19+p*295+manual;target.tilt=5+p*10;let k=Math.max(0,Math.min(1,(p-.6)/.3));target.lift=k*k*(3-2*k);if(Math.abs(target.spin-state.spin)>.05||Math.abs(target.lift-state.lift)>.001)wake()},renderer:'local-webgl',getFrames:()=>({rendered,moving:!!raf})};
  size();
})();
