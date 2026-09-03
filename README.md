# VenMax Rebuild

VenMax car rentals — Controlled Rebuild

We are rebuilding the VenMax Drive Zimbabwe website in Lovable.

IMPORTANT: This is NOT a request to invent a new website or redesign the brand from scratch.

The existing Base44 website is the visual and UX reference/baseline for this rebuild:

https://venmax-drive-zimbabwe.base44.app/

Study the existing site carefully and reproduce its strongest approved design decisions in Lovable.

PRIMARY OBJECTIVE

Rebuild the existing VenMax Drive Zimbabwe experience with a cleaner, production-ready architecture while preserving the visual identity and user experience of the current Base44 version.

The Base44 version should be treated as the design benchmark.

Do not unnecessarily change the design direction.

DESIGN ELEMENTS TO PRESERVE

Preserve the existing site's:

- Overall page structure

- Hero section composition

- Typography hierarchy

- Brand colours

- Navigation structure

- Spacing and visual rhythm

- Button styles

- Card styles

- Fleet/vehicle presentation

- Image treatment

- Section ordering

- Booking experience and flow

- Overall premium car-rental/tours aesthetic

- Mobile responsiveness

- Visual balance and whitespace

If something already works well in the Base44 version, keep it.

Do not replace an existing design simply because you have another design preference.

REAL VENMAX BRAND

This website is for the real company VenMax Drive Zimbabwe.

Do not use generic fictional branding.

Do not invent:

- Logos

- Company information

- Vehicle models

- Prices

- Contact details

- Testimonials

- Addresses

- Social media accounts

- Services that have not been provided

Where real assets/content are not yet available, create clearly identifiable placeholders that can easily be replaced later.

Do not permanently hard-code fake information.

WEBSITE STRUCTURE

Build the website with a production-ready structure suitable for a Zimbabwean car rental and tours company.

The experience should include the appropriate sections/pages from the existing Base44 design, including where applicable:

- Home

- Fleet / Vehicles

- Vehicle details

- Car rental

- Tours

- About VenMax

- Contact

- Booking / reservation flow

Do not add unnecessary pages just for the sake of adding features.

BOOKING EXPERIENCE

The booking flow should feel simple and professional.

Users should be able to:

1. Select the service they want.

2. Select a vehicle/service where applicable.

3. Choose relevant dates.

4. Provide their contact information.

5. Provide booking details.

6. Submit a booking request.

7. Receive clear confirmation that the request was submitted.

Design the booking experience so it can later be connected to Supabase and an administrative dashboard.

BACKEND ARCHITECTURE

Use Supabase as the planned backend.

Structure the application so that it can support:

- Customer accounts if required

- Vehicle/fleet records

- Vehicle availability

- Booking records

- Customer information

- Tour records

- Contact/inquiry submissions

- Admin users

- Booking status management

- Content management where appropriate

Do not create an unnecessarily complicated database.

Keep the architecture clean, secure and scalable.

ADMIN DASHBOARD

Prepare the application architecture for an admin dashboard where VenMax staff can eventually:

- View bookings

- Update booking status

- View customer information

- Manage vehicles

- Manage availability

- Manage tour information

- Review contact/inquiry submissions

The admin interface should be separate from the public-facing website.

IMPORTANT DOMAIN REQUIREMENT

The existing production domain:

venmax.co.zw

must NOT be modified or connected during development.

The existing website must remain untouched while we develop and review the new version.

The new Lovable application should initially use its development/preview URL.

Only after VenMax approves the finished website will we prepare the production deployment and connect venmax.co.zw.

DEVELOPMENT PRINCIPLE

Work in controlled stages.

Do not make large unsolicited design changes.

Do not introduce unnecessary animations, gradients, glassmorphism, futuristic UI, or unrelated design trends unless they already exist in the reference design or are clearly necessary.

The goal is:

Base44 visual benchmark → Lovable production rebuild → real VenMax content/assets → Supabase backend → admin dashboard → client approval → production deployment → domain connection

FIRST TASK

For this first build, focus primarily on accurately reproducing the frontend experience and visual language of the Base44 reference.

Before implementing major backend functionality, establish the correct:

- Layout

- Navigation

- Typography

- Colours

- Spacing

- Hero

- Fleet presentation

- Booking UX

- Responsive behaviour

- Overall visual identity

Make the implementation modular so the backend can be connected cleanly afterward.

Most importantly:

Do not redesign VenMax. Rebuild it faithfully, then improve functionality without destroying the approved visual direction.https://venmax-drive-zimbabwe.base44.app/

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://venmax-drive-rebuild.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d494f020-bc07-47fb-838c-78a44e873d27).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
