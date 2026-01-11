import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { backendUrl } from "../../apiConfig/config";
import { FaYoutube, FaInstagram, FaLinkedinIn } from "react-icons/fa";


const ContactInfo = ({ icon: Icon, title, content }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 bg-sky-100 hover:bg-sky-200 duration-300 rounded-full flex items-center justify-center">
        {Icon && (
          <Icon className="text-[#28bccf] hover:text-[#28bccfd7]" size={24} />
        )}
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <div className="text-gray-600">
        {Array.isArray(content) ? (
          content.map((item, index) => <p key={index}>{item}</p>)
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  </div>
);

const SocialMediaLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-[#28bccf] bg-sky-100 hover:bg-sky-200 duration-300 transition-colors rounded-lg p-2"
  >
    {children}
  </a>
);

const WhatsAppSection = () => (
  <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
    <h2 className="text-2xl font-bold mb-4">Quick Connect via WhatsApp</h2>
    <p className="text-gray-600">
      Need immediate assistance? Connect with us directly on WhatsApp for quick
      responses.
    </p>
    <a
      href="https://wa.me/919540111207?text=Hi%20Traveon,%20I%20would%20like%20to%20know%20more%20about%20your%20services."
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center space-x-2 bg-[#28bccf] text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
    >
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span>Chat on WhatsApp</span>
    </a>
    <p className="text-sm text-gray-500 mt-2">
      Available Monday to Friday, 9:00 AM - 6:00 PM IST
    </p>
  </div>
);

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const formatWhatsAppMessage = (formData) => {
  //   return encodeURIComponent(
  //     `🔔 *New Contact Form Submission*\n\n` +
  //       `👤 *Name:* ${formData.name}\n` +
  //       `📧 *Email:* ${formData.email}\n` +
  //       `📱 *Phone:* ${formData.phone}\n` +
  //       `📝 *Subject:* ${formData.subject}\n\n` +
  //       `💬 *Message:*\n${formData.message}`
  //   );
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Thank you for your message. We will get back to you soon!"
        );
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const FadeIn = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white py-20 relative">
        <div className="max-w-screen-xl mx-auto px-4 my-20 relative z-30">
          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Contact Us
            </h1>
            {/* <p className="text-xl text-white max-w-4xl mx-auto text-center">
              We'd love to hear from you!
            </p> */}
          </FadeIn>
        </div>
        <div className="absolute inset-0 bg-gray-900/40 z-20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/contact-us.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              We'd love to hear from you!
            </h2>
            <p className="text-gray-600 mb-10">
              We're here to make your experience exceptional. Whether you're
              planning a holiday, event, exploring business opportunities, or
              have other ideas in mind, feel free to drop us a line. Our
              commitment is to respond promptly to all inquiries.
            </p>
            <h3 className="text-xl font-semibold mb-8">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#28bccf] text-white px-6 py-3 rounded-lg hover:bg-[#28bccfa6] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <ContactInfo
                icon={MapPin}
                title="Corporate Office"
                content="128, D-Mall, NSP, Delhi-110034"
              />
              <a href="mailto:info@traveon.in" target="_blank" rel="noopener noreferrer">
                <ContactInfo
                  icon={Mail}
                  title="Email Address"
                  content="info@traveon.in"
                />
              </a>
              <ContactInfo
                icon={Phone}
                title="Phone Number"
                content="+91 9540111207, +91 9540111307"
              />
            </div>

            <WhatsAppSection />

            <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Follow us on social media</h2>

                <div className="flex space-x-4">
                  {/* YouTube */}
                  <SocialMediaLink href="https://www.youtube.com/@traveonventures" aria-label="YouTube">
                    <FaYoutube className="w-6 h-6 text-[#28bccf]" />
                  </SocialMediaLink>

                  {/* Instagram */}
                  <SocialMediaLink href="https://www.instagram.com/traveonventures/" aria-label="Instagram">
                    <FaInstagram className="w-6 h-6 text-[#28bccf]" />
                  </SocialMediaLink>

                  {/* LinkedIn */}
                  <SocialMediaLink href="https://www.linkedin.com/company/traveon/" aria-label="LinkedIn">
                    <FaLinkedinIn className="w-6 h-6 text-[#28bccf]" />
                  </SocialMediaLink>
                </div>
              </div>
            </div>


            {/* Map */}
            {/* <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Our Location</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.4480495835194!2d77.1147413!3d28.6921938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03833ebf1b1f%3A0x7c43b63685012b71!2sD%20Mall%2C%20Netaji%20Subhash%20Place%2C%20Pitampura%2C%20Delhi%2C%20110034!5e0!3m2!1sen!2sin!4v1625641111111!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
