/**
 * Imperative flipbook engine (spreads, CSS page flip, real corner-peel curl).
 *
 * Ported from the standalone prototype with one deliberate change: pages are
 * painted into <canvas> elements from in-memory ImageBitmaps instead of being
 * dropped into <img src="data:..."> tags — so no page ever exists in the DOM
 * as a copyable URL.
 *
 * @param {object}      opts
 * @param {HTMLElement} opts.bookEl    the <div> that holds the spread
 * @param {HTMLElement} opts.hitLeft   left drag/tap zone
 * @param {HTMLElement} opts.hitRight  right drag/tap zone
 * @param {object}      opts.source    { count, ratio, peek(i), request(i) }
 * @param {Function}    opts.onChange  ({ page, atStart, atEnd }) => void
 */
export function createFlipbook({ bookEl, hitLeft, hitRight, source, onChange }) {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let spreads = [];
  let spreadIdx = 0;
  let pageW = 0;
  let bookH = 0;
  let animating = false;
  let curlState = null;
  let generation = 0; // bumps on every re-render, cancels stale bitmap paints
  let destroyed = false;

  /* ---------------- painting ---------------- */

  function drawCover(ctx, bmp, w, h) {
    // The page bitmap is rendered well above display size, so it is always
    // downscaled here. Default filtering aliases small table type badly at a
    // ~3x reduction; high-quality smoothing is what keeps it legible.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const scale = Math.max(w / bmp.width, h / bmp.height);
    const dw = bmp.width * scale;
    const dh = bmp.height * scale;
    ctx.drawImage(bmp, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  function paint(canvas, bmp) {
    // Back the canvas at the device pixel ratio, but never above the page
    // bitmap's own resolution — upscaling past it only costs memory and makes
    // the type look soft.
    const ratio = bmp ? Math.min(DPR, bmp.width / pageW) : DPR;
    canvas.width = Math.round(pageW * ratio);
    canvas.height = Math.round(bookH * ratio);
    canvas.style.width = `${pageW}px`;
    canvas.style.height = `${bookH}px`;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f6f1e2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (bmp) drawCover(ctx, bmp, canvas.width, canvas.height);
  }

  /**
   * Paints page `idx` into `canvas`. If the bitmap isn't decoded yet we paint
   * blank paper, show a spinner on the slot and repaint once it arrives.
   */
  function paintPage(canvas, idx, slotEl) {
    const bmp = idx >= 0 && idx < source.count ? source.peek(idx) : null;
    paint(canvas, bmp);
    if (bmp || idx < 0 || idx >= source.count) return;

    slotEl?.classList.add("omt-slot-wait");
    const gen = generation;
    source.request(idx).then((late) => {
      if (destroyed || gen !== generation || !late) return;
      paint(canvas, late);
      slotEl?.classList.remove("omt-slot-wait");
    });
  }

  /* ---------------- layout ---------------- */

  const isMobile = () => window.innerWidth <= 760;

  // Desktop always shows a two-page spread. Phones fall back to one sheet,
  // where a spread would leave the type too small to read.
  const singlePageMode = () => isMobile();

  function buildSpreads() {
    const n = source.count;
    spreads = [];
    if (n <= 0) return;

    if (singlePageMode()) {
      for (let i = 0; i < n; i++) spreads.push([i]);
      return;
    }

    spreads.push([0]); // cover always stands alone
    let i = 1;
    while (i < n) {
      if (i + 1 < n) {
        spreads.push([i, i + 1]);
        i += 2;
      } else {
        spreads.push([i]);
        i += 1;
      }
    }
  }

  function sizeBook() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const single = singlePageMode();
    const isFS = !!document.fullscreenElement;
    // One sheet on screen can use the whole viewport; a two-page spread has to
    // fit two of them side by side.
    const maxH = vh * (isFS ? 0.97 : single ? 0.85 : 0.78);
    const maxW = vw * (single ? (isFS ? 0.97 : 0.92) : isFS ? 0.49 : 0.42);

    let h = maxH;
    let w = h * source.ratio;
    if (w > maxW) {
      w = maxW;
      h = w / source.ratio;
    }
    pageW = w;
    bookH = h;
    bookEl.style.width = `${pageW * 2}px`;
    bookEl.style.height = `${bookH}px`;
  }

  function offsetFor(spread, slotIdx) {
    if (spread.length === 1) return pageW / 2;
    return slotIdx === 0 ? 0 : pageW;
  }

  function makeSlot(idx, cls, left) {
    const el = document.createElement("div");
    el.className = `omt-slot ${cls}`;
    el.style.cssText = `width:${pageW}px;height:${bookH}px;position:absolute;left:${left}px;top:0;`;
    const canvas = document.createElement("canvas");
    el.appendChild(canvas);
    paintPage(canvas, idx, el);
    return el;
  }

  function renderSpread() {
    generation += 1;
    const spread = spreads[spreadIdx] || [0];
    bookEl.innerHTML = "";

    if (spread.length === 2) {
      bookEl.appendChild(makeSlot(spread[0], "left", 0));
      bookEl.appendChild(makeSlot(spread[1], "right", pageW));
      const spine = document.createElement("div");
      spine.className = "omt-spine";
      bookEl.appendChild(spine);
    } else {
      bookEl.appendChild(makeSlot(spread[0], "single", pageW / 2));
    }

    // Warm the neighbouring spread so forward reading feels instant.
    const nxt = spreads[spreadIdx + 1] || [];
    nxt.forEach((i) => source.request(i));

    onChange?.({
      page: Math.min(spread[spread.length - 1] + 1, source.count),
      atStart: spreadIdx <= 0,
      atEnd: spreadIdx >= spreads.length - 1,
    });
  }

  /* ---------------- CSS page flip ---------------- */

  // The turning sheet and the page slot underneath are both flat surfaces at
  // z=0 inside a preserve-3d container, so the GPU has no depth order to work
  // with and blends the two — the sheet washes out mid-turn. Lifting the
  // flipper a hair towards the viewer removes the ambiguity.
  const LIFT = "translateZ(2px)";

  function buildFlipper(frontIdx, backIdx, left, reverse) {
    const flipper = document.createElement("div");
    flipper.className = `omt-flipper${reverse ? " rev" : ""}`;
    flipper.style.cssText =
      `left:${left}px;width:${pageW}px;height:${bookH}px;` +
      `transform-origin:${reverse ? "right" : "left"} center;` +
      `transform:${LIFT};`;

    const front = document.createElement("div");
    front.className = "omt-face front";
    const frontCanvas = document.createElement("canvas");
    front.appendChild(frontCanvas);
    const sheen = document.createElement("div");
    sheen.className = "omt-sheen";
    front.appendChild(sheen);

    const back = document.createElement("div");
    back.className = "omt-face back";
    const backCanvas = document.createElement("canvas");
    back.appendChild(backCanvas);

    flipper.appendChild(front);
    flipper.appendChild(back);

    paint(frontCanvas, frontIdx >= 0 && frontIdx < source.count ? source.peek(frontIdx) : null);
    paint(backCanvas, backIdx >= 0 && backIdx < source.count ? source.peek(backIdx) : null);
    return flipper;
  }

  function goNext() {
    if (animating || curlState || spreadIdx >= spreads.length - 1) return;
    animating = true;
    const cur = spreads[spreadIdx];
    const nxt = spreads[spreadIdx + 1];
    const frontIdx = cur[cur.length - 1];
    const frontLeft = offsetFor(cur, cur.length - 1);
    const backIdx = nxt[0];

    spreadIdx += 1;
    renderSpread(); // new spread is drawn underneath first
    const flipper = buildFlipper(frontIdx, backIdx, frontLeft, false);
    bookEl.appendChild(flipper);
    requestAnimationFrame(() => {
      flipper.style.transform = `${LIFT} rotateY(-180deg)`;
    });
    setTimeout(() => {
      flipper.remove();
      animating = false;
    }, 700);
  }

  function goPrev() {
    if (animating || curlState || spreadIdx <= 0) return;
    animating = true;
    const cur = spreads[spreadIdx];
    const prv = spreads[spreadIdx - 1];
    const frontIdx = cur[0];
    const frontLeft = offsetFor(cur, 0);
    const backIdx = prv[prv.length - 1];

    spreadIdx -= 1;
    renderSpread();
    const flipper = buildFlipper(frontIdx, backIdx, frontLeft, true);
    bookEl.appendChild(flipper);
    requestAnimationFrame(() => {
      flipper.style.transform = `${LIFT} rotateY(180deg)`;
    });
    setTimeout(() => {
      flipper.remove();
      animating = false;
    }, 700);
  }

  /* ---------------- corner-peel curl ----------------
     The grabbed corner follows the pointer exactly and the page folds along
     the perpendicular bisector of corner<->pointer, with the flap rendered
     as an affine-warped triangle.
     ------------------------------------------------- */

  function computeFold(C, P, W, H) {
    const dx = P.x - C.x;
    const dy = P.y - C.y;
    const Mx = (C.x + P.x) / 2;
    const My = (C.y + P.y) / 2;
    let yA;
    let xB;
    if (Math.abs(dy) < 0.0001) {
      xB = Mx;
      yA = C.y;
    } else if (Math.abs(dx) < 0.0001) {
      yA = My;
      xB = C.x;
    } else {
      yA = My - (dx * (C.x - Mx)) / dy;
      xB = Mx - (dy * (C.y - My)) / dx;
    }
    yA = Math.max(0, Math.min(H, yA));
    xB = Math.max(0, Math.min(W, xB));
    return { A: { x: C.x, y: yA }, B: { x: xB, y: C.y } };
  }

  function affineFromTriangles(S0, S1, S2, D0, D1, D2) {
    const u1 = { x: S1.x - S0.x, y: S1.y - S0.y };
    const v1 = { x: S2.x - S0.x, y: S2.y - S0.y };
    const u2 = { x: D1.x - D0.x, y: D1.y - D0.y };
    const v2 = { x: D2.x - D0.x, y: D2.y - D0.y };
    const det = u1.x * v1.y - u1.y * v1.x;
    if (Math.abs(det) < 1e-9) return null;
    const inv00 = v1.y / det;
    const inv01 = -v1.x / det;
    const inv10 = -u1.y / det;
    const inv11 = u1.x / det;
    const a = u2.x * inv00 + v2.x * inv10;
    const c = u2.x * inv01 + v2.x * inv11;
    const b = u2.y * inv00 + v2.y * inv10;
    const d = u2.y * inv01 + v2.y * inv11;
    const e = D0.x - (a * S0.x + c * S0.y);
    const f = D0.y - (b * S0.x + d * S0.y);
    return [a, b, c, d, e, f];
  }

  // All curl geometry is in CSS pixels; DPR is applied as a base transform.
  const base = (ctx) => ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  function drawCurl(P) {
    const { ctx, C, bmp } = curlState;
    const W = pageW;
    const H = bookH;
    base(ctx);
    ctx.clearRect(0, 0, W, H);
    const { A, B } = computeFold(C, P, W, H);

    // 1) the page minus the corner triangle
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.lineTo(B.x, B.y);
    ctx.closePath();
    ctx.clip("evenodd");
    if (bmp) drawCover(ctx, bmp, W, H);
    else {
      ctx.fillStyle = "#f6f1e2";
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    // 2) vacated corner (paper underside)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.lineTo(B.x, B.y);
    ctx.closePath();
    ctx.fillStyle = "#d9cfb5";
    ctx.fill();
    ctx.restore();

    // 3) fold-line shadow
    ctx.save();
    ctx.lineWidth = Math.max(6, W * 0.045);
    const g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
    g.addColorStop(0, "rgba(0,0,0,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0.05)");
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
    ctx.restore();

    // 4) the folded flap, affine-warped from the source triangle
    if (bmp && bmp.width) {
      const sx = bmp.width / W;
      const sy = bmp.height / H;
      const S0 = { x: A.x * sx, y: A.y * sy };
      const S1 = { x: C.x * sx, y: C.y * sy };
      const S2 = { x: B.x * sx, y: B.y * sy };
      const m = affineFromTriangles(S0, S1, S2, A, P, B);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(P.x, P.y);
      ctx.lineTo(B.x, B.y);
      ctx.closePath();
      ctx.clip();
      if (m) {
        ctx.setTransform(m[0] * DPR, m[1] * DPR, m[2] * DPR, m[3] * DPR, m[4] * DPR, m[5] * DPR);
        ctx.drawImage(bmp, 0, 0);
        base(ctx);
      }
      const shade = (fill) => {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(P.x, P.y);
        ctx.lineTo(B.x, B.y);
        ctx.closePath();
        ctx.fill();
      };
      shade("rgba(20,15,8,0.26)");
      const hl = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
      hl.addColorStop(0, "rgba(255,255,255,0.32)");
      hl.addColorStop(1, "rgba(255,255,255,0.04)");
      shade(hl);
      ctx.restore();
    }
  }

  function beginCurlDrag(dir, e) {
    if (animating || curlState) return;
    if (dir === "next" && spreadIdx >= spreads.length - 1) return;
    if (dir === "prev" && spreadIdx <= 0) return;

    const cur = spreads[spreadIdx];
    const slotIdx = dir === "next" ? cur.length - 1 : 0;
    const frontIdx = cur[slotIdx];
    const pageLeft = offsetFor(cur, slotIdx);
    const bookRect = bookEl.getBoundingClientRect();
    const upper = e.clientY - bookRect.top < bookH / 2;
    const C = dir === "next" ? { x: pageW, y: upper ? 0 : bookH } : { x: 0, y: upper ? 0 : bookH };

    // The canvas is created lazily on the first real move, so a plain tap
    // never pays for it and always uses the proven CSS flip below.
    curlState = {
      dir,
      C,
      pageLeft,
      bookRect,
      frontIdx,
      bmp: source.peek(frontIdx),
      canvas: null,
      ctx: null,
      startClientX: e.clientX,
      startClientY: e.clientY,
      lastP: { x: C.x, y: C.y },
      moved: false,
    };
  }

  function ensureCurlCanvas() {
    const st = curlState;
    if (st.canvas) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(pageW * DPR);
    canvas.height = Math.round(bookH * DPR);
    canvas.style.cssText =
      `position:absolute;left:${st.pageLeft}px;top:0;width:${pageW}px;height:${bookH}px;` +
      `z-index:22;pointer-events:none;box-shadow:0 12px 28px -10px rgba(0,0,0,0.4);` +
      `border-radius:${st.dir === "next" ? "0 6px 6px 0" : "6px 0 0 6px"};`;
    bookEl.appendChild(canvas);
    st.canvas = canvas;
    st.ctx = canvas.getContext("2d");
    drawCurl(st.lastP);
  }

  function updateCurlDrag(clientX, clientY) {
    if (!curlState) return;
    const localX = clientX - curlState.bookRect.left - curlState.pageLeft;
    const localY = clientY - curlState.bookRect.top;
    curlState.lastP = {
      x: Math.max(0, Math.min(pageW, localX)),
      y: Math.max(0, Math.min(bookH, localY)),
    };
    if (curlState.canvas) drawCurl(curlState.lastP);
  }

  function endCurlDrag() {
    if (!curlState) return;
    const st = curlState;
    curlState = null;

    if (!st.moved || !st.canvas) {
      // plain tap — use the proven, guaranteed-visible flip animation
      if (st.dir === "next") goNext();
      else goPrev();
      return;
    }

    const dist = Math.hypot(st.lastP.x - st.C.x, st.lastP.y - st.C.y);
    const complete = dist / Math.max(pageW, bookH) > 0.32;
    animating = true;

    if (!complete) {
      // snap the flap shut; the page underneath was never touched
      curlState = st; // drawCurl reads from curlState
      const from = { ...st.lastP };
      const t0 = performance.now();
      (function tick(now) {
        const t = Math.min(1, (now - t0) / 260);
        const k = 1 - (1 - t) ** 3;
        drawCurl({ x: from.x + (st.C.x - from.x) * k, y: from.y + (st.C.y - from.y) * k });
        if (t < 1) requestAnimationFrame(tick);
        else {
          st.canvas.remove();
          curlState = null;
          animating = false;
        }
      })(performance.now());
      return;
    }

    // committed turn: drop the curl canvas and hand off to the CSS flip so the
    // page change always visibly animates
    st.canvas.remove();
    animating = false;
    if (st.dir === "next") goNext();
    else goPrev();
  }

  /* ---------------- wiring ---------------- */

  const listeners = [];
  const on = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts);
    listeners.push([target, type, fn, opts]);
  };

  function wireCurl(zone, dir) {
    zone.style.touchAction = "none";
    on(zone, "pointerdown", (e) => {
      beginCurlDrag(dir, e);
      if (curlState) zone.setPointerCapture(e.pointerId);
    });
    on(zone, "pointermove", (e) => {
      if (!curlState || curlState.dir !== dir) return;
      if (
        !curlState.moved &&
        Math.hypot(e.clientX - curlState.startClientX, e.clientY - curlState.startClientY) > 6
      ) {
        curlState.moved = true;
        ensureCurlCanvas();
      }
      updateCurlDrag(e.clientX, e.clientY);
    });
    on(zone, "pointerup", endCurlDrag);
    on(zone, "pointercancel", endCurlDrag);
  }

  wireCurl(hitRight, "next");
  wireCurl(hitLeft, "prev");

  let wasMobile = isMobile();
  const onResize = () => {
    if (!source.count) return;
    if (isMobile() !== wasMobile) {
      // Crossing the breakpoint changes single-page <-> spread pairing.
      wasMobile = isMobile();
      const keep = (spreads[spreadIdx] || [0])[0];
      buildSpreads();
      const found = spreads.findIndex((s) => s.includes(keep));
      spreadIdx = found < 0 ? 0 : found;
    }
    sizeBook();
    renderSpread();
  };
  on(window, "resize", onResize);
  on(document, "fullscreenchange", onResize);

  /* ---------------- public API ---------------- */

  const api = {
    start() {
      buildSpreads();
      sizeBook();
      spreadIdx = 0;
      renderSpread();
    },
    /** Page count grew (background rendering) — rebuild spreads, keep position. */
    refreshPages() {
      const current = spreads[spreadIdx]?.[0] ?? 0;
      buildSpreads();
      const found = spreads.findIndex((s) => s.includes(current));
      spreadIdx = found < 0 ? Math.min(spreadIdx, spreads.length - 1) : found;
      renderSpread();
    },
    next: goNext,
    prev: goPrev,
    goToPage(n) {
      if (!spreads.length) return;
      const target = Math.max(1, Math.min(source.count, n)) - 1;
      const found = spreads.findIndex((s) => s.includes(target));
      spreadIdx = found < 0 ? 0 : found;
      renderSpread();
    },
    /** Index of a page currently on screen — used to prioritise rendering. */
    visiblePage() {
      return (spreads[spreadIdx] || [0])[0];
    },
    destroy() {
      destroyed = true;
      listeners.forEach(([t, type, fn, opts]) => t.removeEventListener(type, fn, opts));
      listeners.length = 0;
      bookEl.innerHTML = "";
    },
  };

  return api;
}

export default createFlipbook;
