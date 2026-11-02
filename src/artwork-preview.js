import { ARTWORK_ITEMS, artworkStyleForTheme, drawArtwork, drawLivePendulum } from './engine/artwork.js';
import { getCanvasPalette, drawThemeBackdrop } from './themes.js';
import { installFantasyGimmickSkins } from './graphics/fantasy-gimmicks.js';
import { installGimmickSkinSettings } from './graphics/gimmick-skin-settings.js';
import { getGimmickSkin, visualIdForGimmick, registerGimmickSkin, unregisterGimmickSkin } from './graphics/gimmick-registry.js';
export function installArtworkPreview({ $, language, storage }) {
  installGimmickSkinSettings({ $, storage });
  const dialog = $('artworkDialog'), canvas = $('artworkStage'), ctx = canvas.getContext('2d');
  let animation = null, started = 0;
  // Preview overlays the registry only during synchronous drawing; live gameplay
  // returns to the exact prior registry immediately after each specimen.
  function withPreviewSkin(kind, fantasy, draw) {
    const id = visualIdForGimmick(kind), old = getGimmickSkin(id);
    if (fantasy) {
      const undo = installFantasyGimmickSkins();
      try { return draw(); } finally { undo(); }
    }
    if (old) unregisterGimmickSkin(id);
    try { return draw(); }
    finally { if (old) registerGimmickSkin(id, old); }
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const currentStyle = () => $('artworkStyle').value === 'auto' ? artworkStyleForTheme(getCanvasPalette().theme) : $('artworkStyle').value;
  function scene(seconds) {
    const palette = getCanvasPalette(), style = currentStyle();
    drawThemeBackdrop(ctx, canvas.width, canvas.height);
    // A demonstration scene, deliberately isolated from the live game's physics.
    ctx.save();
    ctx.strokeStyle = palette.rod; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(325, 55); ctx.lineTo(475, 55); ctx.stroke();
    ctx.fillStyle = palette.platform; ctx.fillRect(390, 43, 20, 24);
    ctx.translate(400, 55); ctx.rotate(Math.sin(seconds * 0.8) * 0.18);
    // Draw real link geometry at the carriage, without the specimen’s embedded rail.
    drawLivePendulum(ctx, { N:2, L:[0.9,0.9], state:[0.30,0.58,0,0], currentR:16 }, {x:0,y:0}, 95, 16, {style,palette}); ctx.restore();
    for (const [kind, x, y, radius] of [['target',160,275,35], ['armored',610,275,38], ['bomb',350,300,36], ['portal',700,145,45], ['boost',245,175,35], ['blackhole',500,325,45], ['repulsor',100,130,42], ['spring',105,365,35], ['laser',645,365,42], ['wind',660,55,35]]) drawArtwork(ctx, kind, x, y, radius, { style, palette, time: seconds });
  }
  function gallery() {
    const palette = getCanvasPalette(), style = currentStyle();
    canvas.style.imageRendering = style === 'pixel' ? 'pixelated' : 'auto';
    $('artworkStyleName').textContent = style === 'pixel' ? 'Pixel Arcade' : style === 'shaded' ? 'Shaded Canvas' : 'Clean Vector';
    const cards = ARTWORK_ITEMS.map(([kind, en, ja]) => {
      const item = document.createElement('div'); item.className = 'artwork-card';
      const label = document.createElement('span'); label.textContent = language() === 'ja' ? ja : en;
      const icon = document.createElement('canvas'); icon.style.imageRendering = style === 'pixel' ? 'pixelated' : 'auto'; icon.width = 160; icon.height = 128; icon.setAttribute('role', 'img'); icon.setAttribute('aria-label', label.textContent);
      const context = icon.getContext('2d'); context.fillStyle = palette.canvas; context.fillRect(0, 0, 160, 128);
      // Real rendering pipeline in both columns; no mock-up images.
      if (['pendulum','multi','clones'].includes(kind)) {
        drawArtwork(context,kind,80,64,56,{style,palette});
        item.append(icon,label);return item;
      }
      const mode = $('gimmickPreviewMode').value;
      const makeSpecimen = (fantasy) => {
        const sample = document.createElement('canvas');
        sample.width = 160; sample.height = 128;
        sample.style.maxWidth = '100%';
        sample.setAttribute('aria-label',label.textContent+' '+(fantasy?'Fantasy':'Original'));
        const c=sample.getContext('2d');c.fillStyle=palette.canvas;c.fillRect(0,0,160,128);
        withPreviewSkin(kind,fantasy,()=>drawArtwork(c,kind,80,64,56,{style,palette,time:0,hits:3}));
        return sample;
      };
      const pair=document.createElement('div');pair.className='fantasy-comparison';
      if(mode!=='fantasy'){const left=document.createElement('div');left.append(makeSpecimen(false));const title=document.createElement('small');title.textContent='Original';left.append(title);pair.append(left);}
      if(mode!=='legacy'){const right=document.createElement('div');right.append(makeSpecimen(true));const title=document.createElement('small');title.textContent='Fantasy';right.append(title);pair.append(right);}
      item.append(pair,label);return item;
    });
    $('artworkGallery').replaceChildren(...cards);
    scene(0);
  }
  function stop() { cancelAnimationFrame(animation); animation = null; }
  function tick(now) {
    animation = null;
    if (!dialog.open || document.hidden || reduced.matches) return;
    scene((now - started) / 1000);
    animation = requestAnimationFrame(tick);
  }
  function start() { stop(); started = performance.now(); if (!reduced.matches && !document.hidden) animation = requestAnimationFrame(tick); }
  $('btnArtworkPreview').addEventListener('click', () => {
    $('settingsDialog').close(); $('artworkStyle').value = 'auto';
    dialog.showModal(); gallery(); start(); $('artworkStyle').focus({ preventScroll: true }); dialog.scrollTop = 0;
  });
  $('artworkStyle').addEventListener('change', () => { gallery(); start(); });
  $('gimmickPreviewMode').addEventListener('change', () => { gallery(); start(); });
  $('artworkClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { stop(); $('settingsDialog').showModal(); $('btnArtworkPreview').focus(); });
  document.addEventListener('visibilitychange', () => { if (!dialog.open) return; if (document.hidden) stop(); else start(); });
  reduced.addEventListener('change', () => { if (!dialog.open) return; gallery(); start(); });
}
