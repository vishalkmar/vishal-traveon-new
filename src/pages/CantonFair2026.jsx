import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import {
  MapPin,
  Clock,
  Users,
  Building2,
  Plus,
  Minus,
  Cpu,
  Factory,
  HardHat,
  Sofa,
  ShoppingBag,
  HeartPulse,
  Shirt,
  Globe2,
  Lightbulb,
  Car,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Plane,
  Hotel,
  UserCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Headphones,
  Gift,
  RefreshCw,
  Award,
} from "lucide-react";

const WHATSAPP_NUMBER = "919540111307";
const HERO_IMAGE = "/gallery/exhibition.jpg";

// TODO: apne live domain se replace karein — canonical + Open Graph URLs isi se bante hain.
const SITE_URL = "https://traveon.in";
const PAGE_PATH = "/canton-fair-2026";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const SEO = {
  title: "Canton Fair 2026: Dates, Registration & Guangzhou Tour Package",
  description:
    "Canton Fair 2026 (China Import & Export Fair, Guangzhou): phase-wise dates, registration and entry-pass help, visa, flights and hotels near Pazhou. Get group rates.",
  keywords: [
    "canton fair",
    "guangzhou fair",
    "china fair",
    "china expo",
    "canton fair dates",
    "canton fair registration",
    "canton expo",
  ],
  image: `${SITE_URL}${HERO_IMAGE}`,
};

const stats = [
  { value: "1.5M+", label: "Expo Area (sqm)" },
  { value: "30K+", label: "Exhibitors" },
  { value: "250K+", label: "Global Buyers" },
  { value: "220+", label: "Countries & Regions" },
];

const trustPoints = [
  { icon: ShieldCheck, title: "Verified Group Rates", desc: "Best negotiated pricing on flights, hotels and Canton Fair passes." },
  { icon: Plane, title: "Flights & China Visa Handled", desc: "End-to-end visa assistance and convenient flight scheduling to Guangzhou." },
  { icon: Hotel, title: "Stay Near Pazhou Complex", desc: "Handpicked hotels minutes away from the Guangzhou Fair venue." },
  { icon: UserCheck, title: "Dedicated Trip Manager", desc: "A single point of contact for your group, before and during the trip." },
];

const eventPhases = [
  {
    label: "Phase 1",
    value: "15 – 19 October 2026",
    tag: "Electronics & Machinery",
    startDate: "2026-10-15",
    endDate: "2026-10-19",
  },
  {
    label: "Phase 2",
    value: "23 – 27 October 2026",
    tag: "Consumer Goods & Home",
    startDate: "2026-10-23",
    endDate: "2026-10-27",
  },
  {
    label: "Phase 3",
    value: "31 October – 4 November 2026",
    tag: "Textiles & Medical",
    startDate: "2026-10-31",
    endDate: "2026-11-04",
  },
];

const eventInfo = [
  { icon: Building2, label: "Venue", value: "China Import & Export Fair Complex (Pazhou)" },
  { icon: Clock, label: "Timings", value: "Daily 9:30 AM – 6:00 PM" },
  { icon: MapPin, label: "Location", value: "Guangzhou, China" },
  { icon: Users, label: "Exhibitors", value: "30,000+ Suppliers" },
  { icon: Users, label: "Buyers", value: "250,000+ Visitors" },
  { icon: Globe2, label: "Reach", value: "220+ Countries" },
];

const quickFacts = [
  { icon: ShieldCheck, label: "Visa Assistance" },
  { icon: Plane, label: "Flights Included" },
  { icon: Hotel, label: "Hotel Near Venue" },
  { icon: UserCheck, label: "Trip Manager" },
];

