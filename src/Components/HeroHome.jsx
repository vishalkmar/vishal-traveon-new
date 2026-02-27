export default function Hero({
  badge = "🌿 Transforming Experiences Since 2020",
  title = (
    <>
      <i>Retreats</i> that Renew,
      <br /> Teams that <i>Thrive</i>
    </>
  ),
  subtitle =
    "Immersive wellness, inspiring corporate offsites, community journeys, and MICE experiences—crafted by Retreats by Traveon.",
  ctaText = "Explore Retreats",
  ctaHref = "#",
  overlay = 0.45,
  center = true,
  showBadge = true,
  titleOverride,
  subtitleOverride,
}) {
  return (
    <section className="relative mt-[-120px] pt-[200px]  min-h-[70svh] md:min-h-[78svh] lg:min-h-[86svh] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/index.mp4" type="video/mp4" />
        
      </video>

      {/* Overlay */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" style={{ opacity: overlay }} />
      </div>

      <div
        className={`relative z-10 mx-auto max-w-6xl px-4 sm:px-6 ${
          center ? "text-center" : ""
        }`}
      >
        <div className="pt-12 md:pt-24 lg:pt-36" />

        {showBadge && (
          <div className="inline-flex items-center">
            <div className="rounded-[30px] p-[2px] bg-gradient-to-r from-[#39C6D8] via-[#2FB8D3] to-[#23A8CC]">
              <div className="flex items-center gap-2 rounded-[28px] bg-[linear-gradient(90deg,#001F24_0%,#002B33_100%)] px-4 py-2 text-white/95">
                <span className="text-sm font-medium">{badge}</span>
              </div>
            </div>
          </div>
        )}

        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-serif text-white drop-shadow">
          {titleOverride ?? title}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base md:text-lg text-white/85">
          {subtitleOverride ?? subtitle}
        </p>

        <div className="mt-8 w-full px-4 sm:px-0">
          <a
            href={ctaHref}
            className="flex items-center justify-center w-full sm:w-[280px] h-[44px] sm:h-[48px] rounded-[12px] px-4 py-3 text-white text-[15px] sm:text-[16px] font-semibold shadow-[0_10px_22px_rgba(57,198,216,0.35)] ring-1 ring-white/10 bg-gradient-to-r from-[#39C6D8] via-[#2FB8D3] to-[#23A8CC] hover:brightness-110 transition-all duration-300 sm:mx-auto"
          >
            <span className="flex items-center justify-center gap-2">
              {ctaText} <span aria-hidden>➜</span>
            </span>
          </a>
        </div>

        {/* Scroll cue */}
        <div className="mt-6 flex justify-center">
          <svg
            width="15"
            height="100"
            viewBox="0 0 12 162"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.7931 1L5.7931 161M5.7931 1L12 1M5.7931 1L2.14577e-06 1M5.7931 161L12 161M5.7931 161L8.73992e-07 161"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className="pb-20 md:pb-22 lg:pb-24" />
      </div>

      {/* Curved separator */}
      <svg
        aria-hidden
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 w-full h-24 sm:h-32 md:h-36"
      >
        <path
          d="M0 96 C90 76 180 76 270 96 C360 116 450 116 540 96 C630 76 720 76 810 96 C900 116 990 116 1080 96 C1170 76 1260 76 1350 96 C1440 116 1440 96 1440 96 L1440 160 L0 160 Z"
          fill="#ffffff"
        />
      </svg>
    </section>
  );
}
