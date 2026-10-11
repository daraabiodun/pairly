(()=>{
const $=s=>document.querySelector(s), RM=matchMedia("(prefers-reduced-motion:reduce)").matches, D=x=>RM?0:x;
const ICONS=[
'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400"/>',
'<path d="M20 14.500A8.500 8.500 0 0 1 9.500 4a8.500 8.500 0 1 0 10.500 10.500z"/>',
'<path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z"/>',
'<path d="M12 20s-8-4.700-8-10.500A4.500 4.500 0 0 1 12 7a4.500 4.500 0 0 1 8 2.500C20 15.300 12 20 12 20z"/>',
'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
'<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 11a3.500 3.500 0 0 1-.5 7z"/>',
'<path d="M12 3s6 6.500 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z"/>',
'<path d="M12 22c4 0 6-2.700 6-6 0-4-3-5-3-9-3 1.500-4 4-4 6-1.500-1-2-2.500-2-4-2 2-3 4-3 7 0 3.500 2 6 6 6z"/>',
'<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15zM5 19l8-8"/>',
'<path d="M12 3l8 9-8 9-8-9z"/>',
'<path d="M12 3l7.800 4.500v9L12 21l-7.800-4.500v-9z"/>',
'<path d="M12 4l9 16H3z"/>',
'<circle cx="12" cy="12" r="2.500"/><circle cx="12" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/>',
'<path d="M12 3l8 4.500v9L12 21l-8-4.500v-9zM12 12l8-4.500M12 12v9M12 12L4 7.500"/>',
'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
'<path d="M3 18l1.500-10 5 4L12 5l2.500 7 5-4L21 18z"/>',
'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.500 2.500 4 2.500S16 14 16 14M9 9.500h.01M15 9.500h.01"/>'];
const NAMES=["sun","moon","star","heart","bolt","cloud","drop","flame","leaf","diamond","hexagon","triangle","flower","cube","bell","crown","ring","smile"];
const SIZES=[{k:"Easy",l:"4×4",c:4,r:4},{k:"Medium",l:"5×4",c:5,r:4},{k:"Hard",l:"6×6",c:6,r:6}];
let sz=0,cards=[],open=[],lock=false,moves=0,matched=0,t0=0,tick=null,sec=0;
const board=$("#board"),live=$("#live");
const snd=$("#snd");
/* audio */
let ac;function beep(f,d=.12,t="sine",v=.07,at=0){if(!snd.checked)return;ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime+at;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g).connect(ac.destination);o.start(n);o.stop(n+d)}
/* toast */
let tt;function toast(m){const t=$("#toast");t.textContent=m;gsap.killTweensOf(t);gsap.fromTo(t,{opacity:0,y:12},{opacity:1,y:0,duration:D(.3),ease:"power3.out"});clearTimeout(tt);tt=setTimeout(()=>gsap.to(t,{opacity:0,y:8,duration:D(.25)}),1800)}
const fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
const key=()=>"pairly-best-"+SIZES[sz].l;
function best(){try{return JSON.parse(localStorage.getItem(key()))}catch{return null}}
function showBest(){const b=best();$("#bs").textContent=b?b.moves+" · "+fmt(b.time):"—"}
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
/* game */
function build(){
  clearInterval(tick);open=[];lock=false;moves=0;matched=0;sec=0;t0=0;
  $("#mv").textContent=0;$("#tm").textContent="0:00";showBest();
  const s=SIZES[sz],pairs=s.c*s.r/2,ids=shuffle([...ICONS.keys()]).slice(0,pairs);
  const deck=shuffle([...ids,...ids]);
  board.style.gridTemplateColumns=`repeat(${s.c},1fr)`;
  board.dataset.deck=document.querySelector("input[name=deck]:checked").value;
  board.innerHTML=deck.map((id,i)=>`<button class="card" type="button" data-i="${i}" data-id="${id}" aria-label="Card ${i+1}, face down"><span class="in"><span class="f back"></span><span class="f front"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg></span></span></button>`).join("");
  cards=[...board.children];
  cards.forEach((c,i)=>{c.tabIndex=i?-1:0;c.addEventListener("click",()=>flip(c));c.addEventListener("focus",()=>cards.forEach(x=>x.tabIndex=x===c?0:-1))});
  gsap.from(cards,{y:24,scale:.7,opacity:0,duration:D(.55),ease:"back.out(1.7)",stagger:{each:.025,from:"random"},clearProps:"all"});
  if($("#peek").checked){lock=true;const ins=cards.map(c=>c.firstChild);gsap.to(ins,{rotationY:180,duration:D(.45),delay:.6,stagger:.015,ease:"power3.out"});gsap.to(ins,{rotationY:0,duration:D(.45),delay:2,ease:"power3.inOut",onComplete:()=>lock=false})}
}
function setLabel(c,st){const n=NAMES[c.dataset.id];c.setAttribute("aria-label",`Card ${+c.dataset.i+1}, ${st==="down"?"face down":n+(st==="ok"?", matched":"")}`)}
function flip(c){
  if(lock||c.classList.contains("op")||c.classList.contains("ok"))return;
  if(!t0){t0=Date.now();tick=setInterval(()=>{sec=Math.floor((Date.now()-t0)/1000);$("#tm").textContent=fmt(sec)},250)}
  c.classList.add("op");open.push(c);setLabel(c,"up");beep(520+Math.random()*80,.1,"triangle");
  const tl=gsap.timeline();
  tl.to(c.firstChild,{rotationY:180,duration:D(.5),ease:"power3.out"},0).to(c,{y:-8,duration:D(.2),ease:"power2.out",yoyo:true,repeat:1},0);
  if(open.length===2){
    moves++;$("#mv").textContent=moves;lock=true;const[a,b]=open;
    if(a.dataset.id===b.dataset.id){
      setTimeout(()=>{[a,b].forEach(x=>{x.classList.add("ok");setLabel(x,"ok")});open=[];lock=false;beep(660,.14,"sine",.08);beep(880,.2,"sine",.08,.1);
        gsap.fromTo([a,b],{scale:1},{scale:1.1,duration:D(.18),yoyo:true,repeat:1,ease:"power2.out"});live.textContent="Match! "+NAMES[a.dataset.id];
        if(++matched===cards.length/2)win()},450)
    }else{
      setTimeout(()=>{gsap.fromTo([a,b],{x:0},{x:0,keyframes:{x:[0,-5,5,-3,3,0]},duration:D(.35)});
        setTimeout(()=>{[a,b].forEach(x=>{x.classList.remove("op");setLabel(x,"down");gsap.to(x.firstChild,{rotationY:0,duration:D(.5),ease:"power3.inOut"})});open=[];lock=false;beep(220,.15,"sine",.05)},350)},500)
    }
  }
}
function win(){
  clearInterval(tick);const b=best(),cur={moves,time:sec};
  const isBest=!b||moves<b.moves||(moves===b.moves&&sec<b.time);
  if(isBest){try{localStorage.setItem(key(),JSON.stringify(cur))}catch{}}
  showBest();[523,659,784,1047].forEach((f,i)=>beep(f,.25,"sine",.07,i*.1));
  const r=board.getBoundingClientRect();
  for(let i=0;i<36;i++){const d=document.createElement("i");d.className="dot";d.style.background=["#e8794a","#ffb88c","#ffd9b8","#2b1b14"][i%4];document.body.append(d);
    gsap.fromTo(d,{x:r.left+r.width/2,y:r.top+r.height/2,rotation:0,scale:1},{x:r.left+r.width/2+gsap.utils.random(-260,260),y:r.top+r.height/2+gsap.utils.random(-300,160),rotation:gsap.utils.random(-360,360),scale:0,duration:D(1.3),ease:"power3.out",onComplete:()=>d.remove()})}
  $("#wmv").textContent=moves;$("#wtm").textContent=fmt(sec);const nb=best();$("#wbs").textContent=nb?nb.moves+" · "+fmt(nb.time):"—";
  $("#wm").textContent=isBest?"New personal best on "+SIZES[sz].l+".":"Cleared the "+SIZES[sz].l+" board.";
  setTimeout(()=>dlg.open("winDlg"),D(900));
}
/* dialogs */
const dlg={cur:null,ret:null,open(id){if(this.cur)return;const o=$("#"+id);this.cur=o;this.ret=document.activeElement;o.hidden=false;
    document.querySelectorAll("main,header,footer").forEach(e=>e.inert=true);
    gsap.fromTo(o,{opacity:0},{opacity:1,duration:D(.25)});gsap.fromTo(o.firstElementChild,{y:24,scale:.94,opacity:0},{y:0,scale:1,opacity:1,duration:D(.45),ease:"back.out(1.5)"});
    o.querySelector("[data-first]").focus()},
  close(){const o=this.cur;if(!o)return;this.cur=null;document.querySelectorAll("main,header,footer").forEach(e=>e.inert=false);
    gsap.to(o,{opacity:0,duration:D(.2),onComplete:()=>{o.hidden=true}});(this.ret&&this.ret.focus&&this.ret.isConnected?this.ret:cards[0]).focus()}};
document.querySelectorAll(".ov").forEach(o=>o.addEventListener("mousedown",e=>{if(e.target===o)dlg.close()}));
["#openKeys","#openKeys2"].forEach(s=>$(s).addEventListener("click",()=>dlg.open("keysDlg")));
$("#kclose").onclick=()=>dlg.close();
$("#wagain").onclick=()=>{dlg.close();build();cards[0].focus()};
$("#wsize").onclick=()=>{dlg.close();setTimeout(()=>$("#ddb").focus(),50)};
/* dropdown */
const ddb=$("#ddb"),list=$("#ddlist");let act=0;
list.innerHTML=SIZES.map((s,i)=>`<li role="option" id="o${i}" data-i="${i}">${s.k}<small>${s.l}</small></li>`).join("");
function paint(){[...list.children].forEach((li,i)=>{li.classList.toggle("act",i===act);li.setAttribute("aria-selected",i===sz)});list.setAttribute("aria-activedescendant","o"+act);$("#ddv").textContent=SIZES[sz].k+" · "+SIZES[sz].l}
function ddOpen(){list.hidden=false;ddb.setAttribute("aria-expanded","true");act=sz;paint();gsap.fromTo(list,{opacity:0,y:-6,scale:.96},{opacity:1,y:0,scale:1,duration:D(.22),ease:"power3.out"});list.focus()}
function ddClose(f=true){if(list.hidden)return;ddb.setAttribute("aria-expanded","false");gsap.to(list,{opacity:0,y:-4,duration:D(.12),onComplete:()=>list.hidden=true});if(f)ddb.focus()}
function pick(i){const ch=i!==sz;sz=i;act=i;paint();ddClose();if(ch){build();toast("Board set to "+SIZES[i].l)}}
ddb.onclick=()=>list.hidden?ddOpen():ddClose();
ddb.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();ddOpen()}});
list.addEventListener("keydown",e=>{const k=e.key;
  if(k==="ArrowDown"){act=(act+1)%SIZES.length}else if(k==="ArrowUp"){act=(act+SIZES.length-1)%SIZES.length}else if(k==="Home")act=0;else if(k==="End")act=SIZES.length-1;
  else if(k==="Enter"||k===" "){pick(act)}else if(k==="Escape"||k==="Tab"){ddClose(k==="Escape")}else return;
  e.preventDefault();paint()});
