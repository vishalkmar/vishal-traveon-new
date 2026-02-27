import React, { useId, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PackagesCarousel.jsx (React + Tailwind)
 * - Reusable scroll-snap carousel with arrows
 * - Card hover overlay like SOTC
 * - Fully responsive
 */

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
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
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

export default function PackagesCarousel({
  title,
  items = [],
  theme,
  className = "",
  cardClassName = "",
}) {
  const t = { ...defaultTheme, ...(theme || {}) };
  const uid = useId();
  const rowRef = useRef(null);
  const navigate = useNavigate();
  console.log("items in carousel ", items);


  const canScroll = items && items.length > 0;

  const scrollByCards = (dir = 1) => {
    if (!rowRef.current) return;
    const el = rowRef.current;
    const firstCard = el.querySelector('.snap-start');
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 300; // 16 for gap
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  const sizes = useMemo(
    () => ({
      // responsive widths
      cardW: "w-[86%] sm:w-[60%] md:w-[62%] lg:w-[48%] xl:w-[32%] 2xl:w-[32%]",
      cardH: "h-[450px]",
    }),
    []
  );

  return (
    <section className={`w-full ${className}`}>
      {(title || canScroll) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h2>
          ) : (
            <div />
          )}

          {/* arrows (hide on mobile if you want) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              className="h-10 w-10 rounded-full bg-white/90 shadow ring-1 ring-black/10 grid place-items-center hover:bg-white"
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              className="h-10 w-10 rounded-full bg-white/90 shadow ring-1 ring-black/10 grid place-items-center hover:bg-white"
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        {/* carousel row */}
        <div
          ref={rowRef}
          className="
            flex gap-4 overflow-x-auto pb-2
            snap-x snap-mandatory scroll-smooth
            [-ms-overflow-style:none] [scrollbar-width:none]
          "
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label={`packages-carousel-${uid}`}
        >
          {/* hide scrollbar (webkit) */}
          <style>{`
            [aria-label="packages-carousel-${uid}"]::-webkit-scrollbar { display: none; }
          `}</style>

          {items.map((item) => (
            <div key={item.id} className={`snap-start shrink-0 ${sizes.cardW}`}>
              <PackageCard item={item} t={t} sizes={sizes} cardClassName={cardClassName} />
            </div>
          ))}
        </div>

        {/* mobile arrows overlay */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow ring-1 ring-black/10 grid place-items-center"
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow ring-1 ring-black/10 grid place-items-center"
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function PackageCard({ item, t, sizes, cardClassName }) {
  // const {
  //   id,
  //   image,
  //   title,
  //   recommended,
  //   durationLabel,
  //   rating,
  //   reviewsCountLabel,
  //   price,
  //   oldPrice,
  //   discountLabel,
  //   routeSummary,
  //   pointsBanner,
  //   includes,
  //   itinerariesTitle,
  //   itinerariesText,
  //   ctaLabel,
  
  //   isWishlisted,
  //   onWishlistToggle,
  // } = item;

  return (
    <div
      className={[
        "group relative overflow-hidden shadow-lg ring-1 ring-black/10",
        t.cardRadius,
        sizes.cardH,
        cardClassName,
      ].join(" ")}
    >
      {/* bg image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.gallery?.hero})` }}
      />
      {/* base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* top right: rating + heart (always visible) */}
      <div className="absolute right-3 top-3 z-40 flex items-center gap-3">
        {(item.rating != null || item.reviewsLabel) && (
          <div className="flex items-center gap-1 text-white/95">
            <span className="text-sm font-semibold">
              {item.rating?.toFixed ? item.rating.toFixed(1) : item.rating}
            </span>
            <span className="text-yellow-300">
              <StarIcon />
            </span>
            <span className="text-sm opacity-90">{item.reviewsLabel}</span>
          </div>
        )}

        <button
          type="button"
          className="text-white/95 hover:text-white"
          aria-label="Wishlist"
        >
          <HeartIcon filled={!!item.isWishlisted} />
        </button>
      </div>

      {/* recommended badge (hide on hover) */}
      <div className="absolute left-4 top-44 sm:top-48 md:top-52 z-40 flex items-center gap-2 transition-opacity duration-300 group-hover:opacity-0">
        {item.recommended && (
          <span
            className={`inline-flex items-center gap-2 ${t.chipText} px-3 py-1 rounded-lg text-xs font-semibold`}
            style={{ background: "linear-gradient(90deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)" }}
          >
            <span className="inline-block h-4 w-4 rounded bg-white/15 grid place-items-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21V8a3 3 0 013-3h0a3 3 0 013 3v13" />
                <path d="M6 21h12" />
              </svg>
            </span>
            Recommended
          </span>
        )}

        {item.nightsDays && (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white/20 text-white backdrop-blur">
            {item.nightsDays.replace("Nights", "N").replace("Days", "D")}
          </span>
        )}
      </div>

      {/* ===================== DEFAULT VIEW (HIDE ON HOVER) ===================== */}
      <div className="absolute inset-x-4 bottom-4 z-20 text-white opacity-100 transition-all duration-300 ease-out group-hover:opacity-0 group-hover:translate-y-2 pointer-events-auto group-hover:pointer-events-none">
        {/* title */}
        <h3 className="text-lg sm:text-xl font-extrabold leading-tight drop-shadow">
          {item.title}
        </h3>

        {/* prices row */}
        <div className="mt-2 flex items-end gap-3">
          {item.pricing?.oldPrice && (
            <span className="text-sm text-white/70 line-through">
              {item.pricing.oldPrice}
            </span>
          )}
          {item.pricing?.price && (
            <span className="text-2xl font-extrabold tracking-tight">
              {item.pricing.price}
            </span>
          )}
          {item.pricing?.discountLabel && (
            <span className="ml-auto inline-flex items-center rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-300/30">
              {item.pricing.discountLabel}
            </span>
          )}
        </div>

        {/* note */}
        {item.pricing?.note && (
          <div className="mt-1 text-sm text-white/85">
            {item.pricing.note}
          </div>
        )}

        <div className="mt-3 h-px bg-white/20" />

        {/* route summary */}
        {item.routeSummary && (
          <div className="mt-2 text-sm text-white/85 line-clamp-1">
            {item.routeSummary}
          </div>
        )}

        {/* CTA button for touch devices (hidden on hover-capable devices) */}
        <div className="mt-4">
          <style>{`
            @media (hover: hover) {
              .touch-cta-btn { display: none; }
            }
          `}</style>
          <button
            className="touch-cta-btn w-full py-3 rounded-xl font-semibold shadow text-white"
            style={{background: "linear-gradient(90deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)"}}
            type="button"
            onClick={() => (window.location.href = `/packages/${item.id}`)}
          >
            {item.ctaLabel || "View Details"}
          </button>
        </div>
      </div>

      {/* ===================== HOVER OVERLAY (ONLY ON HOVER) ===================== */}
      <div className="absolute inset-0 z-30 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 pointer-events-none">
        {/* black transparent shield */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

        <div className="relative h-full w-full p-5 sm:p-6 flex flex-col text-white pointer-events-auto">
          {/* points banner */}
          {(item.pointsBanner?.label || item.pointsBanner?.badgeText) && (
            <div className="flex items-start gap-3">
              {item.pointsBanner?.badgeText && (
                <div className="shrink-0 rounded-md bg-white/10 px-3 py-2 text-xs font-bold text-white">
                  {item.pointsBanner.badgeText}
                </div>
              )}
              {/* {item.pointsBanner?.label && (
                <div className="text-white">
                  <div className="text-sm font-semibold">{item.pointsBanner.label}</div>
                </div>
              )} */}
            </div>
          )}

          <div className="mt-4 h-px bg-white/20" />

          {/* includes icons */}
          {Array.isArray(item.inclusions) && item.inclusions.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-4 text-white/90">
              {item.inclusions.slice(0, 8).map((incObj, idx) => {
                const type =
                  typeof incObj === "string"
                    ? incObj
                    : incObj.key || (incObj.label && incObj.label.toLowerCase());
                const label =
                  typeof incObj === "string" ? incObj : incObj.label || incObj.key;

                return (
                  <div key={type || idx} className="flex flex-col items-center gap-2 text-xs">
                    <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center">
                      <IncludedIconSvg type={type} />
                    </div>
                    <span className="capitalize">{label}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 h-px bg-white/20" />

          {/* itineraries */}
          <div className="mt-4">
            <div className="text-lg font-extrabold text-white">
              {item.itinerariesTitle || "Itineraries"}
            </div>
            <div className="mt-2 text-white/85 text-sm leading-relaxed line-clamp-3">
              {item.itinerariesText || item.routeSummary}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-5">
            <style>{`
              @media (hover: hover) {
                .hover-cta-btn { pointer-events: auto; }
              }
              @media (hover: none) {
                .hover-cta-btn { display: none; }
              }
            `}</style>
            <button
              style={{background: "linear-gradient(90deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)"}}
              type="button"
              onClick={() => (window.location.href = `/packages/${item.id}`)}
              className="hover-cta-btn w-full py-3 rounded-xl font-semibold shadow text-white"
            >
              {item.ctaLabel || "View Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
