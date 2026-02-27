// // api.js
// export async function fetchPackageById(id) {
//   // TODO: replace with real API call
//   // const res = await fetch(`/api/packages/${id}`);
//   // return await res.json();

//   await new Promise((r) => setTimeout(r, 400));

//   return {
//     id,
//     title: "Splendid Europe Winter 14N/15D",
//     rating: 4.6,
//     reviewsLabel: "(1.7k)",
//     nightsDays: "14 Nights 15 Days",
//     routeLine:
//       "London (2N) → Paris (2N) → Eindhoven (2N) → Germany (1N) → Central Switzerland (3N) → Innsbruck (1N) → Rovigo (1N) → Arezzo (2N)",
//     tag: "Group Tour",

//     gallery: {
//       hero:
//         "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
//       thumbs: [
//         "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=900&q=80",
//         "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=900&q=80",
//         "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80",
//         "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
//       ],
//     },

//     pricing: {
//       oldPrice: "₹4 82 925",
//       price: "₹4 40 925",
//       note: "Starting price per adult",
//       points: "Earn 4409 Holiday Reward points on this booking",
//     },

//     // icon row / sub-tabs data
//     inclusions: [
//       { 
//         key: "hotel", 
//         label: "Hotel",
//         details: "['3 Star Hotel', '4 Star Hotel', '5 Star Hotel']"
//       },
//       { 
//         key: "meals", 
//         label: "Meals",
//         details: "['Breakfast', 'Lunch', 'Dinner']"
//       },
//       { 
//         key: "flights", 
//         label: "Flights",
//         details: "['Return economy class group airfare as per the itinerary.', 'Airfare not included for joining direct passengers.']"
//       },
//       { 
//         key: "sightseeing", 
//         label: "Sightseeing",
//         details: "['London: Guided tour + Madame Tussauds + London Eye', 'Paris: City tour + Eiffel Tower + Versailles', 'Belgium: Orientation tour + Atomium']"
//       },
//       { 
//         key: "transfer", 
//         label: "Transfer",
//         details: "['Airport to hotel transfers', 'Hotel to airport transfers', 'All inter-city tour transfers included']"
//       },
//       { 
//         key: "visa", 
//         label: "Visa",
//         details: "['Multiple entry Schengen visa', 'UK visa', 'All visa documentation and processing included']"
//       },
//     ],

//     itinerary: [
//       {
//         day: 1,
//         title: "Welcome to London!",
//         image:
//           "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
//         bullets: [
//           "Meet Tour Manager / Local Representative at airport.",
//           "Proceed to hotel and check-in.",
//           "Overnight in London (LHR Area), UK.",
//         ],
//         note:
//           "Standard check-in time is 15:00 hrs. Dinner may be packed for late arrivals (subject to operations).",
//       },
//       {
//         day: 2,
//         title:
//           "Guided city tour of London – Madame Tussauds – Ride on London Eye",
//         bullets: ["Breakfast at hotel.", "Full day sightseeing as per itinerary."],
//       },
//       {
//         day: 3,
//         title:
//           "Eurostar to Paris – Guided tour – Versailles Palace",
//         bullets: ["Transfer to station.", "Paris city tour + attractions."],
//       },
//     ],

//     // Tabs
//     packageDetails: {
//       flights: [
//         "Return economy class group airfare as per the itinerary.",
//         "Airfare not included for joining direct passengers.",
//       ],
//       transfer: [
//         "All transfers & excursions with entrance fees (as specified) by deluxe AC coach.",
//       ],
//       visa: [
//         "Multiple entry Schengen & UK visa (as applicable).",
//         "Cost includes documentation, processing and consulate fees.",
//       ],
//       sightseeing: [
//         "LONDON: Guided tour + Madame Tussauds + London Eye.",
//         "PARIS: City tour + Eiffel Tower (3rd level) + Versailles + Disneyland (1 Day/1 Park).",
//         "BELGIUM: Orientation tour + Photo stop at Atomium.",
//       ],
//       accommodation: [
//         "02 nights at Courtyard / Holiday Inn Express LHR or similar in London (LHR Area), UK.",
//         "02 nights at Hotel Moxy CDG / Ibis Styles CDG / similar in Paris (CDG Area), France.",
//         "02 nights at Hotel NH / Best Western or similar in Eindhoven, Netherlands.",
//       ],
//       meals: ["Daily breakfast.", "Select Indian dinners (as per tour)."],
//       inclusionsExclusions: [
//         "Inclusions: Hotels, transfers, sightseeing as per itinerary, selected meals.",
//         "Exclusions: Personal expenses, porterage, optional tours, anything not mentioned.",
//       ],
//     },

//     terms: [
//       "Passport must be valid for minimum 6 months from travel date.",
//       "Itinerary subject to change due to weather/operational constraints.",
//       "Cancellation charges as per company policy.",
//     ],
//   };
// }
