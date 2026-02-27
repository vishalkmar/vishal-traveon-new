import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Arc / Half-moon moving carousel (rainbow / dhanush style)
 * - Cards move left->right along a curved path
 * - Center card sits higher, edges go lower
 * - Center is bigger + more opaque (depth effect)
 */
function ArcCarousel({ cards }) {
  const stageRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  // Duplicate for smooth infinite loop
  const items = useMemo(() => [...cards, ...cards, ...cards], [cards]);

  const [w, setW] = useState(0);

  // Layout constants (tweak if needed)
  const CARD_W = 260;
  const GAP = 26;
  const SPEED = 0.9; // pixels per frame-ish (we use dt, so stable)
  const ARC_HEIGHT = 140; // higher = more curve
  const DEPTH_SCALE = 0.22; // bigger center
  const OPACITY_DROP = 0.55; // fade edges

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => setW(el.clientWidth);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!w) return;

    const el = stageRef.current;
    if (!el) return;

    const nodes = el.querySelectorAll("[data-arc-card]");
    if (!nodes.length) return;

    const totalSpan = items.length * (CARD_W + GAP);

    // Start each card at its spaced position
    nodes.forEach((node, i) => {
      node.dataset.baseX = String(i * (CARD_W + GAP));
    });

    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(40, now - last);
      last = now;

      // move offset
      tRef.current += (SPEED * dt) / 16.67; // normalize to ~60fps
      const offset = tRef.current;

      const cx = w / 2;
      const radiusX = Math.max(420, w * 0.42);

      nodes.forEach((node) => {
        const baseX = Number(node.dataset.baseX || 0);

        // x loops infinitely
        // wrap into [0, totalSpan)
        let x = (baseX - offset) % totalSpan;
        if (x < 0) x += totalSpan;

        // distance from center normalized [-1..1]
        const dx = (x - cx) / radiusX;
        const clamped = Math.max(-1, Math.min(1, dx));
        const abs = Math.abs(clamped);

        // half-moon curve: center up, edges down (smooth power curve)
        const y = -ARC_HEIGHT * Math.pow(1 - abs, 1.6);

        // depth: center bigger
        const scale = 1 - abs * DEPTH_SCALE;

        // opacity: center strongest
        const opacity = 1 - abs * OPACITY_DROP;

        // stacking: center on top
        const z = Math.round((1 - abs) * 100);

        node.style.transform = `translate3d(${x - CARD_W / 2}px, ${y}px, 0) scale(${scale})`;
        node.style.opacity = String(opacity);
        node.style.zIndex = String(z);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [w, items.length]);

  return (
    <div className="relative w-full">
      {/* Stage */}
      <div
        ref={stageRef}
        className="relative mx-auto h-[360px] w-full overflow-hidden"
      >
        {/* Left/Right fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-24 bg-gradient-to-l from-white to-transparent" />

        {/* Cards */}
        {items.map((c, i) => (
          <div
            key={i}
            data-arc-card
            className="absolute left-0 top-1/2 will-change-transform"
            style={{
              width: 260,
              transform: "translate3d(-9999px,0,0)",
            }}
          >
            <div className="w-full bg-white border border-gray-200 rounded-xl p-5 text-center shadow-lg">
              <img
                src={c.img}
                alt={c.name}
                className="w-14 h-14 mx-auto rounded-full object-cover"
              />
              <h4 className="mt-3 font-semibold text-gray-800">{c.name}</h4>
              <p className="text-sm text-gray-500">{c.title}</p>
              <div className="mt-3 text-yellow-400">★★★★★</div>
              <p className="mt-3 text-sm text-gray-600">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const cards = [
    {
       img: "/mice/tt.jpg",
      name: "Priya Sharma",
      title: "Marketing Director, Tech Startup",
      text: "The wellness retreat in Rishikesh completely transformed my perspective on work-life balance. The yoga sessions at sunrise and sound healing were exactly what my soul needed.",
    },
    {
      img: "/mice/tt.jpg",
      name: "Mahendra Pratap Singh",
      title: "Retired Bank Manager, Lucknow",
      text: "Our group of five friends travelled to Pattaya and Bangkok—proof that adventure has no age! Travel handled every detail with care; smooth transfers, clean and central hotels, and thoughtfully paced days.",
    },
    {
       img: "/mice/tt.jpg",
      name: "Rahul Mehta",
      title: "Travel Blogger, Wanderlust Weekly",
      text: "The community tour through Oman opened our eyes to authentic Arabia. Every interaction felt genuine, and the local connections we made were priceless.",
    },
    {
      img: "/mice/tt.jpg",
      name: "Asha Rao",
      title: "Wellness Coach",
      text: "Truly transformative experience. I left refreshed and inspired. The balance between activity and mindfulness was perfect.",
    },
    {
       img: "/mice/tt.jpg",
      name: "Leena Das",
      title: "Therapist",
      text: "Carefully curated activities that supported real healing. I felt completely renewed after the retreat.",
    },
    {
       img: "/mice/tt.jpg",
      name: "Arjun Singh",
      title: "Photographer",
      text: "Beautiful locations and great people — highly recommended.",
    },
    {
      img: "/mice/tt.jpg",
      name: "Maya Kapoor",
      title: "Traveler",
      text: "A soulful journey, with exceptional organization and warmth.",
    },
    {
      img: "/mice/tt.jpg",
      name: "Rohan Mehta",
      title: "Team Lead",
      text: "Our team found new synergy and focus during the retreat.",
    },
    {
       img: "/mice/tt.jpg",
      name: "Leena Das",
      title: "Therapist",
      text: "Carefully curated activities that supported real healing. I felt completely renewed after the retreat.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* TESTIMONIALS HEADER */}
        <div className="text-center mt-12 mb-6">
          <h2 className="text-4xl font-semibold text-gray-900 leading-tight">
            Heartfelt{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-600">
              Words
            </span>{" "}
            From Our{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-600">
              Happy
            </span>{" "}
            Guests
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Real experiences from guests who found renewal, teams that discovered synergy,
            <br />
            and travelers who connected with purpose.
          </p>
        </div>

        {/* ARC CAROUSEL */}
        <div className="mt-2">
          <ArcCarousel cards={cards} />
        </div>
      </div>
    </section>
  );
}


