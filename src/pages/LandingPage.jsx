import {
  ChevronRight,
  Users,
  Briefcase,
  Globe,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Menu,
  X,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import toast from "react-hot-toast";
import { backendUrl } from "../../apiConfig/config";
import Testimonials from "../Components/Testimonials";

const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const SlideIn = ({ children, direction = "right", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "left":
          return "translate-x-20 opacity-0";
        case "right":
          return "-translate-x-20 opacity-0";
        case "up":
          return "translate-y-20 opacity-0";
        case "down":
          return "-translate-y-20 opacity-0";
        default:
          return "-translate-x-20 opacity-0";
      }
    }
    return "translate-x-0 translate-y-0 opacity-100";
  };

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${getTransform()}`}
    >
      {children}
    </div>
  );
};

export default function LandingPage() {
  const isExternalLink = (url) => url.startsWith("http");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Thank you for your message. We will get back to you soon!"
        );
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const carouselItems = [
    {
      image: "/coursera/12.jpg",
      title: "Coursera Offsite",
       date: "17-18 NOV 2025",
      subtitle:
        "A seamlessly managed 2-day offsite conference for Coursera at Lemon Tree Tarudhan Valley with complete end-to-end arrangements.",
   
      //  description: "We successfully organized a 2-day offsite conference for Coursera at Lemon Tree Tarudhan Valley, where all participants stayed at the venue throughout the event. Our team managed the complete end-to-end arrangements, including accommodation, conference setup, meals, logistics, and hospitality. Every detail was handled with care to ensure a seamless, comfortable, and productive experience for the Coursera team.",
        link: "/coursera",
         location: "Lemon Tree Tarudhan Valley",
       buttonText: "Know more",
      
    },
     {
      image: "/google-wellness/13.jpg",
      title: "GOOGLE WELLNESS RETREAT",
       date: "16 SEPTEMBER 2025",
      subtitle:
        "A peaceful wellness retreat at Google, Gurgaon, designed to relax, recharge, and restore inner balance."
   ,
      //  description: "We organized a rejuvenating wellness retreat at Google, Gurgaon, featuring a 2-hour guided session focused on relaxation and holistic well-being. The highlight of the retreat was a calming sound healing experience, helping participants unwind, reduce stress, and restore inner balance. The session created a peaceful atmosphere that left everyone feeling refreshed, recharged, and truly satisfied.",
        link: "/google-offset",
         location: "GURGAON DELHI",
       buttonText: "Know more",
      
    },
       {
      image:"/ibiea/21.jpg",
      title: "IBIEA 2025",
      subtitle: "A prestigious IBIEA 2025 event in Oman, bringing together awards, international travel, and curated experiences for 50 participants.",
      // description:
        // "We successfully organized the IBIEA event in Oman, taking a group of 50 participants from India for a memorable international experience. The program included a prestigious awards function along with a well-planned 2-night, 3-day stay. In addition to the formal ceremony, we curated sightseeing and local experiences across Oman, ensuring a perfect blend of celebration, networking, and leisure. The event delivered a seamless and enriching experience for all attendees.",
      date: "May 29, 2025",
      location: "Muscat, Oman",
      link: "/ibiea",
      buttonText: "Learn More",
    },
    {
      image: "/image.jpeg",
      title: "IAMS 2026",
      subtitle: "International Aviation Marketing Summit",
      description: "The Complete Next-Gen Aviation Commercial Ecosystem",
      date: "April 9-10, 2026",
      location: "Holiday Inn Aero City, Delhi, India",
      buttonText: "Visit IAMS",
      link: "https://iamsglobal.com",
    },

    {
      image: "/india_internatinal.png",
      title: "ICCICT 2026",
      subtitle:
        "International Conference on Computational Intelligence and Computing Technologies & AI",
      description:
        "A leading platform uniting researchers, industry experts, and innovators.",
      date: "January 22-23 2026",
      location: "Indian International Centre, Delhi",
      link: "https://www.iccict.org/",
      buttonText: "Learn More",
    },
    {
      image: "/carousel3.jpeg",
      title: "IBIEA 2.0 (Comming soon)",
      subtitle: "International Business Innovation and Excellence Awards",
      description: "Experience business excellence in paradise.",
      date: "To be Announced",
      location: "",
      link: "https://ibiea.com/",
      buttonText: "Learn More",
    },

 
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselItems.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((item) => {
      observer.observe(item);
    });

    return () => {
      document.querySelectorAll(".animate-on-scroll").forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, []);

  return (
    <div className="font-['Arsenal'] text-gray-800 overflow-x-hidden relative">
      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-20 right-5 bg-[#28bccf] text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300 cursor-pointer"
      >
        <ArrowUp size={24} className="animate-bounce pt-1" />
      </button>

      {/* WhatsApp button */}

      {/* Hero Section with Carousel */}
      <section
        id="hero"
        className="pt-20 relative h-screen max-h-screen overflow-hidden"
      >
        {carouselItems.map((item, index) => (
          <div
            key={index}
           className={`absolute inset-0 transition-opacity duration-1000 ${
  index === currentImageIndex
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none"
}`}

          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-5xl mx-auto text-center px-4">
                <FadeIn delay={300}>
                  {item.date && (
                    <h2 className="text-2xl text-[#28bccf] font-semibold mb-2">
                      {item.date} • {item.location}
                    </h2>
                  )}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                    {item.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white mb-6">
                    {item.subtitle}
                  </p>
                  {/* <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                    {item.description}
                  </p> */}
  {item.buttonText && item.link && (
  isExternalLink(item.link) ? (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center bg-[#28bccf] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300"
    >
      {item.buttonText}
      <ArrowRight className="ml-2 w-5 h-5" />
    </a>
  ) : (
    <Link
      to={item.link}
      className="inline-flex items-center bg-[#28bccf] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300"
    >
      {item.buttonText}
      <ArrowRight className="ml-2 w-5 h-5" />
    </Link>
  )
)}

                </FadeIn>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-[#28bccf] w-8"
                  : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="pt-20 relative min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left Content */}
            <div className="space-y-6">
              <FadeIn delay={300}>
                <h3 className="text-xl text-[#28bccf] font-medium">
                  Navigating the World's Finest
                </h3>
                <h3 className="text-xl text-[#28bccf] font-medium">
                  Experiences & Opportunities.
                </h3>
                <h1 className="text-5xl lg:text-6xl font-bold text-[#003B4A] space-y-2">
                  <div>Beyond</div>
                  <div>Destinations,</div>
                  <div>Beyond</div>
                  <div>Expectations.</div>
                </h1>
                <a
                  href="#services"
                  className="inline-block mt-8 px-8 py-3 border-2 border-[#28bccf] text-[#28bccf] hover:bg-[#28bccf] hover:text-white transition-all duration-300 rounded"
                >
                  Explore Now
                </a>
              </FadeIn>
              {/* Paper Airplane Illustration */}
              <div className="relative">
                <svg
                  className="absolute -bottom-20 -right-20 w-32 h-32 text-[#28bccf] opacity-20 transform rotate-45"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2z"></path>
                </svg>
              </div>
            </div>

            {/* Right Content - Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48">
                  <img
                    src="/carousel1.jpeg"
                    alt="Travel Experience 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden h-48">
                  <img
                    src="/carousel2.jpeg"
                    alt="Travel Experience 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden h-48">
                  <img
                    src="/carousel3.jpeg"
                    alt="Travel Experience 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden h-48">
                  <img
                    src="/carousel4.jpeg"
                    alt="Travel Experience 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <Services /> */}
      <section id="services" className="py-20 md:py-28">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Services
            </h2>
            <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6"></div>
            <p className="text-lg text-gray-700">
              At Traveon Ventures, we specialize in comprehensive destination
              management services designed for both leisure travelers and
              corporate clients. Whether you're seeking immersive curated travel
              experiences, seamless MICE management, or strategic business
              facilitation, we ensure excellence at every step
            </p>
          </div>

          <div className="space-y-16 mt-12">
            {[
              {
                title: "Retreats by Traveon",
                description:
                  "We specialize in wellness retreats, corporate retreats, and community tours — creating meaningful journeys that rejuvenate, connect, and inspire",
                image: "/services/wellness.png",
                // learnMoreTo: "https://retreatsbytraveon.com/", // <-- set your custom route/link here
                // learnMoreLabel: "Explore Retreats", // (optional)
              },
              {
                title: "Award Ceremonies and Conclave",
                description:
                  "More than just events, our award ceremonies and conclaves are moments of recognition, inspiration, and collective growth",
                image: "/gallery/2.JPG",
                // learnMoreTo: "/contact",
              },
              {
                title: "Conference and Seminars",
                description:
                  "We deliver well-structured conferences and seminars designed to connect people, share ideas, and spark new opportunities.",
                image: "/gallery/conference.jpg",
                // learnMoreTo: "/contact",
              },
              {
                title: "Exhibitions and Convention",
                description:
                  "We provide end-to-end exhibition management services, from planning and design to execution, ensuring impactful showcases for your brand.",
                image: "/gallery/exhibition.jpg",
                // learnMoreTo: "/contact",
              },
              {
                title: "MICE Management",
                description:
                  "From high-profile conferences to exclusive incentive programs, our Meetings, Incentives, Conferences, and Exhibitions (MICE) services ensure precision, creativity, and seamless execution. ",
                image: "/events_images/mice.png",
                learnMoreTo: "/mice", // <-- set your custom route/link here
              },
              {
                title: "Business Facilitation",
                description:
                  "Unlock global opportunities with our tailored business facilitation services that connect companies to valuable partnerships and dynamic market landscapes.",
                image:
                  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
                // learnMoreTo: "/contact", // <-- set your custom route/link here
              },
              {
                title: "Visa Services",
                description:
                  "Streamlined visa processing and support for hassle-free travel to selected destinations.",
                image:
                  "https://images.unsplash.com/photo-1487637419635-a2a471ff5c7b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VmlzYSUyMFNlcnZpY2V8ZW58MHx8MHx8fDA%3D",
                // learnMoreTo: "/contact", // <-- set your custom route/link here
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 md:gap-16 items-center`}
              >
                <div className="w-full md:w-1/2 overflow-hidden rounded-lg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-72 object-cover hover:scale-110 transition-all duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="w-full md:w-1/2 md:px-6">
                  <h3 className="text-2xl font-bold text-[#28bccf] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {service.description}

                    {service.title === "Visa Services" && (
                      <span className="block mt-2 text-md text-gray-700">
                        Expert assistance with visa applications, documentation,
                        and submission for papers.
                      </span>
                    )}
                  </p>

                  {/* Learn more link now uses per-item route with default "#" */}
                  {/* <Link
                    to={service.learnMoreTo || "#"}
                    className="inline-flex items-center text-[#28bccf] hover:text-opacity-80 transition-colors duration-300"
                  >
                    {service.learnMoreLabel || "Learn more"}
                    <span className="ml-2">→</span>
                  </Link> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Highlight */}
      <section id="destinations" className="py-20 bg-[#28bccf] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Explore Global Destinations
            </h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto opacity-90">
              Discover diverse landscapes and rich cultural heritage around the
              world
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Asia",
                image:
                  "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800",
                description:
                  "Tradition meets innovation in a land of vibrant contrasts.",
              },
              {
                name: "Oman",
                image: "/carousel2.jpeg",
                description: "Where history, culture, and desert beauty unite.",
              },
              {
                name: "Malaysia",
                image: "/carousel3.jpeg",
                description:
                  "Discover the perfect blend of tranquillity and luxury.",
              },
            ].map((destination, index) => (
              <Link
                key={index}
                className="rounded-xl overflow-hidden group relative cursor-pointer animate-on-scroll"
                to={`/destinations/${destination.name.toLowerCase()}`}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    {destination.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* <div className="mt-12 text-center">
            <Link
              to="/destinations"
              className="inline-flex items-center text-white border-b-2 border-white pb-1 hover:border-opacity-70 transition-colors duration-300"
            >
              View all destinations <ChevronRight size={16} className="ml-1" />
            </Link>
          </div> */}
        </div>
      </section>

      {/* Our Events */}
      <section id="our-events" className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Events & Mice</h2>
            <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6"></div>
            <p className="text-lg text-gray-700">
              We craft memorable events, whether corporate conferences,
              prestigious exhibitions, or special celebrations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
    
      title: "Coursera Offsite",
      description: "We successfully organized a 2-day offsite conference for Coursera at Lemon Tree Tarudhan Valley, where all participants stayed at the venue throughout the event. Our team managed the complete end-to-end arrangements, including accommodation, conference setup, meals, logistics, and hospitality. Every detail was handled with care to ensure a seamless, comfortable, and productive experience for the Coursera team.",
       image: "/coursera/12.jpg",
      date: "17-18 NOV 2025",
      link: "/coursera",
      href: "/coursera"
    },
    {
    
      title: "GOOGLE WELLNESS RETREAT",
      description:" We organized a rejuvenating wellness retreat at Google, Gurgaon, featuring a 2-hour guided session focused on relaxation and holistic well-being. The highlight of the retreat was a calming sound healing experience, helping participants unwind, reduce stress, and restore inner balance. The session created a peaceful atmosphere that left everyone feeling refreshed, recharged, and truly satisfied.",
       image: "/google-wellness/13.jpg",
      date: "16 SEPTEMBER 2025",
      link: "/google-offset",
      href: "/google-offset"
    },
                     {
                title: "IBIEA 2025",
                description:
                  "IBIEA 2025 Oman: International Business Innovation and Excellence Awards (IBIEA 2025) unfolded as a grand spectacle at Afrah Ballroom, Grand Hyatt Muscat, Oman on 29th May 2025",
                image: "/events_images/icms.png",
                date: "29 May 2025",
                href: "/ibiea",
                // href: "/events/1",
              }, 

              {
                 title: "ICCICT 2026",
                 description:`International Conference on Computational Intelligence and Computing Technologies & AI (ICCICT 2026) — a leading platform uniting researchers, industry experts, and innovators.`,
                 image: "/events_images/iccict.jpg",
               date: "January 22-23 2026",
                href: "https://www.iccict.org/index.html",
                // href: "/events/2",
              },
              {
                title: "IBIEA 2.0",
                description:
                  "The next edition of International Business Innovation and Excellence Awards (IBIEA 2.0) is set to take place in the exotic destination of exotic locations, with precise dates to be announced shortly.",
                image: "/events_images/ibiea2.png",
                date: "To be Announced",
                href: "https://ibiea.com",
                // href: "/events/3",
              },
        
               {
    
      title: "IAMS 2026",
      description: " International Aviation Marketing Summit . The Complete Next-Gen Aviation Commercial Ecosystem — bringing together global leaders, marketers, and innovators shaping the future of aviation commerce.",
       image: "/image.jpeg",
      date: "April 9-10, 2026",
      link: "https://iamsglobal.com",
      href: "https://iamsglobal.com",
    },
            ].map((event, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md group"
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#28bccf] mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <p className="text-gray-600 mb-4 font-bold">{event.date}</p>
                  <a
                    href={event.href}
                    className="text-sm font-medium text-[#28bccf] hover:underline inline-flex items-center"
                  >
                    Learn more <ArrowRight size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              About Traveon
            </h2>
            <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A premier destination management company specializing in curated
              travel experiences, MICE management, and business facilitation
              services worldwide.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <SlideIn direction="right">
                <p className="text-lg text-gray-600 mb-6">
                  Traveon Ventures LLP is a premier destination management
                  company, specializing in curated travel experiences, MICE
                  management, and business facilitation worldwide. As part of
                  the EGS Group, we bridge heritage and modern advancements,
                  connecting global leaders with dynamic opportunities.
                </p>

                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#28bccf] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                      <Globe size={24} className="text-[#28bccf]" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Global Network</h4>
                      <p className="text-sm text-gray-600">of Partners</p>
                    </div>
                  </div>
                </div> */}
                <Link
                  to="/about"
                  className="text-sm font-medium text-[#28bccf] hover:underline inline-flex items-center"
                >
                  Learn more <ArrowRight size={14} className="ml-1" />
                </Link>
              </SlideIn>
            </div>
            <div className="lg:w-1/2 relative">
              <SlideIn direction="left">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#28bccf] bg-opacity-10 rounded-full"></div>
                  <img
                    src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800"
                    alt="Global travel"
                    className="relative z-10 rounded-xl shadow-xl"
                  />
                  <div className="absolute -bottom-10 -right-4 w-64 h-64 bg-[#28bccf] rounded-xl transform rotate-12"></div>
                </div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Events Section */}
      <section id="events" className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Event Management
            </h2>
            <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6"></div>
            <p className="text-lg text-gray-700">
              From corporate conferences to special celebrations, we create
              memorable events tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Corporate Events",
                description:
                  "Professional planning and execution of business meetings, team building activities, and corporate retreats.",
                image:
                  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
              },
              {
                title: "Conferences & Exhibitions",
                description:
                  "Comprehensive management of large-scale conferences, trade shows, and exhibitions.",
                image:
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q29uZmVyZW5jZXxlbnwwfHwwfHx8MA%3D%3D",
              },
              {
                title: "Special Celebrations",
                description:
                  "Elegant planning for weddings, anniversaries, and other milestone celebrations in spectacular settings.",
                image:
                  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800",
              },
            ].map((event, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md group"
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#28bccf] mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Link
                    to="/contact"
                    className="text-sm font-medium text-[#28bccf] hover:underline inline-flex items-center"
                  >
                    Learn more <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Services Section */}
      <section id="visa" className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visa Services
            </h2>
            <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6"></div>
            <p className="text-lg text-gray-700">
              Streamlined visa processing and support for hassle-free travel to
              destinations worldwide.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1487637419635-a2a471ff5c7b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VmlzYSUyMFNlcnZpY2V8ZW58MHx8MHx8fDA%3D"
                alt="Visa Services"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#28bccf] mb-3">
                  Visa Processing
                </h3>
                <p className="text-gray-600">
                  Expert assistance with visa applications, documentation, and
                  submission for various destinations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#28bccf] mb-3">
                  Document Preparation
                </h3>
                <p className="text-gray-600">
                  Guidance on preparing the required documents according to
                  specific country requirements.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#28bccf] mb-3">
                  Fast-Track Services
                </h3>
                <p className="text-gray-600">
                  Expedited visa processing options for urgent travel needs.
                </p>
              </div>
              <a
                href="/contact"
                className="inline-block bg-[#28bccf] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all mt-4"
              >
                Inquire About Visa Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-20 bg-[#e6f9fc]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Traveon
            </h2>
            <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We combine local expertise with international standards to deliver
              exceptional experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              {[
                {
                  title: "Local Expertise",
                  description:
                    "Deep knowledge of worldwide cultures, geography, and business landscapes.",
                },
                {
                  title: "Personalized Service",
                  description:
                    "Tailored solutions that meet the unique needs of each client.",
                },
                {
                  title: "Quality Assurance",
                  description:
                    "Commitment to excellence in every aspect of our service delivery.",
                },
                {
                  title: "Sustainable Practices",
                  description:
                    "Responsible tourism that respects local communities and the environment.",
                },
              ].map((item, index) => (
                <div key={index} className="mb-8 flex">
                  <div className="mr-4 mt-1">
                    <div className="h-8 w-8 rounded-full bg-[#28bccf] flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=800"
                  alt="Travel Experience"
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#5bdeef] rounded-lg z-0"
                style={{
                  animation: "float 6s ease-in-out infinite",
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#28bccf] to-[#28bccf] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold">
                Ready to Experience Travel with Traveon?
              </h2>
              <p className="mt-3 text-lg opacity-90">
                Let us create a tailored experience for your travel or business
                needs worldwide.
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6"></div>
            {/* <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you!
            </p> */}
          </div>
          <div className="lg:flex lg:space-x-12">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <SlideIn direction="right">
                {/* <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2> */}
                <p className="text-lg text-gray-600 my-8">
                  We're here to make your experience exceptional. Whether you're
                  planning a holiday, event, exploring business opportunities,
                  or have other ideas in mind, feel free to drop us a line. Our
                  commitment is to respond promptly to all inquiries.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <MapPin size={20} className="text-[#28bccf]" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Our Location
                      </h4>
                      <p className="text-gray-600">
                        128-A, D-Mall, NSP, Delhi, India (110034)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Mail size={20} className="text-[#28bccf]" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Email
                      </h4>
                      <p className="text-gray-600">info@traveon.in</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Phone size={20} className="text-[#28bccf]" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Phone
                      </h4>
                      <p className="text-gray-600">+91 9540111207</p>
                    </div>
                  </div>
                </div>
              </SlideIn>
            </div>

            <div className="lg:w-1/2">
              <SlideIn direction="left">
                <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
                  <h3 className="text-2xl font-semibold mb-6">
                    We'd love to hear from you!
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28bccf] focus:border-[#28bccf] outline-none transition"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          name="name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28bccf] focus:border-[#28bccf] outline-none transition"
                          placeholder="Your email"
                          value={formData.email}
                          onChange={handleChange}
                          name="email"
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28bccf] focus:border-[#28bccf] outline-none transition"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        name="phone"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28bccf] focus:border-[#28bccf] outline-none transition"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        name="subject"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28bccf] focus:border-[#28bccf] outline-none transition"
                        rows="4"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={handleChange}
                        name="message"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#28bccf] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300 flex items-center justify-center"
                    >
                      Send Message <ArrowRight size={16} className="ml-2" />
                    </button>
                  </form>
                </div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
