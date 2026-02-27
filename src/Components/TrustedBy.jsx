import logo1 from '/mice/t1.png';
import logo2 from '/mice/t2.png';
import logo3 from '/mice/t3.png';
import logo4 from '/mice/t4.png';
import logo5 from '/mice/t1.png';
import logo6 from '/mice/t2.png';

export default function TrustedBy() {
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-8">
          <span
            style={{
              fontFamily: 'Cormorant Infant',
              fontWeight: 500,
              fontStyle: 'Italic',
              fontSize: '24px',
              lineHeight: '24px',
              letterSpacing: '-4%',
              textAlign: 'center',
              marginLeft: '4px',
              color: '#808D89',
            }}
          >
            Loved
          </span>
          <span
            style={{
              fontFamily: 'Archivo',
              fontWeight: 500,
              fontStyle: 'Medium',
              fontSize: '20px',
              lineHeight: '24px',
              letterSpacing: '-4%',
              textAlign: 'center',
              marginLeft: '4px',
              color: '#808D89',
            }}
          >
            by
          </span>
          <span
            style={{
              fontFamily: 'Cormorant Infant',
              fontWeight: 500,
              fontStyle: 'Italic',
              fontSize: '24px',
              lineHeight: '24px',
              letterSpacing: '-4%',
              textAlign: 'center',
              marginLeft: '4px',
              color: '#808D89',
            }}
          >
            Leading
          </span>
          <span
            style={{
              fontFamily: 'Archivo',
              fontWeight: 500,
              fontStyle: 'Medium',
              fontSize: '20px',
              lineHeight: '24px',
              letterSpacing: '-4%',
              textAlign: 'center',
              marginLeft: '4px',
              color: '#808D89',
            }}
          >
            Organizations
          </span>
        </h2>

        <div className="overflow-hidden relative">
          <div className="flex gap-8 animate-marquee">
            {logos.concat(logos).map((logo, index) => (
              <div
                key={index}
                className="w-32 h-16 flex items-center justify-center flex-shrink-0"
              >
                <img
                  src={logo}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}

