import { getSiteSettings, whatsappNumber, type Policies } from "@/lib/site-settings";
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
import serenaSide from "@/assets/nissan-serena-side.jpg";
import cx5 from "@/assets/mazda-cx5.jpg";
import d4d from "@/assets/toyota-d4d.jpg";
// TODO(venmax-image): VenMax wants a 2017 Honda Vezel photo. To replace, overwrite
// src/assets/honda-vezel.jpg with the correct image (same filename) — nothing else changes.
import vezel from "@/assets/honda-vezel.jpg";
import xtrail from "@/assets/nissan-xtrail.jpg";
import fortuner from "@/assets/toyota-fortuner.jpg";
import prado from "@/assets/toyota-prado.jpg";
// Range Rover photo: VenMax confirmed this image is to be kept ("Range Rover pic maintain").
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
  emails: ["sales@venmax.co.zw"],
  hours: "Office hours 8am–5pm — WhatsApp messages answered anytime",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61576553241839",
    tiktok: "https://www.tiktok.com/@venmax.car.rentaltours",
    linkedin: "https://www.linkedin.com/company/venmax-car-rental-tours/",
    instagram: "https://www.instagram.com/venmax_car_rental__tours",
  },
  googleReviews: "https://share.google/7ZD8l8RK8UuGSEQRB",
  // Verbatim from VenMax's own printed "About Venmax" flyer.
  targetMarket:
    "Business travellers or families looking for a trusted, safe car or luxury travel.",
  // Verbatim brand line from VenMax's own marketing material.
  brandQuote:
    "Just like Eland/Mhofu/Nhuka, VenMax is a total rockstar of strength and is ridiculously good at keeping up with the global craziness and customer whims!",
  // Verbatim from VenMax's own "Why Choose Venmax?" marketing material.
  aboutParagraphs: [
    "VenMax is a bold car hiring company driven by progressive entrepreneurs who are passionate about revolutionising the mobility sector. Anchored on innovation, customer satisfaction and a commitment to making a visible, positive impact that empowers all stakeholders, VenMax is poised to disrupt the market by redefining the standards of excellence and optimally balancing service provision and sustainability.",
    "We pride ourselves on delivering quality service with a fleet of well-maintained vehicles, meticulously serviced to keep every journey safe and comfortable. We've served 1000+ satisfied clients who trust and believe in our offerings.",
    "VenMax has symbiotic partnerships with several car rental entities and travel agencies to meet every customer need. These synergies enable us to access services or vehicles which may not be in our own fleet, ensuring the best options for our clientele.",
  ],
};

/** Attribution required by the Wikimedia Commons licences of the tour destination photos. */
export const tourPhotoCredits =
  "Destination photography via Wikimedia Commons: Victoria Falls — Diego Delso (CC BY-SA 4.0); Hwange — panoramio contributor (CC BY); Great Zimbabwe — Jan Derk (public domain); Matobo Hills — Babakathy (CC BY-SA 3.0); Harare — Tawanda.M (CC BY-SA 4.0).";

// VenMax's own Google Business listing ("Venmax Car Rental & Tours", 27 Lawson Ave).
// Linking by place ID opens the business page, not a bare pin on the building.
const googlePlaceId = "ChIJA1_2HxC7MRkR1xly49g39Lw";
const googlePlaceName = "Venmax Car Rental & Tours";
export const googleMaps = {
  place: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googlePlaceName)}&query_place_id=${googlePlaceId}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(googlePlaceName)}&destination_place_id=${googlePlaceId}`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(`${googlePlaceName}, 27 Lawson Ave, Harare`)}&z=17&output=embed`,
};

export function whatsappLink(message: string) {
  // Admin-editable (Website Content → Contact details); defaults to company.whatsapp.
  return `https://wa.me/${whatsappNumber(getSiteSettings())}?text=${encodeURIComponent(message)}`;
}

function cleanRate(priceLabel: string) {
  return priceLabel.replace(/^from\s+/i, "");
}

/** WhatsApp message used by the fleet grid card. Never promises availability. */
export function vehicleCardMessage(v: { name: string; priceLabel: string }) {
  return `Hi VenMax, I'm interested in the ${v.name} at ${cleanRate(v.priceLabel)}. Please confirm availability, deposit and booking requirements.`;
}

/** WhatsApp message used on the vehicle detail view (asks for dates + requirements). */
export function vehicleDetailMessage(v: { name: string; priceLabel: string; deposit: string }) {
  return `Hi VenMax, I'd like to rent the ${v.name} at ${cleanRate(v.priceLabel)} with a ${v.deposit}. My intended rental dates are ____. Please let me know availability and the requirements to confirm the booking.`;
}

