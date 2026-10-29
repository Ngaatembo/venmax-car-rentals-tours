# VenMax Trip Planner — isolated experiment

## Purpose
Test whether a structured trip-planning enquiry helps customers provide the information VenMax needs before confirming a rental. This is not a booking system and does not check availability.

## Isolation
- Prototype lives on branch `experiment/venmax-trip-planner`.
- New route: `/trip-planner`.
- Route metadata includes `noindex,nofollow`.
- No production domain, production environment variables, database schema, existing booking flow, or main branch changes are made by this experiment.
- Do not merge or deploy without reviewing calculations and getting VenMax approval.

## Data and rules used
- Vehicle names, published daily rates, deposits and images are reused from `src/data/venmax.ts`.
- Public VenMax policy currently states 200 km free per rental day and US$0.60 per excess kilometre.
- Rentals of one month or more advertise unlimited mileage; monthly rates are not calculated automatically and are sent for a quote.
- Custom mileage packages are quote-only.
- Longer-rental discounts are advertised but the discount schedule is not public; the estimate shows the published daily rate and explicitly excludes unknown discounts.
- Duration uses calendar-day difference (return date minus pickup date) as a temporary prototype assumption. VenMax must confirm the billing convention before the estimate is treated as accurate.
- Distance is customer-entered; no live route service is configured.
- WhatsApp uses the existing `whatsappLink()` helper and the customer reviews/sends the message manually.

## Required owner confirmation before wider testing
1. How are rental days counted (24-hour periods, calendar dates, grace periods)?
2. Does the 200 km allowance multiply by the billed rental days exactly?
3. Is the US$0.60/km excess charge universal across all vehicles and rental types?
4. What discount rules apply to longer rentals?
5. Confirm deposits and published rates for every active vehicle.
6. Confirm that the prototype's wording and customer flow represent VenMax accurately.

## Manual test scenarios
1. **Short city rental:** Toyota Aqua, 2 calendar days, 100 km total. Expected temporary estimate: US$80 rental, US$100 refundable deposit, no excess mileage.
2. **Domestic road trip:** Nissan Note Hybrid, 3 calendar days, 700 km total. Expected temporary estimate: US$120 base + 100 excess km × US$0.60 = US$180 rental, plus US$100 refundable deposit.
3. **High-mileage trip:** Mazda CX-5, 4 calendar days, 1,200 km total. Expected temporary estimate: US$320 base + 400 excess km × US$0.60 = US$560 rental, plus US$100 refundable deposit.
4. **Custom package:** select custom mileage. Must show quote-only and never auto-calculate the price.
5. **Monthly rental:** select a duration of 30 days or more. Must show quote-only and mention monthly unlimited mileage without inventing a monthly rental price.
6. **Invalid dates:** return date equal to or earlier than start date. No estimate or WhatsApp enquiry link should be enabled.
7. **Missing/invalid distance:** no estimate or WhatsApp enquiry link should be enabled.

## Evaluation with Rushamy
Ask whether the estimate matches how she quotes customers, whether the WhatsApp enquiry is more useful than the current messages, and whether she would want customers to use this. Record corrections before any public release.
