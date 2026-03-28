import React, { useId, useMemo, useRef } from "react";

const defaultTheme = {
  primary: "bg-red-600 hover:bg-red-700",
  primaryText: "text-white",
  chipBg: "bg-red-600",
  chipText: "text-white",
  overlayBg: "bg-black/70",
  cardRadius: "rounded-3xl",
};

function IncludedIconSvg({ type }) {
  const cls = "h-5 w-5";
  switch (type) {
    case "flights":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 16l-8-4V3.5a1.5 1.5 0 10-3 0V12l-8 4v2l8-2 3 6h2l-2-6 8 2v-2z" />
        </svg>
      );
    case "hotel":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 11h18M5 11V7a2 2 0 012-2h4a2 2 0 012 2v4M5 21V11m14 10V11" />
          <path d="M14 9h5a2 2 0 012 2v10" />
        </svg>
      );
    case "sightseeing":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
          <path d="M12 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        </svg>
      );
    case "visa":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
          <path d="M16 5v4h4" />
          <path d="M7 13h10M7 17h7" />
        </svg>
      );
    case "meals":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 3v8M11 3v8M9 11v10" />
          <path d="M15 3c2 3 2 6 0 9v9" />
        </svg>
      );
    case "transfer":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 17h11l2-5H6l-1 5z" />
          <path d="M6 17a2 2 0 104 0" />
          <path d="M15 17a2 2 0 104 0" />
          <path d="M16 12h3l2 3v2h-2" />
          <path d="M5 12l1-5h10l1 5" />
        </svg>
      );
    case "cruise":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 18l2-6h14l2 6H3z" />
          <path d="M7 12V6h10v6" />
          <path d="M5 21c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0" />
        </svg>
      );
    default:
      return null;
  }
}

function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 21s-7-4.4-9.2-8.6C1 9 3.3 6 6.7 6c1.7 0 3.1.8 3.9 2 .8-1.2 2.2-2 3.9-2C17.9 6 20.2 9 21.2 12.4 19 16.6 12 21 12 21z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 17.3l-6.2 3.6 1.7-7-5.5-4.8 7.2-.6L12 2l2.8 6.5 7.2.6-5.5 4.8 1.7 7z" />
    </svg>
  );
}

