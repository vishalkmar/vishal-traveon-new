import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * ServicesGrid.jsx
 * Style: same vibe as your 1st image (4 image cards, soft shadow, rounded, overlay text)
 * Theme color: teal like your 2nd image
 *
 * Usage:
 * <ServicesGrid />
 * or pass your own items:
 * <ServicesGrid items={[{ title, desc, image, tag }]} />
 */

const DEFAULT_ITEMS = [
  {
    title: "Wellness Retreats",
    desc: "Rejuvenate your mind, body and spirit with curated wellness experiences.",
    image:
      "/wellness/w1.jpg",
    link: "/packages/wellness",
  },
  {
    title: "Corporate Retreats",
    desc: "Build stronger teams and drive innovation through immersive offsites.",
    image:
      "/wellness/corporate.avif",
    link: "/packages/wellness/corporate_sound_healing",
  },
  {
    title: "Community Tours",
    desc: "Connect with local cultures and communities through meaningful travel.",
    image:
      "/community-tour/1.jpg",
    link: "/packages/community-tour",
  },
  {
    title: "MICE Tours",
    desc: "Elevate business events with luxury venues and seamless logistics.",
    image:
      "/mice/planing.png",
    link: "/mice",
  },
];

export default function Transform({
  heading = "Experience the",
  highlight = "Transformation",
  subText = "Whether seeking personal renewal, team growth, or business excellence, we create experiences that last.",
  items = DEFAULT_ITEMS,
  accent = "#0f8b8d", // teal theme (edit to match your exact second image)
}) {
  return (
    <section className="w-full relative" style={{ background: 'linear-gradient(135deg, #0f8b8d 0%, #00C5C5 100%)' }}>
      {/* Wave SVG Border at Top */}
      <svg
        className="absolute top-0 left-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ height: '80px' }}
      >
        <path
          d="M0,70 Q360,120 720,70 T1440,70 L1440,0 L0,0 Z"
          fill="white"
          opacity="1"
        />
      </svg>

      {/* Content with padding to avoid overlap with waves */}
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-32 sm:pt-24 sm:pb-40">
        {/* header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {heading}{" "}
            <span style={{ color: "#ffffff" }} className="font-semibold">
              {highlight}
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-white/90">
            {subText}
          </p>
        </div>

        {/* grid */}
        <div className="relative mt-8 sm:mt-10">
          {/* subtle dotted accent (left like your 1st image) */}
          <div className="pointer-events-none absolute -left-2 top-10 hidden sm:block">
            <div className="grid grid-cols-6 gap-1 opacity-70">
              {Array.from({ length: 30 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "#ffffff" }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {items.map((it, idx) => (
              <Card key={idx} item={it} accent={accent} />
            ))}
          </div>
        </div>
      </div>

      {/* Wave SVG Border at Bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ height: '80px' }}
      >
        <path
          d="M0,50 Q360,0 720,50 T1440,50 L1440,120 L0,120 Z"
          fill="white"
          opacity="1"
        />
      </svg>
    </section>
  );
}

function Card({ item, accent }) {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-100 shadow-[0_10px_30px_rgba(2,8,23,0.10)] ring-1 ring-black/5">
      {/* image */}
      <div className="relative h-[210px] sm:h-[240px]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* gradient overlay (bottom like your 1st image) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {item.title}
            </h3>
          </div>

          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-white/85">
            {item.desc}
          </p>

          {/* CTA Button */}
          <div className="mt-4">
            <button
              onClick={handleExplore}
              className="px-6 py-2 rounded-full text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: accent }}
            >
              Explore {item.title} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}