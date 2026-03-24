import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "lucide-react";

/**
 * PopularDestinationsOverlay.jsx
 * - Full-image cards in simple grid
 * - Bottom overlay text on image
 * - Dark shield/gradient so text is readable
 * - Clickable cards navigate to destination
 * - Data fetched from API (dynamic)
 */

const THEME = {
  teal: "#0f8b8d", // bluish/teal theme
};

export default function PopularDestinations({
  title = "Popular Destination",
  subtitle = "Three destinations we craft with comfort, care, and flawless execution.",
}) {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/destinations");
      setDestinations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

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
          {destinations.map((destination) => (
            <ImageOverlayCard 
              key={destination.id} 
              destination={destination} 
              onNavigate={() => navigate(`/blogs/${destination.slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageOverlayCard({ destination, onNavigate }) {
  return (
    <article 
      onClick={onNavigate}
      className="group relative h-[320px] overflow-hidden rounded-2xl shadow-[0_14px_40px_rgba(2,8,23,0.14)] ring-1 ring-black/5 cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      {/* Full Image */}
      <img
        src={destination.image}
        alt={destination.name}
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
          <h3 className="text-lg font-semibold text-white">{destination.name}</h3>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-white/85">{destination.description}</p>

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
