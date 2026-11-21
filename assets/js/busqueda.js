/* Índice local explícito. No infiere emociones ni interpreta entradas personales. */
(()=>{
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 function near(a,b){
  if(a.length<5||Math.abs(a.length-b.length)>1)return false;
  if(a.length===b.length){const dif=[...a].map((c,i)=>c!==b[i]?i:-1).filter(i=>i>=0);if(dif.length===2&&dif[1]===dif[0]+1&&a[dif[0]]===b[dif[1]]&&a[dif[1]]===b[dif[0]])return true;}
  let row=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){let next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));row=next;}return row[b.length]<=1;
 }
 const rutas=[
  ['no se|no se que|no se que hacer con esto|ando sin rumbo|no tengo claro por donde empezar','acompanamiento','Si quieres pensar el siguiente paso con alguien'],
  ['no se|no se que|no se que elegir|estoy indeciso|tengo una duda','consejo','Si buscas ideas para una decisión'],
  ['no se que siento|no se como me siento|tengo la cabeza hecha un lio','preocupacion','Una lectura para explorar la incertidumbre'],
  ['me da pena pedir ayuda|no se con quien hablar|no se a quien contarle','acompanamiento','Si cuesta dar el primer paso'],
  ['me ofrecen algo y no se|me insisten aunque dije que no','presion','Sobre decidir a tu ritmo'],
  ['me siento perdido|me siento perdida|tengo miedo|siento miedo|ando desorientado|no encuentro mi rumbo','preocupacion','Para explorar la desorientación'],
  ['no puedo tranquilizarme|no consigo calmarme|me cuesta calmarme|quiero tranquilidad','calma','Una lectura sobre encontrar calma'],
  ['estoy muy presionado|estoy presionado|estoy presionada|siento mucha presion|me siento presionado','presion','Si hay insistencia de otras personas'],
  ['estoy muy presionado|estoy presionado|estoy presionada|siento mucha presion|tengo demasiadas cosas encima','acompanamiento','Si buscas compañía ante una carga'],
  ['no se que hacer|no se por donde empezar|no se a quien acudir','acompanamiento','Una forma de pedir orientación'],
  ['no se que hacer|necesito un consejo','consejo','Una conversación para pensar una decisión'],
  ['quiero hablar con alguien|hablar con alguien|necesito hablar con alguien|necesito ayuda|quiero pedir ayuda','acompanamiento','Para encontrar a quién acudir'],
  ['quiero hablar con alguien|hablar con alguien|necesito que me escuchen|quiero que me escuchen','escucha','Sobre conversar y ser escuchado'],
  ['tengo curiosidad por probar algo|me ofrecen una sustancia|dudas sobre drogas','informacion','Si la duda es sobre una sustancia'],
  ['me siguen insistiendo|no quiero probar|me presionan para consumir','presion','Sobre el espacio para decidir'],
  ['extrano a alguien|he perdido a alguien|echo de menos','tristeza-perdida','Una experiencia de pérdida'],
  ['revisar sus mensajes|siento celos','celos','Sobre inquietud y privacidad'],
  ['repiten un rumor|andan diciendo cosas','chismes','Para distinguir relatos de hechos'],
  ['me cuesta dormir|me despierto inquieto','suenos','Sobre descanso y compañía'],
  ['han dejado de invitarme|me siento solo|me aparto de todos','aislamiento','Sobre soledad y vínculos'],
  ['estoy enfadado|estoy molesta|estoy molesto|me siento molesto|me siento molesta|estoy enojado|me dio coraje','rabia','Una manera de buscar enojo en español'],
  ['me insultan|me humillan','nusa','Una lectura sobre maltrato'],
  ['poner un limite|mantener mi decision','firmeza','Una situación relacionada'],
  ['no cumplimos lo acordado|repartir una tarea','dialogo','Para revisar un acuerdo']
 ].map(([frases,id,motivo])=>({frases:frases.split('|'),id,motivo}));
 const neutrales=new Set('a al algo alguien como con de del el en es esta estoy fue ha hay la las lo los me mi muy para pero por puedo que quiero se sin sobre tengo un una y ya'.split(' '));
 function words(s){return norm(s).match(/[a-z0-9]+/g)||[];}
 function match(c,data,q,tokens){
   const name=norm(c.nombre), terms=data.busqueda[c.id]||[];
   if(name===q)return [100,'Nombre de la lectura'];
   const route=rutas.find(r=>r.id===c.id&&r.frases.some(f=>q===f||q.endsWith(' '+f)));
   if(route)return [95,route.motivo];
   if(c.termino_documental&&q.length>=3&&norm(c.termino_documental).includes(q))return [90,'Palabra que aparece en la lectura'];
   if(q.length>=3&&name.includes(q))return [85,'Coincidencia con el nombre'];
   const term=terms.find(t=>norm(t.texto)===q);
   if(term)return [84,'También puedes buscar «'+term.texto+'»'];
   if(!tokens.length)return null;
   const keys=words([name,...terms.map(t=>t.texto)].join(' '));
   if(tokens.every(t=>keys.some(w=>w===t||(t.length>=4&&w.startsWith(t)))))return [70,'Palabras del tema'];
   if(tokens.length===1&&q===tokens[0]&&keys.some(w=>near(q,w)))return [55,'Posible coincidencia por escritura'];
   const context=words(c.resumen+' '+c.situacion);
   if(tokens.length>=2&&tokens.every(t=>context.includes(t)))return [45,'Palabras del ejemplo o de la explicación'];
   return null;
 }
 window.BusquedaLocal={buscar(data,input){
   const q=words(input).filter(w=>!['ultimamente','hoy','muy'].includes(w)).join(' ');if(!q)return data.conceptos.map(concepto=>({concepto,motivo:concepto.categoria}));
   const tokens=words(q).filter(t=>t.length>2&&!neutrales.has(t));
   if(/\bno (?:siento|estoy|quiero hablar|tengo curiosidad|me siento)\b/.test(q))return [];
   const routes=rutas.filter(r=>r.frases.some(f=>q===f));
   if(!routes.length&&q.includes(' ')&&q.length>=5){
     const partial=new Map();
     for(const route of rutas){const phrase=route.frases.find(f=>f.startsWith(q));if(phrase&&!partial.has(route.id))partial.set(route.id,phrase);}
     if(partial.size)return [...partial].slice(0,3).map(([id,phrase])=>({concepto:data.conceptos.find(c=>c.id===id),motivo:'Si querías decir «'+phrase+'»'}));
   }
   return data.conceptos.flatMap(concepto=>{
     if(routes.length&&!routes.some(r=>r.id===concepto.id))return [];
     const score=match(concepto,data,q,tokens);return score?[{concepto,peso:score[0],motivo:score[1]}]:[];
   }).sort((a,b)=>b.peso-a.peso || (routes.length ? routes.findIndex(r=>r.id===a.concepto.id)-routes.findIndex(r=>r.id===b.concepto.id) : 0));
 }};
})();
