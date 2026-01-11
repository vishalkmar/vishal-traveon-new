import React, { useEffect, useRef, useState } from "react";
import {
  Globe2,
  Users,
  Building2,
  Briefcase,
  Plane,
  Award,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  HeartHandshake
} from "lucide-react";
import { Link } from "react-router-dom";

/* ----------------------------- Reveal on Scroll ---------------------------- */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShow(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
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

/* -------------------------- Blue (Traveon) Button -------------------------- */
const PrimaryButton = ({ to = "/contact", children = "Get in Touch" }) => (
  <Link
    to={to}
    className="group relative inline-flex h-12 items-center overflow-hidden rounded-full p-[2px]
               focus:outline-none focus:ring-2 focus:ring-[#28bccf] focus:ring-offset-2 focus:ring-offset-transparent
               transition-transform hover:scale-[1.02] active:scale-95"
  >
    {/* breathing BLUE halo (no spin) */}
    <span
      aria-hidden
      className="pointer-events-none absolute -inset-3 rounded-full tr-halo
                 bg-[conic-gradient(from_90deg_at_50%_50%,#0f8fa0_0%,#28bccf_40%,#5ed6e3_80%,#0f8fa0_100%)]
                 opacity-60 blur-[18px]"
    />
    {/* crisp BLUE border */}
    <span
      aria-hidden
      className="absolute inset-0 rounded-full
                 bg-[conic-gradient(from_90deg_at_50%_50%,#0f8fa0_0%,#28bccf_40%,#5ed6e3_80%,#0f8fa0_100%)]"
    />
    {/* inner pill */}
    <span className="relative inline-flex h-full w-full items-center justify-center gap-2 rounded-full
                     bg-[#0b2026]/90 px-6 md:px-7 text-white font-semibold tracking-wide">
      {children}
      <ChevronRight className="size-5" />
      {/* shimmer only on hover */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute left-0 top-0 h-full w-1/3
                         bg-gradient-to-r from-transparent via-white/40 to-transparent
                         opacity-0 group-hover:opacity-100
                         translate-x-[-150%] skew-x-[-15deg]
                         group-hover:[animation:rt-sheen_1.2s_ease-out]" />
      </span>
    </span>
  </Link>
);

const Feature = ({ text }) => (
  <li className="flex items-start gap-2">
    <CheckCircle2 className="size-5 mt-0.5 text-[#28bccf]" />
    <span>{text}</span>
  </li>
);

/* ---------------------------- Uniform Service Card ---------------------------- */
/* NOTE: icon prop is captured as IconComp and used safely */
const ServiceCard = ({ icon: IconComp, title, description, features, to, i = 0 }) => (
  <Reveal delay={i * 80} className="h-full">
    <div
      className="group relative isolate rounded-2xl p-[1px] h-full
                 bg-[conic-gradient(from_180deg_at_50%_50%,#28bccf22_0%,#0f8fa022_30%,#5ed6e322_60%,#28bccf22_90%,#0f8fa022_100%)]
                 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]
                 transition-transform hover:-translate-y-0.5"
    >
      {/* soft blue outer glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-35 blur-3xl tr-halo"
      />
      {/* inner card: flex to push footer to bottom */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur md:p-7 p-6 shadow-lg h-full flex flex-col">
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 grid place-items-center size-12 rounded-xl text-white shadow-md
                       bg-gradient-to-br from-[#0f8fa0] via-[#28bccf] to-[#5ed6e3]"
          >
            {IconComp ? <IconComp className="size-6" /> : null}
          </div>
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-semibold text-[#003B4A]">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>
        </div>

        {features?.length ? (
          <ul className="mt-5 space-y-2.5">
            {features.map((f, idx) => (
              <Feature key={idx} text={f} />
            ))}
          </ul>
        ) : (
          <div className="mt-5" />
        )}

        {/* footer sticks to bottom for uniform height */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          <Link
            to={to || "#"}
            className="text-[#28bccf] font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            Learn more <ChevronRight className="size-4" />
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white
                       bg-[#28bccf] hover:bg-[#22a8b9] shadow-md"
          >
            Plan with us <Plane className="size-4" />
          </Link>
        </div>

        {/* subtle sparkle on hover */}
        <Sparkles
          className="absolute -right-2 -top-2 size-6 text-[#28bccf] opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden
        />
      </div>
    </div>
  </Reveal>
);

/* --------------------------------- Page ----------------------------------- */
const Services = () => {
  const mainServices = [{
    icon: HeartHandshake,
    title: "Wellness Retreat",
    description: "Immersive wellness retreats designed for rejuvenation through yoga, meditation, and holistic healing.",
    features: [
      "Guided Yoga & Meditation",
      "Nature Therapy",
      "Mindful Community Engagement"
    ],
    to: "/packages/wellness",

  },
  {
    icon: Globe2,
    title: "Curated Travel Experiences",
    description:
      "Uncover hidden gems with journeys that blend luxury stays, authentic culture, and just-right adventure.",
    features: [
      "Handpicked accommodations",
      "Local guides & experiences",
      "Flexible itineraries",
    ],
    to: "/packages/curated",
  },
  {
    icon: Users,
    title: "MICE Management",
    description:
      "From boardroom to ballroom: precision planning, creative experiences, and seamless execution for MICE.",
    features: [
      "End-to-end project ownership",
      "Strategic venue & vendor curation",
      "Flawless on-site coordination",
    ],
    to: "/contact",
  },
  {
    icon: Briefcase,
    title: "Business Facilitation",
    description:
      "Open doors in new markets with stakeholder connects, curated delegations, and targeted B2B events.",
    features: [
      "High-value industry networking",
      "Market entry & growth strategy",
      "Executive delegations & forums",
    ],
    to: "/contact",
  },
  {
    icon: Plane,
    title: "Visa Services",
    description:
      "Stress-free documentation, fast-track processing, and guided support for selected destinations.",
    features: [
      "Application, documentation, submission",
      "Fast-track & concierge handling",
      "Expedite options for urgent travel",
    ],
    to: "/contact",
  },
  ];

  const values = [
    {
      icon: Building2,
      title: "Local Expertise",
      description:
        "On-ground knowledge of culture, geography, suppliers, and business norms worldwide.",
    },
    {
      icon: Users,
      title: "Personalized Service",
      description:
        "Tailored itineraries and event designs that feel bespoke — because they are.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Premium partners, audited processes, and zero-compromise delivery.",
    },
    {
      icon: Globe2,
      title: "Responsible Tourism",
      description:
        "Respect for communities & environment baked into itineraries and operations.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546610073-14a94cd7daac?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        {/* gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#003B4A]/50 to-[#003B4A]/70" />
        {/* floating blobs */}
        {/* <div className="absolute -top-20 -left-20 size-96 bg-[#28bccf]/30 rounded-full blur-[80px] animate-blob-slow" /> */}
        <div className="absolute -bottom-24 -right-24 size-[28rem] bg-[#0f8fa0]/30 rounded-full blur-[100px] animate-blob-slower" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-28 md:py-36 text-center text-white">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Services that go <span className="text-[#28bccf]">Beyond</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              From bespoke journeys to boardroom-level events — we design, manage, and deliver unforgettable outcomes.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex items-center justify-center gap-4">
              <PrimaryButton to="/contact">Contact Us</PrimaryButton>
              <Link
                to="/about"
                className="inline-flex h-12 items-center rounded-full px-6 font-semibold text-white
                           ring-1 ring-white/40 hover:bg-white/10 backdrop-blur-sm"
              >
                About Traveon
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services Grid (uniform card heights) */}
      <section className="relative mt-10 md:mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <p className="mx-auto max-w-4xl text-center text-gray-700 text-lg md:text-xl mb-10">
              At <strong>Traveon Ventures</strong>, we craft <b>Immersive Wellness Retreats</b>, <b>curated travel</b>, run flawless <b>MICE</b>,
              and enable <b>business expansion</b> — with quality and responsibility at the core.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            {mainServices.map((s, i) => (
              <ServiceCard key={s.title} {...s} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-16 md:py-20 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#003B4A]">
              Why Choose Traveon Ventures
            </h2>
          </Reveal>

          {/* Use a local variable for the icon component to avoid JSX parser quirks */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((v, i) => {
              const IconV = v.icon;
              return (
                <Reveal key={v.title} delay={i * 90}>
                  <div className="group relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100
                                  transition-transform hover:-translate-y-1">
                    <div
                      className="mb-4 inline-grid place-items-center size-12 rounded-xl text-white shadow-md
                                 bg-gradient-to-br from-[#0f8fa0] via-[#28bccf] to-[#5ed6e3]"
                    >
                      {IconV ? <IconV className="size-6" /> : null}
                    </div>
                    <h3 className="text-lg font-semibold text-[#003B4A]">{v.title}</h3>
                    <p className="mt-2 text-gray-600">{v.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B4A]">
              Ready to experience <span className="text-[#28bccf]">Beyond</span>?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
              Tell us your goals — we’ll design the perfect journey, event, or market entry plan.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex items-center justify-center gap-4">
              <PrimaryButton to="/contact">Get in Touch</PrimaryButton>
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

export default Services;
