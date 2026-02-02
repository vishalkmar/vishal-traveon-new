
import CrossfadeCarousel from "../Components/shared/CrossfadeCarousel";

import { Link } from "react-router-dom";
export default function Coursera(){

     const whatsappUrl =
    "https://wa.me/9540111307?text=Hi! I'm interested in planning a MICE tour.";

      const bannerMedia  = [
    { type: "image", src: "/coursera/7.jpg" },
    { type: "image", src: "/coursera/8.jpg" },
    { type: "image", src: "/coursera/9.jpg" },
    { type: "image", src: "/coursera/10.jpg" },
      { type: "image", src: "/coursera/11.jpg" },
        { type: "image", src: "/coursera/12.jpg" }
         
  ];

     return(<>

             <div className="relative w-full h-[350px] sm:h-[500px] md:h-[600px]">
               <CrossfadeCarousel
                 media={bannerMedia}
                 alt="MICE Tours"
                 interval={2500}
                 showDots
                 priority
               />
             </div>
<section className="w-full bg-white text-slate-900">
  <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
    <div className="flex flex-col items-center text-center">
      {/* Center Blue Circle with Logo */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 blur-2xl opacity-70">
          <div className="h-28 w-28 rounded-full bg-sky-500/45 md:h-32 md:w-32" />
        </div>

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-sky-500/25 to-sky-500/10 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(2,132,199,0.18)] md:h-28 md:w-28">
          {/* Replace with Coursera logo */}
          <img
            src="/coursera/courseralogo.png"
            alt="Coursera"
            className="h-12 w-12 object-contain md:h-14 md:w-14"
          />
        </div>
      </div>

      {/* Heading */}
      <h1 className="max-w-3xl text-balance text-2xl font-semibold leading-tight md:text-4xl">
        2-Day Offsite Conference for Coursera
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
       We successfully organized a 2-day offsite conference for Coursera, delivering complete end-to-end management to ensure a seamless and highly productive experience. The program included accommodation, conference setup, curated meals, logistics, and on-ground hospitality, allowing participants to focus entirely on collaboration and strategic discussions. Hosted in a serene resort setting, the offsite created an ideal balance of focused work, team engagement, and comfort, resulting in a well-structured, impactful, and memorable corporate experience for all attendees.
      </p>

      {/* Bottom Stats / Info */}
      <div className="mt-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Dates */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-100 blur-2xl opacity-70" />
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              {/* Calendar Icon (inline SVG) */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 2v4M16 2v4" />
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 14h4" />
              </svg>
            </div>
            <div className="text-xs font-medium tracking-wide text-slate-500">DATES</div>
            <div className="mt-1 text-base font-semibold text-slate-900">
              17–18 November 2025
            </div>
          </div>

          {/* Venue */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-100 blur-2xl opacity-70" />
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              {/* Map Pin Icon (inline SVG) */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
              </svg>
            </div>
            <div className="text-xs font-medium tracking-wide text-slate-500">VENUE</div>
            <div className="mt-1 text-base font-semibold text-slate-900">
              Lemon Tree Tarudhan Valley
            </div>
          </div>

          {/* Team */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-100 blur-2xl opacity-70" />
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              {/* Users Icon (inline SVG) */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="text-xs font-medium tracking-wide text-slate-500">TEAM SIZE</div>
            <div className="mt-1 text-base font-semibold text-slate-900">50+ Members</div>
          </div>
        </div>

        {/* Optional: small line under stats */}
        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-sky-50 px-4 py-3 text-sm text-slate-700">
          Accommodation • Conference Setup • Meals • Logistics • Hospitality
        </div>
      </div>
    </div>
  </div>
</section>


              <div className="bg-gray-100 py-16">
                                  <div className="max-w-screen-xl mx-auto px-4 text-center">
                                    <h2 className="text-3xl font-bold mb-4">Want to Be Part of Our Story?</h2>
                                    <p className="text-gray-600 mb-8">Let us help you create your own memorable experiences</p>
                                    <Link
                                      to={whatsappUrl}
                                      className="bg-[#28bccf] text-white px-8 py-3 rounded-full hover:bg-[#22a8b9] transition-colors inline-block"
                                    >
                                      Get in Touch
                                    </Link>
                                  </div>
             </div>
     </>)
}

