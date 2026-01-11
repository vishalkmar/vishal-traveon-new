import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";

const hero = {
  title: "Nirvana — Inner Journey Meditation & Healing",
  location: "Tapovan, Rishikesh, Uttarakhand, India",
  days: "4 Days",
  priceFrom: "30,000",
  image: "/gallery/nirwana-meditation.avif",
  tags: ["Wellness", "Featured"],
};

const about =
  "A 4-day retreat in Rishikesh led by Anant Gogia, blending yoga, sound healing, Mystic Rose meditation, and sacred Himalayan rituals.";

const highlights = [
  "Yoga & Pranayama in nature",
  "Mystic Rose meditation",
  "Sound healing sessions",
  "Village trek & picnic",
  "Ganga Aarti at Rishikesh",
  "Bonfire storytelling nights",
];

const focusAreas = [
  "Meditation",
  "Theta Healing",
  "Sound Therapy",
  "spiritual growth",
];

const schedule = [
  {
    dayNumber: 1,
    title: "Arrival & Grounding - Awaken",
    tags: ["Dinner"],
    items: [
      "12:00-2:00 PM: Arrival & Check-in with herbal welcome drink",
      "2:30-4:00 PM: Grounding Yoga + Breath Awareness Flow",
      "4:30-5:30 PM: Tea Break + Intention Setting Circle",
      "6:00-7:00 PM: Sound Healing Journey (Gong + Singing Bowls)",
      "7:30-9:00 PM: Sattvic Dinner.",
    ],
  },
  {
    dayNumber: 2,
    title: "Energy Alignment - Heal",
    tags: ["Breakfast", "Lunch", "Dinner"],
    items: [
      "6:30-7:30 AM: Shatkriya (Jal Neti & Basti) + Pranayama + Yoga Flow",
      "8:00-9:00 AM: Conscious Breakfast",
      "10:00-11:30 AM: Nature Walk / Forest Bathing",
      "12:30-1:30 PM: Ayurvedic Lunch",
      "2:00-3:00 PM: Chakra & Energy Anatomy Workshop",
      "3:00-4:00 PM: Tea Break + Self-Reflection",
      "4:00-5:15 PM: Ananta Prana Sadhana",
      "5:15-5:45 PM: Silent Sitting + Soundscape",
      "6:00-6:30 PM: Ganga Aarti",
      "7:00-8:30 PM: Dinner + Optional Sharing Circle.",
    ],
  },
  {
    dayNumber: 3,
    title: "Expansion - Evolve",
    tags: ["Breakfast", "Lunch", "Dinner"],
    items: [
      "6:30-7:30 AM: Shatkriya (Kapalbhati + Agnisar) + Tratak Meditation + Light Yoga",
      "8:00-9:00 AM: Breakfast",
      "9:30-12:30 PM: Optional Reiki Level 1 Attunement or Ganga dip / Self-time",
      "1:00-2:00 PM: Lunch",
      "3:00-4:00 PM: Cyclic Meditation",
      "4:30-6:00 PM: Sankalpa & Vision Board Creation",
      "6:30-7:30 PM: Agni Hotra Fire Ceremony",
      "8:00 PM: Closing Celebration Dinner with live music.",
    ],
  },
  {
    dayNumber: 4,
    title: "Integration & Farewell",
    tags: ["Breakfast"],
    items: [
      "6:30-7:30 AM: Shatkriya (Nauli Demonstration) + Closing Meditation & Sharing Circle",
      "8:00-9:00 AM: Breakfast",
      "10:00 AM: Check-out + Farewell Gift Pack.",
    ],
  },
];

const includes = [
  "Nature-facing rooms",
  "Sattvic meals",
  "Group activities",
  "Forest walks",
];

const whatsIncluded = [
  "3 nights stay",
  "All meals",
  "Daily yoga & meditation",
  "2 sound healing sessions",
  "Sunrise temple trip",
  "Village trek & Ganga Aarti",
];

const notIncluded = ["Flights", "Personal therapies"];

const trainers = [
  {
    name: "Anant Gogia",
    bio: "Certified Theta Meditation Instructor, Past Life Regression Therapist, Sound Healer, Tarot & Astrology teacher.",
    avatar: "/anant.webp",
    tags: [
      "Theta Meditation",
      "Past Life Regression",
      "Tarot & Astrology",
      "Sound Healing",
    ],
  },
];

