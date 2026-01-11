// CommunityTour.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const tours = [
  {
    id: "magical-muscat",
    title: "Magical Muscat — 5 Days / 4 Nights",
    location: "Muscat, Oman",
    duration: "5D / 4N",
    image: "/gallery/magicalmuscat.jpg",
  },
  {
    id: "seychelles",
    title: "Seychelles — Fixed Departure Group Tour",
    location: "Mahé, Seychelles",
    duration: "4D / 3N",
    image: "/gallery/sechells.webp",
  },
];

const CommunityHero = () => {
  // ✅ only images change, heading same
  const heroImages = useMemo(
    () => [
       "/community-tour/1.jpg",
      "/community-tour/3.jpg",
       "/community-tour/19.jpg",
     "/community-tour/26.jpg",
      "/community-tour/11.jpg",
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(id);
  }, [heroImages.length]);

  return (
    <section className="relative h-[260px] sm:h-[360px] md:h-[660px] w-full overflow-hidden">
      {/* Crossfade carousel (no slider / no arrows / no swipe) */}
      {heroImages.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt="Community Tours"
          className={[
            "absolute inset-0 w-full h-full object-cover",
            "transition-opacity duration-1000 ease-in-out",
            idx === active ? "opacity-100" : "opacity-0",
          ].join(" ")}
          loading={idx === 0 ? "eager" : "lazy"}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 md:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Community <span className="text-[#fbbf24]">Tours</span>
        </h1>
        <p className="mt-4 text-white/90 max-w-3xl">
          Fixed departure group tours with curated itineraries, verified stays, and seamless on-ground support.
        </p>
      </div>

      {/* Soft shadow at bottom like premium banner */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
    </section>
  );
};

const TourCard = ({ item }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_1px_0_rgba(16,24,40,0.05),0_8px_30px_rgba(16,24,40,0.10)] border border-gray-100 overflow-hidden">
      {/* Image */}
      <div className="relative h-[260px] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Duration badge - bottom right */}
        <div className="absolute bottom-5 right-5">
          <div className="rounded-2xl bg-white/95 px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <div className="text-3xl font-extrabold text-gray-900 leading-none">
              {item.duration}
            </div>
            <div className="mt-1 text-sm text-gray-600">Tour Duration</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-[22px] md:text-[24px] font-extrabold text-gray-900 leading-snug">
          {item.title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{item.location}</span>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-4">
          <Link
            to={`/community/${item.id}`}
            className="flex-1 h-12 inline-flex justify-center items-center rounded-2xl border-2 border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition"
          >
            View Details
          </Link>

          <Link
            to="/contact"
            className="flex-1 h-12 inline-flex justify-center items-center rounded-2xl bg-[#0F172A] text-white font-semibold hover:bg-black transition"
          >
            Enquire
          </Link>
        </div>
      </div>
    </div>
  );
};

const CommunityTour = () => {
  return (
    <div className="">
      <CommunityHero />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {tours.map((t) => (
            <TourCard key={t.id} item={t} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CommunityTour;
