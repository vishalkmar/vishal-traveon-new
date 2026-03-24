import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaPhone } from "react-icons/fa";
import { backendUrl } from "../../apiConfig/config";

export function getActivitiesForPackage(pkg) {
  if (pkg.title.includes("Thailand")) {
    return [
      "Nong Nooch Garden Tour",
      "Coral Island Tour",
      "Safari World",
      "Bangkok City Tour",
      "Big Buddha & Viewpoint Visit",
      "Speed Boat",
    ];
  }
  if (pkg.title.includes("Untold")) {
    return [
      "Muscat City Tour",
      "Al Baleed Archaeological Park",
      "Desert Safari",
      "Royal Opera House",
      "Muttrah Souq",
      "Grand Mosque Visit",
    ];
  }
  if (pkg.title.includes("Fusion")) {
    return [
      "Night Safari",
      "Marina Bay Sands",
      "Twin Tower",
      "Malacca Day Trip",
      "Gardens by the Bay",
      "Universal Studio",
      "Batu Caves",
      "Cable Car Ride",
      "Theme Park Visit",
    ];
  }
  if (pkg.title.includes("Pearl")) {
    return [
      "Dhow Cruise",
      "Dubai City Tour",
      "Dubai Mall",
      "Dubai Fountain",
      "Burj Khalifa",
      "Shopping Time",
      "Desert Safari",
      "Theme Park Visit",
    ];
  }
  if (pkg.title.includes("Seychelles")) {
    return [
      "Beau Vallon Beach",
      "Morne Seychellois National Park",
      "Island Hopping",
      "Victoria Market",
    ];
  }
  // Add more as needed
  return [];
}

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/packages/`);
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  function formatDescription(description) {
    if (!description) return null;
    // Split by '|'
    return description
      .split("|")
      .map((part) => {
        // Trim spaces
        part = part.trim();
        // Match "N Nights in City"
        const match = part.match(/(\d+)\s*Nights?\s*in\s*(.+)/i);
        if (match) {
          const days = match[1];
          const city = match[2];
          return { days, city };
        }
        return null;
      })
      .filter(Boolean);
  }

  return (
    <div className="min-h-screen">
      <div className="h-16 bg-gray-900 shadow-2xl"></div>
      <div className="max-w-screen-xl mx-auto px-4 min-h-screen sm:px-10 py-10">
        <h1 className="text-3xl font-bold mb-8">Our Packages</h1>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="h-48 w-full object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{pkg.title}</h2>
              <div className="text-gray-600 mb-2">
                {pkg.packageOverview?.slice(0, 100)}...
              </div>
              <div className="font-bold text-lg mb-2">INR {pkg.price}</div>
              <Link
                to={`/package/${pkg.id}`}
                className="mt-auto inline-block bg-[#28bccf] text-white px-4 py-2 rounded hover:bg-[#1a8ca0] transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Link
              to={`/package/${pkg.id}`}
              key={pkg.id}
              className="rounded-2xl shadow-lg flex p-2 gap-2 bg-white flex-col relative"
            >
              {/* Image */}
              <img
                src={pkg.gallery?.hero || pkg.image || "https://via.placeholder.com/400"}
                alt={pkg.title}
                className="h-72 w-full object-cover rounded-xl"
              />

              {/* Duration and Rating */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  {pkg.nightsDays || pkg.packageDetails || "Duration TBD"}
                </span>
                {pkg.rating && (
                  <span className="flex items-center text-green-600 font-semibold text-sm">
                    <FaStar className="mr-1 text-green-500" />
                    {pkg.rating} <span className="ml-1 text-gray-400">{pkg.reviewsLabel}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold mb-1">{pkg.title}</h2>

              {/* Route Summary */}
              <div className="bg-yellow-50 rounded px-2 py-1 text-sm font-semibold text-gray-700">
                {pkg.routeSummary || pkg.destination || "Full itinerary available"}
              </div>

              {/* Tag */}
              {pkg.tag && (
                <div className="bg-sky-50 rounded px-2 py-1 text-sm font-semibold text-gray-700 mb-2">
                  {pkg.tag}
                </div>
              )}

              {/* Price section */}
              <div className="mb-2">
                <div className="text-xl font-bold text-gray-900">
                  {pkg.pricing?.price || "Contact for pricing"}
                </div>
                {pkg.pricing?.oldPrice && (
                  <>
                    <span className="text-gray-400 line-through ml-2 text-sm">
                      {pkg.pricing.oldPrice}
                    </span>
                    {pkg.pricing?.discountLabel && (
                      <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {pkg.pricing.discountLabel}
                      </span>
                    )}
                  </>
                )}
                {pkg.pricing?.note && (
                  <p className="text-xs text-gray-600 mt-1">{pkg.pricing.note}</p>
                )}
              </div>

              {/* Buttons */}
              <Link to={"/contact"} className="flex gap-2">
                <button className="cursor-pointer flex-1 bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition">
                  Contact Us for Quotation
                </button>
              </Link>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
