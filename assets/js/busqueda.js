/* Índice editorial local. Cada pista remite a una lectura y explica la relación. */
(() => {
  const signals=[
  [
    "rabia",
    "En esta escena alguien siente enojo y decide qué decir antes de responder.",
    "enojo|rabia|irritación|estoy enojado|estoy emputado|estoy furioso|me da piedra|me da mucha piedra|me hicieron enojar|me hizo enojar|estoy que exploto|tengo mal genio|estoy irritado|me sacaron la piedra|estoy bravo|estoy molesto|me siento molesto|estoy enfadado|estoy emberracado|me dio coraje|no puedo controlar mi rabia"
  ],
  [
    "calma",
    "Puedes explorar cómo hacer una pausa cuando sube la tensión.",
    "no puedo controlar mi rabia|me hicieron enojar|no puedo tranquilizarme|no consigo calmarme|me cuesta calmarme|quiero tranquilidad|estoy estresado|necesito despejarme|manejar lo que siento|estoy saturado|no puedo relajarme|bajar el ritmo|hacer una pausa"
  ],
  [
    "tristeza-profunda",
    "Habla de esos días en que cuesta retomar algo que antes disfrutabas.",
    "estoy triste|me siento triste|me siento vacío|no tengo ganas de nada|me siento apagado|ganas de llorar|nada me anima|estoy desmotivado|nada tiene sentido|me siento sin fuerzas|ando desanimado|estoy bajoneado|estoy sin ánimo"
  ],
  [
    "tristeza-perdida",
    "Aquí se habla de extrañar a alguien y de cómo acompañarse después de una pérdida.",
    "extraño a alguien|he perdido a alguien|echo de menos|murió alguien|perdí a un familiar|falleció|duelo"
  ],
  [
    "preocupacion",
    "Te invita a separar lo que sabes de lo que imaginas que podría pasar.",
    "estoy preocupado|tengo miedo|siento miedo|me siento perdido|ando desorientado|no encuentro mi rumbo|no puedo dejar de pensar|no puedo dejar de darle vueltas a algo|muchas cosas en la cabeza|estoy confundido|miedo a equivocarme|miedo equivocarme|darle vueltas|pienso demasiado|no sé qué siento|no sé cómo me siento|cabeza hecha un lío"
  ],
  [
    "acompanamiento",
    "Da ideas para pedir compañía o acompañar a otra persona.",
    "necesito ayuda|pedir ayuda|no sé cómo pedir ayuda|quiero ayuda|quiero hablar con alguien|hablar con alguien|no tengo con quién hablar|problema familiar|me preocupa alguien|no sé a quién acudir|necesito compañía|mi familia no me entiende|quiero contarle algo a alguien|me da pena pedir ayuda|no sé con quién hablar|no sé a quién contarle|estoy presionado|me siento presionado|demasiadas cosas encima|me siento mal|estoy mal|nada tiene sentido|alguien está consumiendo|hablar con mi papá|hablar con mi mamá"
  ],
  [
    "escucha",
    "Puedes ver cómo abrir una conversación y dar tiempo a quien quiere hablar.",
    "quiero hablar con alguien|hablar con alguien|necesito que me escuchen|quiero que me escuchen|aprender a escuchar|escuchar sin interrumpir|nadie me escucha|quiero contarle algo a alguien"
  ],
  [
    "dialogo",
    "La lectura muestra cómo escuchar dos puntos de vista y acordar un paso concreto.",
    "hablar con mi papá|hablar con mi mamá|mi familia no me entiende|problema familiar|llegar a un acuerdo|repartir una tarea|no cumplimos lo acordado|resolver un desacuerdo"
  ],
  [
    "consejo",
    "Una conversación con alguien de confianza puede ayudarte a pensar una decisión.",
    "no sé qué decisión tomar|estoy indeciso|necesito un consejo|pedir consejo|tengo una duda|no sé qué elegir|no sé si aceptar|preguntar a alguien con experiencia"
  ],
  [
    "suenos",
    "Habla de noches inquietas y de cuándo pedir compañía por lo que pasa al descansar.",
    "no puedo dormir|no logro dormir|me cuesta dormir|me despierto inquieto|no duermo bien|necesito descansar|pesadilla|desvelo"
  ],
  [
    "presion",
    "Si la presión viene de otras personas, aquí puedes explorar cómo pedir tiempo para decidir.",
    "me siento presionado|estoy presionado|siento mucha presión|me siguen insistiendo|amigos me están insistiendo|amigos me insisten|insisten para probar|presionando para probar|me presionan para consumir|no quiero probar|me insisten aunque dije que no|no sé cómo decir que no|me ofrecen algo y no sé"
  ],
  [
    "informacion",
    "Ayuda a distinguir una experiencia personal de información fiable sobre una sustancia.",
    "me ofrecieron probar algo|curiosidad por probar algo|curiosidad por consumir|me ofrecen una sustancia|dudas sobre drogas|alguien está consumiendo|insisten para probar|presionando para probar|algo hace daño|riesgos del consumo|consumo de sustancias"
  ],
  [
    "firmeza",
    "Puedes ver cómo sostener un límite y explicar una decisión propia.",
    "poner un límite|mantener mi decisión|mantenerme firme|no sé cómo decir que no|sostener mi decisión"
  ],
  [
    "esperanza",
    "Habla de lo que cambia cuando aparece una opción o alguien ofrece compañía.",
    "hay esperanza|siento alivio|veo una salida|algo me da esperanza|volví a tener ilusión"
  ],
  [
    "alegria",
    "La escena muestra distintas maneras de compartir un momento alegre.",
    "estoy feliz|me siento contento|buenas noticias|buena noticia|me dio alegría|estoy alegre"
  ],
  [
    "celos",
    "Una duda sobre una relación puede conversarse respetando la privacidad.",
    "tengo celos|estoy celoso|siento celos|revisar sus mensajes|revisar su celular"
  ],
  [
    "chismes",
    "Aquí puedes seguir cómo cambia una historia cuando pasa de boca en boca.",
    "repiten un rumor|andan diciendo cosas|hablan a mis espaldas|inventaron un chisme|difunden mentiras"
  ],
  [
    "criticas",
    "Compara señalar lo que pasó con hablar mal de la persona.",
    "me critican|palabras que duelen|me descalifican|se burlan de mi trabajo|criticar sin ofender"
  ],
  [
    "nusa",
    "Distingue sentir rabia de una acción que hace daño y explica cómo buscar seguridad.",
    "me insultan|me humillan|me tratan mal|me amenazan|pasó del enojo al maltrato"
  ],
  [
    "aislamiento",
    "Explora la diferencia entre querer un rato a solas y echar de menos compañía.",
    "me siento solo|estoy solo|me aparto de todos|han dejado de invitarme|me estoy aislando|no veo a mis amigos"
  ]
];
  function words(value){
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
      .match(/[a-z0-9]+/g)?.filter(w=>!['muy','ultimamente','hoy','bastante'].includes(w))
      .map(w=>/^(enojad|emputad|furios|irritad|brav|molest|enfadad|emberracad|estresad|saturad|preocupad|desorientad|confundid|presionad|celos|content|indecis|desmotivad|apagad|perdid|vaci|bajonead|desanimad|sol)a$/.test(w)?w.slice(0,-1)+'o':w)||[];
  }
  function closeWord(a,b){
    if(a.length<4 || b.length<4 || a[0]!==b[0] || Math.abs(a.length-b.length)>1)return false;
    let i=0;while(i<a.length&&a[i]===b[i])i++;
    if(a.length===b.length)return a.slice(i+1)===b.slice(i+1) ||
      (a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2));
    return a.length<b.length?a.slice(i)===b.slice(i+1):a.slice(i+1)===b.slice(i);
  }
  // Expresiones de conversación agrupadas por lo que la lectura permite explorar.
  const everyday={
    acompanamiento:'no me siento bien|no estoy bien|no me encuentro bien|no me he sentido bien|no ando bien|ando mal|la estoy pasando mal|estoy pasando por un mal momento|necesito a alguien a mi lado|no sé qué me pasa|algo me pasa|no quiero estar solo ahora|quiero pedir ayuda y me da pena',
    escucha:'necesito desahogarme|quisiera contar lo que me pasa|no me dejan terminar de hablar|quiero que alguien me oiga|me hace falta hablar|solo necesito que me escuches',
    calma:'no logro bajar el ritmo|siento que todo me supera|tengo demasiado encima|estoy al límite|necesito parar un momento|quiero calmar los nervios|necesito tomar aire',
    preocupacion:'y si algo sale mal|mi cabeza no para|no paro de pensar en eso|me da vueltas la cabeza de tanto pensar|me inquieta lo que pueda pasar|estoy hecho un lío|todo me preocupa',
    'tristeza-profunda':'ando sin ánimo|me levanté sin ganas|todo me da igual|se me salen las lágrimas|he perdido el ánimo|estoy de bajón',
    'tristeza-perdida':'me hace falta alguien que murió|extraño su compañía|perdí a una persona querida|me duele su ausencia',
    rabia:'ando de mal genio|me hierve la sangre|me dio mucha rabia|me dio piedra|estoy que reviento|tengo un enojo',
    nusa:'me gritan y me insultan|me están amenazando|me golpearon|tengo miedo de que me peguen',
    dialogo:'discutí con mi papá|no logramos ponernos de acuerdo|cómo le explico a mi familia|en casa no hablamos|quiero arreglar un malentendido',
    aislamiento:'siento que nadie me busca|hace rato que no veo a nadie|me fui apartando|me siento por fuera del grupo|me dejaron de invitar',
    firmeza:'quiero mantener mi respuesta|cómo pongo límites|no respetan mis límites|quiero decir basta',
    esperanza:'empiezo a ver una salida|volví a ilusionarme|algo me anima a seguir',
    alegria:'hoy me fue bien|quiero compartir una buena noticia|estoy de buenas|me alegra volver a verte',
    celos:'me preocupa que me cambien por alguien|siento celos de su amistad|quiero mirar sus chats',
    criticas:'todo lo que hago lo critican|me hablaron feo|se ríen de lo que hago',
    chismes:'se inventaron cosas sobre mí|están hablando a mis espaldas|contaron algo falso',
    consejo:'necesito otra opinión|quiero consultar una decisión|no sé a quién preguntarle',
    suenos:'llevo noches sin descansar|no logro pegar el ojo|me desvelo pensando|me despierto a cada rato',
    presion:'ya dije que no y siguen|me da pena decir que no al grupo|quieren que pruebe aunque no quiero',
    informacion:'qué riesgos tiene consumir|me ofrecieron una droga|dicen que es seguro para todos|qué puede hacer una sustancia'
  };
  const rules=signals.map(([id,reason,cues])=>[id,reason,cues+'|'+everyday[id]]).flatMap(([id,reason,cues])=>cues.split('|').map(cue=>({id,reason,tokens:words(cue)})));
  // Dos indicios cercanos permiten reconocer una situación con palabras entre ellos.
  // Cada pareja describe algo que realmente se explora en la lectura indicada.
  const contexts=[
    ['dialogo','papá|mamá|hermano|hermana|familia','conversar|hablar|escucharme|entenderme'],
    ['escucha','necesito|quisiera|quiero','oigan|escuchen|desahogarme'],
    ['suenos','cuesta|logro|difícil|dificultad|problemas','dormirme|dormir|descansar|conciliar'],
    ['preocupacion','cabeza|pensamientos','vueltas|preocupaciones|paran'],
    ['tristeza-perdida','extraño|murió|falleció','tío|tía|hermano|hermana|amiga|amigo|abuela|abuelo|papá|mamá'],
    ['presion','insisten|obligan|presionan|insistiendo','pruebe|consuma|acepte|probar|consumir'],
    ['informacion','amigo|amiga|hermano|hermana','consumiendo|consume'],
    ['informacion','prometen|aseguran|efectos|riesgos','sustancia|sustancias|droga|drogas'],
    ['aislamiento','aparto|alejando|distanciando','gente|grupo|amigos|amigas'],
    ['celos','ganas|tentación','espiarle|vigilarle'],
    ['chismes','inventando|repitiendo|regando','mentiras|rumores|chismes'],
    ['criticas','burlan|burlaron','trabajo|esfuerzo'],
    ['consejo','consejo|orientación','decidir|escoger|elegir'],
    ['firmeza','respeten|mantener|defender','límite|límites|decisión'],
    ['alegria','alegró|encantó','noticia|reencuentro'],
    ['esperanza','alivio|ilusión','posibilidad|camino|opción'],
    ['acompanamiento','acompañe|acompañarme','consulta|cita|centro'],
    ['calma','necesito|quiero','calmarme|serenarme|despejarme']
  ].map(([id,left,right])=>[id,new Set(words(left)),new Set(words(right))]);
  function contextual(query,left,right){
    return query.some((w,i)=>left.has(w) && !(w!=='logro' && /(?:^| )no(?: me)?$/.test(query.slice(Math.max(0,i-2),i).join(' '))) &&
      query.some((other,j)=>right.has(other)&&Math.abs(i-j)<=6));
  }
  const wide={
    'me siento':['preocupacion','calma'],'no puedo':['calma','acompanamiento'],'no se':['acompanamiento','consejo'],'no se que':['acompanamiento','consejo'],'no se que hacer':['acompanamiento','consejo'],
    'que hago':['acompanamiento','consejo'],'no se por donde empezar':['acompanamiento','consejo'],
    'no tengo claro por donde empezar':['acompanamiento','consejo'],'ayuda':['acompanamiento','escucha'],
    'familia':['dialogo','acompanamiento'],'estoy mal':['acompanamiento','calma'],
    'quiero saber que puede pasar':['consejo','informacion'],'no se si aceptar':['consejo','firmeza'],
    'siento mucha presion':['presion','acompanamiento'],'estoy presionado':['presion','acompanamiento'],'me siento presionado':['presion','acompanamiento']
  };
  const reasons=new Map(signals.map(([id,reason])=>[id,reason]));
  function strength(query,pattern){
    for(let start=0;start<query.length;start++){
      // Una negación pertenece a su frase. «No estoy triste» no afirma tristeza.
      const before=query.slice(Math.max(0,start-3),start).join(' ');
      if(pattern[0]!=='no' && /(?:^| )no(?: me)?(?: siento| tengo| estoy| quiero)?$/.test(before))continue;
      let j=0,penalty=0;
      for(;j<pattern.length && start+j<query.length;j++){
        const a=query[start+j],b=pattern[j];
        if(a===b)continue;
        if(start+j===query.length-1 && a.length>=4 && b.startsWith(a)){penalty+=8;continue;}
        if(closeWord(a,b)){penalty+=10;continue;}
        break;
      }
      if(j===pattern.length || (j>=2 && start+j===query.length && pattern.length-j===1))
        return 55+Math.min(j,6)*4+(start===0&&j===query.length?15:0)-penalty-(j<pattern.length?15:0);
    }
    return 0;
  }
  window.BusquedaLocal={buscar(data,input){
    const q=words(input),phrase=q.join(' ');
    if(!q.length)return input.trim()?[]:data.conceptos.map(concepto=>({concepto,motivo:concepto.categoria}));
    if(Object.hasOwn(wide,phrase))return wide[phrase].map(id=>({concepto:data.conceptos.find(c=>c.id===id),motivo:id==='informacion'?'Si la duda se refiere a una sustancia, puedes revisar qué se sabe de sus efectos.':reasons.get(id)}));
    const found=new Map();
    if(/^(?:yo |ahora )?no (?:me (?:siento|encuentro)|estoy|ando) (?:nada |tan |del todo )?bi[eé]n(?: (?:desde ayer|estos dias|ahora mismo))?$/.test(phrase)){
      found.set('acompanamiento',100);found.set('escucha',65);
    }
    function add(id,score){if(score>(found.get(id)||0))found.set(id,score);}
    const physical=q.some(w=>['fiebre','estomago','garganta','gripa','vomito','vomitando','intoxicacion'].includes(w));
    for(const {tokens,id} of rules){
      if(physical&&id==='acompanamiento'&&tokens.includes('bien'))continue;
      if(tokens.length===1 && q.length>1 && !['rabia','enojo','fallecio','desvelo'].includes(tokens[0]))continue;
      if(id==='rabia' && tokens.includes('piedra') && q.some(w=>['rinon','rinones','zapato'].includes(w)))continue;
      if(id==='rabia' && tokens.length===1 && q.some(w=>['vacuna','vacunacion','antirrabica','veterinario'].includes(w)))continue;
      if(id==='informacion'&&q.some(w=>['cocina','receta','ropa','internet','datos'].includes(w)))continue;
      add(id,strength(q,tokens));
    }
    for(const [id,left,right] of contexts){
      if(id==='dialogo' && !q.some(w=>['cuesta','pude','puedo','dificil','se','logro','entiende','quisiera','necesito'].includes(w)))continue;
      if(id==='suenos' && q.includes('logro') && !q.includes('no'))continue;
      if(contextual(q,left,right))add(id,50);
    }
    const meaningful=q.filter(w=>w.length>=4&&!['estoy','tengo','siento','quiero','alguien','puedo','hacer','como','algo','para','porque'].includes(w));
    for(const c of data.conceptos){
      const labels=[c.nombre,c.termino_documental,...(data.busqueda[c.id]||[]).map(t=>t.texto)].filter(Boolean);
      if(labels.some(s=>words(s).join(' ')===phrase))add(c.id,110);
      if(q.length===1&&q[0].length>=3&&labels.some(s=>words(s).some(w=>w.startsWith(q[0])||closeWord(q[0],w))))add(c.id,62);
      if(meaningful.length>=2 && !q.includes('no')){
        const example=new Set(words(c.situacion+' '+c.resumen));if(meaningful.every(w=>example.has(w)))add(c.id,30);
      }
    }
    return [...found].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>({concepto:data.conceptos.find(c=>c.id===id),motivo:reasons.get(id)}));
  }};
})();