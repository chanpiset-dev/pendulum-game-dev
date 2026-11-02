// Optional image asset cache for future skins. No image requests are made
// until load() is called; no assets are loaded by the M1 legacy renderer.
export function createAssetManager({ createImage = () => new Image() } = {}) {
  const entries = new Map();
  function load(key, url) {
    if (!key || !url) return Promise.reject(new TypeError('Asset key and URL are required'));
    const existing = entries.get(key);
    if (existing) {
      if (existing.url !== url) return Promise.reject(new Error('Asset key already maps to another URL'));
      return existing.promise;
    }
    let image;
    try { image = createImage(); }
    catch (error) { return Promise.reject(error); }
    const entry = { url, image, status: 'loading', error: null, promise: null };
    entry.promise = new Promise((resolve, reject) => {
      image.onload = () => { entry.status = 'ready'; resolve(image); };
      image.onerror = () => { entry.status = 'error'; entry.error = new Error('Unable to load asset: ' + key); reject(entry.error); };
      image.src = url;
    });
    entries.set(key, entry);
    return entry.promise;
  }
  return Object.freeze({
    load,
    get(key) { const entry = entries.get(key); return entry?.status === 'ready' ? entry.image : null; },
    status(key) { return entries.get(key)?.status ?? 'missing'; },
    clear() { entries.clear(); }
  });
}
