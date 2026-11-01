import test from 'node:test';import assert from 'node:assert/strict';
const sources=[];
class Param{value=0;setValueAtTime(v){this.value=v;}exponentialRampToValueAtTime(v){this.value=v;}linearRampToValueAtTime(v){this.value=v;}setTargetAtTime(v){this.value=v;}}
class Node{gain=new Param();frequency=new Param();Q=new Param();threshold=new Param();knee=new Param();ratio=new Param();attack=new Param();release=new Param();connect(){}disconnect(){}start(){}stop(at){if(at===undefined)this.onended?.();}}
let context;
class Context{constructor(){context=this;}currentTime=0;sampleRate=8000;state='running';destination={};createGain(){return new Node();}createDynamicsCompressor(){return new Node();}createOscillator(){const n=new Node();sources.push(n);return n;}createBufferSource(){const n=new Node();sources.push(n);return n;}createBiquadFilter(){return new Node();}createBuffer(_,length){return{getChannelData:()=>new Float32Array(length)};}resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}}
globalThis.window={AudioContext:Context};
const audio=await import('../src/audio.js');
test('All cues use bounded voices, honor mute/pause, and do not unlock automatically',()=>{
 assert.equal(audio.playSnd('hit'),false);audio.unlockAudio();
 for(const effect of audio.SOUND_EFFECTS){context.currentTime+=1;audio.suspendAudio();audio.unlockAudio();assert.equal(audio.playSnd(effect),true,effect);}
 audio.suspendAudio();audio.unlockAudio();let before=sources.length;
 for(let i=0;i<100;i++){context.currentTime+=.05;audio.playSnd('hit');}
 assert.ok(sources.length-before<=audio.MAX_EFFECT_VOICES);
 audio.suspendAudio();assert.equal(context.state,'suspended');assert.equal(audio.playSnd('clear'),false);assert.equal(context.state,'suspended');
 audio.unlockAudio();audio.setAudioPreferences({muted:true});before=sources.length;assert.equal(audio.playSnd('hit'),false);assert.equal(sources.length,before);
 audio.setAudioPreferences({muted:false,volume:0});assert.equal(audio.playSnd('hit'),false);
 audio.setAudioPreferences({volume:.4});context.currentTime+=1;assert.equal(audio.playSnd('menu'),true);assert.equal(audio.playSnd('menu'),false);
});
