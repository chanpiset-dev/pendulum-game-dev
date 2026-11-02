// M9 Phase 1C.1: the approved stair-free forest image is decorative only.
// Loaded lazily in a browser; if unavailable, the existing M8 Canvas forest is used.
export const APPROVED_FOREST_URL = new URL('../../forest-stair-free.png', import.meta.url).href;
let image = null;
let status = 'unloaded';
export function approvedForestImageReady() {
  if (status === 'ready') return true;
  if (status !== 'unloaded' || typeof Image === 'undefined') return false;
  status = 'loading';
  try {
    const next = new Image();
    next.onload = () => {
      if (next.naturalWidth > 0 && next.naturalHeight > 0) {
        image = next;
        status = 'ready';
      } else status = 'failed';
    };
    next.onerror = () => { status = 'failed'; };
    next.src = APPROVED_FOREST_URL;
  } catch { status = 'failed'; }
  return false;
}
export function drawApprovedForestImage(ctx, width, height) {
  if (!approvedForestImageReady() || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return false;
  ctx.drawImage(image, 0, 0, width, height);
  return true;
}
export function approvedForestImageStatus() { return status; }
