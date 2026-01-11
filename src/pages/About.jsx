import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Globe, Shield, Heart, CheckCircle2 } from "lucide-react";
import Testimonials from "../Components/Testimonials";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


/* ----------------------------- Reveal on Scroll ---------------------------- */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShow(true), delay);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${className}`}
    >
      {children}
    </div>
  );
};

const Bullet = ({ children }) => (
  <li className="flex items-start gap-3">
    <CheckCircle2 className="mt-0.5 size-5 text-[#28bccf]" />
    <span className="text-gray-700">{children}</span>
  </li>
);

const ValuePill = ({ icon: Icon, title, desc }) => (
  <div className="group rounded-2xl bg-white/95 backdrop-blur p-6 shadow-lg ring-1 ring-gray-100 hover:-translate-y-1 transition-transform">
    <div className="mb-4 inline-grid place-items-center size-12 rounded-xl text-white shadow-md
                    bg-gradient-to-br from-[#0f8fa0] via-[#28bccf] to-[#5ed6e3]">
      {Icon && <Icon className="size-6" />}
    </div>
    <h3 className="text-lg font-semibold text-[#003B4A]">{title}</h3>
    <p className="mt-2 text-gray-600">{desc}</p>
  </div>
);

/* ------------------------------- Page ------------------------------------- */
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        {/* gradient veil + soft blobs */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#003B4A]/50 to-[#003B4A]/70" />
        {/* <div className="absolute -top-20 -left-24 size-[26rem] bg-[#28bccf]/30 rounded-full blur-[90px]" /> */}
        <div className="absolute -bottom-24 -right-24 size-[30rem] bg-[#0f8fa0]/30 rounded-full blur-[110px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-28 md:py-36 text-center text-white">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              About <span className="text-[#28bccf]">Traveon Ventures</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              A premier travel company crafting curated journeys, flawless MICE, and business facilitation—worldwide.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                to="/services"
                className="inline-flex h-12 items-center rounded-full px-6 font-semibold text-white
                           ring-1 ring-white/40 hover:bg-white/10 backdrop-blur-sm"
              >
                Explore Services
              </Link>
              <Link
                to="/contact"
                className="relative inline-flex h-12 items-center overflow-hidden rounded-full p-[2px]
                           focus:outline-none focus:ring-2 focus:ring-[#28bccf] focus:ring-offset-2 focus:ring-offset-transparent
                           transition-transform hover:scale-[1.02] active:scale-95"
              >
                {/* breathing blue halo */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-3 rounded-full tr-halo
                             bg-[conic-gradient(from_90deg_at_50%_50%,#0f8fa0_0%,#28bccf_40%,#5ed6e3_80%,#0f8fa0_100%)]
                             opacity-60 blur-[18px]"
                />
                {/* crisp border */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full
                             bg-[conic-gradient(from_90deg_at_50%_50%,#0f8fa0_0%,#28bccf_40%,#5ed6e3_80%,#0f8fa0_100%)]"
                />
                <span className="relative inline-flex h-full w-full items-center justify-center rounded-full
                                 bg-[#0b2026]/90 px-6 text-white font-semibold tracking-wide">
                  Get in Touch
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Story (Lottie slot on LEFT) */}
      <section className="relative -mt-10 md:-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Lottie Slot: LEFT of Our Story */}
            <Reveal className="order-1 md:order-1">
              <div>
                <DotLottieReact
                  src="https://lottie.host/e52dd56a-acc8-431d-8fbc-6c1d1dc7671a/wLzPKa6v1s.lottie"
                  loop
                  autoplay
                />
              </div>
            </Reveal>

            {/* Content: Our Story */}
            <Reveal delay={80} className="order-2 md:order-2">
              <div className="rounded-2xl bg-white/95 backdrop-blur p-6 md:p-8 shadow-lg ring-1 ring-gray-100 h-full flex flex-col">
                <h2 className="text-3xl font-bold text-[#003B4A]">Our Story</h2>
                <p className="mt-4 text-gray-600">
                  As part of the EGS Group, we bridge heritage and modern advancements—connecting leaders with
                  dynamic opportunities. Our commitment to excellence and innovation drives exceptional outcomes,
                  whether for a private journey, a C-suite summit, or market entry.
                </p>

                <ul className="mt-6 space-y-3">
                  <Bullet>Global expertise with a strong, vetted partner network</Bullet>
                  <Bullet>Local knowledge delivered with international standards</Bullet>
                  <Bullet>Exceptional experiences across travel, business, and events</Bullet>
                </ul>

                {/* small stat strip */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { k: "15+", v: "Countries" },
                    { k: "120+", v: "Events" },
                    { k: "1K+", v: "Guests" },
                  ].map((s) => (
                    <div key={s.v} className="text-center rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-extrabold text-[#28bccf]">{s.k}</div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Values (Lottie slot on RIGHT) */}
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Content: Our Values (bullet style) */}
            <Reveal>
              <div className="rounded-2xl bg-white/95 backdrop-blur p-6 md:p-8 shadow-lg ring-1 ring-gray-100 h-full">
                <h2 className="text-3xl font-bold text-[#003B4A]">Our Values</h2>
                <p className="mt-4 text-gray-600">
                  We are guided by excellence, authenticity, and client-first service.
                  Every engagement blends creativity with rigorous execution and
                  respect for communities and the environment.
                </p>

                {/* Point-wise bullets (same vibe as Our Story) */}
                <ul className="mt-6 space-y-3">
                  <Bullet>Client-first, white-glove service & clear communication</Bullet>
                  <Bullet>Integrity & transparency across partners and processes</Bullet>
                  <Bullet>Quality & safety assurances with audited suppliers</Bullet>
                  <Bullet>Sustainable, responsible travel & events</Bullet>
                  <Bullet>Local expertise delivered to global standards</Bullet>
                </ul>
              </div>
            </Reveal>

            {/* Lottie Slot: RIGHT of Our Values */}
            <Reveal delay={80}>
              <div >
                <DotLottieReact
                  src="https://lottie.host/fff10817-3568-42e8-a66b-b339d51f8ae8/S9pFqamLY9.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-16 md:py-20 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#003B4A]">
              Why Choose Traveon Ventures
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Globe,
                title: "Global Yet Local",
                desc: "We merge world-class standards with local nuance for outcomes that feel effortless.",
              },
              {
                icon: Users,
                title: "People-First",
                desc: "White-glove service, clear communication, and ownership from start to finish.",
              },
              {
                icon: Shield,
                title: "Reliable Partners",
                desc: "Curated network and stress-tested playbooks reduce risk and raise quality.",
              },
              {
                icon: Heart,
                title: "Sustainable Impact",
                desc: "We design with empathy — for guests, communities, and the planet.",
              },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <ValuePill icon={v.icon} title={v.title} desc={v.desc} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (unchanged) */}
      <Testimonials />

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B4A]">
              Ready to go <span className="text-[#28bccf]">Beyond</span>?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
              Tell us your goals — we’ll design the perfect journey, event, or market entry plan.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                to="/contact"
                className="relative inline-flex h-12 items-center overflow-hidden rounded-full p-[2px]
                           focus:outline-none focus:ring-2 focus:ring-[#28bccf] focus:ring-offset-2 focus:ring-offset-transparent
                           transition-transform hover:scale-[1.02] active:scale-95"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-3 rounded-full tr-halo
                             bg-[conic-gradient(from_90deg_at_50%_50%,#0f8fa0_0%,#28bccf_40%,#5ed6e3_80%,#0f8fa0_100%)]
                             opacity-60 blur-[18px]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full
                             bg-[conic-gradient(from_90deg_at_50%_50%,#0f8fa0_0%,#28bccf_40%,#5ed6e3_80%,#0f8fa0_100%)]"
                />
                <span className="relative inline-flex h-full w-full items-center justify-center rounded-full
                                 bg-[#0b2026]/90 px-6 text-white font-semibold tracking-wide">
                  Get in Touch
                </span>
              </Link>
              <Link
                to="/services"
                className="inline-flex h-12 items-center rounded-full px-6 font-semibold text-[#003B4A]
                           bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Explore Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default About;
