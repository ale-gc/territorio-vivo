/* Guía local y opcional. Solo se guarda la preferencia de ocultar la invitación. */
(() => {
  const header=document.querySelector('.app-header');
  if(!header)return;
  const key='territorio.omitirGuia';
  const el=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt)n.textContent=txt;if(cls)n.className=cls;return n;};
  const launch=el('button','Cómo explorar','help-launch');header.append(launch);
  const box=el('aside','','field-guide');box.hidden=true;box.setAttribute('aria-label','Guía de exploración');
  const jaguar=el('img');jaguar.src='assets/img/estudios/jaguar.webp';jaguar.alt='';jaguar.width=112;jaguar.height=83;
  const body=el('div');const title=el('h2'),hint=el('p');hint.setAttribute('aria-live','polite');
  const actions=el('div','','guide-actions');const next=el('button','Ver guía'),close=el('button','Cerrar');
  const label=el('label'),omit=el('input');omit.type='checkbox';label.append(omit,' No volver a mostrar');
  body.append(title,hint,actions,label);actions.append(next,close);box.append(jaguar,body);
  const intro=document.querySelector('.explore-intro,.entry-invitation')||header;
  intro.after(box);let step=-1,marked=null,returnY=0;
  const touch=window.matchMedia('(pointer:coarse)').matches,verb=touch?'Toca':'Selecciona';
  const learning=!!document.querySelector('#hotspots');
  const steps=learning?[
    ['[data-mode="paisaje"]','Recorrer los ejes',verb+' Recorrer los ejes para elegir entre emociones, cuidado, apoyo y sustancias.'],
    ['[data-mode="buscar"]','Buscar un tema','Puedes escribir una palabra o una frase, como «quiero hablar con alguien».'],
    ['.landmark','Leer a tu ritmo',touch?'Toca una lámina para abrirla. Cambia de paisaje con los botones o deslizando sobre la fotografía.':'Abre las láminas con clic o con Tab y Enter. Escape cierra la lectura.'],
    ['.app-nav a[href="apoyo.html"]','Encontrar apoyo','Apoyo abre las opciones de acompañamiento desde cualquier página.']
  ]:[['.app-nav a[href="aprender.html"]','Entrar al territorio',verb+' Aprender para explorar el paisaje o buscar una lectura.'],['.app-nav a[href="apoyo.html"]','Encontrar compañía','Apoyo te lleva directamente a las opciones de orientación.']];
  const ns='http://www.w3.org/2000/svg';
  const leader=document.createElementNS(ns,'svg'),line=document.createElementNS(ns,'path'),dot=document.createElementNS(ns,'circle');
  leader.setAttribute('class','guide-leader');leader.setAttribute('aria-hidden','true');
  line.setAttribute('fill','none');line.setAttribute('stroke','#935815');line.setAttribute('stroke-width','3');line.setAttribute('stroke-dasharray','6 4');
  dot.setAttribute('r','5');dot.setAttribute('fill','#935815');leader.append(line,dot);
  function direct(){
    if(!marked||box.hidden)return;
    const target=marked.getBoundingClientRect(),frame=box.getBoundingClientRect(),paw=jaguar.getBoundingClientRect();
    const x=target.left+target.width/2,y=target.top>frame.top?target.top:target.bottom;
    const startX=paw.width?paw.left+paw.width*.7:frame.left+18,startY=target.top>frame.top?frame.bottom:frame.top;
    line.setAttribute('d','M '+startX+' '+startY+' Q '+startX+' '+(startY+y)/2+' '+x+' '+y);
    dot.setAttribute('cx',x);dot.setAttribute('cy',y);
  }
  window.addEventListener('resize',direct);window.addEventListener('scroll',direct,{passive:true});
  function clear(){leader.remove();marked?.classList.remove('guide-target');marked=null;}
  function finish(){const guided=step>=0;clear();box.hidden=true;box.classList.remove('guiding');step=-1;if(guided)window.scrollTo({top:returnY,behavior:'instant'});launch.focus({preventScroll:true});}
  function show(){clear();box.hidden=false;box.classList.toggle('guiding',step>=0);label.hidden=step>=0;
    if(step<0){title.textContent='¿Un recorrido breve?';hint.textContent='Conoce las formas de explorar y dónde encontrar apoyo.';next.textContent='Ver guía';return;}
    const [selector,heading,text]=steps[step];marked=document.querySelector(selector);
    if(!marked||marked.closest('[hidden]')){if(step<steps.length-1){step++;show();}else finish();return;}
    marked.classList.add('guide-target');marked.scrollIntoView({block:'center',behavior:'instant'});
    const rect=marked.getBoundingClientRect();box.classList.toggle('guide-on-top',rect.top>window.innerHeight*.60);box.classList.toggle('guide-look-left',rect.left+rect.width/2<window.innerWidth/2);title.textContent=heading;hint.textContent=text;next.textContent=step===steps.length-1?'Terminar':'Siguiente';next.focus({preventScroll:true});document.body.append(leader);requestAnimationFrame(direct);
  }
  next.onclick=()=>{if(step===steps.length-1)finish();else{if(step<0)returnY=window.scrollY;step++;show();}};close.onclick=finish;
  launch.onclick=()=>{if(!box.hidden&&step>=0){finish();return;}returnY=window.scrollY;step=0;show();};
  omit.onchange=()=>{try{if(omit.checked)localStorage.setItem(key,'1');else localStorage.removeItem(key);}catch{}};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.hidden){finish();}});
  let suppressed=false;try{suppressed=localStorage.getItem(key)==='1'||sessionStorage.getItem('territorio.invitacionVista')==='1';}catch{}
  if(!suppressed&&learning){show();try{sessionStorage.setItem('territorio.invitacionVista','1');}catch{}}
})();