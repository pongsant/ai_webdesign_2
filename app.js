'use strict';
const $ = id => document.getElementById(id);
const audio = $('audio');
let albums = [], albumIndex = 0, trackIndex = 0, lastVolume = .7;
const notes = [
'A quiet search for solid ground. Warm basslines, live instrumentation, and unguarded reflections drift between melancholy and hope. A record to find your way back to.',
'Memories, blurred at the edges. Spare guitars and shifting voices turn small moments into something expansive. Best heard with nowhere else to be.',
'Gospel harmonies meet the tender edges of soul. An intimate debut about love, faith, and all the complicated space in between.',
'Neon lights after midnight. Glittering synths and shadowy confessionals follow a restless journey through heartbreak and the city.',
'Unhurried, atmospheric, and effortlessly soulful. Deep bass and velvet vocals make a world of their own. Let this one fill the room.',
'A world beneath the surface. Hushed vocals, dreamlike guitars, and blue-lit rhythms explore solitude, longing, and starting again.'
];
const format = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
function rangeFill(el) { el.style.setProperty('--fill', `${100 * (el.value-el.min)/(el.max-el.min)}%`); }
function setPlaying(playing) {
 document.body.classList.toggle('playing', playing);
 $('play').setAttribute('aria-label', playing ? 'Pause' : 'Play');
 $('play-icon').innerHTML = playing ? '<path d="M7 5h4v14H7zM14 5h4v14h-4z"/>' : '<path d="m9 5 11 7-11 7z"/>';
}
async function play() {
 try { await audio.play(); } catch (error) { setPlaying(false); $('status').textContent = 'Playback could not start. Please press play again.'; }
}
function selectTrack(index, autoplay = false) {
 const album = albums[albumIndex]; trackIndex = (index + album.tracks.length) % album.tracks.length;
 const track = album.tracks[trackIndex];
 audio.pause();
 // Set a track's `audio` to a licensed file path to replace the original demo.
 audio.src = track.audio || `assets/demo-${albumIndex + 1}.wav`;
 audio.load(); $('elapsed').textContent='0:00'; $('progress').value=0; rangeFill($('progress'));
 $('current-track').textContent=track.title; $('current-artist').textContent=`${album.artist} · ${track.audio ? 'Audio playback' : 'Original demo'}`;
 document.querySelectorAll('.track').forEach((button,i) => {
  button.classList.toggle('active', i===trackIndex);
  button.setAttribute('aria-pressed',String(i===trackIndex));
  button.querySelector('.number').textContent=i===trackIndex?'♫':String(i+1).padStart(2,'0');
 });
 if(autoplay) play();
}
function selectAlbum(index) {
 const autoplay=!audio.paused; albumIndex=index;
 const album=albums[index];
 $('main-cover').src=`assets/${album.slug}.jpg`; $('main-cover').alt=`${album.title} by ${album.artist} album cover`;
 $('record-label').src=`assets/${album.slug}.jpg`;
 $('artist').textContent=album.artist; $('album-title').textContent=album.title; $('year').textContent=album.year;
 $('track-count').textContent=`${album.tracks.length} tracks`;
 $('runtime').textContent=`${Math.round(album.tracks.reduce((sum,t)=>sum+t.seconds,0)/60)} min`;
 $('genre').textContent=album.genre; $('description').textContent=notes[index]; $('album-link').href=album.url;
 $('edition-number').textContent=`RECORD ${String(index+1).padStart(2,'0')} / 06`;
 $('tracklist').replaceChildren(...album.tracks.map((track,i)=>{
  const li=document.createElement('li'), button=document.createElement('button'); button.className='track';
  const num=document.createElement('span');num.className='number';num.textContent=String(i+1).padStart(2,'0');
  const title=document.createElement('span');title.className='track-title';title.textContent=track.title;
  const duration=document.createElement('span');duration.className='time';duration.textContent=format(track.seconds);
  button.append(num,title,duration);button.title=track.title;button.addEventListener('click',()=>selectTrack(i,true));li.append(button);return li;
 }));
 $('tracklist').scrollTop=0;
 document.querySelectorAll('.album-card').forEach((button,i)=>{button.classList.toggle('selected',index===i);button.setAttribute('aria-pressed',String(index===i));});
 document.body.classList.remove('switching');void document.body.offsetWidth;document.body.classList.add('switching');
 selectTrack(0,autoplay);$('status').textContent=`Selected ${album.title} by ${album.artist}.`;
}
$('play').addEventListener('click',()=>audio.paused?play():audio.pause());
$('previous').addEventListener('click',()=>selectTrack(trackIndex-1,true));
$('next').addEventListener('click',()=>selectTrack(trackIndex+1,true));
audio.addEventListener('play',()=>setPlaying(true));audio.addEventListener('pause',()=>setPlaying(false));
audio.addEventListener('ended',()=>selectTrack(trackIndex+1,true));
audio.addEventListener('loadedmetadata',()=>{ $('progress').max=audio.duration; $('duration').textContent=format(audio.duration); });
audio.addEventListener('timeupdate',()=>{ $('elapsed').textContent=format(audio.currentTime);$('progress').value=audio.currentTime;rangeFill($('progress')); });
$('progress').addEventListener('input',e=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(e.target.value);rangeFill(e.target);});
function volumeUpdate(){const v=audio.muted?0:audio.volume;$('volume').value=v;rangeFill($('volume'));$('mute').setAttribute('aria-label',v===0?'Unmute':'Mute');$('mute').style.opacity=v===0?'.4':'1';}
$('volume').addEventListener('input',e=>{audio.volume=Number(e.target.value);audio.muted=false;volumeUpdate();});
$('mute').addEventListener('click',()=>{if(audio.muted||audio.volume===0){audio.muted=false;audio.volume=lastVolume||.7;}else{lastVolume=audio.volume;audio.muted=true;}volumeUpdate();});
audio.volume=.7;volumeUpdate();
fetch('albums.json').then(r=>{if(!r.ok)throw Error('Album data unavailable');return r.json();}).then(data=>{
 albums=data;
 $('album-shelf').replaceChildren(...albums.map((album,i)=>{
  const button=document.createElement('button');button.className='album-card';button.setAttribute('aria-label',`Explore ${album.title} by ${album.artist}`);
  const image=document.createElement('img');image.src=`assets/${album.slug}.jpg`;image.alt=`${album.title} album cover`;
  const title=document.createElement('span');title.className='card-title';title.textContent=album.title;
  const bottom=document.createElement('span');bottom.className='card-bottom';
  const artist=document.createElement('span');artist.textContent=album.artist;
  const year=document.createElement('span');year.className='card-year';year.textContent=album.year;
  bottom.append(artist,year);button.append(image,title,bottom);button.addEventListener('click',()=>selectAlbum(i));return button;
 }));selectAlbum(0);
}).catch(error=>{$('status').textContent=error.message;$('description').textContent='Album data could not load. Please serve this folder with a local web server.';});
