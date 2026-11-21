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
     2:[['.move-down','Baja la primera pieza para cambiar el comienzo.'],['.play-primary','Recorre tu secuencia para ver qué cambia.']],
     3:[['.story-choice','Elige qué dirías primero.'],['.story-choice','La otra persona respondió. Elige cómo seguir.']],
     4:[['input[type=range]','Mueve la lupa hacia otra parte del mensaje.'],['.case-actions .story-choice','Elige qué harías con lo que descubriste.']]
   }[axis];
   let guideStep=0;
   function point(scroll=false){
     box.querySelectorAll('.play-target').forEach(n=>n.classList.remove('play-target'));
     const step=guideSteps[guideStep],target=step&&box.querySelector(step[0]);
     walk.hidden=!target;
     if(!target)return;
     prompt.textContent=step[1];target.classList.add('play-target');
     const row=target.closest('.sequence-piece,.drop-zone')||target;
     row.before(walk);
     if(scroll)walk.scrollIntoView({block:'center',behavior:'instant'});
   }
   const replay=button('Ver cómo se hace',()=>{guideStep=0;point(true);});
   walk.append(cat,prompt,button('Omitir',()=>{guideStep=guideSteps.length;point();}));
   box.addEventListener('click',event=>{
     const step=guideSteps[guideStep];
     if(step&&event.target.closest(step[0])){guideStep++;queueMicrotask(()=>point());}
   },true);
   box.addEventListener('input',event=>{if(axis===4&&guideStep===0&&event.target.type==='range'){guideStep++;point();}});
   box.append(name,label,picker,lead,replay,el('p',instruction,'play-instruction'),board,state,controls,note);
   const anchor=$('[data-activity="'+axis+'"]');anchor.before(box);
   const old=el('details','','previous-reading');old.append(el('summary','Explorar otras perspectivas'));anchor.replaceWith(old);old.append(anchor);
   function start(i){const c=cases[i];picture.src='assets/img/estudios/'+c.arte+'.webp';narrative.textContent=c.escena;
     board.replaceChildren();board.removeAttribute('data-connected');controls.replaceChildren();state.textContent='';
     render({box,board,state,controls},c);guideStep=0;point();}
   picker.addEventListener('change',()=>start(Number(picker.value)));start(0);
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
 activity(1,'Desarma una discusión','Elige una frase y luego Sentir, Pensar o Actuar. También puedes arrastrarla y cambiarla de lugar.',({board,state,controls},c)=>{
  const phrases=c.piezas;let selected=null,places={};const tray=el('div','','phrase-tray'),zones=el('div','','drop-zones');board.append(tray,zones);
  function move(id,zone){if(!['sentir','pensar','actuar'].includes(zone))return;places[id]=zone;selected=null;draw();board.querySelector(`[data-piece="${id}"]`).focus({preventScroll:true});const piece=phrases.find(p=>p[0]===id);const lenses={sentir:'Si la miras desde el sentir, ¿qué vivencia sugiere?',pensar:'Si la miras desde el pensar, ¿hay una idea que la acompaña?',actuar:'Mirarla como acción invita a preguntar qué se podría observar.'};state.textContent=(piece[2]===zone?'':lenses[zone]+' ')+piece[3];}
  function draw(){tray.replaceChildren();zones.replaceChildren();zones.removeAttribute('data-compared');
   const containers={};for(const [id,label]of [['sentir','Sentir'],['pensar','Pensar'],['actuar','Actuar']]){const z=el('div','','drop-zone');z.dataset.drop=id;z.append(button(label,()=>{if(selected)move(selected,id);else state.textContent='Primero elige una frase de la escena.';}));zones.append(z);containers[id]=z;}
   for(const [id,text]of phrases){const b=button(text,()=>{selected=id;all('[data-piece]').forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.piece===id)));state.textContent='Ahora elige Sentir, Pensar o Actuar.';},'phrase');b.dataset.piece=id;b.setAttribute('aria-pressed','false');draggable(b,zone=>move(id,zone));(containers[places[id]]||tray).append(b);}
  }
  controls.append(button('Comparar una lectura posible',()=>{
   if(Object.keys(places).length<phrases.length){state.textContent='Ubica las cuatro frases para observar sus relaciones. No hay una nota ni un resultado personal.';return;}
   const different=phrases.find(([id,,lens])=>places[id]!==lens);
   state.textContent='Una lectura posible. '+c.cierre+(different?' Mira de nuevo «'+different[1].replace(/[«»]/g,'')+'». '+different[3]:' Puedes mover una frase para ver qué cambia al leerla desde otro lugar.');
   zones.dataset.compared='true';
  },'play-primary'),button('Vaciar la mesa',()=>{selected=null;places={};draw();state.textContent='Mesa vacía. Puedes probar otra distribución.';}));
  draw();
 });
 activity(2,'Construye una conversación','Mueve las piezas con Subir y Bajar o arrástralas. Recorre el orden elegido y compáralo con otro.',({board,state,controls},c)=>{
  const ids=['observar','escuchar','acordar'];let order=['acordar','observar','escuchar'];const names=Object.fromEntries(ids.map((id,i)=>[id,c.pasos[i]]));
  function move(id,to){const from=order.indexOf(id),target=typeof to==='number'?to:order.indexOf(to);if(target<0||target>=order.length||from===target)return;order.splice(from,1);order.splice(target,0,id);board.removeAttribute('data-connected');draw();state.textContent='Recorrido reorganizado. Puedes explorar otro orden.';}
  function draw(){board.replaceChildren();order.forEach((id,i)=>{const row=el('div','','sequence-piece');row.dataset.drop=id;const handle=button(`${i+1}. ${names[id]}`,()=>{state.textContent='Usa Subir o Bajar para cambiar su posición.';},'sequence-handle');draggable(handle,to=>move(id,to));row.append(handle,button('Subir',()=>{move(id,i-1);board.querySelectorAll('.sequence-piece')[Math.max(0,i-1)].querySelector('button').focus({preventScroll:true});}),button('Bajar',()=>{move(id,i+1);board.querySelectorAll('.sequence-piece')[Math.min(2,i+1)].querySelector('button').focus({preventScroll:true});}));row.children[1].disabled=i===0;row.children[2].classList.add('move-down');row.children[2].disabled=i===2;board.append(row);});}
  controls.append(button('Recorrer mi secuencia',()=>{board.dataset.connected='true';state.textContent=c.efecto[ids.indexOf(order[0])]+' '+c.final[ids.indexOf(order[2])];},'play-primary'),button('Reiniciar piezas',()=>{order=['acordar','observar','escuchar'];board.removeAttribute('data-connected');draw();state.textContent='Prueba otra organización.';}));
  draw();
 });
 activity(3,'Un mensaje, varios caminos','Elige cómo abrir la conversación. Puedes volver una decisión y descubrir qué cambia.',({box,board,state,controls},c)=>{
  const story={inicio:{text:c.inicio,choices:[[c.izq,'escucha'],[c.der,'red']]},escucha:{text:c.a,choices:[[c.acciones[0],'compania'],[c.acciones[1],'eleccion']]},red:{text:c.b,choices:[[c.acciones[2],'confianza'],[c.acciones[3],'salud']]}};
  ['compania','eleccion','confianza','salud'].forEach((id,i)=>story[id]={text:c.cierres[i],end:true});
  let lastEnding=null;let history=['inicio'];board.setAttribute('aria-live','polite');
  function draw(){const id=history.at(-1),s=story[id];if(controls.firstElementChild)controls.firstElementChild.disabled=history.length<2;board.replaceChildren();board.append(el('p',s.text,'story-text'));for(const [label,to]of s.choices||[])board.append(button(label,()=>{history.push(to);draw();board.querySelector('.story-text').setAttribute('tabindex','-1');board.querySelector('.story-text').focus({preventScroll:true});},'story-choice'));if(s.end){if(lastEnding&&lastEnding!==id){const comparison=el('details','','path-comparison');comparison.open=true;comparison.append(el('summary','El otro camino que probaste'),el('p',story[lastEnding].text));board.append(comparison);}lastEnding=id;board.append(el('p','Puedes volver una decisión y comparar qué ayuda se hizo posible.','story-ending'));const link=el('a','Ver recursos de apoyo ↗','text-link');link.href='apoyo.html';board.append(link);}box.dataset.branch=id;}
  controls.append(button('Volver una decisión',()=>{if(history.length>1)history.pop();draw();state.textContent='Puedes explorar otra respuesta.';}),button('Empezar otra historia',()=>{history=['inicio'];draw();state.textContent='Elige otro camino para comparar perspectivas.';}));draw();
 });
 activity(4,'La lupa del contexto','Mueve la lupa o usa las flechas en el deslizador. Luego elige qué harías con lo que averiguaste.',({board,state,controls},c)=>{
  const poster=el('div','','context-poster');const words=c.zonas;words.forEach((w,i)=>{const z=el('span',w,'poster-zone');z.dataset.zone=i;poster.append(z);});
  const lens=el('span','','context-lens');lens.setAttribute('aria-hidden','true');poster.append(lens);
  const label=el('label','Posición de la lupa');label.htmlFor='lupa-posicion';const range=el('input');range.id='lupa-posicion';range.type='range';range.min='0';range.max='100';range.value='0';range.setAttribute('aria-describedby','lupa-desc');
  const desc=el('p','La posición permite descubrir tres aspectos del mensaje.');desc.id='lupa-desc';const seen=new Set();
  const explanations=c.lecturas;
  function reveal(value){const v=Math.max(0,Math.min(100,Number(value)));range.value=String(v);range.setAttribute('aria-valuetext',words[Math.min(2,Math.floor(v/34))]);poster.style.setProperty('--lens',`${10+v*.8}%`);const zone=Math.min(2,Math.floor(v/34));seen.add(zone);poster.querySelectorAll('.poster-zone').forEach((z,i)=>z.dataset.revealed=String(seen.has(i)));state.textContent=explanations[zone]+(seen.size===3?' Ya puedes comparar lo que dice el mensaje con lo que falta por saber.':'');}
  range.addEventListener('input',()=>reveal(range.value));
  let dragging=false;function point(e){const rect=poster.getBoundingClientRect();if(rect.width)reveal((e.clientX-rect.left)/rect.width*100);}
  poster.addEventListener('pointerdown',e=>{dragging=true;poster.setPointerCapture?.(e.pointerId);point(e);});poster.addEventListener('pointermove',e=>{if(dragging)point(e);});poster.addEventListener('pointerup',()=>{dragging=false;});poster.addEventListener('pointercancel',()=>{dragging=false;});
  board.append(poster,label,range,desc);c.respuesta.forEach((label,i)=>controls.append(button(label,()=>{const unseen=words.find((word,j)=>!seen.has(j));state.textContent=c.fin[i]+(unseen?' Aún puedes mirar «'+unseen+'» en el mensaje.':'');},'story-choice')));controls.append(button('Volver a observar',()=>{seen.clear();reveal(0);}));reveal(0);
 });
})();
