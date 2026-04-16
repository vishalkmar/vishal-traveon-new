import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { formatPriceWithSymbol } from "../../utils/formatPrice";
import { getApiV1Base } from "../../utils/apiUrl.js";
import {
  Hotel,
  Utensils,
  Plane,
  Camera,
  Bus,
  FileText,
  Share2,
  X as XIcon,
  Loader
} from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin, FaSnapchat, FaEnvelope, FaLink } from "react-icons/fa";
import CustomizePackageForm from "../CustomizePackageForm";


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

const HOTEL_CARD_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80";

/** Cities list from API (supports Cities/cities and single vs array City). */
function getCitiesArray(outerPkg) {
  const wrap = outerPkg?.Cities ?? outerPkg?.cities;
  if (!wrap) return [];
  const list = wrap.City ?? wrap.city;
  if (!list) return [];
  return Array.isArray(list) ? list : [list];
}

/** `longJsonInfo` may be an object or a JSON string; normalize to `package` payload. */
function parseLongJsonPackage(pObj) {
  let lj = pObj?.longJsonInfo;
  if (lj == null) return {};
  if (typeof lj === "string") {
    try {
      lj = JSON.parse(lj);
    } catch {
      return {};
    }
  }
  const pkg = lj?.package ?? lj;
  return pkg && typeof pkg === "object" ? pkg : {};
}

function isUsableImageUrl(u) {
  if (u == null) return false;
  const s = String(u).trim();
  return s.length > 0 && s !== "0" && !/^undefined$/i.test(s);
}

/** Resolve hotel image from MainImg / Images / alternate keys (API shapes vary). */
function firstHotelImageUrl(h) {
  if (!h) return "";
  const tryList = [h.MainImg, h.mainImg, h.Image, h.image];
  if (Array.isArray(h.Images)) tryList.push(...h.Images);
  if (Array.isArray(h.images)) tryList.push(...h.images);
  for (const u of tryList) {
    if (isUsableImageUrl(u)) return String(u).trim();
  }
  return "";
}

function hotelDedupeKey(h) {
  if (h?.RefHotelId != null && String(h.RefHotelId).trim() !== "") return `ref:${h.RefHotelId}`;
  const name = plainTextFromApi(h?.Name || "").toLowerCase();
  return `city:${h?.CityId ?? "?"}|${name}`;
}

/** Merge hotels from longJson + root `data.cities`; prefer row that has image / richer name. */
function dedupeHotelsMerge(list) {
  const m = new Map();
  for (const h of list) {
    const k = hotelDedupeKey(h);
    const prev = m.get(k);
    if (!prev) {
      m.set(k, { ...h });
      continue;
    }
    const imgP = firstHotelImageUrl(prev);
    const imgN = firstHotelImageUrl(h);
    const merged = { ...prev, ...h };
    merged.MainImg = imgP || imgN || merged.MainImg;
    const nameP = plainTextFromApi(prev.Name || "");
    const nameN = plainTextFromApi(h.Name || "");
    merged.Name = nameP.length >= nameN.length ? prev.Name : h.Name;
    merged._CityTitle = prev._CityTitle || h._CityTitle;
    const imgs = [
      ...(Array.isArray(prev.Images) ? prev.Images : []),
      ...(Array.isArray(h.Images) ? h.Images : []),
    ];
    if (imgs.length) merged.Images = imgs;
    m.set(k, merged);
  }
  return [...m.values()];
}

function collectHotelsFromCities(cities) {
  const out = [];
  for (const city of cities) {
    const block = city?.Hotels ?? city?.hotels;
    const raw = block?.Hotel ?? block?.hotel;
    if (!raw) continue;
    const arr = Array.isArray(raw) ? raw : [raw];
    for (const h of arr) out.push({ ...h, _CityTitle: city?.Title ?? city?.title });
  }
  return out;
}

