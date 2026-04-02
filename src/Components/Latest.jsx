
export default function Latest() {
  // pick four distinct program images explicitly
  const pics = ['/about/m.jpeg', '/about/m.jpeg', '/about/m.jpeg', '/about/m.jpeg'];

  return (
    <section style={{ background: '#DBF3E0', position: 'relative', zIndex: 10 }} className="py-12">
      <div className="max-w-7xl mx-auto px-8">
        <h3 className="text-center mb-3">
          <span
            style={{
              fontFamily: 'Lato, sans-serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '40px',
              lineHeight: '48px',
              letterSpacing: '-3%',
              textAlign: 'center',
              textTransform: 'none',
              display: 'inline-block'
            }}
          >
            Latest from
          </span>
          <span
            style={{
              marginLeft: 6,
              fontFamily: 'Lato, sans-serif',
              fontWeight: 600,
              fontStyle: 'italic',
              fontSize: '48px',
              lineHeight: '48px',
              letterSpacing: '-4%',
              textAlign: 'center',
              textTransform: 'capitalize',
              display: 'inline-block',
              background: 'linear-gradient(91.87deg, #00C5C5 0%, #009F26 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Traveon
          </span>
        </h3>

        <p className="text-center max-w-2xl mx-auto text-gray-700 mb-8">Stories, events, and highlights from our community</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {pics.map((src, i) => (
            <div
              key={i}
              className="bg-[#DBF3E0] rounded-[12px] shadow-sm mx-auto w-full"
              style={{ maxWidth: 640, height: 360, padding: 16, boxSizing: 'border-box' }}
            >
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={src} alt={`latest-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
