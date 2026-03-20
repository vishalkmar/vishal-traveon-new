import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PackagesCarousel from "../../Components/packages/PackageCrawsel.jsx";

export default function HomePagePackages() {
  const [apiPackages, setApiPackages] = useState([]);
  const [activeTab, setActiveTab] = useState("oman");
  const destinationRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/packages/");
        if (!res.ok) throw new Error("API error");

        const jsondata = await res.json();

        const packagesArray = Array.isArray(jsondata?.data)
          ? jsondata.data
          : Array.isArray(jsondata)
          ? jsondata
          : [jsondata?.data].filter(Boolean);

        setApiPackages(packagesArray);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setApiPackages([]);
      }
    };

    fetchData();
  }, []);

  const filterMap = {
    oman: ["oman", "untold"],
    vietnam: ["vietnam"],
    seychelles: ["seychelles"],
  };

  const getFilteredPackagesByTab = (tab) => {
    if (!Array.isArray(apiPackages) || apiPackages.length === 0) return [];

    const keywords = filterMap[tab] || [];

    return apiPackages.filter((pkg) => {
      const title = pkg?.title?.toLowerCase?.() || "";
      return keywords.some((keyword) => title.includes(keyword));
    });
  };

  const currentPackages = getFilteredPackagesByTab(activeTab);

  const getCardsPerView = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const handleCarouselScroll = (direction) => {
    if (!destinationRef.current) return;

    const container = destinationRef.current;
    const cardsPerView = getCardsPerView();
    const gap = window.innerWidth >= 640 ? 16 : 12; // tailwind gap-4 / gap-3 approx
    const cardWidth = container.clientWidth / cardsPerView;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleTabClick = (id, index) => {
    setActiveTab(id);

    if (!destinationRef.current) return;

    const container = destinationRef.current;
    const cardsPerView = getCardsPerView();
    const cardNode = container.children[index];

    if (!cardNode) return;

    const cardLeft = cardNode.offsetLeft;
    const containerWidth = container.clientWidth;

    let targetLeft = cardLeft;

    if (cardsPerView === 2) {
      targetLeft = Math.max(cardLeft - containerWidth / 4, 0);
    }

    if (cardsPerView === 3) {
      targetLeft = Math.max(cardLeft - containerWidth / 3, 0);
    }

    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  const destinations = [
    {
      id: "oman",
      label: "Oman",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdDw6nf1dGTz2p3a54EeC2S7ixXh3EYC6EsQ&s",
    },
    {
      id: "vietnam",
      label: "Vietnam",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Flag_orb_Vietnam.svg/1280px-Flag_orb_Vietnam.svg.png",
    },
    {
      id: "seychelles",
      label: "Seychelles",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkNrvrayOh3_KK5g6TqL3LaMME900OUGdmvA&s",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="mb-10 rounded-[28px] p-4 sm:p-6 ring-1 ring-black/5 shadow-sm"
          style={{ background: "#23A8CC" }}
        >
          <div className="flex flex-col items-center gap-5">
            <div className="text-center">
              <div className="text-sm font-semibold text-white">
                Explore Packages
              </div>

              <div className="mt-1 text-2xl sm:text-4xl font-extrabold text-slate-900">
                Choose your <span className="text-white">Destination</span>
              </div>
            </div>

            <div className="relative w-full">
              <div
                ref={destinationRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 sm:gap-4 scrollbar-hide"
              >
                {destinations.map((d, index) => {
                  const isActive = activeTab === d.id;
                  const packageCount = getFilteredPackagesByTab(d.id).length;

                  return (
                    <button
                      key={d.id}
                      onClick={() => handleTabClick(d.id, index)}
                      className={`snap-start shrink-0 basis-full sm:basis-[calc(50%-8px)] lg:basis-[calc(33.333%-11px)] relative flex items-center gap-4 rounded-2xl p-5 text-left transition-all duration-300 ring-1 shadow-md min-h-[132px] ${
                        isActive
                          ? "bg-white ring-slate-300"
                          : "bg-white/95 ring-black/5"
                      }`}
                    >
                      <span className="h-16 w-16 overflow-hidden rounded-full bg-white p-1 flex-shrink-0">
                        <img
                          src={d.img}
                          alt={d.label}
                          className="h-full w-full object-cover"
                        />
                      </span>

                      <div className="min-w-0">
                        <div className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                          {d.label}
                        </div>
                        <div className="text-sm text-slate-500">
                          {packageCount} package{packageCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handleCarouselScroll("left")}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-2 sm:-translate-x-3 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} className="text-slate-900" />
              </button>

              <button
                onClick={() => handleCarouselScroll("right")}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 sm:translate-x-3 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} className="text-slate-900" />
              </button>
            </div>
          </div>
        </div>

        {activeTab === "oman" && (
          <PackagesCarousel
            title="Oman Tour Packages"
            items={currentPackages}
            onViewAll={() => (window.location.href = "/packages")}
          />
        )}

        {activeTab === "vietnam" && (
          <PackagesCarousel
            title="Vietnam Tour Packages"
            items={currentPackages}
            onViewAll={() => (window.location.href = "/packages")}
          />
        )}

        {activeTab === "seychelles" && (
          <PackagesCarousel
            title="Seychelles Tour Packages"
            items={currentPackages}
            onViewAll={() => (window.location.href = "/packages")}
          />
        )}
      </div>
    </div>
  );
}