/** All hotels: `package.Cities` (long JSON) + top-level `data.cities` (Railway / B2C often duplicates). */
function collectAllHotelsFromPackage(pObj, outerPkg) {
  const fromLong = collectHotelsFromCities(getCitiesArray(outerPkg));
  const fromRoot = collectHotelsFromCities(getCitiesArray({ Cities: pObj?.cities }));
  return dedupeHotelsMerge([...fromLong, ...fromRoot]);
}

/** Prefer long-json cities but fill missing cities from `data.cities` (same package id). */
function mergeCityListsById(pObj, outerPkg) {
  const a = getCitiesArray(outerPkg);
  const b = getCitiesArray({ Cities: pObj?.cities });
  const all = [...a, ...b];
  if (!all.length) return [];

  const byId = new Map();
  const titleNorm = (c) => String(c?.Title ?? c?.title ?? "").trim().toLowerCase();

  const mergeInto = (k, c, existing) => {
    const next = existing ? { ...existing, ...c } : { ...c };
    byId.set(k, next);
  };

  for (const c of all) {
    const id = String(c?.CityId ?? "").trim();
    if (id && id !== "0") {
      const k = `id:${id}`;
      mergeInto(k, c, byId.get(k));
      continue;
    }
    const tn = titleNorm(c);
    let hitKey = null;
    if (tn) {
      for (const [k, v] of byId) {
        if (titleNorm(v) === tn) {
          hitKey = k;
          break;
        }
      }
    }
    if (hitKey) mergeInto(hitKey, c, byId.get(hitKey));
    else {
      const k = tn ? `title:${tn}` : `orphan:${byId.size + 1}`;
      mergeInto(k, c, byId.get(k));
    }
  }
  return [...byId.values()];
}

function collectSightseeingsFromCities(cities) {
  const out = [];
  for (const city of cities) {
    const block = city?.SightSeeings ?? city?.sightSeeings;
    const raw = block?.SightSeeing ?? block?.sightSeeing;
    if (!raw) continue;
    const arr = Array.isArray(raw) ? raw : [raw];
    out.push(...arr);
  }
  return out;
}

function sightSeeingHasUsableImage(ss) {
  const u = ss?.Image;
  return u != null && String(u).trim() !== "" && String(u).trim() !== "0";
}

/** One card per logical sightseeing (longJson + data.cities often duplicate the same city twice). */
function dedupeSightseeings(list) {
  const m = new Map();
  for (const ss of list) {
    const ref = ss?.RefSSId != null && String(ss.RefSSId).trim() !== "" ? String(ss.RefSSId) : null;
    const titleKey = String(ss?.Title ?? ss?.Name ?? "")
      .trim()
      .toLowerCase();
    const cityPart = String(ss?.CityId ?? ss?.CityName ?? "").trim().toLowerCase();
    const key = ref != null ? `ref:${ref}` : `t:${cityPart}|${titleKey}`;

    const prev = m.get(key);
    if (!prev) {
      m.set(key, ss);
      continue;
    }
    const merged = { ...prev, ...ss };
    if (sightSeeingHasUsableImage(prev) && !sightSeeingHasUsableImage(ss)) merged.Image = prev.Image;
    else if (sightSeeingHasUsableImage(ss)) merged.Image = ss.Image;
    m.set(key, merged);
  }
  return [...m.values()];
}

/**
 * Decodes HTML entities, including double-encoded strings (&amp;bull; → •).
 * Use for any API string shown as plain text in this page.
 */
