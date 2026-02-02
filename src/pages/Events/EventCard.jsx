import PreviewCardCarousel from "../../components/shared/PreviewCardCarousel";

const previewEvents = [
  {
    title: "Coursera Offsite",
    description:
      "A 2-day offsite conference for Coursera with complete end-to-end management, including accommodation, conference setup, meals, logistics, and hospitality, ensuring a seamless and productive experience.",
    venue: "Lemon Tree Tarudhan Valley",
    date: "17–18 November 2025",
    learnMoreLink: "/coursera",
    media: [
      { type: "image", src: "/coursera/7.jpg", alt: "coursera offsite 1" },
      { type: "image", src: "/coursera/8.jpg", alt: "coursera offsite 2" },
      { type: "image", src: "/coursera/9.jpg", alt: "coursera offsite 3" },
      { type: "image", src: "/coursera/10.jpg", alt: "coursera offsite 4" },
      { type: "image", src: "/coursera/11.jpg", alt: "coursera offsite 5" },
      { type: "image", src: "/coursera/12.jpg", alt: "coursera offsite 6" },
    ],
  },
  {
    title: "Google Wellness Retreat",
    description:
      "A rejuvenating wellness retreat at Google, Gurgaon, featuring a 2-hour guided session focused on relaxation and holistic well-being, highlighted by a calming sound healing experience.",
    venue: "Google Campus",
    date: "16 September 2025",
    learnMoreLink: "/google-offset",
    media: [
      { type: "image", src: "/google-wellness/13.jpg", alt: "google wellness 1" },
      { type: "image", src: "/google-wellness/14.jpg", alt: "google wellness 2" },
      { type: "image", src: "/google-wellness/15.jpg", alt: "google wellness 3" },
      { type: "image", src: "/google-wellness/16.jpg", alt: "google wellness 4" },
    ],
  },
];

export default function PreviewEventsSection() {
  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Heading */}
     

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {previewEvents.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-lg overflow-hidden w-full md:w-[48%]"
          >
            <div className="h-48 md:h-60 w-full relative">
              <PreviewCardCarousel
                media={item.media}
                interval={1500}
                showDots
                className="w-full h-full"
              />
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                {item.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>{item.date}</span>
                <span>{item.venue}</span>
              </div>

              <div className="mt-4">
                <a
                  href={item.learnMoreLink}
                  className="inline-flex items-center gap-2 text-[#44B3C4] font-semibold"
                >
                  Learn more →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
