import { CHAPTERS } from './data/chapters.js';
import { STAGE_CONFIGS, indexToStageSub, stageSubToKey } from './data/stage-configs.js';

// Pure progress interpretation shared by the route, marker, and substage picker.
export function journeyRecord(index, state) {
  const { stage, sub } = indexToStageSub(index), key = stageSubToKey(stage, sub);
  const stars = state.stars[key] || 0;
  return { index, stage, sub, stars, locked: index > state.unlocked,
    cleared: state.scores[key] !== undefined || state.times[key] !== undefined || stars > 0 };
}
export function explorerIndex(state) {
  for (let index = 1; index <= state.unlocked; index++) if (!journeyRecord(index, state).cleared) return index;
  return Math.min(250, state.unlocked);
}

const landmarks = [
  ['The First Observatory','はじまりの天文台'], ['The Force Observatory','力の観測所'],
  ['The Clockwork Ascent','時計仕掛けの塔'], ['The Gate Sanctuary','転移の聖域'],
  ['The Dynamics Laboratory','振り子の研究所'], ['The Cosmic Citadel','宇宙の城塞'],
];
export function installJourneyMap({ $, getState, launch, showGrid }) {
  let view = 'map', selected = 1, chapter = 1;
  const mobile = matchMedia('(max-width:600px)');
  const node = (tag, className, text) => {
    const element = document.createElement(tag); if (className) element.className = className;
    if (text !== undefined) element.textContent = text; return element;
  };
  function select(index) {
    selected = index; chapter = CHAPTERS.find(c => Math.ceil(index / 5) >= c.start && Math.ceil(index / 5) <= c.end).id;
    render();
  }
  function setView(next) { view = next; render(); }
  function render() {
    const state = getState(), ja = state.language === 'ja', t = state.strings;
    const ch = CHAPTERS[chapter - 1], marker = explorerIndex(state), markerStage = Math.ceil(marker / 5);
    $('journeyMapButton').textContent = t.journeyMap;
    $('journeyGridButton').textContent = t.journeyGrid;
    $('journeyFind').textContent = t.journeyFind;
    $('journeyMapButton').setAttribute('aria-pressed', String(view === 'map'));
    $('journeyGridButton').setAttribute('aria-pressed', String(view === 'grid'));
    $('journeyContent').hidden = view !== 'map';
    for (const el of [$('stageGrid'), $('stageFilterEmpty'), ...document.querySelectorAll('.stage-filter-bar')]) {
      if (el.id === 'stageFilterEmpty') el.hidden = view !== 'grid' || Number(el.dataset.matching || 0) > 0;
      else el.hidden = view !== 'grid';
    }
    $('journeyChapters').setAttribute('aria-label', t.journeyChapters);
    $('journeyChapters').replaceChildren(...CHAPTERS.map(c => {
      const button = node('button', 'btn-nav', `${c.id} · ${ja ? c.ja : c.name}`);
      button.type = 'button'; button.setAttribute('aria-pressed', String(c.id === chapter));
      button.onclick = () => { select((c.start - 1) * 5 + 1); $('journeyTitle').focus({preventScroll:true}); }; return button;
    }));
    $('journeyTitle').textContent = `${ch.icon} ${landmarks[chapter - 1][ja ? 1 : 0]}`;
    $('journeyRange').textContent = t.journeyRange(ch.start, ch.end);
    $('journeyLegend').textContent = t.journeyLegend;
    $('journeyRoute').setAttribute('aria-label', t.journeyMap);
    $('journeyRoute').replaceChildren();
    const columns = mobile.matches ? 2 : 3, count = ch.end - ch.start + 1, rows = Math.ceil(count / columns);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${columns * 100} ${rows * 145}`);
    svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    const points = [];
    const records = [];
    for (let stage = ch.start; stage <= ch.end; stage++) {
      const offset = stage - ch.start, row = Math.floor(offset / columns), col = row % 2 ? columns - 1 - offset % columns : offset % columns;
      points.push(`${col * 100 + 50},${row * 145 + 38}`);
      const substages = Array.from({length:5}, (_, i) => journeyRecord((stage - 1) * 5 + i + 1, state));
      records.push(...substages);
      const locked = substages.every(r => r.locked), cleared = substages.every(r => r.cleared);
      const total = substages.reduce((sum, r) => sum + r.stars, 0), cfg = STAGE_CONFIGS[stage];
      const button = node('button', `journey-node ${locked ? 'locked' : cleared ? 'cleared' : 'available'}`);
      button.type = 'button'; button.dataset.journeyStage = stage;
      button.style.gridRow = row + 1; button.style.gridColumn = col + 1;
      button.setAttribute('aria-pressed', String(Math.ceil(selected / 5) === stage));
      if (state.current !== 'sandbox' && Math.ceil(state.current / 5) === stage) button.setAttribute('aria-current', 'step');
      const title = `${stage} · ${ja ? cfg.ja.name : cfg.name}`;
      button.setAttribute('aria-label', `${title}, ${locked ? t.journeyLocked : t.journeyStars(total, 15)}${stage === markerStage ? `, ${t.journeyExplorer}` : ''}`);
      button.append(node('span', 'journey-disc', locked ? '▣' : cleared ? '✓' : String(stage)), node('span', 'journey-node-title', title), node('span', 'journey-node-stars', locked ? t.journeyLocked : t.journeyStars(total, 15)));
      if (stage === markerStage) {
        const explorer = node('span', 'journey-explorer'); explorer.setAttribute('aria-hidden', 'true'); button.append(explorer);
      }
      button.onclick = () => { select(substages.find(r => !r.locked && !r.cleared)?.index || substages[0].index); $('journeyStageTitle').focus({preventScroll:!mobile.matches}); };
      $('journeyRoute').append(button);
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute('points', points.join(' ')); svg.append(path); $('journeyRoute').prepend(svg);
    $('journeyRoute').style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    $('journeySummary').textContent = t.journeySummary(records.filter(r => r.cleared).length, records.length, records.reduce((sum,r)=>sum+r.stars,0), records.length * 3);
    const picked = journeyRecord(selected, state), cfg = STAGE_CONFIGS[picked.stage];
    $('journeyStageTitle').textContent = `${picked.stage} · ${ja ? cfg.ja.name : cfg.name}`;
    $('journeyStageDescription').textContent = ja ? cfg.ja.desc : cfg.desc;
    $('journeySubs').setAttribute('aria-label', t.journeySubstages);
    $('journeySubs').replaceChildren(...Array.from({length:5}, (_,i) => {
      const r = journeyRecord((picked.stage - 1) * 5 + i + 1, state);
      const button = node('button', 'journey-sub'); button.type = 'button'; button.dataset.journeySub = r.index;
      button.setAttribute('aria-pressed', String(r.index === selected));
      const status = r.locked ? t.journeyLocked : r.cleared ? t.clearBest : t.filterUncleared;
      button.setAttribute('aria-label', `${r.stage}-${r.sub}, ${status}, ${t.journeyStars(r.stars, 3)}`);
      button.append(node('strong', '', `${r.stage}-${r.sub}`), node('small', '', status), node('span', '', r.locked ? '▣' : '★'.repeat(r.stars) + '☆'.repeat(3-r.stars)));
      button.onclick = () => { select(r.index); $('journeySubs').querySelector('[aria-pressed="true"]')?.focus({preventScroll:true}); }; return button;
    }));
    $('journeyPlay').textContent = picked.locked ? t.journeyLocked : `▶ PLAY ${picked.stage}-${picked.sub}`;
    $('journeyPlay').disabled = picked.locked;
    $('journeyHint').textContent = picked.locked ? t.journeyUnlock(indexToStageSub(selected - 1).label.replace('STAGE ','')) : picked.cleared ? (picked.stars < 3 ? t.journeyMissing : t.journeyReplay) : t.journeyReady;
    $('journeyPlay').onclick = () => { if (!journeyRecord(selected, getState()).locked) launch(selected); };
  }
  $('journeyMapButton').onclick = () => setView('map');
  $('journeyGridButton').onclick = () => { showGrid(); setView('grid'); };
  $('journeyFind').onclick = () => { view = 'map'; select(explorerIndex(getState())); $('journeyRoute').querySelector('[aria-pressed="true"]')?.focus({preventScroll:true}); };
  mobile.addEventListener('change', render);
  return { render, open() { const state=getState(); select(state.current==='sandbox'?state.unlocked:state.current); },
    jump(index) { if(view!=='map')return false;select(index);$('journeyRoute').querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});return true; } };
}
