export default function BussinessObjective() {

       return( <>
       
       <section
        className="w-full py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${"/mice/objective.png"})` }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-transparent max-w-2xl text-left text-white">
            <h3 className="mb-3 sm:mb-4" style={{ marginBottom: 12, whiteSpace: 'nowrap' }}>
              <span style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: '40px',
                lineHeight: '48px',
                letterSpacing: '-4%',
                color: '#ffffff',
                display: 'inline-block'
              }}>
                Business Objectives
              </span>

              <span style={{ width: 8, display: 'inline-block' }} />

              <span style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: '40px',
                lineHeight: '48px',
                letterSpacing: '-4%',
                color: '#ffffff',
                display: 'inline-block'
              }}>
                Immersive
              </span>

              <span style={{ width: 8, display: 'inline-block' }} />

              <span style={{
                background: 'linear-gradient(91.87deg, #00C5C5 0%, #009F26 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontFamily: 'Cormorant, serif',
                fontWeight: 600,
                fontStyle: 'italic',
                fontSize: '48px',
                lineHeight: '48px',
                letterSpacing: '-5%',
                textTransform: 'capitalize',
                display: 'inline-block'
              }}>
                Experiences
              </span>
            </h3>

            <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '24px', letterSpacing: '-2%', marginBottom: 16 }}>
At Retreats by Traveon, our MICE Tours are designed to combine business objectives with immersive travel experiences. We create programs that integrate corporate meetings, incentive trips, conferences, and team-building events with cultural exploration, wellness, and leisure—ensuring participants are engaged, motivated, and inspired.
            </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4 md:px-0">
              {[
                { img: "/mice/image.png", title: 'Tailored Programs', desc: 'Retreats that strengthen relationships, boost engagement, and enhance team performance with lasting results.' },
                { img: "/mice/image.png", title: 'Seamless Logistics', desc: 'Interactive facilitation grounded in research to meet your learning objectives.' },
                { img: "/mice/image.png", title: 'Immersive Well-being', desc: 'Wellness-focused activities that recharge participants and improve focus.' },
                { img: "/mice/image.png", title: 'Impactful Outcomes', desc: 'Clear goals and follow-up that translate retreat learnings into workplace impact.' },
              ].map((p, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-md">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base" style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700 }}>{p.title}</div>
                    <div className="text-xs md:text-sm" style={{ fontFamily: 'Archivo, serif', color: 'rgba(255,255,255,0.9)', marginTop: 6 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

       
       </>)
}