const categories = [
  { icon: Cpu, title: "Electronics & Appliances", desc: "Consumer electronics, smart home and electrical equipment." },
  { icon: Factory, title: "Industrial Machinery", desc: "Manufacturing equipment, automation systems and tools." },
  { icon: HardHat, title: "Building Materials", desc: "Construction, sanitary ware, hardware and interior products." },
  { icon: Sofa, title: "Home Decorations", desc: "Furniture, lighting, decorative items and household products." },
  { icon: ShoppingBag, title: "Consumer Goods", desc: "Daily-use products, gifts, toys, stationery and lifestyle items." },
  { icon: HeartPulse, title: "Medical & Healthcare", desc: "Medical devices, healthcare products and wellness solutions." },
  { icon: Shirt, title: "Textiles & Fashion", desc: "Garments, fabrics, footwear, bags and fashion accessories." },
  { icon: Globe2, title: "International Trade", desc: "Import-export opportunities, sourcing partnership and global networking." },
  { icon: Lightbulb, title: "Innovation Showcase", desc: "Latest technologies, smart manufacturing and innovative products." },
  { icon: Car, title: "Vehicles & Spare Parts", desc: "Automobiles, auto parts, accessories and transport equipment." },
];

const faqs = [
  {
    title: "What are the Canton Fair 2026 dates?",
    text: "Canton Fair 2026 runs across three phases in Guangzhou: Phase 1 from 15–19 October 2026 (electronics and machinery), Phase 2 from 23–27 October 2026 (consumer goods and home products), and Phase 3 from 31 October–4 November 2026 (textiles and medical supplies). Each phase closes for a changeover, so pick the phase that matches the products you want to source.",
  },
  {
    title: "Where is the Canton Fair held in Guangzhou?",
    text: "The Guangzhou Fair takes place at the China Import & Export Fair Complex in Pazhou, Guangzhou, China. It is the largest exhibition venue in Asia, spanning over 1.5 million sqm, and the halls are open daily from 9:30 AM to 6:00 PM during each phase.",
  },
  {
    title: "How does Canton Fair registration work for buyers?",
    text: "Canton Fair registration must be completed in advance: buyers submit their business details and passport copy, receive an invitation letter, and collect a buyer badge on arrival. We handle the full registration process for you, including the invitation letter needed for your China visa application.",
  },
  {
    title: "Do I need a visa to attend the China Expo?",
    text: "Yes, most international buyers need a Chinese business (M) visa to attend the China Import & Export Fair. Our team provides complete documentation and visa assistance, though final approval always rests with the Chinese consulate or embassy.",
  },
  {
    title: "Is the Canton Fair the same as the China Import & Export Fair?",
    text: "Yes. The Canton Fair, also called the Canton Expo, the Guangzhou Fair or simply the China Fair, is the official China Import & Export Fair. It has been held twice a year in Guangzhou since 1957 and is the world's largest trade fair by exhibitor count.",
  },
  {
    title: "What is included in the Canton Fair 2026 tour package?",
    text: "Our package covers return flights, hotels close to the Pazhou complex, China visa assistance, Canton Fair registration and entry passes, airport transfers, and a dedicated trip manager who travels with your group.",
  },
  {
    title: "Which products can I source at Canton Fair 2026?",
    text: "The fair covers more than 30,000 exhibitors across electronics and appliances, industrial machinery, building materials, home decoration, consumer goods, medical and healthcare products, textiles and fashion, and vehicles and spare parts.",
  },
  {
    title: "How do I book a seat on the Canton Expo group departure?",
    text: "Send an enquiry through the form on this page or message us on WhatsApp. A registration fee of ₹75,000 per person confirms your booking, with full payment due four weeks before departure. Group departures fill up early, so booking ahead of the Canton Fair dates is recommended.",
  },
];

