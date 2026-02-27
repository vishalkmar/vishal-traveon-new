
import PreviewCardCarousel from "./shared/PreviewCardCarousel"
import { FaWhatsapp } from "react-icons/fa";

export default function PreviousEventsMice() {

      const whatsappUrl =
    "https://wa.me/9540111307?text=Hi! I'm interested in planning a MICE tour.";


     return(<>
     
     
     
           {/* Preview Events Section */}
           <section className="py-12 bg-white">
             <div className="max-w-6xl mx-auto px-[30px] py-[40px]">
               {/* Full-width horizontal preview row for Coursera */}
               
     
               <div className="text-center mb-8">
                 <h2 className="text-2xl sm:text-5xl font-bold text-gray-900">Previous <span className="text-[#0E8FA0] italic font-serif">Events</span> &  <span className="text-[#0E8FA0] italic font-serif">MICE</span></h2>
                 <p className="text-gray-600 my-3">Highlights & short previews from our recent events</p>
               </div>
     
     
     
     {/* this is the iccict long card */}
     <div className="mb-8">
                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                   <div className="grid grid-cols-1 md:grid-cols-2">
                     <div className="w-full">
                       <div className="h-56 md:h-72 w-full relative">
                         <PreviewCardCarousel
                           media={[
                             { type: "image", src: "/iccictimages/ic5.JPG", alt: "Coursera 1" },
                             { type: "image", src: "/iccictimages/ic1.jpg", alt: "Coursera 2" },
                             { type: "image", src: "/iccictimages/ic2.jpg", alt: "Coursera 3" },
                             { type: "image", src: "/iccictimages/ic3.jpg", alt: "Coursera 4" },
                             { type: "image", src: "/iccictimages/ic6.JPG", alt: "Coursera 5" },
                             { type: "image", src: "/iccictimages/ic4.jpg", alt: "Coursera 6" },
                           ]}
                           interval={2000}
                           showDots
                           className="w-full h-full"
                         />
                       </div>
                     </div>
                     <div className="p-6 md:p-8 flex flex-col justify-center">
                       <h3 className="text-2xl font-bold mb-2">ICCICT 2026</h3>
                       <p className="text-gray-600 mb-4">International Conference on Computational Intelligence and Computing Technologies & AI (ICCICT 2026) — uniting researchers, industry experts, and innovators.</p>
     
                       <div className="text-sm text-gray-500 mb-4 space-y-2">
                         <div className="flex items-center gap-3"><span>January 22–23, 2026</span></div>
                         <div className="flex items-center gap-3"><span>India International Centre, Lodhi Estate, New Delhi, India</span></div>
                       </div>
     
                       <div className="mt-4 flex items-center justify-between">
                         <a
                           href="/iccict"
                           className="inline-flex items-center gap-2 text-[#44B3C4] font-semibold hover:underline"
                         >
                           Learn more →
                         </a>
                          <a
                           href="https://iccict.org/index.html"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 text-gray-600 font-medium hover:text-[#44B3C4]"
                         >
                           Visit site ↗
                         </a>
                       </div>
     
                     </div>
                   </div>
                 </div>
               </div>
     {/* here is the iccict long card end */}
     
     
     <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                   <div className="grid grid-cols-1 md:grid-cols-2">
                     <div className="w-full">
                       <div className="h-56 md:h-72 w-full relative">
                         <PreviewCardCarousel
                           media={[
                             { type: "image", src: "/ibiea/17.jpg", alt: "Featured 1" },
                             { type: "image", src: "/ibiea/18.jpg", alt: "Featured 2" },
                             { type: "image", src: "/ibiea/19.jpg", alt: "Featured 3" },
                             { type: "image", src: "/ibiea/20.jpg", alt: "Featured 4" },
                             { type: "image", src: "/ibiea/21.jpg", alt: "Featured 5" },
                             { type: "image", src: "/ibiea/22.jpg", alt: "Featured 6" },
                             { type: "image", src: "/ibiea/23.jpg", alt: "Featured 7" },
     
     
                           ]}
                           interval={2000}
                           showDots
                           className="w-full h-full"
                         />
                       </div>
                     </div>
                     <div className="p-6 md:p-8 flex flex-col justify-center">
                       <h3 className="text-2xl font-bold mb-2">IBIEA 2025 Oman</h3>
                       <p className="text-gray-600 mb-4">IBIEA 2025 unfolded as a grand spectacle at Afrah Ballroom, Grand Hyatt Muscat—celebrating excellence across industries.</p>
     
                       <div className="text-sm text-gray-500 mb-4 space-y-2">
                         <div className="flex items-center gap-3"><span>May 29, 2025</span></div>
                         <div className="flex items-center gap-3"><span>Grand Hyatt Muscat, Oman</span></div>
                       </div>
     
                       <div className="mt-4 flex items-center justify-between">
                         {/* Left – Know more */}
                         <a
                           href="/ibiea"
                           className="inline-flex items-center gap-2 text-[#44B3C4] font-semibold hover:underline"
                         >
                           Know more →
                         </a>
     
                         {/* Right – Visit site */}
                         <a
                           href="https://ibiea.com"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 text-gray-600 font-medium hover:text-[#44B3C4]"
                         >
                           Visit site ↗
                         </a>
                       </div>
     
                     </div>
                   </div>
                 </div>
     
     
     
     
               <div className="flex flex-wrap justify-center gap-6">
                 {[
                   {
                     title: "Coursera Offsite",
                     description:
                       "A 2-day offsite conference for Coursera with complete end-to-end management, including accommodation, conference setup, meals, logistics, and hospitality, ensuring a seamless and productive experience.",
                     venue: "Lemon Tree Tarudhan Valley",
                     date: "17–18 November 2025",
                     learnMoreLink: "/coursera",
                     media: [
                       { type: "image", src: "/coursera/7.jpg", alt: "coursera offsite 1" },
                       { type: "image", src: "/coursera/8.jpg", alt: "coursera offsite 2" },
                       { type: "image", src: "/coursera/9.jpg", alt: "coursera offsite 3" },
                       { type: "image", src: "/coursera/10.jpg", alt: "coursera offsite 4" },
                       { type: "image", src: "/coursera/11.jpg", alt: "coursera offsite 5" },
                       { type: "image", src: "/coursera/12.jpg", alt: "coursera offsite 6" },
                     ],
                   }
                   ,
                   {
                     title: "Google Wellness Retreat",
                     description:
                       "A rejuvenating wellness retreat at Google, Gurgaon, featuring a 2-hour guided session focused on relaxation and holistic well-being, highlighted by a calming sound healing experience.",
                     venue: "Google Campus",
                     date: "16 September 2025",
                     learnMoreLink: "/google-offset",
                     media: [
                       { type: "image", src: "/google-wellness/13.jpg", alt: "google wellness 1" },
                       { type: "image", src: "/google-wellness/14.jpg", alt: "google wellness 2" },
                       { type: "image", src: "/google-wellness/15.jpg", alt: "google wellness 3" },
                       { type: "image", src: "/google-wellness/16.jpg", alt: "google wellness 4" },
                     ],
                   }
     
                 ].map((item) => (
                   <div key={item.title} className="bg-white rounded-2xl shadow-lg overflow-hidden w-full md:w-[48%]">
                     <div className="h-48 md:h-60 w-full relative">
                       <PreviewCardCarousel media={item.media} interval={1500} showDots className="w-full h-full" />
                     </div>
                     <div className="p-5">
                       <div className="text-lg font-semibold text-gray-900">{item.title}</div>
                       <div className="text-sm text-gray-600 mt-2">{item.description}</div>
                       <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                         <div className="flex items-center gap-2"> <span>{item.date}</span></div>
                         <div className="flex items-center gap-2"> <span>{item.venue}</span></div>
                       </div>
     
                       <div className="mt-4">
                         <a href={item.learnMoreLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#44B3C4] font-semibold">
                           Learn more&nbsp;→
                         </a>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
     
               {/* Full-width horizontal preview row */}
               <div className="mt-8">
               
     
     
     
                 {/* CTA: Plan Your MICE */}
                 <div className="mt-20 mb-20 text-center px-4">
                   {/* Title */}
                   <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                     Want to Be Start Planning Your MICE Tour?
                   </h2>
     
                   {/* Description */}
                   <p className="mt-3 text-sm md:text-base text-gray-600 max-w-xl mx-auto">
                     Let us help you create memorable MICE experiences tailored to your goals.
                   </p>
     
                   {/* Button */}
                   <div className="mt-6 flex justify-center">
                     <a
                       href={whatsappUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="bg-white text-[#44B3C4] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg inline-flex items-center gap-3 hover:scale-105 hover:shadow-xl"
                     >
                       <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
                       Plan Your MICE Now ?
                     </a>
                   </div>
                 </div>
     
               </div>
             </div>
           </section>


     </>)
}