import { environmentIdForStage, getEnvironmentRenderer } from './environment-registry.js';
import { drawParallaxLayers } from './parallax-system.js';

// Custom world renderers may provide layers, optional light/effects and a draw
// callback. Returning false delegates to the exact legacy environment drawing.
// No custom world is installed by default.
export function renderEnvironment(ctx, width, height, options = {}, legacyDraw) {
  const id = environmentIdForStage(options.index);
  const renderer = id && getEnvironmentRenderer(id);
  if (!renderer) return legacyDraw(ctx,width,height,options);
  const scene = Object.freeze({
    id, width, height, index: options.index,
    reduced: options.reduced === true,
    options: Object.freeze({ ...options })
  });
  ctx.save();
  let result;
  try {
    const world = renderer(scene);
    if (!world || world === false) result = false;
    else {
      if (world.layers) drawParallaxLayers(ctx,world.layers,{width,height,reduced:scene.reduced,cameraX:world.cameraX||0,cameraY:world.cameraY||0});
      if (typeof world.draw === 'function') world.draw(ctx,scene);
      if (typeof world.lighting === 'function') world.lighting(ctx,scene);
      if (typeof world.effects === 'function') world.effects(ctx,scene);
      result = true;
    }
  } finally { ctx.restore(); }
  return result === false ? legacyDraw(ctx,width,height,options) : true;
}
