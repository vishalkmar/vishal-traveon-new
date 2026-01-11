// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Package,
  FileText,
  User as UserIcon,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Mail,
  Loader2,
  XCircle,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="px-6 py-5 border-b flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[75vh]">{children}</div>
      </div>
    </div>
  );
};

const DataTable = ({ type, apiEndpoint, extraParams = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, statusFilter, type]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search || search === "") fetchData();
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const params = {
        page,
        limit: 10,
        ...extraParams,
      };
      if (search) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await axios.get(`${API_URL}${apiEndpoint}`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("token");
        navigate("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetails = (id) => {
    if (type === "Query") return; // No details page for queries yet
    const typeSegment = apiEndpoint.includes("tour") ? "tour" : "visa";
    // Using simple redirect consistent with previous code, or could use navigate
    window.location.href = `/admin/booking/${typeSegment}/${id}`;
  };

  const deleteQuery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/v1/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
      {/* Filters Header */}
      <div className="p-8 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {type !== "Query" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            )}

            <button
              onClick={fetchData}
              className="p-3 bg-cyan-50 text-cyan-600 rounded-xl hover:bg-cyan-100 transition-colors"
            >
              <span className="text-xs font-bold">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-gray-100">
                {type === "Query" ? (
                  <>
                    <th className="px-8 py-6">Name</th>
                    <th className="px-8 py-6">Email / Phone</th>
                    <th className="px-8 py-6">Subject</th>
                    <th className="px-8 py-6">Message</th>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6 text-center">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-8 py-6">Customer Details</th>
                    <th className="px-8 py-6">Group Size</th>
                    <th className="px-8 py-6">Amount</th>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6 text-right">Status</th>
                    <th className="px-8 py-6 text-center">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/30 transition-all group"
                >
                  {type === "Query" ? (
                    <>
                      <td className="px-8 py-6 font-bold text-gray-800">
                        {item.name}
                      </td>
                      <td className="px-8 py-6 text-gray-600">
                        <div className="flex flex-col">
                          <span>{item.email}</span>
                          <span className="text-xs text-gray-400">
                            {item.phone || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-gray-700">
                        {item.subject}
                      </td>
                      <td
                        className="px-8 py-6 text-gray-500 max-w-xs truncate"
                        title={item.message}
                      >
                        {item.message}
                      </td>
                      <td className="px-8 py-6 text-xs text-gray-500 font-bold">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => deleteQuery(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-xs uppercase">
                            {(item.contactName || item.email || "?").charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 mb-0.5 group-hover:text-cyan-600 transition-colors">
                              {item.contactName || "No Name"}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              {item.contactEmail}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              {item.contactPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-300" />
                          <span className="font-bold text-gray-600">
                            {item.numberOfTravellers}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span className="font-black text-gray-800">
                          ₹{parseFloat(item.totalAmount || 0).toLocaleString()}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            item.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : item.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => navigateToDetails(item.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md hover:shadow-lg"
                        >
                          Manage <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 grayscale opacity-40">
                      <Search className="w-12 h-12" />
                      <p className="font-bold text-gray-500">No items found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-xs text-gray-400 font-bold tracking-wide uppercase">
          Page <span className="text-gray-900">{pagination.currentPage}</span>{" "}
          of <span className="text-gray-900">{pagination.totalPages || 1}</span>
        </p>
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-2xl hover:bg-white hover:shadow-lg disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-2xl hover:bg-white hover:shadow-lg disabled:opacity-20 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Components ---
export const TourPackagesTab = () => (
  <DataTable type="Tour" apiEndpoint="/v1/tour/bookings" />
);
export const Visa10DaysTab = () => (
  <DataTable
    type="Visa"
    apiEndpoint="/v1/visa/bookings"
    extraParams={{ visaType: "10_DAYS" }}
  />
);
export const Visa30DaysTab = () => (
  <DataTable
    type="Visa"
    apiEndpoint="/v1/visa/bookings"
    extraParams={{ visaType: "30_DAYS" }}
  />
);
export const ContactQueryTab = () => (
  <DataTable type="Query" apiEndpoint="/v1/contact" />
);

const StatsCard = ({ title, count, subtitle, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex items-center justify-between group hover:translate-y-[-2px] transition-all duration-300">
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">
        {title}
      </p>
      <h3 className="text-3xl font-black text-gray-900 mb-1">{count}</h3>
      <p className="text-xs font-bold text-green-500 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        {subtitle}
      </p>
    </div>
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${colorClass} group-hover:scale-110 transition-transform`}
    >
      <Icon className="w-7 h-7" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Oman-Tour-Packages");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [stats, setStats] = useState({
    tourCount: 0,
    visa10Count: 0,
    visa30Count: 0,
    queryCount: 0,
    totalInquiries: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Wait for potential login redirect or handle validly
        return;
      }
      const res = await axios.get(`${API_URL}/v1/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token invalid
        navigate("/admin");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-gray-700 pb-20">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 px-10 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic">
            TRAVEON<span className="text-cyan-500 font-normal ml-1">Admin</span>
          </h1>
        </div>

        <div className="relative group">
          <button className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-2xl bg-gray-50 hover:bg-cyan-50 transition-all border border-transparent hover:border-cyan-100 group">
            <div className="flex flex-col items-end mr-1">
              <span className="text-xs font-black text-gray-800">
                Admin User
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 shadow-inner group-hover:bg-cyan-500 group-hover:text-white transition-all">
              <UserIcon className="w-5 h-5" />
            </div>
          </button>

          <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 translate-y-2 group-hover:translate-y-0 scale-95 group-hover:scale-100 origin-top-right">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
            >
              <LogOut className="w-4 h-4" /> Sign Out Portal
            </button>
          </div>
        </div>
      </header>

      <main className="px-10 py-10 max-w-[1600px] mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Operational <span className="text-cyan-600 italic">Insights</span>
          </h2>
          <p className="text-gray-400 font-medium text-lg">
            Real-time performance metrics and traveler inquiry management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <StatsCard
            title="Oman Packages"
            count={stats.tourCount}
            subtitle="Live Syncing"
            icon={Package}
            colorClass="bg-blue-500 shadow-blue-500/30"
          />
          <StatsCard
            title="10 Days Visa"
            count={stats.visa10Count}
            subtitle="Live Syncing"
            icon={FileText}
            colorClass="bg-orange-500 shadow-orange-500/30"
          />
          <StatsCard
            title="30 Days Visa"
            count={stats.visa30Count}
            subtitle="Live Syncing"
            icon={FileCheck}
            colorClass="bg-green-500 shadow-green-500/30"
          />
          <StatsCard
            title="Queries"
            count={stats.queryCount}
            subtitle="Live Syncing"
            icon={Mail}
            colorClass="bg-purple-500 shadow-purple-500/30"
          />
          <StatsCard
            title="Total Inquiries"
            count={stats.totalInquiries}
            subtitle="Live Syncing"
            icon={LayoutDashboard}
            colorClass="bg-cyan-500 shadow-cyan-500/30"
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start">
          {[
            { id: "Oman-Tour-Packages", label: "Tour Packages", icon: Package },
            { id: "Oman-visa-10-days", label: "10-Day Visas", icon: FileCheck },
            { id: "Oman-visa-30-days", label: "30-Day Visas", icon: FileCheck },
            { id: "Queries", label: "General Queries", icon: Mail },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-white shadow-2xl shadow-cyan-500/40 translate-y-[-2px]"
                  : "bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-100/50"
              }`}
            >
              <tab.icon
                className={`w-4 h-4 ${
                  activeTab === tab.id ? "text-white" : "text-gray-300"
                }`}
              />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "Oman-Tour-Packages" && <TourPackagesTab />}
          {activeTab === "Oman-visa-10-days" && <Visa10DaysTab />}
          {activeTab === "Oman-visa-30-days" && <Visa30DaysTab />}
          {activeTab === "Queries" && <ContactQueryTab />}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center">
            <h3 className="text-xl font-bold mb-4">Sign Out?</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 border rounded-xl font-bold text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
