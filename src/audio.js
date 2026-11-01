// Procedural expedition sound palette. No downloads, music, or chapter ambience.
let audioCtx=null,masterGain=null,noiseSource=null,noiseFilter=null,noiseGain=null;
let preferences={volume:1,muted:false},noiseBuffer=null;
const voices=new Set(),lastPlayed=new Map();
export const MAX_EFFECT_VOICES=18;
export const SOUND_EFFECTS=['launch','hit','shield_hit','armor_break','clink','brake','bomb','pulse','clear','fail','firework','portal','laser','boost','gate','spring','blackhole','home_travel','home_land','home_arrive','menu','confirm'];
function stopEffects(){for(const voice of [...voices]){try{voice.source.stop();}catch{}voice.cleanup();}lastPlayed.clear();}
export function setAudioPreferences(next){
  preferences={...preferences,...next};
  if(!Number.isFinite(preferences.volume))preferences.volume=1;
  preferences.volume=Math.max(0,Math.min(1,preferences.volume));
  if(masterGain)masterGain.gain.value=preferences.muted?0:preferences.volume;
  if(preferences.muted||preferences.volume===0)stopEffects();
}
export function unlockAudio(){
  try{
    if(!audioCtx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audioCtx=new Audio();masterGain=audioCtx.createGain();masterGain.gain.value=preferences.muted?0:preferences.volume;
      const compressor=audioCtx.createDynamicsCompressor();compressor.threshold.value=-16;compressor.knee.value=12;compressor.ratio.value=5;compressor.attack.value=.003;compressor.release.value=.15;masterGain.connect(compressor);compressor.connect(audioCtx.destination);}
    if(audioCtx.state==='suspended')audioCtx.resume()?.catch?.(()=>{});
  }catch{audioCtx=null;masterGain=null;}
}
export function suspendAudio(){
  stopEffects();if(noiseGain&&audioCtx)noiseGain.gain.setValueAtTime(0,audioCtx.currentTime);
  if(audioCtx?.state==='running')audioCtx.suspend()?.catch?.(()=>{});
}
function buffer(){
  if(!noiseBuffer){noiseBuffer=audioCtx.createBuffer(1,audioCtx.sampleRate,audioCtx.sampleRate);const data=noiseBuffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;}
  return noiseBuffer;
}
function voice(source,gain,filter,end){
  const item={source,cleanup(){voices.delete(item);source.disconnect();gain.disconnect();filter?.disconnect();}};
  source.onended=item.cleanup;voices.add(item);source.connect(filter||gain);if(filter)filter.connect(gain);gain.connect(masterGain);source.start();source.stop(end);
}
function tone(frequency,endFrequency,duration,level=.1,type='sine',delay=0){
  if(voices.size>=MAX_EFFECT_VOICES)return;
  const now=audioCtx.currentTime+delay,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(frequency,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,endFrequency),now+duration);
  g.gain.setValueAtTime(0,audioCtx.currentTime);g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(level,now+.006);g.gain.exponentialRampToValueAtTime(.0001,now+duration);
  // Delayed notes are silent until their envelopes start and are cancelled on pause/mute.
  voice(o,g,null,now+duration+.02);
}
function noise(duration,frequency,level=.08,type='lowpass'){
  if(voices.size>=MAX_EFFECT_VOICES)return;
  const now=audioCtx.currentTime,source=audioCtx.createBufferSource(),g=audioCtx.createGain(),f=audioCtx.createBiquadFilter();source.buffer=buffer();f.type=type;f.frequency.value=frequency;g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(level,now+.01);g.gain.exponentialRampToValueAtTime(.0001,now+duration);voice(source,g,f,now+duration+.02);
}
export function playSnd(type,combo=0){
  if(!audioCtx||audioCtx.state!=='running'||preferences.muted||preferences.volume<=0||!SOUND_EFFECTS.includes(type))return false;
  const now=audioCtx.currentTime,cooldown=['menu','confirm'].includes(type)?.07:['hit','clink','brake','shield_hit'].includes(type)?.045:type==='blackhole'?.35:.12;
  if(now-(lastPlayed.get(type)??-Infinity)<cooldown)return false;
  const priority=['clear','home_arrive','fail'].includes(type);if(priority)stopEffects();else if(voices.size>MAX_EFFECT_VOICES-3)return false;
  lastPlayed.set(type,now);
  const variation=2**((Math.random()-.5)*.7/12),pitch=variation*2**(Math.min(6,Math.max(0,combo))/12);
  switch(type){
    case 'launch':noise(.18,1500,.065,'bandpass');tone(210,390,.15,.07,'triangle');break;
    case 'hit':tone(510*pitch,300*pitch,.075,.15,'triangle');tone(1050*pitch,1040*pitch,.17,.055,'sine',.025);break;
    case 'shield_hit':tone(730*variation,390,.12,.09,'triangle');tone(1530*variation,1220,.08,.035);break;
    case 'armor_break':noise(.12,2800,.07,'highpass');tone(1450,900,.2,.07,'triangle');break;
    case 'clink':case 'brake':tone(290*variation,140,.12,.1,'triangle');break;
    case 'bomb':noise(.35,420,.21);tone(95,42,.3,.12);break;
    case 'pulse':tone(230,700,.2,.11);noise(.12,900,.04,'bandpass');break;
    case 'clear':case 'home_arrive':
      [523.25,659.25,783.99].forEach((f,i)=>tone(f,f,.32,type==='clear'?.115:.085,'triangle',i*.12));break;
    case 'fail':tone(196,98,.35,.09,'triangle');break;
    case 'firework':noise(.22,650,.075);tone(250*variation,90,.2,.04);break;
    case 'portal':tone(240,860,.14,.085);tone(700,220,.19,.075,'sine',.13);noise(.25,1800,.025,'bandpass');break;
    case 'laser':tone(780,180,.16,.075,'triangle');noise(.09,2400,.035,'highpass');break;
    case 'boost':tone(260,1040,.2,.11);break;
    case 'gate':tone(650,520,.06,.075,'triangle');noise(.23,650,.055);tone(165,115,.22,.045,'triangle');break;
    case 'spring':tone(160*variation,590,.1,.13);tone(590,330,.16,.085,'sine',.09);break;
    case 'blackhole':tone(120,38,.4,.13);noise(.32,300,.08,'bandpass');break;
    case 'home_travel':noise(.34,1300,.045,'bandpass');tone(390,660,.3,.045);break;
    case 'home_land':tone(250,150,.07,.075,'triangle');break;
    case 'menu':tone(430*variation,320,.055,.035,'triangle');break;
    case 'confirm':tone(660,660,.1,.05,'triangle');tone(880,880,.14,.04,'sine',.06);break;
  }
  return true;
}
export function initWindAudio() {
  unlockAudio();
  if (!noiseSource && audioCtx) {
    const bufSize = Math.floor(audioCtx.sampleRate * 1.5);
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buf;
    noiseSource.loop = true;

    noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.Q.setValueAtTime(3.0, audioCtx.currentTime);

    noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();
  }
}

export function updateWindSpeed(speed, isPlaying = true) {
  if (!audioCtx || !noiseFilter || !isPlaying) {
    if (noiseGain && audioCtx) noiseGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
    return;
  }
  const now = audioCtx.currentTime;
  const freq = 380 + Math.min(2200, speed * 120);
  const gain = Math.min(0.24, Math.max(0, (speed - 0.4) * 0.02));
  noiseFilter.frequency.setTargetAtTime(freq, now, 0.04);
  noiseGain.gain.setTargetAtTime(gain, now, 0.04);
}
