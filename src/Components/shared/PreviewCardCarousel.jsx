import React, { useEffect, useRef, useState } from "react";

/**
 * PreviewCardCarousel
 * - media: [{type: 'image'|'video'|'iframe', src, alt?}]
 * - interval: ms
 * - showDots: boolean
 * - className: extra classes
 */
export function PreviewCardCarousel({ media = [], interval = 3500, showDots = true, className = "" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const videoRefs = useRef(new Map());

  useEffect(() => {
    if (!media || media.length <= 1) return;
    if (paused) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % media.length);
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [media, interval, paused]);

  useEffect(() => {
    // Pause all videos except the current one
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      try {
        if (i === index) {
          v.play?.();
        } else {
          v.pause?.();
          v.currentTime = 0;
        }
      } catch (e) {
        // ignore playback issues
      }
    });
  }, [index]);

  if (!media || media.length === 0) {
    media = [
      { type: "image", src: "https://via.placeholder.com/1200x700?text=No+Preview", alt: "No preview" },
    ];
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {media.map((m, i) => {
        const visible = i === index;
        const baseClasses = `absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`;

        if (m.type === "video") {
          return (
            <video
              key={i}
              ref={(el) => videoRefs.current.set(i, el)}
              src={m.src}
              className={baseClasses}
              playsInline
              muted
              loop
              controls={false}
              preload="metadata"
            />
          );
        }

        if (m.type === "iframe") {
          return (
            <iframe
              key={i}
              title={m.alt || `slide-${i + 1}`}
              src={m.src}
              className={baseClasses}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          );
        }

        // image
        return (
          <img
            key={i}
            src={m.src}
            alt={m.alt || `slide-${i + 1}`}
            className={baseClasses}
            loading="lazy"
            decoding="async"
          />
        );
      })}

      {showDots && media.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {media.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PreviewCardCarousel;
