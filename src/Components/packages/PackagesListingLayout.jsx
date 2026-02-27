import React, { useMemo, useState } from "react";

/**
 * PackagesListingLayout.jsx
 * - Sidebar filters (desktop) + drawer (mobile)
 * - Header bar: breadcrumb + title + sort
 * - Main content area: put your <PackagesCarousel /> here
 */

const THEME = {
  accent: "from-emerald-500 to-teal-500",
  accentSolid: "bg-teal-500 hover:bg-teal-600",
  accentText: "text-teal-600",
  ring: "ring-teal-500/30",
};

export default function PackagesListingLayout({
  pageTitle = "Europe Tour Packages",
  totalCount = 284,
  children, // main content (carousels / cards)
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // sample filter state
  const [price, setPrice] = useState(36000);
  const [duration, setDuration] = useState({ "2N": false, "3N": false, "4N": false });
  const [packageType, setPackageType] = useState({
    "Without Flight Holidays": false,
    "With Flight Holidays": false,
    "Group Holidays": false,
  });
  const [months, setMonths] = useState("");  // single select instead of object

  const [sortBy, setSortBy] = useState("recommended");

  // Search/filter header states
  const [searchName, setSearchName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // single select now

  // Dummy handlers for searching/filtering
  const handleSearchPackage = (e) => {
    const value = e.target.value;
    setSearchName(value);
    console.log("Search package by name:", value);
  };

  const handleDateFilter = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    console.log("Filter by date:", value);
  };

  const handleMonthFilterHeader = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    console.log("Filter by month (header):", value);
  };

  const activeFiltersCount = useMemo(() => {
    const boolCount = (obj) => Object.values(obj).filter(Boolean).length;
    const count =
      boolCount(duration) + boolCount(packageType) + (months ? 1 : 0);
    return count;
  }, [duration, packageType, months]);

  const clearAll = () => {
    setPrice(36000);
    setDuration({ "2N": false, "3N": false, "4N": false });
    setPackageType({
      "Without Flight Holidays": false,
      "With Flight Holidays": false,
      "Group Holidays": false,
    });
    setMonths("");  // reset to empty string
  };

  const Sidebar = (
    <aside className="w-full">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/10">
        <div className="p-5 border-b border-black/5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Refine Search</h3>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Price */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Price Per Person</p>
              <p className="text-sm text-slate-600">₹{price.toLocaleString("en-IN")}</p>
            </div>
            <input
              type="range"
              min={36000}
              max={88400}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-3 w-full accent-teal-500"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>₹36,000</span>
              <span>₹88,400</span>
            </div>
          </div>

          <Divider />

          {/* Duration */}
          <FilterGroup title="Duration">
            {["2N", "3N", "4N"].map((k) => (
              <CheckboxRow
                key={k}
                label={`${k}`}
                checked={duration[k]}
                onChange={(v) => setDuration((s) => ({ ...s, [k]: v }))}
              />
            ))}
            <button type="button" className={`mt-2 text-sm ${THEME.accentText} hover:underline`}>
              View more
            </button>
          </FilterGroup>

          <Divider />

          {/* Package Type */}
          <FilterGroup title="Package Type">
            {Object.keys(packageType).map((k) => (
              <CheckboxRow
                key={k}
                label={k}
                checked={packageType[k]}
                onChange={(v) => setPackageType((s) => ({ ...s, [k]: v }))}
              />
            ))}
          </FilterGroup>

          <Divider />

          {/* Month of Travel */}
          <FilterGroup title="Month of Travel">
            <select
              value={months}
              onChange={(e) => {
                setMonths(e.target.value);
                console.log("Month filter (sidebar) selected:", e.target.value);
              }}
              className="w-full h-10 rounded-xl bg-white px-3 text-sm ring-1 ring-black/10 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
            >
              <option value="">Select Month</option>
              <option value="Feb">February</option>
              <option value="Mar">March</option>
              <option value="Apr">April</option>
              <option value="May">May</option>
              <option value="Jun">June</option>
              <option value="Jul">July</option>
              <option value="Aug">August</option>
              <option value="Sep">September</option>
              <option value="Oct">October</option>
              <option value="Nov">November</option>
              <option value="Dec">December</option>
            </select>
          </FilterGroup>

          <div className="pt-2">
            <button
              type="button"
              className={`w-full ${THEME.accentSolid} text-white font-semibold py-3 rounded-xl shadow-sm`}
              onClick={() => setMobileFiltersOpen(false)}
            >
              Apply Filters
            </button>
            <p className="mt-2 text-xs text-slate-500">
              Active filters: <span className="font-semibold">{activeFiltersCount}</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top header with search filter */}
      <div className="bg-white shadow-sm border-b border-black/5">
        <div className="px-[20px] sm:px-[35px] lg:px-[50px] py-4">
          {/* Breadcrumb row (desktop) */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span className="hover:text-slate-700 cursor-pointer">Home</span>
            <span>/</span>
            <span className="hover:text-slate-700 cursor-pointer">International Tour Packages</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">{pageTitle}</span>
          </div>

          {/* Search Filter Bar - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search by Package Name */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Package Name
              </label>
              <input
                type="text"
                placeholder="Search packages..."
                value={searchName}
                onChange={handleSearchPackage}
                className="w-full h-10 rounded-xl px-3 text-sm bg-white ring-1 ring-black/10 focus:outline-none focus:ring-4 focus:ring-teal-500/30 placeholder-slate-400"
              />
            </div>

            {/* Filter by Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Travel Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateFilter}
                className="w-full h-10 rounded-xl px-3 text-sm bg-white ring-1 ring-black/10 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
              />
            </div>

            {/* Filter by Month */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={handleMonthFilterHeader}
                className="w-full h-10 rounded-xl px-3 text-sm bg-white ring-1 ring-black/10 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
              >
                <option value="">All Months</option>
                <option value="Feb">February</option>
                <option value="Mar">March</option>
                <option value="Apr">April</option>
                <option value="May">May</option>
                <option value="Jun">June</option>
                <option value="Jul">July</option>
                <option value="Aug">August</option>
                <option value="Sep">September</option>
                <option value="Oct">October</option>
                <option value="Nov">November</option>
                <option value="Dec">December</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  console.log("Sort by:", e.target.value);
                }}
                className="w-full h-10 rounded-xl px-3 text-sm bg-white ring-1 ring-black/10 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
                <option value="date">Travel Date</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Filter button for sidebar (show on screens below 768px) */}
      <div className="md:hidden bg-white border-b border-black/5 px-[20px] py-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-white ring-1 ring-black/15 hover:ring-black/25 transition-all"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-800" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          <span className="text-sm font-semibold text-slate-900">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 text-xs font-bold rounded-full px-2 py-0.5 bg-teal-500 text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Page content */}
      <div className="px-[20px] sm:px-[35px] lg:px-[50px] py-6 lg:py-8">
        {/* Title row */}
        <div className="mb-5 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {pageTitle} <span className="text-slate-500 font-semibold">({totalCount})</span>
          </h1>

          {/* small themed underline */}
          <div className="h-1 w-40 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar (md and up - 768px and above) */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3">
            <div className="sticky top-6">{Sidebar}</div>
          </div>

          {/* Main */}
          <main className="md:col-span-8 lg:col-span-9 space-y-8">
            {/* Example section heading */}
            <SectionHeader
              title="Best Selling International Tour Packages at EPIC Discounts"
              count={13}
              subtitle="Best Selling Packages Curated Just for You"
            />

            {/* Put your carousel/cards here */}
            {children}

            <SectionHeader
              title="Customized Tour Packages"
              count={196}
              subtitle="Top Packages Customized to your needs"
            />

          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* panel */}
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-slate-50 shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Filters</p>
                  <p className="text-xs text-slate-500">{activeFiltersCount} active</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="h-10 w-10 rounded-xl bg-white ring-1 ring-black/10 grid place-items-center"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {Sidebar}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- small ui parts ---------------- */

function SectionHeader({ title, count, subtitle }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          {title} <span className="text-slate-500 font-semibold">({count})</span>
        </h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-black/10" />;
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-800 mb-2">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        className="h-4 w-4 accent-teal-500"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function ChipToggle({ label, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "w-full text-left px-3 py-2 rounded-xl text-sm ring-1 transition",
        active
          ? "bg-teal-500 text-white ring-teal-500/40"
          : "bg-white text-slate-700 ring-black/10 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}


