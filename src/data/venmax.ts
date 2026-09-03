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
import evoque from "@/assets/range-rover-evoque.jpg";
import sport from "@/assets/range-rover-sport.jpg";
import landCruiser from "@/assets/toyota-land-cruiser.jpg";
import tourVicFalls from "@/assets/tour-victoria-falls.jpg";
import tourHwange from "@/assets/tour-hwange.jpg";
import tourGreatZim from "@/assets/tour-great-zimbabwe.jpg";
import tourMatobo from "@/assets/tour-matobo.jpg";
import tourHarare from "@/assets/tour-harare.jpg";

export const company = {
  name: "VenMax Car Rental & Tours",
  shortName: "VenMax",
  tagline: "Rent. Drive. Explore. Enjoy.",
  addressLines: ["B2, 20 Bradford Drive", "Milton Park, Harare", "Zimbabwe"],
  phones: ["+263 78 222 3365", "+263 77 123 4567"],
  whatsapp: "263782223365",
  emails: ["info@venmax.co.zw", "bookings@venmax.co.zw"],
  hours: "Open daily — message us anytime on WhatsApp",
  social: {
    instagram: "https://www.instagram.com/venmax_zw",
    facebook: "https://www.facebook.com/venmaxzw",
    tiktok: "https://www.tiktok.com/@venmax_zw",
  },
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
};

// TODO(lovable-cloud): replace with a `vehicles` table read once the backend is connected.
export const vehicles: Vehicle[] = [
  {
    slug: "toyota-aqua",
    name: "Toyota Aqua Hybrid",
    category: "Economy",
    priceLabel: "From $40/day",
    deposit: "$200 refundable deposit",
    description:
      "Fuel-sipping hybrid hatchback — ideal for zipping around Harare on a budget without sacrificing comfort.",
    image: aqua,
  },
  {
    slug: "nissan-note",
    name: "Nissan Note",
    category: "Economy",
    priceLabel: "From $40/day",
    deposit: "$200 refundable deposit",
    description:
      "Practical, easy-to-drive compact with generous space for city trips and everyday errands.",
    image: note,
  },
  {
    slug: "honda-fit",
    name: "Honda Fit",
    category: "Economy",
    priceLabel: "From $45/day",
    deposit: "$200 refundable deposit",
    description:
      "Reliable, versatile hatchback with clever storage — a favourite for longer stays and business trips.",
    image: fit,
  },
  {
    slug: "nissan-serena",
    name: "Nissan Serena",
    category: "Family MPV",
    priceLabel: "From $70/day",
    deposit: "$300 refundable deposit",
    description:
      "Spacious 7-seater MPV that keeps the whole family comfortable on long Zimbabwean road trips.",
    image: serena,
  },
  {
    slug: "mazda-cx5",
    name: "Mazda CX-5",
    category: "SUV",
    priceLabel: "From $80/day",
    deposit: "$400 refundable deposit",
    description:
      "Refined crossover SUV with a premium cabin — smooth on the highway, composed on gravel.",
    image: cx5,
  },
  {
    slug: "toyota-d4d",
    name: "Toyota Hilux D4D Double Cab",
    category: "Pickup",
    priceLabel: "From $90/day",
    deposit: "$500 refundable deposit",
    description:
      "Legendary double-cab workhorse for farms, projects and serious off-road travel.",
    image: d4d,
  },
  {
    slug: "nissan-xtrail",
    name: "Nissan X-Trail",
    category: "SUV",
    priceLabel: "From $85/day",
    deposit: "$400 refundable deposit",
    description:
      "Comfortable family SUV with confident handling for Harare traffic and intercity journeys alike.",
    image: xtrail,
  },
  {
    slug: "toyota-fortuner",
    name: "Toyota Fortuner",
    category: "SUV",
    priceLabel: "From $110/day",
    deposit: "$500 refundable deposit",
    description:
      "Rugged 7-seater SUV built for Zimbabwe's roads — from city streets to game-park tracks.",
    image: fortuner,
  },
  {
    slug: "toyota-prado",
    name: "Toyota Land Cruiser Prado",
    category: "Premium 4x4",
    priceLabel: "From $150/day",
    deposit: "$700 refundable deposit",
    description:
      "Executive-grade 4x4 comfort with genuine off-road ability — our most requested safari vehicle.",
    image: prado,
  },
  {
    slug: "range-rover-evoque",
    name: "Range Rover Evoque",
    category: "Luxury SUV",
    priceLabel: "From $180/day",
    deposit: "$800 refundable deposit",
    description:
      "Compact luxury SUV with unmistakable presence — perfect for executive travel and special occasions.",
    image: evoque,
  },
  {
    slug: "range-rover-sport",
    name: "Range Rover Sport",
    category: "Luxury SUV",
    priceLabel: "From $220/day",
    deposit: "$1,000 refundable deposit",
    description:
      "Flagship luxury and effortless performance for weddings, VIP transfers and premium travel.",
    image: sport,
  },
  {
    slug: "toyota-land-cruiser",
    name: "Toyota Land Cruiser",
    category: "Premium 4x4",
    priceLabel: "From $200/day",
    deposit: "$800 refundable deposit",
    description:
      "The definitive long-distance 4x4 — supreme comfort and unstoppable capability anywhere in Zimbabwe.",
    image: landCruiser,
  },
];

export function getVehicle(slug: string) {
  return vehicles.find((v) => v.slug === slug);
}

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
      "Punctual pickups and drop-offs at Harare's airports — meet-and-greet included on arrival.",
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
    description:
      "Jacaranda-lined avenues, vibrant markets and the warmth of Zimbabwe's capital.",
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
    description: "A valid driver's licence held for the required minimum period.",
  },
  {
    number: "02",
    title: "Identification",
    description: "National ID or passport for verification at handover.",
  },
  {
    number: "03",
    title: "Refundable Deposit",
    description: "A refundable security deposit per vehicle, returned at handback.",
  },
  {
    number: "04",
    title: "Booking Confirmation",
    description: "Confirmed dates and pickup or delivery details via WhatsApp.",
  },
];

export const rentalTerms = [
  { label: "Rental Period", value: "Flexible daily, weekly and monthly rentals" },
  { label: "Payment", value: "Confirm payment options with the VenMax team" },
  { label: "Fuel Policy", value: "Vehicles are provided ready to drive — confirm fuel terms at handover" },
];

// DESIGN PLACEHOLDER — replace with genuine VenMax customer reviews before launch.
export const testimonials = [
  {
    name: "Placeholder Review",
    location: "Harare, Zimbabwe",
    quote:
      "This is a design placeholder. A genuine VenMax customer review will appear here once supplied.",
  },
  {
    name: "Placeholder Review",
    location: "Bulawayo, Zimbabwe",
    quote:
      "This is a design placeholder. A genuine VenMax customer review will appear here once supplied.",
  },
  {
    name: "Placeholder Review",
    location: "Victoria Falls, Zimbabwe",
    quote:
      "This is a design placeholder. A genuine VenMax customer review will appear here once supplied.",
  },
];
