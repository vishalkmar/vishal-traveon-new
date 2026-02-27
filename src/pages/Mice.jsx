

import React, { useState, useEffect } from "react";
import PreviousEventsMice from "../Components/PreviousEventsMice";
import BussinessObjective from "../Components/BussinessObjective";
import OurApproachMice from "../Components/shared/OurApproachMice";
import Testimonials from "../Components/Testimonial";

import TrustedBy from "../components/TrustedBy";
import {
  Briefcase,
  Gift,
  Presentation,
  Users,
  Settings,
  Plane,
  Globe,
  TrendingUp,
  MessageCircle,
  DraftingCompass,
  Truck,
  ClipboardCheck,
  Quote,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import PreviewCardCarousel from "../components/shared/PreviewCardCarousel";
import MiceTourOffering from "../Components/MiceTourOffering";

export default function Mice() {
  const whatsappUrl =
    "https://wa.me/9540111307?text=Hi! I'm interested in planning a MICE tour.";

  const carouselItems = [
    {
      image: "/iccictimages/ic2.jpg",
      title: "ICCICT 2026",
      date: "22 - 23 January 2026 (Hybrid Mode)",
      subtitle:
        "International Conference on Computational Intelligence and Computing Technologies & AI (ICCICT 2026) — uniting researchers, industry experts, and innovators.",
      link: "/iccict",
      location: "India International Centre, Lodhi Estate, New Delhi, India",
      buttonText: "Know more",
    },
    {
      image: "/coursera/12.jpg",
      title: "Coursera Offsite",
      date: "17-18 NOV 2025",
      subtitle:
        "A seamlessly managed 2-day offsite conference for Coursera at Lemon Tree Tarudhan Valley with complete end-to-end arrangements.",
      link: "/coursera",
      location: "Lemon Tree Tarudhan Valley",
      buttonText: "Know more",
    },
    {
      image: "/google-wellness/13.jpg",
      title: "GOOGLE WELLNESS RETREAT",
      date: "16 SEPTEMBER 2025",
      subtitle:
        "A peaceful wellness retreat at Google, Gurgaon, designed to relax, recharge, and restore inner balance.",
      link: "/google-offset",
      location: "GURGAON DELHI",
      buttonText: "Know more",
    },
    {
      image: "/ibiea/21.jpg",
      title: "IBIEA 2025",
      subtitle: "A prestigious IBIEA 2025 event in Oman, bringing together awards, international travel, and curated experiences for 50 participants.",
      // description:
      // "We successfully organized the IBIEA event in Oman, taking a group of 50 participants from India for a memorable international experience. The program included a prestigious awards function along with a well-planned 2-night, 3-day stay. In addition to the formal ceremony, we curated sightseeing and local experiences across Oman, ensuring a perfect blend of celebration, networking, and leisure. The event delivered a seamless and enriching experience for all attendees.",
      date: "May 29, 2025",
      location: "Muscat, Oman",
      link: "/ibiea",
      buttonText: "Learn More",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen  bg-background">
      {/* Hero section copied from LandingPage */}
      <section id="hero" className="pt-20 relative h-screen max-h-screen overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-5xl mx-auto text-center px-4">
                <div className="transition-all duration-1000 transform opacity-100 translate-y-0">
                  {item.date && <h2 className="text-2xl text-[#28bccf] font-semibold mb-2">{item.date} • {item.location}</h2>}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">{item.title}</h1>
                  <p className="text-xl md:text-2xl text-white mb-6">{item.subtitle}</p>
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

      <TrustedBy />
      <MiceTourOffering />
      <PreviousEventsMice />
      <BussinessObjective />
      <OurApproachMice />
      <Testimonials />
    


      {/* ✅ Introduction Section */}
      {/* <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Business Objectives, Immersive Experiences
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Retreats by Traveon, our MICE Tours are designed to combine
              business objectives with immersive travel experiences. We create
              programs that integrate corporate meetings, incentive trips,
              conferences, and team-building events with cultural exploration,
              wellness, and leisure—ensuring participants are engaged,
              motivated, and inspired.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80"
                alt="Corporate team meeting"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
            <div className="space-y-6">
              {[
                {
                  icon: Settings,
                  color: "#44B3C4",
                  title: "Tailored Programs",
                  description:
                    "Each tour is customized to meet your corporate objectives, team dynamics, and desired outcomes.",
                },
                {
                  icon: Plane,
                  color: "#6BC273",
                  title: "Seamless Logistics",
                  description:
                    "End-to-end planning, professional on-ground support, and trusted local partners ensure smooth execution.",
                },
                {
                  icon: Globe,
                  color: "#F6B93B",
                  title: "Immersive Experiences",
                  description:
                    "We combine culture, nature, and wellness to create meaningful and memorable journeys.",
                },
                {
                  icon: TrendingUp,
                  color: "#44B3C4",
                  title: "Impactful Outcomes",
                  description:
                    "MICE tours designed to boost engagement, strengthen teams, and leave lasting impressions.",
                },
              ].map((item) => (
                <div className="flex items-start space-x-4" key={item.title}>
                  <div
                    className="p-2 rounded-lg shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

 

  
     
     
      {/* <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Our MICE tour with Traveon was flawless. We combined business meetings, team bonding, and cultural exploration seamlessly.",
                name: "Naveen Kumar",
                company: "Rahat Trust",
                avatar: "/reviews/naveen kumar.webp",
              },
              {
                quote:
                  "Every detail was managed professionally, making the award function and MICE tour a truly memorable experience for all participants.",
                name: "Archit Singla",
                company: "Director, Nuwud",
                 avatar: "/reviews/archit.webp",
              },
              {
                quote:
                  "Attending IBIEA 2025 in Oman was an incredible experience. The atmosphere, the people, and the recognition of true talent made it a night to remember.",
                name: "Pascal Esparon",
                company: "Escape Seychelles",
                 avatar: "/reviews/pascal.webp",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-[#44B3C4]"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#44B3C4] to-[#6BC273] flex-shrink-0">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                   
                  </div>
                  <Quote className="w-8 h-8 text-[#44B3C4] flex-shrink-0 mt-2" />
                </div>

                <p className="text-gray-700 leading-relaxed italic mb-6 text-lg">
                  "{testimonial.quote}"
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <div className="mt-20 mb-20 text-center px-4">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Want to Be Start Planning Your MICE Tour?
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm md:text-base text-gray-600 max-w-xl mx-auto">
          Let us help you create memorable MICE experiences tailored to your goals.
        </p>

        {/* Button */}
        <div className="mt-6 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#44B3C4] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg inline-flex items-center gap-3 hover:scale-105 hover:shadow-xl"
          >
            <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
            Plan Your MICE Tour
          </a>
        </div>
      </div>

    </div>
  );
}