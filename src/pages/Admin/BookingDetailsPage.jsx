// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Globe,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api";

const BookingDetailsPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // details, travellers

  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    status: "",
    updatedBy: "admin", // hardcoded for now
  });

  useEffect(() => {
    fetchBooking();
  }, [type, id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const endpoint =
        type === "tour"
          ? `${API_URL}/v1/tour/booking/${id}`
          : `${API_URL}/v1/visa/booking/${id}`;

      const res = await axios.get(endpoint);
      if (res.data.success) {
        setBooking(res.data.data);
        setFormData({
          contactName: res.data.data.contactName,
          contactEmail: res.data.data.contactEmail,
          contactPhone: res.data.data.contactPhone,
          status: res.data.data.status,
          updatedBy: "admin",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch booking details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updateType) => {
    try {
      setSaving(true);
      const endpoint =
        type === "tour"
          ? `${API_URL}/v1/tour/booking/${id}`
          : `${API_URL}/v1/visa/booking/${id}`;

      // If status update
      if (updateType === "status") {
        await axios.put(`${endpoint}/status`, {
          status: formData.status,
          updatedBy: "Admin User",
        });
      } else {
        // Details update
        await axios.put(endpoint, {
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          updatedBy: "Admin User",
        });
      }

      toast.success("Booking updated successfully");
      fetchBooking(); // Refresh
    } catch (error) {
      toast.error("Failed to update booking");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this booking? This action moves it to trash."
      )
    )
      return;

    try {
      setDeleting(true);
      const endpoint =
        type === "tour"
          ? `${API_URL}/v1/tour/booking/${id}`
          : `${API_URL}/v1/visa/booking/${id}`;

      await axios.delete(endpoint);
      toast.success("Booking deleted");
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error("Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Booking not found</h2>
        <a href="/admin-dashboard" className="text-cyan-600 hover:underline">
          Go back to Dashboard
        </a>
      </div>
    );
  }

  const statusColors = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-orange-100 text-orange-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <a
            href="/admin-dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Booking #{booking.id.slice(0, 8)}
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  statusColors[booking.status]
                }`}
              >
                {booking.status}
              </span>
            </h1>
            <p className="text-xs text-gray-500">
              Created: {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Editable Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-600" />
                Contact Details
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium"
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData({ ...formData, contactName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={() => handleUpdate("details")}
                disabled={saving}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <check-circle className="w-5 h-5 text-cyan-600" />
                Approval Status
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {["PENDING", "APPROVED", "REJECTED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, status: s })}
                      className={`py-2 px-1 rounded-lg text-[10px] font-black uppercase text-center border transition-all ${
                        formData.status === s
                          ? "bg-cyan-50 border-cyan-500 text-cyan-700"
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleUpdate("status")}
                  disabled={saving || formData.status === booking.status}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 text-white rounded-xl text-sm font-bold hover:bg-cyan-700 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Update Status"
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-800 mb-4">
                Audit Log
              </h2>
              <div className="text-xs text-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium text-gray-700">
                    {new Date(booking.updatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Updated By:</span>
                  <span className="font-medium text-gray-700">
                    {booking.updatedBy || "System"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Travellers and Docs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-600" />
                  Travellers & Documents
                  <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full text-xs">
                    {booking.travellers?.length || 0}
                  </span>
                </h2>
                {type === "tour" && (
                  <span className="text-sm font-bold text-gray-500">
                    Total: ₹{booking.totalAmount}
                  </span>
                )}
              </div>

              <div className="divide-y divide-gray-100">
                {booking.travellers?.map((traveller, index) => (
                  <div
                    key={traveller.id}
                    className="p-6 hover:bg-gray-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {traveller.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            ID: {traveller.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Passport */}
                      <DocCard
                        label="Passport Scan"
                        url={traveller.passportScanUrl}
                      />
                      {/* Photo */}
                      <DocCard
                        label="Photo"
                        url={traveller.photoUrl}
                        type="image"
                      />

                      {/* Tour Specifics */}
                      {type === "tour" && (
                        <>
                          <DocCard
                            label="PAN Card"
                            url={traveller.panCardUrl}
                          />
                          <DocCard
                            label="Aadhar Card"
                            url={traveller.aadharCardUrl}
                          />
                          {traveller.flightBookingUrl && (
                            <DocCard
                              label="Flight Booking"
                              url={traveller.flightBookingUrl}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper for Document Links
const DocCard = ({ label, url, type = "file" }) => {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-cyan-200 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg text-cyan-600 group-hover:text-cyan-700">
          {type === "image" ? (
            <FileText className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
        </div>
        <span className="text-xs font-bold text-gray-700">{label}</span>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-cyan-500" />
    </a>
  );
};

export default BookingDetailsPage;