export type Vehicle = {
  slug: string;
  name: string;
  category: string;
  priceLabel: string;
  deposit: string;
  description: string;
  image: string;
  /** Extra photos shown in the "View details" dialog (real VenMax vehicle photos). */
  gallery?: string[] | undefined;
  // Manufacturer-typical specs for this model (not admin/DB-managed yet) —
  // used for the fleet card spec row. badge is a short merchandising label.
  seats?: number | undefined;
  bags?: number | undefined;
  transmission?: string | undefined;
  fuelType?: string | undefined;
  ac?: boolean | undefined;
  features?: string[] | undefined;
  /** Admin status: available | reserved | rented | maintenance. Inactive vehicles are never listed. */
  status?: string | undefined;
  isFeatured?: boolean | undefined;
  /** CSS object-position for the card crop, e.g. "50% 60%" (keeps the vehicle in frame). */
  imagePosition?: string | undefined;
  badge?: string | undefined;
};

// TODO(lovable-cloud): replace with a `vehicles` table read once the backend is connected.
export const vehicles: Vehicle[] = [
  {
    slug: "nissan-note",
    name: "Nissan Note Hybrid",
    category: "Economy",
    priceLabel: "$40/day",
    deposit: "$100 refundable deposit",
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
    name: "Toyota Aqua",
    category: "Economy",
    priceLabel: "$40/day",
    deposit: "$100 refundable deposit",
    description:
      "Compact hybrid hatchback — easy to park and cheap to run around Harare.",
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
    priceLabel: "$45/day",
    deposit: "$100 refundable deposit",
    description:
      "Comfortable, fuel-efficient hatchback for personal or business use.",
    image: fit,
    seats: 5,
    bags: 2,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "nissan-serena",
    name: "Nissan Serena Hybrid",
    category: "Family MPV",
    priceLabel: "$70/day",
    deposit: "$100 refundable deposit",
    description:
      "Spacious 8-seater multi-purpose vehicle for larger families and corporate groups.",
    image: serena,
    gallery: [serenaSide],
    seats: 8,
    bags: 4,
    transmission: "Auto",
    ac: true,
    badge: "Family Pick",
  },
  {
    slug: "nissan-xtrail",
    name: "Nissan X-Trail T30",
    category: "SUV",
    priceLabel: "$55/day",
    deposit: "$100 refundable deposit",
    description:
      "Family-friendly SUV with a 600L boot and flat-folding rear seats.",
    image: xtrail,
    seats: 5,
    bags: 4,
    transmission: "Auto",
    ac: true,
    badge: "SUV",
  },
  {
    slug: "mazda-cx5",
    isFeatured: true,
    name: "Mazda CX-5",
    category: "SUV",
    priceLabel: "$80/day",
    deposit: "$100 refundable deposit",
    description:
      "Refined, comfortable crossover for business travel and executive trips.",
    image: cx5,
    seats: 5,
    bags: 4,
    transmission: "Auto",
    ac: true,
    badge: "SUV",
  },
  {
    slug: "honda-vezel",
    name: "Honda Vezel",
    category: "SUV",
    priceLabel: "$80/day",
    deposit: "$100 refundable deposit",
    description:
      "Stylish, fuel-efficient compact crossover — comfortable for city driving and out-of-town trips.",
    image: vezel,
    seats: 5,
    bags: 3,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "toyota-d4d",
    isFeatured: true,
    imagePosition: "50% 55%",
    name: "Toyota Hilux D4D Truck",
    category: "Truck",
    priceLabel: "$120/day",
    deposit: "$300 refundable deposit",
    description:
      "Rugged double-cab 4x4 truck, built for long-distance travel and site visits.",
    image: d4d,
    seats: 5,
    bags: 3,
    transmission: "Auto",
    ac: true,
    badge: "Truck",
  },
  {
    slug: "toyota-fortuner",
    name: "Toyota GD6",
    category: "SUV",
    priceLabel: "$140/day",
    deposit: "$500 refundable deposit",
    description:
      "Capable 7-seater 4x4 SUV built for family travel, safaris and cross-country routes.",
    image: fortuner,
    seats: 7,
    bags: 5,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "toyota-prado",
    imagePosition: "42% 55%",
    name: "Toyota Prado",
    category: "Premium 4x4",
    priceLabel: "$300/day",
    deposit: "$500 refundable deposit",
    description:
      "Premium 7-seater 4x4 with robust off-road performance and comfort.",
    image: prado,
    seats: 7,
    bags: 5,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "toyota-land-cruiser",
    imagePosition: "50% 62%",
    name: "Toyota Land Cruiser",
    category: "Premium 4x4",
    priceLabel: "$400/day",
    deposit: "$500 refundable deposit",
    description:
      "Powerful 4x4, engineered for maximum durability and long hauls.",
    image: landCruiser,
    seats: 7,
    bags: 5,
    transmission: "Auto",
    ac: true,
  },
  {
    slug: "range-rover-sport",
    name: "Range Rover Autobiography",
    category: "Luxury SUV",
    priceLabel: "$400/day",
    deposit: "$500 refundable deposit",
    description:
      "Executive luxury SUV for VIP travel and premium occasions.",
    image: sport,
    seats: 5,
    bags: 4,
    transmission: "Auto",
    ac: true,
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
      "Take the wheel yourself in a well-maintained, insured vehicle.",
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
      "Harare airport shuttle services are available at $30 per trip. Airport vehicle pickup is free when you have hired a VenMax vehicle.",
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
    title: "Affordable Daily Rates",
    description: "Competitive daily rental rates across a range of vehicles.",
  },
  {
    title: "Airport Vehicle Pickup",
    description: "Free vehicle pickup at the airport when you have hired a VenMax vehicle.",
  },
  {
    title: "Easy WhatsApp Booking",
    description: "Discuss your vehicle, dates and requirements directly with the VenMax team.",
  },
  {
    title: "Local & Diaspora Customers",
    description: "Serving residents of Zimbabwe and customers travelling in from abroad.",
  },
];

