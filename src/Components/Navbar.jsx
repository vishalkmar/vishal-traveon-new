import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const packagesRef = useRef(null);

  const location = useLocation();

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (packagesRef.current && !packagesRef.current.contains(e.target)) {
        setPackagesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setPackagesOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const isPackagesActive =
    location.pathname.startsWith("/packages");

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Traveon" },
    { path: "/services", label: "Our Services" },
    { path: "/packages", label: "Packages" },
    { path: "/events", label: "Events" },
    { path: "/gallery", label: "Gallery" },
    { path: "/mice", label: "MICE" },
    { path: "/contact", label: "Contact Us" },
  ];

  const linkColor = (active) =>
    active
      ? "text-[#28bccf]"
      : scrolled
      ? "text-slate-600 hover:text-[#28bccf] font-medium"
      : "text-white hover:text-[#28bccf]";

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" aria-label="Traveon" className="shrink-0">
            <div
              className={`flex items-center transition-all duration-300
                h-[clamp(30px,4vw,48px)]
                max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] xl:max-w-[260px]
              `}
            >
              <img
                src="/logo.png"
                alt="Traveon"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 whitespace-nowrap">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.label} className="relative" ref={packagesRef}>
                    <button
                      onClick={() => setPackagesOpen((v) => !v)}
                      className={`inline-flex items-center gap-1 transition font-medium ${
                        linkColor(isPackagesActive)
                      }`}
                    >
                      Packages
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          packagesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {packagesOpen && (
                      <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
                        <Link
                          to="/packages/wellness"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-sky-50 hover:text-[#28bccf] font-medium"
                        >
                          Wellness Retreat
                        </Link>
                        <Link
                          to="/packages/community-tour"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-sky-50 hover:text-[#28bccf] font-medium"
                        >
                          Community Tours
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition ${linkColor(
                    isActive(link.path)
                  )} whitespace-nowrap`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className={scrolled ? "text-slate-600" : "text-white"} />
            ) : (
              <Menu size={24} className={scrolled ? "text-slate-600" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <div className="bg-white px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((link) => {
            if (link.isDropdown) {
              return (
                <div key={link.label} className="pt-2">
                  <div className="text-slate-900 font-semibold mb-2">
                    Packages
                  </div>
                  <Link
                    to="/packages/wellness"
                    className="block px-3 py-2 rounded text-slate-700 hover:bg-sky-50 hover:text-[#28bccf] font-medium"
                  >
                    Wellness Retreat
                  </Link>
                  <Link
                    to="/packages/community-tour"
                    className="block px-3 py-2 rounded text-slate-700 hover:bg-sky-50 hover:text-[#28bccf] font-medium"
                  >
                    Community Tours
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded text-slate-700 hover:bg-sky-50 hover:text-[#28bccf] font-medium"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
