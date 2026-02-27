

export default function OurApproachMice(){

      const approachSteps = [
    {
      title: 'Consultation & Planning',
      description: 'Understand your goals, team dynamics, and desired outcomes',
      img: "/mice/planing.png",
    },
    {
      title: 'Customized Itinerary',
      description: 'Curate workshops, activities, wellness sessions, and',
      img: "/mice/itenary.png",
    },
    {
      title: 'Execution & Support',
      description: 'Professional on-ground management and seamless',
      img: "/mice/support.png",
    },
    {
      title: 'Evaluation & Feedback',
      description: 'Measure impact and ensure lasting benefits for your team',
      img: "/mice/feedback.avif",
    },
  ];

     return(<>
     
     <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 style={{ marginBottom: 8, textAlign: 'center' }}>
            <span style={{
              fontFamily: 'Archivo, serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '40px',
              lineHeight: '42px',
              letterSpacing: '-4%',
              display: 'inline-block'
            }}>Our&nbsp;</span>

            <span style={{
              fontFamily: 'Cormorant, serif',
              fontWeight: 600,
              fontStyle: 'italic',
              fontSize: '48px',
              lineHeight: '42px',
              letterSpacing: '-5%',
             
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: '#0E8FA0',
              display: 'inline-block'
            }}>Approach</span>
          </h2>

          <p className="text-gray-700 mb-12" style={{ fontFamily: 'Archivo, serif', fontWeight: 400, fontSize: 18, lineHeight: '24px', letterSpacing: '0%', textAlign: 'center' }}>
            A systematic process ensuring every retreat delivers maximum impact
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-center">
            {approachSteps.map((step, i) => {
              const isTop = i % 2 === 1; // 2nd and 4th cards have content at top
              return (
                <div
                  key={i}
                  className="overflow-hidden border border-gray-200 shadow-lg"
                  style={{ borderRadius: 16, background: 'transparent' }}
                >
                  <div className="relative w-full h-full aspect-[3/4]">
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover block" />

                    {/* Top or Bottom content overlay — use light semi-transparent gradient so text is black (no white band). */}
                    {isTop ? (
                      <div className="absolute left-0 right-0 top-0 p-5 pb-16 bg-gradient-to-b from-white/90 via-white/70 to-transparent text-left">
                        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: 18, color: '#0b0b0b', margin: 0 }}>
                          {step.title}
                        </p>
                        <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14, color: 'rgba(0,0,0,0.85)', marginTop: 4, lineHeight: '20px' }}>
                          {step.description}
                        </p>
                      </div>
                    ) : (
                      <div className="absolute left-0 right-0 bottom-0 p-5 pt-16 bg-gradient-to-t from-white/90 via-white/70 to-transparent text-left">
                        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: 18, color: '#0b0b0b', margin: 0 }}>
                          {step.title}
                        </p>
                        <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14, color: 'rgba(0,0,0,0.85)', marginTop: 4, lineHeight: '20px' }}>
                          {step.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

     </>)
}