import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/events", label: "Events" },
    { path: "/contact", label: "Visa Services" },
    { path: "/contact", label: "Contact" },
    { path: "/privacy", label: "Privacy Policy" },
  ];

  const services = [
    "Wellness Retreat",
    "Travel Experiences",
    "MICE Management",
    "Business Facilitation",
    "Corporate Events",
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 py-6">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-white flex items-center mb-4"
            >
              <img src="/logo.png" alt="Traveon" className="object-contain w-auto h-10" />
            </Link>
            <p className="mb-4">
              Premier travel company providing curated tour packages and global travel services.
            </p>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Traveon. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="hover:text-teal-400 transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors w-full"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Traveon. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/sitemap" className="text-sm text-gray-500 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
