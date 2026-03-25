import React, { useState, useEffect } from "react";
import { X, Upload, Loader, Trash2 } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function AddBlogModal({ onClose, onSuccess, editingId, initialData, isEdit }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    destinationId: initialData?.destinationId || "",
    images: initialData?.images || [],
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    author: initialData?.author || "Admin",
    category: initialData?.category || "Travel",
    readTime: initialData?.readTime || "5 min read",
  });

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState(initialData?.images || []);
  const [error, setError] = useState("");
  const [wordCountExcerpt, setWordCountExcerpt] = useState(0);
  const [wordCountContent, setWordCountContent] = useState(0);

  // Fetch destinations on mount
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/destinations`);
      setDestinations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  // Handle image drop
  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleImages(files);
  };

  // Handle image select
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    handleImages(files);
  };

  // Process images
  const handleImages = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (formData.images.length + imageFiles.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setFormData({
      ...formData,
      images: [...formData.images, ...imageFiles],
    });
  };

  // Remove image
  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Handle text changes
  const handleExcerptChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).length;
    setFormData({ ...formData, excerpt: text });
    setWordCountExcerpt(words);
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).length;
    setFormData({ ...formData, content: text });
    setWordCountContent(words);
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    const uploadedUrls = [];

    for (const imageFile of formData.images) {
      if (typeof imageFile === "string") {
        // Already a URL
        uploadedUrls.push(imageFile);
        continue;
      }

      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);
      uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          console.error("Cloudinary error response:", errorData);
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const uploadData = await uploadResponse.json();
        uploadedUrls.push(uploadData.secure_url);
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        throw new Error("Failed to upload image");
      }
    }

    return uploadedUrls;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (formData.title.trim().length < 5) {
      setError("Title must be at least 5 characters");
      return;
    }

    if (!formData.destinationId) {
      setError("Destination is required");
      return;
    }

    if (formData.images.length === 0) {
      setError("At least one image is required");
      return;
    }

    if (!formData.excerpt.trim()) {
      setError("Excerpt is required");
      return;
    }

    if (wordCountExcerpt < 10) {
      setError(`Excerpt must have at least 10 words (current: ${wordCountExcerpt})`);
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    if (wordCountContent < 50) {
      setError(`Content must have at least 50 words (current: ${wordCountContent})`);
      return;
    }

    try {
      setLoading(true);
      setUploading(true);

      // Upload images to Cloudinary
      const uploadedUrls = await uploadImagesToCloudinary();

      // Save to backend
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const payload = {
        title: formData.title.trim(),
        destinationId: formData.destinationId,
        images: uploadedUrls,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || "Admin",
        category: formData.category,
        readTime: formData.readTime,
        date: new Date().toISOString().split("T")[0],
      };

      if (isEdit || editingId) {
        await axios.put(`${API_BASE}/api/v1/blog/${initialData?.id || editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE}/api/v1/blog`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving blog:", err);
      setError(err.response?.data?.message || "Error saving blog");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Blog" : "Add New Blog"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
            disabled={uploading}
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Blog Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Best Summer Destinations"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44B3C4]"
              disabled={uploading}
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Destination *
            </label>
            <select
              value={formData.destinationId}
              onChange={(e) =>
                setFormData({ ...formData, destinationId: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44B3C4]"
              disabled={uploading}
            >
              <option value="">Select a destination</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Blog Images (Max 5) *
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
              className="border-2 border-dashed border-[#44B3C4] rounded-xl p-6 text-center cursor-pointer hover:bg-[#44B3C4]/5 transition"
            >
              <Upload className="w-8 h-8 text-[#44B3C4] mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-900">
                Drag & drop images or click to upload
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ({formData.images.length}/5 images added)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="imageInput"
                disabled={uploading}
              />
              <label htmlFor="imageInput" className="cursor-pointer">
                {formData.images.length < 5 && (
                  <span className="text-sm font-semibold text-[#44B3C4] hover:text-[#2a96ab]">
                    Add More Images
                  </span>
                )}
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      disabled={uploading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Excerpt (Min 10 words) *
            </label>
            <textarea
              placeholder="Write a brief summary of the blog..."
              value={formData.excerpt}
              onChange={handleExcerptChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44B3C4] resize-none"
              disabled={uploading}
            />
            <div className="flex justify-between mt-2">
              <p className={`text-xs ${wordCountExcerpt < 10 ? "text-red-600" : "text-green-600"}`}>
                Words: {wordCountExcerpt} {wordCountExcerpt < 10 ? "- Minimum 10 required" : "✓"}
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Blog Content (Min 50 words) *
            </label>
            <textarea
              placeholder="Write the full blog content..."
              value={formData.content}
              onChange={handleContentChange}
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44B3C4] resize-none"
              disabled={uploading}
            />
            <div className="flex justify-between mt-2">
              <p className={`text-xs ${wordCountContent < 50 ? "text-red-600" : "text-green-600"}`}>
                Words: {wordCountContent} {wordCountContent < 50 ? "- Minimum 50 required" : "✓"}
              </p>
            </div>
          </div>

          {/* Author & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Author
              </label>
              <input
                type="text"
                placeholder="Author name"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44B3C4]"
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44B3C4]"
                disabled={uploading}
              >
                <option>Travel</option>
                <option>Culture</option>
                <option>Adventure</option>
                <option>Guide</option>
                <option>Tips</option>
                <option>Experience</option>
              </select>
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
            disabled={loading || uploading}
            className="w-full py-3 bg-[#44B3C4] hover:bg-[#2a96ab] disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading || uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {uploading ? "Uploading images..." : "Saving..."}
              </>
            ) : isEdit ? (
              "Update Blog"
            ) : (
              "Add Blog"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