list.addEventListener("click",e=>{const li=e.target.closest("li");if(li)pick(+li.dataset.i)});
list.addEventListener("mousemove",e=>{const li=e.target.closest("li");if(li){act=+li.dataset.i;paint()}});
document.addEventListener("mousedown",e=>{if(!e.target.closest(".dd"))ddClose(false)});
/* global keys */
document.addEventListener("keydown",e=>{
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(dlg.cur){if(e.key==="Escape")dlg.close();else if(e.key==="Tab"){const f=[...dlg.cur.querySelectorAll("button")];const i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()}return}
  if(e.target.closest(".dd"))return;
  const k=e.key.toLowerCase();
  if(k==="r"){build();cards[0].focus();toast("New game");return}
  if(k==="m"){snd.checked=!snd.checked;toast(snd.checked?"Sound on":"Sound off");beep(660);return}
  if(e.key==="?"){dlg.open("keysDlg");return}
  const mv={arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0],arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1]}[k];
  if(mv&&!(e.target.matches("input")&&k.length>1&&false)){
    const s=SIZES[sz];let i=cards.indexOf(document.activeElement);if(i<0)i=0;
    let x=i%s.c+mv[0],y=Math.floor(i/s.c)+mv[1];x=Math.max(0,Math.min(s.c-1,x));y=Math.max(0,Math.min(s.r-1,y));
    if(e.target.matches("input")&&!k.startsWith("arrow"))return;
    e.preventDefault();cards[y*s.c+x].focus()}
});
snd.addEventListener("change",()=>{toast(snd.checked?"Sound on":"Sound off");beep(660)});
document.querySelectorAll("input[name=deck]").forEach(r=>r.addEventListener("change",()=>{board.dataset.deck=r.value}));
$("#peek").addEventListener("change",e=>toast(e.target.checked?"Peek enabled for next game":"Peek disabled"));
$("#rs").onclick=()=>{build();cards[0].focus()};
$("#cta").onclick=()=>{$("#board").scrollIntoView({behavior:RM?"auto":"smooth",block:"center"});cards[0].focus({preventScroll:true})};
/* intro + scroll + parallax */
paint();build();
if(!RM){
  gsap.from("h1 .w span",{yPercent:110,duration:1,ease:"expo.out",stagger:.12,delay:.1});
  gsap.from(".rv",{y:28,opacity:0,duration:.9,ease:"power3.out",stagger:.1,delay:.35,clearProps:"all"});
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){gsap.to(en.target,{y:0,opacity:1,duration:.8,ease:"power3.out"});io.unobserve(en.target)}}),{threshold:.15});
  document.querySelectorAll(".fc,.keys,h2,.eyebrow").forEach((el,i)=>{gsap.set(el,{y:30,opacity:0});io.observe(el)});
  document.querySelectorAll(".orb").forEach(o=>{const p=+o.dataset.p,qx=gsap.quickTo(o,"x",{duration:1.2,ease:"power3"}),qy=gsap.quickTo(o,"y",{duration:1.2,ease:"power3"});
    addEventListener("pointermove",e=>{qx((e.clientX/innerWidth-.5)*p*3);qy((e.clientY/innerHeight-.5)*p*3)})});
}
})();
