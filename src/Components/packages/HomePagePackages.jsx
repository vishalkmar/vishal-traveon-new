import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PackagesCarousel from "../../Components/packages/PackageCrawsel.jsx";

export default function HomePagePackages(){



  const [ApiPackages,setApiPackages] = useState([]);
  const [activeTab, setActiveTab] = useState('oman');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5050/packages"); // if your endpoint is /pack, change here
        if (!res.ok) throw new Error("API error");
        const jsondata = await res.json();
        console.log("API packages:", jsondata);
        setApiPackages(jsondata);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchData();
  }, []);
    


       return(<>
       
       <div className="py-16 bg-white">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* ✅ Tabs */}
    {/* ✅ Tabs with real images */}
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

    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {[
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
      ].map((d) => {
        const isActive = activeTab === d.id;

        return (
          <button
            key={d.id}
            onClick={() => setActiveTab(d.id)}
            className={`relative flex w-full items-center gap-4 rounded-2xl p-5 text-left transition-all duration-300 ring-1 shadow-md
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
            <span className="h-16 w-16 overflow-hidden rounded-full bg-white p-1">
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

            <span className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-slate-50 ring-1 ring-black/5">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </button>
        );
      })}
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