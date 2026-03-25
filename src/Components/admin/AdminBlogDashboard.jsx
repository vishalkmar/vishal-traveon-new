import React, { useState, useEffect } from "react";
import { FileText, MapPin, Trash2, Edit2, Loader } from "lucide-react";
import AddBlogModal from "../../Components/admin/AddBlogModal";
import AddDestinationModal from "../../Components/admin/AddDestinationModal";
import { backendUrl } from "../../../apiConfig/config";
import toast from "react-hot-toast";

export default function AdminDashboardContent() {

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isEditBlogModalOpen, setIsEditBlogModalOpen] = useState(false);
  const [isEditDestinationModalOpen, setIsEditDestinationModalOpen] = useState(false);
  
  const [destinations, setDestinations] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch Destinations
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/destinations`);
      const data = await response.json();
      if (data.success) {
        setDestinations(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      toast.error("Failed to fetch destinations");
    }
    setLoading(false);
  };

  // Fetch Blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/blog`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDestinations();
    fetchBlogs();
  }, []);

  const handleBlogSuccess = () => {
    setIsBlogModalOpen(false);
    fetchBlogs();
  };

  const handleDestinationSuccess = () => {
    setIsDestinationModalOpen(false);
    fetchDestinations();
  };

  const handleEditBlogSuccess = () => {
    setIsEditBlogModalOpen(false);
    setEditingItem(null);
    fetchBlogs();
  };

  const handleEditDestinationSuccess = () => {
    setIsEditDestinationModalOpen(false);
    setEditingItem(null);
    fetchDestinations();
  };

  // Delete Destination
  const handleDeleteDestination = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    
    setDeleteLoading(id);
    try {
      const response = await fetch(`${API_BASE}/api/v1/destinations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Destination deleted successfully");
        fetchDestinations();
      } else {
        toast.error(data.message || "Failed to delete destination");
      }
    } catch (error) {
      console.error("Error deleting destination:", error);
      toast.error("Error deleting destination");
    }
    setDeleteLoading(null);
  };

  // Delete Blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    setDeleteLoading(id);
    try {
      const response = await fetch(`${API_BASE}/api/v1/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
      } else {
        toast.error(data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Error deleting blog");
    }
    setDeleteLoading(null);
  };

  const handleEditDestination = (destination) => {
    setEditingItem(destination);
    setIsEditDestinationModalOpen(true);
  };

  const handleEditBlog = (blog) => {
    setEditingItem(blog);
    setIsEditBlogModalOpen(true);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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

        {/* Destinations Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Destinations</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center items-center gap-2">
                <Loader className="animate-spin w-6 h-6 text-[#44B3C4]" />
                <span>Loading destinations...</span>
              </div>
            ) : destinations.length === 0 ? (
              <div className="p-8 text-center text-slate-600">
                No destinations yet. Create one using the card above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Description</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((destination) => (
                      <tr key={destination.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          {destination.image && (
                            <img 
                              src={destination.image} 
                              alt={destination.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{destination.name}</td>
                        <td className="px-6 py-4 text-slate-700 max-w-xs truncate">
                          {destination.description}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEditDestination(destination)}
                              className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDestination(destination.id)}
                              disabled={deleteLoading === destination.id}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteLoading === destination.id ? (
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Blogs Table */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Blogs</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center items-center gap-2">
                <Loader className="animate-spin w-6 h-6 text-[#44B3C4]" />
                <span>Loading blogs...</span>
              </div>
            ) : blogs.length === 0 ? (
              <div className="p-8 text-center text-slate-600">
                No blogs yet. Create one using the card above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Destination</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Excerpt</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          {blog.image && (
                            <img 
                              src={blog.image} 
                              alt={blog.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{blog.title}</td>
                        <td className="px-6 py-4 text-slate-700">
                          {blog.destination?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-slate-700 max-w-xs truncate">
                          {blog.excerpt}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              disabled={deleteLoading === blog.id}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteLoading === blog.id ? (
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

      {isEditBlogModalOpen && editingItem && (
        <AddBlogModal
          onClose={() => setIsEditBlogModalOpen(false)}
          onSuccess={handleEditBlogSuccess}
          initialData={editingItem}
          isEdit={true}
        />
      )}

      {isEditDestinationModalOpen && editingItem && (
        <AddDestinationModal
          onClose={() => setIsEditDestinationModalOpen(false)}
          onSuccess={handleEditDestinationSuccess}
          initialData={editingItem}
          isEdit={true}
        />
      )}
    </div>
  );
}
