import logo1 from '/logo/1.webp';
import logo2 from '/logo/2.webp';
import logo3 from '/logo/3.webp';
import logo4 from '/logo/4.webp';
import logo5 from '/logo/5.webp';
import logo6 from '/logo/6.webp';
import logo7 from '/logo/7.webp';
import logo8 from '/logo/8.webp';
import logo9 from '/logo/9.webp';
import logo10 from '/logo/10.webp';
import logo11 from '/logo/11.webp';
import logo12 from '/logo/12.webp';
import logo13 from '/logo/13.webp';

export default function TrustedBy() {
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11, logo12, logo13];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-8">
          <span
            style={{
              fontFamily: 'Lato',
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
              fontFamily: 'Lato',
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
              fontFamily: 'Lato',
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
              fontFamily: 'Lato',
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
                className="w-44 h-24 flex items-center justify-center flex-shrink-0"
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

