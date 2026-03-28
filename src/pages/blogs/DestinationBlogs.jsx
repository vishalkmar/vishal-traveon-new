import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import BlogCard from "../../Components/blogs/BlogCard";
import transformBlogData from "../../data/blogs/blogData";

const API_BASE = "https://traveon-backend-production.up.railway.app/api";

export default function DestinationBlogs() {
  const { destination } = useParams();

  const [blogDataState, setBlogDataState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/v1/blog`);
      const data = await res.json();

      if (data.success && data.data) {
        const transformed = transformBlogData(data.data);
        setBlogDataState(transformed);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const data = blogDataState[destination];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#44B3C4] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading blogs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {error}
          </h1>
          <p className="text-slate-600">Please try again later</p>
        </div>
      </div>
    );
  }

  // Destination not found
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Destination not found
          </h1>
          <p className="text-slate-600 mb-6">No blogs available for this destination yet</p>
          <a
            href="/"
            className="bg-[#44B3C4] text-white px-6 py-2 rounded-lg hover:bg-[#2a96ab] transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Destination found - show blogs
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section with Destination Image */}
      <div className="relative w-full h-80 md:h-96 lg:h-[28rem] overflow-hidden bg-slate-900">
        {data.image && (
          <img
            src={data.image}
            alt={data.destination}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 sm:p-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            {data.destination}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/95 max-w-2xl drop-shadow-md">
            {data.description}
          </p>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 sm:mb-3">
                Latest Articles
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] rounded-full"></div>
            </div>
          </div>
          <p className="text-base sm:text-lg text-slate-600 mt-4">
            Discover travel insights and experiences from our community about {data.destination}
          </p>
        </div>

        {data.blogs && data.blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {data.blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} destination={data.slug} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-block mb-4">
              <Loader className="w-12 h-12 text-[#44B3C4] animate-spin mx-auto" />
            </div>
            <p className="text-slate-600 text-lg">No blogs available for this destination yet</p>
          </div>
        )}
      </div>
    </div>
  );
}


