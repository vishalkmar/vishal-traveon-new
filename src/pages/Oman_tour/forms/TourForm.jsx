import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Upload,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TourForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    numberOfTravellers: 1,
    travellers: [
      {
        id: 1,
        name: "",
        passportScan: null,
        photo: null,
        panCard: null,
        aadharCard: null,
        flightBooking: null,
      },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTravellerCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    const currentTravellers = [...formData.travellers];

    if (count > currentTravellers.length) {
      for (let i = currentTravellers.length; i < count; i++) {
        currentTravellers.push({
          id: i + 1,
          name: "",
          passportScan: null,
          photo: null,
          panCard: null,
          aadharCard: null,
          flightBooking: null,
        });
      }
    } else {
      currentTravellers.splice(count);
    }

    setFormData((prev) => ({
      ...prev,
      numberOfTravellers: count,
      travellers: currentTravellers,
    }));
  };

  const handleTravellerChange = (index, field, value) => {
    const updatedTravellers = [...formData.travellers];
    updatedTravellers[index][field] = value;
    setFormData((prev) => ({ ...prev, travellers: updatedTravellers }));
  };

  const validateForm = () => {
    if (
      !formData.contactName ||
      !formData.contactEmail ||
      !formData.contactPhone
    ) {
      toast.error("Please fill in all contact details");
      return false;
    }

    for (let i = 0; i < formData.travellers.length; i++) {
      const t = formData.travellers[i];
      if (
        !t.name ||
        !t.passportScan ||
        !t.photo ||
        !t.panCard ||
        !t.aadharCard
      ) {
        toast.error(`Please complete all details for Traveller ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your booking...");

    try {
      const payload = {
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        numberOfTravellers: formData.numberOfTravellers,
        totalAmount: formData.numberOfTravellers * 5000,
        travellers: formData.travellers, // Arrays of objects with URL strings
      };

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:8000"
        }/api/v1/tour/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Booking submitted successfully!", { id: toastId });
        setTimeout(() => window.location.reload(), 2000); // Or redirect to success page
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-600 p-6 sm:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <button
          onClick={onBack}
          className="flex items-center text-emerald-100 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </button>
        <h2 className="text-3xl font-bold">Oman Tour Package Application</h2>
        <p className="text-emerald-100 mt-2">
          Complete the form below to book your adventure. Total: ₹
          {(formData.numberOfTravellers * 5000).toLocaleString()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
        {/* Contact Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center border-b pb-2">
            <User className="w-5 h-5 mr-2 text-emerald-600" />
            Primary Contact & Booking Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleContactChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                placeholder="Your Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleContactChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleContactChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of Travellers
              </label>
              <input
                type="number"
                min="1"
                max="50"
                name="numberOfTravellers"
                value={formData.numberOfTravellers}
                onChange={handleTravellerCountChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Travellers Loop */}
        <div className="space-y-8">
          {formData.travellers.map((traveller, index) => (
            <motion.div
              key={traveller.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative"
            >
              <div className="absolute top-4 right-4 text-slate-300 text-4xl font-black opacity-20 pointer-events-none">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-6">
                Traveller {index + 1} Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name (As on Passport)
                  </label>
                  <input
                    type="text"
                    value={traveller.name}
                    onChange={(e) =>
                      handleTravellerChange(index, "name", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white"
                    placeholder="Enter full name"
                  />
                </div>

                <FileInput
                  label="Passport Scan"
                  sub="Front & Back in one file"
                  value={traveller.passportScan}
                  onChange={(url) =>
                    handleTravellerChange(index, "passportScan", url)
                  }
                  folder="tour/passport"
                  accept=".pdf,image/*,.doc,.docx"
                  docType="passport"
                />
                <FileInput
                  label="Passport Size Photo"
                  sub="Recent photo with white background"
                  value={traveller.photo}
                  onChange={(url) => handleTravellerChange(index, "photo", url)}
                  folder="tour/photo"
                  accept="image/*"
                  docType="photo"
                />
                <FileInput
                  label="PAN Card"
                  sub="Required for TCS compliance"
                  value={traveller.panCard}
                  onChange={(url) =>
                    handleTravellerChange(index, "panCard", url)
                  }
                  folder="tour/pan"
                  accept=".pdf,image/*"
                  docType="pan_card"
                />
                <FileInput
                  label="Aadhar Card"
                  sub="For Address verification"
                  value={traveller.aadharCard}
                  onChange={(url) =>
                    handleTravellerChange(index, "aadharCard", url)
                  }
                  folder="tour/aadhar"
                  accept=".pdf,image/*"
                  docType="aadhar_card"
                />
                <FileInput
                  label="Flight Booking"
                  sub="Optional: If already booked"
                  optional
                  value={traveller.flightBooking}
                  onChange={(url) =>
                    handleTravellerChange(index, "flightBooking", url)
                  }
                  folder="tour/flight"
                  accept=".pdf,image/*"
                  docType="flight_ticket"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Processing..."
              : `Confirm & Pay ₹${(
                  formData.numberOfTravellers * 5000
                ).toLocaleString()}`}
          </button>
          <p className="text-center text-slate-400 text-sm mt-4 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Secure form submission
          </p>
        </div>
      </form>
    </div>
  );
};

const FileInput = ({
  label,
  sub,
  onChange,
  accept,
  optional,
  value,
  folder,
  docType,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large (max 10MB)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType || "document");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:8000"
        }/api/v1/validation/validate`,
        {
          method: "POST",
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (data.success) {
        // Validation Passed
        onChange(data.data.url); // Pass URL back to parent
        toast.success("Document verified & uploaded!");
      } else {
        // Validation Failed or Error
        const issues = data.data?.analysis?.issues || [];
        const issueMsg = issues.length > 0 ? issues[0] : "Invalid document";
        throw new Error(data.message || issueMsg);
      }
    } catch (err) {
      console.error(err);
      clearInterval(progressInterval);
      setError(err.message || "Upload failed");
      toast.error(err.message || "Document validation failed");
      e.target.value = null; // Clear input
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {!optional && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <input
          type="file"
          accept={accept}
          onChange={handleUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          disabled={isUploading}
        />
        <div
          className={`w-full px-4 py-3 rounded-lg border-2 border-dashed ${
            value
              ? "border-emerald-500 bg-emerald-50"
              : error
              ? "border-red-500 bg-red-50"
              : "border-slate-300 bg-white"
          } transition-all group-hover:border-emerald-400 flex flex-col justify-center min-h-[60px] relative overflow-hidden`}
        >
          {isUploading && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="absolute bottom-0 left-0 h-1 bg-emerald-500"
            />
          )}

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center truncate">
              {isUploading ? (
                <div className="w-5 h-5 mr-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload
                  className={`w-5 h-5 mr-3 ${
                    value ? "text-emerald-500" : "text-slate-400"
                  }`}
                />
              )}

              <div className="flex flex-col">
                <span
                  className={`text-sm truncate ${
                    value ? "text-emerald-700 font-medium" : "text-slate-500"
                  }`}
                >
                  {isUploading
                    ? `Verifying... ${uploadProgress}%`
                    : value
                    ? "Document Verified"
                    : "Choose file to upload"}
                </span>
              </div>
            </div>

            {value && !isUploading && (
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-500 mt-1 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </p>
      ) : sub ? (
        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      ) : null}

      {value && !isUploading && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-emerald-600 hover:text-emerald-700 underline mt-1 inline-flex items-center"
        >
          View uploaded document
        </a>
      )}
    </div>
  );
};

export default TourForm;