function decodeHtml(html = "") {
  if (!html || typeof window === "undefined") return html || "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function stripHtml(html = "") {
  if (!html) return "";
  return decodeHtml(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getNightsDays(raw) {
  if (typeof raw === "number" && raw > 0) {
    return `${raw}N / ${raw + 1}D`;
  }
  return "";
}

function getIncludedTypes(pkg) {
  const inclusionText = [
    pkg?.DETAILS,
    pkg?.Terms?.Inclusion,
    pkg?.Inclusions,
  ]
    .filter(Boolean)
    .map(stripHtml)
    .join(" ")
    .toLowerCase();

  const items = [];

  if (pkg?.FlightData?.length) items.push({ key: "flights", label: "Flights" });
  if (pkg?.Cities?.City?.[0]?.Hotels?.Hotel?.length) items.push({ key: "hotel", label: "Hotel" });
  if (pkg?.Cities?.City?.[0]?.SightSeeings?.SightSeeing?.length)
    items.push({ key: "sightseeing", label: "Sightseeing" });
  if (pkg?.VisaDetails?.length || inclusionText.includes("visa")) items.push({ key: "visa", label: "Visa" });
  if (inclusionText.includes("breakfast") || inclusionText.includes("lunch") || inclusionText.includes("dinner"))
    items.push({ key: "meals", label: "Meals" });
  if (pkg?.Transfers || pkg?.TransferData?.length || inclusionText.includes("transfer") || inclusionText.includes("airport-hotel-airport"))
    items.push({ key: "transfer", label: "Transfer" });

  return items.slice(0, 8);
}

function mapPackageData(item) {
  // console.log("Mapping item:", item?.id, item?.gtxPkgId, item); // Removed to reduce console spam
  const pkg = item?.longJsonInfo?.package || {};

  const city = pkg?.Cities?.City?.[0] || {};
  const hotels = city?.Hotels?.Hotel || [];
  const includedHotel = hotels.find((h) => h?.IsIncluded) || hotels[0] || null;

  const nightsVal = Number(item?.nights) || 0;
  const daysVal = nightsVal > 0 ? nightsVal + 1 : 0;
  const nightsLabel = nightsVal > 0 ? `${nightsVal}N/${daysVal}D` : "";

  // Destination comes from api destinations string directly per user instruction
  const destination = item?.destinations || pkg?.DestinationPlaces || "";
  const countries = item?.countries || "";
  const hotelName = includedHotel?.Name || "";
  const hotelStar = includedHotel?.Star && includedHotel.Star !== ".00" ? `${parseInt(includedHotel.Star, 10)} Star` : "";
  const hotelRoom = includedHotel?.RoomTypeName || "";
  const mealPlan = includedHotel?.MealTypeName || "";

  // Helper arrays for routes - map dest comma to space or keep clean
  const routeSummary = item?.destinations ? item.destinations.split(',').join(' • ') : pkg?.DestinationPlaces || "";
  
  // Extract priceDoubleOcc from pricing data
  let priceDoubleOcc = null;
  if (city?.pricingByRoomType && Array.isArray(city.pricingByRoomType)) {
    const firstPricing = city.pricingByRoomType[0];
    if (firstPricing?.priceDoubleOcc) {
      priceDoubleOcc = `₹${Number(firstPricing.priceDoubleOcc).toLocaleString('en-IN')}`;
    }
  }

  // Map itineraries from Itineraries.Itinerary array with Day and Title
  let itinerariesArr = [];
  let itinerariesTextArr = [];
  if (pkg?.Itineraries?.Itinerary && Array.isArray(pkg.Itineraries.Itinerary)) {
      itinerariesArr = pkg.Itineraries.Itinerary.map((it, idx) => ({
        day: it.Day,
        title: it.Title
      }));
      itinerariesTextArr = itinerariesArr.map(it => it.Title).filter(t => t && t.trim() !== "");
  }
  
  // Format itineraries for hover display: "day X : Title"
  const itinerariesHoverText = itinerariesArr.slice(0, 5).map(it => `day ${it.day} : ${it.title}`).join('\n');
  const showMoreItineraries = itinerariesArr.length > 5;
  
  const itinerariesText = itinerariesTextArr.length > 0 
    ? itinerariesTextArr.join(', ') 
    // Fallback to top level dests if itinerary titles are empty
    : (item?.destinations ? item.destinations.split(',').join(', ') : pkg?.DestinationPlaces || "");

  // Map API Inclusions directly
  const inclusionsArr = getIncludedTypes(pkg);
  // Add hardcoded Manager for SOTC vibe if there's space
  if (inclusionsArr.length < 4) {
    inclusionsArr.push({ key: "manager", label: "Manager" });
  }

  return {
    id: item?.id,
    image: pkg?.ImgThumbnail || includedHotel?.MainImg || "",
    title: pkg?.Name || "Package",
    isWishlisted: false,
    recommended: !!item?.isFeatured || true, // Force true to match Recommended badge in reference
    nightsDays: nightsLabel,
    nightsVal: nightsVal,
    daysVal: daysVal,
    destination,
    countries,
    rating: includedHotel?.Star && includedHotel?.Star !== ".00" ? Number(includedHotel.Star) : 4.3,
    reviewsLabel: "(953)",
    price: null,
    bookingValidUntil: item?.bookingValidUntil || pkg?.BookingValidUntill || "",
    packageValidFrom: item?.pkgValidFrom || pkg?.Validity?.From || "",
    packageValidTo: item?.pkgValidTo || pkg?.Validity?.To || "",
    minPax: item?.minPax || pkg?.AllowMinPax || "",
    source: pkg?.Source?.Value || "",
    supplier: pkg?.Supplier?.SupplierName || "",
    hotelName,
    hotelRoom,
    mealPlan,
    routeSummary: `${nightsLabel ? nightsLabel.split('/')[0] + ' ' : ''}${routeSummary}`,
    pricing: {
      oldPrice: null,
      price: priceDoubleOcc || (item?.minPrice ? `₹${item.minPrice.toLocaleString('en-IN')} ` : null),
      discountLabel: item?.isFeatured ? "Featured" : "",
      note: "Per Person (Double Occupency)",
    },
    pointsBanner: {
      badgeText: "SOTC",
      label: "Earn 500 Loyal Points",
    },
    inclusions: inclusionsArr,
    itinerariesTitle: "itineraries",
    itinerariesText: itinerariesText,
    itinerariesHoverText: itinerariesHoverText,
    showMoreItineraries: showMoreItineraries,
    exclusionsText: "",
    bookingTerms: "",
    conditions: "",
    ctaLabel: "View Details",
  };
}

export default function PackagesCarousel({
  title = "Popular Packages",
  items = [],
  theme,
  className = "",
  cardClassName = "rounded-[24px]", // use 24px per sotc reference
}) {
  const t = { ...defaultTheme, ...(theme || {}) };
  const uid = useId();
  const rowRef = useRef(null);

  const mappedItems = useMemo(() => {
    return Array.isArray(items) ? items.map(mapPackageData) : [];
  }, [items]);

  const canScroll = mappedItems.length > 0;

  const scrollByCards = (dir = 1) => {
    if (!rowRef.current) return;
    const el = rowRef.current;
    const firstCard = el.querySelector(".snap-start");
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  const sizes = useMemo(
    () => ({
      cardW: "w-[calc(86%+40px)] sm:w-[calc(50%+40px)] md:w-[calc(45%+40px)] lg:w-[calc(32%+40px)] xl:w-[calc(28%+40px)] 2xl:w-[calc(26%+40px)]", // slimmer cards like SOTC + 40px
      cardH: "h-[460px] sm:h-[480px]", // height appropriate for portrait cards
    }),
    []
  );

  return (
    <section className={`w-full ${className}`}>
      {(title || canScroll) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">{title}</h2>
          ) : (
            <div />
          )}

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              className="h-10 w-10 rounded-full bg-white shadow ring-1 ring-black/10 grid place-items-center hover:bg-slate-50 transition-colors pointer-events-auto"
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              className="h-10 w-10 rounded-full bg-white shadow ring-1 ring-black/10 grid place-items-center hover:bg-slate-50 transition-colors pointer-events-auto"
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="relative pointer-events-auto">
        <div
          ref={rowRef}
          className="
            flex gap-5 overflow-x-auto pb-6 pt-2 px-1
            snap-x snap-mandatory scroll-smooth
            [-ms-overflow-style:none] [scrollbar-width:none]
          "
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label={`packages-carousel-${uid}`}
        >
          <style>{`
            [aria-label="packages-carousel-${uid}"]::-webkit-scrollbar { display: none; }
          `}</style>

          {mappedItems.map((item) => (
            <div key={item.id} className={`snap-start shrink-0 ${sizes.cardW}`}>
              <PackageCard item={item} sizes={sizes} cardClassName={cardClassName} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackageCard({ item, sizes, cardClassName }) {
  // Define greenish blue gradient for buttons and badges
  const gradientBtn = "linear-gradient(90deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)";

  return (
    <div
      className={`group relative overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ring-1 ring-black/5 cursor-pointer select-none bg-slate-900 ${sizes.cardH} ${cardClassName}`}
      onClick={() => (window.location.href = `/packages/${item.id}`)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${item.image})` }}
      />

      {/* Default Overlay (Bottom gradient) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
      
      {/* Hover Overlay (Darker full cover) */}
      <div className="absolute inset-0 bg-black/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

      {/* TOP RIGHT: Heart Icon Only */}
      <div className="absolute right-4 top-4 z-40 flex items-center gap-3">
        <button 
          type="button" 
          className="text-white hover:text-[#39C6D8] transition-colors drop-shadow-md z-50 pointer-events-auto" 
          aria-label="Wishlist"
          onClick={(e) => { e.stopPropagation(); /* toggle wishlist logic */ }}
        >
          <HeartIcon filled={!!item.isWishlisted} />
        </button>
      </div>

      {/* HOVER STATE: TOP LEFT Box */}
      <div className="absolute left-4 top-4 z-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none flex items-center gap-2">
        <div className="bg-white text-slate-800 flex flex-col items-center justify-center font-black px-3 py-1.5 rounded-md min-w-[60px]">
           <div className="text-[16px] leading-none mb-0.5 text-[#23A8CC]">
              {item.nightsVal}
           </div>
           <div className="text-[10px] leading-none text-slate-500 uppercase tracking-wide">
              Nights
           </div>
           <div className="h-px bg-slate-200 w-full my-1"></div>
           <div className="text-[16px] leading-none mb-0.5 text-[#23A8CC]">
              {item.daysVal}
           </div>
           <div className="text-[10px] leading-none text-slate-500 uppercase tracking-wide">
              Days
           </div>
        </div>
        <div className="text-white text-[14px] font-bold leading-tight ml-1">
          Book Now<br/>For Best Deals
        </div>
      </div>

      {/* DEFAULT STATE: BOTTOM CONTENT */}
      <div className="absolute inset-x-5 bottom-6 z-20 flex flex-col justify-end transition-all duration-300 ease-in-out transform group-hover:opacity-0 group-hover:translate-y-4">
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
          {item.recommended && (
            <div 
                className="inline-flex items-center gap-1.5 text-white px-2.5 py-1 rounded-md text-[13px] font-semibold tracking-wide shadow-sm"
                style={{ background: gradientBtn }}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32a1.505 1.505 0 00-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              Recommended
            </div>
          )}
          {item.nightsDays && (
            <div className="inline-flex items-center px-2 py-1 rounded-md text-[13px] font-bold tracking-wide border-[1.5px] border-white/60 bg-white/10 text-white backdrop-blur-sm">
              {item.nightsDays}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white text-[22px] font-extrabold leading-tight drop-shadow-lg mb-1 line-clamp-2">
          {item.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <div className="text-white text-[28px] font-black drop-shadow-md tracking-tight">
            {item.pricing?.price || "Price on Request"}
          </div>
        </div>
        
        {/* Subtext */}
        <div className="text-white/95 text-[15px] font-medium drop-shadow-sm mb-3">
          {item.pricing?.note || "Starting price per adult"}
        </div>
      </div>

      {/* HOVER STATE: OVERLAY CONTENT */}
      <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 pt-[95px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 pointer-events-none">
        
        <div>
          <div className="h-px bg-white/20 w-full mb-5" />
          
          {/* Icons Grid */}
          <div className="flex justify-between items-start px-0 text-white">
            {item.inclusions?.slice(0, 4).map((incObj, idx) => {
              // Map custom icon for 'manager' if needed
              const isManager = incObj?.key === 'manager';
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 flex items-center justify-center text-[#39C6D8]">
                    {isManager ? (
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M16 11l4-4"></path>
                      </svg>
                    ) : (
                      <IncludedIconSvg type={incObj?.key} />
                    )}
                  </div>
                  <span className="text-[12px] font-semibold tracking-wide text-center leading-tight">
                    {incObj?.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-5 h-px bg-white/20 w-full" />

          {/* Itineraries Text */}
          <div className="mt-5 text-white">
            <h4 className="text-[20px] font-medium tracking-tight mb-2 text-[#39C6D8]">{item.itinerariesTitle || "itineraries"}</h4>
            <div className="text-[14px] font-medium text-white/90 leading-snug space-y-1 max-h-[150px] overflow-hidden">
                {item.itinerariesHoverText?.split('\n').map((itLine, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#39C6D8] shrink-0 font-bold">•</span>
                        <span className="break-words">{itLine.trim()}</span>
                    </div>
                ))}
                {item.showMoreItineraries && (
                    <div className="flex items-start gap-2">
                        <span className="text-[#39C6D8] shrink-0 font-bold">•</span>
                        <span className="italic text-white/70">more ...</span>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-auto pointer-events-auto">
          <button
            className="w-full py-3.5 rounded-xl font-bold text-white text-[16px] shadow-lg active:scale-[0.98] transition-all"
            style={{ background: gradientBtn }}
            type="button"
            onClick={(e) => { e.stopPropagation(); window.location.href = `/packages/${item.id}`; }}
          >
            {item.ctaLabel || "View Details"}
          </button>
        </div>
      </div>
    </div>
  );
}