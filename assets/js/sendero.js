/* Recorrido ficticio. El segundo encuentro recuerda únicamente la decisión de esta partida. */
(()=>{
  const game=document.querySelector('#dos-encuentros');
  if(!game)return;
  const scene=game.querySelector('.walk-stage'),player=game.querySelector('.walk-player');
  const friend=game.querySelector('.walk-friend'),text=game.querySelector('#walk-text');
  const choices=game.querySelector('#walk-choices'),meet=game.querySelector('#walk-meet');
  const steps=[...game.querySelectorAll('[data-step]')],music=game.querySelector('#walk-music');
  const routes=[
    {first:'Preguntarle si quiere compañía',reply:'«Sí, pero ahora prefiero no hablar de lo que pasó». Se quedan un rato mirando el camino.',later:'Al verte otra vez, se acerca. «Me gustó que te quedaras. Creo que ya puedo hablar».',ends:[
      ['Escuchar antes de aconsejar','Te cuenta qué le dolió. Haber respetado el silencio por la mañana le permitió elegir cuándo hablar.'],
      ['Preguntar qué le ayudaría ahora','Prefiere que lo acompañes a conversar con la otra persona. La ayuda que quería por la mañana cambió durante el día.']]},
    {first:'Ofrecer ayuda con la tarea pendiente',reply:'«Me serviría que me ayudaras a recoger». Acuerdan quién se encarga de cada cosa.',later:'Por la tarde la tarea ya está hecha. «Gracias por la mano. Lo de la discusión todavía me da vueltas».',ends:[
      ['Invitarlo a caminar y conversar','Acepta caminar contigo. Resolver la tarea le quitó una carga, y ahora hay espacio para escuchar lo que todavía le preocupa.'],
      ['Preguntar a quién quisiera acercarse','Piensa en una persona de confianza y te pide que vayas con él. Él eligió con quién hablar y tú facilitaste el encuentro.']]},
    {first:'Acordar verse por la tarde',reply:'«Ahora necesito un rato a solas. Nos vemos más tarde junto al camino». Eligen un lugar para encontrarse.',later:'Te está esperando donde quedaron. «Pensé que se te iba a olvidar». Haber vuelto le muestra que puede contar contigo.',ends:[
      ['Preguntarle cómo ha pasado el día','Cuenta que sigue molesto. La cita sirvió para abrir una conversación incluso cuando lo que siente todavía no ha cambiado.'],
      ['Proponer sentarse juntos un rato','Se sientan. Cumplir el acuerdo también es una forma de acompañar, aunque esta vez hablen de otras cosas.']]}
  ];
  let x=9,target=34,phase='walk',afternoon=false,route=null;
  function place(who,pos){who.style.left=pos+'%';who.style.bottom=(12+Math.sin(pos/20)*4)+'%';}
  function controls(){
    steps.forEach(b=>b.disabled=phase!=='walk'||(Number(b.dataset.step)<0?x<=7:x>=93));
    meet.disabled=phase!=='walk';
  }
  function options(items){
    choices.replaceChildren();
    items.forEach(([label,act])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{act();const next=choices.querySelector('button')||meet;next.focus({preventScroll:true});};choices.append(b);});
  }
  function travel(late){
    afternoon=late;phase='walk';target=late?81:34;x=late?34:9;
    scene.classList.toggle('late',late);scene.querySelector('.walk-time').textContent=late?'Por la tarde':'Por la mañana';
    place(player,x);place(friend,target);options([]);controls();
    text.textContent=late?'Tu amigo está más adelante. Acércate para volver a verlo.':'Tu amigo espera en el sendero. Usa las flechas para caminar o elige «Ir al encuentro».';
  }
  function arrive(){
    if(phase!=='walk')return;
    x=target-5;place(player,x);phase='talk';controls();
    if(!afternoon){
      text.textContent='«No quiero volver al grupo todavía». ¿Cómo te acercas?';
      options(routes.map(r=>[r.first,()=>{route=r;text.textContent=r.reply;options([['Seguir hasta la tarde',()=>travel(true)]]);}]));
    }else{
      text.textContent=route.later;
      options(route.ends.map(([label,end])=>[label,()=>{text.textContent=end;phase='end';options([['Explorar otro camino',()=>travel(false)]]);}]));
    }
    choices.firstElementChild?.focus({preventScroll:true});
  }
  function move(direction){
    if(phase!=='walk')return;
    x=Math.min(93,Math.max(7,x+direction*7));place(player,x);controls();
    if(Math.abs(target-x)<=7)arrive();
  }
  steps.forEach(b=>b.onclick=()=>move(Number(b.dataset.step)));meet.onclick=arrive;
  game.addEventListener('keydown',e=>{if(phase==='walk'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
  let audio=null;
  function silence(){if(audio){audio.close().catch(()=>{});audio=null;}music.setAttribute('aria-pressed','false');music.textContent='Música';}
  music.onclick=async()=>{
    if(audio){silence();return;}
    try{
      const ctx=new AudioContext();audio=ctx;await ctx.resume();if(audio!==ctx)return;
      const beat=.62,notes=[60,0,64,67,0,64,62,0,57,60,0,64,62,59,0,0];
      const rate=22050,buffer=ctx.createBuffer(1,Math.ceil(beat*notes.length*rate),rate),wave=buffer.getChannelData(0);
      notes.forEach((note,i)=>{if(!note)return;const hz=440*2**((note-69)/12);
        for(let j=0;j<Math.floor(beat*rate);j++){const t=j/rate;wave[Math.floor(i*beat*rate)+j]=.07*Math.min(1,t/.025)*Math.exp(-7*t)*Math.min(1,(beat-t)/.06)*Math.sin(2*Math.PI*hz*t);}});
      const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(ctx.destination);source.start();
      music.setAttribute('aria-pressed','true');music.textContent='Silenciar';
    }catch{silence();music.textContent='Audio no disponible';}
  };
  const observer=new MutationObserver(()=>{if(game.closest('[hidden]'))silence();});
  for(const parent of [game.closest('.eje-content'),game.closest('#recorridos')])if(parent)observer.observe(parent,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)silence();});window.addEventListener('pagehide',silence);
  travel(false);
})();