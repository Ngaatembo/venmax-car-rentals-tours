/**
 * VenMax content source of truth.
 *
 * Company/contact details below were verified from the existing VenMax site.
 * Fleet, tours and testimonials are structured so they can later be replaced
 * by database reads (see TODO markers) without touching the UI.
 */

import aqua from "@/assets/toyota-aqua.jpg";
import note from "@/assets/nissan-note.jpg";
import fit from "@/assets/honda-fit.jpg";
import serena from "@/assets/nissan-serena.jpg";
import cx5 from "@/assets/mazda-cx5.jpg";
import d4d from "@/assets/toyota-d4d.jpg";
import xtrail from "@/assets/nissan-xtrail.jpg";
import fortuner from "@/assets/toyota-fortuner.jpg";
import prado from "@/assets/toyota-prado.jpg";
import sport from "@/assets/range-rover-sport.jpg";
import landCruiser from "@/assets/toyota-land-cruiser.jpg";
// Tour & hero photography: real photos via Wikimedia Commons (free licenses, CC BY-SA / CC BY).
// Victoria Falls aerial: Diego Delso (CC BY-SA 4.0) · Hwange elephants: panoramio contributor (CC BY)
// Great Zimbabwe: Jan Derk (public domain) · Matobo balancing rocks: Babakathy (CC BY-SA 3.0)
// Harare skyline: Tawanda.M (CC BY-SA 4.0) · Hero jacaranda avenue, Harare: Tawanda.M (CC BY-SA 4.0)
import tourVicFalls from "@/assets/tour-victoria-falls.jpg";
import tourHwange from "@/assets/tour-hwange.jpg";
import tourGreatZim from "@/assets/tour-great-zimbabwe.jpg";
import tourMatobo from "@/assets/tour-matobo.jpg";
import tourHarare from "@/assets/tour-harare.jpg";

export const company = {
  name: "VenMax Car Rental & Tours",
  shortName: "VenMax",
  tagline: "Rent. Drive. Explore. Enjoy.",
  secondaryTagline: "Driving a brighter future together.",
  // Verbatim from VenMax's official site, venmax.co.zw/about-us.
  vision:
    "Transforming travel on the Southern African landscape with unmatched service, sustainability, and tech-driven mobility.",
  mission:
    "Our mission is to elevate the car rental experience in Southern Africa, surpassing our customers' expectations for service, quality, and value, and fostering a culture of excellence that inspires loyalty and growth. We strive to create a work environment where employees thrive, feel valued, and empowered to deliver exceptional, personalized service that delights our customers. By embracing our values of integrity, fairness, and community engagement, we aim to make a positive impact on the lives of our customers, employees, and the communities we serve.",
  // Verbatim from venmax.co.zw/about-us.
  coreValues: [
    {
      title: "Customer & Service Focused",
      description:
        "Shaping decisions through the customer's perspective, going above and beyond, and tailoring solutions to unique needs to foster lifelong relationships.",
    },
    {
      title: "Integrity & Trust",
      description:
        "Honesty, transparency and accountability in every interaction — nurturing fair, honest relationships with customers, partners and each other.",
    },
    {
      title: "Innovation & Quality",
      description:
        "Harnessing new ideas to elevate service and satisfaction. Reliability: just like Elands, VenMax vehicles are adaptable, able to survive in diverse situations from city roads to mountainous terrains — because who needs a spa day when you can just drive anywhere and everywhere.",
    },
    {
      title: "People & Culture",
      description:
        "Collaborating as one team, embracing dignity and professionalism, and fostering career growth and recognition for our people.",
    },
    {
      title: "Safety Culture",
      description:
        "Insured, meticulously maintained vehicles and comprehensive training — safety built into daily operations, not just a rule but a core value.",
    },
  ],
  whatWeOffer: [
    "Special rates & discounts tailored to your needs",
    "Flexible short- and long-term rental agreements",
    "Driver hire services for convenience",
    "24/7 customer support for uninterrupted assistance",
    "Safe, clean, affordable, and reliable vehicles",
  ],
  leadership:
    "A multi-disciplinary team of professionals — drivers, risk-compliance experts, digital product developers, customer-service specialists, mechanics, and operations managers — with decades of combined experience in car hiring, transport logistics, and technical industries.",
  addressLines: ["27 Lawson Avenue", "Milton Park, Harare", "Zimbabwe"],
  phones: ["+263 71 422 5314", "+263 78 047 5535"],
  whatsapp: "263714225314",
  emails: ["sales@venmax.co.zw", "venmaxcarrentaltours@gmail.com"],
  hours: "Office hours 8am–5pm — WhatsApp messages answered anytime",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61576553241839",
    tiktok: "https://www.tiktok.com/@venmax.car.rentaltours",
    linkedin: "https://www.linkedin.com/company/venmax-car-rental-tours/",
    instagram: "https://www.instagram.com/venmax_car_rental__tours",
  },
  googleReviews: "https://share.google/7ZD8l8RK8UuGSEQRB",
  // Verbatim from VenMax's own "Why Choose Venmax?" marketing material.
  aboutParagraphs: [
    "We pride ourselves on delivering quality service with a fleet of well-maintained vehicles, meticulously serviced to keep every journey safe and comfortable. We've served 521+ satisfied clients who trust and believe in our offerings.",
    "VenMax has symbiotic partnerships with several car rental entities and travel agencies to meet every customer need. These synergies enable us to access services or vehicles which may not be in our own fleet, ensuring the best options for our clientele.",
  ],
};

