// Presentation-only layer composer; defaults to no layers so approved visuals
// are unchanged. Layers are authored in screen-space normalized coordinates.
export function createParallaxLayers(layers = []) {
  return Object.freeze(layers.map(layer => Object.freeze({
    depth: layer.depth ?? 1,
    offsetX: layer.offsetX ?? 0,
    offsetY: layer.offsetY ?? 0,
    draw: layer.draw
  })));
}
export function drawParallaxLayers(ctx, layers, { width, height, cameraX = 0, cameraY = 0, reduced = false } = {}) {
  for (const layer of layers) {
    if (typeof layer.draw !== 'function') continue;
    ctx.save();
    try {
      ctx.translate(layer.offsetX - (reduced ? 0 : cameraX * layer.depth), layer.offsetY - (reduced ? 0 : cameraY * layer.depth));
      layer.draw(ctx, { width, height, reduced });
    } finally { ctx.restore(); }
  }
}
