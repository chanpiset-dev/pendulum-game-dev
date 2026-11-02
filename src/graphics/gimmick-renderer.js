import { getGimmickSkin, visualIdForGimmick } from './gimmick-registry.js';
import { resolveGimmickAnimation } from './gimmick-animation.js';

// A skin may return false to request the original artwork. No custom skin is
// enabled by default. Canvas save/restore isolates custom skin drawing state.
export function renderGimmick(ctx, props, drawLegacy) {
  const visualId = visualIdForGimmick(props.kind);
  const skin = getGimmickSkin(visualId);
  if (!skin) return drawLegacy(ctx, props);
  const animation = resolveGimmickAnimation(props);
  ctx.save();
  try {
    if (skin(ctx, Object.freeze({ ...props, visualId, animation })) !== false) return;
  } finally {
    ctx.restore();
  }
  return drawLegacy(ctx, props);
}
