import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgressStore, PROGRESS_KEYS } from '../src/progress.js';
import { LEGACY_STAGE_IDS, LEGACY_PROGRESS_KEYS, MIGRATION_KEY, migrateLegacyIndex } from '../src/data/stage-migration.js';
const fixture = entries => {
 const data = new Map(Object.entries(entries));
 const storage = {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 return {data,storage,store:()=>createProgressStore({getStorage:()=>storage})};
};
test('All 250 legacy records move to the corresponding sequential stage exactly once',()=>{
 const entries={};
 for(const field of ['scores','stars','times','ghosts','briefed']){
  const value={};for(let s=1;s<=50;s++)for(let u=1;u<=5;u++){
   const key=field==='briefed'?`stage_${s}`:`stage_${s}_sub_${u}`;
   value[key]=field==='scores'?s*100+u:field==='stars'?s%4:field==='times'?s+u/10:field==='ghosts'?[{x:s,y:u}]:true;
  }
  entries[LEGACY_PROGRESS_KEYS[field]]=JSON.stringify(value);
 }
 entries[LEGACY_PROGRESS_KEYS.unlocked]='250';
 const f=fixture(entries), loaded=f.store().load();
 for(let old=1;old<=50;old++)for(let sub=1;sub<=5;sub++){
  const key=`stage_${LEGACY_STAGE_IDS[old]}_sub_${sub}`;
  assert.equal(loaded.scores[key],old*100+sub);
  assert.equal(loaded.stars[key],old%4);
  assert.equal(loaded.times[key],old+sub/10);
  assert.deepEqual(loaded.ghosts[key],[{x:old,y:sub}]);
  assert.equal(loaded.briefed[`stage_${LEGACY_STAGE_IDS[old]}`],true);
 }
 assert.equal(loaded.unlocked,250);
 assert.deepEqual(f.store().load(),loaded);
 for(const [key,value] of Object.entries(entries))assert.equal(f.data.get(key),value,'Legacy backups untouched');
 assert.ok(f.data.has(MIGRATION_KEY));
});
test('Partial progress retains every accessible stage without inventing clears',()=>{
 const f=fixture({[LEGACY_PROGRESS_KEYS.unlocked]:'80',[LEGACY_PROGRESS_KEYS.scores]:'{"stage_6_sub_2":1234}'});
 const loaded=f.store().load();
 for(let old=1;old<=80;old++)assert.ok(loaded.unlocked>=migrateLegacyIndex(old));
 assert.equal(loaded.unlocked,180);
 assert.deepEqual(loaded.scores,{stage_13_sub_2:1234});
 assert.deepEqual(loaded.stars,{});
 assert.deepEqual(loaded.times,{});
 const store=f.store();store.saveProgress({...loaded,scores:{...loaded.scores,stage_1_sub_1:900}});
 assert.equal(f.store().load().scores.stage_1_sub_1,900);
});
test('Failed migration persistence is retryable and never relabels saved v7 records',()=>{
 const f=fixture({[LEGACY_PROGRESS_KEYS.unlocked]:'30',[LEGACY_PROGRESS_KEYS.scores]:'{"stage_6_sub_1":800}'});
 const write=f.storage.setItem;
 f.storage.setItem=(key,value)=>{if(key===MIGRATION_KEY)throw new Error('Denied');write(key,value)};
 const store=f.store(), loaded=store.load();assert.equal(loaded.scores.stage_13_sub_1,800);
 store.saveProgress({...loaded,scores:{...loaded.scores,stage_4_sub_1:100}});
 assert.deepEqual(f.store().load().scores,{stage_13_sub_1:800,stage_4_sub_1:100});
 f.storage.setItem=write;
 assert.deepEqual(f.store().load().scores,{stage_13_sub_1:800,stage_4_sub_1:100});
 assert.ok(f.data.has(MIGRATION_KEY));
});
test('Damaged legacy fields recover independently and new players start at 1',()=>{
 const f=fixture({[LEGACY_PROGRESS_KEYS.scores]:'{broken',[LEGACY_PROGRESS_KEYS.times]:'{"stage_6_sub_1":2.5}',[LEGACY_PROGRESS_KEYS.stars]:'{"stage_999_sub_1":3}'});
 assert.deepEqual(f.store().load().times,{stage_13_sub_1:2.5});
 assert.deepEqual(f.store().load().scores,{});
 assert.equal(fixture({}).store().load().unlocked,1);
 assert.equal(migrateLegacyIndex(0),null);
 assert.equal(migrateLegacyIndex(251),null);
});

test('Chapter boundaries and actual builder IDs cover 1–50 in order',async()=>{
 const {CHAPTERS,DIFFICULTIES}=await import('../src/data/chapters.js');
 const {STAGE_CONFIGS,STAGE_ORDER}=await import('../src/data/stage-configs.js');
 const {readFile}=await import('node:fs/promises');
 const slugs=['basics','forces','anchors','gadgets','dynamics','mastery'];
 let expected=1;
 for(const chapter of CHAPTERS){
  assert.equal(chapter.start,expected);
  const source=await readFile(new URL(`../src/data/stage-builders/chapter${chapter.id}-${slugs[chapter.id-1]}.js`,import.meta.url),'utf8');
  const actual=[...source.matchAll(/if \(stage === (\d+)\)/g)].map(m=>Number(m[1]));
  assert.deepEqual(actual,Array.from({length:chapter.end-chapter.start+1},(_,i)=>chapter.start+i));
  for(const id of actual){assert.ok(STAGE_CONFIGS[id].mechanicIcon);assert.ok(DIFFICULTIES[STAGE_CONFIGS[id].difficulty]);}
  expected=chapter.end+1;
 }
 assert.equal(expected,51);
 assert.deepEqual(STAGE_ORDER,Array.from({length:50},(_,i)=>i+1));
 assert.equal(new Set(Object.values(LEGACY_STAGE_IDS)).size,50);
});
