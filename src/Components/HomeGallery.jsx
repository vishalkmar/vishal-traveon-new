import { useEffect, useRef, useState, useCallback } from "react";

// const PHOTOS = [
//   { id: 1,  src: "https://picsum.photos/seed/mice1/800/500",  title: "Silent Paths",    loc: "Iceland"     },
//   { id: 2,  src: "https://picsum.photos/seed/mice2/800/500",  title: "Blue Horizons",   loc: "Maldives"    },
//   { id: 3,  src: "https://picsum.photos/seed/mice3/800/500",  title: "Urban Drift",     loc: "Tokyo"       },
//   { id: 4,  src: "https://picsum.photos/seed/mice4/800/500",  title: "Golden Hour",     loc: "Santorini"   },
//   { id: 5,  src: "https://picsum.photos/seed/mice5/800/500",  title: "Wild & Free",     loc: "Patagonia"   },
//   { id: 6,  src: "https://picsum.photos/seed/mice6/800/500",  title: "Into The Mist",   loc: "Norway"      },
//   { id: 7,  src: "https://picsum.photos/seed/mice7/800/500",  title: "Desert Dreams",   loc: "Sahara"      },
//   { id: 8,  src: "https://picsum.photos/seed/mice8/800/500",  title: "Neon Pulse",      loc: "Hong Kong"   },
//   { id: 9,  src: "https://picsum.photos/seed/mice9/800/500",  title: "Serene Waters",   loc: "Bali"        },
//   { id: 10, src: "https://picsum.photos/seed/mice10/800/500", title: "Alpine Glow",     loc: "Switzerland" },
// ];


const PHOTOS = [
    // ICCICT
    { id: 1, src: "/iccictimages/ic1.jpg", title: "ICCICT",  },
    { id: 2, src: "/iccictimages/ic2.jpg", title: "ICCICT",  },
    { id: 7, src: "/iccictimages/ic3.jpg",  title: "ICCICT",  },
    { id: 8, src: "/iccictimages/ic4.jpg",  title: "ICCICT", },
    {id: 12, src: "/iccictimages/ic5.JPG",  title: "ICCICT",  },
    {id: 13, src: "/iccictimages/ic6.JPG",  title: "ICCICT",  },
    {id: 17, src: "/iccictimages/ic7.jpg",  title: "ICCICT",  },
    {id: 18, src: "/iccictimages/ic8.jpg",  title: "ICCICT",  },
    {id: 22, src: "/iccictimages/ic9.JPG",  title: "ICCICT",  },
    {id: 23, src: "/iccictimages/ic10.JPG", title: "ICCICT",  },
    {id: 27, src: "/iccictimages/ic11.JPG",  title: "ICCICT",  },
    {id: 28, src: "/iccictimages/ic12.JPG",  title: "ICCICT",  },

    // IBIEA
    {id: 3, src: "/gallery/2.JPG",  title: "IBIEA",  },
    {id: 4, src: "/gallery/1.JPG",  title: "IBIEA",  },
    {id: 10, src: "/gallery/3.JPG",  title: "IBIEA",  },
    {id: 11, src: "/gallery/4.JPG",  title: "IBIEA",  },
    // {id: 14, src: "/gallery/6.JPG", title: "IBIEA",  },
    // {id: 15, src: "/gallery/7.JPG", title: "IBIEA",  },
    {id: 19, src: "/gallery/10.JPG",  title: "IBIEA",  },
    {id: 20, src: "/gallery/8.JPG",  title: "IBIEA",  },
    {id: 24, src: "/gallery/9.JPG", title: "IBIEA",  },
    {id: 25, src: "/gallery/11.JPG",  title: "IBIEA",  },

    // Coursera Offsite
    {id: 5, src: "/coursera/7.jpg",  title: "Coursera Offsite",  },
    {id: 6, src: "/coursera/8.jpg",  title: "Coursera Offsite",  },
    {id: 9, src: "/coursera/9.jpg",  title: "Coursera Offsite",  },
    {id: 16, src: "/coursera/10.jpg",  title: "Coursera Offsite",  },
    {id: 21, src: "/coursera/11.jpg",  title: "Coursera Offsite",  },
    {id: 26, src: "/coursera/12.jpg", title: "Coursera Offsite",  },

  ];

