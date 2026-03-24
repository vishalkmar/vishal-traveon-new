import React, { useState } from "react";
import { X, Upload, Loader } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function AddDestinationModal({ onClose, onSuccess, editingId }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // Check environment variables on mount
  React.useEffect(() => {
    console.log("🔍 Environment Variables Check:");
    console.log("API_BASE:", API_BASE);
    console.log("CLOUDINARY_CLOUD_NAME:", CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_UPLOAD_PRESET:", CLOUDINARY_UPLOAD_PRESET);

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.warn("⚠️ Missing Cloudinary environment variables in .env");
    }
  }, []);

  // Handle image upload
  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).length;
    setFormData({ ...formData, description: text });
    setWordCount(words);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("City name is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (wordCount < 10) {
      setError(`Description must have at least 10 words (current: ${wordCount})`);
      return;
    }

    if (!formData.image && !editingId) {
      setError("Image is required");
      return;
    }

    try {
      setLoading(true);

      // Upload image to Cloudinary if new image selected
      let imageUrl = null;
      if (formData.image && typeof formData.image === "object") {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.image);
        uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
          const uploadResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            uploadFormData
          );
          imageUrl = uploadResponse.data.secure_url;
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
          setError("Failed to upload image. Check console and env variables.");
          setLoading(false);
          return;
        }
      }

      // Save to backend
      const token = localStorage.getItem("adminToken");
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        ...(imageUrl && { image: imageUrl }),
      };

      if (editingId) {
        await axios.patch(
          `${API_BASE}/v1/destinations/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${API_BASE}/v1/destinations`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving destination:", err);
      setError(err.response?.data?.message || "Error saving destination");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add New City</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Destination Image *
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
              className="border-2 border-dashed border-[#44B3C4] rounded-xl p-6 text-center cursor-pointer hover:bg-[#44B3C4]/5 transition"
            >
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                  />
                  <label className="text-sm font-semibold text-[#44B3C4] cursor-pointer hover:text-[#2a96ab]">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-8 h-8 text-[#44B3C4] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-900">
                    Drag & drop image or click to upload
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* City Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              City Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Oman, Seychelles, Vietnam"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44B3C4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Description (Min 10 words) *
            </label>
            <textarea
              placeholder="Write a compelling description about this destination..."
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44B3C4] resize-none"
            />
            <div className="flex justify-between mt-2">
              <p className={`text-xs ${wordCount < 10 ? "text-red-600" : "text-green-600"}`}>
                Words: {wordCount} {wordCount < 10 ? "- Minimum 10 required" : "✓"}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#44B3C4] hover:bg-[#2a96ab] disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Add Destination"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
