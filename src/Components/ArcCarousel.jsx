import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function ArcCarousel({ testimonials = [] }) {
  const [position, setPosition] = useState(0);

  const hasItems = Array.isArray(testimonials) && testimonials.length > 0;
  const len = testimonials.length;

  const next = () => setPosition((p) => p + 1);
  const prev = () => setPosition((p) => p - 1);

  // Auto-play interval
  useEffect(() => {
    if (!hasItems) return;
    const interval = setInterval(() => setPosition((p) => p + 1), 4000);
    return () => clearInterval(interval);
  }, [hasItems]);

  if (!hasItems) return null;

  const activeDotIndex = ((position % len) + len) % len;

  return (
    <div className="relative w-full min-h-[820px] bg-white overflow-hidden flex flex-col items-center justify-center py-20">
      {/* Curved Background Shape */}
      <div className="absolute top-0 left-0 w-full h-[600px] z-0 pointer-events-none">
        <svg
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          viewBox="0 0 1440 400"
        >
          <path
            d="M0,0 L1440,0 L1440,200 C1440,200 1080,400 720,400 C360,400 0,200 0,200 Z"
            fill="#0E8FA0"
          />
        </svg>

        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Heading */}
      <div className="relative z-30 text-center mb-16 text-white px-4">
        <h3 className="text-4xl md:text-5xl font-bold">What Our Clients Say</h3>
      </div>

      {/* Carousel Track */}
      <div className="relative w-full max-w-7xl h-[470px] flex items-center justify-center z-40">
        <AnimatePresence mode="popLayout">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const absoluteIndex = position + offset;
            const itemIndex = ((absoluteIndex % len) + len) % len;
            const item = testimonials[itemIndex];
            if (!item) return null;

            const absDist = Math.abs(offset);

            // Arc Math
            const x = offset * 380; // a bit tighter so cards feel more “inside”
            const y = absDist * absDist * 34;
            const rotate = offset * 3;

            // Depth
            const scale = 1 - absDist * 0.12; // same feel
            const zIndex = 60 - absDist * 10;

            // ✅ FIX: no opacity drop (white card stays white)
            const opacity = 1;

            // Instead of opacity, use subtle blur + brightness
            const blur = absDist === 0 ? 0 : absDist === 1 ? 0.4 : 0.9;
            const brightness = absDist === 0 ? 1 : absDist === 1 ? 0.97 : 0.94;

            return (
              <motion.div
                key={`item-${absoluteIndex}`}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  x: x + (offset > 0 ? 50 : -50),
                }}
                animate={{ x, y, scale, rotate, zIndex, opacity }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
                style={{
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                className="absolute w-[320px] md:w-[360px] min-h-[410px] bg-white rounded-[2rem] p-10 shadow-2xl shadow-black/10 border border-black/10 flex flex-col items-center text-center will-change-transform"
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

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (item.rating ?? 5)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  "{item.content}"
                </p>

                {/* Footer */}
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
                const diff = i - activeDotIndex;
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