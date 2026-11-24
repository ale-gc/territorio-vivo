/* Cuatro mecánicas educativas locales. Situaciones ficticias; sin resultados personales. */
(()=>{
 const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
 if(!$('#eje1'))return;
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 function button(text,fn,cls){const b=el('button',text,cls);b.type='button';b.addEventListener('click',fn);return b;}
 const stops=all('#ruta-cuidado [data-momento]');
 const routeNav=$('.ruta-paradas');
 function openStop(index){
   stops.forEach((stop,i)=>{
     stop.hidden=i!==index;
     routeNav.children[i].setAttribute('aria-pressed',String(i===index));
   });
 }
 stops.forEach((stop,i)=>{
   const control=button(stop.dataset.momento,()=>openStop(i));
   control.setAttribute('aria-controls',stop.id);
   routeNav.append(control);
 });
 openStop(0);
 function activity(axis,title,instruction,render){
   const cases=window.CasosEducativos[axis],box=el('section','','playground');
   box.dataset.experience=axis;
   const name=el('h3',title),label=el('label','Elige una situación','case-label'),picker=el('select','','case-picker');
   label.htmlFor=picker.id='caso-'+axis;
   cases.forEach((c,i)=>{const option=el('option',c.nombre);option.value=String(i);picker.append(option);});
   const lead=el('div','','case-lead'),picture=el('img'),narrative=el('p');
   picture.alt='';picture.width=128;picture.height=128;picture.loading='lazy';lead.append(picture,narrative);
   const board=el('div','','play-board'),state=el('p','','play-feedback'),controls=el('div','','case-actions');
   state.setAttribute('role','status');const note=el('a','Fuentes y créditos','play-source text-link');note.href='acerca.html#procedencia';
   const walk=el('div','','game-walk'),prompt=el('p'),cat=el('img');
   cat.src='assets/img/estudios/jaguar.webp';cat.alt='';cat.width=64;cat.height=48;
   prompt.setAttribute('aria-live','polite');
   const guideSteps={
     1:[['.phrase','Elige una frase.'],['.drop-zone>button','Ahora elige dónde la pondrías. Puedes cambiarla después.']],
     2:[['.sequence-piece:nth-of-type(2) .sequence-handle','Toca este paso para colocarlo al comienzo.'],['.play-primary','Lee lo que cambia con tu nuevo orden.']],
     3:[['.story-choice','Elige qué dirías. Arriba quedará lo que elegiste y debajo verás qué ocurrió.'],['.story-choice','Elige cómo seguir. Al final puedes volver atrás.']],
     4:[['input[type=range]','Mueve la lupa hacia otra parte del mensaje.'],['.case-actions .story-choice','Elige qué harías con lo que descubriste.']]
   }[axis];
   let guideStep=guideSteps.length;
   function point(scroll=false){
     box.querySelectorAll('.play-target').forEach(n=>n.classList.remove('play-target'));
     const step=guideSteps[guideStep];
     const fallback=step && axis===3 && !board.querySelector('.story-choice');
     const target=step&&(fallback?controls.querySelector('.story-back'):box.querySelector(step[0]));
     walk.hidden=!target;
     if(!target)return;
     prompt.textContent=fallback?'Ya viste este desenlace. Vuelve una decisión para explorar qué pasaría al responder de otra manera.':step[1];target.classList.add('play-target');
     const row=target.closest('.sequence-piece,.drop-zone')||target;
     row.before(walk);
     if(scroll)walk.scrollIntoView({block:'center',behavior:'instant'});
   }
   const replay=button('Ver cómo se hace',()=>{guideStep=0;point(true);});
   walk.append(cat,prompt,button('Omitir',()=>{guideStep=guideSteps.length;point();}));
   box.addEventListener('click',event=>{
     const step=guideSteps[guideStep];
     if(step&&(event.target.closest(step[0])||event.target.closest('.play-target'))){guideStep++;queueMicrotask(()=>point());}
   },true);
   box.addEventListener('input',event=>{if(axis===4&&guideStep===0&&event.target.type==='range'){guideStep++;point();}});
   const instructionLine=el('p',instruction,'play-instruction');
   const library=el('details','','case-library'),libraryTitle=el('summary');
   const chooseTitle=axis===3?'Elegir una historia':'Cambiar de mensaje';
   libraryTitle.textContent=chooseTitle;library.append(libraryTitle);
   function selectCase(i){
     start(i);library.open=false;replay.hidden=false;instructionLine.hidden=false;board.hidden=false;controls.hidden=false;lead.hidden=false;
     narrative.tabIndex=-1;narrative.focus({preventScroll:true});
   }
   cases.forEach((c,i)=>{const b=button(c.nombre,()=>selectCase(i));b.dataset.caseIndex=String(i);library.append(b);});
   box.append(name);
   if(axis<=2)box.append(label,picker);else box.append(library);
   box.append(lead,instructionLine,replay,board,state,controls,note);if(axis===2){const options=el('details','','sequence-options');options.append(el('summary','Cambiar de situación'),label,picker);box.insertBefore(options,note);}
   const anchor=$('[data-activity="'+axis+'"]');anchor.before(box);
   const old=el('details','','previous-reading');old.append(el('summary','Explorar otras perspectivas'));anchor.replaceWith(old);old.append(anchor);
   function start(i){const c=cases[i];picture.src='assets/img/estudios/'+c.arte+'.webp';narrative.textContent=c.escena;
     board.replaceChildren();board.after(state);board.removeAttribute('data-connected');controls.replaceChildren();state.textContent='';
     box.dataset.caseIndex=String(i);libraryTitle.textContent=chooseTitle+' · '+c.nombre;render({box,board,state,controls},c);guideStep=guideSteps.length;point();}
   picker.addEventListener('change',()=>start(Number(picker.value)));
   if(axis===3){
     library.open=true;lead.hidden=instructionLine.hidden=replay.hidden=board.hidden=controls.hidden=true;
   }else start(0);
 }
 // Puntero y alternativa de dos toques: ningún contenido depende de arrastrar.
 function draggable(item,onDrop){
  let start=null,ghost=null;
  item.addEventListener('pointerdown',e=>{if(e.button>0)return;start={x:e.clientX,y:e.clientY};});
  item.addEventListener('pointermove',e=>{
   if(!start)return;
   if(!ghost&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>8){ghost=item.cloneNode(true);ghost.className='drag-ghost';ghost.setAttribute('aria-hidden','true');document.body.append(ghost);item.setPointerCapture?.(e.pointerId);}
   if(ghost){ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`;}
  });
  const finish=e=>{if(ghost){ghost.remove();ghost=null;const target=document.elementFromPoint?.(e.clientX,e.clientY)?.closest('[data-drop]');if(target&&item.closest('.play-board')?.contains(target))onDrop(target.dataset.drop);}start=null;};
  item.addEventListener('pointerup',finish);item.addEventListener('pointercancel',()=>{ghost?.remove();ghost=null;start=null;});
 }
 // 1. Clasificación manipulable: comparar una lectura posible, no puntuar.
 activity(1,'Desarma una discusión','Lee la frase marcada. Toca Sentir, Pensar o Actuar para colocarla. Puedes escoger otra frase o moverla después.',({board,state,controls},c)=>{
  const phrases=c.piezas;let selected=phrases[0][0],places={};const tray=el('div','','phrase-tray'),zones=el('div','','drop-zones');board.append(tray,zones);
  function move(id,zone){if(!['sentir','pensar','actuar'].includes(zone))return;places[id]=zone;selected=phrases.find(p=>!places[p[0]])?.[0];draw();board.querySelector(`[data-piece="${id}"]`).focus({preventScroll:true});const piece=phrases.find(p=>p[0]===id);const labels={sentir:'Sentir',pensar:'Pensar',actuar:'Actuar'};
    const moved=board.querySelector('[data-piece="'+id+'"]');
    moved.after(state);
    state.textContent=(piece[2]===zone?'Encaja en '+labels[zone]+'. ':'La pusiste en '+labels[zone]+'. En esta escena encaja mejor en '+labels[piece[2]]+'. ')+piece[3]+(selected?' Sigue con '+phrases.find(p=>p[0]===selected)[1]+'.':'');}
  function draw(){board.after(state);tray.replaceChildren();zones.replaceChildren();zones.removeAttribute('data-compared');
   const containers={};for(const [id,label]of [['sentir','Sentir'],['pensar','Pensar'],['actuar','Actuar']]){const z=el('div','','drop-zone');z.dataset.drop=id;z.append(button(label,()=>{if(selected)move(selected,id);else state.textContent='Primero elige una frase de la escena.';}));zones.append(z);containers[id]=z;}
   for(const [id,text,lens]of phrases){const b=button(text,()=>{selected=id;tray.after(state);all('[data-piece]').forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.piece===id)));state.textContent='Ahora elige Sentir, Pensar o Actuar.';},'phrase');if(places[id] && places[id]!==lens)b.append(el('small','En esta escena encaja en '+lens+'.','piece-hint'));b.dataset.piece=id;b.setAttribute('aria-pressed',String(id===selected));draggable(b,zone=>move(id,zone));(containers[places[id]]||tray).append(b);}
  }
  controls.append(button('Comparar una lectura posible',()=>{
   board.after(state);if(Object.keys(places).length<phrases.length){state.textContent='Todavía quedan frases en la mesa. Ubícalas para comparar lo que sintió, lo que pensó y lo que hizo.';return;}
   const different=phrases.find(([id,,lens])=>places[id]!==lens);
   state.textContent='Una lectura posible. '+c.cierre+(different?' Mira de nuevo «'+different[1].replace(/[«»]/g,'')+'». '+different[3]:' Puedes mover una frase para ver qué cambia al leerla desde otro lugar.');
   zones.dataset.compared='true';
  },'play-primary'),button('Vaciar la mesa',()=>{selected=phrases[0][0];places={};draw();state.textContent='Mesa vacía. Puedes probar otra distribución.';}));
  draw();
 });
 activity(2,'Construye una conversación','¿Por dónde empezarías? Toca un paso para ponerlo primero. Con Subir y Bajar puedes ajustar el resto.',({board,state,controls},c)=>{
  const ids=['observar','escuchar','acordar'];let order=['acordar','observar','escuchar'];const names=Object.fromEntries(ids.map((id,i)=>[id,c.pasos[i]]));
  function move(id,to){const from=order.indexOf(id),target=typeof to==='number'?to:order.indexOf(to);if(target<0||target>=order.length||from===target)return;order.splice(from,1);order.splice(target,0,id);board.removeAttribute('data-connected');draw();board.querySelector('[data-drop="'+id+'"]').after(state);describeOrder();}
  function describeOrder(){state.textContent=c.efecto[ids.indexOf(order[0])]+' '+c.final[ids.indexOf(order[2])];}
  function draw(){board.after(state);board.replaceChildren();order.forEach((id,i)=>{const row=el('div','','sequence-piece');row.dataset.drop=id;const handle=button(`${i+1}. ${names[id]}`,()=>{if(i>0){move(id,0);board.querySelector('.sequence-handle').focus({preventScroll:true});}else{row.after(state);describeOrder();}},'sequence-handle');draggable(handle,to=>move(id,to));row.append(handle,button('Subir',()=>{move(id,i-1);board.querySelectorAll('.sequence-piece')[Math.max(0,i-1)].querySelector('button').focus({preventScroll:true});}),button('Bajar',()=>{move(id,i+1);board.querySelectorAll('.sequence-piece')[Math.min(2,i+1)].querySelector('button').focus({preventScroll:true});}));row.children[1].disabled=i===0;row.children[2].classList.add('move-down');row.children[2].disabled=i===2;board.append(row);});}
  controls.append(button('Recorrer mi secuencia',()=>{board.dataset.connected='true';controls.after(state);state.replaceChildren();
    const moments=[['Al empezar',c.efecto],['En medio',c.puente],['Al cerrar',c.final]];
    moments.forEach(([label,effects],i)=>{
      const line=el('p');line.append(el('strong',label+' · '),effects[ids.indexOf(order[i])]);state.append(line);
    });
  },'play-primary'),button('Reiniciar piezas',()=>{order=['acordar','observar','escuchar'];board.removeAttribute('data-connected');draw();state.textContent='Prueba otra organización.';}));
  draw();
 });
 activity(3,'Un mensaje, varios caminos','Elige cómo abrir la conversación. Puedes volver una decisión y descubrir qué cambia.',({box,board,state,controls},c)=>{
  const story={inicio:{text:c.inicio,choices:[[c.izq,'escucha'],[c.der,'red'],[c.otro[0],'tropiezo']]},escucha:{text:c.a,feedback:c.miradas[0],choices:[[c.acciones[0],'compania'],[c.acciones[1],'eleccion']]},red:{text:c.b,feedback:c.miradas[1],choices:[[c.acciones[2],'confianza'],[c.acciones[3],'salud']]}};
  story.tropiezo={text:c.otro[1],choices:[[c.otro[2],'reparar']]};
  story.reparar={text:c.otro[3],end:true};
  ['compania','eleccion','confianza','salud'].forEach((id,i)=>story[id]={text:c.cierres[i],end:true});
  let lastEnding=null;let history=['inicio'];board.setAttribute('aria-live','polite');
  function draw(){state.textContent='';const id=history.at(-1),s=story[id];const back=controls.querySelector('.story-back');if(back)back.disabled=history.length<2;board.replaceChildren();if(history.length>1){const previous=story[history.at(-2)].choices.find(choice=>choice[1]===id);board.append(el('p',previous[0],'story-sent'));}board.append(el('p',s.text,'story-text'));if(s.feedback)board.append(el('p',s.feedback,'story-reflection'));for(const [label,to]of s.choices||[])board.append(button(label,()=>{history.push(to);draw();board.querySelector('.story-text').setAttribute('tabindex','-1');board.querySelector('.story-text').focus({preventScroll:true});},'story-choice'));if(s.end){if(lastEnding&&lastEnding!==id){const comparison=el('details','','path-comparison');comparison.open=true;comparison.append(el('summary','El otro camino que probaste'),el('p',story[lastEnding].text));board.append(comparison);}lastEnding=id;board.append(el('p','Puedes volver una decisión y comparar qué ayuda se hizo posible.','story-ending'));const link=el('a','Ver recursos de apoyo ↗','text-link');link.href='apoyo.html';board.append(link,button('Elegir otra historia',()=>{const menu=box.querySelector('.case-library');menu.open=true;menu.querySelector('button').focus();},'text-link'));}box.dataset.branch=id;}
  controls.append(button('Volver una decisión',()=>{if(history.length>1)history.pop();draw();state.textContent='Volviste al momento anterior de la conversación.';},'story-back'),button('Repetir esta historia',()=>{history=['inicio'];draw();state.textContent='La conversación vuelve a su comienzo.';const text=board.querySelector('.story-text');text.tabIndex=-1;text.focus();}));draw();
 });
 activity(4,'La lupa del contexto','Toca una parte del mensaje para ver su pista. Después decide qué harías. También puedes mover la lupa.',({board,state,controls},c)=>{
  const poster=el('div','','context-poster');const words=c.zonas;words.forEach((w,i)=>{const z=button(w,()=>reveal([0,50,100][i]),'poster-zone');z.dataset.zone=i;poster.append(z);});
  const lens=el('span','','context-lens');lens.setAttribute('aria-hidden','true');poster.append(lens);
  const label=el('label','Posición de la lupa');label.htmlFor='lupa-posicion';const range=el('input');range.id='lupa-posicion';range.type='range';range.min='0';range.max='100';range.value='0';range.setAttribute('aria-describedby','lupa-desc');
  const desc=el('p','La lupa muestra una pista en cada una de las tres partes del mensaje.');desc.id='lupa-desc';const seen=new Set();
  const explanations=c.lecturas;
  function reveal(value){const v=Math.max(0,Math.min(100,Number(value)));range.value=String(v);range.setAttribute('aria-valuetext',words[Math.min(2,Math.floor(v/34))]);poster.style.setProperty('--lens',`${10+v*.8}%`);const zone=Math.min(2,Math.floor(v/34));seen.add(zone);poster.querySelectorAll('.poster-zone').forEach((z,i)=>{z.dataset.revealed=String(seen.has(i));z.dataset.current=String(i===zone);z.setAttribute('aria-pressed',String(i===zone));});controls.querySelectorAll('.story-choice').forEach(b=>b.setAttribute('aria-pressed','false'));desc.after(state);state.textContent=words[zone]+'. '+explanations[zone]+(seen.size===3?' Puedes comparar las pistas y decidir qué harías.':'');}
  range.addEventListener('input',()=>reveal(range.value));
  let dragging=false;function point(e){const rect=poster.getBoundingClientRect();if(rect.width)reveal((e.clientX-rect.left)/rect.width*100);}
  poster.addEventListener('pointerdown',e=>{dragging=true;if(!e.target.closest('button'))poster.setPointerCapture?.(e.pointerId);point(e);});poster.addEventListener('pointermove',e=>{if(dragging)point(e);});poster.addEventListener('pointerup',()=>{dragging=false;});poster.addEventListener('pointercancel',()=>{dragging=false;});
  board.append(poster,label,range,desc);
  const actions=c.respuesta.map((label,i)=>button(label,event=>{
    actions.forEach(b=>b.setAttribute('aria-pressed',String(b===event.currentTarget)));
    event.currentTarget.after(state);
    state.textContent=c.fin[i];
  },'story-choice'));
  controls.append(...actions,button('Volver a observar',()=>{seen.clear();reveal(0);}));
  reveal(0);
 });
})();
