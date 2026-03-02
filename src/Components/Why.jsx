
export default function Why() {
  const items = [
    { img: '/home/building.jpg', title: 'Blending Nature & Nurture', desc: 'Thoughtfully designed experiences that combine wellness, adventure, and reflection.' },
    { img: '/home/tailored.jpg', title: 'Tailored to Your Needs', desc: 'Customized corporate offsites, wellness escapes, and community journeys crafted for lasting impact.' },
    { img: '/home/airport.jpg', title: 'Care at Every Step', desc: 'Meaningful engagement with local cultures and communities.' },
    { img: '/home/business.jpg', title: 'Strengthening Bonds', desc: 'Guided practices to cultivate presence and clarity.' },
    { img: '/home/transform.jpg', title: 'Transforming Work & Life', desc: 'Responsible travel that supports local ecosystems.' },
    { img: '/home/driven.png', title: 'Driven by Purpose', desc: 'Holistic wellness activities tailored to your needs.' }
  ];

  return (
    <section className="relative w-full">
      {/* Top White Section with Heading */}
      

      {/* Teal Section with Stats/Stories */}
      <div style={{ background: 'linear-gradient(135deg, #0f8b8d 0%, #00C5C5 100%)' }} className="w-full py-16 md:py-24 relative">
        {/* Label */}
       

        {/* Main Title */}
        <h3 className="text-center text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
          Why Traveon?
        </h3>
         <p className="text-center text-white max-w-3xl mx-auto text-gray-600 text-lg md:text-xl leading-relaxed mb-12">
            Not just retreats, but transformative journeys that inspire growth and connection
          </p>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {items.map((it, i) => (
              <div
                key={i}
                className="group bg-white bg-opacity-95 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                  <img 
                    src={it.img} 
                    alt={it.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-7">
                  <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    {it.title}
                  </h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {it.desc}
                  </p>
                </div>

                {/* Accent Line */}
                {/* <div 
                  className="h-1 w-12"
                  style={{
                    background: 'linear-gradient(91.87deg, #0f8b8d 0%, #00C5C5 100%)',
                    margin: '0 24px'
                  }}
                /> */}
              </div>
            ))}
          </div>
        </div>

        {/* Wave SVG Border at Bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          style={{ height: '100px' }}
        >
          <path
            d="M0,50 Q360,0 720,50 T1440,50 L1440,120 L0,120 Z"
            fill="white"
            opacity="1"
          />
        </svg>
      </div>
    </section>
  );
}
