import React, { useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';


const images = [
   "/coursera/7.jpg",
   "/coursera/8.jpg",
   "/coursera/9.jpg", 
   "/coursera/10.jpg",
   "/coursera/11.jpg",
   "/coursera/12.jpg"
  ]
const CinematicStack = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  return (
    <div ref={containerRef} className="bg-white min-h-[500vh]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Grain/Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0 " />
        
        {/* Header Branding */}
 <div
  className="absolute top-[70px] left-1/2 -translate-x-1/2 z-50
             w-full px-4"
  data-aos="fade-down"
>
  <h1
    className="mb-[70px] text-black text-center font-bold tracking-tighter
               text-3xl sm:text-4xl md:text-5xl"
  >
    Coursera Offset Visuals
  </h1>
</div>


        {/* The Stack */}
        <div className="relative w-[90vw] md:w-[70vw] lg:w-[50vw] aspect-[16/9] flex items-center justify-center mt-[100px]">
          {images.map((src, index) => {
            const start = index / images.length;
            const end = (index + 1) / images.length;
            
            const scale = useTransform(smoothProgress,
              [start - 0.1, start, end, end + 0.1],
              [0.85, 1, 1, 0.95]
            );
            const opacity = useTransform(smoothProgress,
              [start - 0.1, start, end - 0.05, end],
              [0, 1, 1, 0]
            );
            const y = useTransform(smoothProgress,
              [start - 0.1, start, end],
              [100, 0, -50]
            );
            const rotateX = useTransform(smoothProgress,
              [start - 0.1, start, end],
              [15, 0, -5]
            );
            const zIndex = images.length - index;
            return (
              <motion.div
                key={index}
                style={{ 
                  opacity, 
                  scale, 
                  y, 
                  rotateX,
                  zIndex,
                  perspective: "1200px"
                }}
                className="absolute inset-0 w-full h-full"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-black/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-neutral-900 group">
                  <img 
                    src={src} 
                    alt={`Scene ${index + 1}`}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  />
                  
                 
              
                  {/* Dynamic Light Overlay */}
                  <motion.div 
                    style={{
                      opacity: useTransform(smoothProgress, [start, end], [0.3, 0.6])
                    }}
                    className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 pointer-events-none"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Progress Navigation */}
        <div className="absolute right-8 h-48 flex flex-col justify-between items-center z-50">
          {images.map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-black/20 rounded-full overflow-hidden h-full mx-auto relative mb-1"
            >
              <motion.div 
                style={{ 
                  height: useTransform(smoothProgress, [i / images.length, (i + 1) / images.length], ["0%", "100%"]),
                  backgroundColor: "black"
                }}
                className="w-full absolute top-0"
              />
            </motion.div>
          ))}
        </div>
        {/* Footer Info */}
       
      </div>
    </div>
  );
};
export default CinematicStack;