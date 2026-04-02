
import { ArrowRight } from "lucide-react";
export default function HomePageEvents(){

     return(<>
     
     <section id="our-events" className="py-20 bg-white">
             <div className="max-w-screen-xl mx-auto px-4">
               <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">M.I.C.E by <span className="text-[#28bccf]">Traveon</span></h2>
                 <div className="w-20 h-1 bg-[#28bccf] mx-auto mb-6"></div>
                 <p className="text-lg text-gray-700">
                   We craft memorable events, whether corporate conferences,
                   prestigious exhibitions, or special celebrations.
                 </p>
               </div>
     
               <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                 {[
                    {
                     title: "ICCICT 2026",
                     description: `International Conference on Computational Intelligence and Computing Technologies & AI (ICCICT 2026) — a leading platform uniting researchers, industry experts, and innovators.`,
                     image: "/iccictimages/ic2.jpg",
                     date: "22-23 JANUARY 2026",
                     href: "https://www.iccict.org/index.html",
                     // href: "/events/2",
                   },
     
                   {
     
                     title: "Coursera Offsite",
                     description: "We successfully organized a 2-day offsite conference for Coursera at Lemon Tree Tarudhan Valley, where all participants stayed at the venue throughout the event. Our team managed the complete end-to-end arrangements, including accommodation, conference setup, meals, logistics, and hospitality. Every detail was handled with care to ensure a seamless, comfortable, and productive experience for the Coursera team.",
                     image: "/coursera/12.jpg",
                     date: "17-18 NOVEMBER 2025",
                     link: "/coursera",
                     href: "/coursera"
                   },
                   {
     
                     title:"Google Wellness Retreat",
                     description: " We organized a rejuvenating wellness retreat at Google, Gurgaon, featuring a 2-hour guided session focused on relaxation and holistic well-being. The highlight of the retreat was a calming sound healing experience, helping participants unwind, reduce stress, and restore inner balance. The session created a peaceful atmosphere that left everyone feeling refreshed, recharged, and truly satisfied.",
                     image: "/google-wellness/13.jpg",
                     date: "16 SEPTEMBER 2025",
                     link: "/google-offset",
                     href: "/google-offset"
                   },
                   {
                     title: "IBIEA 2025",
                     description:
                       "IBIEA 2025 Oman: International Business Innovation and Excellence Awards (IBIEA 2025) unfolded as a grand spectacle at Afrah Ballroom, Grand Hyatt Muscat, Oman on 29th May 2025",
                     image: "/events_images/icms.png",
                     date: "29 May 2025",
                     href: "/ibiea",
                     // href: "/events/1",
                   },
     
                
                   {
                     title: "IBIEA 2.0",
                     description:
                       "The next edition of International Business Innovation and Excellence Awards (IBIEA 2.0) is set to take place in the exotic destination of exotic locations, with precise dates to be announced shortly.",
                     image: "/events_images/ibiea2.png",
                     date: "To be Announced",
                     href: "https://ibiea.com",
                     // href: "/events/3",
                   },
     
                   
                 ].map((event, index) => (
                   <div
                     key={index}
                     className="bg-gray-50 rounded-lg overflow-hidden shadow-md group flex flex-col h-full"
                   >
                     <div className="overflow-hidden h-96">
                       <img
                         src={event.image}
                         alt={event.title}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                     </div>
                     <div className="p-6 flex flex-col flex-grow justify-between">
                       <div>
                         <h3 className="text-xl font-bold text-[#28bccf] mb-3">
                           {event.title}
                         </h3>
                         <p className="text-gray-600 mb-4">{event.description}</p>
                         <p className="text-gray-600 mb-4 font-bold">{event.date}</p>
                       </div>
                       <a
                         href={event.href}
                         className="text-sm font-medium text-[#28bccf] hover:underline inline-flex items-center"
                       >
                         Learn more <ArrowRight size={14} className="ml-1" />
                       </a>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </section>

     
     </>)
}