const termsSections = [
  {
    title: "Booking and Payment",
    points: [
      "A registration fee of ₹75,000 per person is required at the time of booking (Non-Refundable).",
      "To confirm your booking, please provide the complete registration form along with all required documents.",
      "Full payment must be received 4 weeks before departure to secure your spot.",
      "Late payment may result in a change of your departure date or cancellation of the booking.",
    ],
  },
  {
    title: "Hotels",
    text: "Hotel category mentioned in the itinerary is subject to availability at the time of confirmation. In case of non-availability, an alternate hotel of the same or equivalent category will be arranged. Check-in and check-out timings are governed by individual hotel policies.",
  },
  {
    title: "Group Travel",
    text: "This package is designed for group departures. Itinerary, inclusions and pricing may vary for FIT (Free Independent Traveler) or custom groups. Group rates are applicable only for the minimum group size specified for this tour.",
  },
  {
    title: "Seat Upgrades",
    text: "Premium economy and business class seat upgrades are available on request at an additional cost, subject to airline availability and fare rules at the time of booking.",
  },
  {
    title: "Pricing",
    text: "Prices quoted are per person on a twin-sharing basis and are subject to change until full payment and ticketing are completed, due to currency fluctuation, fuel surcharge or airfare revision.",
  },
  {
    title: "Itinerary Changes",
    text: "The itinerary is subject to change due to fair schedule updates, flight timings, weather conditions or circumstances beyond our control. An equivalent alternative will be arranged wherever possible.",
  },
  {
    title: "Minimum Group Size",
    text: "A minimum number of confirmed participants is required for this package to operate at group rates. If the minimum group size is not met, the package terms may be revised to FIT pricing.",
  },
  {
    title: "Check-in/Out Times",
    text: "Standard hotel check-in time is 2:00–3:00 PM and check-out time is 11:00 AM–12:00 PM. Early check-in or late check-out is subject to hotel availability and may attract additional charges.",
  },
  {
    title: "Currency Fluctuations",
    text: "The package cost is calculated based on the prevailing exchange rate at the time of quotation. Any significant fluctuation before full payment is received may lead to a revision in the final cost.",
  },
  {
    title: "Hotel Rates",
    text: "Hotel rates are as contracted with our hotel partners at the time of booking and are subject to change without prior notice until full payment and confirmation are received.",
  },
  {
    title: "Flight Delays/Cancellations",
    text: "We are not liable for delays or cancellations caused by airlines. Our team will assist with rebooking wherever possible; any additional costs incurred will be borne by the traveler.",
  },
  {
    title: "Trade Fairs",
    text: "Entry passes and exhibitor/visitor badges for the Canton Fair are subject to the fair organizer's rules, invitation requirements and visitor registration guidelines, which must be completed in advance.",
  },
  {
    title: "Single Travelers",
    text: "Single occupancy rooms are available at an additional supplement cost. Twin-sharing rooms will be assigned as per the group list wherever applicable.",
  },
  {
    title: "Visa Information",
    text: "We provide complete visa assistance and documentation support; however, visa approval remains at the sole discretion of the Chinese consulate/embassy. Visa fees and rejections, if any, are non-refundable.",
  },
  {
    title: "Cancellation Policy",
    text: "Cancellation charges apply as per airline, hotel and fair registration policies. The registration fee is non-refundable, and slab-based cancellation charges apply closer to the departure date.",
  },
  {
    title: "Additional Information",
    text: "Passports must be valid for at least 6 months from the date of travel. Travel insurance is strongly recommended. Personal expenses, tips and items not mentioned in the inclusions are not covered.",
  },
];

/* ---------------- SEO ---------------- */

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Canton Fair 2026 — China Import and Export Fair",
  alternateName: ["Guangzhou Fair", "Canton Expo", "China Import and Export Fair"],
  description:
    "The Canton Fair 2026 is the world's largest import and export trade fair, held in three phases at the China Import & Export Fair Complex in Guangzhou, China.",
  startDate: eventPhases[0].startDate,
  endDate: eventPhases[eventPhases.length - 1].endDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  image: [SEO.image],
  url: PAGE_URL,
  location: {
    "@type": "Place",
    name: "China Import & Export Fair Complex (Pazhou)",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 380 Yuejiang Zhong Road, Haizhu District",
      addressLocality: "Guangzhou",
      addressRegion: "Guangdong",
      addressCountry: "CN",
    },
  },
  subEvent: eventPhases.map((p) => ({
    "@type": "Event",
    name: `Canton Fair 2026 ${p.label} — ${p.tag}`,
    startDate: p.startDate,
    endDate: p.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "China Import & Export Fair Complex (Pazhou)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Guangzhou",
        addressCountry: "CN",
      },
    },
  })),
  offers: {
    "@type": "Offer",
    name: "Canton Fair 2026 Tour Package",
    url: `${PAGE_URL}#enquire`,
    availability: "https://schema.org/InStock",
    category: "Trade fair tour package with flights, hotel, visa and fair registration",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.title,
    acceptedAnswer: { "@type": "Answer", text: f.text },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Trade Fairs", item: `${SITE_URL}/trade-fairs` },
    { "@type": "ListItem", position: 3, name: "Canton Fair 2026", item: PAGE_URL },
  ],
};

