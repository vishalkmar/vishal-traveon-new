import { Link } from "react-router-dom";

import PackagesCarousel from "../../Components/packages/PackageCrawsel.jsx";
import PackagesListingLayout from "../../Components/packages/PackagesListingLayout.jsx";

import { useEffect, useState } from "react";
import { useDisabledPackages } from "../../hooks/useDisabledPackages";
import { getApiV1Base } from "../../utils/apiUrl.js";

export default function PackagesIndex() {
  const [apiPackages, setApiPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [priceFilter, setPriceFilter] = useState(500000); // Increased to show all packages by default
  const [durationFilter, setDurationFilter] = useState(""); // single select - e.g., "4N"
  const [flightFilter, setFlightFilter] = useState(""); // single select - e.g., "With Flight Holidays"
  const [monthFilter, setMonthFilter] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const { isPackageEnabled } = useDisabledPackages();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch packages
        const res = await fetch(`${getApiV1Base()}/packages/`);
        if (!res.ok) throw new Error("API error");
        const jsondata = await res.json();

        const packagesArray = Array.isArray(jsondata?.data)
          ? jsondata.data
          : (Array.isArray(jsondata) ? jsondata : [jsondata?.data].filter(Boolean));

        setApiPackages(packagesArray);

        // Fetch destinations
        const destRes = await fetch(`${getApiV1Base()}/destinations`);
        if (!destRes.ok) throw new Error("Destinations API error");

        const destData = await destRes.json();
        const destinationsArray = destData.data || [];

        // Filter destinations to only show those with packages
        const destinationsWithPackages = destinationsArray.filter((destination) => {
          const destinationName = (destination.name || "").toLowerCase();

          return packagesArray.some((pkg) => {
            const pkgCountries = (pkg?.countries || "").toLowerCase();
            const pkgName = (pkg?.longJsonInfo?.package?.Name || pkg?.Name || "").toLowerCase();
            const pkgDestinations = (pkg?.destinations || "").toLowerCase();

            return (
              pkgCountries.includes(destinationName) ||
              pkgName.includes(destinationName) ||
              pkgDestinations.includes(destinationName)
            );
          });
        });

        setDestinations(destinationsWithPackages);
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiPackages([]);
        setDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper: Extract month NUMBER from date string (0-11)
  const getMonthNumberFromDate = (dateStr) => {
    if (!dateStr) return -1;
    try {
      const date = new Date(dateStr);
      return date.getMonth(); // Returns 0-11
    } catch {
      return -1;
    }
  };

  // Helper: Convert month name ("Jan", "Feb", etc.) to month number (0-11)
  const getMonthNumberFromName = (monthName) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames.indexOf(monthName);
  };

  // Helper: Get travel month numbers from package dates (0-11)
  const getPackageTravelMonths = (pkg) => {
    const months = new Set();
    
    // FromDate object structure: { "20260731": { "FromDate": "2026-07-31", ... }, ... }
    const fromDateObj = pkg?.longJsonInfo?.package?.FromDate;
    if (fromDateObj && typeof fromDateObj === "object") {
      // Extract from keys (YYYYMMDD format) - month is at positions 4-5 (0-based)
      Object.keys(fromDateObj).forEach((key) => {
        if (key.length >= 6) {
          const monthStr = key.substring(4, 6); // e.g., "07" from "20260731"
          const monthNum = parseInt(monthStr) - 1; // Convert to 0-11 (07 -> 6 for July)
          if (monthNum >= 0 && monthNum <= 11) {
            months.add(monthNum);
          }
        }
        // Also try the FromDate nested field
        if (fromDateObj[key]?.FromDate) {
          const monthNum = getMonthNumberFromDate(fromDateObj[key].FromDate);
          if (monthNum >= 0) months.add(monthNum);
        }
      });
    }
    
    // Try direct date fields
    if (pkg?.travelDates && Array.isArray(pkg.travelDates)) {
      pkg.travelDates.forEach((d) => {
        const monthNum = getMonthNumberFromDate(d);
        if (monthNum >= 0) months.add(monthNum);
      });
    }
    if (pkg?.startDate) {
      const monthNum = getMonthNumberFromDate(pkg.startDate);
      if (monthNum >= 0) months.add(monthNum);
    }
    if (pkg?.fromDate) {
      const monthNum = getMonthNumberFromDate(pkg.fromDate);
      if (monthNum >= 0) months.add(monthNum);
    }
    
    return Array.from(months); // Return array of month numbers
  };

  // Helper: Get travel dates from package (for date exact match)
  const getPackageTravelDates = (pkg) => {
    const dates = [];
    
    // Try FromDate object structure
    const fromDateObj = pkg?.longJsonInfo?.package?.FromDate;
    if (fromDateObj && typeof fromDateObj === "object") {
      Object.values(fromDateObj).forEach((dateEntry) => {
        if (dateEntry?.FromDate) dates.push(dateEntry.FromDate);
      });
    }
    
    // Try direct date fields
    if (pkg?.travelDates && Array.isArray(pkg.travelDates)) {
      dates.push(...pkg.travelDates);
    }
    if (pkg?.startDate) dates.push(pkg.startDate);
    if (pkg?.fromDate) dates.push(pkg.fromDate);
    
    return dates.filter(d => d); // Remove empty values
  };

  // Main filter function (used by all carousels and search filters)
  const applyAllFilters = (pkgs, destinationName) => {
    if (!Array.isArray(pkgs) || pkgs.length === 0) return [];

    let filtered = pkgs.filter((pkg) => {
      // 0. Check if package is disabled
      if (!isPackageEnabled(pkg.gtxPkgId)) {
        return false;
      }

      // 1. Filter by destination/country
      const searchTerm = (destinationName || "").toLowerCase();
      const pkgCountry = (pkg?.countries || pkg?.country || "").toLowerCase();
      const pkgName = (pkg?.longJsonInfo?.package?.Name || pkg?.Name || "").toLowerCase();
      const pkgDestinations = (pkg?.destinations || "").toLowerCase();
      const searchText = `${pkgCountry} ${pkgName} ${pkgDestinations}`;
      
      if (!searchText.includes(searchTerm)) return false;

      // 2. Filter by package name and country search (if provided)
      if (searchName.trim()) {
        const searchLower = searchName.toLowerCase();
        const matchesName = pkgName.includes(searchLower);
        const matchesCountry = pkgCountry.includes(searchLower);
        if (!matchesName && !matchesCountry) return false;
      }

      // 3. Filter by price
      const minPrice = parseFloat(pkg?.minPrice) || 0;
      if (minPrice > priceFilter) return false;

      // 4. Filter by nights/duration (single select)
      if (durationFilter) {
        const pkgNights = pkg?.nights || 0;
        const durationNum = parseInt(durationFilter);
        if (pkgNights !== durationNum) return false;
      }

      // 5. Filter by flights (check Inclusions field - single select)
      if (flightFilter) {
        const inclusions = (pkg?.longJsonInfo?.package?.Inclusions || "").toLowerCase();
        const hasFlights = inclusions.includes("flight");
        
        if (flightFilter === "With Flight Holidays" && !hasFlights) return false;
        if (flightFilter === "Without Flight Holidays" && hasFlights) return false;
      }

      // 6. Filter by travel date or month
      if (selectedDate) {
        const travelDates = getPackageTravelDates(pkg);
        const exact = travelDates.includes(selectedDate);
        
        if (exact) return true; // Exact match found
        
        // Try month fallback using month numbers
        const selectedMonthNum = getMonthNumberFromDate(selectedDate);
        if (selectedMonthNum >= 0) {
          const monthMatch = travelDates.some((d) => getMonthNumberFromDate(d) === selectedMonthNum);
          if (!monthMatch) return false;
        }
      }

      // 7. Filter by month (from sidebar) - STRICT filter, only show if month matches
      if (monthFilter) {
        const pkgMonths = getPackageTravelMonths(pkg);
        const monthNum = getMonthNumberFromName(monthFilter);
        
        // Only show packages that have the selected month
        if (monthNum >= 0) {
          if (!pkgMonths.includes(monthNum)) return false;
        }
      }

      return true;
    });

    // Apply sorting
    if (sortBy === "price_low") {
      filtered = filtered.sort((a, b) => (parseFloat(a?.minPrice) || 0) - (parseFloat(b?.minPrice) || 0));
    } else if (sortBy === "price_high") {
      filtered = filtered.sort((a, b) => (parseFloat(b?.minPrice) || 0) - (parseFloat(a?.minPrice) || 0));
    } else if (sortBy === "duration") {
      filtered = filtered.sort((a, b) => (a?.nights || 0) - (b?.nights || 0));
    } else if (sortBy === "date") {
      filtered = filtered.sort((a, b) => {
        const aDates = getPackageTravelDates(a);
        const bDates = getPackageTravelDates(b);
        const aDate = aDates[0] || "";
        const bDate = bDates[0] || "";
        return aDate.localeCompare(bDate);
      });
    }
    // recommended (default) - no sorting

    return filtered;
  };

  const getFilteredPackages = (destinationName) => {
    return applyAllFilters(apiPackages, destinationName);
  };

  // Log filtered packages for debugging
  useEffect(() => {
    if (!isLoading && apiPackages.length > 0) {
      // Removed debug logs - removed to keep console clean
    }
  }, [isLoading, apiPackages]);


  return (
    <div className="min-h-screen pt-28">
      <PackagesListingLayout 
        pageTitle="Tour Packages" 
        totalCount={apiPackages.length}
        
        // Pass filter state
        priceValue={priceFilter}
        durationValue={durationFilter}
        flightValue={flightFilter}
        monthValue={monthFilter}
        searchValue={searchName}
        dateValue={selectedDate}
        sortValue={sortBy}
        // Pass callbacks
        onPriceChange={setPriceFilter}
        onDurationChange={setDurationFilter}
        onFlightChange={setFlightFilter}
        onMonthChange={setMonthFilter}
        onSearchChange={setSearchName}
        onDateChange={setSelectedDate}
        onSortChange={setSortBy}
        isLoading={isLoading}
      >
        {/* Show carousels only if they have items */}
        {(() => {
          if (isLoading) {
            return null; // Loading is handled by PackagesListingLayout
          }

          if (destinations.length === 0) {
            return (
              <div className="rounded-2xl bg-white p-12 ring-1 ring-black/10 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg font-semibold text-slate-900">No packages found</p>
                <p className="text-sm text-slate-600 mt-1">Try adjusting your filters or search criteria</p>
              </div>
            );
          }

          return (
            <>
              {destinations.map((destination) => {
                const items = getFilteredPackages(destination.name);
                if (items.length > 0) {
                  return (
                    <PackagesCarousel 
                      key={destination._id} 
                      title={`${destination.name} Tour Packages (${items.length})`} 
                      items={items} 
                    />
                  );
                }
                return null;
              })}
            </>
          );
        })()}
      </PackagesListingLayout>
    </div>
  );
}
