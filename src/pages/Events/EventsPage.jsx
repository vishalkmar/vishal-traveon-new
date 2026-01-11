import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Award, Globe, Clock, ChevronRight } from "lucide-react";
import PreviewEventsSection from "./EventCard";

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

/* --------------------------------- Helpers -------------------------------- */
const useCountdown = (dateString) => {
  const target = useMemo(() => {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? null : d;
  }, [dateString]);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!target) return { valid: false, label: "Date TBA" };

  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { valid: true, label: "Happening soon" };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return { valid: true, label: `${days}d ${hours}h left` };
};

const Chip = ({ children, color = "blue" }) => {
  const classes =
    color === "blue"
      ? "bg-[#28bccf]/10 text-[#28bccf]"
      : color === "gray"
        ? "bg-gray-200 text-gray-700"
        : "bg-emerald-100 text-emerald-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {children}
    </span>
  );
};

/* ------------------------------ Media helpers ------------------------------ */
const getYouTubeEmbedUrl = (id) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${id}`;

const EventMedia = ({ event, variant }) => {
  // If there is a video, show image + video together. Otherwise keep image only.
  if (!event.videoId) {
    return (
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className={`w-full object-cover ${variant === "row" ? "h-56 md:h-80" : "h-52 md:h-56"}`}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`
        relative grid
        ${variant === "row" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"}
      `}
    >
      {/* Left: the existing event image */}
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className={`w-full object-cover ${variant === "row" ? "h-56 md:h-80" : "h-52 md:h-56"}`}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      {/* Right: the autoplay, muted video */}
      <div className={`relative ${variant === "row" ? "h-56 md:h-80" : "h-52 md:h-56"}`}>
        <div className="absolute inset-0">
          <div className="w-full h-full">
            <iframe
              title={`${event.title} Highlights`}
              src={getYouTubeEmbedUrl(event.videoId)}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
        {/* Soft overlay for cohesion */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

/* -------------------------------- Event Card ------------------------------ */
const EventCard = ({ event, variant = "grid" }) => {
  const isUpcoming = !!event.isUpcoming;
  const countdown = useCountdown(event.date);

  return (
    <div
      className={`group relative isolate rounded-2xl p-[1px] h-full
        bg-[conic-gradient(from_180deg_at_50%_50%,#28bccf22_0%,#0f8fa022_30%,#5ed6e322_60%,#28bccf22_90%,#0f8fa022_100%)]
        shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset] transition-transform hover:-translate-y-0.5`}
    >
      {/* soft halo */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-4 rounded-3xl blur-3xl ${isUpcoming ? "opacity-40 tr-halo" : "opacity-20"
          }`}
      />
      <div className="relative rounded-2xl bg-white/95 backdrop-blur shadow-lg overflow-hidden h-full">
        {/* Media header: image only OR image + video (if videoId present) */}
        <div className="relative">
          <EventMedia event={event} variant={variant} />

          {/* ribbon */}
          <div className="absolute left-4 top-4">
            <Chip color={isUpcoming ? "gray" : "gray"}>{isUpcoming ? "Upcoming" : "Previous"}</Chip>
          </div>

          {/* countdown (upcoming only) */}
          {isUpcoming && (
            <div className="absolute right-4 bottom-3 flex items-center gap-2 text-white/95 text-sm bg-black/30 rounded-full px-3 py-1.5 backdrop-blur">
              <Clock className="w-4 h-4" />
              <span>{countdown.label}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
          <p className="mt-2 text-gray-600 line-clamp-3">{event.description}</p>

          {/* Info row */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-[#28bccf]" />
              <span className="text-sm">{event.date}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-[#28bccf]" />
              <span className="text-sm">{event.location}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between">
            <Link
              to={event.learnMoreLink}
              className="text-[#28bccf] font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              Learn more <ChevronRight className="w-4 h-4" />
            </Link>

            {isUpcoming ? (
              <Link
                to={event.learnMoreLink}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white
                           bg-[#28bccf] hover:bg-[#22a8b9] shadow-md"
              >
                Register
              </Link>
            ) : (
              <a
  href="https://ibiea.com"
  target="_blank"
  rel="noopener noreferrer"
  className="text-xs text-gray-500 hover:text-[#44B3C4] transition-colors"
>
  Visit Site
</a>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------- Page ------------------------------------- */
const EventsPage = () => {
  const AllEvents = [
    {
      title: "IBIEA 2.0",
      description:
        "International Business Innovation and Excellence Awards 2025 will be hosted in exotic locations across the globe. Celebrate innovation with global leaders.",
      date: "To be Announced",
      location: "To be Announced",
      learnMoreLink: "https://ibiea.com",
      isUpcoming: true,
      image: "/gallery/4.JPG",
    },
    {
      title: "ICCICT 2026",
      description:`International Conference on Computational Intelligence and Computing Technologies & AI (ICCICT 2026) — a leading platform uniting researchers, industry experts, and innovators.`,
date: "January 22-23 2026",
      des2:"It focuses on advancing Artificial Intelligence, Machine Learning, Data Science, and next-generation computing technologies",
       location: "Indian International Centre, Delhi",
      learnMoreLink: "https://iccict.org/",
      isUpcoming: true,
      image: "/events_images/iccict.jpg",
    },
    {
      title: "IBIEA 2025 Oman",
      description:
        "IBIEA 2025 unfolded as a grand spectacle at Afrah Ballroom, Grand Hyatt Muscat—celebrating excellence across industries.",
      date: "May 29, 2025",
      location: "Grand Hyatt Muscat, Oman",
      learnMoreLink: "/ibiea",
      isUpcoming: false,
      image: "/gallery/2.JPG",
      videoId: "biTfRalKxqg",
    }
  ];

  const upcomingEvents = AllEvents.filter((e) => e.isUpcoming);
  const previousEvents = AllEvents.filter((e) => !e.isUpcoming);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#003B4A]/50 to-[#003B4A]/70" />
        <div className="absolute -top-20 -left-24 size-[26rem] bg-[#28bccf]/30 rounded-full blur-[90px]" />
        <div className="absolute -bottom-24 -right-24 size-[30rem] bg-[#0f8fa0]/30 rounded-full blur-[110px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-28 md:py-36 text-center text-white">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Our Events</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              <strong>Join our global calendar</strong> — unite with innovators, achievers, and scholars.
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
                  Host an Event
                </span>
              </Link>
              <a
                href="#upcoming"
                className="inline-flex h-12 items-center rounded-full px-6 font-semibold text-white
                           ring-1 ring-white/40 hover:bg-white/10 backdrop-blur-sm"
              >
                See Upcoming
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl font-bold text-center text-[#003B4A]">What We Offer</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: "Award Functions",
                desc: "Signature productions that celebrate excellence, flawlessly executed.",
              },
              {
                icon: Globe,
                title: "Conferences & Trade Shows",
                desc: "Impact-driven forums with precision logistics and curated programming.",
              },
              {
                icon: Users,
                title: "Luxury Weddings & Milestones",
                desc: "Spectacular settings, white-glove service, and end-to-end planning.",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={(i + 1) * 80}>
                  <div
                    className="group relative isolate rounded-2xl p-[1px]
                               bg-[conic-gradient(from_180deg_at_50%_50%,#28bccf22_0%,#0f8fa022_30%,#5ed6e322_60%,#28bccf22_90%,#0f8fa022_100%)]
                               shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]"
                  >
                    <div className="rounded-2xl bg-gray-50 p-6 h-full">
                      <div className="mb-4 inline-grid place-items-center size-12 rounded-xl text-white shadow-md
                                      bg-gradient-to-br from-[#0f8fa0] via-[#28bccf] to-[#5ed6e3]">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#003B4A]">{f.title}</h3>
                      <p className="mt-2 text-gray-600">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}






     <section id="upcoming" className="bg-gray-50 py-20">
  <div className="max-w-7xl mx-auto px-6">
    {/* Section Heading */}
    <div className="text-center mb-12">
      <Reveal>
        <h2 className="text-3xl font-bold text-[#003B4A]">Upcoming Events</h2>
      </Reveal>
      <Reveal delay={100}>
        <p className="text-gray-600 mt-2">Discover our next big global summits and conferences.</p>
      </Reveal>
    </div>

   <section id="iams2026" className="bg-gray-50 py-20">
  <div className="max-w-5xl mx-auto px-4">
    {/* Event Card */}
    <div className="overflow-hidden rounded-3xl shadow-lg bg-white">
      {/* Image with overlays */}
      <div className="relative w-full h-80 md:h-[450px] overflow-hidden">
        <img
          src="/image.jpeg"
          alt="IAMS 2026"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Top-center main title */}
        <h2 className="absolute top-6 left-1/2 -translate-x-1/2 text-4xl md:text-6xl font-bold text-white drop-shadow-lg mt-[80px]">
          IAMS 2026
        </h2>

        {/* Bottom overlay info */}
       <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white text-lg md:text-lg">
  <Calendar className="w-5 h-5 md:w-6 md:h-6" />
  <span>April 9–10, 2026</span>
</div>

<div className="absolute bottom-4 right-4 flex items-center space-x-2 text-white text-lg md:text-lg  text-right">
  <MapPin className="w-5 h-5 md:w-6 md:h-6" />
  <span>Holiday Inn Aero City, Delhi, India</span>
</div>

      </div>

      {/* Event Details */}
      <div className="p-8 md:p-10 text-center">
        <h3 className="text-2xl font-semibold text-[#003B4A] mb-3">
          International Aviation Marketing Summit 2026
        </h3>
        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
          The Complete Next-Gen Aviation Commercial Ecosystem — bringing together global leaders,
          marketers, and innovators shaping the future of aviation commerce.
        </p>

        {/* Button */}
        <div className="mt-4">
          <a
            href="https://iams-2026.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#28bccf] text-white px-8 py-3 rounded-full font-medium hover:bg-[#1da6b8] transition duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  </div>
</section>


    {/* Joined Two Event Layout */}
    <div className="overflow-hidden rounded-3xl shadow-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {upcomingEvents.slice(0, 2).map((event, idx) => (
          <Reveal key={event.title} delay={(idx + 1) * 120}>
            <div
              className={`flex flex-col h-full ${
                idx === 0
                  ? "md:rounded-l-3xl"
                  : "md:rounded-r-3xl"
              }`}
            >
              {/* Event Image */}
              <div className="relative w-full h-72 md:h-[420px] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className=" transition-transform duration-500 hover:scale-105"
                  style={{height:"100%", width:"100%", objectFit:'conver'}}
                />
              </div>

              {/* Event Details */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-semibold text-[#003B4A] mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 flex-grow leading-relaxed">
                  {event.description}
                </p>
                 <p className="text-gray-600 flex-grow leading-relaxed">
                  {event.des2}
                </p>


                <div className="mt-5 flex items-center text-gray-500 text-sm space-x-5">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center text-[#28bccf] hover:text-[#1a98a7] font-medium"
                >
                  Learn more 
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* Previous Events */}
         <PreviewEventsSection/>
         
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="mt-10 grid grid-cols-1 gap-8">
            {previousEvents.map((event, idx) => (
              <Reveal key={event.title} delay={(idx + 1) * 90}>
                <EventCard event={event} variant="row" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

   

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B4A]">
              Ready to create your next event?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
              Tell us your objectives — we'll design and deliver an unforgettable experience.
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

export default EventsPage;
