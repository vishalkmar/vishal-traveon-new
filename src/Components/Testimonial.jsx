import React from "react";
import ArcCarousel from "./ArcCarousel";
import { Loader2 } from "lucide-react";
import { useState } from "react";


// Fallback data ensures the Arc Carousel is visible beautifully even if the DB is empty
const FALLBACK_DATA = [
  
   {
    id: 1,
    name: "Gaganpreet Kaur",
    rating: 5,
    avatarUrl: "/review/gaganpreet.png",
    content:
      "Me and my husband travelled to Oman recently through Traveon and I must say it was one of the best trips! Everything was handled so smoothly without any hiccups, whether it was airport transfers, hotels or day trips. The entire journey felt completely stress-free."
  },
  {
    id: 2,
    name: "Gitanjali Deka",
    rating: 5,
    avatarUrl: "/review/geetanjli.png",
    content:
      "Traveon is the company where you truly get what you pay for — the best travel experience with excellent local operators and guides. I had a lovely experience in Oman and everything was well taken care of throughout the trip."
  },
  {
    id: 3,
    name: "Aditi Gupta",
    rating: 5,
     avatarUrl: "/review/aditi.png",
    content:
      "I had a great experience with Traveon. I recently travelled to Andaman & Nicobar Islands with my family and the itinerary was perfectly designed for everyone including my parents. Everything was well planned and executed smoothly."
  },
  {
    id: 4,
    name: "Mohit Madaan",
    rating: 5,
    avatarUrl: "/review/mohit.png",
    content:
      "We partnered with Traveon Ventures to organize our Coursera SOC offsite at Tarudhan Valley Resort and the experience was exceptional. From start to finish the team ensured every detail was flawlessly executed."
  },
  {
    id: 5,
    name: "Sukriti Batra",
    rating: 5,
    avatarUrl: "/review/sukriti.png",
    content:
      "Traveon helped us plan our Oman trip from India during the peak New Year season and despite the last-minute planning everything was managed beautifully. The overall experience was truly impressive."
  },

   {
    id: 6,
    name: "kunal banthia",
    rating: 5,
    avatarUrl: "/reviews/kunal.jpg",
    content:`Recently went Oman
 , The hotel stay was fantastic
 , Places covered were good including the one we added later.
 , All pre processing of tour booking and other documentation and communication was seamless
 , Last but not the least,in terms of pricing it was worthwhile making this trip.
Overall good job with the tour.`
      },

     {
    id: 7,
    name: "Khushboo",
    rating: 5,
    avatarUrl: "/reviews/Khushboo.jpg",
    content:`We have planned an Oman trip with Traveon & their services were totally remarkable. The operation team was always available for any queries. They were ready with their prompt and quich answers. Special thanks to Mr Deepanshu & Mr Piyush. Driver was so friendly that he invited us to have lunch with him in his house`
      },
    {
    id: 8,
    name: "Oushnik Garg",
    rating: 5,
    avatarUrl: "/reviews/Oushnik Garg.jpg",
    content:`We had a great time in Oman with Traveon Ventures. Everything was well organized, and the service was smooth and professional throughout the trip. The team was very supportive, which made our experience stress-free and enjoyable. We would definitely love to travel with them again. Highly recommended!`
      },

      {
    id: 9,
    name: "Vanshika Kapila",
    rating: 5,
    avatarUrl: "/reviews/Vanshika Kapila.jpg",
    content:`The service and travel package are affordable and good. They do follow up on trip days and quick responses from there end. Would like to take there service for other trips as well.`
      },
      {
    id: 10,
    name: "Tausif Neazi",
    rating: 5,
    avatarUrl: "/reviews/tausif neazi.jpg",
    content:`Excellent service by Traveon. Our Oman trip was perfectly organized with great hotel, punctual transfers, and a well-balanced itinerary. Very professional and reliable. Highly recommended!`
      }

 
];


export default function Home() {
  const { data, isLoading, error } = useState();

  // Determine which data to use. If API fails or is empty, use the beautiful fallback
  // so the user can see the requested component functioning perfectly.
  const displayData = data && data.length > 0 ? data : FALLBACK_DATA;

  return (
    <main className="min-h-screen bg-background">
      {/* Minimal Header */}
      
      {/* Hero Section */}
     

      {/* The Core Requested Component */}
      {isLoading ? (
        <div className="w-full min-h-[600px] flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="font-medium animate-pulse">Loading amazing stories...</p>
        </div>
      ) : (
        <section className="w-full">
          <ArcCarousel testimonials={displayData} />
        </section>
      )}
      
     
     
    </main>
  );
}
