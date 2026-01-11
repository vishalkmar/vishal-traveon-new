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
      const response = await fetch(`${backendUrl}/packages`);
      const data = await response.json();
      setPackages(data);
      setLoading(false);
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
                src={pkg.image}
                alt={pkg.title}
                className="h-72 w-full object-cover rounded-xl"
              />

              {/* Duration and Rating */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  {/* Example: 9 days & 8 nights */}
                  {pkg.packageDetails.replace(/\|/g, "&") || "Duration"}
                </span>
                {/* <span className="flex items-center text-green-600 font-semibold text-sm">
                  <FaStar className="mr-1 text-green-500" />
                  4.9 <span className="ml-1 text-gray-400">(523)</span>
                </span> */}
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold mb-1">{pkg.title}</h2>

              {/*  Cities/Days summary */}
              <div className="bg-yellow-50 rounded px-2 py-1 text-sm font-semibold text-gray-700 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  {formatDescription(pkg.description)?.map((item, idx, arr) => (
                    <span key={idx} className="flex items-center">
                      <span className="font-bold">{item.days}N</span>&nbsp;
                      {item.city}
                      {idx < arr.length - 1 && <span className="mx-2">•</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="bg-sky-50 rounded px-2 py-1 text-sm font-semibold text-gray-700 mb-2 flex flex-col gap-2">
                <div className="">
                  {/* Included Activities : */}
                  <ul className="ml-4 grid grid-cols-2 gap-3">
                    {getActivitiesForPackage(pkg)
                      .splice(0, 4)
                      .map((activity, idx) => (
                        <li key={idx} className="list-disc ml-2 text-xs">
                          {activity}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Price section */}
              <div className="mb-2">
                <span className="text-xl font-bold text-gray-900">
                  INR {pkg.price}/- Avg. price / person
                </span>
                {/* <span className="ml-2 text-gray-400 line-through">
                  INR 2,65,185
                </span>
                <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                  SAVE INR 1,21,985
                </span> */}
              </div>

              {/* Buttons */}
              <Link to={"/contact"} className="flex gap-2">
                {/* <button className="cursor-pointer flex items-center border border-sky-400 text-sky-500 px-3 py-2 rounded-lg hover:bg-sky-50 transition">
                  <FaPhone className="" />
                </button> */}
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
