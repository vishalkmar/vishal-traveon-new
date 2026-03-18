import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PackagesCarousel from "../../Components/packages/PackageCrawsel.jsx";

import { packagesData } from "../shared/PackageData.jsx";

export default function HomePagePackages(){

  const [ApiPackages,setApiPackages] = useState([]);
  const [activeTab, setActiveTab] = useState('oman');
  const destinationRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/packages/");
        if (!res.ok) throw new Error("API error");
        const jsondata = await res.json();
        
        const packagesArray = Array.isArray(jsondata?.data) 
          ? jsondata.data 
          : (Array.isArray(jsondata) ? jsondata : [jsondata?.data].filter(Boolean));
          
        setApiPackages(packagesArray);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setApiPackages([]);
      }
    };

    fetchData();
  }, []);

  // Filter packages by destination
  const getFilteredPackages = () => {
    if (!Array.isArray(ApiPackages) || ApiPackages.length === 0) return [];
    
    const filterMap = {
      oman: ['Oman', 'untold'],
      vietnam: ['Vietnam', 'vietnam'],
      seychelles: ['Seychelles', 'seychelles']
    };

    const keywords = filterMap[activeTab] || [];
    return ApiPackages.filter(pkg => 
      pkg.title && keywords.some(keyword => 
        pkg.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const handleCarouselScroll = (direction) => {
    if (!destinationRef.current) return;
    
    const scrollAmount = 400;
    if (direction === "left") {
      destinationRef.current.scrollTo({
        left: destinationRef.current.scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    } else {
      destinationRef.current.scrollTo({
        left: destinationRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
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

       return(<>
       
       <div className="py-16 bg-white">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* ✅ Destination Carousel */}
<div
  className="mb-10 rounded-[28px] p-4 sm:p-6 ring-1 ring-black/5 shadow-sm"
  style={{ background: "linear-gradient(135deg, rgba(57, 198, 216, 0.08) 0%, rgba(47, 184, 211, 0.06) 100%)" }}
>
  <div className="flex flex-col items-center gap-5">
    <div className="text-center">
      <div className="text-sm font-semibold text-slate-700">Explore Packages</div>
      <div className="mt-1 text-2xl sm:text-4xl font-extrabold text-slate-900">
        Choose your{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)",
          }}
        >
          Destination
        </span>
      </div>
    </div>

    {/* Carousel Container */}
    <div className="relative w-full">
      <div
        ref={destinationRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {destinations.map((d) => {
          const isActive = activeTab === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setActiveTab(d.id)}
              className={`relative flex flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 items-center gap-4 rounded-2xl p-5 text-left transition-all duration-300 ring-1 shadow-md
                ${isActive ? "bg-white ring-emerald-200/50 shadow-lg shadow-sky-200/50" : "bg-white/70 ring-black/5 hover:bg-white hover:shadow-md"}`}
            >
              {isActive && (
                <span
                  className="absolute inset-0 -z-10 rounded-2xl opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, #39C6D8 0%, #2FB8D3 50%, #23A8CC 100%)",
                    filter: "blur(16px)",
                  }}
                />
              )}

              {/* image */}
              <span className="h-16 w-16 overflow-hidden rounded-full bg-white p-1 flex-shrink-0">
                <img
                  src={d.img}
                  alt={d.label}
                  className="h-full w-full object-cover"
                />
              </span>

              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  {d.label}
                </div>
                <div className="text-sm text-slate-500">
                  {(ApiPackages?.length || 0)} packages
                </div>
              </div>

              <span className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-slate-50 ring-1 ring-black/5 flex-shrink-0">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => handleCarouselScroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} className="text-slate-900" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => handleCarouselScroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} className="text-slate-900" />
      </button>
    </div>
  </div>
</div>


    {/* ✅ Content */}
    {activeTab === "oman" && (
     
          <PackagesCarousel
               title="Oman Tour Packages"
                items={ApiPackages
                }
                 onViewAll={() => (window.location.href = "/packages")}
            />
    )}

    {activeTab === "vietnam" && (
      <PackagesCarousel
        title="Vietnam Tour Packages"
        items={ApiPackages}
        onViewAll={() => (window.location.href = "/packages")}
      />
    )}

    {activeTab === "seychelles" && (
      <PackagesCarousel
        title="Seychelles Tour Packages"
        items={ApiPackages}
        onViewAll={() => (window.location.href = "/packages")}
      />
    )}
  </div>
</div>
            
       </>)
}