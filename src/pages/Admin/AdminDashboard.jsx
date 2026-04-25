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
  ChevronDown,
  FileCheck,
  Mail,
  Loader2,
  XCircle,
  LayoutDashboard,
  Globe,
  BookOpen,
  Settings,
  MessageCircle,
  Image,
  Home as HomeIcon,
  Briefcase,
  Cog,
  Menu,
  X,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PackageConfiguration from "../../Components/admin/PackageConfiguration";
import WhatsappFlowAdmin from "../../Components/admin/WhatsappFlowAdmin";
import ImageBannerAdmin from "../../Components/admin/ImageBannerAdmin";
import BlogsAdmin from "../../Components/admin/BlogsAdmin";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api";

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
  const abortControllerRef = React.useRef(null);
  const loadingRef = React.useRef(false);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [page, statusFilter, type]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      fetchData();
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin");
        return;
      }

      const params = { page, limit: 10, ...extraParams };
      if (search.trim()) params.search = search;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await axios.get(`${API_URL}${apiEndpoint}`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        signal: abortControllerRef.current.signal,
      });

      if (res.data.success) {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error("Failed to fetch data", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("token");
        navigate("/admin");
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const navigateToDetails = (id) => {
    if (type === "Query") return;
    const typeSegment = apiEndpoint.includes("tour") ? "tour" : "visa";
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
    <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      {/* Filters Header */}
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-5 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {type !== "Query" && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
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
              className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors text-xs font-bold"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

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
                    <th className="px-6 py-5">Name</th>
                    <th className="px-6 py-5">Email / Phone</th>
                    <th className="px-6 py-5">Subject</th>
                    <th className="px-6 py-5">Message</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5 text-center">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-5">Customer Details</th>
                    <th className="px-6 py-5">Group Size</th>
                    <th className="px-6 py-5">Amount</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5 text-right">Status</th>
                    <th className="px-6 py-5 text-center">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/30 transition-all group">
                  {type === "Query" ? (
                    <>
                      <td className="px-6 py-5 font-bold text-gray-800">{item.name}</td>
                      <td className="px-6 py-5 text-gray-600">
                        <div className="flex flex-col">
                          <span>{item.email}</span>
                          <span className="text-xs text-gray-400">{item.phone || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-gray-700">{item.subject}</td>
                      <td className="px-6 py-5 text-gray-500 max-w-xs truncate" title={item.message}>
                        {item.message}
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-500 font-bold">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-center">
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
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-xs uppercase">
                            {(item.contactName || item.email || "?").charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 mb-0.5 group-hover:text-cyan-600 transition-colors">
                              {item.contactName || "No Name"}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{item.contactEmail}</span>
                            <span className="text-xs text-gray-400 font-medium">{item.contactPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-300" />
                          <span className="font-bold text-gray-600">{item.numberOfTravellers}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-gray-800">
                          ₹{parseFloat(item.totalAmount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
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
                      <td className="px-6 py-5 text-center">
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

      <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400 font-bold tracking-wide uppercase">
          Page <span className="text-gray-900">{pagination.currentPage}</span> of{" "}
          <span className="text-gray-900">{pagination.totalPages || 1}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg disabled:opacity-20 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TourPackagesTab = () => <DataTable type="Tour" apiEndpoint="/v1/tour/bookings" />;
export const Visa10DaysTab = () => (
  <DataTable type="Visa" apiEndpoint="/v1/visa/bookings" extraParams={{ visaType: "10_DAYS" }} />
);
export const Visa30DaysTab = () => (
  <DataTable type="Visa" apiEndpoint="/v1/visa/bookings" extraParams={{ visaType: "30_DAYS" }} />
);
export const ContactQueryTab = () => <DataTable type="Query" apiEndpoint="/v1/contact" />;

// ─── Stats Card (clickable) ──────────────────────────────────────────────────
const StatsCard = ({ title, count, icon: Icon, colorClass, progress = 60, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-left bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 w-full group"
  >
    <div className="flex items-start justify-between mb-4">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <h3 className="text-3xl font-black text-gray-900 mb-3">{count}</h3>
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${colorClass.replace("bg-", "bg-").split(" ")[0]}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  </button>
);

// ─── Sidebar Nav Item ────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, active, onClick, indent = false, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      indent ? "pl-11" : ""
    } ${
      active
        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {Icon && <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-gray-400"}`} />}
    <span className="flex-1 text-left truncate">{label}</span>
    {badge != null && (
      <span
        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-cyan-100 text-cyan-700"
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);

// ─── Sidebar Group (collapsible) ─────────────────────────────────────────────
const NavGroup = ({ icon: Icon, label, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
      >
        {Icon && <Icon className="w-5 h-5 shrink-0 text-gray-400" />}
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [stats, setStats] = useState({
    tourCount: 0,
    visa10Count: 0,
    visa30Count: 0,
    queryCount: 0,
    totalInquiries: 0,
    packageConfigCount: 0,
    blogCount: 0,
    destinationCount: 0,
    bannerCount: 0,
    whatsappFlowCount: 0,
  });
  const navigate = useNavigate();
  const dropdownRef = React.useRef(null);
  const statsAbortRef = React.useRef(null);
  const statsLoadingRef = React.useRef(false);

  useEffect(() => {
    fetchStats();
    return () => {
      if (statsAbortRef.current) statsAbortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchStats = async () => {
    if (statsLoadingRef.current) return;
    if (statsAbortRef.current) statsAbortRef.current.abort();
    statsAbortRef.current = new AbortController();
    statsLoadingRef.current = true;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin");
        return;
      }
      const res = await axios.get(`${API_URL}/v1/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: statsAbortRef.current.signal,
      });
      if (res.data.success) setStats(res.data.data);
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("token");
        navigate("/admin");
      }
    } finally {
      statsLoadingRef.current = false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin");
  };

  const goTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const tabTitle =
    {
      Home: "Operational Insights",
      "Oman-Tour-Packages": "Tour Packages",
      "Oman-visa-10-days": "10-Day Visas",
      "Oman-visa-30-days": "30-Day Visas",
      Queries: "General Queries",
      "Package-Configuration": "Package Configuration",
      "WhatsApp-Flow": "WhatsApp Flow",
      "Image-Banner": "Image Banner",
      Blogs: "Blogs",
    }[activeTab] || "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-gray-700">
      {/* ── Sidebar (desktop fixed, mobile drawer) ──────────────────────────── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight italic">
              TRAVEON<span className="text-cyan-500 font-normal ml-1">Admin</span>
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <NavItem
            icon={HomeIcon}
            label="Home"
            active={activeTab === "Home"}
            onClick={() => goTab("Home")}
          />

          <div className="pt-2">
            <NavGroup icon={Briefcase} label="Tour Queries" defaultOpen>
              <NavItem
                icon={Package}
                label="Tour Packages"
                indent
                active={activeTab === "Oman-Tour-Packages"}
                onClick={() => goTab("Oman-Tour-Packages")}
              />
              <NavItem
                icon={FileCheck}
                label="10-Day Visas"
                indent
                active={activeTab === "Oman-visa-10-days"}
                onClick={() => goTab("Oman-visa-10-days")}
              />
              <NavItem
                icon={FileText}
                label="30-Day Visas"
                indent
                active={activeTab === "Oman-visa-30-days"}
                onClick={() => goTab("Oman-visa-30-days")}
              />
            </NavGroup>
          </div>

          <div className="pt-2">
            <NavGroup icon={Cog} label="Website Configuration" defaultOpen>
              <NavItem
                icon={Settings}
                label="Package Configuration"
                indent
                active={activeTab === "Package-Configuration"}
                onClick={() => goTab("Package-Configuration")}
              />
              <NavItem
                icon={BookOpen}
                label="Blogs"
                indent
                active={activeTab === "Blogs"}
                onClick={() => goTab("Blogs")}
              />
              <NavItem
                icon={MessageCircle}
                label="WhatsApp Flow"
                indent
                active={activeTab === "WhatsApp-Flow"}
                onClick={() => goTab("WhatsApp-Flow")}
              />
              <NavItem
                icon={Image}
                label="Image Banner"
                indent
                active={activeTab === "Image-Banner"}
                onClick={() => goTab("Image-Banner")}
              />
            </NavGroup>
          </div>

          <div className="pt-2">
            <NavItem
              icon={Mail}
              label="General Queries"
              active={activeTab === "Queries"}
              onClick={() => goTab("Queries")}
              badge={stats.queryCount || undefined}
            />
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search packages, queries, visas..."
                className="w-80 lg:w-96 pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown((p) => !p)}
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl bg-white hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/30">
                  AD
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-col items-start hidden sm:flex">
                <span className="text-xs font-black text-gray-800 leading-tight">
                  Admin User
                </span>
                <span className="text-[10px] text-gray-400 font-semibold leading-tight">
                  Administrator
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>
            <div
              className={`absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-2 transition-all ${
                showUserDropdown ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <div className="px-3 py-3 border-b border-gray-100 mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/30">
                    AD
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate">
                      Admin User
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      admin@traveon.in
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setShowUserDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-6 lg:px-10 py-8 max-w-[1600px]">
          {/* Page title */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-1">
              {activeTab === "Home" ? (
                <>
                  Operational <span className="text-cyan-600 italic">Insights</span>
                </>
              ) : (
                tabTitle
              )}
            </h2>
            <p className="text-gray-400 font-medium text-sm">
              {activeTab === "Home"
                ? "Real-time performance metrics and traveler inquiry management"
                : `Manage your ${tabTitle.toLowerCase()}`}
            </p>
          </div>

          {/* HOME TAB — Stats dashboard */}
          {activeTab === "Home" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                <StatsCard
                  title="Total Inquiries"
                  count={stats.totalInquiries}
                  icon={LayoutDashboard}
                  colorClass="bg-cyan-500 text-white shadow-cyan-500/30"
                  progress={Math.min((stats.totalInquiries / 50) * 100, 100)}
                  onClick={() => goTab("Queries")}
                />
                <StatsCard
                  title="Tour Bookings"
                  count={stats.tourCount}
                  icon={Package}
                  colorClass="bg-blue-500 text-white shadow-blue-500/30"
                  progress={Math.min((stats.tourCount / 30) * 100, 100)}
                  onClick={() => goTab("Oman-Tour-Packages")}
                />
                <StatsCard
                  title="10 Days Visa"
                  count={stats.visa10Count}
                  icon={FileText}
                  colorClass="bg-orange-500 text-white shadow-orange-500/30"
                  progress={Math.min((stats.visa10Count / 20) * 100, 100)}
                  onClick={() => goTab("Oman-visa-10-days")}
                />
                <StatsCard
                  title="30 Days Visa"
                  count={stats.visa30Count}
                  icon={FileCheck}
                  colorClass="bg-green-500 text-white shadow-green-500/30"
                  progress={Math.min((stats.visa30Count / 20) * 100, 100)}
                  onClick={() => goTab("Oman-visa-30-days")}
                />
                <StatsCard
                  title="General Queries"
                  count={stats.queryCount}
                  icon={Mail}
                  colorClass="bg-purple-500 text-white shadow-purple-500/30"
                  progress={Math.min((stats.queryCount / 30) * 100, 100)}
                  onClick={() => goTab("Queries")}
                />
                <StatsCard
                  title="Configured Packages"
                  count={stats.packageConfigCount}
                  icon={Settings}
                  colorClass="bg-pink-500 text-white shadow-pink-500/30"
                  progress={Math.min((stats.packageConfigCount / 20) * 100, 100)}
                  onClick={() => goTab("Package-Configuration")}
                />
                <StatsCard
                  title="Blog Destinations"
                  count={stats.destinationCount || stats.blogCount}
                  icon={BookOpen}
                  colorClass="bg-indigo-500 text-white shadow-indigo-500/30"
                  progress={Math.min(((stats.destinationCount || stats.blogCount) / 10) * 100, 100)}
                  onClick={() => goTab("Blogs")}
                />
                <StatsCard
                  title="Image Banners"
                  count={stats.bannerCount}
                  icon={Image}
                  colorClass="bg-amber-500 text-white shadow-amber-500/30"
                  progress={Math.min((stats.bannerCount / 5) * 100, 100)}
                  onClick={() => goTab("Image-Banner")}
                />
              </div>

              {/* Quick action panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900">Tour Queries</h3>
                      <p className="text-xs text-gray-400 font-medium">
                        Bookings & visa applications
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => goTab("Oman-Tour-Packages")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-cyan-50 hover:text-cyan-700 text-sm font-semibold text-gray-700 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4" /> Tour Packages
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => goTab("Oman-visa-10-days")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-cyan-50 hover:text-cyan-700 text-sm font-semibold text-gray-700 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4" /> 10-Day Visas
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => goTab("Oman-visa-30-days")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-cyan-50 hover:text-cyan-700 text-sm font-semibold text-gray-700 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> 30-Day Visas
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Cog className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900">Website Configuration</h3>
                      <p className="text-xs text-gray-400 font-medium">
                        Content & promotional setup
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => goTab("Package-Configuration")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-semibold text-gray-700 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Package Configuration
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => goTab("Blogs")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-semibold text-gray-700 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Blogs
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => goTab("WhatsApp-Flow")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-semibold text-gray-700 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> WhatsApp Flow
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => goTab("Image-Banner")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-semibold text-gray-700 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Image className="w-4 h-4" /> Image Banner
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* OTHER TABS */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "Oman-Tour-Packages" && <TourPackagesTab />}
            {activeTab === "Oman-visa-10-days" && <Visa10DaysTab />}
            {activeTab === "Oman-visa-30-days" && <Visa30DaysTab />}
            {activeTab === "Queries" && <ContactQueryTab />}
            {activeTab === "Package-Configuration" && <PackageConfiguration />}
            {activeTab === "WhatsApp-Flow" && <WhatsappFlowAdmin />}
            {activeTab === "Image-Banner" && <ImageBannerAdmin />}
            {activeTab === "Blogs" && <BlogsAdmin />}
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
