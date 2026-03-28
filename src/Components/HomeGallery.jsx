import { useEffect, useMemo, useRef, useState } from "react";

const PHOTOS = [
  { id: 1, src: "/iccictimages/ic1.jpg", title: "ICCICT" },
  { id: 2, src: "/iccictimages/ic2.jpg", title: "ICCICT" },
  { id: 7, src: "/iccictimages/ic3.jpg", title: "ICCICT" },
  { id: 8, src: "/iccictimages/ic4.jpg", title: "ICCICT" },
  { id: 12, src: "/iccictimages/ic5.JPG", title: "ICCICT" },
  { id: 13, src: "/iccictimages/ic6.JPG", title: "ICCICT" },
  { id: 17, src: "/iccictimages/ic7.jpg", title: "ICCICT" },
  { id: 18, src: "/iccictimages/ic8.jpg", title: "ICCICT" },
  { id: 22, src: "/iccictimages/ic9.JPG", title: "ICCICT" },
  { id: 23, src: "/iccictimages/ic10.JPG", title: "ICCICT" },
  { id: 27, src: "/iccictimages/ic11.JPG", title: "ICCICT" },
  { id: 28, src: "/iccictimages/ic12.JPG", title: "ICCICT" },

  { id: 3, src: "/gallery/2.JPG", title: "IBIEA" },
  { id: 4, src: "/gallery/1.JPG", title: "IBIEA" },
  { id: 10, src: "/gallery/3.JPG", title: "IBIEA" },
  { id: 11, src: "/gallery/4.JPG", title: "IBIEA" },
  { id: 19, src: "/gallery/10.JPG", title: "IBIEA" },
  { id: 20, src: "/gallery/8.JPG", title: "IBIEA" },
  { id: 24, src: "/gallery/9.JPG", title: "IBIEA" },
  { id: 25, src: "/gallery/11.JPG", title: "IBIEA" },

  { id: 5, src: "/coursera/7.jpg", title: "Coursera Offsite" },
  { id: 6, src: "/coursera/8.jpg", title: "Coursera Offsite" },
  { id: 9, src: "/coursera/9.jpg", title: "Coursera Offsite" },
  { id: 16, src: "/coursera/10.jpg", title: "Coursera Offsite" },
  { id: 21, src: "/coursera/11.jpg", title: "Coursera Offsite" },
  { id: 26, src: "/coursera/12.jpg", title: "Coursera Offsite" },
];

const AUTO_DELAY = 3000;
const TRANSITION_MS = 900;

function GalleryCard({ photo, cardWidth, cardHeight, activeLevel, isMobile }) {
  const [loaded, setLoaded] = useState(false);

  const getTransform = () => {
    if (activeLevel === 0) return "scale(1)";
    if (activeLevel === 1) return "scale(0.88)";
    if (activeLevel === 2) return "scale(0.78)";
    return "scale(0.7)";
  };

  const getOpacity = () => {
    if (activeLevel === 0) return 1;
    if (activeLevel === 1) return 0.78;
    if (activeLevel === 2) return 0.52;
    return 0.3;
  };

  const getBrightness = () => {
    if (activeLevel === 0) return "brightness(1)";
    if (activeLevel === 1) return "brightness(0.65)";
    if (activeLevel === 2) return "brightness(0.5)";
    return "brightness(0.4)";
  };

  return (
    <div
      style={{
        flex: "0 0 auto",
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        borderRadius: isMobile ? "22px" : "28px",
        overflow: "hidden",
        position: "relative",
        background: "#111",
        transition:
          "transform 850ms cubic-bezier(0.22,1,0.36,1), opacity 850ms ease, filter 850ms ease, box-shadow 850ms ease, border 850ms ease",
        transform: getTransform(),
        opacity: getOpacity(),
        filter: getBrightness(),
        boxShadow:
          activeLevel === 0
            ? "0 18px 40px rgba(0,0,0,0.22)"
            : "0 8px 22px rgba(0,0,0,0.14)",
        border:
          activeLevel === 0
            ? "3px solid rgba(255,255,255,0.35)"
            : "3px solid transparent",
      }}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.08)",
            zIndex: 1,
          }}
        />
      )}

      <img
        src={photo.src}
        alt={photo.title}
        onLoad={() => setLoaded(true)}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          userSelect: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            activeLevel === 0
              ? "linear-gradient(to top, rgba(0,0,0,0.34), rgba(0,0,0,0.04) 45%)"
              : "linear-gradient(to top, rgba(0,0,0,0.52), rgba(0,0,0,0.14) 45%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: isMobile ? "16px" : "20px",
          bottom: isMobile ? "16px" : "18px",
          color: "#fff",
          fontWeight: 800,
          fontSize:
            activeLevel === 0
              ? isMobile
                ? "20px"
                : "20px"
              : isMobile
              ? "14px"
              : "16px",
          letterSpacing: "-0.02em",
          textShadow: "0 2px 10px rgba(0,0,0,0.35)",
          transition: "font-size 850ms ease",
        }}
      >
        {photo.title}
      </div>

      {activeLevel === 0 && (
        <div
          style={{
            position: "absolute",
            top: isMobile ? "14px" : "18px",
            right: isMobile ? "14px" : "18px",
            background: "rgba(140,140,140,0.75)",
            border: "1px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            borderRadius: "999px",
            padding: isMobile ? "7px 12px" : "8px 14px",
            fontSize: isMobile ? "11px" : "12px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ✦ Now
        </div>
      )}
    </div>
  );
}

