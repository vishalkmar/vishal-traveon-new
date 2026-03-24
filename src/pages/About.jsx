import { useState, useEffect } from "react";
import Hero from "../Components/HeroHome.jsx";
import TrustedBy from "../Components/TrustedBy";
import { ArrowRight } from "lucide-react";

export default function AboutUs() {
  const carouselItems = [
    {
      image: "/iccictimages/ic2.jpg",
      title: "About Traveon",
      link:"/packages",
      buttonText: "Explore Packages",
    },
    {
      image: "/coursera/12.jpg",
      title: "About Traveon",
      link:"/packages",
      buttonText: "Explore Packages",
    },
    {
      image: "/google-wellness/13.jpg",
     title: "About Traveon",
      link:"/packages",
      buttonText: "Explore Packages",
    },
    {
      image: "/ibiea/21.jpg",
       title: "About Traveon",
      link:"/packages",
      buttonText: "Explore Packages",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* CAROUSEL HERO */}
      <section id="hero" className="pt-20 relative h-screen max-h-screen overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            {/* <div className="absolute inset-0 bg-black/60"></div> */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-5xl mx-auto text-center px-4">
                <div className="transition-all duration-1000 transform opacity-100 translate-y-0">
                  {/* {item.date && <h2 className="text-2xl text-[#28bccf] font-semibold mb-2">{item.date} • {item.location}</h2>}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">{item.title}</h1>
                  <p className="text-xl md:text-2xl text-white mb-6">{item.subtitle}</p> */}
                  {item.buttonText && item.link && (
                    <a
                      href={item.link}
                      className="inline-flex items-center bg-[#28bccf] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300"
                    >
                      {item.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-[#28bccf] w-8" : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* TRUSTED BY */}
      <TrustedBy />
{/* WHO WE ARE */}
<section
  className="w-full relative overflow-hidden py-[30px]"
  style={{ background: "linear-gradient(135deg, #0f8b8d 0%, #00C5C5 100%)" }}
>
  <div className="relative max-w-7xl mx-auto px-6 text-center z-10">

    {/* ✅ FIXED HEADING */}
    <h2
      className="text-white mb-8 text-center whitespace-nowrap leading-none"
      style={{
        fontFamily: "Lato, sans-serif",
        fontSize: "clamp(22px, 5vw, 48px)",
        fontWeight: 700,
      }}
    >
      <span style={{ color: "#000" }}>Who </span>
      <span style={{ fontStyle: "italic" }}>We </span>
      <span>Are</span>
    </h2>

    <p
      className="text-white mx-auto mb-12 px-4 sm:px-0 text-base sm:text-lg md:text-xl leading-relaxed sm:leading-7"
      style={{
        fontFamily: "Lato, sans-serif",
        fontWeight: 400,
        textAlign: "center",
        maxWidth: "680px",
      }}
    >
      Born from a vision of weaving wellness, adventure, and purpose into everyday living,
      Traveon is more than a retreat planner — we’re architects of transformation.
      <br /><br />
      We draw inspiration from alchemy of ancient wisdom and modern wellness science. From
      meditation practices taught by elders, to evidence-backed techniques for mental clarity,
      every facet of our retreats is crafted with deep intention.
      <br /><br />
      We are guides, facilitators, companions — walking alongside those who come to us
      carrying stress, burnout, or simply a longing for more meaning. And when they leave, we
      hope they carry away calm, clarity, and a renewed sense of possibility.
    </p>

    {/* LEFT IMAGES */}
    <div className="hidden lg:block absolute left-0 bottom-4 transform lg:-translate-x-28 lg:translate-y-14 xl:-translate-x-36 2xl:-translate-x-44 z-0 pointer-events-none">
      <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
        <img src="/community-tour/1.jpg" className="absolute w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-lg rotate-6" />
        <img src="/coursera/10.jpg" className="absolute w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-lg rotate-6 -top-12 left-20" />
        <img src="/oman/banner2.jpg" className="absolute w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-lg rotate-3 top-16 left-16" />
        <img src="/seychelles/2.jpg" className="absolute w-40 h-48 md:w-48 md:h-56 lg:w-56 lg:h-64 object-cover rounded-lg rotate-6 top-24 left-28" />
      </div>
    </div>

    {/* RIGHT IMAGES */}
    <div className="hidden lg:block absolute right-0 bottom-4 transform lg:translate-x-28 lg:translate-y-14 xl:translate-x-36 2xl:translate-x-44 z-0 pointer-events-none">
      <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
        <img src="/iccictimages/ic1.jpg" className="absolute w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-lg -rotate-6" />
        <img src="/iccictimages/ic2.jpg" className="absolute w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-lg rotate-6 -top-16 right-8" />
        <img src="/iccictimages/ic3.jpg" className="absolute w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-lg -rotate-3 top-16 right-16" />
        <img src="/iccictimages/ic4.jpg" className="absolute w-40 h-48 md:w-48 md:h-56 lg:w-56 lg:h-64 object-cover rounded-lg -rotate-6 top-24 right-28" />
      </div>
    </div>

  </div>
</section>

      {/* SHORT WHITE CALLOUT */}
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3
            className="text-2xl md:text-3xl font-semibold mb-3"
            style={{ fontFamily: "Cormorant, serif" }}
          ></h3>
          <p className="text-gray-700 mx-auto" style={{ fontFamily: "Archivo, serif", maxWidth: 720 }}></p>
        </div>
      </section>

{/* ✅ HOW IT STARTED (FIXED: viewport-bound images) */}
{/* ✅ HOW IT STARTED */}
<section className="w-full bg-white relative overflow-hidden pb-[100px]">
  <style>{`
    .about-blob{
      display:block;
      object-fit: cover;
      border-radius: 9999px;
      filter: drop-shadow(0 12px 22px rgba(0,0,0,0.14));
      pointer-events:none;
      background:#fff;
    }
    .blob-size{ width: 280px; height: 280px; }
    @media (min-width: 1024px){ .blob-size{ width: 320px; height: 320px; } }
    @media (min-width: 1280px){ .blob-size{ width: 360px; height: 360px; } }
  `}</style>

  {/* Container with 3-column layout: 20% left, 60% center, 20% right */}
  <div className="w-full relative">
    {/* Left container (20% width) */}
    <div className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-0 w-1/5 justify-center">
      <img
        src="/about/start1.jpg"
        alt="about left"
        aria-hidden="true"
        className="about-blob blob-size"
      />
    </div>

    {/* Center content (60% width) */}
    <div className="w-full lg:w-3/5 lg:mx-auto py-12 relative z-10 px-6 sm:px-10">
      <div className="flex items-start justify-center">
        <div className="flex-1 max-w-3xl mx-auto text-center">
          <h3
            className="whitespace-nowrap text-center leading-none"
            style={{
              fontFamily: "Lato, sans-serif",
              fontSize: "clamp(24px, 5vw, 40px)",
              fontWeight: 700,
              color: "#000",
            }}
          >
            <span style={{ fontStyle: "italic" }}>How it </span>
            <span className="text-[#27b2d9]" style={{ fontStyle: "italic" }}>
              Started
            </span>
          </h3>

          <div style={{ marginTop: 18, color: "#000" }}>
            <p
              className="text-base md:text-lg leading-7"
              style={{
                fontFamily: "Lato, sans-serif",
                fontWeight: 400,
                letterSpacing: "-0.04em",
              }}
            >
              The world keeps moving fast. Deadlines, targets, notifications — the noise often drowns
              out what matters most. We started Retreats by Traveon because we saw how much people
              longed for stillness, for real connections, for a chance to rest and remember who they
              are… beyond their roles, beyond their to-do lists.
            </p>

            <p
              className="mt-6 text-base md:text-lg leading-7"
              style={{
                fontFamily: "Lato, sans-serif",
                fontWeight: 400,
                letterSpacing: "-0.04em",
              }}
            >
              Our founders spent years exploring wellness modalities — retreats, silent walks, breath
              work, group sharing circles, mindfulness practices, nature immersion — learning from
              guides, healers, coaches, and communities.
            </p>

            <p
              className="mt-6 text-base md:text-lg leading-7"
              style={{
                fontFamily: "Lato, sans-serif",
                fontWeight: 400,
                letterSpacing: "-0.04em",
              }}
            >
              What emerged was a clear truth: profound transformation isn’t a luxury. It’s a
              necessity. So, we built this space — retreats that go beyond luxury or escape —
              experiences that invite awakening, belonging, and growth.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Right container (20% width) */}
    <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-0 w-1/5 justify-center">
      <img
        src="/about/start2.jpg"
        alt="about right"
        aria-hidden="true"
        className="about-blob blob-size"
      />
    </div>
  </div>
</section>


      {/* IMAGE CTA */}
      <section
        className="relative flex items-center justify-center bg-cover bg-center py-20 sm:py-28"
        style={{ backgroundImage: `url('/gallery/2.JPG')` }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Creating a Legacy of Happiness, Wellness & Belongingness
          </h2>

          <a
            href="/contact"
            className="inline-flex items-center bg-[#27b2d9] gap-3 px-10 py-4 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform text-lg sm:text-xl"
          >
            Contact Us
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ lineHeight: 0 }} aria-hidden="true">
          <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="w-full h-20 sm:h-24 md:h-28">
            <path
              d="M0,80 C160,160 320,160 480,80 C640,0 800,0 960,80 C1120,160 1280,160 1440,80 L1440,160 L0,160 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* SPACER */}
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-3" style={{ fontFamily: "Cormorant, serif" }}></h3>
          <p className="text-gray-700 mx-auto" style={{ fontFamily: "Archivo, serif", maxWidth: 720 }}></p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="w-full bg-white relative overflow-hidden py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3
                className="text-3xl md:text-4xl font-semibold mx-auto md:mx-0"
                style={{
                  fontFamily: "Lato, sans-serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: "42px",
                  lineHeight: "42px",
                  textAlign: "center",
                }}
              >
                <span style={{ color: "#000" }}>—— Our </span>
                <span style={{ color: "#2aabde" }}>Mission</span>
                <span style={{ color: "#000" }}> ——</span>
              </h3>
              <p
                className="mt-4 text-base md:text-lg text-gray-700 mx-auto md:mx-0"
                style={{
                  fontFamily: "Lato, sans-serif",
                  fontWeight: 300,
                  fontSize: "22px",
                  lineHeight: "28px",
                  textAlign: "center",
                }}
              >
                To craft soulful retreats that blend ancient wisdom + modern science, deliver
                heartfelt experiences, and ignite transformation — for people and teams alike.
                <br />
                To be a trusted partner in the journey toward well-being, purpose, and conscious living.
              </p>
            </div>
            <div className="flex justify-center md:justify-end md:mr-4 lg:mr-8">
              <img
                src="/about/mis.jpg"
                alt="Our mission"
                className="pointer-events-none w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg h-auto object-contain md:object-cover shadow-lg mx-auto"
              />
            </div>
          </div>

          {/* Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12">
            <div className="flex justify-center md:justify-start md:ml-4 lg:ml-8">
              <img
                src="/about/vis.png"
                alt="Our vision"
                className="pointer-events-none w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg h-auto object-contain md:object-cover shadow-lg mx-auto"
              />
            </div>
            <div className="text-center md:text-left">
              <h3
                className="text-3xl md:text-4xl font-semibold mx-auto md:mx-0"
                style={{
                  fontFamily: "Lato, sans-serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: "42px",
                  lineHeight: "42px",
                  textAlign: "center",
                }}
              >
                <span style={{ color: "#000" }}>—— Our </span>
                <span style={{ color: "#2aabde" }}>Vision</span>
                <span style={{ color: "#000" }}> ——</span>
              </h3>
              <p
                className="mt-4 text-base md:text-lg text-gray-700 mx-auto md:mx-0"
                style={{
                  fontFamily: "Lato, sans-serif",
                  fontWeight: 300,
                  fontSize: "22px",
                  lineHeight: "28px",
                  textAlign: "center",
                }}
              >
                A world where every individual feels rejuvenated, every team thrives through genuine
                connection, and where wellness isn’t an event — it’s woven into the fabric of life.
                <br />
                To be a trusted partner in the journey toward well-being, purpose, and conscious living.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* TEAM */}
    <section
  className="w-full mb-[100px] relative text-white overflow-hidden py-10 sm:py-16"
  style={{ background: "linear-gradient(135deg, #0f8b8d 0%, #00C5C5 100%)" }}
>
  <div className="absolute top-0 left-0 w-full" aria-hidden>
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20">
      <path d="M0 80 C360 0 1080 0 1440 80 L1440 0 L0 0 Z" fill="white" />
    </svg>
  </div>

  <div className="relative max-w-7xl mx-auto px-6 pt-10">
    <h2
      className="text-3xl md:text-4xl font-semibold mb-4 text-center mx-auto"
      style={{ fontFamily: "Lato, sans-serif" }}
    >
      <span style={{ color: "#000" }}>Meet </span>
      <span style={{ color: "#eef3f5" }}>Our Team</span>
    </h2>

    <p
      className="text-white/90 max-w-3xl mx-auto text-center mb-8"
      style={{ fontFamily: "Lato, sans-serif" }}
    >
      A multidisciplinary leadership team combining travel, wellness and
      experience-design expertise. We craft thoughtful retreats and experiences
      that bring people together.
    </p>

    <div className="max-w-7xl mx-auto mb-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src="/team/piyush.jpg"
            alt="Dr. Piyush Bhardwaj"
            className="w-36 h-36 md:w-40 md:h-40 object-cover rounded-lg"
          />
          <div className="text-center">
            <h4
              className="text-white font-semibold"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              Dr. Piyush Bhardwaj
            </h4>
            <p
              className="text-white/90 mt-2 text-sm"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              With 15 years of experience in technology, data science and
              academic research, Dr. Piyush brings expertise in building
              data-driven engagement platforms and program design.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src="/team/abhineet.jpg"
            alt="Mr. Abhineet Gupta"
            className="w-36 h-36 md:w-40 md:h-40 object-cover rounded-lg"
          />
          <div className="text-center">
            <h4
              className="text-white font-semibold"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              Mr. Abhineet Gupta
            </h4>
            <p
              className="text-white/90 mt-2 text-sm"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              A seasoned business strategist with 14 years of experience across
              travel and hospitality, Abhineet leads commercial strategy and
              partnerships.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src="/team/ajit.png"
            alt="Mr. Ajit Waghe"
            className="w-36 h-36 md:w-40 md:h-40 object-cover rounded-lg"
          />
          <div className="text-center">
            <h4
              className="text-white font-semibold"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              Mr. Ajit Waghe
            </h4>
            <p
              className="text-white/90 mt-2 text-sm"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              Senior aviation expert with 22+ years at Oman Air, Swissair and
              KLM. Specializes in loyalty programs, pricing strategies, and
              revenue optimization. Spearheads Traveon's expansion in the Middle
              East.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-10 flex justify-between">
      <div className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 border-t border-white/60" />
    </div>

    {/* Team cards rows */}
    {/* Small team cards */}
<div className="mt-8 px-4 sm:px-6">
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 justify-items-center">
    {[
      {
        img: "/team/shakshi.jpeg",
        name: "Sakshi Garg",
        role: "V.P. Business Development",
      },
      {
        img: "/team/pooja.jpg",
        name: "Pooja Goyal",
        role: "Business Development Manager",
      },
      {
        img: "/team/shobha.jpg",
        name: "Shubha Sharma",
        role: "Operations Associate",
      },
      {
        img: "/team/himanshu.jpeg",
        name: "Himanshu Vashist",
        role: "Operations Associate",
      },
      {
        img: "/team/deepanshu.jpg",
        name: "Deepanshu Vashist",
        role: "Operations Associate",
      },
      {
        img: "/team/bhumi.jpg",
        name: "Bhumi Thakur",
        role: "Graphic Designer",
      },
      {
        img: "/team/vishal.png",
        name: "Vishal Kumar",
        role: "Full Stack Developer",
      },
      {
        img: "/team/priyal.jpg",
        name: "Priyal Arora",
        role: "Business Development Executive",
      },
    ].map((card, idx) => (
      <div
        key={idx}
        className="w-full max-w-[260px] flex flex-col items-center justify-center text-center mx-auto"
      >
        <img
          src={card.img}
          alt={card.name}
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg"
        />

        <div className="mt-4 flex flex-col items-center justify-center">
          <h5
            className="text-white font-semibold text-base sm:text-lg leading-tight"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {card.name}
          </h5>

          <p
            className="text-white/90 text-sm sm:text-base leading-snug mt-1 max-w-[220px]"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {card.role}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
  </div>
</section>
      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#28bccf] to-[#28bccf] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold">Ready to Experience Travel with Traveon?</h2>
              <p className="mt-3 text-lg opacity-90">
                Let us create a tailored experience for your travel or business needs worldwide.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <a
                href="/contact"
                className="bg-white text-[#28bccf] px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition duration-300 inline-flex items-center"
              >
                Get in Touch <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}