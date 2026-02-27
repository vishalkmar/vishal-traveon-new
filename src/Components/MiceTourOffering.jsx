

 export default function MiceTourOffering() {

     const offerings = [
    {img: "/mice/team.avif", title: 'Team-Building Experiences', desc: 'Experiential programs focused on collaboration, problem solving, and trust-building.' },
    { img: "/mice/wellness.jpg", title: 'Wellness & Knowledge Sessions', desc: '' },
    { img: "/mice/stratagic.webp", title: 'Strategic Workshops & Knowledge Sessions', desc: '' },
    {img: "/mice/cultural.webp", title: 'Cultural & Experiential Activities', desc: '' },
  ];



       return(<>
       
       
<section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 style={{ marginBottom: 8, textAlign: 'center', whiteSpace: 'nowrap' }}>
            <span style={{
              fontFamily: 'Archivo, serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '40px',
              lineHeight: '42px',
              letterSpacing: '-4%',
              display: 'inline-block'
            }}>Our MICE&nbsp;</span>

            <span style={{
              fontFamily: 'Cormorant, serif',
              fontWeight: 600,
              fontStyle: 'italic',
              fontSize: '48px',
              lineHeight: '42px',
              letterSpacing: '-5%',
              textTransform: 'capitalize',
           
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: '#0E8FA0',
              display: 'inline-block'
            }}>Offerings</span>
          </h2>
          <p className="text-gray-700 my-5" style={{ fontFamily: 'Archivo, serif', fontWeight: 400, fontSize: 18, lineHeight: '24px', letterSpacing: '0%', textAlign: 'center' }}>
            Tailored programs that inspire growth, collaboration, and well-being for every organisation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 justify-center">
            {offerings.map((o, i) => (
              <div key={i} className="overflow-hidden shadow-md bg-white border border-gray-200 rounded-xl w-full">
                <div className="relative w-full h-64 md:h-80 lg:h-96">
                  <img src={o.img} alt={o.title} className="w-full h-full object-cover block" />

                  {/* bottom overlay: bold title + 1-2 line description */}
                  <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-left">
                    <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>{o.title}</div>
                    <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.95)', marginTop: 6 }}>{o.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
</section>



       </>)
 }