export default function MiceGallerySection() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const touchStartX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardWidth = isMobile ? Math.min(window.innerWidth * 0.72, 360) : 420;
  const cardHeight = isMobile ? 290 : 330;
  const gap = isMobile ? 14 : 22;
  const step = cardWidth + gap;

  const TRACK = useMemo(() => [...PHOTOS, ...PHOTOS, ...PHOTOS], []);
  const total = PHOTOS.length;

  const goNext = () => {
    setActive((prev) => prev + 1);
  };

  const goPrev = () => {
    setActive((prev) => prev - 1);
  };

  useEffect(() => {
    if (isHovered || isTouching) return;

    const timer = setInterval(() => {
      goNext();
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, [isHovered, isTouching]);

  useEffect(() => {
    if (active >= total * 2) {
      setAnimate(false);
      setActive(total);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    }

    if (active < total) {
      setAnimate(false);
      setActive(total + active);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    }
  }, [active, total]);

  useEffect(() => {
    setActive(total);
  }, [total]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsTouching(true);
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    if (diff > 40) goNext();
    else if (diff < -40) goPrev();

    setTimeout(() => {
      setIsTouching(false);
    }, 500);
  };

  const getActiveLevel = (index) => {
    const diff = Math.abs(index - active);
    if (diff === 0) return 0;
    if (diff === 1) return 1;
    if (diff === 2) return 2;
    return 3;
  };

  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1440;
  const centerOffset = viewportWidth / 2 - cardWidth / 2;
  const translateX = centerOffset - active * step;
  const currentActive = ((active % total) + total) % total;

  return (
    <section
      style={{
        minHeight: isMobile ? "auto" : "100vh",
        background: "#16b8c9",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        overflow: "hidden",
        position: "relative",
        paddingTop: isMobile ? "28px" : "30px",
        paddingBottom: isMobile ? "28px" : "36px",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        .gallery-arrow:hover {
          background: rgba(255,255,255,0.24) !important;
        }
      `}</style>

      <header
        style={{
          textAlign: "center",
          paddingTop: isMobile ? "8px" : "24px",
          paddingBottom: isMobile ? "10px" : "22px",
          userSelect: "none",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2.2rem, 6vw, 4.6rem)",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 1.04,
          }}
        >
          MICE by Traveon
        </h1>

        <p
          style={{
            marginTop: "14px",
            marginBottom: 0,
            color: "rgba(255,255,255,0.72)",
            fontSize: "clamp(12px, 1.5vw, 16px)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            lineHeight: 1.5,
            paddingInline: "16px",
          }}
        >
          Meetings · Incentives · Conferences · Exhibitions
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "18px",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            borderRadius: "999px",
            padding: "7px 16px",
            border: "1px solid rgba(255,255,255,0.22)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#fff",
              display: "inline-block",
            }}
          />
          <span
            style={{
              color: "#fff",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            MICE
          </span>
        </div>
      </header>

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "300px" : "430px",
          marginTop: isMobile ? "16px" : "18px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: isMobile ? "70px" : "180px",
            zIndex: 6,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, rgba(22,184,201,1) 0%, rgba(22,184,201,0.82) 36%, rgba(22,184,201,0) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: isMobile ? "70px" : "180px",
            zIndex: 6,
            pointerEvents: "none",
            background:
              "linear-gradient(270deg, rgba(22,184,201,1) 0%, rgba(22,184,201,0.82) 36%, rgba(22,184,201,0) 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${gap}px`,
            transform: `translateX(${translateX}px)`,
            transition: animate
              ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1)`
              : "none",
            willChange: "transform",
            height: "100%",
          }}
        >
          {TRACK.map((photo, index) => (
            <GalleryCard
              key={`${photo.id}-${index}`}
              photo={photo}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              activeLevel={getActiveLevel(index)}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "9px",
          marginTop: isMobile ? "10px" : "8px",
          paddingBottom: isMobile ? "0px" : "10px",
          flexWrap: "wrap",
          paddingInline: "18px",
        }}
      >
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const diff = i - currentActive;
              setActive((prev) => prev + diff);
            }}
            style={{
              width: currentActive === i ? "28px" : "8px",
              height: "8px",
              borderRadius: "999px",
              border: "none",
              background: currentActive === i ? "#fff" : "rgba(255,255,255,0.45)",
              transition: "all 0.35s ease",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      {!isMobile && (
        <>
          <button
            className="gallery-arrow"
            onClick={goPrev}
            style={{
              position: "absolute",
              left: "18px",
              top: "58%",
              transform: "translateY(-50%)",
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              zIndex: 20,
              transition: "0.25s ease",
            }}
          >
            ‹
          </button>

          <button
            className="gallery-arrow"
            onClick={goNext}
            style={{
              position: "absolute",
              right: "18px",
              top: "58%",
              transform: "translateY(-50%)",
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              zIndex: 20,
              transition: "0.25s ease",
            }}
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}