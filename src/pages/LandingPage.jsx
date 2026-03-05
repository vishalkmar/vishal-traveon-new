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


import Hero from "../components/HeroHome.jsx";
import TrustedBy from "../components/TrustedBy.jsx";
import Why from "../Components/Why.jsx";
import Testimonial from "../Components/Testimonial.jsx";
import Transform from "../Components/TransFormHome.jsx";
import PopularDestinations from "../Components/PopularDestinations.jsx";
import HomePageEvents from "./Events/HomePageEvents.jsx";



import HomePagePackages from "../Components/packages/HomePagePackages";

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
      className={`transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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

 
  return (
    <div className="font-['Lato'] text-gray-800 overflow-x-hidden relative">
      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-20 right-5 bg-[#28bccf] text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300 cursor-pointer"
      >
        <ArrowUp size={24} className="animate-bounce pt-1" />
      </button>
      
           <Hero />
          <TrustedBy />
          <HomePagePackages />
          <Why />
          <HomePageEvents />
          <Transform />
          <PopularDestinations />
          <Testimonial />
        


     

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
                      <p className="text-gray-600">+91 9540111307</p>
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

      
    </div>
  );
}
