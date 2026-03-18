import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Hotel,
  Utensils,
  Plane,
  Camera,
  Bus,
  FileText
} from "lucide-react";


/**
 * ✅ Only theme colors updated to match your website:
 * - Primary gradient:  #31CEC9 → #00B277 → #2AB153
 * - Accent teal/green used across tabs, buttons, rings, highlights
 * - Orange CTA retained where you were already using it (you can switch it too if needed)
 */

const BRAND = {
  grad: "linear-gradient(90deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)",
  teal: "#00B277",
  tealSoft: "rgba(0,178,119,0.12)",
  tealRing: "focus:ring-4 focus:ring-emerald-500/20",
};

export default function PackageDetailsPage() {
  const { id: packageId } = useParams();
  const [loading, setLoading] = useState(true);
  const [pkg, setPkg] = useState(null);

  const TABS = useMemo(
    () => [
      { key: "itinerary", label: "ITINERARY" },
      { key: "package", label: "PACKAGE DETAILS" },
      { key: "price", label: "CALCULATE PRICE" },
      { key: "terms", label: "TERMS & CONDITIONS" },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState("itinerary");
  const [activeDetail, setActiveDetail] = useState("hotel");
  const [activeSubDetail, setActiveSubDetail] = useState("flights");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/v1/packages/${packageId}`);
        if (!res.ok) throw new Error("Package not found");
        let jsondata = await res.json();

        // Unwrap data exactly like index page
        const pObj = jsondata?.data ? jsondata.data : jsondata;
        const outerPkg = pObj?.longJsonInfo?.package || {};

        if (!mounted) return;

        // Map variables locally inside useEffect to construct our standard state shape
        const city = outerPkg?.Cities?.City?.[0] || {};
        const hotels = city?.Hotels?.Hotel || [];
        const includedHotel = hotels.find((h) => h?.IsIncluded) || hotels[0] || null;

        const nightsVal = Number(pObj?.nights) || 0;
        const daysVal = nightsVal > 0 ? nightsVal + 1 : 0;
        const nightsDaysStr = nightsVal > 0 ? `${nightsVal}N / ${daysVal}D` : "";

        // Itineraries formatting
        let its = [];
        if (outerPkg?.Itineraries?.Itinerary && Array.isArray(outerPkg.Itineraries.Itinerary)) {
          its = outerPkg.Itineraries.Itinerary.map((it, idx) => ({
            day: (idx + 1), // Itineraries usually don't have day numbers easily exposed, default sequential
            title: it.Title || `Day ${idx + 1}`,
            bullets: [],
            note: "",
            image: ""
          }));
        }

        // Inclusions parsing (same as card but verbose for terms page)
        const inclusionText = outerPkg?.Terms?.Inclusion || outerPkg?.DETAILS || "No inclusions specified.";
        const exclusionText = outerPkg?.Terms?.Exclusions || "No exclusions specified.";
        const bTerms = outerPkg?.Terms?.BookingTerms || "";
        const cTerms = outerPkg?.Terms?.Conditions || "";

        // Build the dynamic icons row based on found inclusions
        const itemsRow = [];
        const pkgTxt = (inclusionText + " " + (pObj?.destinations || "") + " " + outerPkg.PackageType).toLowerCase();

        if (outerPkg?.FlightData?.length || pkgTxt.includes("flight")) itemsRow.push({ key: "flights", label: "Flights", details: ["Flights included as per itinerary"] });

        // --- Pass FULL hotel objects for rendering rich tabs ---
        if (hotels.length > 0) {
          itemsRow.push({
            key: "hotel",
            label: "Hotel",
            isRich: true,
            richType: "hotels",
            details: hotels // pass the raw array of hotel objects
          });
        }

        // --- Pass FULL Sightseeing objects ---
        const sightseeings = city?.SightSeeings?.SightSeeing || [];
        if (sightseeings.length > 0) {
          itemsRow.push({
            key: "sightseeing",
            label: "Sightseeing",
            isRich: true,
            richType: "sightseeing",
            details: sightseeings
          });
        }

        if (pkgTxt.includes("visa") || outerPkg?.VisaDetails?.length) itemsRow.push({ key: "visa", label: "Visa", details: ["Visa assistance included"] });
        if (pkgTxt.includes("meal") || pkgTxt.includes("breakfast") || pkgTxt.includes("dinner")) itemsRow.push({ key: "meals", label: "Meals", details: ["Meals as per itinerary"] });
        if (outerPkg?.TransferData?.length || pkgTxt.includes("transfer")) itemsRow.push({ key: "transfer", label: "Transfer", details: ["Transfers included"] });

        if (itemsRow.length === 0) itemsRow.push({ key: "info", label: "Info", details: ["View detailed terms"] });

        // Helper to decode HTML entities and rip out bullets
        const parseToBullets = (text) => {
          if (!text) return [];
          let decoded = String(text).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;nbsp;/g, ' ');

          if (decoded.includes('<li>') || decoded.includes('<li ')) {
            const items = decoded.split(/<li[^>]*>/i);
            items.shift();
            return items.map(i => i.replace(/<[^>]*>/gm, '').trim()).filter(Boolean);
          } else if (decoded.includes('<br/>') || decoded.includes('<br>')) {
            return decoded.split(/<br\s*\/?>/i).map(i => i.replace(/<[^>]*>/gm, '').trim()).filter(Boolean);
          } else if (decoded.includes('<p>')) {
            return decoded.split(/<p[^>]*>/i).map(i => i.replace(/<[^>]*>/gm, '').trim()).filter(Boolean);
          } else {
            return [decoded.replace(/<[^>]*>/gm, '').trim()].filter(Boolean);
          }
        };

        const mappedPkg = {
          id: pObj.gtxPkgId || packageId,
          title: outerPkg.Name || pObj.name || "Package",
          rating: includedHotel?.Star && includedHotel?.Star !== ".00" ? Number(includedHotel.Star) : 4.3,
          reviewsLabel: "(953)",
          nightsDays: nightsDaysStr,
          routeLine: (pObj?.destinations ? pObj.destinations.split(',').join(' • ') : outerPkg?.DestinationPlaces || ""),
          gallery: {
            hero: outerPkg?.ImgThumbnail || includedHotel?.MainImg || "",
            thumbs: [outerPkg?.ImgThumbnail, includedHotel?.MainImg].filter(Boolean)
          },
          inclusions: itemsRow,
          itinerary: its,
          packageDetails: {
            flights: outerPkg?.FlightData?.length ? ["Flights are subject to availability"] : [],
            transfer: outerPkg?.TransferData?.length ? ["All transfers on SIC basis"] : [],
            visa: outerPkg?.VisaDetails && Object.values(outerPkg.VisaDetails)[0] ? Object.values(outerPkg.VisaDetails)[0] : [],
            sightseeing: sightseeings.map(s => s.Title || s.Name) || [],
            accommodation: hotels.map(h => `${h.Name} (${h.Star} Star)`),
            meals: includedHotel?.MealTypeName ? [includedHotel.MealTypeName] : [],
            inclusionsExclusions: [
              "INCLUSIONS:",
              ...parseToBullets(inclusionText),
              "EXCLUSIONS:",
              ...parseToBullets(exclusionText)
            ]
          },
          rawTerms: outerPkg?.Terms || {}, // Pass raw object for new sub-tabs
          pricing: {
            price: pObj?.minPrice ? `₹${pObj.minPrice.toLocaleString('en-IN')} ` : "Price on Request",
            note: "Starting price per adult",
            oldPrice: null,
            points: "Earn 500 Loyal Points"
          },
          preString: `Hi, I want to enquire about ${outerPkg.Name} (${nightsDaysStr})`
        };

        setPkg(mappedPkg);
        setActiveTab("itinerary");
        setActiveDetail(mappedPkg.inclusions[0]?.key || "hotel");
        setActiveSubDetail("accommodation");
      } catch (error) {
        console.error("Failed to fetch package:", error);
        if (mounted) setLoading(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [packageId]);

  if (loading || !pkg) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-slate-50">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/10">
          <div className="h-3 w-44 bg-slate-200 rounded mb-3" />
          <div className="h-3 w-72 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-56 bg-slate-200 rounded" />
          <p className="mt-4 text-sm text-slate-500">Loading package...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen mt-[100px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Title row */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {pkg.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-semibold">{pkg.rating}</span>
              <span className="text-amber-500">★</span>
              <span>{pkg.reviewsLabel}</span>
            </div>
          </div>

          <div className="text-sm text-slate-600 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <span className="text-slate-500">🕒</span>
              {pkg.nightsDays}
            </span>
            <span className="text-slate-400">|</span>
            <p className="text-slate-600">{pkg.routeLine}</p>
          </div>
        </div>

        {/* main grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left content */}
          <div className="lg:col-span-8 space-y-5">
            <GallerySection pkg={pkg} />

            <InclusionIconRow
              items={pkg.inclusions}
              active={activeDetail}
              onChange={setActiveDetail}
            />

            <MainTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

            {activeTab === "itinerary" && (
              <ItineraryTab itinerary={pkg.itinerary} />
            )}

            {activeTab === "package" && (
              <PackageDetailsTab
                pkg={pkg}
                activeSub={activeSubDetail}
                onSubChange={setActiveSubDetail}
              />
            )}

            {activeTab === "price" && <CalculatePriceTab />}

            {activeTab === "terms" && <TermsConditionsTab termsObj={pkg.rawTerms} />}
          </div>

          {/* Right */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-6 space-y-4">
              <PriceCard pkg={pkg} />
              <OffersCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- sections -------------------- */

function GallerySection({ pkg }) {
  const [hero, setHero] = useState(pkg.gallery.hero);

  useEffect(() => {
    setHero(pkg.gallery.hero);
  }, [pkg.gallery.hero]);

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ring-1"
          style={{
            background: "rgba(0,178,119,0.10)",
            color: "#0f766e",
            borderColor: "rgba(0,178,119,0.25)",
          }}
        >
          {pkg.tag || "Group Tour"}
        </span>
        <button className="text-sm text-slate-600 hover:text-slate-900">
          See All Photos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 p-4 pt-0">
        <div className="md:col-span-7">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <img src={hero} alt="" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 gap-2">
          {pkg.gallery.thumbs?.slice(0, 4).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setHero(src)}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden ring-1 ring-black/10 hover:ring-emerald-500/40"
              aria-label={`thumb-${i}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InclusionIconRow({ items, active, onChange }) {
  const icons = {
    hotel: Hotel,
    meals: Utensils,
    flights: Plane,
    sightseeing: Camera,
    transfer: Bus,
    visa: FileText,
  };

  const activeObj = items.find((x) => x.key === active);

  const parsedDetails = (() => {
    const d = activeObj?.details;
    if (!d) return [];
    if (activeObj?.isRich) return d; // Return raw array of objects for rich rendering

    if (Array.isArray(d)) return d;
    try {
      return JSON.parse(String(d).replace(/'/g, '"'));
    } catch {
      return [String(d)];
    }
  })();

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 p-4">
      <div className="flex flex-wrap gap-4">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-2xl ring-1 transition",
                isActive
                  ? "bg-emerald-50 ring-emerald-500/25"
                  : "bg-white ring-black/10 hover:bg-slate-50",
              ].join(" ")}
            >
              <span
                className="h-10 w-10 rounded-full grid place-items-center ring-1"
                style={{
                  background: isActive ? BRAND.tealSoft : "white",
                  borderColor: isActive
                    ? "rgba(0,178,119,0.25)"
                    : "rgba(0,0,0,0.08)",
                  color: isActive ? "#0f766e" : "inherit",
                }}
              >
                {
                  (() => {
                    const IconComp = icons[it.key];
                    return IconComp ? <IconComp className="h-5 w-5" /> : <span className="text-lg">•</span>;
                  })()
                }
              </span>

              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">{it.label}</p>
                <p className="text-xs text-slate-500">Tap to view</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-4 rounded-xl bg-slate-50 ring-1 ring-black/5 p-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">
          {activeObj?.label} Overview
        </p>

        {activeObj?.isRich && activeObj?.richType === "hotels" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {parsedDetails.map((hotel, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden flex flex-col">
                {/* Hotel Image */}
                <div className="relative h-40 bg-slate-200">
                  {(hotel.Images && hotel.Images.length > 0) || hotel.MainImg ? (
                    <img
                      src={hotel.MainImg || hotel.Images[0]}
                      alt={hotel.Name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" }} // fallback
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Hotel className="h-10 w-10 opacity-20" />
                    </div>
                  )}
                  {/* Star Badge */}
                  {hotel.Star && hotel.Star !== ".00" && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                      {parseInt(hotel.Star)} <span className="text-amber-500">★</span>
                    </div>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className="font-bold text-slate-900 text-base leading-tight mb-1">{hotel.Name}</h4>
                  {hotel.Location?.Address && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                      <span className="text-emerald-600 mr-1">📍</span>{hotel.Location.Address}
                    </p>
                  )}
                  <div className="mt-auto pt-2 space-y-1">
                    {hotel.RoomTypeName && (
                      <p className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded inline-block mr-2">Room: {hotel.RoomTypeName}</p>
                    )}
                    {hotel.MealTypeName && (
                      <p className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded inline-block">Meal: {hotel.MealTypeName}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeObj?.isRich && activeObj?.richType === "sightseeing" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {parsedDetails.map((ss, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden flex flex-col">
                {/* Sightseeing Image */}
                <div className="relative h-40 bg-slate-200">
                  {ss.Image ? (
                    <img
                      src={ss.Image}
                      alt={ss.Title || ss.Name || "Sightseeing"}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80" }} // fallback
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Camera className="h-10 w-10 opacity-20" />
                    </div>
                  )}
                </div>

                {/* Sightseeing Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className="font-bold text-slate-900 text-base leading-tight mb-1">{ss.Title || ss.Name}</h4>
                  {ss.CityName && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                      <span className="text-emerald-600 mr-1">📍</span>{ss.CityName}
                    </p>
                  )}
                  {ss.Description && (
                    <p className="text-xs text-slate-600 mb-2 line-clamp-3">{String(ss.Description).replace(/<[^>]*>?/gm, '')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-sm text-slate-600 space-y-1">
            {parsedDetails.map((line, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MainTabs({ tabs, active, onChange }) {
  return (
    <div className="bg-white ring-1 ring-black/10 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "px-4 sm:px-5 py-3 text-sm font-bold border-b-2 transition",
                isActive
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- Tabs -------------------- */

function ItineraryTab({ itinerary = [] }) {
  const [openDay, setOpenDay] = useState(itinerary?.[0]?.day || 1);

  useEffect(() => {
    setOpenDay(itinerary?.[0]?.day || 1);
  }, [itinerary]);

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 overflow-hidden">
      <div className="p-4 border-b border-black/5">
        <p className="text-sm font-semibold text-slate-900">Itinerary</p>
      </div>

      <div className="p-4 space-y-3">
        {itinerary.map((d) => {
          const open = openDay === d.day;
          return (
            <div
              key={d.day}
              className="rounded-xl ring-1 ring-black/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenDay(open ? null : d.day)}
                className="w-full flex items-center justify-between gap-4 p-4 bg-white hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full ring-1"
                    style={{
                      background: "rgba(0,178,119,0.10)",
                      color: "#0f766e",
                      borderColor: "rgba(0,178,119,0.25)",
                    }}
                  >
                    Day {d.day}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {d.title}
                  </span>
                </div>
                <span className="text-slate-500">{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="p-4 bg-white border-t border-black/5">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 notice">
                    {d.image && (
                      <div className="md:col-span-4">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-black/10">
                          <img
                            src={d.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className={d.image ? "md:col-span-8" : "md:col-span-12"}>
                      {Array.isArray(d.bullets) && d.bullets.length > 0 && (
                        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                          {d.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {d.note && (
                        <p className="mt-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">
                            Note:
                          </span>{" "}
                          {d.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PackageDetailsTab({ pkg, activeSub, onSubChange }) {
  const SUBTABS = [
    { key: "flights", label: "Flights" },
    { key: "transfer", label: "Transfer" },
    { key: "visa", label: "Visa" },
    { key: "sightseeing", label: "Sightseeing" },
    { key: "accommodation", label: "Accommodation" },
    { key: "meals", label: "Meals" },
    { key: "inclusionsExclusions", label: "Inclusion/Exclusions" },
  ];

  const content = pkg.packageDetails?.[activeSub] || [];

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 overflow-hidden">
      {/* Sub tabs */}
      <div className="flex flex-wrap border-b border-black/5 bg-slate-50">
        {SUBTABS.map((t) => {
          const isActive = activeSub === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onSubChange(t.key)}
              className={[
                "px-4 py-3 text-sm font-semibold border-b-2 transition",
                isActive
                  ? "border-emerald-600 text-emerald-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="rounded-xl ring-1 ring-black/10 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900 mb-2">
            {SUBTABS.find((x) => x.key === activeSub)?.label}
          </p>

          {activeSub === "visa" && typeof content === "object" && content !== null && !Array.isArray(content) ? (
            <div className="bg-slate-50 p-5 rounded-xl ring-1 ring-black/5">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-black/10">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{content.VisaName || "Tourist Visa"}</h4>
                  <div className="flex gap-2 mt-2">
                    {content.VisaType && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">{content.VisaType}</span>
                    )}
                    {content.VisaCategory && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">{content.VisaCategory}</span>
                    )}
                  </div>
                </div>
                {content.PrecessingTime && (
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing Time</p>
                    <p className="text-sm font-bold text-slate-900">{content.PrecessingTime} Days</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-1">Adult</p>
                  <p className="text-base font-bold text-slate-900">{content.CurrencySymbol} {content.VisaAdultRates || "N/A"}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-1">Child</p>
                  <p className="text-base font-bold text-slate-900">{content.CurrencySymbol} {content.VisaChildRates || "N/A"}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-1">Child (Family)</p>
                  <p className="text-base font-bold text-slate-900">{content.CurrencySymbol} {content.VisaChildFamilyRates || "N/A"}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-1">Infant</p>
                  <p className="text-base font-bold text-slate-900">{content.CurrencySymbol} {content.VisaInfantRates || "N/A"}</p>
                </div>
              </div>
            </div>
          ) : Array.isArray(content) && content.length > 0 ? (
            <ul className="space-y-2">
              {content.map((line, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span
                    className="mt-1 h-2 w-2 rounded-full shrink-0"
                    style={{ background: BRAND.teal }}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              No data available. (API se aate hi show hoga)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
function TermsConditionsTab({ termsObj }) {
  const validKeys = Object.keys(termsObj || {}).filter(k => termsObj[k] && String(termsObj[k]).trim() !== "");
  const [activeTerm, setActiveTerm] = useState(validKeys[0] || "");

  if (validKeys.length === 0) {
    return (
      <div className="rounded-2xl bg-white ring-1 ring-black/10 p-5">
        <p className="text-sm text-slate-600">No terms available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 overflow-hidden">
      {/* Sub tabs (Horizontal) */}
      <div className="flex flex-wrap border-b border-black/5 bg-slate-50">
        {validKeys.map((key) => {
          const isActive = activeTerm === key;
          const label = key.replace(/([A-Z])/g, ' $1').trim();
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTerm(key)}
              className={[
                "px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap",
                isActive
                  ? "border-emerald-600 text-emerald-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="rounded-xl ring-1 ring-black/10 bg-white p-6 overflow-y-auto prose prose-sm max-w-none text-slate-700">
          <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
            {activeTerm.replace(/([A-Z])/g, ' $1').trim()}
          </h3>

          {/* Render HTML content securely */}
          <div
            className="space-y-3 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-emerald-500"
            dangerouslySetInnerHTML={{
              // Parse entities &lt; and &gt; back to html
              __html: String(termsObj[activeTerm] || "").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;nbsp;/g, ' ').replace(/&amp;#39;/g, "'").replace(/&amp;rsquo;/g, "’")
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CalculatePriceTab() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 p-5">
      <p className="text-sm font-semibold text-slate-900">Calculate Price</p>
      <p className="mt-2 text-sm text-slate-600">
        Yaha aap later pax count, travel date, room type, addons ke according
        price calculate karwa sakte ho.
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className={`h-11 rounded-xl bg-white px-3 ring-1 ring-black/10 focus:outline-none ${BRAND.tealRing}`}
          placeholder="Adults"
        />
        <input
          className={`h-11 rounded-xl bg-white px-3 ring-1 ring-black/10 focus:outline-none ${BRAND.tealRing}`}
          placeholder="Children"
        />
        <input
          className={`h-11 rounded-xl bg-white px-3 ring-1 ring-black/10 focus:outline-none ${BRAND.tealRing}`}
          placeholder="Travel month"
        />
        <select
          className={`h-11 rounded-xl bg-white px-3 ring-1 ring-black/10 focus:outline-none ${BRAND.tealRing}`}
        >
          <option>Room type</option>
          <option>Standard</option>
          <option>Deluxe</option>
          <option>Suite</option>
        </select>
      </div>

      <button
        className="mt-4 w-full sm:w-auto px-5 py-3 rounded-xl text-white font-semibold shadow-sm"
        style={{ background: BRAND.grad }}
      >
        Calculate
      </button>
    </div>
  );
}

function TermsTab({ terms = [] }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 p-5">
      <p className="text-sm font-semibold text-slate-900">Terms & Conditions</p>
      <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
        {terms.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------- Right Cards -------------------- */

function PriceCard({ pkg }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 p-5">
      <div className="text-right">
        {pkg.pricing.oldPrice && (
          <div className="text-sm text-slate-400 line-through">
            {pkg.pricing.oldPrice}
          </div>
        )}
        <div className="text-3xl font-extrabold text-slate-900">
          {pkg.pricing.price}
        </div>
        <div className="text-xs text-slate-500">{pkg.pricing.note}</div>
      </div>

      <div
        className="mt-4 rounded-xl ring-1 p-3 text-sm text-slate-700"
        style={{
          background: "rgba(0,178,119,0.08)",
          borderColor: "rgba(0,178,119,0.18)",
        }}
      >
        <p className="font-semibold text-slate-900">Earn</p>
        <p className="text-sm text-slate-700">{pkg.pricing.points}</p>
      </div>

      <button
        type="button"
        className="h-12 rounded-xl font-semibold text-white shadow mt-2 w-full py-3 rounded-xl  ring-1 ring-black/10  font-semibold"
        style={{ background: BRAND.grad }}
        onClick={() => {
          const phone = "919540111307"; // without +
          const message = pkg?.preString || "Hi, I want to enquire about this tour package.";
          const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          window.open(url, "_blank");
        }}
      >
        Book Now
      </button>



      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <button
          type="button"
          onClick={() => alert("Download PDF (placeholder)")}
          className="hover:text-slate-900"
        >
          ⬇ Download PDF
        </button>
        <button
          type="button"
          onClick={() => navigator?.share?.({ title: pkg.title })?.catch(() => { })}
          className="hover:text-slate-900"
        >
          ↗ Share
        </button>
      </div>
    </div>
  );
}

function OffersCard() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Offers</p>
        <span
          className="text-xs px-2 py-1 rounded-full ring-1"
          style={{
            background: "rgba(0,178,119,0.10)",
            color: "#0f766e",
            borderColor: "rgba(0,178,119,0.25)",
          }}
        >
          Applicable after calculating price
        </span>
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-500 mb-2">Have a coupon code?</p>
        <div className="flex gap-2">
          <input
            className={`h-11 flex-1 rounded-xl bg-white px-3 ring-1 ring-black/10 focus:outline-none ${BRAND.tealRing}`}
            placeholder="Enter code"
          />
          <button
            className="h-11 px-4 rounded-xl text-white font-semibold hover:opacity-95"
            style={{ background: BRAND.grad }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
