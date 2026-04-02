import React, { useState } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function CustomizePackageForm({ isOpen, onClose}) {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    country: "",
    destination: "",
    departureCity: "",
    planningDate: "",
    noOfAdults: "",
    noOfChildren: "",
    hotelStar: "",
    budget: "",
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

    // Validate required fields
    if (
      !formData.name ||
      !formData.contactNo ||
      !formData.email ||
      !formData.country ||
      !formData.destination ||
      !formData.departureCity ||
      !formData.planningDate ||
      !formData.noOfAdults ||
      !formData.noOfChildren ||
      !formData.hotelStar ||
      !formData.budget
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Create WhatsApp message
    const message = `Hi! I want to customize this package:
    
Name: ${formData.name}
Contact No: ${formData.contactNo}
Email: ${formData.email}
Country: ${formData.country}
Destination: ${formData.destination}
Departure City: ${formData.departureCity}
Planning Date: ${formData.planningDate}
No of Adults: ${formData.noOfAdults}
No of Children: ${formData.noOfChildren}
Hotel Preference: ${formData.hotelStar}
Budget: ${formData.budget}

Please get back to me with customized options.`;

    const phone = "919540111307";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // Reset form and close
    setFormData({
      name: "",
      contactNo: "",
      email: "",
      country: "",
      destination: "",
      departureCity: "",
      planningDate: "",
      noOfAdults: "",
      noOfChildren: "",
      hotelStar: "",
      budget: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full"
        style={{ width: "35%", minWidth: "380px" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] px-6 py-4 flex items-center justify-between text-white rounded-t-3xl">
          <h2 className="text-2xl font-bold">Customize Package</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Name */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Contact No */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Contact No *
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="9XXXXXXXXX"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Country */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="India"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Dubai"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Departure City */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Departure City *
              </label>
              <input
                type="text"
                name="departureCity"
                value={formData.departureCity}
                onChange={handleChange}
                placeholder="Delhi"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Planning Date */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Planning Date *
              </label>
              <input
                type="date"
                name="planningDate"
                value={formData.planningDate}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* No of Adults */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Adults *
              </label>
              <input
                type="number"
                name="noOfAdults"
                value={formData.noOfAdults}
                onChange={handleChange}
                placeholder="2"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* No of Children */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Children *
              </label>
              <input
                type="number"
                name="noOfChildren"
                value={formData.noOfChildren}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Hotel Star */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Hotel Preference *
              </label>
              <select
                name="hotelStar"
                value={formData.hotelStar}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              >
                <option value="">Select Hotel Star</option>
                <option value="3-star">3 Star</option>
                <option value="4-star">4 Star</option>
                <option value="5-star">5 Star</option>
              </select>
            </div>

            {/* Budget */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Budget (INR) *
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="5,00,000"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44B3C4] focus:border-transparent outline-none transition text-xs"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="col-span-2 mt-2 bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs"
            >
              <FaWhatsapp className="w-4 h-5" />
                Plan Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
