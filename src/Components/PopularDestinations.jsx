import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, ChevronLeft, ChevronRight } from "lucide-react";
import { getApiV1Base } from "../utils/apiUrl.js";

const THEME = {
  teal: "#0f8b8d",
};

export default function PopularDestinations({
  title = "Popular Destination",
  subtitle = "Three destinations we craft with comfort, care, and flawless execution.",
}) {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const viewportRef = useRef(null);
  const firstCardRef = useRef(null);
  const autoScrollRef = useRef(null);

  const [cardStep, setCardStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${getApiV1Base()}/destinations`);
      setDestinations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const loopedDestinations = useMemo(() => {
    if (!destinations.length) return [];
    return [...destinations, ...destinations];
  }, [destinations]);

  const updateCardStep = () => {
    if (!firstCardRef.current) return;

    const cardWidth = firstCardRef.current.offsetWidth;
    const gap = window.innerWidth >= 640 ? 24 : 16;
    setCardStep(cardWidth + gap);
  };

  useEffect(() => {
    if (!destinations.length) return;

    const timer = setTimeout(() => {
      updateCardStep();
    }, 100);

    window.addEventListener("resize", updateCardStep);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCardStep);
    };
  }, [destinations]);

  const handleNext = () => {
    if (!destinations.length) return;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!destinations.length) return;

    if (currentIndex === 0) {
      setEnableTransition(false);
      setCurrentIndex(destinations.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          setCurrentIndex(destinations.length - 1);
        });
      });
    } else {
      setEnableTransition(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!destinations.length || isHovered) return;

    autoScrollRef.current = setInterval(() => {
      setEnableTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2500);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [destinations, isHovered]);

  const handleTransitionEnd = () => {
    if (!destinations.length) return;

    if (currentIndex >= destinations.length) {
      setEnableTransition(false);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (!enableTransition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
    }
  }, [enableTransition]);

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 flex items-center justify-center min-h-96">
          <Loader className="w-8 h-8 text-[#0f8b8d] animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="text-left sm:text-center">
          <p
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: "rgba(15,139,141,0.10)",
              color: THEME.teal,
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: THEME.teal }}
            />
            {title}
          </p>

          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Explore destinations people love
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
            {subtitle}
          </p>
        </div>

        <div className="relative mt-7 sm:mt-10">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 z-20 -translate-x-2 sm:-translate-x-4 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg ring-1 ring-black/10 transition hover:scale-105 hover:bg-slate-50"
            aria-label="Previous destinations"
          >
            <ChevronLeft className="h-5 w-5 text-slate-800" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 z-20 translate-x-2 sm:translate-x-4 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg ring-1 ring-black/10 transition hover:scale-105 hover:bg-slate-50"
            aria-label="Next destinations"
          >
            <ChevronRight className="h-5 w-5 text-slate-800" />
          </button>

          <div
            ref={viewportRef}
            className="overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="flex gap-4 sm:gap-6 pr-[10%] sm:pr-[10%] lg:pr-0"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(-${currentIndex * cardStep}px)`,
                transition: enableTransition ? "transform 700ms ease" : "none",
                willChange: "transform",
              }}
            >
              {loopedDestinations.map((destination, index) => (
                <article
                  key={`${destination.id}-${index}`}
                  ref={index === 0 ? firstCardRef : null}
                  onClick={() => navigate(`/blogs/${destination.slug}`)}
                  className="
                    group relative h-[320px] shrink-0 overflow-hidden rounded-2xl
                    shadow-[0_14px_40px_rgba(2,8,23,0.14)] ring-1 ring-black/5
                    cursor-pointer transition-transform duration-300 hover:scale-[1.02]
                    w-[90%] sm:w-[45%] lg:w-[31.8%]
                  "
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/15" />
                  <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: THEME.teal }}
                      />
                      <h3 className="text-lg font-semibold text-white">
                        {destination.name}
                      </h3>
                    </div>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/85">
                      {destination.description}
                    </p>

                    <div className="mt-4">
                      <span
                        className="block h-[2px] w-14 rounded-full opacity-95"
                        style={{ backgroundColor: THEME.teal }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}