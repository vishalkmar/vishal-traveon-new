import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getApiV1Base } from '../utils/apiUrl.js'

const WA_SVG = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const WhatsappChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [flows, setFlows] = useState([])

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const res = await fetch(`${getApiV1Base()}/whatsapp-flows/active`)
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setFlows(data.data)
        }
      } catch {
        // API unavailable — show empty, no fallback
      }
    }
    fetchFlows()
  }, [])

  const handleWhatsAppClick = (phoneNumber, flowMessage) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(flowMessage)}`
    window.open(url, '_blank')
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-[#28bccf] text-white p-3 rounded-full shadow-lg hover:bg-[#1fa8b8] transition-all duration-300 cursor-pointer z-50 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <WA_SVG className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Widget */}
      <div
        className={`fixed right-4 bottom-20 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 transform transition-all duration-300 ease-out origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-[#28bccf] text-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <WA_SVG className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm">Start a Conversation</h3>
              <p className="text-xs text-white/80">Click one of our member below to chat on WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Members List — fixed max-height with scroll so widget stays compact */}
        <div className="p-4 max-h-72 overflow-y-auto">
          <p className="text-xs text-gray-500 mb-3">
            The team typically replies in a few minutes.
          </p>

          <div className="space-y-2">
            {flows.map((flow) => (
              <div
                key={flow.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border-l-4 border-[#28bccf]"
              >
                {/* Image */}
                {flow.imageData ? (
                  <img
                    src={flow.imageData}
                    alt={flow.title}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#28bccf]/20 flex items-center justify-center flex-shrink-0">
                    <WA_SVG className="w-5 h-5 text-[#28bccf]" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{flow.title}</h4>
                  <p className="text-xs text-gray-500">Available to chat</p>
                </div>

                {/* WhatsApp Button */}
                <button
                  onClick={() => handleWhatsAppClick(flow.phoneNumber, flow.flowMessage)}
                  className="flex-shrink-0 p-2 bg-[#28bccf] text-white rounded-full hover:bg-[#1fa8b8] transition-all duration-200 hover:scale-110"
                  aria-label={`Chat about ${flow.title}`}
                >
                  <WA_SVG className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default WhatsappChat
