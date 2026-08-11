import { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { loadSecureDocument } from "../../utils/secureDoc";
import useContentProtection from "../../hooks/useContentProtection";
import { createPageStore } from "./pageStore";
import { createFlipbook } from "./flipbookEngine";
import "./omanToolkit.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const DOC_SLUG = "oman-mice-toolkit";
// A page in a spread displays at roughly half the viewport width, so 2.1 still
// leaves the bitmap oversampled at 2x DPR. The quality bump is cheap and keeps
// small table type crisp.
const RENDER_SCALE = 2.1;
const JPEG_QUALITY = 0.9;

/**
 * Lockdown switches.
 * - debuggerTrap: freezes the tab while DevTools is open. Very effective, but
 *   it will also trap you if you ever need to debug this page — flip it off
 *   locally, never in production.
 * - blurOnLeave: blurs the book when the tab loses focus (screenshot deterrent).
 */
const PROTECTION = { enabled: true, debuggerTrap: true, blurOnLeave: true };

export default function OmanToolkit() {
  const bookRef = useRef(null);
  const hitLeftRef = useRef(null);
  const hitRightRef = useRef(null);
  const engineRef = useRef(null);
  const startedRef = useRef(false);

  const [phase, setPhase] = useState("loading"); // loading | ready | error
  const [status, setStatus] = useState("Securing your session…");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [total, setTotal] = useState(0);
  const [built, setBuilt] = useState(0);
  const [nav, setNav] = useState({ page: 1, atStart: true, atEnd: true });
  const [pageField, setPageField] = useState("1");

  const inspected = useContentProtection(PROTECTION);

  /* ---------------- load + render pipeline ---------------- */

  useEffect(() => {
    // React 18 StrictMode mounts effects twice in dev; one pipeline is enough.
    if (startedRef.current) return undefined;
    startedRef.current = true;

    const abort = new AbortController();
    let cancelled = false;
    let pdf = null;

    const store = createPageStore();

    const run = async () => {
      try {
        setPhase("loading");
        setStatus("Securing your session…");
        setProgress(0);

        const bytes = await loadSecureDocument(DOC_SLUG, {
          signal: abort.signal,
          onProgress: (p, stage) => {
            if (cancelled) return;
            if (stage === "decrypt") {
              setStatus("Unlocking toolkit…");
              setProgress(0.5 + p * 0.1);
            } else {
              setStatus("Loading toolkit…");
              setProgress(p * 0.5);
            }
          },
        });
        if (cancelled) return;

        setStatus("Preparing pages…");
        pdf = await pdfjsLib.getDocument({ data: bytes, disableAutoFetch: true }).promise;
        if (cancelled) return;

        const n = pdf.numPages;
        store.count = n;
        setTotal(n);

        const scratch = document.createElement("canvas");
        const ctx = scratch.getContext("2d", { willReadFrequently: false });

        const renderPage = async (idx) => {
          const page = await pdf.getPage(idx + 1);
          const viewport = page.getViewport({ scale: RENDER_SCALE });
          scratch.width = Math.ceil(viewport.width);
          scratch.height = Math.ceil(viewport.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          page.cleanup();

          if (idx === 0) store.ratio = viewport.width / viewport.height;

          const blob = await new Promise((resolve) =>
            scratch.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
          );
          if (cancelled || !blob) return;
          store.setPage(idx, blob);
        };

        // Page 1 first so the book can open immediately.
        await renderPage(0);
        if (cancelled) return;

        engineRef.current = createFlipbook({
          bookEl: bookRef.current,
          hitLeft: hitLeftRef.current,
          hitRight: hitRightRef.current,
          source: store,
          onChange: (state) => {
            setNav(state);
            setPageField(String(state.page));
          },
        });
        engineRef.current.start();
        setBuilt(1);
        setProgress(1);
        setPhase("ready");

        // Remaining pages in the background, nearest-to-the-reader first.
        const done = new Set([0]);
        while (done.size < n && !cancelled) {
          const here = engineRef.current?.visiblePage?.() ?? 0;
          let next = -1;
          let best = Infinity;
          for (let i = 0; i < n; i++) {
            if (done.has(i)) continue;
            const d = Math.abs(i - here);
            if (d < best) {
              best = d;
              next = i;
            }
          }
          if (next < 0) break;
          await renderPage(next);
          done.add(next);
          setBuilt(done.size);
          await new Promise((r) => setTimeout(r, 0)); // keep the UI responsive
        }
      } catch (err) {
        if (cancelled || err?.name === "AbortError") return;
        console.error("OmanToolkit:", err);
        setError(err?.message || "The toolkit could not be opened.");
        setPhase("error");
      }
    };

    run();

    return () => {
      cancelled = true;
      abort.abort();
      engineRef.current?.destroy();
      engineRef.current = null;
      store.dispose();
      pdf?.destroy?.();
      startedRef.current = false;
    };
  }, [attempt]);

  /* ---------------- page chrome ---------------- */

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (phase !== "ready") return;
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") engineRef.current?.next();
      if (e.key === "ArrowLeft") engineRef.current?.prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }, []);

  const commitPageField = useCallback(() => {
    const n = parseInt(pageField, 10);
    if (Number.isNaN(n)) {
      setPageField(String(nav.page));
      return;
    }
    engineRef.current?.goToPage(n);
  }, [pageField, nav.page]);

  /* ---------------- render ---------------- */

  return (
    <div className="omt-root" onContextMenu={(e) => e.preventDefault()}>
      <div className="omt-stage">
        <div className="omt-topbar">
          <div className="omt-top-actions">
            <button
              type="button"
              className="omt-icon-btn"
              onClick={toggleFullscreen}
              title="Fullscreen"
              aria-label="Toggle fullscreen"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
            </button>
          </div>
        </div>

        {phase === "loading" && (
          <div className="omt-splash">
            <div className="omt-spinner" />
            <p>{status}</p>
            <div className="omt-prog-track">
              <div className="omt-prog-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="omt-splash">
            <div className="omt-mark">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M12 8v5M12 16.5v.5" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <h1>Toolkit unavailable</h1>
            <p>{error}</p>
            <button type="button" className="omt-retry" onClick={() => setAttempt((a) => a + 1)}>
              Try again
            </button>
          </div>
        )}

        <div className="omt-book-wrap" hidden={phase !== "ready"}>
          <div className="omt-floor" />
          <div className="omt-book" ref={bookRef} />
          <div className="omt-hit l" ref={hitLeftRef} />
          <div className="omt-hit r" ref={hitRightRef} />
          <div className="omt-arrow l">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
          <div className="omt-arrow r">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

        {phase === "ready" && (
          <div className="omt-bottombar">
            <button
              type="button"
              className="omt-nav-btn"
              disabled={nav.atStart}
              onClick={() => engineRef.current?.prev()}
              aria-label="Previous page"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="omt-indicator">
              <input
                type="text"
                inputMode="numeric"
                value={pageField}
                onChange={(e) => setPageField(e.target.value.replace(/[^0-9]/g, ""))}
                onBlur={commitPageField}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                aria-label="Page number"
              />
              <span>/ {total}</span>
            </div>

            <button
              type="button"
              className="omt-nav-btn"
              disabled={nav.atEnd}
              onClick={() => engineRef.current?.next()}
              aria-label="Next page"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {built < total && <div className="omt-building">{built} / {total} ready</div>}
          </div>
        )}

        {inspected && (
          <div className="omt-lock">
            <div className="omt-mark">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
            <h2>Protected content</h2>
            <p>
              This toolkit is protected. Close the developer tools and print dialog to continue
              reading.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
