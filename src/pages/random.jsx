

import Hero from "../Components/HeroHome.jsx";
import TrustedBy from "../Components/TrustedBy.jsx";
import Why from "../Components/Why.jsx";
import Testimonial from "../Components/Testimonial.jsx";

import HomePageEvents from "./Events/HomePageEvents.jsx";
import Transform from "../Components/TransFormHome.jsx";
import PopularDestinations from "../Components/PopularDestinations.jsx";

export default function Randompage() {

  return (
    // prevent any page-level horizontal overflow (full-bleed children, transforms, etc.)
    <div className="min-h-screen pt-28 overflow-x-hidden">
     
      <Hero />
      <TrustedBy />
      <Why />
      <HomePageEvents />
      <Transform />
      <PopularDestinations />
      <Testimonial />
    
     
    </div>
  );
}

