import React, { useId, useMemo, useRef, useState } from "react";

function StarIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 17.3l-6.2 3.6 1.7-7-5.5-4.8 7.2-.6L12 2l2.8 6.5 7.2.6-5.5 4.8 1.7 7z" />
        </svg>
    );
}

function parseND(nightsDays = "") {
    const n = nightsDays.match(/(\d+)\s*Night/i)?.[1];
    const d = nightsDays.match(/(\d+)\s*Day/i)?.[1];
    if (n && d) return `${n}N/${d}D`;
    return nightsDays;
}

function ImageSlider({ item }) {
    const slides = useMemo(() => {
        const thumbs = Array.isArray(item?.gallery?.thumbs) ? item.gallery.thumbs : [];
        const hero = item?.gallery?.hero ? [item.gallery.hero] : [];
        const uniq = [...hero, ...thumbs].filter(Boolean);
        return uniq.length
            ? uniq
            : ["https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80"];
    }, [item]);

    const [idx, setIdx] = useState(0);
    const next = () => setIdx((p) => (p + 1) % slides.length);

    return (
        <div className="relative h-[220px] w-full overflow-hidden rounded-2xl">
            <img
                src={slides[idx]}
                alt={item?.title || "package"}
                className="h-full w-full object-cover"
                loading="lazy"
            />

            {slides.length > 1 && (
                <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 shadow ring-1 ring-black/10 grid place-items-center hover:bg-white"
                    aria-label="Next image"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 6l6 6-6 6" />
                    </svg>
                </button>
            )}

            {slides.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {slides.slice(0, 8).map((_, i) => (
                        <span
                            key={i}
                            className={[
                                "h-1.5 rounded-full bg-white/80 transition-all",
                                i === idx ? "w-6" : "w-1.5 opacity-70",
                            ].join(" ")}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function PackageCardSOTC({ item }) {
   const gradientBtn =
  "linear-gradient(90deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)";

    return (
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5 p-4">
            <ImageSlider item={item} />

            {/* top info row */}
            <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm text-slate-600">
                    {item?.nightsDays ? parseND(item.nightsDays).replace("/", " days & ") : ""}
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <StarIcon />
                        {item?.rating?.toFixed ? item.rating.toFixed(1) : item?.rating}
                    </span>
                    <span className="text-slate-500">{item?.reviewsLabel || ""}</span>
                </div>
            </div>

            {/* title */}
            <div className="mt-1 text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2">
                {item?.title}
            </div>

            {/* route pill */}
            {item?.routeSummary && (
                <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-slate-700">
                    {item.routeSummary}
                </div>
            )}

            {/* pricing */}
            <div className="mt-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                    {item?.pricing?.oldPrice && (
                        <div className="text-xs text-slate-500 line-through">{item.pricing.oldPrice}</div>
                    )}
                    <div className="flex items-baseline gap-2">
                        <div className="text-xl font-extrabold text-slate-900">{item?.pricing?.price}</div>
                        <div className="text-xs text-slate-500">/Adult</div>
                    </div>
                    {item?.pricing?.note && (
                        <div className="mt-1 text-xs text-slate-500">{item.pricing.note}</div>
                    )}
                </div>

                {item?.pricing?.discountLabel && (
                    <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {item.pricing.discountLabel}
                    </span>
                )}
            </div>

            {/* ✅ two buttons (no phone) */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    className="h-12 rounded-xl font-semibold text-white shadow"
                    style={{ background: "linear-gradient(90deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)" }}
                    onClick={() => (window.location.href = `/packages/${item.id}`)}
                >
                    {item?.ctaLabel || "View Details"}
                </button>

                <button
                    type="button"
                    className="h-12 rounded-xl font-semibold text-white shadow"
                    style={{ background: gradientBtn }}
                    onClick={() => {
                        const phone = "919540111307"; // without +
                        const message = item?.preString || "Hi, I want to enquire about this tour package.";
                        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                        window.open(url, "_blank");
                    }}
                >
                    Enquire Now
                </button>

            </div>
        </div>
    );
}

export default function PackagesSectionGrid({
    title = "Europe",
    items = [],
    onViewAll,
}) {
    const uid = useId();
    const rowRef = useRef(null);

    const sizes = useMemo(
        () => ({
            // ✅ desktop: 3 cards in container width
            cardW: "w-[90%] sm:w-[70%] md:w-[58%] lg:w-[32%] xl:w-[31%] 2xl:w-[30%]",
        }),
        []
    );

    const scrollByCards = (dir = 1) => {
        if (!rowRef.current) return;
        const el = rowRef.current;
        const firstCard = el.querySelector('[data-card="pkg"]');
        const gap = 24; // gap-6
        const cardWidth = firstCard ? firstCard.offsetWidth + gap : 360;
        el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
    };

    return (
        // ✅ white background + website container width (video bg hide)
        <section className="w-full bg-white py-8 relative z-10">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">{title}</h2>

                    <button
                        type="button"
                        onClick={onViewAll || (() => { })}
                        className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700"
                    >
                        View All
                        <span className="h-7 w-7 rounded-full bg-[#02b8fa] text-white grid place-items-center">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </span>
                    </button>
                </div>


                {/* carousel */}
                <div className="relative">
                    {items.length > 3 && (
                        <button
                            type="button"
                            onClick={() => scrollByCards(-1)}
                            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white shadow ring-1 ring-black/10 grid place-items-center hover:bg-white"
                            aria-label="Scroll left"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                    )}

                    {items.length > 3 && (
                        <button
                            type="button"
                            onClick={() => scrollByCards(1)}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white shadow ring-1 ring-black/10 grid place-items-center hover:bg-white"
                            aria-label="Scroll right"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </button>
                    )}

                    <div
                        ref={rowRef}
                        aria-label={`packages-row-${uid}`}
                        className="
              flex gap-6 overflow-x-auto py-2
              snap-x snap-mandatory scroll-smooth
              [-ms-overflow-style:none] [scrollbar-width:none]
            "
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        <style>{`
              [aria-label="packages-row-${uid}"]::-webkit-scrollbar { display: none; }
              @media (min-width: 1024px) {
                [aria-label="packages-row-${uid}"] { justify-content: center; }
              }
            `}</style>

                        {items.map((item) => (
                            <div key={item.id} data-card="pkg" className={`snap-center shrink-0 ${sizes.cardW}`}>
                                <PackageCardSOTC item={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
