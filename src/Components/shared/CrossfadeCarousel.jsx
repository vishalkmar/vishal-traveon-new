import React, { useEffect, useRef, useState } from "react";

export function CrossfadeCarousel({
  media = [],
  alt = "",
  interval = 1700,
  showDots = false,
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!media || media.length <= 1) return;
    if (paused) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % media.length);
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [media, interval, paused]);

  return (
    <div
      className={`w-full h-full relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {media.map((m, i) => (
        <img
          key={i}
          src={m.src}
          alt={m.alt || alt || `slide-${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      ))}

      {showDots && media && media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
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

export default CrossfadeCarousel;
