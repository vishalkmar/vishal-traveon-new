import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import transformBlogData from "../../data/blogs/blogData";
import { ChevronLeft, Share2, X as XIcon, Loader } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin, FaLink, FaEnvelope } from "react-icons/fa";

export default function BlogDetail() {
  const { destination, slug } = useParams();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [blog, setBlog] = useState(null);
  const [destinationData, setDestinationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "https://traveon-backend-production.up.railway.app/api";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/v1/blog`);
        const data = await response.json();
        
        if (data.success) {
          const transformedData = transformBlogData(data.data);
          setDestinationData(transformedData[destination]);
          
          const foundBlog = transformedData[destination]?.blogs.find(
            (b) => b.slug === slug
          );
          setBlog(foundBlog);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [destination, slug]);

  const baseUrl = window.location.origin;
  const blogUrl = `${baseUrl}/blog/${destination}/${slug}`;
  const encodedUrl = encodeURIComponent(blogUrl);
  const encodedTitle = blog ? encodeURIComponent(blog.title) : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    alert("Blog link copied to clipboard!");
    setIsShareOpen(false);
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "#1877F2",
      onclick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
          "_blank"
        );
        setIsShareOpen(false);
      },
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "#E4405F",
      onclick: () => {
        window.open(`https://www.instagram.com/share?url=${encodedUrl}`, "_blank");
        setIsShareOpen(false);
      },
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "#25D366",
      onclick: () => {
        window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, "_blank");
        setIsShareOpen(false);
      },
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "#0A66C2",
      onclick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          "_blank"
        );
        setIsShareOpen(false);
      },
    },
    {
      name: "Twitter/X",
      icon: FaLink,
      color: "#000000",
      onclick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
          "_blank"
        );
        setIsShareOpen(false);
      },
    },
    {
      name: "Email",
      icon: FaEnvelope,
      color: "#666",
      onclick: () => {
        window.location.href = `mailto:?subject=${encodedTitle}&body=Check out this blog: ${blogUrl}`;
        setIsShareOpen(false);
      },
    },
    {
      name: "Copy Link",
      icon: FaLink,
      color: "#44B3C4",
      onclick: handleCopyLink,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#44B3C4] animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog || !destinationData || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {error || "Blog not found"}
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-[#44B3C4] text-white px-6 py-2 rounded-lg hover:bg-[#2a96ab] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/blogs/${destination}`)}
          className="flex items-center gap-2 text-[#44B3C4] hover:text-[#2a96ab] font-semibold mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to {destinationData.destination} Blogs
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 mb-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#44B3C4] text-white px-3 py-1 rounded-full text-xs font-semibold">
                {blog.category}
              </span>
              <span className="text-slate-500 text-sm">{blog.readTime} read</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              {blog.title}
            </h1>

            {/* Meta & Share */}
            <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{blog.author}</p>
                <p className="text-sm text-slate-500">{blog.date}</p>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsShareOpen(!isShareOpen)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#44B3C4]/10 rounded-lg transition text-[#44B3C4] font-semibold"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>

                {isShareOpen && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-slate-900">
                          Share
                        </h3>
                        <button
                          onClick={() => setIsShareOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition"
                        >
                          <XIcon className="w-6 h-6 text-slate-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-6 items-center justify-center">
                        {shareOptions.slice(0, 4).map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.name}
                              type="button"
                              onClick={option.onclick}
                              className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition group"
                              title={option.name}
                            >
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition shadow-lg"
                                style={{ backgroundColor: option.color }}
                              >
                                <Icon className="w-7 h-7" />
                              </div>
                              <span className="text-xs font-semibold text-gray-700 text-center line-clamp-2">
                                {option.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-3 gap-6 items-center justify-center mt-6">
                        {shareOptions.slice(4).map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.name}
                              type="button"
                              onClick={option.onclick}
                              className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition group"
                              title={option.name}
                            >
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition shadow-lg"
                                style={{ backgroundColor: option.color }}
                              >
                                <Icon className="w-7 h-7" />
                              </div>
                              <span className="text-xs font-semibold text-gray-700 text-center line-clamp-2">
                                {option.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
            {blog.content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.includes("-") && paragraph.split("\n").length > 1) {
                // List handling
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 my-6">
                    {paragraph.split("\n").map((item, i) => (
                      <li key={i} className="text-slate-700">
                        {item.replace("- ", "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="mb-6 text-slate-700">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Written by {blog.author}
                </p>
                <p className="text-sm text-slate-500">Published on {blog.date}</p>
              </div>
              <div
                className="w-12 h-12 rounded-full bg-[#44B3C4] text-white flex items-center justify-center font-bold text-lg"
              >
                {blog.author.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Related Blogs CTA */}
        <div className="bg-gradient-to-r from-[#44B3C4] to-[#2a96ab] text-white rounded-2xl p-8 text-center mb-16">
          <h3 className="text-2xl font-bold mb-3">Interested in {destinationData.destination}?</h3>
          <p className="mb-6 opacity-90">
            Check out more articles and travel guides from our community
          </p>
          <button
            onClick={() => navigate(`/blogs/${destination}`)}
            className="bg-white text-[#44B3C4] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            View All {destinationData.destination} Blogs
          </button>
        </div>
      </div>
    </div>
  );
}
