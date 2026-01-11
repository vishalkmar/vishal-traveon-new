import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, IndianRupee } from 'lucide-react';

const retreats = [
  {
    id: 'nirvana_anantam',
    title: 'Nirvana — Anantam a Holistic Wellness Retreat',
    location: 'Phool Chatti Yoga Ashram, Rishikesh, Uttarakhand, India',
    duration: '4 days',
    priceFrom: '30000',
    // image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600&auto=format&fit=crop',
    image: "/gallery/nirwana-anantam.webp",
  },
  {
    id: 'nirvana_inner_journey',
    title: 'Nirvana — Inner Journey Meditation & Healing',
    location: 'Naad Wellness Sonipat, Haryana, India',
    duration: '4 days',
    priceFrom: '40000',
    // image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1600&auto=format&fit=crop',
    image: "/gallery/nirwana-inner.webp",
  },
  {
    id: 'corporate_sound_healing',
    title: '2 Hrs Onsite Sound Healing Workshop for Corporates',
    location: 'Delhi, Gurgaon, Noida, Faridabad, India',
    duration: '2 hours',
    priceFrom: '10000',
    // image: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1600&auto=format&fit=crop',
    image: "/gallery/nirwana-soundhealing.avif",
  },
  {
    id: 'nirvana_rishikesh',
    title: 'Nirvana — Inner Journey Meditation & Healing',
    location: 'Tapovan, Rishikesh, Uttarakhand, India',
    duration: '4 days',
    priceFrom: '30000',
    // image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop',
    image: "/gallery/nirwana-meditation.avif",
  },
];

const Hero = () => {
  return (
    <section className="relative h-[320px] sm:h-[480px] md:h-[620px] w-full">
      <img
        src="/gallery/wellness-retreat.jpg"
        alt="Wellness Retreats"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 md:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Wellness <span className="text-[#fbbf24]">Retreats</span>
        </h1>
        <p className="mt-4 text-white/90 max-w-3xl">
          Recharge your mind and body with curated wellness experiences focused on relaxation, yoga, meditation, and holistic healing.
        </p>
      </div>
    </section>
  );
};

const RetreatCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_1px_0_rgba(16,24,40,0.05),0_1px_2px_rgba(16,24,40,0.10)] border border-gray-100 overflow-hidden">
      <div className="relative">
        <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
      </div>

      <div className="p-4 md:p-5">
        <h3 className="text-gray-900 font-semibold leading-snug">
          {item.title}
        </h3>

        <div className="mt-2 text-sm text-gray-500 space-y-1">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{item.duration}</span>
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4 text-gray-400" />
              <span>From ₹{item.priceFrom}</span>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Link
            to={`/packages/wellness/${item.id}`}
            className="inline-flex items-center px-4 py-2 rounded-md text-white bg-[#28bccf] hover:bg-[#22a5b6] transition"
          >
            View
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center px-4 py-2 rounded-md text-[#28bccf] bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-100"
          >
            Enquire
          </Link>
        </div>
      </div>
    </div>
  );
};

const RetreatsPackages = () => {
  // offset main content for fixed navbar
  return (
    <div className="">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {retreats.map((r) => (
            <RetreatCard key={r.id} item={r} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default RetreatsPackages;