export function whatsappLink(message: string) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Vehicle = {
  slug: string;
  name: string;
  category: string;
  priceLabel: string;
  deposit: string;
  description: string;
  image: string;
  // Manufacturer-typical specs for this model (not admin/DB-managed yet) —
  // used for the fleet card spec row. badge is a short merchandising label.
  seats?: number;
  bags?: number;
  transmission?: "Auto" | "Manual";
  ac?: boolean;
  badge?: string;
};

// TODO(lovable-cloud): replace with a `vehicles` table read once the backend is connected.
export const vehicles: Vehicle[] = [
  {
    slug: "nissan-note",
    name: "Nissan Note Hybrid",
    category: "Economy",
    priceLabel: "From $40/day",
    deposit: "$100 deposit",
    description:
      "Fuel-efficient hybrid, ideal for city driving and everyday errands around Harare.",
    image: note,
    seats: 5,
    bags: 2,
    transmission: "Auto",
    ac: true,
    badge: "Best Value",
  },
  {
    slug: "toyota-aqua",
    name: "Toyota Aqua Hybrid",
    category: "Economy",
    priceLabel: "From $40/day",
    deposit: "$100 deposit",
    description: "Compact hybrid hatchback — easy to park and cheap to run around Harare.",
    image: aqua,
    seats: 5,
    bags: 2,
    transmission: "Auto",
    ac: true,
    badge: "Budget Fuel Saver",
  },
  {
    slug: "honda-fit",
    name: "Honda Fit Hybrid",
    category: "Economy",
    priceLabel: "From $45/day",
    deposit: "$100 deposit",
    description: "Comfortable, fuel-efficient hatchback for personal or business use.",
    image: fit,
    seats: 5,
    bags: 2,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "nissan-xtrail",
    name: "Nissan X-Trail T31",
    category: "SUV",
    priceLabel: "From $55/day",
    deposit: "$100 refundable deposit",
    description: "Family-friendly SUV with a 600L boot and flat-folding rear seats.",
    image: xtrail,
    seats: 5,
    bags: 4,
    transmission: "Auto",
    ac: true,
    badge: "SUV",
  },
  {
    slug: "nissan-serena",
    name: "Nissan Serena C27 Hybrid",
    category: "Family MPV",
    priceLabel: "From $70/day",
    deposit: "$100 refundable deposit",
    description:
      "Spacious 8-seater multi-purpose vehicle for larger families and corporate groups.",
    image: serena,
    seats: 8,
    bags: 4,
    transmission: "Auto",
    ac: true,
    badge: "Family Pick",
  },
  {
    slug: "mazda-cx5",
    name: "Mazda CX-5",
    category: "SUV",
    priceLabel: "From $80/day",
    deposit: "$100 refundable deposit",
    description: "Refined, comfortable crossover for business travel and executive trips.",
    image: cx5,
    seats: 5,
    bags: 4,
    transmission: "Auto",
    ac: true,
    badge: "SUV",
  },
  {
    slug: "toyota-d4d",
    name: "Toyota D4D",
    category: "Pickup",
    priceLabel: "From $130/day",
    deposit: "$300 refundable deposit",
    description: "Rugged double-cab 4x4, built for long-distance travel and site visits.",
    image: d4d,
    seats: 5,
    bags: 3,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "toyota-fortuner",
    name: "Toyota Fortuner GD6",
    category: "SUV",
    priceLabel: "From $170/day",
    deposit: "$300 deposit",
    description:
      "Capable 7-seater 4x4 SUV built for family travel, safaris and cross-country routes.",
    image: fortuner,
    seats: 7,
    bags: 5,
    transmission: "Auto",
    ac: true,
    badge: "Model of the Month",
  },
  {
    slug: "toyota-prado",
    name: "Toyota Prado",
    category: "Premium 4x4",
    priceLabel: "From $400/day",
    deposit: "$300 deposit",
    description: "Premium 7-seater 4x4 with robust off-road performance and comfort.",
    image: prado,
    seats: 7,
    bags: 5,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "range-rover-sport",
    name: "Range Rover Sport",
    category: "Luxury SUV",
    priceLabel: "From $400/day",
    deposit: "$500 deposit",
    description: "Executive luxury SUV for VIP travel and premium occasions.",
    image: sport,
    seats: 5,
    bags: 4,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "toyota-land-cruiser",
    name: "Toyota Land Cruiser",
    category: "Premium 4x4",
    priceLabel: "From $700/day",
    deposit: "$300 deposit",
    description: "Flagship 4x4, engineered for maximum durability and long hauls.",
    image: landCruiser,
    seats: 7,
    bags: 5,
    transmission: "Auto",
    ac: true,
  },
];

