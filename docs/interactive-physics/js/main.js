/* Local-file safe typesetting, pagination and visibility-aware animation. */
(function(){'use strict';
const errors=[];window.BookErrors=errors;
const manuscript=document.getElementById('manuscript');
for(const el of manuscript.querySelectorAll('.math')){
 let source=el.textContent.trim();source=source.replace(/^\\\(|\\\)$/g,'').replace(/^\\\[|\\\]$/g,'');
 try{katex.render(source,el,{displayMode:el.classList.contains('display'),throwOnError:true,strict:'ignore',trust:false,macros:{'\\dd':'\\mathrm{d}','\\vect':'\\boldsymbol{#1}'}});}catch(e){errors.push({equation:source,error:e.message});el.classList.add('math-error');}
}
let pages=[],diagrams=[];
function newPage(cover=false){const page=document.createElement('section');page.className='page'+(cover?' cover':'');page.innerHTML='<header class="page-header"><span>Pendulum Game: Physics Explained</span><span>v0.1.0</span></header><div class="page-content"></div><footer class="page-footer"></footer>';return page;}
function paginate(){
 const book=document.getElementById('book');const originalTitle=manuscript.querySelector('.titlepage');const originalNodes=[...manuscript.children].filter(n=>n!==originalTitle);
 // Measure at the PDF's fixed type area even when the reader opens on a phone.
 const stage=document.createElement('div');Object.assign(stage.style,{position:'absolute',left:'-20000px',top:'0',width:'794px'});document.body.append(stage);
 const cover=newPage(true);stage.append(cover);cover.querySelector('.page-content').append(originalTitle);pages.push(cover);
 const headings=originalNodes.filter(n=>n.tagName==='H1');const tocNodes=[];const title=document.createElement('h1');title.id='contents';title.textContent='Contents';tocNodes.push(title);
 const intro=document.createElement('p');intro.textContent='The original textbook, with inline interactive figures. Click a figure to pause or resume; use Reset to repeat an experiment. Added figures are numbered A1–A24. The original figure numbers are retained.';tocNodes.push(intro);
 const ul=document.createElement('ul');ul.className='toc-list';for(const h of headings){const li=document.createElement('li'),a=document.createElement('a'),n=document.createElement('span');a.href='#'+h.id;a.append(h.textContent);n.className='toc-number';n.dataset.for=h.id;n.textContent='00';a.append(n);li.append(a);ul.append(li);}tocNodes.push(ul);
 const all=[];
 function expand(node){if(node.tagName==='TABLE'){
  const rows=[...node.querySelectorAll('tbody tr')];const proto=node.cloneNode(false);if(node.querySelector('colgroup'))proto.append(node.querySelector('colgroup').cloneNode(true));if(node.querySelector('thead'))proto.append(node.querySelector('thead').cloneNode(true));const tail=node.querySelector('tfoot');
  all.push({table:proto,rows,tail});
 }else if(node.tagName==='DL'){const list=[...node.children];for(let i=0;i<list.length;){const dl=document.createElement('dl');dl.append(list[i++]);while(i<list.length&&list[i].tagName!=='DT')dl.append(list[i++]);all.push(dl);}}
 else if(node.tagName==='UL'&&node.classList.contains('toc-list')){for(const li of [...node.children]){const u=node.cloneNode(false);u.append(li);all.push(u);}}
 else all.push(node);}
 for(const n of [...tocNodes,...originalNodes])expand(n);
 let page=null,body=null;
 function start(){page=newPage();stage.append(page);pages.push(page);body=page.querySelector('.page-content');page.style.width='794px';page.style.height='1123px';page.style.padding='85px 87px 77px';body.style.height='961px';body.style.width='620px';}
 const overflow=()=>body.scrollHeight>body.clientHeight+1;
 start();
 for(let i=0;i<all.length;i++){
  const node=all[i];if(node.table){let table=node.table.cloneNode(true),tb=document.createElement('tbody');table.append(tb);body.append(table);for(const row of node.rows){tb.append(row);if(overflow()){row.remove();if(!tb.children.length)table.remove();start();table=node.table.cloneNode(true);tb=document.createElement('tbody');table.append(tb);body.append(table);tb.append(row);}}if(node.tail)table.append(node.tail);continue;}
  // Begin the reading text after the contents, never midway down its last page.
  if(node===headings[0]&&body.children.length)start();
  body.append(node);
  if(overflow()&&body.children.length>1){node.remove();const last=body.lastElementChild;if(last&&/^H[12]$/.test(last.tagName)){last.remove();start();body.append(last,node);}else{start();body.append(node);}}
  if(/^H[12]$/.test(node.tagName)&&all[i+1]&&!all[i+1].table){const probe=all[i+1];body.append(probe);if(overflow()){probe.remove();node.remove();start();body.append(node);}else probe.remove();}
 }
 for(const p of pages){p.removeAttribute('style');const b=p.querySelector('.page-content');b.removeAttribute('style');book.append(p);}stage.remove();manuscript.remove();
 // PDF title page is unnumbered. Running pages count from the contents.
 pages.forEach((p,i)=>{p.dataset.page=i===0?'cover':String(i);p.querySelector('.page-footer').textContent=i+' / '+(pages.length-1);});
 for(const span of document.querySelectorAll('.toc-number')){const target=document.getElementById(span.dataset.for);span.textContent=target?.closest('.page')?.dataset.page||'';}
 // Make wide source equations fit the desktop type area without losing symbols.
 for(const el of book.querySelectorAll('.math.display')){const k=el.querySelector('.katex-display');if(k&&k.scrollWidth>620){el.style.fontSize=(620/k.scrollWidth*.98)+'em';}}
}
function init(){
 window.TextbookLayoutMeasuring=true;document.body.classList.add('measuring');
 // Build figures before pagination, so the measured figure heights include controls.
 diagrams=[...document.querySelectorAll('.diagram')].map(el=>new TextbookDiagrams.Diagram(el));
 paginate();
 window.TextbookLayoutMeasuring=false;document.body.classList.remove('measuring');diagrams.forEach(d=>d.draw());
 const observer=new IntersectionObserver(entries=>{for(const e of entries){const d=diagrams.find(d=>d.el===e.target);if(d){d.visible=e.isIntersecting;d.accumulator=0;}}},{rootMargin:'80px',threshold:0});diagrams.forEach(d=>observer.observe(d.el));
 let last=0,globalPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const globalButton=document.getElementById('motion-toggle');function syncGlobal(){globalButton.textContent=globalPaused?'Play all':'Pause all';globalButton.setAttribute('aria-pressed',String(globalPaused));}syncGlobal();
 document.addEventListener('textbook-figure-play',()=>{globalPaused=false;syncGlobal();});
 globalButton.onclick=()=>{globalPaused=!globalPaused;if(!globalPaused)diagrams.forEach(d=>{d.paused=false;d.sync();});syncGlobal();};
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches){globalPaused=true;diagrams.forEach(d=>{d.paused=true;d.sync();});syncGlobal();}});
 window.addEventListener('resize',()=>diagrams.forEach(d=>d.draw()));
 document.getElementById('print-book').onclick=()=>window.print();
 function frame(now){const dt=last?Math.min(.05,(now-last)/1000):0;last=now;if(!document.hidden&&!globalPaused){for(const d of diagrams)if(d.visible&&!d.paused)d.advance(dt*d.speed);}requestAnimationFrame(frame);}requestAnimationFrame(frame);
 document.addEventListener('visibilitychange',()=>{last=0;});
 document.getElementById('reading-status').textContent=pages.length+' pages · offline edition';
 window.BookTest={diagrams,pages,errors,setGlobalPause(v){globalPaused=v;syncGlobal();},snapshot(){return diagrams.map(d=>({id:d.id,kind:d.kind,t:d.t,state:d.a.state.slice(),visible:d.visible,paused:d.paused,events:d.events,alive:d.a.alive}));}};
 document.documentElement.dataset.ready='true';
 if(location.hash)document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
}
document.fonts.ready.then(init).catch(e=>{errors.push(String(e));document.getElementById('reading-status').textContent='Book initialization error';});
})();
