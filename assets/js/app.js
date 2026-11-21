/* ALUNA · Sin cuentas, almacenamiento, analítica ni peticiones de datos. */
'use strict';
(() => {
  const data = window.ALUNA;
  if (!data || !document.querySelector('#hotspots')) return;
  const $ = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const scene = $('#territorio'), panel = $('#panel-detalle');
  const catalogSheet = $('#lectura-catalogo');
  const landscapeSlot = panel.parentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let origin = null, currentScene = 'bosque', currentConcept = null, paused = reduced.matches;
  const scenes = {
    bosque: {image:'sierra-nevada-taggen.jpg',title:'Entre bosque y montaña',number:'01 / 03',alt:'Bosque y cumbres de la Sierra Nevada de Santa Marta, fotografía de Taggen',points:[['preocupacion','Neblina',25,36,'niebla'],['tristeza-profunda','Noche y pensamiento',73,24,'noche'],['rabia','Fuego y rabia',70,65,'fuego'],['firmeza','Tierra y firmeza',26,72,'tierra']]},
    flores: {image:'bosque-neblina.jpg',title:'Plantas, flores y viento',number:'02 / 03',alt:'Bosque entre neblina, fondo ilustrativo para explorar plantas y viento',points:[['calma','Flores y frescura',24,39,'manzanilla'],['esperanza','Árboles y alivio',73,59,'arbol'],['alegria','Alegría',27,73,'palabra'],['nikuma','Cuidar en relación',73,22,'viento']]},
    rio: {image:'rio-bosque.jpg',title:'La palabra y los vínculos',number:'03 / 03',alt:'Un río discurre entre árboles y rocas; fotografía de naturaleza ilustrativa',points:[['tristeza-perdida','Ante una pérdida',27,31,'agua'],['celos','Celos',73,48,'palabra'],['chismes','La palabra',29,72,'palabra']]}
  };
  function mini(file){return window.Miniaturas?.[file] || 'assets/img/'+file;}
  document.addEventListener('error',event=>{
    const image=event.target;
    if(image.tagName!=='IMG')return;
    const file=image.getAttribute('src')?.split('assets/img/')[1];
    if(file && window.Miniaturas?.[file])image.src=mini(file);
  },true);
  function node(tag,text,cls) {
    const el=document.createElement(tag);
    if(text) el.textContent=text;
    if(cls) el.className=cls;
    return el;
  }
  function closePanel(restore=true) {
    panel.hidden=true; panel.classList.remove('abierto'); scene.classList.remove('is-focused');
    if(panel.parentElement === catalogSheet){
      if(catalogSheet.open) catalogSheet.close();
      document.documentElement.classList.remove('leyendo-catalogo');
      landscapeSlot.append(panel);
    } else if(panel.parentElement !== landscapeSlot) {
      landscapeSlot.append(panel);
    }
    all('[data-concept]').forEach(b=>b.setAttribute('aria-expanded','false'));
    currentConcept=null;
    scene.removeAttribute('data-reading');
    if(restore && origin?.isConnected) origin.focus({preventScroll:true});
  }
  function changeScene(id) {
    const info=scenes[id]; if(!info)return;
    closePanel(false); currentScene=id; scene.dataset.ambiente=id;
    $('#paisaje').onload=null;
    $('#paisaje').src=`assets/img/${info.image}`; $('#paisaje').alt=info.alt;
    $('#paisaje').onload=()=>{if(!paused && typeof $('#paisaje').animate==='function')$('#paisaje').animate([{opacity:.55},{opacity:1}],{duration:500,easing:'ease-out'});};
    $('#scene-number').textContent=info.number; $('#scene-title').textContent=info.title;
    const credit=$('.landscape-credit');
    if(credit){credit.firstChild.textContent=id==='bosque'?'Sierra Nevada: Taggen · CC BY-SA 3.0. ':'Naturaleza ilustrativa · Pexels. ';}
    all('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===id)));
    const wrap=$('#hotspots'); wrap.replaceChildren();
    info.points.forEach(([conceptId,label,x,y,visual])=>{
      const b=node('button','','landmark element-'+visual); b.type='button';
      b.style.setProperty('--x',`${x}%`);b.style.setProperty('--y',`${y}%`);
      b.dataset.concept=conceptId;b.setAttribute('aria-controls',conceptId==='nikuma'?'eje2':'panel-detalle');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label',`Explorar ${label}`);
      const figure=node('img','','landmark-figure');figure.src=mini(data.conceptos.find(c=>c.id===conceptId)?.imagen || 'estudios/viento.webp');figure.alt='';figure.width=172;figure.height=132;
      b.append(figure,node('span',label,'landmark-label'));b.addEventListener('click',()=>openConcept(conceptId,b));wrap.append(b);
    });
  }
  function renderReading(c,key) {
    const reading=$('#pd-cuerpo');reading.replaceChildren();
    if(key==='significado') {
      const view=node('div','','concept-composition'),figure=node('img');figure.src=mini(c.imagen);figure.alt=c.alt;figure.width=172;figure.height=132;
      view.append(figure,node('p',c.resumen));reading.append(view,node('p',c.pregunta,'reflection-prompt'));
      const more=node('details','','reading-more');more.append(node('summary','Profundizar'),node('p',c.significado));reading.append(more);
      const source=node('a',c.fuente_breve,'reading-source text-link');
      source.href='acerca.html#procedencia';reading.append(source);
      const action=node('button','Explorar con una actividad','play-primary');
      action.addEventListener('click',()=>{cerrarActividad(c.eje);});reading.append(action);
      if(c.id==='calma'||c.id==='esperanza'){
        const botanical=node('details','','botanical');const photo=node('img');photo.src='assets/img/manzanilla-tulumnes.jpg';photo.alt='Flor rotulada como Matricaria chamomilla por su autor, Tulumnes';photo.width=500;photo.height=513;photo.loading='lazy';
        botanical.append(node('summary','Observar la flor'),photo,node('p','El autor identifica esta flor como manzanilla. La identificación botánica del relato sigue abierta.'),node('a','Fotografía: Tulumnes · CC BY-SA 4.0','text-link'));
        botanical.lastChild.href='https://commons.wikimedia.org/wiki/File:Matricaria_chamomilla_flower.jpg';reading.append(botanical);
      }
    } else if(key==='situacion') {
      reading.append(node('p',c.situacion),node('p',c.pregunta,'reflection-prompt'),node('p','Escena imaginada para esta lectura.','source'));
    } else {
      reading.append(node('p',c.cuidado));const link=node('a','Encontrar acompañamiento ↗','text-link');link.href='apoyo.html';
      reading.append(link);
    }
  }
  function cerrarActividad(axis){closePanel(false);setMode(false);const url=new URL(location.href);url.hash='';history.replaceState(null,'',url);setEje(String(axis));const target=document.querySelector(`[data-experience="${axis}"]`);if(target){target.setAttribute('tabindex','-1');target.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});target.focus({preventScroll:true});}}
  function openConcept(id,trigger) {
    if(id==='nikuma'){setEje('2',true);return;}
    const c=data.conceptos.find(c=>c.id===id);if(!c)return;
    if(currentConcept===id && trigger?.classList.contains('landmark')){closePanel();return;}
    const fromIndex = trigger?.classList.contains('concept-row');
    const compactMap=!fromIndex && window.matchMedia('(max-width:649px)').matches && typeof catalogSheet.showModal==='function';
    if(fromIndex){
      if(typeof catalogSheet.showModal === 'function') catalogSheet.append(panel);
      else trigger.after(panel);
    } else {
      if(panel.parentElement !== landscapeSlot) closePanel(false);
      if(currentScene!==c.escena)changeScene(c.escena);
      if(compactMap)catalogSheet.append(panel);
    }
    origin=trigger||document.activeElement;currentConcept=id;
    all('[data-concept]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.concept===id)));
    $('#pd-eyebrow').textContent=`Eje ${c.eje} · ${c.tipo}`;$('#pd-titulo').textContent=c.nombre;
    $('#pd-kogui').textContent=c.termino_documental && c.id!=='tristeza-profunda' ? c.categoria+' · '+c.termino_documental : c.categoria;
    const tabs=$('#pd-tabs');tabs.replaceChildren();
    [['significado','Comprender'],['situacion','En lo cotidiano'],['cuidado','Cuidar']].forEach(([key,label],i)=>{
      const b=node('button',label,'pd-tab');b.type='button';b.setAttribute('aria-pressed',String(i===0));
      b.addEventListener('click',()=>{[...tabs.children].forEach(t=>t.setAttribute('aria-pressed',String(t===b)));renderReading(c,key);});tabs.append(b);
    });
    renderReading(c,'significado');panel.hidden=false;panel.classList.add('abierto');panel.scrollTop=0;
    if(fromIndex || compactMap){
      if(panel.parentElement === catalogSheet && !catalogSheet.open){
        document.documentElement.classList.add('leyendo-catalogo');
        catalogSheet.showModal();catalogSheet.scrollTop=0;catalogSheet.classList.toggle('map-sheet',compactMap);
      }
    } else {
      scene.classList.add('is-focused');scene.dataset.reading=c.visual;

    }
    $('#pd-titulo').focus({preventScroll:true});
  }
  function renderIndex(query='') {
    if(panel.parentElement !== landscapeSlot) closePanel(false);
    const category = $('#categoria').value;
    const matches=window.BusquedaLocal.buscar(data,query).filter(({concepto})=>!category || concepto.categoria===category);
    const wrap=$('#conceptos');wrap.replaceChildren();
    matches.forEach(({concepto:c,motivo})=>{
      const b=node('button','','concept-row');b.type='button';b.dataset.concept=c.id;b.setAttribute('aria-controls','panel-detalle');b.setAttribute('aria-expanded',String(currentConcept===c.id));
      const copy=node('span');copy.append(node('strong',c.nombre),node('small',motivo));
      const sketch=node('img');sketch.src=mini(c.imagen);sketch.alt='';sketch.width=76;sketch.height=60;sketch.loading='lazy';
      const arrow=node('span','↗','row-arrow');arrow.setAttribute('aria-hidden','true');b.append(sketch,copy,arrow);
      b.addEventListener('click',()=>openConcept(c.id,b));wrap.append(b);
    });
    $('#busqueda-apoyo').hidden=!matches.some(({concepto})=>concepto.id==='acompanamiento')||!query.trim();
    $('#resultados').textContent=matches.length?`${matches.length} conceptos y experiencias disponibles`:'No hay coincidencias. Prueba con otra palabra.';
  }
  function setEje(id,scroll=false) {
    if(!['1','2','3','4'].includes(String(id)))id='1';
    closePanel(false);$('.territorio').hidden=String(id)!=='1';all('.eje-content').forEach(s=>s.hidden=s.id!==`eje${id}`);
    all('[data-eje]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.eje===String(id)));b.setAttribute('aria-controls',`eje${b.dataset.eje}`);});
    if(scroll)$('.ejes-nav').scrollIntoView({block:'nearest',behavior:'instant'});
    const url=new URL(location.href);url.searchParams.set('eje',id);if(scroll)url.hash='';history.replaceState(null,'',url);
    if(scroll){const heading=$(`#eje${id}-title`);heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  }
  function updateMotion(){scene.classList.toggle('motion-paused',paused);$('#movimiento').textContent=paused?'Transiciones: reducidas':'Transiciones: activadas';$('#movimiento').setAttribute('aria-pressed',String(paused));}
  reduced.addEventListener('change',e=>{paused=e.matches;updateMotion();});
  $('#movimiento').addEventListener('click',()=>{paused=!paused;updateMotion();});
  $('#panel-cierre').addEventListener('click',()=>closePanel());
  catalogSheet.addEventListener('click',e=>{if(e.target!==catalogSheet)return;const r=catalogSheet.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePanel();});
  catalogSheet.addEventListener('cancel',e=>{e.preventDefault();closePanel();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();closePanel();}});
  all('[data-scene]').forEach(b=>b.addEventListener('click',()=>changeScene(b.dataset.scene)));
  all('[data-eje]').forEach(b=>b.addEventListener('click',()=>setEje(b.dataset.eje,true)));
  $('#buscar').addEventListener('input',e=>renderIndex(e.target.value));
  for(const category of new Set(data.conceptos.map(c=>c.categoria))){
    const option=node('option',category);option.value=category;$('#categoria').append(option);
  }
  $('#categoria').addEventListener('change',()=>renderIndex($('#buscar').value));
  $('#reflexion').addEventListener('click',()=>{const open=$('#reflexion').getAttribute('aria-expanded')==='true';$('#reflexion').setAttribute('aria-expanded',String(!open));$('#reflexion-texto').hidden=open;$('#reflexion').textContent=open?'Abrir la reflexión':'Cerrar la reflexión';});
  let gesture=null;
  scene.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch' && !e.target.closest('button,#panel-detalle'))gesture={x:e.clientX,y:e.clientY};
  });
  scene.addEventListener('pointercancel',()=>{gesture=null;});
  scene.addEventListener('pointerup',e=>{
    if(!gesture)return;
    const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;
    if(Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.5){const ids=Object.keys(scenes);changeScene(ids[(ids.indexOf(currentScene)+(dx<0?1:2))%3]);}
  });
  function setMode(search){
    closePanel(false);
    $('#recorridos').hidden=search;
    $('#indice').hidden=!search;
    all('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.mode==='buscar')===search)));
  }
  all('[data-mode]').forEach(b=>b.addEventListener('click',()=>{
    const search=b.dataset.mode==='buscar';setMode(search);
    const url=new URL(location.href);url.hash=search?'indice':'';history.replaceState(null,'',url);
    if(search)$('#buscar').focus({preventScroll:true});
  }));
  function openAnchor(){setMode(location.hash==='#indice');if(location.hash==='#procedencia')location.replace('acerca.html#procedencia');}
  window.addEventListener('hashchange',openAnchor);
  // Cuatro actividades de comprensión: exploración libre, sin resultados personales.
  data.actividades.forEach(activity=>{
    const host=$(`[data-activity="${activity.id}"]`);if(!host)return;
    host.append(node('p','Para comprender · Explora sin responder','eyebrow'),node('h3',activity.titulo),node('p',activity.intro));
    const controls=node('div','','activity-controls'),stage=node('div','','activity-stage');
    stage.setAttribute('aria-live','polite');stage.id=`actividad-${activity.id}`;
    function show(i){
      const step=activity.pasos[i];stage.replaceChildren();
      [...controls.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
      const image=node('img','','activity-image');image.src='assets/img/'+({fuego:'estudios/fuego.webp',palabra:'estudios/escucha.webp',arbol:'estudios/arbol.webp',tierra:'estudios/tierra.webp',viento:'estudios/viento.webp',agua:'estudios/compania.webp'}[step.visual]||'estudios/contrastar.webp');image.alt='';image.width=172;image.height=132;
      const copy=node('div');copy.append(node('h4',step.titulo),node('p',step.texto),node('p',step.pregunta,'reflection-prompt'));stage.append(image,copy);
    }
    activity.pasos.forEach((step,i)=>{const b=node('button',step.label);b.type='button';b.setAttribute('aria-controls',stage.id);b.addEventListener('click',()=>show(i));controls.append(b);});
    host.append(controls,stage);show(0);
  });

  let suggestion=0;
  $('#recorrer').addEventListener('click',()=>{
    const ids=['preocupacion','rabia','firmeza','calma','esperanza','tristeza-perdida'];
    openConcept(ids[suggestion%ids.length],$('#recorrer'));suggestion++;
  });
  const treeQuestions={raices:'Los vínculos pueden sostener: ¿a quién podríamos pedir compañía?',ramas:'Puede haber distintas opciones: ¿qué alternativas de cuidado caben en una situación?',copa:'Antes de responder, observa: ¿qué sabemos y qué estamos suponiendo?'};
  all('[data-tree]').forEach(b=>b.addEventListener('click',()=>{
    all('[data-tree]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));
    $('.tree-workbench').dataset.part=b.dataset.tree;$('#tree-question').textContent=treeQuestions[b.dataset.tree];
  }));

  changeScene('bosque');renderIndex();updateMotion();setEje(new URL(location.href).searchParams.get('eje')||'1');
  openAnchor();
})();
