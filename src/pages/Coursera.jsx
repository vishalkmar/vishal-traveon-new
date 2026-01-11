
import CrossfadeCarousel from "../components/shared/CrossfadeCarousel" 

import { Link } from "react-router-dom";
export default function Coursera(){

     const whatsappUrl =
    "https://wa.me/9540111307?text=Hi! I'm interested in planning a MICE tour.";

      const bannerMedia  = [
    { type: "image", src: "/mice-tours/2.jpg" },
    { type: "image", src: "/mice-tours/3.jpg" },
    { type: "image", src: "/mice-tours/4.jpg" },
    { type: "image", src: "/mice-tours/1.jpg" },
  ];
     return(<>

             <div className="relative w-full h-[250px] sm:h-[400px] md:h-[500px]">
               <CrossfadeCarousel
                 media={bannerMedia}
                 alt="MICE Tours"
                 interval={2500}
                 showDots
                 priority
               />
             </div>

              <div className="bg-gray-100 py-16">
                                  <div className="max-w-screen-xl mx-auto px-4 text-center">
                                    <h2 className="text-3xl font-bold mb-4">Want to Be Part of Our Story?</h2>
                                    <p className="text-gray-600 mb-8">Let us help you create your own memorable experiences</p>
                                    <Link
                                      to={whatsappUrl}
                                      className="bg-[#28bccf] text-white px-8 py-3 rounded-full hover:bg-[#22a8b9] transition-colors inline-block"
                                    >
                                      Get in Touch
                                    </Link>
                                  </div>
             </div>
     </>)
}

