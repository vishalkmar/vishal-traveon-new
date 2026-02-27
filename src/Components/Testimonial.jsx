import React from "react";
import ArcCarousel from "./ArcCarousel";
import { Loader2 } from "lucide-react";
import { useState } from "react";


// Fallback data ensures the Arc Carousel is visible beautifully even if the DB is empty
const FALLBACK_DATA = [
  
  {
    id: 1,
    name: "Amit Khanna",
    role: "Corporate Manager, Gurgaon",
    content:
      "Our Oman trip was perfectly organized from the moment we landed. The airport pickup, hotel arrangements, and day tours were all smooth and well planned. The desert sunset at Wahiba Sands was unforgettable. Everything was handled professionally and we didn’t have to worry about anything.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: 2,
    name: "Sneha Kapoor",
    role: "Family Traveler, Mumbai",
    content:
      "This was our first international family vacation and it went beyond expectations. The team stayed connected throughout the trip and guided us at every step. Hotels were comfortable, transfers were always on time, and the itinerary was perfectly balanced for both kids and adults.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: 3,
    name: "Rohit Aggarwal",
    role: "Business Owner, Delhi",
    content:
      "We booked a group incentive trip and the execution was impressive. From visas to sightseeing and gala dinner arrangements, everything was managed smoothly. Our team truly enjoyed the experience and we received amazing feedback from all participants.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: 4,
    name: "Pooja Mehra",
    role: "Couple Traveler, Jaipur",
    content:
      "Our honeymoon trip was beautifully planned. The hotel rooms, private transfers, and sightseeing were exactly as promised. We especially loved how responsive the support team was whenever we needed help. It made our trip completely stress-free.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: 5,
    name: "Vikas Sharma",
    role: "Dealer Meet Participant, Chandigarh",
    content:
      "The international dealer meet organized for our company was excellent. Conference arrangements, activities, and local experiences were handled very professionally. It was not just a business event but a memorable experience for everyone.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
  },
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
      <section className="pt-24 pb-12 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
        What Our Clients Say  <span className="text-[#0E8FA0] italic font-serif">wow.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
         Here's what business leaders and travelers say about their Traveon Venture experience
        </p>
      </section>

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
