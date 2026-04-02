import React from "react";

/**
 * Retreats CTA (Pure Tailwind)
 * - Static conic-gradient border in Retreats palette
 * - Breathing outer halo (no rotation)
 * - Optional shimmer on hover
 */
function RetreatsCTA() {
  return (
    <a
      href="https://retreatsbytraveon.com/" // ← update to real URL
      target="_blank"
      rel="noreferrer"
      aria-label="Explore Retreats by Traveon"
      className="group relative isolate inline-flex items-center rounded-full p-[2px]
                 transition-transform duration-200 hover:scale-[1.03] active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-[#62bd98] focus:ring-offset-2 focus:ring-offset-transparent"
    >
      {/* Breathing glow halo (no spin) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-full
                   bg-[conic-gradient(from_90deg_at_50%_50%,#8bba48_0%,#62bd98_40%,#70c061_80%,#8bba48_100%)]
                   opacity-50 blur-[22px] rt-halo"
      />

      {/* Static conic-gradient border */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full
                   bg-[conic-gradient(from_90deg_at_50%_50%,#8bba48_0%,#62bd98_40%,#70c061_80%,#8bba48_100%)]"
      />

      {/* Inner pill */}
      <span
        className="relative z-[1] inline-flex items-center gap-2
                   rounded-full px-4 py-2 md:px-5 md:py-2.5
                   text-white bg-gray-900/90 backdrop-blur-sm"
      >
        <img
          src="/retreats-symbol.png"
          alt=""
          className="h-5 w-5 md:h-6 md:w-6 object-contain"
          loading="eager"
          decoding="async"
        />
        <span className="font-semibold tracking-wide">Retreats</span>

      </span>
    </a>
  );
}

export default RetreatsCTA;
