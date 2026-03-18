import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQAccordion = () => {
  const [openId, setOpenId] = useState(null)

  const faqs = [
    {
      id: 1,
      question: "What destinations do you offer?",
      answer: "We specialize in curated travel experiences to Oman, Seychelles, and Vietnam. Each destination offers unique wellness retreats, corporate experiences, and immersive cultural journeys tailored to your needs."
    },
    {
      id: 2,
      question: "How far in advance should I book?",
      answer: "We recommend booking 30-60 days in advance for most packages to secure the best accommodations and arrange necessary logistics. However, we can often accommodate last-minute requests depending on availability."
    },
    {
      id: 3,
      question: "What is included in your packages?",
      answer: "Our packages typically include accommodations, meals, airport transfers, guided tours, and curated activities. Specific inclusions vary by package. Detailed itineraries are provided upon inquiry."
    },
    {
      id: 4,
      question: "Do you offer customized packages?",
      answer: "Absolutely! We specialize in bespoke travel experiences. Whether it's a corporate retreat, wellness journey, or special celebration, our team can customize every detail to match your vision and budget."
    },
    {
      id: 5,
      question: "What is your cancellation policy?",
      answer: "Our cancellation policy varies by package and booking terms. Generally, cancellations made 30 days before departure receive a full refund. We encourage travel insurance for added protection."
    },
    {
      id: 6,
      question: "Do you provide visa assistance?",
      answer: "Yes, we offer visa guidance and can connect you with trusted partners for visa applications. While we don't process visas directly, our team ensures smooth travel documentation for all our guests."
    },
    {
      id: 7,
      question: "What is included in MICE services?",
      answer: "Our MICE (Meetings, Incentives, Conferences, Exhibitions) services cover venue selection, accommodation, transportation, team-building activities, and full event management for corporate groups."
    },
    {
      id: 8,
      question: "How do I get in touch with your team?",
      answer: "You can reach us via WhatsApp, email, or our live chat feature. Click the WhatsApp icon at the bottom-right to connect with our team members directly. We typically respond within minutes!"
    }
  ]

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4"
            style={{
              backgroundColor: "rgba(40, 188, 207, 0.10)",
              color: "#28bccf",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#28bccf" }}
            />
            Have Questions?
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about our services, packages, and travel experiences
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#28bccf] hover:shadow-md"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-left font-semibold text-gray-900 text-base sm:text-lg">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 ml-4">
                  {openId === faq.id ? (
                    <Minus
                      size={24}
                      className="text-[#28bccf] transition-transform duration-300"
                    />
                  ) : (
                    <Plus
                      size={24}
                      className="text-[#28bccf] transition-transform duration-300"
                    />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: openId === faq.id ? '500px' : '0',
                  opacity: openId === faq.id ? 1 : 0,
                }}
              >
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Didn't find what you're looking for?
          </p>
          <a
            href="#"
            className="inline-block px-8 py-3 bg-[#28bccf] text-white font-semibold rounded-lg hover:bg-[#1fa8b8] transition-all duration-300 hover:shadow-lg"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQAccordion
