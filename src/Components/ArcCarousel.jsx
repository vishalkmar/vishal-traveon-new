import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function ArcCarousel({ testimonials }) {
  const [position, setPosition] = useState(0);

  const next = () => setPosition((p) => p + 1);
  const prev = () => setPosition((p) => p - 1);

  // Auto-play interval
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setPosition((p) => p + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  // infinite dots index
  const activeDotIndex =
    ((position % testimonials.length) + testimonials.length) %
    testimonials.length;

  return (
    // ✅ FIX 1: bg-background -> bg-white (dark mode black removed)
    <div className="relative w-full min-h-[800px] bg-white overflow-hidden flex flex-col items-center justify-center py-20">
      {/* Curved Background Shape */}
      <div className="absolute top-0 left-0 w-full h-[600px] z-0 pointer-events-none">
        <svg
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          viewBox="0 0 1440 400"
        >
          <path
            d="M0,0 L1440,0 L1440,200 C1440,200 1080,400 720,400 C360,400 0,200 0,200 Z"
            // ✅ FIX 2: primary var -> exact teal like your 2nd image
            fill="#0E8FA0"
          />
        </svg>

        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* ✅ FIX 3: force heading text white (no theme dependency) */}
      <div className="relative z-10 text-center mb-16 text-white px-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/80 mb-2">
          Customer Stories
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold">Trusted by the best</h3>
      </div>

      {/* Carousel Track */}
      <div className="relative w-full max-w-7xl h-[450px] flex items-center justify-center perspective-1000 z-20">
        <AnimatePresence mode="popLayout">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const absoluteIndex = position + offset;
            const itemIndex =
              ((absoluteIndex % testimonials.length) + testimonials.length) %
              testimonials.length;
            const item = testimonials[itemIndex];
            if (!item) return null;

            const absDist = Math.abs(offset);

            // Arc Math
            const x = offset * 400;
            const y = offset * offset * 35;
            const rotate = offset * 3;
            const scale = 1 - absDist * 0.12;
            const zIndex = 10 - absDist;
            const opacity = 1 - absDist * 0.3;

            return (
              <motion.div
                key={`item-${absoluteIndex}`}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: x + (offset > 0 ? 50 : -50),
                }}
                animate={{ x, y, scale, rotate, zIndex, opacity }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.6,
                }}
                // ✅ FIX 4: bg-card/border-border/text vars -> explicit light colors
                className="absolute w-[320px] md:w-[360px] min-h-[400px] bg-white rounded-[2rem] p-10 shadow-2xl shadow-black/10 border border-black/10 flex flex-col items-center text-center will-change-transform"
              >
                {/* Overlapping Avatar */}
                <div className="relative w-20 h-20 -mt-16 mb-4">
                  <div className="absolute inset-0 bg-[#0E8FA0] rounded-full blur-md opacity-30 translate-y-2" />
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="relative w-full h-full object-cover rounded-full border-[6px] border-white bg-white"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-[#0E8FA0] text-white p-1.5 rounded-full shadow-lg">
                    <Quote className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  "{item.content}"
                </p>

                <div className="mt-auto pt-4 border-t border-black/10 w-full">
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">
                    {item.role}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="relative z-30 flex items-center gap-6 mt-12">
        <button
          onClick={prev}
          // ✅ FIX 5: bg-card/text vars -> explicit white button
          className="p-4 rounded-full bg-white shadow-lg border border-black/10 hover:shadow-xl hover:-translate-y-0.5 hover:border-[#0E8FA0]/30 active:translate-y-0 transition-all duration-200 text-slate-900"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const currentMod = activeDotIndex;
                const diff = i - currentMod;
                setPosition((p) => p + diff);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeDotIndex
                  ? "bg-[#0E8FA0] w-8"
                  : "bg-[#0E8FA0]/20 w-2.5 hover:bg-[#0E8FA0]/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-4 rounded-full bg-white shadow-lg border border-black/10 hover:shadow-xl hover:-translate-y-0.5 hover:border-[#0E8FA0]/30 active:translate-y-0 transition-all duration-200 text-slate-900"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}