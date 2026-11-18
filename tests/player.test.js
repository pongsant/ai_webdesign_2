// Lightweight behavioral checks using JavaScriptCore, without build dependencies.
class Element {
 constructor(){this.children=[];this.listeners={};this.attrs={};this.style={setProperty(){}};this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x),toggle:(x,on)=>on?this.classes.add(x):this.classes.delete(x)};this.value=0;this.min=0;this.max=1;this.paused=true;this.currentTime=0;this.duration=30;}
 append(...els){this.children.push(...els)}
 replaceChildren(...els){this.children=els}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
 emit(k){for(const fn of this.listeners[k]||[])fn({target:this})}
 click(){this.emit('click')}
 querySelector(s){return this.children.find(x=>x.className===s.slice(1))}
 pause(){this.paused=true;this.emit('pause')}
 play(){this.paused=false;this.emit('play');return Promise.resolve()}
 load(){this.currentTime=0;this.emit('loadedmetadata')}
}
const elements={};const document={body:new Element(),getElementById:id=>elements[id]??=new Element(),createElement:()=>new Element(),querySelectorAll:selector=>{let found=[];function scan(e){if(e.className===selector.slice(1))found.push(e);e.children.forEach(scan)};Object.values(elements).forEach(scan);return [...new Set(found)]}};
const catalog=JSON.parse(readFile('albums.json'));
const fetch=()=>Promise.resolve({ok:true,json:()=>Promise.resolve(catalog)});
load('app.js');
function assert(condition,message){if(!condition)throw Error(message);print('PASS '+message)}
Promise.resolve().then(()=>Promise.resolve()).then(()=>Promise.resolve()).then(()=>{
 assert(document.querySelectorAll('.album-card').length===6,'six albums rendered');
 assert(elements.artist.textContent==='Mac Miller','initial artist loaded');
 assert(document.querySelectorAll('.track').length===13,'Swimming complete tracklist');
 elements.play.click();assert(!elements.audio.paused&&document.body.classes.has('playing'),'play starts audio and animation');
 elements.play.click();assert(elements.audio.paused&&!document.body.classes.has('playing'),'pause stops audio and animation');
 elements.next.click();assert(elements['current-track'].textContent==='Hurt Feelings','next track');
 elements.previous.click();assert(elements['current-track'].textContent==='Come Back to Earth','previous track');
 elements.previous.click();assert(elements['current-track'].textContent==='So It Goes','previous wraps at beginning');
 for(let i=0;i<6;i++){document.querySelectorAll('.album-card')[i].click();assert(elements.artist.textContent===catalog[i].artist&&document.querySelectorAll('.track').length===catalog[i].tracks.length,'album '+(i+1)+' updates artist and tracks');assert(!elements.audio.paused,'album switch preserves playback');}
 document.querySelectorAll('.track')[3].click();assert(elements['current-track'].textContent===catalog[5].tracks[3].title,'track selection');
 elements.progress.value=12;elements.progress.emit('input');assert(elements.audio.currentTime===12,'seek');
 elements.volume.value=.25;elements.volume.emit('input');assert(elements.audio.volume===.25,'volume');
 elements.mute.click();assert(elements.audio.muted,'mute');elements.mute.click();assert(!elements.audio.muted&&elements.audio.volume===.25,'unmute restores volume');
 elements.audio.emit('ended');assert(elements['current-track'].textContent===catalog[5].tracks[4].title,'automatic next on end');
 elements.audio.pause();document.querySelectorAll('.album-card')[2].click();assert(elements.audio.paused,'paused album switch stays paused');
 print('All behavioral checks passed.');
}).catch(error=>{print('FAIL '+error.message);quit(1)});
