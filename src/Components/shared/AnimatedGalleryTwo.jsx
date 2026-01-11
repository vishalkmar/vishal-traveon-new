import React, { useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ScrollGallery = () => {

    const images = [
    "/google-wellness/13.jpg",
    "/google-wellness/14.jpg",
    "/google-wellness/15.jpg",  
    "/google-wellness/16.jpg",
  ]

  const containerRef = useRef(null);
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
    });
  }, []);
  // Framer Motion Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  return (
    <div ref={containerRef} className="relative bg-white text-neutral-900 min-h-[300vh]">
      {/* Sticky Section */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-gray-200 opacity-40 animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-gray-200 opacity-40 animate-pulse" />
        </div>
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-10 z-20 text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 text-center px-4"
        >
          Glimps Of the Goole Wellness Event
        </motion.h1>
        {/* Main Gallery Stage */}
        <div className="relative w-full max-w-5xl h-[60vh] flex items-center justify-center perspective-1000">
          {images.map((src, index) => {
            // Calculate range for each image based on scroll progress
            const start = index / images.length;
            const end = (index + 1) / images.length;
            
            // Transform opacity and scale based on scroll position
            // FIRST image starts visible with no blur
            const opacity = useTransform(springScroll, 
              index === 0
                ? [0, end - 0.1, end] 
                : [start, start + 0.1, end - 0.1, end], 
              index === 0
                ? [1, 1, 0]
                : [0, 1, 1, 0]
            );
            
            const scale = useTransform(springScroll,
              [start, end],
              [0.85, 1.1]
            );
            const rotate = useTransform(springScroll,
              [start, end],
              [index % 2 === 0 ? -5 : 5, 0]
            );
            const blur = useTransform(springScroll,
              index === 0
                ? [0, end - 0.1, end]
                : [start, start + 0.1, end - 0.1, end],
              index === 0
                ? ["0px", "0px", "10px"]
                : ["10px", "0px", "0px", "10px"]
            );
            return (
              <motion.div
                key={index}
                style={{ opacity, scale, rotate, filter: `blur(${blur})` }}
                className="absolute inset-0 flex items-center justify-center p-6 z-10"
              >
                <div 
                  className="relative w-full h-full max-w-4xl max-h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-neutral-200 group"
                >
                  <img 
                    src={src} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  
               
                  
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [1, 0]) }}
          className="absolute bottom-10 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>
      {/* Spacer to allow scrolling */}
      <div className="h-[50vh]" />
    </div>
  );
};
export default ScrollGallery;