export function getVehicle(slug: string) {
  return vehicles.find((v) => v.slug === slug);
}

// The one vehicle spotlighted in the homepage "Model of the Month" teaser.
// Change this slug to rotate the feature — no other redesign needed.
export const modelOfTheMonthSlug = "toyota-fortuner";

export type Service = {
  slug: string;
  name: string;
  description: string;
  icon: "key" | "user" | "plane" | "users";
  whatsapp: string;
};

export const services: Service[] = [
  {
    slug: "self-drive",
    name: "Self-Drive Car Rental",
    description:
      "Take the wheel yourself with a well-maintained vehicle, full insurance options and 24/7 support.",
    icon: "key",
    whatsapp: "Hello VenMax, I'd like to enquire about a self-drive rental.",
  },
  {
    slug: "chauffeur",
    name: "Chauffeur Services",
    description:
      "Sit back with a professional driver for business meetings, events and long-distance travel.",
    icon: "user",
    whatsapp: "Hello VenMax, I'd like to enquire about your chauffeur services.",
  },
  {
    slug: "airport-transfer",
    name: "Airport Transfers",
    description:
      "RGM International Airport shuttle from $30 one-way, Harare CBD to hotels, BnBs and lodges — no waiting, no sharing, door to door.",
    icon: "plane",
    whatsapp: "Hello VenMax, I'd like to arrange an airport transfer.",
  },
  {
    slug: "shuttle",
    name: "Shuttle Services",
    description:
      "Comfortable group transport for conferences, weddings, school trips and corporate shuttles.",
    icon: "users",
    whatsapp: "Hello VenMax, I'd like to enquire about shuttle services.",
  },
];

export type Tour = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

// TODO(lovable-cloud): replace with a `tours` table read once the backend is connected.
export const tours: Tour[] = [
  {
    slug: "victoria-falls",
    name: "Victoria Falls",
    description:
      "The Smoke That Thunders — one of the Seven Natural Wonders of the World, a day's comfortable drive from Harare.",
    image: tourVicFalls,
  },
  {
    slug: "hwange",
    name: "Hwange National Park",
    description:
      "Zimbabwe's largest game reserve, home to vast elephant herds and unforgettable safari sunsets.",
    image: tourHwange,
  },
  {
    slug: "great-zimbabwe",
    name: "Great Zimbabwe",
    description:
      "Ancient stone city and UNESCO World Heritage Site — the heart of the nation's history.",
    image: tourGreatZim,
  },
  {
    slug: "matobo-hills",
    name: "Matobo Hills",
    description:
      "Dramatic balancing granite formations, rock art and rhino tracking near Bulawayo.",
    image: tourMatobo,
  },
  {
    slug: "harare-city",
    name: "Harare City & Surrounds",
    description: "Jacaranda-lined avenues, vibrant markets and the warmth of Zimbabwe's capital.",
    image: tourHarare,
  },
];

export const trustPoints = [
  {
    title: "Free Airport Pickup",
    description: "We meet you on arrival — your vehicle is ready the moment you land.",
  },
  {
    title: "Harare Vehicle Delivery",
    description: "Any vehicle delivered to your door, office or hotel anywhere in Harare.",
  },
  {
    title: "Transparent Pricing",
    description: "Clear daily rates with no hidden charges — discounts on longer rentals.",
  },
  {
    title: "Self-Drive & Chauffeur",
    description: "Take the wheel yourself or travel with a professional VenMax driver.",
  },
];

export const whyVenMax = [
  "Zimbabwean-owned, local knowledge",
  "Well-maintained, insured vehicles",
  "Transparent pricing, no hidden fees",
  "Free airport pickup on arrival",
  "Vehicle delivery across Harare",
  "Self-drive and chauffeur options",
  "Flexible rental durations",
  "Friendly WhatsApp-first support",
];

