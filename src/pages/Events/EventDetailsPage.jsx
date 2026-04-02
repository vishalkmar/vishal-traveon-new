import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Globe,
  ArrowLeft,
  Award,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { events } from "../../data/events";

const GalleryModal = ({ images, currentIndex, onClose, onNext, onPrevious }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="w-8 h-8" />
      </button>
      <button
        onClick={onPrevious}
        className="absolute left-4 text-white hover:text-gray-300"
      >
        <ChevronLeft className="w-12 h-12" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 text-white hover:text-gray-300"
      >
        <ChevronRight className="w-12 h-12" />
      </button>
      <div className="max-w-7xl max-h-[90vh] p-4">
        <img
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-h-[80vh] max-w-full object-contain"
        />
        <div className="text-white text-center mt-4">
          Image {currentIndex + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};

const PreviousEventDetails = ({ event }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev === event.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? event.gallery.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <Link
              to="/events"
              className="inline-flex items-center text-white mb-8 hover:text-[#28bccf] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {event.name}
            </h1>
            <h2 className="text-2xl md:text-3xl opacity-90 mb-6">
              {event.fullName}
            </h2>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {event.date}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">About the Event</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Winners Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2 text-[#28bccf]" />
                Award Winners
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.winners?.map((winner, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-[#28bccf]">
                      {winner.category}
                    </h3>
                    <p className="text-gray-800">{winner.name}</p>
                    <p className="text-gray-600 text-sm">
                      {winner.organization}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold mb-6">Event Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p>{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Event Type</p>
                    <p>{event.type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold mb-6">
                Interested in Future Events?
              </h3>
              <p className="text-gray-600 mb-6">
                Stay updated with our upcoming events and be part of our success
                story.
              </p>
              <Link
                to="/events"
                className="block w-full bg-[#28bccf] text-white text-center py-3 rounded-lg hover:bg-[#1a8a9a] transition-colors"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>

        {/* Chief Guests Section */}
        <div className="bg-white rounded-xl shadow-md p-8 my-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-[#28bccf]" />
            Distinguished Guests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.distinguishedGuests?.map((guest, index) => (
              <div
                key={index}
                className=" flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
              >
                <img
                  src={guest.image}
                  alt={guest.name}
                  className="w-24 h-24 rounded-md object-cover"
                />
                <div>
                  <span className="text-white text-sm rounded-md bg-teal-300 p-1">
                    {guest.designation}
                  </span>
                  <h3 className="font-semibold text-lg">{guest.name}</h3>
                  <p className="text-gray-600">{guest.designation}</p>
                  {/* <p className="text-gray-500 text-sm">
                        {guest.organization}
                      </p> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Gallery */}
        <div className="bg-white rounded-xl shadow-md p-8 my-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ImageIcon className="w-6 h-6 mr-2 text-[#28bccf]" />
            Event Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {event.gallery?.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image}
                  alt={`Event gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 group-hover:bg-gray-500/20 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to enlarge
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImageIndex !== null && (
        <GalleryModal
          images={event.gallery}
          currentIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
};

const UpcomingEventDetails = ({ event }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <Link
              to="/events"
              className="inline-flex items-center text-white mb-8 hover:text-[#28bccf] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {event.name}
            </h1>
            <h2 className="text-2xl md:text-3xl opacity-90 mb-6">
              {event.fullName}
            </h2>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {event.date}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">About the Event</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Schedule Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>
              <div className="space-y-4">
                {event.schedule?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-32 font-semibold text-[#28bccf]">
                      {item.time}
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-800">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Event Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.highlights?.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="h-2 w-2 bg-[#28bccf] rounded-full mr-4"></div>
                    <p className="text-gray-800">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold mb-6">Event Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p>{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Event Type</p>
                    <p>{event.type}</p>
                  </div>
                </div>
              </div>
              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full bg-[#28bccf] text-white text-center py-3 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Visit Event Website
              </a>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold mb-6">Need More Information?</h3>
              <p className="text-gray-600 mb-6">
                Contact our team for any questions about the event or
                registration process.
              </p>
              <Link
                to="/contact"
                className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const event = events.find((e) => e.id === parseInt(id));

  console.log("Events", events)

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event not found
          </h2>
          <Link to="/events" className="text-[#28bccf] hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return event.isUpcoming ? (
    <UpcomingEventDetails event={event} />
  ) : (
    <PreviousEventDetails event={event} />
  );
};

export default EventDetailsPage;
