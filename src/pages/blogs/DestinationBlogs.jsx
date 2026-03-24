import React from "react";
import { useParams } from "react-router-dom";
import BlogCard from "../../Components/blogs/BlogCard";
import { blogData } from "../../data/blogs/blogData";

export default function DestinationBlogs() {
  const { destination } = useParams();
  const data = blogData[destination];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 mt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Destination not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 border-b-4 border-[#44B3C4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h2 className="text-2xl font-bold text-slate-900">Traveon</h2>
        </div>
      </div>

      {/* Hero Section with top padding */}
      <div className="bg-gradient-to-br from-[#44B3C4] to-[#2a96ab] text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="text-sm font-semibold">Blog & Articles</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Explore {data.destination}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Latest Articles
        </h2>
        <p className="text-slate-600 mb-8">
          Discover travel insights and experiences from our community
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {data.blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} destination={data.slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