export const requirements = [
  {
    number: "01",
    title: "Valid Driver's Licence",
    description: "Valid driver's licence with at least 2 years' validity.",
  },
  {
    number: "02",
    title: "Identification",
    description: "National ID card, or a valid international passport for visitors.",
  },
  {
    number: "03",
    title: "Next of Kin",
    description: "Next of kin details, along with a copy of their ID.",
  },
  {
    number: "04",
    title: "Residence / Employment",
    description:
      "Proof of residence or employment — a ZESA or water bill, tenancy agreement, or employer letter.",
  },
  {
    number: "05",
    title: "Refundable Deposit",
    description: "$100, $300 or $500 depending on the vehicle — refunded on safe return.",
  },
];

// Real payment channels VenMax accepts — sourced directly from client materials.
export const paymentMethods = [
  "Ecocash / InnBucks / O'mari",
  "Bank Transfer",
  "Cash",
  "Mukuru",
  "Western Union",
];

// Sourced from VenMax's previous site content — carried forward, not new claims.
export const faqs = [
  {
    question: "What documents do I need to rent a car?",
    answer:
      "A valid driver's licence (2+ years), a national ID or passport, and proof of residence or employment.",
  },
  {
    question: "Is the security deposit refundable?",
    answer:
      "Yes — deposits ($100, $300 or $500 depending on the vehicle) are refunded on safe return of the vehicle.",
  },
  {
    question: "How much free mileage do I get?",
    answer: "200km free every day, with excess mileage billed at $0.60/km.",
  },
  {
    question: "Do you offer airport pickup?",
    answer:
      "Yes — free pickup and handover at RGM International Airport, plus free vehicle delivery anywhere in Harare.",
  },
  {
    question: "Can I hire a car with a driver?",
    answer: "Yes — chauffeur service is available on any vehicle for an additional daily fee.",
  },
  {
    question: "Can I book from outside Zimbabwe?",
    answer:
      "Yes — VenMax arranges bookings and deposits over WhatsApp for the diaspora or family back home, so you don't need to be in the country to get a vehicle sorted before you land.",
  },
];

export const rentalTerms = [
  {
    label: "Rental Period",
    value: "Flexible daily, weekly and multi-day rentals — discounts for longer hires",
  },
  { label: "Free Mileage", value: "200km free daily mileage, with excess billed at $0.60/km" },
  { label: "Chauffeur Option", value: "Available on any vehicle for an additional daily fee" },
];

// Genuine reviews sourced from VenMax's Google Business Profile.
export const testimonials = [
  {
    name: "Howard D.",
    rating: 5,
    quote:
      "Fantastic service, clean vehicles, professional drivers, and very well organised tours. Everything was on time and stress-free. Highly recommended for anyone looking for reliable car hire and unforgettable travel experiences!",
  },
  {
    name: "Enock C.",
    rating: 5,
    quote:
      "I had a fantastic experience. The vehicle was clean and in very excellent condition. The staff who attended me were fantastic. Quite a refreshing experience. Keep it up. You are assured of more business from my company",
  },
  {
    name: "Chengetai M.",
    rating: 5,
    quote:
      "My experience with Venmax Car Hire was exceptional from start to finish. From the seamless booking process to the warm and professional service, every interaction reflected a strong commitment to customer satisfaction.",
  },
  {
    name: "Learnmore M.",
    rating: 5,
    quote:
      "What takes it all is the professionalism with Venmax team, superb service very convenient its like a drive through car rental kind of service. Well serviced and clean cars. You top the list guys 10/10",
  },
  {
    name: "Tatenda M.",
    rating: 5,
    quote:
      "Excellent experience with Venmax Car Rental. The vehicle was in great condition, well-maintained, and the service was top-notch. The car was clean, comfortable and exceeded my expectations. Friendly staff and seamless process. Will definitely rent it again. Highly recommend for reliable and quality car rentals!",
  },
  {
    name: "Muzah C.",
    rating: 5,
    quote:
      "They are friendly, professional staff, a clean and well-maintained car, and fast, hassle-free service. Everything went smoothly with no surprises. Highly recommend and I would rent from them again!",
  },
  {
    name: "Tinashe M.",
    rating: 4,
    quote:
      "Good, reliable service overall. The car was clean and the team was easy to reach when I needed to check on my booking.",
  },
];

// Real, verifiable business facts (not invented) — used in the homepage stat
// strip. Sourced from VenMax's Google Business Profile panel — update as it changes.
export const businessFacts = {
  googleRating: 4.9,
  googleReviewCount: 82,
  facebookFollowers: "3.9K+",
  // From VenMax's own "Why Choose Venmax" marketing copy.
  happyClients: "521+",
};
