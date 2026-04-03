import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import PackagesCarousel from "../../Components/packages/PackageCrawsel.jsx";
import { useDisabledPackages } from "../../hooks/useDisabledPackages";
import { getApiV1Base } from "../../utils/apiUrl.js";

export default function HomePagePackages() {
  const [apiPackages, setApiPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowCarouselButtons, setShouldShowCarouselButtons] = useState(false);
  const destinationRef = useRef(null);
  const { isPackageEnabled } = useDisabledPackages();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${getApiV1Base()}/packages/`);
        if (!res.ok) throw new Error("API error");

        const jsondata = await res.json();
        const packagesArray = Array.isArray(jsondata?.data)
          ? jsondata.data
          : Array.isArray(jsondata)
          ? jsondata
          : [jsondata?.data].filter(Boolean);

        setApiPackages(packagesArray);

        const destRes = await fetch(`${getApiV1Base()}/destinations`);
        if (!destRes.ok) throw new Error("Destinations API error");

        const destData = await destRes.json();
        const destinationsArray = destData.data || [];

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

        if (destinationsWithPackages.length > 0) {
          setActiveTab(destinationsWithPackages[0].name.toLowerCase());
        }
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

  const getFilteredPackagesByTab = (destinationName) => {
    if (!Array.isArray(apiPackages) || apiPackages.length === 0) return [];

    const searchTerm = (destinationName || "").toLowerCase();

    return apiPackages.filter((pkg) => {
      // Check if package is disabled
      if (!isPackageEnabled(pkg.gtxPkgId)) {
        return false;
      }

      const pkgCountries = (pkg?.countries || "").toLowerCase();
      const pkgName = (pkg?.longJsonInfo?.package?.Name || pkg?.Name || "").toLowerCase();
      const pkgDestinations = (pkg?.destinations || "").toLowerCase();
      const searchText = `${pkgCountries} ${pkgName} ${pkgDestinations}`;

      return searchText.includes(searchTerm);
    });
  };

  const currentPackages = getFilteredPackagesByTab(activeTab);

  const getCardsPerView = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3; // Desktop: 3 cards + 5% next
    if (window.innerWidth >= 640) return 2;  // Tablet: 2 cards + 5% next
    return 1;                                 // Mobile: 1 card + 5% next
  };

  const checkCarouselButtonsNeeded = () => {
    const cardsPerView = getCardsPerView();
    setShouldShowCarouselButtons(destinations.length > cardsPerView);
  };

  useEffect(() => {
    checkCarouselButtonsNeeded();
    window.addEventListener("resize", checkCarouselButtonsNeeded);
    return () => window.removeEventListener("resize", checkCarouselButtonsNeeded);
  }, [destinations]);

  const handleCarouselScroll = (direction) => {
    if (!destinationRef.current) return;

    const container = destinationRef.current;
    const cardsPerView = getCardsPerView();
    const gap = window.innerWidth >= 640 ? 20 : 16;
    
    // Calculate single card width
    const containerWidth = container.clientWidth;
    const singleCardWidth = (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView;
    
    // Scroll amount = one card width + gap
    const scrollAmount = singleCardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleTabClick = (destinationName, index) => {
    setActiveTab(destinationName.toLowerCase());

    if (!destinationRef.current) return;

    const container = destinationRef.current;
    const cardsPerView = getCardsPerView();
    const gap = window.innerWidth >= 640 ? 20 : 16;
    const paddingLeft = parseInt(window.getComputedStyle(container).paddingLeft);
    const containerWidth = container.clientWidth - paddingLeft * 2;
    const singleCardWidth = (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView;
    
    // Calculate scroll position to center the clicked card
    const cardLeft = paddingLeft + (index * (singleCardWidth + gap));
    const targetLeft = cardLeft - (containerWidth / 2 - singleCardWidth / 2);

    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  };

  return (
    <div className="py-10 md:py-6 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              {/* <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md">
  Explore Packages
</div> */}
              <div className="mt-1 text-2xl sm:text-4xl font-extrabold leading-tight">
                <span className="text-slate-900">Choose your </span>
                <span className="text-blue-500">Destination</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader className="w-8 h-8 text-slate-600 animate-spin" />
              </div>
            ) : destinations.length > 0 ? (
              <div className="relative w-full max-w-5xl mx-auto">
                <div
                  ref={destinationRef}
                  className="flex scroll-smooth snap-x snap-mandatory gap-5 sm:gap-5 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 py-3 justify-center"
                  style={{
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {destinations.map((destination, index) => {
                    const packageCount = getFilteredPackagesByTab(destination.name).length;
                    const isActive = activeTab === destination.name.toLowerCase();

                    return (
                      <button
                        key={destination.id}
                        onClick={() => handleTabClick(destination.name, index)}
                        className="snap-start flex-none flex flex-col items-center gap-2 text-center min-w-[120px] sm:min-w-[160px] transition-transform duration-300 hover:scale-[1.02]"
                      >
                        <div
                          className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-slate-100 ${
                            isActive
                              ? "ring-4 ring-blue-500 shadow-lg"
                              : "ring-[3px] ring-slate-300 shadow-md"
                          }`}
                        >
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="block w-full h-full object-cover"
                          />
                        </div>

                        <div className="text-center">
                          <div className="text-sm sm:text-base font-bold text-slate-900 leading-tight max-w-[110px] sm:max-w-[150px] mx-auto break-words">
                            {destination.name}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-600 mt-1">
                            {packageCount} package{packageCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleCarouselScroll("left")}
                  className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white rounded-full p-2.5 shadow-lg hover:bg-blue-50 ring-1 ring-slate-300 transition-all ${
                    shouldShowCarouselButtons ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={24} className="text-slate-900" />
                </button>

                <button
                  onClick={() => handleCarouselScroll("right")}
                  className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white rounded-full p-2.5 shadow-lg hover:bg-blue-50 ring-1 ring-slate-300 transition-all ${
                    shouldShowCarouselButtons ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={24} className="text-slate-900" />
                </button>
              </div>
            ) : (
              <div className="text-slate-600 text-center py-4">
                No destinations available
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg animate-pulse w-48"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl h-[460px] bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : activeTab && currentPackages.length > 0 ? (
          <PackagesCarousel
            title={`${destinations.find((d) => d.name.toLowerCase() === activeTab)?.name || activeTab} Tour Packages`}
            items={currentPackages}
            onViewAll={() => (window.location.href = "/packages")}
          />
        ) : activeTab ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No packages available for this destination</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}