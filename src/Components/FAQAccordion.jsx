import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQAccordion = () => {
  const [openId, setOpenId] = useState(1);

  const faqs = [
    {
      id: 1,
      question: "What destinations do you offer?",
      answer:
        "We offer curated travel experiences to Oman, Seychelles, Vietnam, and selected custom international destinations for leisure, wellness, and corporate travel.",
    },
    {
      id: 2,
      question: "Do you provide customized packages?",
      answer:
        "Yes, we design personalized travel packages based on your budget, travel style, dates, and group requirements including family trips, corporate retreats, and wellness journeys.",
    },
    {
      id: 3,
      question: "What is included in your packages?",
      answer:
        "Package inclusions vary by destination, but usually include hotel stay, transfers, sightseeing, selected meals, and complete travel assistance from our team.",
    },
    {
      id: 4,
      question: "Do you assist with visa processing?",
      answer:
        "Yes, we provide visa guidance and documentation support for applicable destinations and help streamline the process for a smoother travel experience.",
    },
    {
      id: 5,
      question: "How early should I book my trip?",
      answer:
        "We recommend booking at least 3 to 6 weeks in advance for better pricing, hotel availability, and smooth travel planning, especially during peak seasons.",
    },
    {
      id: 6,
      question: "Can you arrange corporate retreats?",
      answer:
        "Yes, we specialize in corporate retreats, M.I.C.E. events, incentive travel, team outings, and wellness-based business experiences.",
    },
    {
      id: 7,
      question: "Do you provide airport transfers?",
      answer:
        "Yes, airport pickup and drop services are available in most of our packages. The exact transfer details depend on the selected destination and package type.",
    },
    {
      id: 8,
      question: "Can I book for a group or family?",
      answer:
        "Absolutely. We provide family packages, friends group tours, student groups, and corporate group arrangements with personalized pricing and support.",
    },
    {
      id: 9,
      question: "What is your cancellation policy?",
      answer:
        "Cancellation terms depend on the destination, airline, hotel, and supplier policies. Our team shares the applicable cancellation terms before booking confirmation.",
    },
    {
      id: 10,
      question: "Do you help with wellness retreats?",
      answer:
        "Yes, we curate wellness retreats including yoga, mindfulness, nature stays, healing experiences, and corporate wellness programs at selected destinations.",
    },
    {
      id: 11,
      question: "Can I modify my itinerary later?",
      answer:
        "In many cases yes, subject to availability and supplier terms. Our team always tries to accommodate changes wherever possible.",
    },
    {
      id: 12,
      question: "How can I contact your team?",
      answer:
        "You can contact us through the website contact form, WhatsApp, phone, or email. Our team will assist you with destination selection and package planning.",
    },
  ];

  const leftFaqs = faqs.slice(0, 6);
  const rightFaqs = faqs.slice(6, 12);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const FAQItem = ({ faq }) => {
    const isOpen = openId === faq.id;

    return (
      <div
        className={`rounded-2xl border bg-white/95 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
          isOpen
            ? "border-[#28bccf]/50 shadow-[0_14px_40px_rgba(40,188,207,0.16)]"
            : "border-white/60 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:border-[#28bccf]/30"
        }`}
      >
        <button
          onClick={() => toggleAccordion(faq.id)}
          className="w-full flex items-start justify-between gap-4 px-4 sm:px-5 py-4 sm:py-5 text-left"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isOpen
                  ? "bg-[#28bccf] text-white"
                  : "bg-[#28bccf]/10 text-[#159aac]"
              }`}
            >
              {String(faq.id).padStart(2, "0")}
            </div>

            <h3 className="text-[15px] sm:text-base font-semibold leading-6 text-slate-800">
              {faq.question}
            </h3>
          </div>

          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              isOpen
                ? "bg-[#28bccf] border-[#28bccf] text-white"
                : "bg-white border-slate-200 text-[#159aac]"
            }`}
          >
            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
          </div>
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
              <div className="ml-11 pr-2">
                <p className="text-sm sm:text-[15px] leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#f7fcfc] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[-80px] h-72 w-72 rounded-full bg-[#28bccf]/10 blur-3xl" />
        <div className="absolute bottom-10 right-[-80px] h-72 w-72 rounded-full bg-[#0f8b8d]/10 blur-3xl" />
      </div>

      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main heading */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <span className="inline-block rounded-full border border-[#28bccf]/20 bg-[#28bccf]/10 px-5 py-2 text-sm font-semibold tracking-[0.18em] text-[#159aac] uppercase">
            FAQs
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Desktop / larger tablets */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] gap-8 xl:gap-10 items-center">
          <div className="space-y-5">
            {leftFaqs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>

          <div className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <div className="w-[360px] h-[480px] xl:w-[390px] xl:h-[510px] rounded-full border-2 border-[#28bccf]/25 flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,139,141,0.10)]" />

              <div className="absolute w-[315px] h-[430px] xl:w-[345px] xl:h-[460px] rounded-full border-2 border-[#28bccf]/40 bg-white/90 backdrop-blur-md shadow-[0_18px_50px_rgba(40,188,207,0.18)] flex items-center justify-center px-8 py-8">
                <div className="text-center w-full max-w-[240px]">
                  <div className="inline-flex items-center justify-center rounded-full border border-[#28bccf]/20 bg-[#28bccf]/10 px-5 py-2 text-sm font-semibold text-[#159aac]">
                    FAQs
                  </div>

                  <h2 className="mt-4 text-[34px] font-bold leading-[1.15] text-slate-900">
                    Answers to your
                    <span className="block text-[#159aac]">
                      travel questions
                    </span>
                  </h2>

                  <p className="mt-4 text-[15px] leading-8 text-slate-600 max-w-[240px] mx-auto">
                    Find quick answers about bookings, destinations, packages,
                    visa support, and custom travel planning.
                  </p>

                  <div className="mt-5 pt-5 border-t border-slate-200/80">
                    <h3 className="text-[17px] font-semibold text-slate-900">
                      Still need help?
                    </h3>

                    <a
                      href="/contact"
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-[#28bccf] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1eaabd] hover:shadow-[0_12px_30px_rgba(40,188,207,0.28)]"
                    >
                      Contact Team
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {rightFaqs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>

        {/* Mobile / tablet below lg */}
        <div className="lg:hidden">
          <div className="space-y-5">
            {leftFaqs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>

          <div className="my-10 sm:my-12 flex justify-center">
            <div className="relative flex items-center justify-center">
              <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full border-2 border-[#28bccf]/25 bg-white/30 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,139,141,0.10)]" />

              <div className="absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full border-2 border-[#28bccf]/40 bg-white/95 backdrop-blur-md shadow-[0_18px_50px_rgba(40,188,207,0.18)] flex items-center justify-center px-5 py-5 sm:px-7 sm:py-7">
                <div className="text-center w-full max-w-[205px] sm:max-w-[230px] flex flex-col items-center">
                  <div className="inline-flex items-center justify-center rounded-full border border-[#28bccf]/20 bg-[#28bccf]/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#159aac]">
                    FAQs
                  </div>

                  <h2 className="mt-3 sm:mt-4 text-[20px] sm:text-[28px] font-bold leading-[1.16] text-slate-900">
                    Answers to your
                    <span className="block text-[#159aac]">
                      travel questions
                    </span>
                  </h2>

                  <p className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] leading-6 sm:leading-7 text-slate-600">
                    Find quick answers about bookings, destinations, packages,
                    visa support, and custom travel planning.
                  </p>

                  <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-200/80 w-full">
                    <h3 className="text-[15px] sm:text-[18px] font-semibold text-slate-900">
                      Still need help?
                    </h3>

                    <a
                      href="/contact"
                      className="mt-3 sm:mt-4 inline-flex items-center justify-center rounded-full bg-[#28bccf] px-5 sm:px-6 py-2.5 sm:py-3 text-[13px] sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1eaabd] hover:shadow-[0_12px_30px_rgba(40,188,207,0.28)]"
                    >
                      Contact Team
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {rightFaqs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;