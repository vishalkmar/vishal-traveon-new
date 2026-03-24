import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * PopularDestinationsOverlay.jsx
 * - Full-image cards in simple grid
 * - Bottom overlay text on image
 * - Dark shield/gradient so text is readable
 * - Clickable cards navigate to destination
 */

const THEME = {
  teal: "#0f8b8d", // bluish/teal theme
};

const DESTINATIONS = [
  {
    name: "Oman",
    desc: "Desert sunsets, wadis, and mountain escapes — calm luxury with rich culture.",
    image: "/oman/banner1.jpg",
    link: "/blogs/oman",
   
  },
  {
    name: "Seychelles",
    desc: "Crystal beaches, island serenity, and slow mornings — perfect for a true reset.",
    image: "/seychelles/banner.jpg",
    link: "/blogs/seychelles",
  
  },
  {
    name: "Vietnam",
    desc: "Heritage towns, scenic bays, and vibrant streets — nature + energy in one trip.",
    image: "/seychelles/viatnam.webp",
    link: "/blogs/vietnam",
   
  },
];

export default function PopularDestinations({
  title = "Popular Destination",
  subtitle = "Three destinations we craft with comfort, care, and flawless execution.",
  items = DESTINATIONS,
}) {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        {/* Heading */}
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

        {/* Cards Grid */}
        <div className="mt-7 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {items.map((d) => (
            <ImageOverlayCard 
              key={d.name} 
              d={d} 
              onNavigate={() => navigate(d.blogsLink || d.link)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageOverlayCard({ d, onNavigate }) {
  return (
    <article 
      onClick={onNavigate}
      className="group relative h-[320px] overflow-hidden rounded-2xl shadow-[0_14px_40px_rgba(2,8,23,0.14)] ring-1 ring-black/5 cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      {/* Full Image */}
      <img
        src={d.image}
        alt={d.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* Shield for readability */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Bottom gradient shield */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

      {/* Bottom text */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: THEME.teal }}
          />
          <h3 className="text-lg font-semibold text-white">{d.name}</h3>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-white/85">{d.desc}</p>

        {/* tiny underline accent (not a button) */}
        <div className="mt-4">
          <span
            className="block h-[2px] w-14 rounded-full opacity-95"
            style={{ backgroundColor: THEME.teal }}
          />
        </div>
      </div>
    </article>
  );
}
