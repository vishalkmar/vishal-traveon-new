import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { backendUrl } from "../../../apiConfig/config";
import { toast } from "react-hot-toast";
import { FaBus, FaChevronLeft, FaChevronRight, FaImages } from "react-icons/fa";
import { FaHotel, FaUtensils, FaBinoculars } from "react-icons/fa";
import { MdFlight } from "react-icons/md";
import { FaPlateWheat } from "react-icons/fa6";
import { getActivitiesForPackage } from "../Packages";

const TABS = [
  { key: "itinerary", label: "Itinerary" },
  { key: "stays", label: "Stays" },
  { key: "termsAndConditions", label: "T&C" },
  // { key: "inclusions", label: "Inclusions" },
  // { key: "exclusions", label: "Exclusions" },
];

const Package = () => {
  const { id } = useParams();
  const [packageDetail, setPackageDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/packages/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setPackageDetail(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch package:", error);
      }
    };
    fetchPackage();
  }, [id]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: ``,
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          subject: `Enquiry Regarding Package: ${packageDetail.title}`,
        }),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (loading || !packageDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Helper for modal navigation
  const handlePrev = () =>
    setModalIndex((i) => (i === 0 ? packageDetail.images.length - 1 : i - 1));
  const handleNext = () =>
    setModalIndex((i) => (i === packageDetail.images.length - 1 ? 0 : i + 1));

  // Helper to render JSON fields as lists
  const renderList = (arr) =>
    Array.isArray(arr) ? (
      <ul className="list-disc pl-6 space-y-1">
        {arr.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : null;

  // Helper to render new itinerary structure
  const renderItinerary = (itinerary) =>
    Array.isArray(itinerary) ? (
      <div className="space-y-4">
        {itinerary.map((day, i) => (
          <details key={i} className="border rounded overflow-hidden">
            <summary className="cursor-pointer px-4 py-2 font-semibold bg-gray-100">
              {day.dayTitle || `Day ${i + 1}`}
            </summary>
            <div className="px-4 py-2 space-y-2">
              {Array.isArray(day.schedules) &&
                day.schedules.map((schedule, j) => (
                  <ul key={j} className="mb-2">
                    <li className="list-disc ml-8">{renderRichText(schedule)}</li>
                  </ul>
                ))}
            </div>
          </details>
        ))}
      </div>
    ) : null;
  // Helper to render new T&C structure
  const renderTermsAndConditions = (sections) =>
    Array.isArray(sections) ? (
      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h4 className="font-bold mb-2 text-gray-900 text-xl">
                {section.heading}
              </h4>
            )}
            {Array.isArray(section.content) &&
              section.content.map((text, j) => (
                <ul key={j} className="mb-2">
                  <li className="list-disc ml-8">{text}</li>
                </ul>
              ))}
          </div>
        ))}
      </div>
    ) : null;

  // Helper to render stays
  const renderStays = (stays) =>
    Array.isArray(stays) ? (
      <div className="space-y-2">
        {stays.map((stay, i) => (
          <div key={i} className="border rounded px-4 py-2">
            <div className="font-semibold">{stay.name}</div>
            <div className="text-sm text-gray-600">{stay.details}</div>
          </div>
        ))}
      </div>
    ) : null;

  // Helper to render T&C, cancellation, booking terms
  const renderRichText = (data) => {
    if (!data) return null;
    if (Array.isArray(data)) return renderList(data);
    if (typeof data === "string")
      return <div dangerouslySetInnerHTML={{ __html: data }} />;
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-gray-900 shadow-2xl"></div>
      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-x-auto pb-2 max-w-screen-xl mx-auto px-4 pt-10">
        {/* Main Image */}
        <div className="md:col-span-1 row-span-2">
          <img
            src={packageDetail.image}
            alt="Main"
            className="h-[28rem] w-full object-cover rounded-l-md shadow"
          />
        </div>
        {/* Top Right Images */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {packageDetail.images?.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative group cursor-pointer"
              onClick={() => {
                setShowModal(true);
                setModalIndex(i);
              }}
            >
              <img
                src={img.url}
                alt={`Gallery ${i + 1}`}
                className={`h-[220px] w-full object-cover shadow  ${
                  i === 1 ? "rounded-tr-md" : i === 3 ? "rounded-br-md" : ""
                }`}
              />
              {/* Optional overlay label */}
              {/* {i === 0 && (
                <span className="absolute bottom-2 right-2 text-white text-sm bg-black/80 px-2 py-1 rounded">
                  Destinations
                </span>
              )}
              {i === 1 && (
                <span className="absolute bottom-2 right-2 text-white text-sm bg-black/80 px-2 py-1 rounded">
                  Stays
                </span>
              )}
              {i === 2 && (
                <span className="absolute bottom-2 right-2 text-white text-sm bg-black/80 px-2 py-1 rounded">
                  Activity & Sightseeing
                </span>
              )} */}
              {i === 3 && (
                <button
                  className="absolute bottom-2 right-2 bg-white shadow px-2 py-1 rounded-lg flex items-center gap-2 text-gray-700 cursor-pointer text-sm"
                  onClick={() => {
                    setShowModal(true);
                    setModalIndex(0);
                  }}
                  style={{ zIndex: 10 }}
                >
                  <FaImages /> View All Images
                </button>
              )}
            </div>
          ))}
          {/* View All Images Button */}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="relative bg-white rounded-xl shadow-lg p-4 max-w-2xl w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <img
              src={packageDetail.images[modalIndex]?.url}
              alt={`Gallery ${modalIndex + 1}`}
              className="h-96 w-full object-contain rounded mb-4"
            />
            <div className="flex justify-between w-full">
              <button
                className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-xl"
                onClick={handlePrev}
              >
                <FaChevronLeft />
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-xl"
                onClick={handleNext}
              >
                <FaChevronRight />
              </button>
            </div>
            <div className="mt-2 text-center text-gray-600">
              {modalIndex + 1} / {packageDetail.images.length}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 pt-10 grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        <div className="md:col-span-2">
          <div className="px-4 pt-6 pb-2">
            {/* Title */}
            <h1 className="text-4xl font-bold mb-3 leading-tight">
              {packageDetail.title}
            </h1>
            {/* Duration badge and city breakdown */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {/* Duration badge */}
              <span className="bg-sky-600 text-white font-bold px-4 py-1 rounded-lg text-lg mr-2">
                {/* Example: 9D/8N */}
                {packageDetail.packageDetails?.match(
                  /\d+\s*Days?\s*\|\s*\d+\s*Nights?/
                )?.[0]
                  ? packageDetail.packageDetails
                      .match(/\d+\s*Days?\s*\|\s*\d+\s*Nights?/)[0]
                      .replace(/\s*\|\s*/g, "/")
                      .replace(/Days?/i, "D")
                      .replace(/Nights?/i, "N")
                  : "Duration"}
              </span>
            </div>

            <div className="text-gray-600 mb-4">
              {packageDetail.description}
            </div>

            {/* Package Type Badge */}
            {packageDetail.packageType && (
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {packageDetail.packageType}
                </span>
              </div>
            )}

            <div className="font-semibold mb-1 text-xl">Overview</div>
            <div className="text-gray-600 mb-4">
              {packageDetail.packageOverview}
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Inclusions icons row */}
            <div className="flex flex-wrap gap-8 items-center py-2">
              <div className="flex items-center gap-2 text-gray-700 text-lg">
                <MdFlight className="text-2xl" />
                <span className="font-medium">Flights Included</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-lg">
                <FaHotel className="text-2xl" />
                <span className="font-medium">Stay Included</span>
              </div>
              {packageDetail.title.includes("Muscat & Salalah") ? (
                <div className="flex items-center gap-2 text-gray-700 text-lg">
                  <FaPlateWheat className="text-2xl" />
                  <span className="font-medium">All Meal Included</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-700 text-lg">
                  <FaUtensils className="text-2xl" />
                  <span className="font-medium">Breakfast Included</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700 text-lg">
                <FaBinoculars className="text-2xl" />
                <span className="font-medium">
                  {getActivitiesForPackage(packageDetail).length} Activities
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-lg">
                <FaBus className="text-2xl" />
                <span className="font-medium">All Transfers</span>
              </div>
              {/* Add more as needed */}
            </div>
            <hr className="my-4" />
          </div>

          {/* Details */}
          <div className="max-w-screen-xl mx-auto pb-4">
            {/* Tabs Section */}
            <div className="bg-white rounded-lg shadow-sm border mx-4 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-blue-600 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "itinerary" && (
                  <div>{renderItinerary(packageDetail.itinerary)}</div>
                )}

                {activeTab === "stays" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Stays</h3>
                    <p className="text-gray-600 mb-4">
                      Discover the must-see attractions and experiences that are
                      a part of your journey.
                    </p>
                    {renderStays(packageDetail.stays)}
                  </div>
                )}

                {activeTab === "termsAndConditions" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Booking Information
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Understand our policies to make informed choices and
                      ensure a smooth booking experience.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold mb-2 text-gray-900 text-xl">
                          Inclusions
                        </h4>
                        {renderRichText(packageDetail.inclusions)}
                      </div>

                      <div>
                        <h4 className="font-bold mb-2 text-gray-900 text-xl">
                          Exclusions
                        </h4>
                        {renderRichText(packageDetail.exclusions)}
                      </div>

                      <div>
                        {packageDetail.bookingTerms.length > 0 && (
                          <h4 className="font-bold mb-2 text-gray-900 text-xl">
                            Booking Terms
                          </h4>
                        )}
                        {renderRichText(packageDetail.bookingTerms)}
                      </div>

                      <div>
                        <h4 className="font-bold mb-2 text-gray-900 text-xl">
                          Terms & Conditions :
                        </h4>
                        {renderTermsAndConditions(
                          packageDetail.termsAndConditions
                        )}
                      </div>

                      <div>
                        {packageDetail.cancellationPolicy.length > 0 && (
                          <h4 className="font-bold mb-2 text-gray-900 text-xl">
                            Cancellation Policy
                          </h4>
                        )}
                        {renderRichText(packageDetail.cancellationPolicy)}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "availability" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Availability</h3>
                    <p className="text-gray-600 mb-4">
                      Check available dates and book your preferred travel time.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Please contact us for current availability and pricing
                        for your preferred travel dates.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Enquiry Form */}
        <div className="p-4 sticky top-8">
          <div className="bg-white rounded shadow p-4 mb-4">
            <div className="text-xl font-bold mb-2 ">
              INR {packageDetail.price}
            </div>
            <p className="mb-4 text-gray-600 font-semibold">
              Avg. Price / Person
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-2 bg-white rounded shadow p-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 rounded"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border p-2 rounded"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full border p-2 rounded"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <textarea
              placeholder="Enquiry"
              className="w-full border p-2 rounded"
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full bg-[#28bccf] text-white py-2 rounded"
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Package;
