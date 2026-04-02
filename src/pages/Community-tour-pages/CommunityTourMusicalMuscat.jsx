// CommunityTourMagicalMuscat.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";

const hero = {
  title: "Magical Muscat — 5 Days / 4 Nights",
  location: "Muscat, Oman",
  days: "5D / 4N",
  priceFrom: "39,999",
  image: "/gallery/muscat.webp", // fallback / first image
  tags: ["Community", "Featured"],
};

// ✅ HERO carousel images (only images change)
const heroImages = [
     "/oman/banner.jpg",
     "/oman/banner1.jpg",
     "/oman/banner2.jpg",
     "/oman/desert.jpg",
];

const about =
  "Experience Muscat's stunning mosques, souqs, wadis, dolphin watching, and desert adventures with curated luxury stays.";

const highlights = [
  "Muscat City Tour",
  "Al Hoota Cave",
  "Wadi Bani Khalid",
  "Nizwa Fort",
  "Dolphin Watching",
  "Desert Safari",
];

const schedule = [
  {
    dayNumber: 1,
    title: "Arrival & Muscat City Tour",
    tags: ["Breakfast"],
    items: [
      "Morning: Airport pickup, hotel check-in",
      "Afternoon: Muscat tour covering Qurum Park, Mutrah Souq, Corniche, National Museum.",
    ],
  },
  {
    dayNumber: 2,
    title: "Nizwa Fort & Al Hoota Cave",
    tags: ["Breakfast"],
    items: [
      "Breakfast at hotel, visit Nizwa Fort and Al Hoota Cave",
      "Evening return to hotel.",
    ],
  },
  {
    dayNumber: 3,
    title: "Dolphin Watching & Leisure",
    tags: ["Breakfast"],
    items: ["Morning dolphin watching boat tour", "Afternoon free for leisure."],
  },
  {
    dayNumber: 4,
    title: "Leisure & Optional Tours",
    tags: ["Breakfast"],
    items: [
      "Relax at hotel or choose optional tours (Wahiba Sands desert safari, Wadi Bani Khalid).",
    ],
  },
  {
    dayNumber: 5,
    title: "Departure & Optional Activities",
    tags: ["Breakfast"],
    items: ["Checkout and transfer to airport", "Optional: Coastal tour to Sur or shopping."],
  },
];

const whatsIncluded = [
  "4 nights accommodation at Royal Tulip or similar",
  "All transfers",
  "Breakfasts",
  "Half-day Muscat city tour",
  "Nizwa Fort & Al Hoota Cave entry",
  "2 hours Dolphin Watching tour",
];

const notIncluded = [
  "Airfare",
  "Tips, drinks, minibar",
  "Room service, laundry, calls",
  "Early check-in / late check-out",
  "Anything not mentioned in inclusions",
  "GST 5% & TCS as per govt norms",
];

const includesMini = ["4★ hotel stay", "Breakfasts", "Transfers", "Guided tours"];

