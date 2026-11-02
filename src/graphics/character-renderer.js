import { FANTASY_EXPLORER_ID, drawFantasyExplorer } from './fantasy-explorer.js';
import { drawExplorerSprite } from './explorer-sprite-renderer.js';
import { drawExplorer } from '../engine/explorer.js';
import { resolveCharacterAnimation } from './character-animation.js';

// Optional skin registry. Default path always invokes the original explorer
// renderer with identical coordinates, radius, pixel mode and expression.
const skins = new Map();
let activeSkin = 'legacy';
skins.set(FANTASY_EXPLORER_ID, (ctx, attachment, options) => drawExplorerSprite(ctx, attachment, options) || drawFantasyExplorer(ctx, attachment, options));
export function registerCharacterSkin(id, renderer) {
  if (!id || id === 'legacy' || typeof renderer !== 'function') throw new TypeError('A non-legacy skin ID and render function are required');
  skins.set(id, renderer);
}
export function setCharacterSkin(id = 'legacy') { activeSkin = id; }
export function getCharacterSkin() { return activeSkin; }
export function drawCharacter(ctx, attachment, options = {}) {
  if (!attachment?.isTip) return;
  const animation = resolveCharacterAnimation(options);
  const radius = Math.max(1, attachment.radius - 1);
  const skin = options.skin === undefined ? activeSkin : options.skin;
  const renderer = skins.get(skin);
  if (renderer) {
    // Skin callbacks receive a read-only transform and must not mutate physics.
    ctx.save();
    let drawn;
    try { drawn = renderer(ctx, attachment, { ...options, animation, radius }); }
    finally { ctx.restore(); }
    if (drawn !== false) return;
    drawExplorer(ctx, attachment.x, attachment.y, radius, { pixel: options.pixel === true, mood: animation.expression });
  } else {
    drawExplorer(ctx, attachment.x, attachment.y, radius, {
      pixel: options.pixel === true, mood: animation.expression
    });
  }
}