function decodeHtmlEntitiesDeep(raw) {
  if (raw == null || raw === "") return "";
  let s = String(raw);
  const maxPasses = 12;
  for (let i = 0; i < maxPasses; i++) {
    const prev = s;
    if (typeof document !== "undefined") {
      const ta = document.createElement("textarea");
      ta.innerHTML = s;
      s = ta.value;
    }
    s = s
      .replace(/&nbsp;/gi, " ")
      .replace(/&#160;/g, " ")
      .replace(/&bull;/gi, "•")
      .replace(/&#8226;/g, "•")
      .replace(/&ndash;/gi, "–")
      .replace(/&mdash;/gi, "—")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
    if (s === prev) break;
  }
  return s.replace(/\u00a0/g, " ");
}

/** Plain text: decode entities + strip tags + normalize spaces. */
function plainTextFromApi(raw) {
  if (raw == null || raw === "") return "";
  const decoded = decodeHtmlEntitiesDeep(raw);
  return decoded.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function PackageDetailsPage() {
  const { id: packageId } = useParams();
  const [loading, setLoading] = useState(true);
  const [pkg, setPkg] = useState(null);
  const [customFlowString, setCustomFlowString] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const TABS = useMemo(
    () => [
      { key: "itinerary", label: "ITINERARY" },
      { key: "package", label: "PACKAGE DETAILS" },
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
        const res = await fetch(`${getApiV1Base()}/packages/${packageId}`);
        if (!res.ok) throw new Error("Package not found");
        let jsondata = await res.json();

        // Unwrap data exactly like index page
        const pObj = jsondata?.data ? jsondata.data : jsondata;
        const outerPkg = parseLongJsonPackage(pObj);

        if (!mounted) return;

        // Map variables locally inside useEffect to construct our standard state shape
        const cities = mergeCityListsById(pObj, outerPkg);
        const city = cities[0] || {};
        const hotels = collectAllHotelsFromPackage(pObj, outerPkg);
        const sightseeings = dedupeSightseeings(collectSightseeingsFromCities(cities));
        const includedHotel = hotels.find((h) => h?.IsIncluded) || hotels[0] || null;

        const nightsVal = Number(pObj?.nights) || 0;
        const daysVal = nightsVal > 0 ? nightsVal + 1 : 0;
        const nightsDaysStr = nightsVal > 0 ? `${nightsVal}N / ${daysVal}D` : "";

        const cleanText = (text) => plainTextFromApi(text);

        const parseToBullets = (text) => {
          if (!text) return [];
          let decoded = decodeHtmlEntitiesDeep(String(text));

          const scrub = (s) => plainTextFromApi(String(s).replace(/<[^>]*>/gm, " ").trim());
          if (decoded.includes('<li>') || decoded.includes('<li ')) {
            const items = decoded.split(/<li[^>]*>/i);
            items.shift();
            return items.map((i) => scrub(i)).filter((i) => i && !i.match(/^[•\-\*]*$/));
          }
          if (decoded.includes('<br/>') || decoded.includes('<br>')) {
            return decoded.split(/<br\s*\/?>/i).map((i) => scrub(i)).filter((i) => i && !i.match(/^[•\-\*]*$/));
          }
          if (decoded.includes('\n')) {
            return decoded.split(/\n/).map((i) => scrub(i)).filter((i) => i && !i.match(/^[•\-\*]*$/));
          }
          if (decoded.includes('<p>')) {
            return decoded.split(/<p[^>]*>/i).map((i) => scrub(i)).filter((i) => i && !i.match(/^[•\-\*]*$/));
          }
          return [scrub(decoded)].filter((i) => i && !i.match(/^[•\-\*]*$/));
        };

        // Itineraries formatting - now with Program parsing
        let its = [];
        if (outerPkg?.Itineraries?.Itinerary && Array.isArray(outerPkg.Itineraries.Itinerary)) {
          its = outerPkg.Itineraries.Itinerary.map((it, idx) => ({
            day: (idx + 1),
            title: cleanText(it.Title) || `Day ${idx + 1}`,
            bullets: parseToBullets(it.Program) || [],
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
          const cleanedHotels = hotels.map((h) => ({
            ...h,
            Name: cleanText(h.Name),
            _CityTitle: h._CityTitle ? plainTextFromApi(h._CityTitle) : h._CityTitle,
          }));
          itemsRow.push({
            key: "hotel",
            label: "Hotel",
            isRich: true,
            richType: "hotels",
            details: cleanedHotels // pass the cleaned array of hotel objects
          });
        }

        if (sightseeings.length > 0) {
          itemsRow.push({
            key: "sightseeing",
            label: "Sightseeing",
            isRich: true,
            richType: "sightseeing",
            details: sightseeings.map((ss) => ({
              ...ss,
              Title: ss.Title != null ? plainTextFromApi(ss.Title) : ss.Title,
              Name: ss.Name != null ? plainTextFromApi(ss.Name) : ss.Name,
              CityName: ss.CityName != null ? plainTextFromApi(ss.CityName) : ss.CityName,
            })),
          });
        }

        if (pkgTxt.includes("visa") || outerPkg?.VisaDetails?.length) itemsRow.push({ key: "visa", label: "Visa", details: ["Visa assistance included"] });
        if (pkgTxt.includes("meal") || pkgTxt.includes("breakfast") || pkgTxt.includes("dinner")) itemsRow.push({ key: "meals", label: "Meals", details: ["Meals as per itinerary"] });
        if (outerPkg?.TransferData?.length || pkgTxt.includes("transfer")) itemsRow.push({ key: "transfer", label: "Transfer", details: ["Transfers included"] });

        if (itemsRow.length === 0) itemsRow.push({ key: "info", label: "Info", details: ["View detailed terms"] });

        const mappedPkg = {
          id: pObj.gtxPkgId || packageId,
          title: cleanText(outerPkg.Name || pObj.name || "Package"),
          rating: includedHotel?.Star && includedHotel?.Star !== ".00" ? Number(includedHotel.Star) : 4.3,
          reviewsLabel: "(953)",
          nightsDays: nightsDaysStr,
          routeLine: plainTextFromApi(
            pObj?.destinations ? pObj.destinations.split(",").join(" • ") : outerPkg?.DestinationPlaces || ""
          ),
          gallery: {
            hero:
              outerPkg?.ImgThumbnail ||
              firstHotelImageUrl(includedHotel) ||
              "",
            thumbs: [
              ...hotels.map((h) => firstHotelImageUrl(h)).filter(isUsableImageUrl),
              sightseeings?.[3]?.Image,
              sightseeings?.[0]?.Image,
              sightseeings?.[1]?.Image,
              sightseeings?.[2]?.Image,
            ].filter(isUsableImageUrl),
          },
          inclusions: itemsRow,
          itinerary: its,
          packageDetails: {
            flights: outerPkg?.FlightData?.length 
              ? outerPkg.FlightData.map(f => `${f.FlightNo || "Flight"} - ${f.Route || ""}`.trim()).filter(Boolean) 
              : pkgTxt.includes("flight") 
                ? ["Flights Included in this tour. All domestic and international flights are arranged as per itinerary with preferred airlines."] 
                : ["Flights are not included in this package."],
            transfer: outerPkg?.TransferData?.length 
              ? outerPkg.TransferData.map(t => `${t.Description || "Transfer"}`.trim()).filter(Boolean)
              : pkgTxt.includes("transfer") 
                ? ["Transfers Included: All airport pickups, hotel transfers, and sightseeing transfers are included on shared basis. Private transfers available on request."] 
                : [],
            visa: outerPkg?.VisaDetails && Object.values(outerPkg.VisaDetails)[0] 
              ? Object.values(outerPkg.VisaDetails)[0] 
              : pkgTxt.includes("visa")
                ? ["Visa Included in this tour. Our expert visa consultants will guide you through the entire application process with complete documentation support."]
                : [],
            sightseeing: sightseeings.map((s) => cleanText(s.Title || s.Name)).filter(Boolean),
            accommodation: hotels.map((h) => {
              const name = cleanText(h.Name);
              const n = Number(h.Star);
              const star =
                h.Star != null &&
                String(h.Star).trim() !== "" &&
                h.Star !== ".00" &&
                !Number.isNaN(n) &&
                n > 0
                  ? `${n.toFixed(2)} Star`
                  : null;
              const cityLbl = h._CityTitle ? ` — ${plainTextFromApi(h._CityTitle)}` : "";
              return star ? `${name} (${star})${cityLbl}` : `${name}${cityLbl}`;
            }),
            meals: (() => {
              const m = [...new Set(hotels.map((h) => h.MealTypeName).filter(Boolean))];
              if (m.length) return m;
              return includedHotel?.MealTypeName ? [includedHotel.MealTypeName] : [];
            })(),
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
            note: "Per Person (Double Occupency)",
            oldPrice: null,
            points: nightsDaysStr
          },
          inclusionsText: pObj?.inclusionsText || inclusionText || "",
          details: outerPkg?.details || pObj?.details || "",
          preString: `Hi, I want to enquire about ${cleanText(outerPkg.Name || pObj.name || "Package")} (${nightsDaysStr})`
        };

        setPkg(mappedPkg);
        setActiveTab("itinerary");
        setActiveDetail(mappedPkg.inclusions[0]?.key || "hotel");
        setActiveSubDetail("accommodation");

        // Fetch custom flow string for this package (if admin set one)
        const gtxId = pObj.gtxPkgId || packageId;
        fetch(`${getApiV1Base()}/package-config/${gtxId}/flow-string`)
          .then((r) => r.json())
          .then((d) => { if (d.success && d.flowString) setCustomFlowString(d.flowString); })
          .catch(() => {});
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Loader className="w-16 h-16 text-[#44B3C4] animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Package Details</h2>
          <p className="text-slate-600">Please wait while we fetch the package information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-6 mt-[80px]" >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Title row */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {plainTextFromApi(pkg.title)}
            </h1>
            {/* <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-semibold">{pkg.rating}</span>
              <span className="text-amber-500">★</span>
              <span>{pkg.reviewsLabel}</span>
            </div> */}
          </div>

          <div className="text-sm text-slate-600 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <span className="text-slate-500">🕒</span>
              {pkg.nightsDays}
            </span>
            <span className="text-slate-400">|</span>
            <p className="text-slate-600">{plainTextFromApi(pkg.routeLine)}</p>
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

            {activeTab === "terms" && <TermsConditionsTab termsObj={pkg.rawTerms} />}
          </div>

          {/* Right */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-6 space-y-4">
              <PriceCard pkg={pkg} onCustomize={() => setIsFormOpen(true)} isShareOpen={isShareOpen} setIsShareOpen={setIsShareOpen} packageId={packageId} customFlowString={customFlowString} />
             
            </div>
          </div>
        </div>
      </div>

      {/* Customize Package Form */}
      <CustomizePackageForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        packageTitle={plainTextFromApi(pkg?.title || "")}
      />
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
      {/* Inclusions Text */}
      {pkg.inclusionsText && (
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <p className="text-xs text-slate-600 font-medium">{plainTextFromApi(pkg.inclusionsText)}</p>
        </div>
      )}
      
      <div className="p-2 flex items-center justify-between ">
      
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
            {parsedDetails.map((hotel, idx) => {
              const hotelImg = firstHotelImageUrl(hotel) || HOTEL_CARD_FALLBACK_IMG;
              const starNum = Number(hotel.Star);
              return (
              <div
                key={hotel.RefHotelId != null ? `h-${hotel.RefHotelId}-${idx}` : idx}
                className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden flex flex-col"
              >
                {/* Hotel Image */}
                <div className="relative h-40 bg-slate-200">
                  <img
                    src={hotelImg}
                    alt={hotel.Name || "Hotel"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = HOTEL_CARD_FALLBACK_IMG;
                    }}
                  />
                  {hotel.Star && hotel.Star !== ".00" && !Number.isNaN(starNum) && starNum > 0 && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                      {Math.round(starNum)} <span className="text-amber-500">★</span>
                    </div>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className="font-bold text-slate-900 text-base leading-tight mb-1">{hotel.Name}</h4>
                  {hotel._CityTitle && (
                    <p className="text-xs text-slate-500 mb-1">
                      <span className="text-emerald-600 mr-1">📍</span>
                      {hotel._CityTitle}
                    </p>
                  )}
                  {hotel.Location?.Address && hotel.Location.Address !== "0" && (
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
            );
            })}
          </div>
        ) : activeObj?.isRich && activeObj?.richType === "sightseeing" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {parsedDetails.map((ss, idx) => {
              const sightImg =
                ss.Image && ss.Image !== "0"
                  ? ss.Image
                  : "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80";
              const sightTitle = plainTextFromApi(ss.Title || ss.Name || "");
              return (
                <div
                  key={ss.RefSSId != null ? `${ss.RefSSId}-${idx}` : idx}
                  className="group bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  {/* Sightseeing Image */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    <img
                      src={sightImg}
                      alt={sightTitle || "Sightseeing"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    {/* Image Icon Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <svg
                        className="h-12 w-12 text-white opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                      </svg>
                    </div>
                  </div>

                  {/* Sightseeing Info - Title Only */}
                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="font-bold text-slate-900 text-base leading-tight line-clamp-2">
                      {sightTitle || "Sightseeing"}
                    </h4>
                    {ss.CityName && (
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                        <span className="text-emerald-600">📍</span>
                        <span className="line-clamp-1">{plainTextFromApi(ss.CityName)}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-2 text-sm text-slate-600 space-y-1">
            {parsedDetails.map((line, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>{plainTextFromApi(String(line))}</span>
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
                    {plainTextFromApi(d.title)}
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
                            <li key={i}>{plainTextFromApi(String(b))}</li>
                          ))}
                        </ul>
                      )}
                      {d.note && (
                        <p className="mt-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">
                            Note:
                          </span>{" "}
                          {plainTextFromApi(String(d.note))}
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
    // { key: "flights", label: "Flights" },
    // { key: "transfer", label: "Transfer" },
    // { key: "visa", label: "Visa" },
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
                  <h4 className="text-lg font-bold text-slate-900">{plainTextFromApi(content.VisaName || "Tourist Visa")}</h4>
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
          ) : activeSub === "inclusionsExclusions" && Array.isArray(content) && content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const inclusionsIndex = content.indexOf("INCLUSIONS:");
                const exclusionsIndex = content.indexOf("EXCLUSIONS:");
                
                const inclusions = inclusionsIndex !== -1 
                  ? content.slice(inclusionsIndex + 1, exclusionsIndex !== -1 ? exclusionsIndex : content.length)
                  : [];
                
                const exclusions = exclusionsIndex !== -1
                  ? content.slice(exclusionsIndex + 1)
                  : [];

                return (
                  <>
                    {inclusions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-3 w-3 rounded-full bg-green-500 shrink-0" />
                          <h4 className="text-sm font-bold text-slate-900">INCLUSIONS:</h4>
                        </div>
                        <ul className="space-y-2">
                          {inclusions.map((item, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-700">
                              <span className="text-green-500 shrink-0 font-bold">•</span>
                              <span>{plainTextFromApi(String(item))}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exclusions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-3 w-3 rounded-full bg-red-500 shrink-0" />
                          <h4 className="text-sm font-bold text-slate-900">EXCLUSIONS:</h4>
                        </div>
                        <ul className="space-y-2">
                          {exclusions.map((item, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-700">
                              <span className="text-red-500 shrink-0 font-bold">•</span>
                              <span>{plainTextFromApi(String(item))}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : Array.isArray(content) && content.length > 0 ? (
            <ul className="space-y-2">
              {content.map((line, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="text-teal-500 shrink-0 font-bold">•</span>
                  <span>{plainTextFromApi(String(line))}</span>
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
/**
 * Converts raw API terms string → structured array of {type, text} blocks.
 * Handles double-encoded entities (&amp;bull; → •), strips tags, detects headings.
 */
function parseTermsContent(raw) {
  if (!raw) return [];

  // 1. Deep-decode ALL HTML entities (handles &amp;bull; → &bull; → • in multiple passes)
  let text = decodeHtmlEntitiesDeep(String(raw));

  // 2. Convert HTML block/list elements to plain-text equivalents
  text = text
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<div[^>]*>/gi, "\n")
    .replace(/<strong[^>]*>/gi, "")
    .replace(/<\/strong>/gi, "")
    .replace(/<b[^>]*>/gi, "")
    .replace(/<\/b>/gi, "")
    .replace(/<[^>]*>/g, ""); // strip all remaining tags

  // 3. Split into lines, trim, remove empties
  const lines = text
    .split(/\n|\r\n|\r/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 4. Classify each line
  return lines.map((line) => {
    const clean = line.replace(/^[•\-\*]\s*/, "").trim();

    // Explicit bullet: starts with •, -, *, or &bull; aftermath
    if (/^[•\-\*]/.test(line)) {
      return { type: "bullet", text: clean };
    }

    // Numbered point: "1. text" or "1) text"
    if (/^\d+[\.\)]\s/.test(line)) {
      return { type: "numbered", text: line };
    }

    // Heading detection:
    // - ends with ":" (strong signal e.g. "Payment Terms:")
    // - OR short line (≤ 7 words) with no sentence-ending punctuation
    const wordCount = line.split(/\s+/).length;
    const endsWithColon = line.endsWith(":");
    const looksLikeHeading =
      endsWithColon ||
      (wordCount <= 7 && !/[.!?]$/.test(line) && line.length < 70);

    if (looksLikeHeading) {
      return { type: "heading", text: line };
    }

    return { type: "text", text: line };
  });
}

function TermsConditionsTab({ termsObj }) {
  const validKeys = Object.keys(termsObj || {}).filter(
    (k) => termsObj[k] && String(termsObj[k]).trim() !== ""
  );
  const [activeTerm, setActiveTerm] = useState(validKeys[0] || "");

  if (validKeys.length === 0) {
    return (
      <div className="rounded-2xl bg-white ring-1 ring-black/10 p-5">
        <p className="text-sm text-slate-600">No terms available.</p>
      </div>
    );
  }

  const parsedContent = parseTermsContent(termsObj[activeTerm]);

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 overflow-hidden">
      {/* Sub tabs */}
      <div className="flex flex-wrap border-b border-black/5 bg-slate-50">
        {validKeys.map((key) => {
          const isActive = activeTerm === key;
          const label = key.replace(/([A-Z])/g, " $1").trim();
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

      {/* Content */}
      <div className="p-4">
        <div className="rounded-xl ring-1 ring-black/10 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
            {activeTerm.replace(/([A-Z])/g, " $1").trim()}
          </h3>

          <div className="space-y-1.5">
            {parsedContent.map((item, i) => {
              if (item.type === "heading") {
                return (
                  <p
                    key={i}
                    className="text-sm font-semibold text-slate-800 mt-4 first:mt-0"
                  >
                    {item.text}
                  </p>
                );
              }
              if (item.type === "bullet") {
                return (
                  <div key={i} className="flex gap-2 text-sm text-slate-600 pl-2">
                    <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                    <span>{item.text}</span>
                  </div>
                );
              }
              if (item.type === "numbered") {
                // Split "1. text" so wrapped lines align under the text, not the number
                const numMatch = item.text.match(/^(\d+[\.\)]\s*)(.*)$/s);
                const numPart = numMatch ? numMatch[1] : "";
                const textPart = numMatch ? numMatch[2] : item.text;
                return (
                  <div key={i} className="flex gap-1 text-sm text-slate-600 pl-2">
                    <span className="shrink-0">{numPart}</span>
                    <span>{textPart}</span>
                  </div>
                );
              }
              // type === "text"
              return (
                <p key={i} className="text-sm text-slate-600">
                  {item.text}
                </p>
              );
            })}
          </div>
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

function PriceCard({ pkg, onCustomize, isShareOpen, setIsShareOpen, packageId, customFlowString }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/10 p-5">
      <div className="text-right">
        {pkg.pricing.oldPrice && (
          <div className="text-sm text-slate-400 line-through">
            {formatPriceWithSymbol(pkg.pricing.oldPrice)}
          </div>
        )}
        <div className="text-3xl font-extrabold text-slate-900">
          {formatPriceWithSymbol(pkg.pricing.price)}
        </div>
        <div className="text-xs text-slate-500">{pkg.pricing.note}</div>
      </div>

      {/* <div
        className="mt-4 rounded-xl ring-1 p-3 text-sm text-slate-700"
        style={{
          background: "rgba(0,178,119,0.08)",
          borderColor: "rgba(0,178,119,0.18)",
        }}
      >
        <p className="font-semibold text-slate-900">{plainTextFromApi(pkg.title)}</p>
        <p className="text-xs text-slate-600">{pkg.pricing.points}</p>
      </div> */}

      <button
        type="button"
        className="h-12 rounded-xl font-semibold text-white shadow mt-2 w-full py-3 rounded-xl  ring-1 ring-black/10  font-semibold"
        style={{ background: BRAND.grad }}
        onClick={() => {
          const phone = "919540111307"; // without +
          const message = customFlowString || pkg?.preString || "Hi, I want to enquire about this tour package.";
          const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          window.open(url, "_blank");
        }}
      >
        Book Now
      </button>

      {/* OR Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-slate-600 font-medium">OR</span>
        </div>
      </div>

      <button
        type="button"
        className="h-12 rounded-xl font-semibold text-[#44B3C4] bg-white border-2 border-[#44B3C4] shadow w-full py-3 rounded-xl ring-1 ring-black/10 font-semibold hover:bg-[#44B3C4]/5 transition-all duration-300"
        onClick={onCustomize}
      >
        Customize Your Package
      </button>

      {pkg.details && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 ring-1 ring-slate-200">
          <p className="text-xs font-semibold text-slate-900 mb-2">About Destination</p>
          <div 
            className="text-xs text-slate-700 leading-relaxed "
            dangerouslySetInnerHTML={{
              __html: String(pkg.details || "")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/<[^>]*>/g, '')
            }}
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        {/* <button
          type="button"
          onClick={() => alert("Download PDF (placeholder)")}
          className="hover:text-slate-900"
        >
          ⬇ Download PDF
        </button> */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="hover:text-slate-900 flex items-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          {isShareOpen && (
            <ShareMenu 
              title={plainTextFromApi(pkg.title)} 
              packageId={packageId}
              onClose={() => setIsShareOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ShareMenu({ title, packageId, onClose }) {
  const baseUrl = window.location.origin;
  const packageUrl = `${baseUrl}/packages/${packageId}`;
  const encodedUrl = encodeURIComponent(packageUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(packageUrl);
    alert("Link copied to clipboard!");
    onClose();
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "#1877F2",
      onclick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "#E4405F",
      onclick: () => {
        window.open(
          `https://www.instagram.com/share?url=${encodedUrl}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "#25D366",
      onclick: () => {
        window.open(
          `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "#0A66C2",
      onclick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "Twitter/X",
      icon: FaLink,
      color: "#000000",
      onclick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "Email",
      icon: FaEnvelope,
      color: "#666",
      onclick: () => {
        window.location.href = `mailto:?subject=${encodedTitle}&body=Check out this package: ${packageUrl}`;
        onClose();
      },
    },
    {
      name: "Copy Link",
      icon: FaLink,
      color: "#44B3C4",
      onclick: handleCopyLink,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">
            Share
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <XIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 items-center justify-center">
          {shareOptions.slice(0, 4).map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.name}
                type="button"
                onClick={option.onclick}
                className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition group"
                title={option.name}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition shadow-lg"
                  style={{ backgroundColor: option.color }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center line-clamp-2">
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-6 items-center justify-center mt-6">
          {shareOptions.slice(4).map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.name}
                type="button"
                onClick={option.onclick}
                className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition group"
                title={option.name}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition shadow-lg"
                  style={{ backgroundColor: option.color }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center line-clamp-2">
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