export function buildWhyVenMax(p: Policies) {
  return [
    "Zimbabwean-owned, local knowledge",
    "All vehicles insured and well maintained",
    "Transparent pricing, no hidden fees",
    "Free vehicle pickup at the airport for hired vehicles",
    p.deliveryNote.replace(/\.$/, ""),
    "Self-drive and chauffeur options",
    "Flexible rental durations",
    "Friendly WhatsApp-first support",
  ];
}

// Rental requirement cards. Age, licence years and cross-border wording come from
// Website Content → Rates & Policies in the admin.
export function buildRequirements(p: Policies) {
  return [
    {
      number: "01",
      title: "Driver Age",
      description: `Self-drive customers must be ${p.minAge} years or older. No age limit applies when you book a VenMax chauffeur.`,
    },
    {
      number: "02",
      title: "Driver's Licence",
      description: `The driver's licence must have been held for at least ${p.licenceYears} years.`,
    },
    {
      number: "03",
      title: "Identification & Next of Kin",
      description:
        "Customers provide both a valid ID and passport, plus next of kin details in case of an emergency.",
    },
    {
      number: "04",
      title: "Proof of Residence or Employment",
      description: "Proof of residence or employment is required.",
    },
    {
      number: "05",
      title: "Insurance & Damage",
      description:
        "All VenMax vehicles are insured. Minor damage that insurance doesn't cover, such as scratches, may be deducted from the deposit.",
    },
    {
      number: "06",
      title: "Fuel",
      description:
        "Customers pay for fuel used during their rental and return the vehicle with the same fuel level.",
    },
    { number: "07", title: "Cross-Border Travel", description: p.crossBorder },
    {
      number: "08",
      title: "Vehicle Items",
      description: "Lost vehicle items may be charged at applicable market rates.",
    },
  ];
}

// Payment methods, chauffeur fee, delivery, mileage and other policy values live in
// src/lib/site-settings.ts (defaults) and are edited in Website Content → Rates & Policies.

// NOTE: /admin content (faqs table) overrides this list on the live site; keep them in sync.
export const faqs = [
  {
    question: "What do I need to rent a car?",
    answer:
      "Self-drive drivers must be {min_age} or older and have held a driver's licence for at least {licence_years} years. You'll need a valid ID and passport, proof of residence or employment, and next of kin details for emergencies. There is no age limit when you book a VenMax chauffeur.",
  },
  {
    question: "How does booking work?",
    answer:
      "Choose a vehicle and message VenMax on WhatsApp (or email). The team will discuss your dates, requirements, mileage arrangements and payment options with you directly.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "{payment_methods}.",
  },
  {
    question: "When do I pay?",
    answer:
      "Once your booking is confirmed, you pay the vehicle's refundable deposit to secure it. The balance can be paid on or before the day you collect the vehicle.",
  },
  {
    question: "Is the security deposit refundable?",
    answer:
      "Yes — all deposits are refundable. The deposit is refunded when you return the vehicle, using the payment method agreed with you, less any deductions for minor damage not covered by insurance (such as scratches) or excess mileage.",
  },
  {
    question: "What happens if the vehicle is damaged?",
    answer:
      "All VenMax vehicles are insured, and accident-related damage covered by that insurance is not charged to you. Minor damage that insurance doesn't cover, such as scratches, may be deducted from your deposit.",
  },
  {
    question: "How much free mileage do I get?",
    answer:
      "Standard rentals include {free_km} free mileage per day, with excess mileage charged at {excess_rate} per km. For rentals of {unlimited_from} or more, unlimited mileage is available, and customized mileage arrangements can be discussed for longer trips.",
  },
  {
    question: "Do you offer airport pickup?",
    answer:
      "Vehicle pickup at the airport is free when you have hired a VenMax vehicle and require it at the airport. Separately, Harare airport shuttle services are available at {shuttle_fee} per trip.",
  },
  {
    question: "Do you deliver vehicles?",
    answer:
      "Yes — free vehicle delivery within all Harare areas for rental customers. This is separate from the airport shuttle ({shuttle_fee} per trip).",
  },
  {
    question: "Can I hire a car with a driver?",
    answer:
      "Yes — chauffeur service is available on any vehicle for an additional {chauffeur_fee} on top of the vehicle rental price. The client covers the driver's food and accommodation.",
  },
  {
    question: "Can I arrange a rental from outside Zimbabwe?",
    answer:
      "Yes — you can contact VenMax on WhatsApp before your trip and arrange your rental remotely, so your vehicle is sorted before you land.",
  },
  {
    question: "Can I take the vehicle across the border?",
    answer: "{cross_border}",
  },
];