/**
 * Sets head tags for this route without any extra dependency.
 * Tags this hook creates are removed on unmount; tags that already existed in
 * index.html are updated in place and left as-is, so every route must set its own.
 */
function useSeo({ title, description, keywords, canonical, image, jsonLd }) {
  useEffect(() => {
    const created = [];
    const previousTitle = document.title;
    document.title = title;

    const upsertMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute("content", content);
    };

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords.join(", "));
    upsertMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "Canton Fair Tours");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:locale", "en_IN");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    let linkEl = document.head.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.setAttribute("rel", "canonical");
      document.head.appendChild(linkEl);
      created.push(linkEl);
    }
    linkEl.setAttribute("href", canonical);

    const scriptEl = document.createElement("script");
    scriptEl.type = "application/ld+json";
    scriptEl.text = JSON.stringify(jsonLd);
    document.head.appendChild(scriptEl);
    created.push(scriptEl);

    return () => {
      document.title = previousTitle;
      created.forEach((el) => el.remove());
    };
  }, [title, description, keywords, canonical, image, jsonLd]);
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, delay, ease: "easeOut" },
  };
}

function EnquiryForm() {
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile) {
      alert("Please fill in your name, email and mobile number");
      return;
    }

    const message = `Hi! I'm interested in the Canton Fair 2026 Tour Package.

Name: ${formData.name}
Email: ${formData.email}
Mobile: ${formData.mobile}
Requirements: ${formData.message || "N/A"}

Please get back to me with more details.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setFormData({ name: "", email: "", mobile: "", message: "" });
  };

  return (
    <div
      id="enquire"
      className="rounded-[28px] bg-white/95 backdrop-blur-xl p-1.5 shadow-[0_30px_80px_rgba(3,25,33,0.45)] ring-1 ring-white/40"
    >
      <div className="rounded-[24px] bg-gradient-to-br from-[#159aac] to-[#0f7a89] px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Canton Fair 2026 Registration Enquiry</h2>
            <p className="text-[11px] text-white/75">Exclusive group rates &amp; China visa support</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-3.5">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <label htmlFor="cf-name" className="sr-only">
            Your name
          </label>
          <input
            id="cf-name"
            type="text"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#28bccf] focus:border-transparent transition"
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <label htmlFor="cf-email" className="sr-only">
            Your email
          </label>
          <input
            id="cf-email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#28bccf] focus:border-transparent transition"
            required
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <label htmlFor="cf-mobile" className="sr-only">
            Your mobile number
          </label>
          <input
            id="cf-mobile"
            type="tel"
            name="mobile"
            autoComplete="tel"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#28bccf] focus:border-transparent transition"
            required
          />
        </div>

        <label htmlFor="cf-message" className="sr-only">
          Your travel requirements
        </label>
        <textarea
          id="cf-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us your travel requirements..."
          rows={3}
          className="w-full px-3.5 py-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#28bccf] focus:border-transparent transition resize-none"
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] text-white font-semibold py-3.5 rounded-xl hover:shadow-[0_14px_30px_rgba(40,188,207,0.4)] hover:brightness-105 transition-all"
        >
          <FaWhatsapp className="w-4 h-4" />
          Get a Callback
        </button>

        <p className="text-center text-[11px] text-slate-400 pt-1">
          100% secure · No spam · Response within 24 hrs
        </p>
      </form>
    </div>
  );
}

function AccordionItem({ section, index, isOpen, onToggle, isLast, headingLevel = "h3" }) {
  const Heading = headingLevel;
  const panelId = `acc-panel-${headingLevel}-${index}`;
  const buttonId = `acc-btn-${headingLevel}-${index}`;

  return (
    <div className={`${isLast ? "" : "border-b border-slate-100"}`}>
      <Heading>
        <button
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-4 px-3 sm:px-4 py-4 sm:py-5 text-left"
        >
          <span className="flex items-center gap-3 sm:gap-4 min-w-0">
            <span
              className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-colors duration-300 ${
                isOpen ? "bg-[#28bccf] text-white" : "bg-[#28bccf]/10 text-[#159aac]"
              }`}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[15px] sm:text-lg font-bold text-slate-900">{section.title}</span>
          </span>
          <span
            className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              isOpen ? "bg-[#28bccf] border-[#28bccf] text-white" : "bg-white border-slate-200 text-[#159aac]"
            }`}
            aria-hidden="true"
          >
            {isOpen ? <Minus size={15} /> : <Plus size={15} />}
          </span>
        </button>
      </Heading>

      {/* Answer stays in the DOM (collapsed via grid-rows) so crawlers always read it. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-3 sm:px-4 pb-4 sm:pb-5">
            <div className="rounded-2xl bg-[#f7fcfc] border border-slate-100 p-4 sm:p-5">
              {section.points ? (
                <ul className="space-y-3">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#28bccf] text-white">
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-7 text-slate-600">{section.text}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CantonFair2026() {
  const [openTerm, setOpenTerm] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  useSeo({
    title: SEO.title,
    description: SEO.description,
    keywords: SEO.keywords,
    canonical: PAGE_URL,
    image: SEO.image,
    jsonLd: [eventSchema, faqSchema, breadcrumbSchema],
  });

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! Can I get more info on this Canton Fair package ?"
  )}`;

  return (
    <div className="bg-white">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Canton Fair exhibition halls at the China Import & Export Fair Complex in Pazhou, Guangzhou"
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#031e22]/95 via-[#0b3a41]/88 to-[#159aac]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(40,188,207,0.35),transparent_55%)]" />
        </div>

        {/* Wave transition into the white section below */}
        <svg
          className="absolute -bottom-px left-0 w-full h-14 sm:h-20 text-white pointer-events-none"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,40 C240,90 480,0 720,20 C960,40 1200,90 1440,50 L1440,100 L0,100 Z"
          />
        </svg>

        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 pt-32 sm:pt-36 lg:pt-40 pb-40 sm:pb-48">
          <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-10 lg:gap-14 items-center">
            {/* Left: title & description */}
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-white ring-1 ring-white/25">
                <Sparkles className="w-3.5 h-3.5 text-[#7fe3ee]" />
                The World's Largest Import &amp; Export Trade Fair
              </span>

              <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-[#e11d2e] to-[#f5c518]" />

              <h1
                id="hero-title"
                className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-white tracking-tight"
              >
                Canton Fair 2026
                <span className="block bg-gradient-to-r from-[#7fe3ee] via-[#c9f4f8] to-white bg-clip-text text-transparent">
                  Guangzhou Tour Package
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-white/85">
                The Canton Fair — also known as the Guangzhou Fair or Canton Expo — is China's biggest
                import and export trade fair. Canton Fair 2026 will be held in three phases from{" "}
                <time dateTime="2026-10-15">15 October</time> to{" "}
                <time dateTime="2026-11-04">4 November 2026</time> at the China Import &amp; Export Fair
                Complex, bringing together 30,000+ manufacturers and suppliers across electronics,
                machinery, textiles, healthcare and consumer goods. We handle your Canton Fair
                registration, China visa, flights and hotels near the venue.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="#enquire"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] text-white font-semibold px-6 py-3.5 rounded-full shadow-[0_16px_40px_rgba(40,188,207,0.45)] hover:brightness-110 transition-all"
                >
                  Enquire Now <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-3.5 rounded-full ring-1 ring-white/30 hover:bg-white/20 transition-all"
                >
                  <FaWhatsapp className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Right: Enquiry form */}
            <motion.div {...fadeUp(0.15)}>
              <EnquiryForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS + TRUST (one combined block, overlaps hero) ---------------- */}
      <section className="relative w-full bg-white pb-14 sm:pb-20" aria-label="Canton Fair scale and trip inclusions">
        <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 -mt-24 sm:-mt-28 z-10">
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-[28px] sm:rounded-[32px] bg-white shadow-[0_28px_70px_rgba(3,25,33,0.22)] ring-1 ring-slate-100 overflow-hidden"
          >
            {/* Stat row — top half sits inside the hero banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 p-5 sm:p-7">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#159aac] to-[#28bccf] bg-clip-text text-transparent">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs font-medium text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Trust row — same card, directly attached below via a divider */}
            <div className="border-t border-slate-100 bg-[#fafdfd] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px sm:gap-0 divide-y sm:divide-y-0 divide-slate-100">
              {trustPoints.map((t, i) => (
                <div
                  key={t.title}
                  className={`p-5 sm:p-6 hover:bg-white transition-colors duration-300 ${
                    i > 0 ? "sm:border-l sm:border-slate-100" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#44B3C4] to-[#2a96ab] text-white shadow-sm">
                    <t.icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-slate-800">{t.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">{t.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- EVENT DETAILS + CATEGORIES ---------------- */}
      <section className="w-full bg-[#f7fcfc] py-14 sm:py-20" aria-labelledby="dates-title">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
            {/* Event Details */}
            <motion.div
              {...fadeUp(0)}
              className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
            >
              {/* Decorative corner glow */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#28bccf]/8 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#0f8b8d]/6 blur-3xl" />

              <div className="relative">
                <span className="inline-block rounded-full bg-[#28bccf]/10 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-[#159aac] uppercase">
                  Event Overview
                </span>
                <h2 id="dates-title" className="mt-3 text-xl sm:text-2xl font-bold text-slate-900">
                  Canton Fair 2026 Dates &amp; Venue
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  China Import &amp; Export Fair, Pazhou — Guangzhou, China
                </p>
              </div>

              {/* Fair phases timeline */}
              <div className="relative mt-7">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-4">
                  Canton Fair Dates by Phase
                </h3>
                <div className="relative">
                  <div className="absolute left-[9px] top-1.5 bottom-1.5 w-px bg-gradient-to-b from-[#28bccf] via-[#28bccf]/40 to-transparent" />
                  <ul className="space-y-5">
                    {eventPhases.map((p) => (
                      <li key={p.label} className="relative pl-7">
                        <span
                          className="absolute left-0 top-0.5 h-[19px] w-[19px] rounded-full bg-white ring-4 ring-[#28bccf]/15 border-2 border-[#28bccf]"
                          aria-hidden="true"
                        />
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="text-[11px] font-bold uppercase tracking-wide text-[#159aac]">{p.label}</span>
                          <time dateTime={p.startDate} className="text-sm font-semibold text-slate-800">
                            {p.value}
                          </time>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{p.tag}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Other event info */}
              <div className="relative mt-7 pt-6 border-t border-slate-100">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-4">
                  Guangzhou Fair Key Information
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                  {eventInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <div
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#28bccf]/10 text-[#159aac]"
                        aria-hidden="true"
                      >
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{item.label}</dt>
                        <dd className="text-xs sm:text-sm font-medium text-slate-800 leading-tight">{item.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Quick facts */}
              <ul className="relative mt-7 flex flex-wrap gap-2">
                {quickFacts.map((f) => (
                  <li
                    key={f.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#f7fcfc] border border-[#28bccf]/20 px-3 py-1.5 text-[11px] font-medium text-[#0f7a89]"
                  >
                    <f.icon className="w-3 h-3" aria-hidden="true" />
                    {f.label}
                  </li>
                ))}
              </ul>

              {/* Spacer pushes CTA to the bottom, keeping the card visually balanced */}
              <div className="flex-1 min-h-6" />

              {/* CTA */}
              <div className="relative mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a
                  href="#enquire"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:shadow-[0_14px_30px_rgba(40,188,207,0.35)] transition-all"
                >
                  Reserve Your Spot <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-3 rounded-xl hover:border-[#28bccf]/40 hover:text-[#159aac] transition-all"
                >
                  <FaWhatsapp className="w-4 h-4" /> Chat
                </a>
              </div>
            </motion.div>

            {/* Exhibition Categories */}
            <div>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="inline-block rounded-full bg-[#28bccf]/10 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-[#159aac] uppercase">
                  Sourcing Opportunities
                </span>
                <span className="inline-block rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">
                  {categories.length} Categories
                </span>
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
                Exhibition Categories at the China Expo
              </h2>
              <p className="mt-2 text-sm text-slate-500 mb-6">
                Explore the major product categories and sourcing opportunities across all three phases of
                Canton Fair 2026 in Guangzhou.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {categories.map((cat, i) => (
                  <motion.article
                    key={cat.title}
                    {...fadeUp((i % 4) * 0.06)}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#f7fcfc] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_20px_45px_rgba(40,188,207,0.22)]"
                  >
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#28bccf]/0 group-hover:bg-[#28bccf]/15 blur-2xl transition-colors duration-300" />

                    <div className="relative flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#44B3C4] to-[#2a96ab] text-white shadow-[0_10px_24px_rgba(40,188,207,0.35)] group-hover:scale-110 transition-transform duration-300">
                        <cat.icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200 group-hover:text-[#28bccf]/50 transition-colors" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="relative mt-4 text-sm sm:text-[15px] font-bold text-slate-800">{cat.title}</h3>
                    <span className="relative block mt-2 mb-2.5 h-px w-8 bg-[#28bccf]/40 group-hover:w-12 transition-all duration-300" />
                    <p className="relative text-xs sm:text-sm leading-5 text-slate-500">{cat.desc}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="w-full bg-white py-14 sm:py-20" aria-labelledby="faq-title">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#28bccf]/20 bg-[#28bccf]/10 px-4 py-2 text-[11px] sm:text-xs font-semibold tracking-[0.1em] text-[#159aac] uppercase">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </span>
            <h2 id="faq-title" className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900">
              Canton Fair 2026 FAQs
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500">
              Everything buyers ask about Canton Fair dates, Canton Fair registration, the Guangzhou venue,
              China visas and what our tour package covers.
            </p>
          </div>

          <div className="mt-10 rounded-[28px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.06)] px-1 sm:px-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.title}
                section={faq}
                index={i}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                isLast={i === faqs.length - 1}
              />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Planning a different show? Browse our other{" "}
            <Link to="/trade-fairs" className="font-semibold text-[#159aac] underline-offset-2 hover:underline">
              China trade fair tours
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="font-semibold text-[#159aac] underline-offset-2 hover:underline">
              talk to a trip manager
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ---------------- TERMS & CONDITIONS ---------------- */}
      <section className="relative w-full overflow-hidden bg-[#f8fbfc] py-14 sm:py-20" aria-labelledby="terms-title">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[-120px] h-96 w-96 rounded-full bg-[#28bccf]/10 blur-3xl" />
          <div className="absolute bottom-0 right-[-120px] h-96 w-96 rounded-full bg-[#0f8b8d]/8 blur-3xl" />
          <div className="absolute top-6 right-[8%] hidden lg:grid grid-cols-6 gap-2 opacity-40" aria-hidden>
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#28bccf]/50" />
            ))}
          </div>
        </div>

        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
            {/* Left: intro + help cards (sticky) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="lg:h-[660px] flex flex-col">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#28bccf]/20 bg-[#28bccf]/10 px-4 py-2 text-xs sm:text-sm font-semibold tracking-[0.1em] text-[#159aac] uppercase w-fit">
                  <HelpCircle className="w-4 h-4" />
                  Know Before You Go
                </span>

                <h2 id="terms-title" className="mt-5 text-4xl sm:text-5xl font-extrabold leading-[1.05] text-slate-900">
                  Terms &amp;
                  <br />
                  Conditions
                </h2>

                <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-slate-500">
                  Review booking policies, payment schedules, cancellation rules, refunds,
                  liabilities and other important terms before you travel with us to Canton Fair 2026.
                </p>

                {/* Decorative flight path */}
                <div className="relative hidden sm:block h-14 mt-2" aria-hidden="true">
                  <svg viewBox="0 0 260 60" fill="none" className="absolute left-1 top-0 w-56 h-14 text-[#28bccf]/35">
                    <path
                      d="M4 50 C 70 55, 110 10, 180 14 S 240 8, 254 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="5 7"
                      strokeLinecap="round"
                    />
                  </svg>
                  <Plane className="absolute left-[210px] top-0 w-6 h-6 text-[#159aac] rotate-45" />
                </div>

                {/* Help cards */}
                <div className="mt-3 space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-4 sm:p-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#44B3C4] to-[#2a96ab] text-white shadow-sm">
                      <Headphones className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">Need Help?</h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-snug">
                        Our travel experts are available 24/7 to assist you.
                      </p>
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[#28bccf]/30 text-[#159aac] text-xs font-semibold px-3.5 py-2 hover:bg-[#28bccf]/10 transition-colors"
                    >
                      Contact <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-4 sm:p-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#44B3C4] to-[#2a96ab] text-white shadow-sm">
                      <Gift className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">Group &amp; Custom Plans</h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-snug">
                        Flexible options, secure payments, peace of mind.
                      </p>
                    </div>
                    <a
                      href="#enquire"
                      className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[#28bccf]/30 text-[#159aac] text-xs font-semibold px-3.5 py-2 hover:bg-[#28bccf]/10 transition-colors"
                    >
                      Enquire <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex-1 min-h-4" />

                {/* Trust row */}
                <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-2">
                  {[
                    { icon: ShieldCheck, label: "Secure Payments" },
                    { icon: RefreshCw, label: "Flexible Bookings" },
                    { icon: Award, label: "Trusted by Thousands" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#28bccf]/10 text-[#159aac]">
                        <t.icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-600">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: scrollable accordion */}
            <div className="cf-scroll lg:h-[660px] lg:overflow-y-auto rounded-[28px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.06)] px-1 sm:px-2">
              {termsSections.map((section, i) => (
                <AccordionItem
                  key={section.title}
                  section={section}
                  index={i}
                  isOpen={openTerm === i}
                  onToggle={() => setOpenTerm(openTerm === i ? -1 : i)}
                  isLast={i === termsSections.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#0f8b8d] via-[#159aac] to-[#28bccf] py-16 sm:py-20" aria-labelledby="cta-title">
        <div className="absolute inset-0 opacity-20 pointer-events-none [background-image:radial-gradient(circle,rgba(255,255,255,0.6)_1.5px,transparent_1.5px)] [background-size:22px_22px]" />
        <div className="relative max-w-screen-xl mx-auto px-4 text-center">
          <h2 id="cta-title" className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Book Your Canton Fair 2026 Registration
          </h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto">
            Let our team plan your seamless trade fair journey to the Guangzhou Fair — flights, China visa,
            hotels near Pazhou and Canton Expo entry passes, all handled for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#159aac] font-semibold px-8 py-3.5 rounded-full hover:bg-slate-100 shadow-lg transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" /> Get in Touch
            </a>
            <a
              href="#enquire"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full ring-1 ring-white/30 hover:bg-white/20 transition-all"
            >
              Enquire Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