const RightSidebar = () => {
  return (
    <aside className="w-full lg:w-[380px] shrink-0">
      {/* PRICE + INCLUDED + CTA */}
      <div className="bg-white rounded-2xl border border-blue-200 shadow-[0_10px_30px_rgba(2,6,23,0.08)] p-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-blue-600">₹{hero.priceFrom}</div>
          <div className="text-sm text-gray-500 mt-1">per person</div>
        </div>

        <div className="mt-6">
          <div className="text-lg font-semibold text-gray-800">What's Included:</div>
          <ul className="mt-4 space-y-3">
            {includesMini.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6 space-y-3">
          <Link
            to="https://wa.me/9540111307?text=Hi!%20I%20want%20to%20book%20Magical%20Muscat%205D%2F4N."
            target="_blank"
            className="w-full inline-flex justify-center items-center h-12 rounded-xl text-white bg-[#28bccf] hover:bg-[#22a5b6] font-semibold transition"
          >
            Book Now
          </Link>
          <Link
            to="mailto:info@traveon.in?subject=Quote%20Request%20-%20Magical%20Muscat%205D%2F4N&body=Hello,%20I%20want%20a%20quote%20for%20Magical%20Muscat%205D%2F4N.%20Please%20share%20details."
            target="_blank"
            className="w-full inline-flex justify-center items-center h-12 rounded-xl border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 font-semibold transition"
          >
            Request Quote
          </Link>
        </div>
      </div>

      {/* AVAILABLE DATES */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="text-sm font-semibold text-gray-800">Available Dates</div>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">10 Nov 2025 - 14 Nov 2025</div>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Available
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">5 Dec 2025 - 9 Dec 2025</div>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Limited
            </span>
          </div>
        </div>
      </div>

      {/* CONDUCTED BY */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="text-sm font-semibold text-gray-800 mb-4">Conducted by</div>
        <div className="flex items-center gap-3">
          <img
            src="/logo-retreats-by-traveon.png"
            alt="Retreats by Traveon"
            className="h-10 w-10 rounded-lg object-contain"
            onError={(e) => {
              e.currentTarget.src =
                "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png";
            }}
          />
          <div className="text-sm text-gray-700">Retreats by Traveon</div>
        </div>
      </div>

      {/* NEED HELP */}
      <div className="bg-[#f3f8ff] rounded-2xl border border-blue-100 shadow-sm p-5">
        <div className="text-lg font-semibold text-gray-800 mb-4">Need Help?</div>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <span>+91 9540111207 / +91 9540111307</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span>info@traveon.in</span>
          </div>
        </div>

        <Link
          to="https://wa.me/9540111307?text=Hi!%20I%20need%20help%20for%20Magical%20Muscat%205D%2F4N."
          target="_blank"
          className="mt-5 w-full inline-flex justify-center items-center h-11 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition font-semibold"
        >
          Chat with us
        </Link>
      </div>
    </aside>
  );
};

const CommunityTourMagicalMuscat = () => {
  const images = useMemo(() => heroImages, []);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % images.length);
    }, 3500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="">
      {/* HERO */}
      <section className="relative h-[460px] md:h-[520px] overflow-hidden bg-black">
        {/* Crossfade carousel (no arrows / no slider UI) */}
        {images.map((src, idx) => (
          <React.Fragment key={src}>
            {/* Blurred filler per image */}
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className={[
                "absolute inset-0 w-full h-full object-cover scale-110 blur-xl",
                "transition-opacity duration-1000 ease-in-out",
                idx === active ? "opacity-35" : "opacity-0",
              ].join(" ")}
              loading={idx === 0 ? "eager" : "lazy"}
            />
            {/* Main image (no crop) */}
            <img
              src={src}
              alt={hero.title}
              className={[
                "absolute inset-0 w-full h-full object-cover",
                "transition-opacity duration-1000 ease-in-out",
                idx === active ? "opacity-100" : "opacity-0",
              ].join(" ")}
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </React.Fragment>
        ))}

        <div className="absolute inset-0 bg-black/45" />

        {/* TEXT same as before */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 md:px-8 flex flex-col justify-end pb-10">
          <div className="flex gap-2 mb-3">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {hero.tags[0]}
            </span>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
              {hero.tags[1]}
            </span>
          </div>

          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold max-w-4xl">
            {hero.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/90">
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">{hero.location}</span>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">{hero.days}</span>
            </span>
            <span className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              <span className="text-sm">Starting @ ₹{hero.priceFrom}</span>
            </span>
          </div>
        </div>

        {/* Soft bottom shadow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT */}
          <div className="flex-1 min-w-0">
            {/* About */}
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                About This Experience
              </h2>
              <p className="mt-4 text-gray-700 text-base leading-relaxed">{about}</p>
            </div>

            {/* Highlights */}
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Highlights
              </h3>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-6">
                {highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-gray-800">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    <span className="text-lg">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Schedule */}
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Daily Schedule
              </h3>

              <div className="mt-6 space-y-6">
                {schedule.map((d) => (
                  <div
                    key={d.dayNumber}
                    className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                  >
                    {/* left accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-blue-600" />

                    <div className="p-6 flex items-start gap-5">
                      <div className="shrink-0">
                        <div className="h-12 w-12 rounded-full bg-blue-600 text-white text-lg font-extrabold flex items-center justify-center">
                          {d.dayNumber}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-xl font-extrabold text-gray-900">
                            {d.title}
                          </div>
                          {d.tags?.map((t) => (
                            <span
                              key={t}
                              className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <ul className="mt-4 space-y-3 text-gray-700">
                          {d.items.map((it, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="mt-2 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Included / Not Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xl">
                  <CheckCircle2 className="h-6 w-6" />
                  What's Included
                </div>

                <ul className="mt-6 space-y-4 text-emerald-950">
                  {whatsIncluded.map((i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 mt-0.5" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
                <div className="flex items-center gap-2 text-rose-900 font-extrabold text-xl">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-rose-300">
                    <span className="h-3 w-3 rounded-full bg-rose-600" />
                  </span>
                  What's Not Included
                </div>

                <ul className="mt-6 space-y-4 text-rose-950">
                  {notIncluded.map((i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-rose-600 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <RightSidebar />
        </div>
      </section>
    </div>
  );
};

export default CommunityTourMagicalMuscat;
