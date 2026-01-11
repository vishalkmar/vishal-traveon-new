import React from "react";

const Star = () => (
    <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-yellow-400 stroke-yellow-400"
        aria-hidden="true"
    >
        <path
            d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.98l-5.8 3.39 1.11-6.47-4.7-4.58 6.49-.94L12 2.5z"
            strokeWidth="0.5"
        />
    </svg>
);

const Testimonials = () => {
    const testimonials = [
        {
            name: "Aarav Mehta",
            role: "Chief Executive Officer",
            company: "TechNova Systems",
            img:
                "https://images.unsplash.com/photo-1742119971773-57e0131095b0?q=80&w=250&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            quote:
                "Traveon elevated our leadership summit end-to-end. Meticulous planning, seamless logistics, and a guest experience our partners still talk about.",
        },
        {
            name: "Priya Sharma",
            role: "Head of Operations",
            company: "Lotus Travel Collective",
            img:
                "https://images.unsplash.com/photo-1732888419806-9403823b5c34?q=80&w=250&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            quote:
                "From curation to execution, the team delivered with class. Their local know-how and vendor network saved us weeks.",
        },
        {
            name: "Rohan Iyer",
            role: "Director — Marketing",
            company: "Vista Foods Pvt. Ltd.",
            img:
                "https://images.unsplash.com/photo-1696871105725-1c040dad8d1a?q=80&w=250&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            quote:
                "We expanded our B2B pipeline across two markets thanks to their facilitation and immaculate event design. A+ coordination.",
        },
    ];

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center animate-on-scroll">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Clients Say
                    </h2>
                    <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6" />
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Here's what business leaders and travelers say about their{" "}
                        <b>Traveon Venture experience</b>
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-xl shadow-lg relative hover:shadow-xl transition-shadow"
                        >
                            <svg
                                className="text-[#28bccf] text-opacity-10 mb-4"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>

                            <div className="relative z-10">
                                <p className="text-gray-600 mb-6">{t.quote}</p>

                                <div className="flex items-center">
                                    {/* Avatar with image inside the circle */}
                                    <div className="mr-4">
                                        <img
                                            src={t.img}
                                            alt={`${t.name} portrait`}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#28bccf]/30"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-col flex-wrap">
                                            <h4 className="font-semibold text-gray-900">{t.name}</h4>
                                            {/* 5 filled stars */}
                                            <div className="flex items-center gap-0.5">
                                                <Star /><Star /><Star /><Star /><Star />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">
                                            {t.role}, {t.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Optional note for attribution if you need it in footer or credits */}
                {/* <p className="mt-8 text-center text-xs text-gray-400">
          Portraits served via Unsplash Source (keyword-filtered).
        </p> */}
            </div>
        </section>
    );
};

export default Testimonials;
