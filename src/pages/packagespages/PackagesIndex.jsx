import { Link } from "react-router-dom";

import PackagesCarousel from "../../Components/packages/PackageCrawsel.jsx";
import PackagesListingLayout from "../../Components/packages/PackagesListingLayout.jsx";

import { useEffect, useState } from "react";

export default function PackagesIndex() {
  const [apiPackages, setApiPackages] = useState([]);




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

  return (
    <div className="min-h-screen pt-28">
      
      <PackagesListingLayout pageTitle="Tour Packages" totalCount={284}>
        <PackagesCarousel title="Oman Tour Packages" items={apiPackages} />
        <PackagesCarousel title="Seychelles Tour Packages" items={apiPackages} />
        <PackagesCarousel title="Viatnam Tour Packages" items={apiPackages} />
        <PackagesCarousel title="Customized Tour Packages" items={apiPackages} />
        <PackagesCarousel title="Group Tour Packages" items={apiPackages} />


      </PackagesListingLayout>

    
    </div>
  );
}
