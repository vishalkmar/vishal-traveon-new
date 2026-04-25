import React, { useState, useEffect } from "react";
import { Plus, Loader2, Trash2, Edit2, BookOpen } from "lucide-react";
import AddDestinationModal from "./AddDestinationModal";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function BlogsAdmin() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      await axios.delete(`${API_BASE}/v1/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDestinations((prev) => prev.filter((d) => d.id !== id));
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
    <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Blog Destinations</h3>
            <p className="text-xs text-gray-400 font-medium">
              Manage cities and travel guides shown on the blogs page
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30"
        >
          <Plus className="w-4 h-4" />
          Add New City
        </button>
      </div>

      {/* Body */}
      <div className="p-6 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          </div>
        ) : destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-300">
            <BookOpen className="w-12 h-12" />
            <p className="font-bold text-gray-400">No destinations added yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-cyan-600 font-semibold underline"
            >
              Add the first destination
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all"
              >
                <div className="h-44 bg-gradient-to-br from-cyan-400 to-cyan-600 overflow-hidden">
                  {destination.image ? (
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-black text-gray-900 mb-1">
                    {destination.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[2rem]">
                    {destination.description}
                  </p>
                  <div className="mb-3 pb-3 border-b border-gray-100">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                      Blogs:{" "}
                      <span className="text-gray-700">
                        {destination.blogs?.length || 0}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(destination.id);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg text-xs font-bold transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(destination.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-bold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