const RightSidebar = () => {
  return (
    <aside className="w-full lg:w-[560px] shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="text-3xl font-bold text-gray-900 text-center">
          ₹30,000
        </div>
        <div className="text-center text-sm text-gray-500">Starting from</div>
        <div className="mt-1 text-center text-xs text-gray-400">
          Inclusive of - meals, accommodation, activities
        </div>

        <div className="mt-5 rounded-lg border border-gray-200">
          <div className="px-4 py-3 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-700">
            Choose Your Option
          </div>
          <div className="p-4 space-y-3">
            <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-800">
                  Double Occupancy
                </div>
                <div className="font-bold text-gray-900">₹50,000</div>
              </div>
              <div className="text-xs text-emerald-700 mt-1">
                Share with a companion
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-700">
                  Single Occupancy
                </div>
                <div className="font-semibold text-gray-900">₹30,000</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Private room</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium text-gray-800 mb-2">
            What’s included:
          </div>
          <ul className="space-y-2">
            {includes.map((i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 space-y-3">
          <Link
            to="https://wa.me/9540111307?text=Hi! I'm interested to book a package."
            target="_blank"
            className="w-full inline-flex justify-center items-center h-11 rounded-md text-white bg-[#28bccf] hover:bg-[#22a5b6] font-medium transition"
          >
            Book Now
          </Link>
          <Link
            to="mailto:info@traveon.in?subject=Quote%20Request&body=Hello,%20I%20would%20like%20to%20request%20a%20quote."
            target="_blank"
            className="w-full inline-flex justify-center items-center h-11 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium transition"
          >
            Request Quote
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="text-sm font-medium text-gray-800">Available Dates</div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <div className="text-sm text-gray-700">
            Dates to be announced soon
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
            Inquire for Dates
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="text-sm font-medium text-gray-800 mb-3">
          Conducted by
        </div>
        <div className="flex items-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png"
            alt="Instructor"
            className="h-10 w-10 rounded-full"
          />
          <div className="text-sm text-gray-700">Anant Gogia</div>
        </div>
      </div>

      <div className="bg-[#f3f8ff] rounded-xl border border-blue-100 p-4">
        <div className="text-sm font-medium text-gray-800 mb-3">Need Help?</div>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-500" />
            <span>+91 9540111207 / +91 9540111307</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            <span>info@traveon.in</span>
          </div>
        </div>
        <button className="mt-4 w-full inline-flex justify-center items-center h-10 rounded-md bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition">
          Chat with us
        </button>
      </div>
    </aside>
  );
};

const RetreatsPackageDetails4 = () => {
  return (
    <div className="">
      {/* HERO */}
      <section className="relative h-[360px] md:h-[620px]">
        <img
          src={hero.image}
          alt={hero.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 md:px-8 flex flex-col justify-end pb-10">
          <div className="flex gap-2 mb-3">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {hero.tags[0]}
            </span>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
              {hero.tags[1]}
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold max-w-4xl">
            {hero.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/90">
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">{hero.location}</span>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">{hero.days}</span>
            </span>
            <span className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              <span className="text-sm">From ₹{hero.priceFrom}</span>
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT */}
          <div className="flex-1 min-w-0">
            {/* About */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                About This Experience
              </h2>
              <p className="mt-3 text-gray-700">{about}</p>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">Highlights</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">Focus Areas</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {focusAreas.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1.5 rounded-full text-sm bg-gray-50 border border-gray-200 text-gray-700"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Daily Schedule */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900">
                Daily Schedule
              </h3>
              <div className="mt-5 space-y-5">
                {schedule.map((d) => (
                  <div
                    key={d.dayNumber}
                    className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                      <div className="h-7 w-7 rounded-full bg-[#28bccf] text-white text-sm font-semibold flex items-center justify-center">
                        {d.dayNumber}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {d.title}
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        {d.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ul className="p-4 text-sm text-gray-700 space-y-2">
                      {d.items.map((it, idx) => (
                        <li key={idx}>• {it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Trainers */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">
                Meet Your Trainers
              </h3>
              <div className="mt-4 space-y-4">
                {trainers.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-xl border border-gray-200 p-5 flex gap-4 items-start bg-white"
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {t.name}
                      </div>
                      <p className="mt-1 text-gray-700">{t.bio}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Included / Not Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="h-5 w-5" />
                  What’s Included
                </div>
                <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                  {whatsIncluded.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                <div className="flex items-center gap-2 text-rose-800 font-semibold">
                  <AlertCircle className="h-5 w-5" />
                  What’s Not Included
                </div>
                <ul className="mt-3 space-y-2 text-sm text-rose-900">
                  {notIncluded.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Testimonials (compact) */}
            {/* <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-900 text-center">
                What Our Travelers Say
              </h3>
              <p className="text-center text-gray-600 mt-1">
                Real experiences from real people who have traveled with us
              </p>
              <div className="mt-6 max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <MessageSquare className="h-6 w-6 text-[#28bccf]" />
                <div className="mt-3 text-gray-800">
                  "The Himalayan retreat experience was incredible. The
                  combination of yoga, meditation, and sound healing in the
                  mountains created a perfect environment for self-discovery and
                  inner peace."
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src="/arun.jpg"
                    alt="Reviewer"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Arun Jain
                    </div>
                    <div className="text-xs text-gray-500">Pune, India</div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* RIGHT */}
          <RightSidebar />
        </div>
      </section>
    </div>
  );
};

export default RetreatsPackageDetails4;
