import { useState, useEffect, useRef, useCallback } from "react";
import { getApiV1Base } from "../utils/apiUrl.js";

const SLIDE_INTERVAL = 2000; // 2 seconds

export default function HomeBannerSlider() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${getApiV1Base()}/image-banners/active`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setBanners(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  // Auto-slide
  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [banners.length, next]);

  // Pause on hover
  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
  };

  // No banners → render nothing, take no space
  if (banners.length === 0) return null;

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{ aspectRatio: "100/18", maxHeight: 120 }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Slides */}
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={banner.imageData}
            alt={`Banner ${i + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}

      {/* Dot indicators — only if more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => { clearInterval(timerRef.current); setCurrent(i); resume(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
