import React, { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  Trash2,
  Edit2,
  BookOpen,
  FileText,
  MapPin,
} from "lucide-react";
import AddDestinationModal from "./AddDestinationModal";
import AddBlogModal from "./AddBlogModal";
import { getApiV1Base } from "../../utils/apiUrl.js";
import toast from "react-hot-toast";

export default function BlogsAdmin() {
  const [destinations, setDestinations] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingDest, setLoadingDest] = useState(false);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [isEditBlogModalOpen, setIsEditBlogModalOpen] = useState(false);
  const [isEditDestModalOpen, setIsEditDestModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDestinations = async () => {
    setLoadingDest(true);
    try {
      const res = await fetch(`${getApiV1Base()}/destinations`);
      const data = await res.json();
      if (data.success) setDestinations(data.data || []);
    } catch (error) {
      console.error("fetchDestinations:", error);
      toast.error("Failed to fetch destinations");
    } finally {
      setLoadingDest(false);
    }
  };

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const res = await fetch(`${getApiV1Base()}/blog`);
      const data = await res.json();
      if (data.success) setBlogs(data.data || []);
    } catch (error) {
      console.error("fetchBlogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchBlogs();
  }, []);

  const handleDeleteDestination = async (id) => {
    if (!window.confirm("Delete this destination? This cannot be undone.")) return;
    setDeleteLoading(`d-${id}`);
    try {
      const res = await fetch(`${getApiV1Base()}/destinations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Destination deleted");
        fetchDestinations();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog? This cannot be undone.")) return;
    setDeleteLoading(`b-${id}`);
    try {
      const res = await fetch(`${getApiV1Base()}/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Blog deleted");
        fetchBlogs();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
          <div className="flex items-center justify-center w-14 h-14 bg-cyan-50 rounded-2xl mb-4">
            <FileText className="w-7 h-7 text-cyan-600" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Add New Blog</h3>
          <p className="text-sm text-gray-500 mb-5">
            Create a blog post with images, content, and link it to a destination.
          </p>
          <button
            onClick={() => setIsBlogModalOpen(true)}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30"
          >
            Start Creating Blog
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
          <div className="flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl mb-4">
            <MapPin className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Add New Destination</h3>
          <p className="text-sm text-gray-500 mb-5">
            Create a travel destination that blogs can be associated with.
          </p>
          <button
            onClick={() => setIsDestModalOpen(true)}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30"
          >
            Add Destination
          </button>
        </div>
      </div>

      {/* Destinations table */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Manage Destinations</h3>
            <p className="text-xs text-gray-400 font-medium">{destinations.length} total</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loadingDest ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-semibold">
              No destinations yet. Add one above!
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/30 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-gray-100">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Blogs</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {destinations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/30 transition-all">
                    <td className="px-6 py-4">
                      {d.image && (
                        <img
                          src={d.image}
                          alt={d.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-100"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{d.name}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {d.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-lg">
                        {d.blogs?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(d);
                            setIsEditDestModalOpen(true);
                          }}
                          className="p-2 text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDestination(d.id)}
                          disabled={deleteLoading === `d-${d.id}`}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                          title="Delete"
                        >
                          {deleteLoading === `d-${d.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Blogs table */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Manage Blogs</h3>
            <p className="text-xs text-gray-400 font-medium">{blogs.length} total</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loadingBlogs ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-semibold">
              No blogs yet. Add one above!
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/30 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-gray-100">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Excerpt</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/30 transition-all">
                    <td className="px-6 py-4">
                      {b.image && (
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-100"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{b.title}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {b.destination?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {b.excerpt}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(b);
                            setIsEditBlogModalOpen(true);
                          }}
                          className="p-2 text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          disabled={deleteLoading === `b-${b.id}`}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                          title="Delete"
                        >
                          {deleteLoading === `b-${b.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {isBlogModalOpen && (
        <AddBlogModal
          onClose={() => setIsBlogModalOpen(false)}
          onSuccess={() => {
            setIsBlogModalOpen(false);
            fetchBlogs();
          }}
        />
      )}
      {isEditBlogModalOpen && editingItem && (
        <AddBlogModal
          onClose={() => {
            setIsEditBlogModalOpen(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setIsEditBlogModalOpen(false);
            setEditingItem(null);
            fetchBlogs();
          }}
          initialData={editingItem}
          isEdit={true}
        />
      )}
      {isDestModalOpen && (
        <AddDestinationModal
          onClose={() => setIsDestModalOpen(false)}
          onSuccess={() => {
            setIsDestModalOpen(false);
            fetchDestinations();
          }}
        />
      )}
      {isEditDestModalOpen && editingItem && (
        <AddDestinationModal
          onClose={() => {
            setIsEditDestModalOpen(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setIsEditDestModalOpen(false);
            setEditingItem(null);
            fetchDestinations();
          }}
          initialData={editingItem}
          isEdit={true}
        />
      )}
    </div>
  );
}
