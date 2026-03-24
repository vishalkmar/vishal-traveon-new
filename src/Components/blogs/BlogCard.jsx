import React from "react";
import { Link } from "react-router-dom";
import { Share2, X as XIcon } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin, FaLink, FaEnvelope } from "react-icons/fa";

export default function BlogCard({ blog, destination }) {
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const baseUrl = window.location.origin;
  const blogUrl = `${baseUrl}/blog/${destination}/${blog.slug}`;
  const encodedUrl = encodeURIComponent(blogUrl);
  const encodedTitle = encodeURIComponent(blog.title);

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

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 bg-[#44B3C4] text-white px-3 py-1 rounded-full text-xs font-semibold">
            {blog.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2">
            {blog.title}
          </h3>
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{blog.excerpt}</p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            <span>{blog.date}</span>
            <span>{blog.readTime} read</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <Link
              to={`/blog/${destination}/${blog.slug}`}
              className="text-[#44B3C4] font-semibold hover:text-[#2a96ab] transition text-sm"
            >
              Read More →
            </Link>

            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="p-2 hover:bg-[#44B3C4]/10 rounded-lg transition text-[#44B3C4]"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Centered Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Share This Blog</h3>
              <button
                onClick={() => setIsShareOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <XIcon className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    type="button"
                    onClick={option.onclick}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-100 transition group"
                    title={option.name}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition"
                      style={{ backgroundColor: option.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center">
                      {option.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsShareOpen(false)}
              className="w-full mt-6 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