const N = PHOTOS.length;
const CARD_W = 400;
const GAP = 20;
const CARD_TOTAL = CARD_W + GAP;
const SPEED_PX_PER_FRAME = CARD_TOTAL / (0.3 * 60);

const TRACK = [...PHOTOS, ...PHOTOS, ...PHOTOS];

function SlideCard({ photo, active }) {

const [isPortrait, setIsPortrait] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
   

<div
  style={{
    flexShrink: 0,
    width: CARD_W + "px",
    height: active ? "340px" : "270px",
    marginRight: GAP + "px",
    borderRadius: "20px",
    overflow: "hidden",
    position: "relative",
    transition: "height 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s",
    boxShadow: active
      ? "0 20px 60px rgba(0,0,0,0.45), 0 0 0 3px rgba(255,255,255,0.5)"
      : "0 6px 24px rgba(0,0,0,0.25)",
    alignSelf: "center",
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
  }}
>
  {!loaded && (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.15)",
        animation: "pulse 1.5s ease-in-out infinite",
        zIndex: 1,
      }}
    />
  )}

  <img
    src={photo.src}
    alt={photo.title}
    draggable={false}
    onLoad={(e) => {
      setLoaded(true);
      const { naturalWidth, naturalHeight } = e.target;
      setIsPortrait(naturalHeight > naturalWidth);
    }}
    style={{
      width: isPortrait ? "100%" : "auto",
      height: isPortrait ? "auto" : "100%",
      minWidth: isPortrait ? "100%" : "unset",
      minHeight: isPortrait ? "unset" : "100%",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.5s ease, filter 0.4s, transform 0.4s",
      filter: active ? "brightness(1)" : "brightness(0.6) saturate(0.7)",
      transform: active ? "scale(1.03)" : "scale(1)",
      display: "block",
      position: "absolute",
      top: "50%",
      left: "50%",
      transformOrigin: "center",
      translate: "-50% -50%",
    }}
  />

  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(170deg, transparent 40%, rgba(0,0,0,0.65) 100%)",
      zIndex: 2,
    }}
  />

  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "18px 20px",
      zIndex: 3,
    }}
  >
    <h3
      style={{
        color: "#fff",
        fontSize: active ? "1.25rem" : "1rem",
        fontWeight: 800,
        lineHeight: 1.2,
        transition: "font-size 0.4s",
        textShadow: "0 2px 10px rgba(0,0,0,0.4)",
        margin: 0,
      }}
    >
      {photo.title}
    </h3>
  </div>

  {active && (
    <div
      style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        background: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.4)",
        borderRadius: "999px",
        padding: "4px 12px",
        fontSize: "10px",
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        zIndex: 3,
      }}
    >
      ✦ Now
    </div>
  )}
</div>
  );
}

