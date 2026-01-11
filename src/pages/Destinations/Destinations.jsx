import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backendUrl } from "../../../apiConfig/config";
// import { destinations } from "./MockData";

const DestinationCard = ({ id, image, title, description }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        to={`/package/${id}`}
        className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center"
      >
        Explore more
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  </div>
);

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/packages`);
        if (!response.ok) {
          setLoading(false);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDestinations(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading packages...</div>;
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white py-20 relative">
        <div className="max-w-screen-xl mx-auto px-4 my-20 relative z-30">
          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Explore Global Destinations
            </h1>
            <p className="text-xl text-white max-w-4xl mx-auto text-center">
              Discover diverse landscapes and rich cultural heritage around the
              world
            </p>
          </FadeIn>
        </div>
        <div className="absolute inset-0 bg-gray-900/40 z-20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/caroual1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations?.map((destination, index) => (
            <DestinationCard key={index} {...destination} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore These Amazing Destinations?
          </h2>
          <p className="text-gray-600 mb-8">
            Let us help you plan your perfect journey
          </p>
          <Link
            to="/contact"
            className="bg-[#28bccf] text-white px-8 py-3 rounded-full hover:bg-[#28bccfdf] transition-colors inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
