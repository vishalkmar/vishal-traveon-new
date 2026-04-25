import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getApiV1Base } from "../utils/apiUrl.js";

const SLIDE_INTERVAL = 4000;

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

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [banners.length, next]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
  };

  if (banners.length === 0) return null;

  return (
    <section className="w-full py-8 md:py-12 bg-white">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[50px] md:rounded-[50px] shadow-lg ring-1 ring-black/5 group"
          style={{ aspectRatio: "1440/300" }}
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {/* Slides */}
          {banners.map((banner, i) => {
            const url = banner.redirectUrl || "";
            const isInternal = url.startsWith("/");
            const isExternal = url.startsWith("http://") || url.startsWith("https://");
            const isClickable = isInternal || isExternal;

            const imageEl = (
              <img
                src={banner.imageData}
                alt={`Banner ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            );

            const slideClasses =
              "absolute inset-0 transition-opacity duration-700 ease-out";
            const slideStyle = {
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
            };

            if (!isClickable) {
              return (
                <div key={banner.id} className={slideClasses} style={slideStyle}>
                  {imageEl}
                </div>
              );
            }

            if (isInternal) {
              return (
                <Link
                  key={banner.id}
                  to={url}
                  className={`${slideClasses} block cursor-pointer`}
                  style={slideStyle}
                  aria-label={`Banner ${i + 1} — open ${url}`}
                  tabIndex={i === current ? 0 : -1}
                >
                  {imageEl}
                </Link>
              );
            }

            return (
              <a
                key={banner.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${slideClasses} block cursor-pointer`}
                style={slideStyle}
                aria-label={`Banner ${i + 1} — open ${url}`}
                tabIndex={i === current ? 0 : -1}
              >
                {imageEl}
              </a>
            );
          })}

          {/* Prev / Next arrows — only when more than 1 banner */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() => {
                  clearInterval(timerRef.current);
                  prev();
                  resume();
                }}
                aria-label="Previous slide"
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  clearInterval(timerRef.current);
                  next();
                  resume();
                }}
                aria-label="Next slide"
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    clearInterval(timerRef.current);
                    setCurrent(i);
                    resume();
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/60 hover:bg-white/90"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
