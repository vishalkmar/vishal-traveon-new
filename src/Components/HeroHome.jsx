import LazyVideo from "./shared/LazyVideo.jsx";

export default function Hero({

  title = (
    <>
      <i>Retreats</i> that Renew,
      <br /> Teams that <i>Thrive</i>
    </>
  ),
  subtitle =
  "Immersive wellness, inspiring corporate offsites, community journeys, and MICE experiences—crafted by Retreats by Traveon.",
  ctaText = "Explore Packages",
  ctaHref = "/packages",
  overlay = 0.45,
  center = true,
  showBadge = true,
  titleOverride,
  subtitleOverride,
}) {
  return (
    <section className="relative pt-[200px]  min-h-[90svh] md:min-h-[98svh] lg:min-h-[86svh] overflow-hidden border-b-2 border-gray-300">
      {/* Video Background */}
      <LazyVideo
        src="/index2.mp4"
        className="absolute inset-0 w-full h-full object-cover -z-20"
        rootMargin="0px"
      />

      {/* Overlay */}
      {/* <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" style={{ opacity: overlay }} />
      </div> */}

      <div
        className={`relative z-10 mx-auto max-w-6xl px-4 sm:px-6 ${center ? "text-center" : ""
          }`}
      >
        <div className="pt-12 md:pt-24 lg:pt-36" />

      

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



        <div className="pb-20 md:pb-22 lg:pb-24" />
      </div>
    </section>
  );
}
