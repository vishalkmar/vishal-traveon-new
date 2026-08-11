import { useEffect, useState } from "react";

/**
 * Locks down a page against casual copying / saving / inspecting.
 *
 * Honest scope: nothing running inside the user's own browser can be made
 * truly un-inspectable. This raises the effort from "one click" to "you have
 * to know what you're doing", and blanks the content the moment it detects
 * DevTools. Pair it with the encrypted document proxy, not instead of it.
 *
 * @returns {boolean} true while an inspection attempt is detected
 */
export default function useContentProtection({
  enabled = true,
  debuggerTrap = true,
  blurOnLeave = true,
} = {}) {
  const [inspected, setInspected] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    const stop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // The page-number box still has to be typable, so form fields keep their
    // normal selection/clipboard behaviour — there is no document text there.
    const inField = (e) => {
      const el = e.target;
      return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    };

    /* ---------- context menu, selection, copy, drag ---------- */
    const blockedEvents = ["contextmenu", "copy", "cut", "dragstart", "selectstart"];
    const guard = (e) => (inField(e) ? undefined : stop(e));
    blockedEvents.forEach((evt) => document.addEventListener(evt, guard, { capture: true }));

    /* ---------- keyboard shortcuts ---------- */
    const onKeyDown = (e) => {
      const key = (e.key || "").toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      // DevTools: F12, Ctrl/Cmd+Shift+I/J/C/K, Cmd+Opt+I/J/C (mac)
      const devtools =
        key === "f12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
        (e.metaKey && e.altKey && ["i", "j", "c"].includes(key));

      // View source / save / print / select-all / copy / find
      const exfiltrate =
        mod && !inField(e) && ["u", "s", "p", "a", "c", "x", "g"].includes(key);

      if (devtools || exfiltrate) return stop(e);

      // PrintScreen — can't block the capture, but we can poison the clipboard.
      if (key === "printscreen" || e.code === "PrintScreen") {
        navigator.clipboard?.writeText?.("").catch(() => {});
        return stop(e);
      }
      return undefined;
    };
    document.addEventListener("keydown", onKeyDown, { capture: true });

    /* ---------- printing ---------- */
    const onBeforePrint = () => setInspected(true);
    window.addEventListener("beforeprint", onBeforePrint);

    /* ---------- blur when the tab loses focus (screenshot deterrent) ---------- */
    let onBlur;
    let onFocus;
    if (blurOnLeave) {
      onBlur = () => document.body.classList.add("cp-blurred");
      onFocus = () => document.body.classList.remove("cp-blurred");
      window.addEventListener("blur", onBlur);
      window.addEventListener("focus", onFocus);
    }

    /* ---------- DevTools detection ---------- */
    const isTouch = window.matchMedia?.("(pointer: coarse)")?.matches;

    // Page zoom shrinks innerWidth/Height just like a docked DevTools pane
    // does, so the size heuristic is only trusted at the zoom level the page
    // was opened at. The console and debugger probes below are zoom-proof.
    const baseZoom = window.devicePixelRatio;

    const bySize = () => {
      if (isTouch) return false;
      if (Math.abs(window.devicePixelRatio - baseZoom) > 0.01) return false;
      const dw = window.outerWidth - window.innerWidth;
      const dh = window.outerHeight - window.innerHeight;
      return dw > 220 || dh > 220;
    };

    // The console only reads this getter when it actually renders the object.
    let consoleTripped = false;
    const bait = {};
    Object.defineProperty(bait, "id", {
      get() {
        consoleTripped = true;
        return "";
      },
    });

    const byConsole = () => {
      consoleTripped = false;
      console.log(bait);
      console.clear?.();
      return consoleTripped;
    };

    const byDebugger = () => {
      if (!debuggerTrap) return false;
      const t0 = performance.now();
      // Freezes the tab while DevTools is open, which is the point.
      // eslint-disable-next-line no-debugger
      debugger;
      return performance.now() - t0 > 120;
    };

    const probe = () => {
      if (bySize() || byConsole() || byDebugger()) setInspected(true);
      else setInspected(false);
    };

    probe();
    const timer = setInterval(probe, 1200);
    window.addEventListener("resize", probe);

    return () => {
      blockedEvents.forEach((evt) =>
        document.removeEventListener(evt, guard, { capture: true })
      );
      document.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("resize", probe);
      if (onBlur) window.removeEventListener("blur", onBlur);
      if (onFocus) window.removeEventListener("focus", onFocus);
      document.body.classList.remove("cp-blurred");
      clearInterval(timer);
    };
  }, [enabled, debuggerTrap, blurOnLeave]);

  return inspected;
}
