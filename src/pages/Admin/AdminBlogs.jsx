import React, { useState, useEffect } from "react";
import { Plus, Loader, Trash2, Edit2 } from "lucide-react";
import AddDestinationModal from "../../Components/admin/AddDestinationModal";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function AdminBlogs() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch destinations
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/v1/destinations`);
      setDestinations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_BASE}/v1/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDestinations(destinations.filter((d) => d.id !== id));
      alert("Destination deleted successfully!");
    } catch (error) {
      console.error("Error deleting destination:", error);
      alert("Error deleting destination");
    }
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    setEditingId(null);
    fetchDestinations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Manage Blog Destinations
          </h1>
          <p className="text-slate-600">
            Add, edit, or delete travel destinations for your blog
          </p>
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#44B3C4] hover:bg-[#2a96ab] text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <Plus className="w-5 h-5" />
            Add New City
          </button>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 text-[#44B3C4] animate-spin" />
          </div>
        ) : destinations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">
              No destinations added yet
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#44B3C4] font-semibold hover:text-[#2a96ab]"
            >
              Add the first destination
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-[#44B3C4] to-[#2a96ab] overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {destination.description}
                  </p>

                  {/* Stats */}
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <p className="text-xs text-slate-500">
                      Blogs: {destination.blogs?.length || 0}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(destination.id);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(destination.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddDestinationModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingId(null);
          }}
          onSuccess={handleAddSuccess}
          editingId={editingId}
        />
      )}
    </div>
  );
}
