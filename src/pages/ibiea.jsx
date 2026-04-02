import CrossfadeCarousel from "../Components/shared/CrossfadeCarousel";
import { Link } from "react-router-dom";
export default function Ibiea() {
  const whatsappUrl =
    "https://wa.me/9540111307?text=Hi! I'm interested in planning a MICE tour.";



  const bannerMedia = [
     { type: "image", src: "/ibiea/21.jpg" },
    // { type: "image", src: "/ibiea/18.jpg" },
    // { type: "image", src: "/ibiea/22.jpg" },
    { type: "image", src: "/ibiea/17.jpg" },
    { type: "image", src: "/ibiea/19.jpg" },
    { type: "image", src: "/ibiea/20.jpg" },
   
  ];

  const galleryItems = [
     { type: "image", src: "/ibiea/21.jpg" },
    { type: "image", src: "/ibiea/18.jpg" },
    { type: "image", src: "/ibiea/22.jpg" },
    { type: "image", src: "/ibiea/17.jpg" },
    { type: "image", src: "/ibiea/19.jpg" },
    { type: "image", src: "/ibiea/20.jpg" },
   
    
  ];

  return (
    <>
      {/* Banner */}
      {/* Banner */}
<div className="relative w-full h-[250px] sm:h-[400px] md:h-[520px]">

  {/* Overlay / Wallpaper */}
  <div className="pointer-events-none absolute inset-0 z-10
    bg-gradient-to-b 
    from-black/60 
    via-black/40 
    to-black/20"
  />

  {/* Carousel */}
  <CrossfadeCarousel
    media={bannerMedia}
    alt="Ibiea 2025 Oman"
    interval={2000}
    showDots
    priority
  />
</div>


      {/* Content Section */}
      <section className="w-full bg-white text-black py-20 px-4">
        {/* Heading */}

              <div className="flex justify-center mb-6">
    <div className="w-30 h-30 rounded-full bg-white shadow-md flex items-center justify-center">
      <img
        src="/ibiea/ibiealogo.png"   // 👉 yaha apna logo path do
        alt="Google"
        className="w-full h-full object-contain"
      />
    </div>
  </div>

        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            IBIEA 2025 Oman
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
            We successfully organized the IBIEA event in Oman, taking a group of
            50 participants from India for a memorable international experience.
            The program featured a prestigious awards function along with a
            well-planned 2-night, 3-day stay. Beyond the formal ceremony, we
            curated sightseeing and local experiences across Oman, creating a
            perfect balance of celebration, networking, and leisure. The event
            delivered a seamless, enriching, and truly memorable experience for
            all attendees.
          </p>
        </div>

        {/* Info Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Date */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border border-black flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="font-semibold">May 29, 2025</p>
            <span className="text-sm text-gray-500">Event Date</span>
          </div>

          {/* Venue */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border border-black flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z"
                />
              </svg>
            </div>
            <p className="font-semibold">Grand Hyatt Muscat</p>
            <span className="text-sm text-gray-500">Event Venue</span>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border border-black flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z"
                />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <p className="font-semibold">Muscat, Oman</p>
            <span className="text-sm text-gray-500">Location</span>
          </div>
        </div>
      </section>



    <section className="w-full bg-white py-20 px-4">

  {/* Grid */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {galleryItems.map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-xl overflow-hidden
                   transition-transform duration-300
                   hover:-translate-y-1 hover:shadow-lg"
      >
        {/* Image */}
        <div className="w-full h-[260px] overflow-hidden">
          <img
            src={item.src}
            alt=""
            className="w-full h-full object-cover
                       transition-transform duration-500
                       hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    ))}
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


    </>
  );
}
