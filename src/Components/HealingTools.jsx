import React, { useRef, useEffect } from 'react';
import { images } from '../config/images';

export default function HealingTools() {
  const healingTools = [
    { img: images.programs[0], title: 'Yoga & Breathwork', desc: 'Daily asana, pranayama and restorative sessions.' },
    { img: images.programs[1], title: 'Guided Meditation', desc: 'Teacher-led meditations to deepen awareness.' },
    { img: images.programs[2], title: 'Nature Therapy', desc: 'Mindful nature walks and grounding practices.' },
    { img: images.programs[3], title: 'Sound Healing', desc: 'Tibetan bowls and gong baths for deep relaxation.' },
    { img: images.programs[4], title: 'Ayurvedic Therapies', desc: 'Personalized massages and herbal support.' },
    { img: images.programs[5], title: 'Breathwork & Release', desc: 'Guided breathwork to release stress and tension.' },
    { img: images.programs[6], title: 'Mindful Movement', desc: 'Qigong & gentle movement for vitality.' },
  ];

  const sliderRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const pausedRef = useRef(false);

  const onMouseDown = (e) => {
    if (!sliderRef.current) return;
    isDownRef.current = true;
    sliderRef.current.classList.add('cursor-grabbing');
    startXRef.current = (e ).pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    if (!sliderRef.current) return;
    isDownRef.current = false;
    sliderRef.current.classList.remove('cursor-grabbing');
  };

  const onMouseUp = () => {
    if (!sliderRef.current) return;
    isDownRef.current = false;
    sliderRef.current.classList.remove('cursor-grabbing');
  };

  const onMouseMove = (e) => {
    if (!isDownRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = (e).pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onTouchStart = (e) => {
    if (!sliderRef.current) return;
    isDownRef.current = true;
    startXRef.current = e.touches[0].pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const onTouchMove = (e) => {
    if (!isDownRef.current || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onTouchEnd = () => {
    isDownRef.current = false;
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let rafId;
    let lastTime= null;
    const speedPxPerMs = 0.03;

    const step = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!pausedRef.current && !isDownRef.current) {
        slider.scrollLeft += speedPxPerMs * delta;
        const half = slider.scrollWidth / 2;
        if (slider.scrollLeft >= half) slider.scrollLeft = slider.scrollLeft - half;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="w-full py-16" style={{ background: '#DBF3E0' }}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-4 text-center">
          <h2 style={{ margin: 0, display: 'inline-block' }}>
            <span style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: 32, lineHeight: '40px', letterSpacing: '-2%', display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }}>Our Powerful</span>
            <span style={{ fontFamily: 'Cormorant, serif', fontWeight: 600, fontStyle: 'italic', fontSize: 36, lineHeight: '40px', letterSpacing: '-3%', background: 'linear-gradient(91.87deg, #00C5C5 0%, #009F26 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', display: 'inline-block', verticalAlign: 'middle' }}>Healing Tools</span>
          </h2>
          <p className="mt-3 text-gray-700 mx-auto" style={{ fontFamily: 'Archivo, sans-serif', fontSize: 16, lineHeight: '22px', maxWidth: 720 }}>An array of powerful, science-backed & ancient tools designed to heal and transform</p>
        </div>

        <div className="mt-6 -mx-4">
          <div
            ref={sliderRef}
            className="flex gap-6 px-4 py-4 overflow-x-auto hide-scrollbar cursor-grab"
            onMouseDown={onMouseDown}
            onMouseLeave={() => { onMouseLeave(); pausedRef.current = false; }}
            onMouseUp={() => { onMouseUp(); pausedRef.current = false; }}
            onMouseMove={onMouseMove}
            onTouchStart={(e) => { onTouchStart(e); pausedRef.current = true; }}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseEnter={() => { pausedRef.current = true; }}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {[...healingTools, ...healingTools].map((t, idx) => (
              <div key={idx} className="flex-shrink-0 rounded-lg overflow-hidden relative w-[300px] h-[420px]">
                <img src={t.img} alt={t.title} className="w-full h-full object-cover block" />

                <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>{t.title}</div>
                  <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.95)', marginTop: 6 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