export default function Gallery() {
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const isPaused = useRef(false);
  const pauseTimerRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, lastX: 0 });
  const [activeCard, setActiveCard] = useState(0);

  const resumeAfterDelay = useCallback((ms = 1200) => {
    clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => { isPaused.current = false; }, ms);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = N * CARD_TOTAL;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const tick = () => {
      if (!isPaused.current) {
        el.scrollLeft += SPEED_PX_PER_FRAME;
        if (el.scrollLeft >= N * 2 * CARD_TOTAL) el.scrollLeft -= N * CARD_TOTAL;
        if (el.scrollLeft < N * CARD_TOTAL * 0.01) el.scrollLeft += N * CARD_TOTAL;

        const center = el.scrollLeft + el.clientWidth / 2;
        const idx = Math.round((center - CARD_W / 2) / CARD_TOTAL) % N;
        setActiveCard((idx + N) % N);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onMouseDown = (e) => {
      dragRef.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, lastX: e.clientX };
      isPaused.current = true;
      clearTimeout(pauseTimerRef.current);
      el.style.cursor = "grabbing";
    };

    const onMouseMove = (e) => {
      if (!dragRef.current.active) return;
      const dx = dragRef.current.startX - e.clientX;
      el.scrollLeft = dragRef.current.startScroll + dx;
      dragRef.current.lastX = e.clientX;

      if (el.scrollLeft >= N * 2 * CARD_TOTAL) el.scrollLeft -= N * CARD_TOTAL;
      if (el.scrollLeft < N * CARD_TOTAL * 0.01) el.scrollLeft += N * CARD_TOTAL;
    };

    const onMouseUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      el.style.cursor = "grab";
      resumeAfterDelay(1000);
    };

    const onTouchStart = (e) => {
      dragRef.current = {
        active: true,
        startX: e.touches[0].clientX,
        startScroll: el.scrollLeft,
        lastX: e.touches[0].clientX,
      };
      isPaused.current = true;
      clearTimeout(pauseTimerRef.current);
    };

    const onTouchMove = (e) => {
      if (!dragRef.current.active) return;
      const dx = dragRef.current.startX - e.touches[0].clientX;
      el.scrollLeft = dragRef.current.startScroll + dx;
      if (el.scrollLeft >= N * 2 * CARD_TOTAL) el.scrollLeft -= N * CARD_TOTAL;
      if (el.scrollLeft < N * CARD_TOTAL * 0.01) el.scrollLeft += N * CARD_TOTAL;
      e.preventDefault();
    };

    const onTouchEnd = () => {
      dragRef.current.active = false;
      resumeAfterDelay(1000);
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [resumeAfterDelay]);

  const goToSlide = useCallback((dotIdx) => {
    const el = trackRef.current;
    if (!el) return;
    isPaused.current = true;
    clearTimeout(pauseTimerRef.current);

    const targetScroll = (N + dotIdx) * CARD_TOTAL - (el.clientWidth / 2 - CARD_W / 2);
    el.scrollTo({ left: targetScroll, behavior: "smooth" });
    setActiveCard(dotIdx);
    resumeAfterDelay(1800);
  }, [resumeAfterDelay]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#12b2c4",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      paddingTop:'50px',
      paddingBottom:'50px'
    }}>
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{display:none;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      <header style={{
        textAlign: "center",
        paddingTop: "52px",
        paddingBottom: "24px",
        userSelect: "none",
      }}>
        <h1 style={{
          margin: 0,
          fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}>
          MICE by Traveon
          
        </h1>

        <p style={{
          marginTop: "12px",
          color: "rgba(255,255,255,0.7)",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.08em",
        }}>
          Meetings · Incentives · Conferences · Exhibitions
        </p>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          marginTop: "14px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          borderRadius: "999px",
          padding: "6px 16px",
          border: "1px solid rgba(255,255,255,0.25)",
        }}>
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: "#fff",
            display: "inline-block",
            animation: "pulse 1.4s ease-in-out infinite",
          }} />
          <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            MICE
          </span>
        </div>
      </header>

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "100px", zIndex: 10, pointerEvents: "none",
          background: "linear-gradient(90deg, #12b2c4 0%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "100px", zIndex: 10, pointerEvents: "none",
          background: "linear-gradient(270deg, #12b2c4 0%, transparent 100%)",
        }} />

        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            overflowX: "scroll",
            overflowY: "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: "grab",
            paddingLeft: "120px",
            paddingRight: "120px",
            paddingTop: "40px",
            paddingBottom: "40px",
            userSelect: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {TRACK.map((photo, i) => (
            <SlideCard
              key={`${photo.id}-${i}`}
              photo={photo}
              active={i % N === activeCard}
            />
          ))}
        </div>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        paddingBottom: "36px",
        userSelect: "none",
      }}>
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            style={{
              width: activeCard === i ? "32px" : "8px",
              height: "8px",
              borderRadius: "999px",
              background: activeCard === i ? "#ffffff" : "rgba(255,255,255,0.4)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.35s cubic-bezier(.4,0,.2,1), background 0.3s ease",
              outline: "none",
            }}
          />
        ))}
      </div>

     
    </div>
  );
}
