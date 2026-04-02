import React, { useState } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function MicePlanForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: "",
    noOfEmployees: "",
    noOfNights: "",
    noOfDays: "",
    budget: "",
    isHotel: "no",
    hotelStar: "",
    customHotelName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build WhatsApp message
    const message = `Hi! I'm interested in planning a M.I.C.E Tour with the following details:

Company Name: ${formData.companyName || "N/A"}
Number of Employees: ${formData.noOfEmployees || "N/A"}
Number of Nights: ${formData.noOfNights || "N/A"}
Number of Days: ${formData.noOfDays || "N/A"}
Budget: ${formData.budget || "N/A"}
Hotel Required: ${formData.isHotel === "yes" ? "Yes" : "No"}
${formData.isHotel === "yes" ? `Hotel Star: ${formData.hotelStar || "N/A"}` : ""}
${formData.customHotelName ? `Custom Hotel Preference: ${formData.customHotelName}` : ""}

Please call me back at your earliest convenience.`;

    const whatsappUrl = `https://wa.me/919540111307?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Reset form
    setFormData({
      companyName: "",
      noOfEmployees: "",
      noOfNights: "",
      noOfDays: "",
      budget: "",
      isHotel: "no",
      hotelStar: "",
      customHotelName: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md" style={{ width: '35%', minWidth: '320px' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] px-6 py-4 flex items-center justify-between text-white rounded-t-3xl">
          <h2 className="text-2xl font-bold">Plan Your M.I.C.E Tour</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Company Name */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* No of Employees */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Employees *
              </label>
              <input
                type="number"
                name="noOfEmployees"
                value={formData.noOfEmployees}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* No of Nights */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nights *
              </label>
              <input
                type="number"
                name="noOfNights"
                value={formData.noOfNights}
                onChange={handleChange}
                placeholder="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* No of Days */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Days *
              </label>
              <input
                type="number"
                name="noOfDays"
                value={formData.noOfDays}
                onChange={handleChange}
                placeholder="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Budget (INR) *
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="5,00,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Is Hotel Required */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hotel ? *
              </label>
              <select
                name="isHotel"
                value={formData.isHotel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {/* Hotel Star + Custom Hotel Name (Combined Dropdown) */}
            {formData.isHotel === "yes" && (
              <>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Hotel Preference *
                  </label>
                  <select
                    name="hotelStar"
                    value={formData.hotelStar}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                  >
                    <option value="">Select option</option>
                    <option value="3-star">3 Star</option>
                    <option value="4-star">4 Star</option>
                    <option value="5-star">5 Star</option>
                    <option value="custom">Custom Name</option>
                  </select>
                </div>

                {/* Custom Hotel Name Input (Only shows if Custom is selected) */}
                {formData.hotelStar === "custom" && (
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="customHotelName"
                      value={formData.customHotelName}
                      onChange={handleChange}
                      placeholder="Enter hotel name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                      required={formData.hotelStar === "custom"}
                    />
                  </div>
                )}
              </>
            )}

            {/* Plan Now Button */}
            <button
              type="submit"
              className="col-span-2 mt-3 bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs"
            >
              <FaWhatsapp className="w-4 h-4" />
              Plan Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
