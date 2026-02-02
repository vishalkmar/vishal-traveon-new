import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ------------------------------ Simple FadeIn ------------------------------ */
const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {children}
    </div>
  );
};

/* ------------------------------- Lightbox ---------------------------------- */
const LightboxModal = ({ images, currentIndex, onClose, onNext, onPrevious }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const contentRef = useRef(null);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) onNext();
    if (distance < -50) onPrevious();
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  const handleBackdropClick = (e) => {
    // Close only if user clicked the backdrop, not the content.
    if (contentRef.current && !contentRef.current.contains(e.target)) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>
      <button
        onClick={onPrevious}
        className="absolute left-4 text-white hover:text-gray-300 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-12 h-12" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 text-white hover:text-gray-300 z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-12 h-12" />
      </button>

      <div ref={contentRef} className="max-w-7xl max-h-[90vh] p-4">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="max-h-[80vh] max-w-full object-contain"
          loading="eager"
          decoding="async"
        />
        <div className="text-white text-center mt-4">
          <h3 className="text-xl font-semibold mb-2">{images[currentIndex].alt}</h3>
          {images[currentIndex].category && (
            <span className="text-sm bg-teal-600 px-3 py-1 rounded-full">
              {images[currentIndex].category}
            </span>
          )}
          <p className="mt-2 text-gray-400">
            Image {currentIndex + 1} of {images.length}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Masonry Card --------------------------------
   Uses CSS multi-column layout to avoid uneven white space with mixed
   portrait/landscape images. Each card avoids breaking across columns.
-----------------------------------------------------------------------------*/
const GalleryImage = ({ src, alt, category, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative mb-6 break-inside-avoid rounded-lg overflow-hidden group cursor-pointer bg-gray-100"
      onClick={onClick}
    >
      {/* Skeleton shimmer until the image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse">
          <div className="w-full h-full bg-gray-200" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`w-full h-auto transition-transform duration-700 group-hover:scale-[1.03] ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
      />

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white text-center">
          <h3 className="text-base font-semibold mb-2 drop-shadow">{alt}</h3>
          {category && (
            <span className="text-xs bg-[#28bccf] px-3 py-1 rounded-full inline-block">
              {category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Page ----------------------------------- */
const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const categories = ["All", "Events", "MICE"];

  const images = [
    { src: "/iccictimages/ic1.jpg", alt: "iccict", category: "Events" },
   

    // Your local gallery images (mixed orientations)
    { src: "/gallery/2.JPG", alt: "IBIEA", category: "Events" },
    { src: "/gallery/1.JPG", alt: "IBIEA", category: "Events" },
    { src: "/gallery/3.JPG", alt: "IBIEA", category: "Events" },
    { src: "/gallery/4.JPG", alt: "IBIEA", category: "Events" },
    { src: "/gallery/6.JPG", alt: "IBIEA", category: "Events" },
    { src: "/gallery/7.JPG", alt: "IBIEA", category: "Events" },
    { src: "/gallery/10.JPG", alt: "IBIEA", category: "Events" },
    { src: "/gallery/8.JPG", alt: "IBIEA", category: "Events" },
     { src: "/iccictimages/ic2.jpg", alt: "Corporate Meeting", category: "Events" },
    { src: "/gallery/9.JPG", alt: "IBIEA", category: "Events" },
    { src: "/gallery/11.JPG", alt: "IBIEA", category: "Events" },

     { src: "/iccictimages/ic3.jpg", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic4.jpg", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic5.JPG", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic6.JPG", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic7.jpg", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic8.jpg", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic9.JPG", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic10.JPG", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic11.JPG", alt: "iccict", category: "Events" },
     { src: "/iccictimages/ic12.JPG", alt: "iccict", category: "Events" },

  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredImages = images.filter(
    (img) => selectedCategory === "All" || img.category === selectedCategory
  );

  const handleImageClick = (index) => setSelectedImageIndex(index);
  const handleCloseModal = () => setSelectedImageIndex(null);
  const handleNext = () =>
    setSelectedImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  const handlePrevious = () =>
    setSelectedImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white py-20 relative">
        <div className="max-w-screen-xl mx-auto px-4 my-20 relative z-30">
          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Our Gallery</h1>
            <p className="text-xl text-white/90 max-w-4xl mx-auto text-center">
              Explore our collection of memorable moments, stunning destinations, and successful events
            </p>
          </FadeIn>
        </div>
        <div className="absolute inset-0 bg-gray-900/40 z-20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Gallery Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-md">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-md transition-colors duration-200 ${active ? "bg-[#28bccf] text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  aria-pressed={active}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry (columns) Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filteredImages.map((image, index) => (
            <FadeIn key={`${image.src}-${index}`} delay={index * 60}>
              <GalleryImage
                {...image}
                onClick={() => handleImageClick(index)}
              />
            </FadeIn>
          ))}
        </div>

        {filteredImages.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">No images found in the selected category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <LightboxModal
          images={filteredImages}
          currentIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {/* Call to Action */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Be Part of Our Story?</h2>
          <p className="text-gray-600 mb-8">Let us help you create your own memorable experiences</p>
          <Link
            to="/contact"
            className="bg-[#28bccf] text-white px-8 py-3 rounded-full hover:bg-[#22a8b9] transition-colors inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