export function buildRentalTerms(p: Policies) {
  return [
    {
      label: "Rental Period",
      value: "Flexible rentals — discounts are available for longer hiring periods",
    },
    {
      label: "Mileage",
      value: `${p.freeKm} free per day, excess ${p.excessRate}/km. Rentals of ${p.unlimitedFrom} or more: unlimited mileage. Customized arrangements for longer trips.`,
    },
    { label: "Chauffeur Option", value: p.chauffeurFeeNote },
    { label: "Delivery", value: `${p.deliveryNote} For rental customers.` },
  ];
}

// ---------------------------------------------------------------------------
// Conversion-focused copy blocks (client-approved wording).
// ---------------------------------------------------------------------------

export const valueCards = [
  {
    icon: "tag",
    title: "Affordable Rates",
    description: "Competitive daily rental rates across a range of vehicles.",
  },
  {
    icon: "calendar",
    title: "Flexible Rentals",
    description: "Discounts are available for longer rental periods.",
  },
  {
    icon: "message",
    title: "Easy WhatsApp Booking",
    description:
      "Discuss your vehicle, dates, requirements and arrangements directly with VenMax on WhatsApp.",
  },
  {
    icon: "globe",
    title: "Diaspora Friendly",
    description: "Arrange your rental before travelling to Zimbabwe.",
  },
] as const;

export const howItWorks = [
  {
    step: "1",
    title: "Choose Your Vehicle",
    description: "Browse the VenMax fleet and choose the vehicle that suits your trip.",
  },
  {
    step: "2",
    title: "Contact VenMax",
    description: "Send your enquiry through WhatsApp or email.",
  },
  {
    step: "3",
    title: "Confirm Your Details",
    description:
      "Discuss your dates, requirements, mileage arrangements and payment options with the VenMax team.",
  },
  {
    step: "4",
    title: "Get Ready to Drive",
    description: "Once your rental arrangements are confirmed, prepare for your trip.",
  },
];

export const diasporaMarkets = ["UK", "USA", "Canada", "Australia", "South Africa", "Sweden", "Europe"];

export function buildDiasporaBenefits(p: Policies) {
  return [
  {
    title: "Arrange Before You Travel",
    description: "Start your rental arrangements before arriving in Zimbabwe.",
  },
  {
    title: "WhatsApp Convenience",
    description: "Discuss your vehicle, dates, requirements and arrangements directly with VenMax.",
  },
  {
    title: "Airport Vehicle Pickup",
    description:
      "Vehicle pickup at the airport is complimentary when you have hired a VenMax vehicle and require it at the airport.",
  },
  {
    title: "Longer Rental Options",
    description: "Discounts are available for longer hiring periods.",
  },
  {
    title: "Monthly Unlimited Mileage",
    description: p.unlimitedSentence,
  },
  {
    title: "Flexible Long-Distance Options",
    description:
      "Customized mileage arrangements for longer trips can be discussed with VenMax on a customer-by-customer basis.",
  },
  ];
}

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
  googleReviewCount: 134,
  facebookFollowers: "3.9K+",
  // From VenMax's own "Why Choose Venmax" marketing copy.
  happyClients: "1000+",
};

/**
 * Fleet-size wording derived from the live vehicle count. Returns null unless the
 * database actually holds 40+ active vehicles, so the site never overstates fleet size.
 */
export function fleetCountLabel(count: number): string | null {
  if (count < 40) return null;
  return `${Math.floor(count / 10) * 10}+ vehicles`;
}
