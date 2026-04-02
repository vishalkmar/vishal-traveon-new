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
  title: "2 Hrs Onsite Sound Healing Workshop for Corporates",
  location: "Delhi, Gurgaon, Noida, Faridabad, India",
  days: "2 hours",
  priceFrom: "3,000",
  image: "/gallery/nirwana-soundhealing.avif",
  tags: ["Wellness", "Featured"],
};

const about =
  "A 2-hour onsite Sound Healing corporate wellness workshop designed to reduce stress, reset the nervous system, and elevate team well-being through powerful vibrational therapy.";

const highlights = [
  "Happier, more motivated employees",
  "Stronger team bonding and improved workplace culture",
  "Increased concentration and energy at work",
  "Help to improve commitment towards its people and clients",
  "Onsite convenience at your office location",
];

const focusAreas = [
  "corporate wellness",
  "stress reduction",
  "team building",
  "sound therapy",
  "workplace wellbeing",
];

const schedule = [
  {
    dayNumber: 1,
    title: "Sound Healing Workshop",
    tags: [],
    items: [
      "2-hour onsite session including 15-minute knowledge session",
      "Sound Bath Therapy",
      "Deep cleansing meditation",
      "Vibrational healing experience.",
    ],
  },
];

const includes = [
  "Onsite session at your office",
  "All sound healing instruments",
  "Expert facilitators",
  "Group wellness activity",
];

const whatsIncluded = [
  "15 Min knowledge session",
  "Sound Bath Therapy",
  "Deep Cleansing meditation",
  "All equipment and materials",
  "Expert facilitation by certified trainers",
];

const notIncluded = [
  "Venue arrangement",
  "Travel beyond service areas",
  "Additional customization fees",
];

const trainers = [
  {
    name: "Anant Gogia",
    bio: "Certified Theta Meditation Instructor, Past Life Regression Therapist, Sound Healer, Tarot & Astrology teacher.",
    avatar: "/anant.webp",
    tags: [
      "Theta Meditation",
      "Sound Healing",
      "Corporate Wellness",
      "Stress Management",
    ],
  },
  {
    name: "Arunanand Saraswati",
    bio: "Spiritual practitioner, energy healer, Reiki Grand Master, Lama Fera practitioner, and author of 'Transform Lives with Energy Healing'.",
    avatar: "/trainer1.jpg",
    tags: [
      "Energy Healing",
      "Sound Therapy",
      "Corporate Retreats",
      "Team Wellness",
    ],
  },
];

const RightSidebar = () => {
  return (
    <aside className="w-full lg:w-[560px] shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="text-3xl font-bold text-gray-900 text-center">
          ₹3,000
        </div>
        <div className="text-center text-sm text-gray-500">per person</div>
        <div className="mt-1 text-center text-xs text-gray-400">
          Inclusive of - Onsite session at your office
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
          <div className="text-sm text-gray-700">Retreats by Traveon</div>
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

const RetreatsPackageDetails3 = () => {
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
          {/* subtle dots */}
          <div className="mt-3 flex gap-2">
            <span className="h-1.5 w-6 bg-white/80 rounded-full" />
            <span className="h-1.5 w-1.5 bg-white/40 rounded-full" />
            <span className="h-1.5 w-1.5 bg-white/40 rounded-full" />
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
            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-900 text-center">
                What Our Corporate Clients Say
              </h3>
              <p className="text-center text-gray-600 mt-1">
                Real experiences from companies that have transformed their
                workplace wellness
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                  <MessageSquare className="h-6 w-6 text-[#28bccf]" />
                  <div className="mt-3 text-gray-800">
                    "The session was absolutely amazing. I had a great time
                    experiencing the vibrations. I felt it all over my body.
                    Even though it was midday on a workday, this helped me
                    unwind for thirty minutes. I'm really grateful!"
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"
                      alt="Reviewer"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Lokesh
                      </div>
                      <div className="text-xs text-gray-500">
                        Gurgaon, Google
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                  <MessageSquare className="h-6 w-6 text-[#28bccf]" />
                  <div className="mt-3 text-gray-800">
                    "Our corporate team came back energized and more
                    collaborative than ever. The leadership workshops and
                    team-building activities were perfectly designed for our
                    goals."
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
                      alt="Reviewer"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Jigyasa Saxena
                      </div>
                      <div className="text-xs text-gray-500">
                        Gurgaon, Google
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <RightSidebar />
        </div>
      </section>
    </div>
  );
};

export default RetreatsPackageDetails3;
