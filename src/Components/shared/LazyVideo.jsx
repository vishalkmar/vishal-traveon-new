import { useEffect, useRef, useState } from "react";

/**
 * LazyVideo — loads a background video only when it enters the viewport.
 *
 * Benefits:
 *   - preload="none" by default: browser skips downloading until needed
 *   - src set via IntersectionObserver: completely deferred for off-screen videos
 *   - poster image shown while video is buffering (no black flash)
 *   - rootMargin="200px": starts loading 200px before the video enters view
 *
 * Pass `eager` for an above-the-fold hero: waiting for the observer to fire
 * costs a render + a callback tick before the request even starts, which is
 * pure delay when the element is on screen from the first paint.
 *
 * Props match <video> props + rootMargin/threshold for IntersectionObserver.
 */
export default function LazyVideo({
  src,
  poster,
  className = "",
  style = {},
  muted = true,
  loop = true,
  playsInline = true,
  rootMargin = "200px",
  threshold = 0,
  eager = false,
  preload,
  ...rest
}) {
  const videoRef = useRef(null);
  const [activeSrc, setActiveSrc] = useState(eager ? src : null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src || eager) return;

    // If video is already in/near viewport (e.g. hero section), load immediately
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, rootMargin, threshold, eager]);

  // Once src is set, call load() so the browser picks it up
  useEffect(() => {
    const el = videoRef.current;
    if (!activeSrc || !el) return;
    el.load();
    el.play().catch(() => {}); // autoplay with muted is allowed in all browsers
  }, [activeSrc]);

  return (
    <video
      ref={videoRef}
      src={activeSrc || undefined}
      poster={poster}
      className={className}
      style={style}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={preload || (eager ? "auto" : "none")}
      {...rest}
    />
  );
}
