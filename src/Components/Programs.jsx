import { images } from '../config/images';

export default function Programs() {
  const programs = [
    {
      image: images.programs[0],
      title: 'Wellness Retreats',
      description: 'Rejuvenate your mind, body, and spirit with curated wellness experiences'
    },
    {
      image: images.programs[1],
      title: 'Corporate Retreats',
      description: 'Build stronger teams and drive innovation through transformative offsites'
    },
    {
      image: images.programs[2],
      title: 'Community Tours',
      description: 'Connect with local cultures and communities through meaningful travel'
    }
  ];

  return (
    <section className="relative py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Experience the{' '}
            <span
              className="inline-block text-4xl sm:text-5xl md:text-[48px] leading-tight"
              style={{
                fontFamily: 'Cormorant, serif',
                fontWeight: 600,
                fontStyle: 'italic',
                background: 'linear-gradient(91.87deg, #00C5C5 0%, #009F26 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.04em',
                textTransform: 'capitalize'
              }}
            >
              Transformation
            </span>
          </h2>

          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">Whether seeking personal renewal, team growth, cultural connection, or business excellence, we create experiences that leave lasting impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="w-full h-56 md:h-[300px] border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative"
            >
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover"
              />

              {/* overlay text at bottom */}
              <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white text-lg md:text-xl font-bold">{program.title}</h3>
                <p className="text-white text-sm md:text-sm opacity-90">{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* curved divider into next section */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1 }}>
        <svg viewBox="0 0 1440 120" width="100%" height="80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C360,20 1080,20 1440,80 L1440,120 L0,120 Z" fill="#DBF3E0" />
        </svg>
      </div>
    </section>
  );
}
