import React, { useMemo, useState } from "react";

/**
 * PackagesListingLayout.jsx
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
  children,
  isLoading = false,
  onPriceChange,
  onDurationChange,
  onFlightChange,
  onMonthChange,
  onSearchChange,
  onDateChange,
  onSortChange,
  priceValue = 500000,
  durationValue = {},
  flightValue = {},
  monthValue = "",
  searchValue = "",
  dateValue = "",
  sortValue = "recommended",
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handlePriceChange = (val) => {
    if (onPriceChange) onPriceChange(val);
  };

  const handleDurationChange = (dur) => {
    if (onDurationChange) {
      onDurationChange(durationValue === dur ? "" : dur);
    }
  };

  const handleFlightChange = (flight) => {
    if (onFlightChange) {
      onFlightChange(flightValue === flight ? "" : flight);
    }
  };

  const handleMonthChange = (val) => {
    if (onMonthChange) onMonthChange(val);
  };

  const handleSearchChange = (val) => {
    if (onSearchChange) onSearchChange(val);
  };

  const handleDateChange = (val) => {
    if (onDateChange) onDateChange(val);
  };

  const handleSortChange = (val) => {
    if (onSortChange) onSortChange(val);
  };

  const handleClearAll = () => {
    if (onPriceChange) onPriceChange(500000);
    if (onDurationChange) onDurationChange("");
    if (onFlightChange) onFlightChange("");
    if (onMonthChange) onMonthChange("");
    if (onSearchChange) onSearchChange("");
    if (onDateChange) onDateChange("");
    if (onSortChange) onSortChange("recommended");
  };

  const handleSearchPackage = (e) => {
    const value = e.target.value;
    handleSearchChange(value);
    console.log("Search package by name:", value);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (durationValue) count += 1;
    if (flightValue) count += 1;
    if (monthValue) count += 1;
    return count;
  }, [durationValue, flightValue, monthValue]);

  const clearAll = () => {
    handleClearAll();
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
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Price Per Person</p>
              <p className="text-sm text-slate-600">₹{priceValue.toLocaleString("en-IN")}</p>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              value={priceValue}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="mt-3 w-full accent-teal-500"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>₹0</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          <Divider />

          <div>
            <label className="text-sm font-semibold text-slate-800 mb-2 block">Duration</label>
            <select
              value={durationValue}
              onChange={(e) => {
                handleDurationChange(e.target.value);
              }}
              className="w-full h-10 rounded-xl bg-white px-3 text-sm ring-1 ring-black/10 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
            >
              <option value="">All Durations</option>
              <option value="2N">2 Nights</option>
              <option value="3N">3 Nights</option>
              <option value="4N">4 Nights</option>
              <option value="5N">5 Nights</option>
              <option value="6N">6 Nights</option>
              <option value="7N">7 Nights</option>
              <option value="8N">8 Nights</option>
              <option value="9N">9 Nights</option>
              <option value="10N">10 Nights</option>
              <option value="15N">15 Nights</option>
              <option value="20N">20 Nights</option>
              <option value="30N">30 Nights</option>
            </select>
          </div>

          <Divider />

          <FilterGroup title="Package Type">
            {["Without Flight Holidays", "With Flight Holidays"].map((k) => (
              <ChipToggle
                key={k}
                label={k}
                active={flightValue === k}
                onToggle={() => handleFlightChange(k)}
              />
            ))}
          </FilterGroup>
        </div>
      </div>
    </aside>
  );

  return (
   <div className="bg-slate-50">


      {/* Mobile filter button */}
      <div className="md:hidden px-[20px] sm:px-[35px] py-4 mt-[-33px]">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg transition-shadow w-fit"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-semibold">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-white text-teal-600 text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Page content */}
      <div className="px-[20px] sm:px-[35px] lg:px-[50px] py-6 lg:py-8 md:mt-[-30px]">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 whitespace-nowrap">
            {pageTitle} <span className="text-slate-500 font-semibold">({totalCount})</span>
          </h1>
          
          {/* Search Box - Inline with title */}
          <div className="w-full sm:w-[300px] md:w-[400px] lg:w-[700px]  flex-shrink-0 mx-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl border border-teal-300 bg-white/70 backdrop-blur-md shadow-[0_8px_24px_rgba(15,139,141,0.10)]" />

              <input
                type="text"
                placeholder="Search packages..."
                value={searchValue}
                onChange={handleSearchPackage}
                className="relative w-full h-12 rounded-2xl bg-transparent pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none"
              />

              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div className="h-1 w-40 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hidden" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="hidden md:block md:col-span-4 lg:col-span-3">
            <div className="sticky top-6">{Sidebar}</div>
          </div>

          <main className="md:col-span-8 lg:col-span-9 space-y-8">
            <SectionHeader
              title="Best Selling International Tour Packages at EPIC Discounts"
              subtitle="Best Selling Packages Curated Just for You"
              sortValue={sortValue}
              onSortChange={handleSortChange}
            />

            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg animate-pulse w-64"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="rounded-3xl h-[460px] bg-slate-200 animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
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

function SectionHeader({ title, subtitle, sortValue, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="w-full sm:w-[260px]">
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Sort By
        </label>
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full h-10 rounded-xl px-3 text-sm bg-white ring-1 ring-black/10 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
        >
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="duration">Duration</option>
        </select>
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