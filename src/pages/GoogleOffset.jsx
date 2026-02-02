
import CrossfadeCarousel from "../Components/shared/CrossfadeCarousel";
import { Link } from "react-router-dom";
export default function GoogleOffet(){

     const whatsappUrl =
    "https://wa.me/9540111307?text=Hi! I'm interested in planning a MICE tour.";

      const bannerMedia  = [
    { type: "image", src: "/google-wellness/13.jpg" },
    { type: "image", src: "/google-wellness/14.jpg" },
    { type: "image", src: "/google-wellness/15.jpg"},
    { type: "image", src: "/google-wellness/16.jpg"},
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
      {/* Center Soft Circle with Logo */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 blur-2xl opacity-70">
          <div className="h-28 w-28 rounded-full bg-emerald-400/40 md:h-32 md:w-32" />
        </div>

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400/25 to-emerald-400/10 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(16,185,129,0.18)] md:h-28 md:w-28">
          {/* Replace with Google logo */}
          <img
            src="/google-wellness/googlelogo.webp"
            alt="Google"
            className="h-12 w-12 object-contain md:h-14 md:w-14"
          />
        </div>
      </div>

      {/* Heading */}
      <h1 className="max-w-3xl text-balance text-2xl font-semibold leading-tight md:text-4xl">
        Google Wellness Retreat
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
       We successfully conducted a rejuvenating wellness retreat at the Google Campus in Gurgaon, delivering a thoughtfully designed 2-hour guided session focused on relaxation and holistic well-being. The experience was highlighted by a calming sound healing practice, creating a peaceful and restorative environment. The session offered participants a meaningful pause from their routine, promoting balance, mindfulness, and overall wellness through a seamless and enriching experience.
      </p>

      {/* Bottom Info Cards */}
      <div className="mt-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Date */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 blur-2xl opacity-70" />
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              {/* Calendar Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2v4M16 2v4" />
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18" />
              </svg>
            </div>
            <div className="text-xs font-medium tracking-wide text-slate-500">DATE</div>
            <div className="mt-1 text-base font-semibold">
              16 September 2025
            </div>
          </div>

          {/* Venue */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 blur-2xl opacity-70" />
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              {/* Location Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
              </svg>
            </div>
            <div className="text-xs font-medium tracking-wide text-slate-500">VENUE</div>
            <div className="mt-1 text-base font-semibold">
              Google Campus, Gurgaon
            </div>
          </div>

          {/* Duration */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 blur-2xl opacity-70" />
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              {/* Clock Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="text-xs font-medium tracking-wide text-slate-500">DURATION</div>
            <div className="mt-1 text-base font-semibold">
              2-Hour Guided Session
            </div>
          </div>
        </div>

        {/* Footer Highlight */}
        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Relaxation • Holistic Well-being • Sound Healing Experience
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

