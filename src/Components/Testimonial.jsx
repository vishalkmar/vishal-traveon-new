import React, { useEffect, useState } from "react";
import ArcCarousel from "./ArcCarousel";
import { Loader2 } from "lucide-react";
import { getApiV1Base } from "../utils/apiUrl.js";

function normalizeReview(review) {
  return {
    id: review.id,
    name: review.name,
    rating: review.rating ?? 5,
    avatarUrl: review.imageData || null,
    content: review.content || review.description || "",
  };
}

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${getApiV1Base()}/reviews/active`);
        const data = await res.json().catch(() => ({}));

        if (!cancelled && data.success && Array.isArray(data.data)) {
          setTestimonials(data.data.map(normalizeReview));
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        if (!cancelled) setTestimonials([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {isLoading ? (
        <div className="w-full min-h-[600px] flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="font-medium animate-pulse">Loading amazing stories...</p>
        </div>
      ) : (
        <section className="w-full">
          <ArcCarousel testimonials={testimonials} />
        </section>
      )}
    </main>
  );
}
