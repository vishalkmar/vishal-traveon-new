import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return undefined;

    let frameId;

    const move = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      setIsVisible(true);
    };

    const updateHover = (event) => {
      const target = event.target;
      setIsHovering(Boolean(target?.closest?.("a, button, input, textarea, select, [role='button']")));
    };

    const leave = () => setIsVisible(false);
    const enter = () => setIsVisible(true);

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", updateHover);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", updateHover);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9998] hidden h-10 w-10 rounded-full border border-[#28bccf]/70 mix-blend-difference transition-[width,height,opacity,border-color] duration-200 md:block ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovering ? "h-14 w-14 border-white/80" : ""}`}
      />
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden h-3 w-3 rounded-full bg-[#28bccf] shadow-[0_0_18px_rgba(40,188,207,0.8)] transition-[opacity,transform] duration-150 md:block ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="absolute -inset-2 rounded-full bg-[#28bccf]/20 blur-md" />
      </div>
    </>
  );
}
