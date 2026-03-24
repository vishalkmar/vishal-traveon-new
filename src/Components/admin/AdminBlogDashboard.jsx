import React, { useState } from "react";
import { FileText, MapPin } from "lucide-react";
import AddBlogModal from "../../Components/admin/AddBlogModal";
import AddDestinationModal from "../../Components/admin/AddDestinationModal";

export default function AdminDashboardContent() {
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);

  const handleBlogSuccess = () => {
    setIsBlogModalOpen(false);
    // Optionally refresh data here
  };

  const handleDestinationSuccess = () => {
    setIsDestinationModalOpen(false);
    // Optionally refresh data here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Manage your blog destinations and create new blog posts
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add New Blog Card */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-[#44B3C4]/10 rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-[#44B3C4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Add New Blog
            </h2>
            <p className="text-slate-600 mb-6">
              Create a new blog post with multiple images, content, and attach it to a destination.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#44B3C4] rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-slate-700">
                  Upload up to 5 images
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#44B3C4] rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-slate-700">
                  Select destination for the blog
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#44B3C4] rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-slate-700">
                  Add title, excerpt, and content
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsBlogModalOpen(true)}
              className="w-full py-3 bg-[#44B3C4] hover:bg-[#2a96ab] text-white font-semibold rounded-xl transition"
            >
              Start Creating Blog
            </button>
          </div>

          {/* Add New Destination Card */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-[#44B3C4]/10 rounded-2xl mb-6">
              <MapPin className="w-8 h-8 text-[#44B3C4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Add New Destination
            </h2>
            <p className="text-slate-600 mb-6">
              Create a new travel destination for your blog to be associated with.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#44B3C4] rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-slate-700">
                  Upload destination image
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#44B3C4] rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-slate-700">
                  Set destination name and country
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-[#44B3C4] rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-slate-700">
                  Write a compelling description
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDestinationModalOpen(true)}
              className="w-full py-3 bg-[#44B3C4] hover:bg-[#2a96ab] text-white font-semibold rounded-xl transition"
            >
              Add Destination
            </button>
          </div>

        </div>
      </div>

      {/* Modals */}
      {isBlogModalOpen && (
        <AddBlogModal
          onClose={() => setIsBlogModalOpen(false)}
          onSuccess={handleBlogSuccess}
        />
      )}

      {isDestinationModalOpen && (
        <AddDestinationModal
          onClose={() => setIsDestinationModalOpen(false)}
          onSuccess={handleDestinationSuccess}
        />
      )}
    </div>
  );
}
