import LazyVideo from "./shared/LazyVideo.jsx";

const HERO_CLOUDINARY_BASE = "https://res.cloudinary.com/dk0docnhx/video/upload";
const HERO_PUBLIC_ID = "wwbsite_video_4k_h76brc";
const HERO_POSTER = `${HERO_CLOUDINARY_BASE}/so_1,f_auto,q_auto:eco,w_1280/${HERO_PUBLIC_ID}.jpg`;

/**
 * The hero is a muted, decorative loop, so we ask the CDN for the smallest
 * rendition that still fills the viewport. `<source media>` is ignored by
 * browsers inside <video>, so the choice is made here, once, at mount.
 *
 *   phones   ~0.7 MB   |   laptops ~1.7 MB   |   large screens ~2.9 MB
 *
 * The source is 4K, so the largest tier is capped at w_1920 — uncapped it
 * delivers the full 8.7 MB master, which no viewport needs.
 */
function heroVideoUrl() {
  const w = typeof window === "undefined" ? 1920 : window.innerWidth * (window.devicePixelRatio || 1);
  const rendition = w <= 900 ? ",w_768" : w <= 1500 ? ",w_1280" : ",w_1920";
  return `${HERO_CLOUDINARY_BASE}/f_auto,q_auto:eco,ac_none${rendition}/${HERO_PUBLIC_ID}.mp4`;
}

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
      {/* Video Background.
          Served from Cloudinary's CDN rather than the raw S3 object: the S3
          bucket is in ap-southeast-2 with no CDN in front, which is what made
          this take 10-15s. f_auto/q_auto:eco lets the CDN pick the codec and
          bitrate per browser, ac_none drops the audio track we never play,
          and the poster paints instantly so the hero is never blank. */}
      <LazyVideo
        src={heroVideoUrl()}
        poster={HERO_POSTER}
        className="absolute inset-0 w-full h-full object-cover -z-20"
        autoPlay
        eager
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
