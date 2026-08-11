/**
 * Holds rendered flipbook pages as JPEG Blobs and hands the engine decoded
 * ImageBitmaps on demand, keeping only a small LRU window decoded.
 *
 * Blobs never become object URLs and bitmaps never enter the DOM as a src,
 * so there is nothing in the inspector to right-click and save.
 */
export function createPageStore({ maxBitmaps = 12 } = {}) {
  const blobs = [];
  const bitmaps = new Map(); // idx -> ImageBitmap, insertion order = LRU
  const decoding = new Map(); // idx -> Promise<ImageBitmap>
  const waiters = new Map(); // idx -> [resolve]

  let count = 0;
  let ratio = 1.4136;
  let disposed = false;

  const touch = (idx, bmp) => {
    bitmaps.delete(idx);
    bitmaps.set(idx, bmp);
    while (bitmaps.size > maxBitmaps) {
      // Drop the reference only — the pixels are already copied into whatever
      // canvas used them, and closing could race an in-flight drag.
      bitmaps.delete(bitmaps.keys().next().value);
    }
  };

  const decode = (idx) => {
    if (decoding.has(idx)) return decoding.get(idx);
    const task = createImageBitmap(blobs[idx])
      .then((bmp) => {
        decoding.delete(idx);
        if (disposed) return null;
        touch(idx, bmp);
        return bmp;
      })
      .catch(() => {
        decoding.delete(idx);
        return null;
      });
    decoding.set(idx, task);
    return task;
  };

  return {
    get count() {
      return count;
    },
    set count(v) {
      count = v;
    },
    get ratio() {
      return ratio;
    },
    set ratio(v) {
      if (v > 0) ratio = v;
    },

    has: (idx) => !!blobs[idx],
    readyCount: () => blobs.filter(Boolean).length,

    setPage(idx, blob) {
      if (disposed) return;
      blobs[idx] = blob;
      const queued = waiters.get(idx);
      if (queued) {
        waiters.delete(idx);
        decode(idx).then((bmp) => queued.forEach((resolve) => resolve(bmp)));
      }
    },

    /** Decoded bitmap if it's already in the window, else null (never throws). */
    peek(idx) {
      const bmp = bitmaps.get(idx);
      if (bmp) {
        touch(idx, bmp);
        return bmp;
      }
      if (blobs[idx]) decode(idx); // warm it for the next paint
      return null;
    },

    /** Resolves once the page exists and is decoded. */
    request(idx) {
      if (disposed || idx < 0 || idx >= count) return Promise.resolve(null);
      const bmp = bitmaps.get(idx);
      if (bmp) {
        touch(idx, bmp);
        return Promise.resolve(bmp);
      }
      if (blobs[idx]) return decode(idx);
      return new Promise((resolve) => {
        const list = waiters.get(idx) || [];
        list.push(resolve);
        waiters.set(idx, list);
      });
    },

    dispose() {
      disposed = true;
      bitmaps.forEach((bmp) => bmp.close?.());
      bitmaps.clear();
      decoding.clear();
      waiters.clear();
      blobs.length = 0;
    },
  };
}

export default createPageStore;
