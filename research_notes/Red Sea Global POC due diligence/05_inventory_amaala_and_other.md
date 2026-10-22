# 05. Property inventory: AMAALA and other RSG destinations (excluding The Red Sea)

Research date and access date for every source: 12 October 2026. Source IDs (S01 etc.) resolve in the Source Register near the end.

Evidence labels used:
- [OFFICIAL-DOC] static official statement (press release, policy text, official page copy).
- [OBSERVED-LIVE] element observed on the live page in a browser on 12 Oct 2026 (button, link target, label).
- [OFFICIAL-DOC, summarised] official page read through WebFetch, which returns a model summary and not raw text. Treat wording as paraphrase unless quoted.
- [THIRD-PARTY] non-official source. Used only as a lead or to flag a discrepancy.
- [CONFLICT] two official sources disagree. Both shown.
- "Not verified: requires ..." where evidence is missing.

## Takeaway

- amaala.com lists 9 resorts. 7 carry a BOOK button and 2 carry an "Opening Soon" label (Clinique La Prairie Health Resort, The Ritz-Carlton Resort). RSG's 1 Oct 2026 release states "seven at AMAALA" resorts are open. [S01][S02][S46]
- Six of the seven have a dated RSG opening release: Four Seasons (15 Jun 2026), Six Senses (8 Jul 2026, first guests "mid-July"), Rosewood (18 Aug), Equinox (3 Sep), Nammos (7 Sep), Jayasom (16 Sep). The seventh bookable resort, Daraah Resort, has no opening release that I could find. [S37][S38] to [S44]
- Booking is not on one infrastructure. amaala.com runs its own on-site booking flow (`/en/booking/accommodation-list?hotelId=...`), Jayasom's BOOK button on amaala.com leaves the site to jayasom.com/booking, and every operator also runs its own engine (Four Seasons, SynXis for Rosewood and Equinox, a Nammos subdomain, tbha-hotel.com for Daraah). [S02][S21][S60] to [S65][S52]
- Outside The Red Sea and AMAALA, the only RSG destination or standalone property on RSG's portfolio pages is Thuwal Private Retreat (buy-out only, enquiry based, RSG "developed, owned, and operated"). No newly announced destination was found on redseaglobal.com portfolio or in the 2025 to 2026 news list. [S31][S32][S37][S50]
- Airport guidance conflicts between official sources: amaala.com names Al Wajh International Airport as primary gateway, several operator pages name Red Sea International Airport. See Conflict List.

---

## 1. Inventory tables by status group

### 1A. Operating and bookable: dated RSG opening statement plus live booking entry

| # | Official name (as written) | Location / sub-area | Status evidence (type) | amaala.com page | Operator page | Booking entry points (button to URL) |
|---|---|---|---|---|---|---|
| 1 | "Four Seasons Resort and Residences AMAALA at Triple Bay" (operator). amaala.com: "Four Seasons Resort and Residences, AMAALA" | "Triple Bay, AMAALA" | Dated press release 15 Jun 2026: RSG "has welcomed its first guests at AMAALA, an integrated wellness haven, with the opening of" the resort [OFFICIAL-DOC][S38]. BOOK buttons live [OBSERVED-LIVE][S07] | https://www.amaala.com/en/resorts/four-seasons-resort-and-residences-amaala | https://www.fourseasons.com/amaalaredsea/ | (a) amaala.com "BOOK" opens on-site widget. Offer page "BOOK NOW" goes to `https://www.amaala.com/en/booking/accommodation-list?hotelId=2839&resortName=Four+Seasons+Resort+and+Residences++...` [S21]. (b) Operator "Check Rates" goes to `https://reservations.fourseasons.com/en?hotelCode=RSI740&roomOwsCodes=...` [S60] |
| 2 | "Six Senses AMAALA" (operator, RSG). amaala.com list: "Six Senses Resort" | "Triple Bay, AMAALA" | Dated press release 8 Jul 2026: RSG "has announced the opening of beachfront resort Six Senses AMAALA, which will welcome its first guests mid-July" [OFFICIAL-DOC][S39]. Named among "newly opened luxury resorts" on 14 Sep 2026 [S43]. BOOK buttons live [S05] | https://www.amaala.com/en/resorts/six-senses-amaala | https://www.sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/amaala/ | (a) amaala.com "BOOK" opens on-site widget prefilled "Six Senses Resort", "2 Adults" [OBSERVED-LIVE]. Offer "BOOK NOW" goes to `.../en/booking/accommodation-list?hotelId=2841&resortName=Six+Senses+Resort...` [S21]. (b) Operator "BOOK NOW" is a script button with on-page date search on sixsenses.com. Destination URL not captured [S61] |
| 3 | "Rosewood AMAALA" (operator, RSG). amaala.com list: "Rosewood Resort" | "Triple Bay, AMAALA" | Dated press release 18 Aug 2026: RSG "has announced the opening of Rosewood AMAALA". "third resort to open at AMAALA Triple Bay" [OFFICIAL-DOC][S40]. BOOK buttons live [S03] | https://www.amaala.com/en/resorts/rosewood-resort-amaala | https://www.rosewoodhotels.com/en/amaala | (a) amaala.com "BOOK". Offer "BOOK NOW" goes to `.../en/booking/accommodation-list?hotelId=2842&resortName=Rosewood+Resort...` [S21]. (b) Operator "RESERVE" goes to `https://be.synxis.com/` (hotel=97591, chain=5159) and `https://reservations.rosewoodhotels.com/?Chain=5159&Hotel=97591...` [OFFICIAL-DOC, summarised][S62] |
| 4 | "Equinox Resort AMAALA" (RSG, operator). amaala.com: "Equinox Resort, AMAALA" | "Triple Bay, AMAALA". RSG: "Located at the Marina Village in Triple Bay" | Dated press release 3 Sep 2026: RSG "has announced the opening of Equinox Resort AMAALA" [OFFICIAL-DOC][S41]. BOOK buttons live [S06] | https://www.amaala.com/en/resorts/equinox-resort-amaala | https://equinox-hotels.com/amaala/ | (a) amaala.com "BOOK" opens on-site widget (hotelId not found on pages checked). (b) Operator "BOOK NOW" goes to `https://be.synxis.com/?chain=23412&hotel=98093` [OBSERVED-LIVE][S63] |
| 5 | "Nammos Resort AMAALA" (RSG, operator). amaala.com: "Nammos Resort, AMAALA" | "Triple Bay, AMAALA". Operator address: "Triple Bay Marina Resort 1" | Dated press release 7 Sep 2026: RSG "today announced the opening of Nammos Resort AMAALA" [OFFICIAL-DOC][S42]. BOOK buttons live [S04] | https://www.amaala.com/en/resorts/nammos-resort-amaala | https://www.nammoshotels.com/amaala | (a) amaala.com "BOOK" (hotelId not found). (b) Operator "BOOK NOW" goes to `https://reservationsamaala.nammoshotels.com/?Hotel=98226&Chain=10205&arrive=09-20-2026` [OBSERVED-LIVE][S64] |
| 6 | "Jayasom Wellness Resort AMAALA" (RSG). amaala.com: "Jayasom Wellness Resort, AMAALA". Operator: "Jayasom AMAALA at Triple Bay" | "Triple Bay, AMAALA". RSG: "located on Triple Bay's largest cove" | Dated press release 16 Sep 2026: RSG "has opened Jayasom Wellness Resort AMAALA" [OFFICIAL-DOC][S44]. BOOK link live [S02][S08] | https://www.amaala.com/en/resorts/jayasom-wellness-resort-amaala | https://www.jayasom.com/ | amaala.com "BOOK" and "BOOK NOW" are plain links to `https://www.jayasom.com/booking` (external domain jayasom.com). This is the only resort whose amaala.com button leaves the site [OBSERVED-LIVE][S02][S08]. Operator header "Book Now" goes to the same URL. "Book a Stay" goes to https://www.jayasom.com/contact-us [S65] |

### 1B. Bookable, operating status not explicitly confirmed

| # | Official name (as written) | Location / sub-area | Status evidence (type) | amaala.com page | Own / operator page | Booking entry points |
|---|---|---|---|---|---|---|
| 7 | "Daraah Resort" (amaala.com, own site "DARAAH RESORT"). amaala.com page title reads "Book Your Stay at Darrah Resort" | [CONFLICT] amaala.com body: "Located around 20-30 minutes north of Triple Bay". Same page LOCATION field: "Triple Bay, AMAALA" [S09]. Own site: "Located in AMAALA's wellness hub of Daraah Village" [S52] | Reservations being accepted: BOOK buttons on amaala.com with 7 room types and no "Opening Soon" label [OBSERVED-LIVE][S02][S09]. Own site "Check Availability" link live [S52]. No dated opening release found in the RSG news list for 2025 to 2026 [S37]. Own site still carries pre-opening copy: "Be among the first to experience Daraah Resort ... as we get ready to welcome the world" [S52] | https://www.amaala.com/en/resorts/daraah-resort-amaala | https://tbha-hotel.com/en/ (linked as "Daraah Resort" from redseaglobalhospitality.com [S51]) | (a) amaala.com "BOOK" opens on-site widget (hotelId not found). (b) Own site "Check Availability" goes to `https://reservations.tbha-hotel.com/search-rates`. Offer link `https://reservations.tbha-hotel.com/offer/WSTAY2M20` [OBSERVED-LIVE][S52] |

### 1C. Announced, labelled "Opening Soon" on amaala.com, no amaala.com booking

| # | Official name (as written) | Location / sub-area | Status evidence (type) | amaala.com page | Operator page | Booking entry points |
|---|---|---|---|---|---|---|
| 8 | "Clinique La Prairie Health Resort" (amaala.com list). Page: "Clinique La Prairie Health Resort, AMAALA". Operator: "Clinique La Prairie Longevity Health Resort" | "Triple Bay, AMAALA" | "Opening Soon" label on amaala.com home [OBSERVED-LIVE][S01]. [CONFLICT] amaala.com page copy: "Opening in 2025" [S10]. Operator navigation: "AMAALA, Saudi Arabia (opening 2027)" [S66]. RSG 11 Nov 2025: among "remaining three resorts ... on track to open over the coming months" [S47] | https://www.amaala.com/en/resorts/clinique-la-prairie-health-resort-amaala | https://cliniquelaprairie.com/destinations/saudi-arabia-amaala/ | None for stays. No BOOK button on amaala.com. Operator booking flow "SELECT A RESORT" lists Montreux, Anji, Phuket only [OBSERVED-LIVE][S66] |
| 9 | "The Ritz-Carlton, AMAALA" (amaala.com page, operator). amaala.com list: "The Ritz-Carlton Resort" | "Triple Bay, AMAALA", "at the edge of Triple Bay" | "Opening Soon" label on amaala.com home [OBSERVED-LIVE][S01]. No opening date on operator page. Operator page shows a "RESERVE" / "View Rates" widget [OFFICIAL-DOC, summarised][S67]. Not verified: requires a date search on ritzcarlton.com to confirm whether any dates are actually sold | https://www.amaala.com/en/resorts/the-ritz-carlton-amaala | https://www.ritzcarlton.com/en/hotels/ejhaz-the-ritz-carlton-amaala/overview/ | No BOOK button on amaala.com. Operator "RESERVE" button present, target URL not captured [S67] |

### 1D. Guest-facing venues, clubs and facilities at AMAALA

| # | Official name | Location | Status evidence (type) | Official page | Booking / access |
|---|---|---|---|---|---|
| 10 | "AMAALA Yacht Club" | "Nestled within AMAALA Marina Village" | Dated press release 14 Sep 2026: "has officially begun operations ... now welcoming founding members and visiting yachts" [OFFICIAL-DOC][S43] | https://www.amaala.com/en/amaala-yacht-club (amaalayachtclub.sa redirects here [OBSERVED-LIVE]) | No booking button. Contact email Hello@amaalayachtclub.sa. Membership or berthing process not published on page [S12] |
| 11 | "AMAALA Marina" (also "Triple Bay Marina" in RSG nav) | AMAALA Marina Village, Triple Bay | Press release 1 Oct 2026: "final licensing for AMAALA Marina and Shura Marina" from the Saudi Red Sea Authority [OFFICIAL-DOC][S46] | Covered on yacht club page [S12] | Berthing through "Yachting Network", "single berthing contract" "From this winter 2026" [S45]. No booking URL found |
| 12 | "Corallium Marine Life Institute" (RSG portfolio). "Corallium" (RSG nav and Nov 2025 release) | "A signature attraction at Triple Bay AMAALA" | RSG portfolio timeline for 2026: Phase One opens "introducing ... the AMAALA Yacht Club, and the Corallium Marine Life Institute" [S30]. Four Seasons release: guests "can enjoy dedicated tours of the groundbreaking Corallium Marine Life Institute" [S38]. No dedicated opening release in the news list [S37] | Not found. `amaala.com/en/destinations/the-red-sea/corallium` (in sitemap) returns 404. `visitredsea.com/en/destinations/amaala/corallium` returns 404 [OBSERVED-LIVE] | Not found on amaala.com pages checked. Not verified: requires a Corallium guest page, ticket page or resort concierge confirmation |
| 13 | "HYLIAA SPA" (page heading). RSG release: "HYLIAA Wellness & Spa" | At Four Seasons ("This spa is on Four Seasons") | Listed as wellness centre with hours 10:00 AM to 10:00 PM [OBSERVED-LIVE][S19b] | https://www.amaala.com/en/wellness/hylaa-wellness-and-spa | No booking link on page. "Reach out to your butler to coordinate transportation if required" |
| 14 | "Wellness at Daraah Resort" | At Daraah Resort | Hours published: Spa daily 12:00pm to 9:00pm. Gym daily 6:00 AM to 10:00 PM [S19c] | https://www.amaala.com/en/wellness/wellness-at-daraah-resort | "All facilities are available for in-house guests and wellness members" |
| 15 | Dining venues (22 on amaala.com Dining page) | Inside Four Seasons (6), Six Senses (5), Rosewood (8), Nammos (3) | Listed with BOOK links [OBSERVED-LIVE][S20] | https://www.amaala.com/en/dining | Four Seasons outlets: "BOOK" goes to opentable.com. Rosewood and Nammos outlets: sevenrooms.com. Six Senses outlets: no external link found [S20][S03][S04] |
| 16 | "The Wellness Route" (5km linear park) | Connects resorts at Triple Bay | Announced 11 Nov 2025: "will also open in the next few months" [S47] | Not found on amaala.com pages checked | Not verified: requires official page or later statement |
| 17 | "Marina Village" | Triple Bay | Referenced as location of Equinox and the Yacht Club [S41][S43]. Equinox FAQ: "the Marina Village, promenade, and our signature restaurants are open to all visitors" [S63] | No dedicated page found | Not applicable |

### 1E. Residential products (ownership, not stays)

Listed on amaala.com Residences with "Register Your Interest" / "Enquire about Ownership" form: "Nammos Residences", "Rosewood Residences", "The Andar Club Residences" [S22]. RSG navigation also lists "Clinique La Prairie Residences" and "Rosewood Residences & Iconic Villa" [S32]. Not guest-bookable stays.

### 1F. Other RSG destinations and standalone properties (not The Red Sea, not AMAALA)

| # | Official name | Location | Status evidence (type) | Official pages | Booking entry |
|---|---|---|---|---|---|
| 18 | "Thuwal Private Retreat" | "Thuwal Island, Red Sea, Jeddah, Kingdom of Saudi Arabia". "within a pristine coral archipelago off the coast of Jeddah" | RSG boilerplate (1 Oct 2026 and 23 Sep 2026 releases): "A third destination, Thuwal Private Retreat, opened in 2024" [OFFICIAL-DOC][S45][S46]. Counted as open in "19 resorts open ... and Thuwal Private Retreat" [S46]. Enquiry page live [OBSERVED-LIVE][S50] | https://www.thuwalretreat.sa/en/ and https://www.redseaglobal.com/en/portfolio/thuwal/ (visitredsea.com/en/thuwal-private-retreat redirects to thuwalretreat.sa) | No instant booking. "CONTACT US" on thuwalretreat.sa leads to enquiry form at https://www.thuwalretreat.sa/en/enquire/ (enquiry type "Hotel Reservation Enquiry"). Phone and email below |

Nothing else found. RSG's portfolio navigation lists exactly three: "The Red Sea", "AMAALA", "Thuwal" [S32]. The 2025 to 2026 news list contains no new destination announcement [S37].

---

## 2. Per-property detail

Shared facts for every amaala.com resort page (identical "Getting to the Resort" block on all 9 pages, so this is destination-level copy, not a property-specific promise) [S03] to [S11]:
- "Al Wajh International Airport is the primary gateway to AMAALA, with regular domestic Saudia flights from Riyadh and Jeddah."
- "Guests may also arrive through Red Sea International Airport for selected itineraries, with onward transfer options available to AMAALA."
- "Fly Red Sea seaplane transfers are available for guests arriving at Al Wajh International Airport or Red Sea International Airport ... From Al Wajh International Airport, AMAALA is approximately 20 minutes away by seaplane."

Shared amaala.com booking mechanics [OBSERVED-LIVE][S05][S16][S21][S26]:
- Header "Book" button and every resort or room "BOOK" button are script buttons (no href). Clicking one on the Six Senses page opened an on-page search panel with tabs "Resorts", "Experiences", "Transportation" and fields "Where Would You Like To Go?" (prefilled "Six Senses Resort"), "Guests" ("2 Adults"), "Check In - Check Out", "Nights", "Add Another Resort", "Search".
- Result route, taken from the offer page's BOOK NOW links: `https://www.amaala.com/en/booking/accommodation-list?hotelId=<id>&resortName=<name>&startDate=...&endDate=...&rooms=[...]&resortIndex=0&searchId=...`. hotelIds seen: 2839 (Four Seasons), 2841 (Six Senses), 2842 (Rosewood).
- Other booking routes present in the site's script bundles: `/booking/resorts-list`, `/booking/experiences/activity-list`, `/booking/mobility/mobility-list`, `/booking/guest-information`, `/booking/checkout`, `/booking/my-trips`, `/booking/track-my-luggage`, `/booking/car-entry-permit`. API host referenced: `api.pro.webconnectorprojects.com`.
- Booking FAQ (page titled "Frequently Asked Questions (FAQs) | Visit Red Sea"): "bookings must be made at least one day in advance. Same-day bookings are not allowed" (use live chat). "You can make a booking up to 6 months in advance." Multi-resort bookings: "please use the live assistant chat". Payment: "Credit and MADA cards, and Apple Pay". Changes through "My Trips" [S16].
- I did not run any availability search or submit any form.

### 2.1 Four Seasons Resort and Residences AMAALA at Triple Bay
- **Name / location:** as in table 1A. Address: "AN NU'AYLAH, AMAALA AT TRIPLE BAY, 48511 SAUDI ARABIA". "just a five-minute walk" to the Yacht Club and Marina Village [S60].
- **Owner / operator:** Not explicitly stated on pages checked (S07, S38, S60). RSG describes itself as developer. The 18 May 2026 news title about Four Seasons at Shura Island calling it RSG's "first JV resort" refers to The Red Sea property, not this one [S37].
- **Status:** dated opening release 15 Jun 2026 [S38]. Operator site sells rooms ("CHECK RATES") [S60].
- **Accommodation (amaala.com, 14 types):** Superior Room with terrace - King; Superior Double with terrace; Deluxe sea view room with terrace - king Bed; Deluxe sea view room with terrace Double; One bedroom terrace suite; One bedroom sea view suite; One bedroom terrace suite with private pool (each "3 adults - or 2 adults and 1 child"); One bedroom lagoon villa; One bedroom private pool villa ("2 adults - or 2 adults and 1 child (under 12 years)"); Two bedroom suite with private pool ("4 adults - or 2 adults and 2 children"); Two bedroom villa with private pool; Two bedroom beach villa with private pool ("4 adults - 3 adults and 3 children (under 12 years)"); Presidential suite ("6 adults - or 2 adults and 4 children", 381 m2); Royal beach villa ("8 adults - or 4 adults and 8 children (under 12 years)", 467 m2) [S07]. The first card name was cut in my capture and is reconstructed from the operator page wording.
- **Keys:** "202 elegantly designed guest rooms, suites, and garden villas" plus "26 ultra-exclusive branded private residential villas" [S38]. [CONFLICT] Nov 2025 release: "202 keys and 25 residences" [S47].
- **Child / age policy:** occupancy lines above. "Adult breakfast included", "5-11 Years breakfast paid at restaurant" [S07]. "fully supervised 'Kids for All Seasons' program" and "dedicated, high-tech teenager club" [S38]. No reservation-policy block on the amaala.com page.
- **Meal plan:** "Adult breakfast included" on room cards [S07].
- **Amenities / wellness:** "2,095-square-meter HYLIAA Wellness & Spa", "511-square-meter premium fitness hub", five pools, "900-meter private beach", "Over 1,000 square meters" event space [S38].
- **Dining (6):** ALMAA Pool & Bar Grill, Maa Social, Oaasis Lounge, Rock Baar, Saafa Beach bar & Lounge, Zaatar [S07][S20].
- **Accessibility:** Not found on S07, S60 home, getting-here, contact pages. Footer links to a group "Accessibility Policy" (not opened).
- **Arrival:** operator lists Red Sea International Airport (RSI) 1 hour 45 minutes by car, 185 km; Al Wajh Airport (EJH) 50 minutes, 63 km; NEOM Bay Airport (NUM) 2 hours, 180 km; Tabuk (TUU) 3 hours 20 minutes, 290 km. "Our Four Seasons concierge team would be pleased to arrange transfers ... using a dedicated fleet of all-electric vehicles." Valet parking available [S60].
- **Contact:** Reservations and Front Desk +966 920 034 118. Contact form on operator site [S60].
- **Restrictions:** opening offer needs "A minimum stay of two consecutive nights", "applicable to Suites and Villas only", stays "between July 29 and December 31, 2026" [S21]. No general minimum stay found.

### 2.2 Six Senses AMAALA
- **Owner / operator:** Not explicitly stated. RSG: "the second collaboration between RSG and the brand" [S39].
- **Status:** release 8 Jul 2026 announces opening with first guests "mid-July" [S39]. Opening-offer terms "Valid for stays from July 15, 2026, through January 4, 2027" [S21].
- **Accommodation (amaala.com, 10 types):** Bayview Suite, Lagoon Suite, Pool Suite, Lagoon Pool Suite, Deluxe Pool Suite, Lagoon Deluxe Pool Suite, One Bedroom Pool Villa (each "2 adults 1 child"); Two Bedroom Pool Villa ("6 adults & 2 children"); Three Bedroom Pool Villa ("6 adults, 2 children"); Four Bedroom Pool Villa ("8 Adults and 4 Children") [S05]. "100 suites and villas and 25 branded residences" [S05][S39].
- **Child / age policy:** "Children of all ages are welcome at Six Senses AMAALA, and children aged 12 and under stay free using existing bedding. Extra beds are available for an additional fee for children 12 and older, cots are available for free, and babysitting services can be arranged for an extra charge with advance notice." "Children's menu is available." [S05]
- **Meal plan / rates:** "Breakfast Included" on every room card. "From: SAR4,500" [S05].
- **Policies:** check-in 3:00pm, check-out 12:00 noon. Early arrival: reserve the night before. "Cancellation policies vary by season and rate plan." [S05]
- **Amenities / wellness:** "Six Senses Spa featuring a Longevity Centre, Biohacking Recovery Lounge, Watsu pool, sound dome, thermal facilities and tailored wellness programs"; Earth Lab; "Junior Mangrove Ecologist program" [S39]. Gyms: "Private Gym, mixed gym, a dedicated women's only gym space and a studio" [S05].
- **Dining:** amaala.com lists 5: Beach Shack, Bunna, Joud, Makhbaz, Soraya [S05]. Operator lists 6 plus destination dining: JOUD, SORAYA, BEACH SHACK, BUNNA, MAKHBAZ, NAFAS [S61]. RSG: "Three signature restaurants complemented by an artisan bakery, coffee roastery and cooking school" [S39].
- **Accessibility:** Not found on S05, S61 home and contact pages.
- **Arrival:** only the shared amaala.com block. Operator "HOW TO GET THERE" section not opened.
- **Contact:** reservations-amaala@sixsenses.com, +966 145144400, "Triple Bay, AMAALA, 48511, Saudi Arabia" [S61].
- **Restrictions:** offer minimum two nights [S21]. No general minimum stay found.

### 2.3 Rosewood AMAALA
- **Owner / operator:** Resort operator not stated in a sentence. RSG says the residences are "managed by Rosewood Hotels & Resorts" [S30]. Operator footer "Rosewood Hotel Group © 2026" [S62]. amaala.com publishes licence data on this page: "Commercial Registration Number: 1009155210", "Business License (Unified NAtional Number): 7042976527", "Hotel Classification/category: Resorts 551044" (legal entity name not shown) [S03].
- **Status:** release 18 Aug 2026 [S40]. Operator booking link carries `arrive=2026-8-18` [S62].
- **Accommodation (amaala.com, 16 types):** Private Pool Pavilion (Sea View, Sea Front), Private Pool Suite (Sea View, Sea Front), Private Pool Villa (Sea View, Sea Front), all "2 Adults"; Two Bedroom Private Pool Villa (Sea View, Sea Front) "4 Adults"; Asaya Lodge with Private Pool; Signature Asaya Lodge with Private Pool ("2 Adults"); Royal Three Bedroom Private Pool Villa ("6 adults"); Two Bedroom Family Villa (Sea View, Sea Front) "4 adults"; Three Bedroom Family Villa (Sea View, Sea Front) "6 Adults"; Royal Four Bedroom Private Pool Villa ("8 Adults") [S03]. "110 keys" plus "26 branded residences" [S40].
- **Child / age policy:** Not found on S03 (occupancy is given in adults only). RSG: "Rosewood Explorers, a dedicated kids' club" [S40]. Nov 2025 release: zones "including a Family Hotel, Couples Hotel, and Spa and Wellness zone" [S47].
- **Meal plan:** none stated on room cards. Opening offer includes "Daily breakfast at Olea for all registered guests" and "SAR 375.28 well-being credit per day" [S21].
- **Policies:** check-in 3:00 PM. "Any cancellation or amendment must be received at least 14 days prior to arrival, before 6 pm local time", otherwise charged "for the full stay". Early arrival and late check-out on request [S03].
- **Amenities / wellness:** "Asaya spa covers 2,100 square meters", six treatment rooms and a double suite, private hammam, two fitness centres ("one of them for women alone"), "Social House is a private day spa within Asaya, booked by one group for the day", two natural rock pools [S40].
- **Dining (8 on amaala.com):** Asaya Lounge, Olea, Pool Bar, Pool Lounge, Puro Cove Club, Saha, The Grill Bar & Restaurant, Wadi Library [S03]. Five have sevenrooms.com reservation links [S20].
- **Accessibility:** Not found on S03. Operator links an accessibility statement at `/en/accessibility-statement` (not opened) [S62].
- **Arrival:** operator page: about a two-hour drive from Red Sea International Airport, private electric vehicle transfers, arrival by boat via the marina [OFFICIAL-DOC, summarised][S62]. Conflicts with amaala.com naming Al Wajh as primary gateway.
- **Contact:** +966 145147777, amaala@rosewoodhotels.com, "An Nu'aylah, 48511" [S62].
- **Restrictions:** none found beyond the 14-day cancellation rule.

### 2.4 Equinox Resort AMAALA
- **Owner / operator:** Not explicitly stated. RSG: "Equinox's second hotel globally and its first outside the United States" [S41]. Footer reads "Equinox Hotel AMAALA - Triple Bay, Amaala, 48511 An Nu'aylah, Ksa" [S63].
- **Status:** release 3 Sep 2026 [S41].
- **Accommodation (amaala.com, 12 types):** Core Room King, Core Room Double, Marina Room King, Bay Room King, Bay Room Double, Big Marina King Room, Big Bay King Room, Marina Suite, Bay Suite, AMAALA Suite (each "Up to 3 Guests"); Red Sea Suite ("2 Adults"); Penthouse Suite ("2 adults", 180 SQM) [S06]. RSG: "128 rooms and suites across six accommodation categories, including two penthouse suites, alongside 21 branded residences" [S41].
- **Child / age policy:** [CONFLICT] Operator: "Exclusively for adults only" and "EXCLUSIVELY ADULTS-ONLY" [S63]. amaala.com page gives "Up to 3 Guests" with no age statement and no reservation-policy block [S06]. The minimum age is not stated on the pages checked.
- **Meal plan:** "Breakfast Included" on most room cards (absent on Bay Room Double and Bay Suite cards) [S06].
- **Amenities / wellness:** "704 sqm of indoor and outdoor training space", "1,602 sqm spa" with "Equinox X Circuit", cryotherapy, infrared sauna, hyperbaric oxygen therapy, four outdoor pools including "rooftop magnesium salt pool" [S41].
- **Dining:** SAMA AI, MINT + CO, Soho Souk, EQX DEN, By the Magnesium Pool [S06].
- **Accessibility:** "Accessible rooms available" on the Core Room King card [S06]. Operator footer has "Policies & Accessibility" (not opened).
- **Arrival:** operator FAQ: "Red Sea International Airport (RSI) is the primary gateway, located two hours away. Guests can also utilize AlUla, Tabuk, or Al Wajh airports with private luxury transfers." [S63] Conflicts with amaala.com.
- **Contact:** no phone or email found on the operator home page. Not verified: requires the operator "Contact" page.
- **Restrictions:** adults only (operator). Non-guests: "fitness and pool decks are private" [S63].

### 2.5 Nammos Resort AMAALA
- **Owner / operator:** Not explicitly stated for the resort. Operator site: "Part of ADMO Lifestyle Holding" [S64]. RSG quotes "Carolyn Turnbull, CEO of Nammos Hotels & Resorts" [S42].
- **Status:** release 7 Sep 2026: "the launch of Nammos' first resort hotel globally"; "we are incredibly proud to welcome our very first guests" [S42]. The operator page title still reads "Iconic Lifestyle Resort Opening 2026" [S64].
- **Accommodation (amaala.com, 11 types):** Garden Terrace Room, Bay View King Room, Sunset View King Room, Nammos Suite, Beach Private Pool Room, Beach Private Pool Suite, Sunset Private Pool Room, Sunset Private Pool Suite (each "2 Adults + 1 Child"); Two Bedroom Beach Pool Suite, Two Bedroom Sunset Pool Suite, The Cliff Villa (each "4 Adults + 1 Child") [S04]. "110 keys and 20 private residences" [S42].
- **Child / age policy:** "Children under 12 years of age stay complimentary when sharing existing bedding with their parents or guardians, subject to room capacity." "Rollaway/extra beds are available for SAR 1,000 per night". "Baby cribs are available complimentary upon request." "Blu Kids Club" [S04][S42].
- **Pets:** "The resort does not accommodate pets or service animals." [S04]
- **Meal plan / rates:** "The room rate includes daily breakfast." Rates "subject to 5% Municipality Tax (MT) and 15% Value Added Tax (VAT)" [S04].
- **Policies:** check-in 3:00 PM, check-out 12:00 PM. "Cancellation and deposit policies vary by rate plan and seasonality." "A credit card guarantee is required for all bookings." [S04]
- **Amenities / wellness:** "Nammos Beach Club occupies its own private island, accessible via an exclusive boardwalk or private jetty"; "Nammos Spa, home to Boundless Wellbeing" [S42]. Operator: Fitness Centre; Pilates, Yoga & Dance Studios; Watersports; Excursions [S64].
- **Dining:** amaala.com: Ilios Restaurant, NALU Restaurant & Sky Bar, Nammos Restaurant [S04]. Operator adds "ILIOS LOUNGE" [S64].
- **Accessibility:** "An accessible room is available in this category" (Garden Terrace Room) [S04]. Note the no-service-animals statement above.
- **Arrival:** only the shared amaala.com block.
- **Contact:** +966145129888, amaala@nammoshotels.com, "Triple Bay Marina Resort 1, Kingdom Of Saudi Arabia" [S64].

### 2.6 Jayasom Wellness Resort AMAALA
- **Owner / operator:** Not explicitly stated. RSG: "the first Jayasom globally" [S44]. Operator copyright "Jayasom PTE Ltd" [S65].
- **Status:** release 16 Sep 2026 [S44]. Operator contact page: "Reception & Reservations: 24 hours, every day"; day passes "coming soon" [OFFICIAL-DOC, summarised][S65].
- **Accommodation:** amaala.com page shows no room list [S08]. RSG: "153 keys alongside 24 residences" [S44]. Operator booking page: villas "Choose from 1, 2 or 3 bedrooms, and over-water options" [summarised][S65]. Category names: Not found on pages checked. Requires https://www.jayasom.com/destinations/amaala/rooms-and-villas.
- **Child / age policy:** RSG: "divided into an adults-only wellness offering and a dedicated experience for families" [S44]. Operator names the zones Jayana (adults) and Jayela (families) [S65]. Booking page fields "Infants (0 to 6)", "Children (7 to 15)", "Caretakers"; the same page also says "Children must be between 2 and 17 years old" (internal inconsistency reported by the WebFetch summary, not seen in raw text) [S65].
- **Meal plan:** RSG: "dedicated, all-inclusive wellness retreats" [S44]. Operator: "An all-inclusive retreat - your treatments, meals and your room" [S65].
- **Programme-based stays / minimum stay:** Operator: Essence of Jayasom Retreat runs 2 to 3 nights; "Full curated retreats begin at four nights." Retreats named: As a Pair, As a Woman, As a Family, As a Leader, As a Flow, As a Feather, Essence of Jayasom. Add-ons: As You Rest, As You Nourish [summarised][S65]. RSG: journeys tailored to "women's health, couples and family wellbeing, as well as health, weight and lifestyle reset" [S44].
- **Dining:** "a collection of eight dining venues" [S44]. Names not found on pages checked, except "Nakeha" cooking studio [S65].
- **Accessibility:** Not found on S08, S65.
- **Arrival:** operator: airport pickup "included with every reservation", arranged after flight details are provided. Al Wajh (EJH) about 50 minutes by car; RSI and NEOM Bay about 2 hours; Tabuk about 3 hours 20 minutes; AlUla about 4 hours [summarised][S65].
- **Contact:** +966 14 514 4000; amaala.reservations@jayasom.com; "Building 8491, An Nu'Aylah, AMAALA at Triple Bay, 48511 Saudi Arabia" [summarised][S65].
- **Booking:** live multi-step flow on jayasom.com ("Choose Retreat", "Select Your Villa", "Guest Details", "Confirm Booking") [summarised][S65]. Not on amaala.com's own booking flow.

### 2.7 Daraah Resort
- **Owner / operator:** Listed under "Hotels & Resorts" on redseaglobalhospitality.com with the link to tbha-hotel.com [S51]. No sentence naming the operator of "Daraah Resort" was found. RSG's Nov 2025 release describes an "AMAALA Hotel ... owned and operated by Red Sea Global and situated at the Staff Village ... 144 keys with a Levantine all-day dining restaurant, Mediterranean beach club and grab and go snack bar" [S47]. The dining line-up matches Daraah's, so they are probably the same property under an earlier name. That link is my inference and is not stated by any source.
- **Status:** see table 1B. Evidence type is "reservations being accepted" only.
- **Accommodation (amaala.com, 7 types):** Deluxe King Room; Deluxe Twin Room; Deluxe Twin Room Garden View; Deluxe King Room with Sea View; Deluxe Twin Room Sea View; Deluxe King Room with Garden View (each "2 Adults + 1 Child", 32 m²); Family Room ("4 Adults + 2 Children", 68 m²) [S09]. Data quality: twin rooms are shown as "2 Bedrooms" at 32 m², which looks like a field error.
- **Child / age policy:** occupancy as above. Shisha Hut: "Indoor & Outdoor Lounge | Adults Only (21+)" [S09].
- **Meal plan:** Not found on S09, S52.
- **Amenities:** "Wi-Fi, 24/H Welcome Desk, Restaurants, Room Service, Air Conditioning, Telephone, Safe Box" [S09]. "fully equipped gym, sports courts, a golf simulator ... a dedicated wellness spa" [S19c].
- **Dining:** All Day Dining (Levantine), H2GO (Grab & Go), Shisha Hut, Beach Club Restaurant (Mediterranean, Italian influenced) [S09].
- **Accessibility:** Not found on S09, S52.
- **Arrival:** only the shared amaala.com block.
- **Contact:** Not found on tbha-hotel.com home page.
- **Restrictions / offers:** own site: "Book two nights or more and enjoy a 20% discount on your room rate" [S52].

### 2.8 Clinique La Prairie Health Resort, AMAALA
- **Owner / operator:** Not explicitly stated.
- **Status:** see table 1C. Not bookable on any page checked.
- **Accommodation:** amaala.com: "74 rooms, ultra-luxury suites, and 13 branded residences" [S10]. No categories, occupancy or policies published.
- **Amenities:** "Clinique La Prairie Longevity Method™ and state-of-the-art medical technologies" [S10]. Operator: four pillars "medicine, well-being, nutrition and movement"; designed by architect John Heah; branded residences "now available for ownership" [S66].
- **Everything else** (child policy, dining, accessibility, transfers, contact, restrictions): Not found on S10, S66. Corporate contact only: info@cliniquelaprairie.com, +41 21 989 33 11 (Switzerland) [S66].

### 2.9 The Ritz-Carlton, AMAALA
- **Owner / operator:** Not explicitly stated on S11, S67.
- **Status:** see table 1C.
- **Accommodation:** amaala.com: "390 guestrooms, 80% facing shimmering waters" [S11]. No categories on amaala.com. Operator room list not captured.
- **Amenities:** "multiple sunset-view restaurants, a signature spa, adults-only and family pools, a fitness pavilion, and event venues for up to 1,500" [S11]. Operator lists dining venue names Coconut Brewing, Surf Factory, Spice Route, Bimini Bondi, Clay Craft, Cartin Grill [summarised][S67].
- **Policies:** check-in 3:00 pm, check-out 12:00 pm. "No, pets are not allowed at The Ritz-Carlton, AMAALA." No on-site parking, no EV charging [summarised][S67].
- **Accessibility (operator):** elevators; accessible main entrance; "Service Animals are welcome without a fee or documentation"; mobility accessible rooms; roll-in shower; transfer showers; hearing accessible rooms or kits; grab rails; lowered outlets [summarised][S67].
- **Arrival:** "Al Wajh Domestic Airport (EJH), 80.0 KM"; Red Sea International Airport 185.0 KM; "This hotel does not provide shuttle service." [summarised][S67]
- **Contact:** phone shown as "+966 14-145044466"; address "8491 Secondary 3110, AMAALA, An Nu'aylah, Saudi Arabia, 48511" [summarised][S67]. The phone format looks malformed. Not verified.

### 2.10 AMAALA Yacht Club and AMAALA Marina
- **Operator:** RSG launched "Yachting Network, a new Marina & Yacht Club operator ... Bringing together Red Sea Global's marine services under a single management company" (23 Sep 2026) [S45].
- **Facilities:** "7,900-square-meter" clubhouse; dining and social spaces "AMAALA Lounge, ANQA, 27°C and The Deck, alongside a rooftop pool, private meeting suites" [S43]. Marina "119 berths" [S43][S45][S46]. Services: "bunkerage, power, and water-supply", "Full fast-fibre internet is available on request", "International entry and exit visas can be arranged". Position 26°38'52"N 36°12'50"E. "VHF Channels: 16 and 76" [S12].
- **Access:** "now welcoming founding members and visiting yachts" [S43]. "members and guests will enjoy access to newly opened luxury resorts in AMAALA such as Four Seasons, Six Senses, Rosewood, Equinox, and Nammos" [S43]. Whether resort guests who are not members may use the clubhouse: Not found on pages checked.
- **Contact:** Hello@amaalayachtclub.sa; Instagram @amaalayachtclub [S12].
- **Events:** "Grand Finale of The Ocean Race 2027" [S43][S24].

### 2.11 Thuwal Private Retreat
- **Owner / operator:** "Developed, owned, and operated entirely by Red Sea Global" ("100% RSG") [OFFICIAL-DOC][S31]. Listed under RSG Hospitality "Hotels & Resorts" [S51]. Enquiry email uses the RedSeaGlobalHospitality.com domain [S50].
- **Status:** "opened in 2024" [S45][S46].
- **Accommodation:** "a three-bedroom master villa, three one-bedroom pavilions, a spa villa" on a "1.7-hectare" island [S31]. Three-Bedroom Master Beach Villa: "Six adults and one child, plus two infants", interior 185 sqm, exterior 395 sqm. One-Bedroom Beach Pavilions: "Two adults and one infant", 103 sqm including exterior. Whole island "accommodates up to 12 adults and 3 children" [S50].
- **Booking model:** "operates as a buy-out-only property, welcoming just one group at a time" [S31]. "Every booking at Thuwal Private Retreat is completely bespoke. The island rate varies according to the season and day of the week." [S50]
- **Meal plan:** "Rates include accommodation for up to twelve adults and three children, full-board meals (breakfast, lunch, afternoon tea, soft drinks, cocktails and dinner), and a range of on-island activities." [S50]
- **Amenities / dining:** Overwater Diwaniya with open kitchen; "Turquoise Hole natural swimming pool"; private yacht cruises; scuba (certification courses, wreck dives); snorkeling; stand-up paddleboarding; beach cinema; spa villa [S50][S31].
- **Accessibility:** "due to the nature of the island, our transportation options and facilities may not be equipped to safely and comfortably accommodate all physical disabilities. For more information, please contact us." [S50]
- **Arrival:** "accessible via a 45-minute chartered yacht from King Abdullah University of Science and Technology (KAUST) North Marina in northern Jeddah" [S50]. Airport: Not found on thuwalretreat.sa location page or S31 (no airport is named).
- **Contact:** "Inquiries Phone: +966 9200 11099", "Inquiries Email: Inquiries.Thuwal@RedSeaGlobalHospitality.com". Form fields: Enquiry Type, First Name, Last Name, Email, Phone Number, message [S50]. Not submitted.
- **Restrictions:** exclusive buy-out only, capacity 12 adults and 3 children. Minimum stay: Not found.

---

## 3. Experience and transport brands

| Brand (official name) | What it is | Relationship to RSG as stated | Website | How and where guests book | Published age / certification / health restrictions |
|---|---|---|---|---|---|
| WAMA | Above-water activities. RSG: "stand-up paddleboarding, kayaking/canoeing, sailing, windsurfing, kiteboarding, wing foiling, wingboarding, eFoiling" [S34]. At AMAALA, 7 listed: E-Scooter, E-Foil, Seabob, Stand Up Paddle Board, Single kayak, Tandem kayak, E-Surf [S18] | "Core Brand" of Red Sea Sports & Entertainment Company (RSSE), an RSG subsidiary [S34] | No standalone site found. Listed at https://www.amaala.com/en/experiences/water-sports/above-water | "BOOK NOW" button on each activity card on amaala.com (script button, on-site flow; bundle route `/booking/experiences/activity-list`). Booking widget has an "Experiences" tab [S18][S26] | E-Scooter, E-Foil, Seabob: "Age: 13+", "Weight: Max 130 kg". SUP and kayaks: "Age: 8+", "Weight: Max 130 kg". Life jacket mandatory, signed waiver required. Cancellation: full refund over 48 hours, 50% at 24 to 48 hours, none under 24 hours. No-show after 15 minutes. Prices SAR 200 to 850 plus 15% VAT [S18] |
| Galaxea | Below-water: "scuba diving (PADI, heritage dives, wreck dives, conservation dives), snorkeling, direct propulsion vehicles (DPVs), specialty underwater photography, and private boat charters" [S34] | RSSE core brand [S34] | Not found | Not found on amaala.com: the Experiences menu only links "Above Water". Not verified at AMAALA: requires an amaala.com diving page or the booking widget's Experiences tab contents | Not found on pages checked |
| AKUN | Inland: "hiking, trail running, scrambling/climbing, fat tire and eFat tire biking, eMTB biking, zorbing, stargazing, and conservation tours" [S34] | RSSE core brand [S34] | Not found | Not found on amaala.com. The sitemap lists `/en/experiences/adventure-sports/land-adventures` but it returns 404 [S26] | Not found on pages checked |
| Fly Red Sea | Seaplane transfers, scenic tours, charters. "the Kingdom's first seaplane company" [S33]. Fleet "four Cessna Caravan 208 amphibious aircraft" [S53] | RSG subsidiary. "GACA-Licensed Aviation Operator". Air Operator Certificate "RSGAC053" dated 20 September 2023. Footer "© 2026, Red Sea Global" [S33][S53] | https://flyredsea.com/en/ | "Book Tour" goes to https://www.visitredsea.com/en/offers-and-packages/fly-red-sea, which offers "REQUEST A QUOTE", "BOOK NOW", "START CHAT". Footer "Book" goes to visitredsea.com. For AMAALA, amaala.com says "Your resort or travel advisor can help arrange the most suitable arrival and transfer options" and the booking widget has a "Transportation" tab [S53][S54][S14] | Pregnancy: "Up to 28 weeks: No certificate required 29-32 weeks: Medical certificate required Over 32 weeks: Travel not permitted". Mobility: "Guests must be able to board and disembark the aircraft without assistance and may be subject to a physical fitness check." Infants under 2 free, 2 to 11 child fare, 12+ adult fare. Baggage from RSI: checked 1 piece up to 23 kg, hand 1 piece up to 7 kg. No sports or oversized items onboard. Bad weather: marine transfer, refund or voucher [S53] |
| AMAALA Yacht Club / Yachting Network | Yacht club, marina berthing and marine services | Yachting Network is RSG's "new Marina & Yacht Club operator" [S45] | https://www.amaala.com/en/amaala-yacht-club. No Yachting Network site found | Email Hello@amaalayachtclub.sa. "single berthing contract" across AMAALA Marina and Shura Island Marina "From this winter 2026" [S12][S45] | None published on pages checked |
| Shura Links (golf) | RSG nav: "Shura Links Golf Club" under The Red Sea. News title 30 Sep 2025: "Red Sea Global launches Shura Links, Saudi Arabia's first island golf course" [S32][S37] | Listed in RSG's The Red Sea portfolio | Out of my scope (The Red Sea researcher). amaala.com sitemap lists `/en/shura-links` but the page returns 404 [S26] | Not checked | Not checked |
| Golf at AMAALA | RSG: "The Andar Club Residences ... surrounding AMAALA's nine-hole golf course" [S30]. Daraah has "a golf simulator" [S19c] | Not stated | Not found | No guest golf booking found on amaala.com | Not found |
| Al Wajh International Airport (EJH) | amaala.com: "the closest gateway", "approximately 45 minutes from AMAALA by electric vehicle" [S13] | RSG "completed the modernization"; flights "three weekly connections from Riyadh (RUH) and two from Jeddah (JED) operated by Saudia"; "International flights are expected to commence soon" (7 Jun 2026) [S48] | No airport site found | Flights through airlines. Transfers through resort or the booking widget | Not applicable |
| Red Sea International Airport (RSI) | Second gateway for AMAALA, "further away but may offer more convenient flight connections" [S13] | RSG portfolio facility [S32] | https://rsiairport.sa/en/ (linked from flyredsea.com; not opened) | amaala.com shows a live flight board (sample rows were all RSI arrivals: QR1226 from DOH, SV1567 from JED, SV1569 from RUH, FZ927 from DXB) [S13] | Not applicable |
| Ground and sea mobility | amaala.com "Moving around": Seaplane, Electric sedans, MPVs, Electric coaches, Yacht [S14] | RSG has a "Mobility Company" subsidiary (page not captured cleanly) | Not found | Booking widget "Transportation" tab; bundle routes `/booking/mobility/mobility-list`, in-bound and out-bound lists, `/booking/car-entry-permit`, `/booking/track-my-luggage` [S26] | Not found |
| Visit Red Sea (booking platform and app) | "The app offers seamless access to ... The Red Sea and AMAALA" for resorts, experiences, flights, dining reservations, "24/7 concierge service" [S25] | Operated by Regenerative Escapes Tourism Company (DMC), "the operational arm of Visit Red Sea", "24/7 B2B and B2C booking management for accommodation, transfers, and experiences" across "The Red Sea and AMAALA" [S35] | https://www.amaala.com/en/visitredsea-app ; app links https://onelink.to/visitredsea , App Store id6714457903, Google Play com.redseaglobal.mobile | amaala.com booking flow, FAQs and contact pages are branded "Visit Red Sea" in their titles [S16][S17] | Booking rules in section 2 |

Destination contact: +966 11 222 2222, info@amaala.com, contact form at https://www.amaala.com/en/contact-us [S01][S17]. The same phone number appears on visitredsea.com with info@visitredsea.com [S54].

---

## 4. Leads checked: confirmed or rejected

| Lead | Result |
|---|---|
| AMAALA Triple Bay | Confirmed as the official sub-area. Every resort page gives LOCATION "Triple Bay, AMAALA" [S03] to [S11] |
| Six Senses AMAALA, Equinox Resort AMAALA, Rosewood AMAALA, Nammos Resort AMAALA, Jayasom, Four Seasons | Confirmed, open, bookable (table 1A) |
| Clinique La Prairie, The Ritz-Carlton | Confirmed as announced, "Opening Soon" (table 1C) |
| Nujuma | Rejected for AMAALA. RSG news title: "Nujuma, a Ritz-Carlton Reserve at The Red Sea destination". Fly Red Sea lists it among The Red Sea stops [S37][S53] |
| AMAALA Yacht Club | Confirmed, operating since 14 Sep 2026 release [S43] |
| Corallium marine life institute | Confirmed as an AMAALA asset. Guest access and booking not verified |
| Thuwal Private Retreat | Confirmed as RSG standalone property [S31][S50] |
| Shura Links golf | Belongs to The Red Sea (Shura Island). Out of scope |
| Galaxea, WAMA, Akun | Confirmed as RSSE brands [S34]. Only WAMA is visible on amaala.com |
| Fly Red Sea | Confirmed as RSG subsidiary [S33][S53] |
| Additional finds | Daraah Resort (not in the lead list); "AMAALA Hotel" name in Nov 2025 release; HYLIAA Spa; Yachting Network; The Wellness Route; Daraah International School (opened 3 Sep 2026 per news title, not guest-facing) [S37] |

---

## 5. Inferences (mine, not stated by sources)

- Daraah Resort is very likely the seventh open AMAALA resort in RSG's 1 Oct 2026 count. Six have opening releases, the count is seven, Daraah is the only other resort with BOOK buttons, and the Nov 2025 "AMAALA Hotel" (144 keys, RSG owned and operated, Levantine all-day dining, Mediterranean beach club, grab and go) matches Daraah's outlets. No source states this directly.
- amaala.com and visitredsea.com appear to share one platform: the amaala.com sitemap emits visitredsea.com URLs, page titles say "Visit Red Sea", the footer phone number is identical, and RSG says the DMC provides "centralized guest services and controlled booking flows" under the Visit Red Sea brand. Whether inventory, accounts and payment are shared is not established.
- The "Getting to the Resort" block is identical on all nine amaala.com resort pages, so it should be read as destination copy. Operator pages give different primary airports and should be treated as the property-level statement.
- Wellness is confirmed as the positioning of the destination ("The Wellness Destination", "AMAALA's wellness hub"), but the programmes differ by property: longevity and biohacking at Six Senses, performance and recovery at Equinox, Asaya at Rosewood, all-inclusive retreats at Jayasom, medical longevity at Clinique La Prairie (not open). Only Jayasom publishes programme-based minimum stays.

---

## 6. Conflict list

1. **Primary airport for AMAALA.** amaala.com: "Al Wajh International Airport is the primary gateway to AMAALA" [S13][S14]. Equinox: "Red Sea International Airport (RSI) is the primary gateway, located two hours away" [S63]. Rosewood page: about a two-hour drive from RSI [S62]. Four Seasons intro: "Arrival is easy through either Red Sea International Airport or NEOM Bay Airport ... or Tabuk International Airport", while its table lists Al Wajh (EJH) at 50 minutes [S60].
2. **Al Wajh transfer time and distance.** amaala.com: "approximately 45 minutes ... by electric vehicle" and "approximately 20 minutes away by seaplane" [S13]. Four Seasons: 50 minutes, 63 km [S60]. Jayasom: about 50 minutes, and its FAQ says one hour [S65]. Ritz-Carlton: 80.0 km [S67].
3. **Al Wajh airport name and type.** RSG: "AlWajh International Airport (EJH)" [S48]. amaala.com: "Al Wajh International Airport". Jayasom and Ritz-Carlton: "Al Wajh Domestic Airport" [S65][S67].
4. **Fly Red Sea to AMAALA.** amaala.com and RSG subsidiary page say seaplanes serve AMAALA from Al Wajh and RSI [S14][S33]. flyredsea.com "WHERE WE FLY" lists only The St. Regis Red Sea Resort, Red Sea International Airport, Shebara Resort and Nujuma, and says "From our base at Red Sea International Airport (RSI)" [S53]. AMAALA service is not shown as bookable on Fly Red Sea's own site.
5. **Clinique La Prairie opening.** amaala.com: "Opening in 2025" [S10]. Operator: "AMAALA, Saudi Arabia (opening 2027)" [S66]. amaala.com label: "Opening Soon" [S01].
6. **Clinique La Prairie room count.** amaala.com: "74 rooms, ultra-luxury suites, and 13 branded residences" [S10]. Third-party coverage found in search results cites 52 rooms and suites plus 13 villas [THIRD-PARTY, search snippet only, not opened].
7. **The Ritz-Carlton status.** amaala.com "Opening Soon" with no BOOK button [S01][S11]. Operator page displays a RESERVE widget and operational details [S67].
8. **Equinox age policy.** Operator: "Exclusively for adults only" [S63]. amaala.com: no age restriction shown, "Up to 3 Guests" [S06].
9. **Daraah location.** "around 20-30 minutes north of Triple Bay" versus LOCATION "Triple Bay, AMAALA" on the same page [S09], versus "Daraah Village" on its own site [S52], versus "situated at the Staff Village" for the "AMAALA Hotel" [S47].
10. **Daraah name.** "Daraah Resort" [S09][S51][S52], page title "Darrah Resort" [S09], "AMAALA Hotel" in Nov 2025 release [S47] (identity inferred).
11. **Daraah operating status.** Bookable on two sites [S09][S52] while its own site says "as we get ready to welcome the world" [S52]. No opening release [S37].
12. **Four Seasons residences count.** "26 ... branded private residential villas" [S38] versus "25 residences" [S47].
13. **Marina maximum yacht length.** amaala.com: "up to 130 meters" [S12]. 14 Sep release: "more than 100 meters" [S43]. 23 Sep and 1 Oct releases: "up to 120m" / "up to 120 meters" [S45][S46].
14. **Distance from Monaco.** Same 14 Sep release says "approximately 2,000 nautical miles from Monaco" and "Just 1,300 nautical miles from Monaco via the Suez Canal" [S43].
15. **Number of resorts opening.** 15 Jun 2026: "first of eight world-class resorts scheduled to welcome guests at the destination this year" (search snippet of S38, not seen in my excerpt). amaala.com and RSG elsewhere: nine resorts [S02][S41]. 14 Sep: five named open "with two additional resorts opening in the coming months" [S43], yet Jayasom opened two days later and two more remain "Opening Soon".
16. **Property naming on amaala.com.** List cards use "Rosewood Resort", "Six Senses Resort", "The Ritz-Carlton Resort" while detail pages and operators use "Rosewood AMAALA", "Six Senses AMAALA", "The Ritz-Carlton, AMAALA" [S02][S03][S05][S11].
17. **Spa name.** "HYLIAA" in headings and RSG release, "hylaa" in the URL slug [S19b][S38].
18. **Six Senses dining count.** amaala.com 5 outlets [S05]. Operator 6 named outlets [S61]. RSG "Three signature restaurants" plus bakery, roastery, cooking school [S39].
19. **Annual visitors.** RSG portfolio page "100,000+ Visitors per year at AMAALA" [S30]. Nov 2025 release "no more than 500,000 visitors annually" [S47]. These may describe different things (current versus cap).
20. **RSG portfolio page is stale for AMAALA.** Its Resorts section shows only Clinique La Prairie, Jayasom and Six Senses, linking to visitredsea.com/en/resorts/... [S30], while amaala.com lists nine.

Data-quality flags on official pages (not conflicts between facts, but relevant to anyone building on these pages):
- Production amaala.com pages contain links to a UAT host: "EXPLORE ALL EXPERIENCES" on resort pages and "Explore" on the Wellness page point to `https://amaala.uat.webconnectorprojects.com/...`; the Residences form's Terms link does too [S03][S19][S22].
- Four Seasons AMAALA dining "BOOK" links go to OpenTable URLs whose slugs end in "-riyadh", and the Zaatar link is `.../four-seasons-hotel-riyadh-at-kingdom-center-reservations-riyadh?restref=1464337` [S20]. Not verified whether these resolve to the AMAALA outlets.
- The Equinox opening release URL serves an HTML title tag reading "Red Sea Global opens Rosewood AMAALA..." [S41].
- amaala.com sitemap.xml lists visitredsea.com/content/amaala/... URLs, includes test pages, and lists several pages that return 404 on amaala.com [S26].
- thuwalretreat.sa footer still reads "© Red Sea 2024" and its `/en/contact-us/` path returns a storage "ObjectNotFound" error; the working path is `/en/enquire/` [S50].

---

## 7. Gap list per property

| Property | Missing data (pages checked) |
|---|---|
| Four Seasons | Owner; accessibility details; general minimum stay; cancellation policy on amaala.com; hotelId confirmed only through the offer link |
| Six Senses | Owner; accessibility; arrival details on operator site (section not opened); operator booking URL |
| Rosewood | Child policy and ages; accessibility statement content; raw operator page text (read through summary only) |
| Equinox | Minimum guest age; phone and email; amaala.com hotelId; cancellation policy; why amaala.com does not show the adults-only rule |
| Nammos | amaala.com hotelId; operator booking-policy text (page body did not render in capture); "sixth resort to open" wording seen only in a search snippet |
| Jayasom | Room category names and occupancy; exact age limits for the adults-only zone; names of the eight dining venues; accessibility; all operator facts were read through WebFetch summaries, not raw text |
| Daraah Resort | Opening date; operator statement under the Daraah name; contact phone and email; meal plan; child ages; cancellation policy; accessibility; amaala.com hotelId; exact location |
| Clinique La Prairie | Opening date beyond "2027"; room categories; programmes for AMAALA; contact; booking channel |
| The Ritz-Carlton, AMAALA | Opening date; whether reservations are truly open; room categories; valid phone number; operator facts read through summary only |
| AMAALA Yacht Club / Marina | Membership terms and fees; whether non-member resort guests have access; berthing booking URL; Yachting Network website; phone |
| Corallium | Guest page; opening date; tickets, hours, age rules; booking channel |
| HYLIAA Spa, Daraah wellness | Treatment menus; booking channel; whether guests of other resorts may book |
| The Wellness Route, Marina Village | Opening status and official page |
| Thuwal Private Retreat | Nearest airport; minimum stay; rates; cancellation terms; Arabic page not checked |
| Galaxea, AKUN at AMAALA | Any AMAALA listing, prices, age or certification rules |
| Fly Red Sea for AMAALA | Routes, fares, schedule and booking path for AMAALA; baggage limits from Al Wajh |
| Transfers generally | Prices and inclusions for electric vehicle transfers per resort; whether transfers are included in room rates (only Jayasom states pickup is included) |
| Arabic site | Only /ar/resorts was opened (same nine resorts, same "book now" pattern). Arabic property names beyond the first four and Arabic policy text were not compared |

---

## 8. Research log

| # | Action | Tool | Result |
|---|---|---|---|
| 1 | Read researcher.md instructions | Read | Done |
| 2 | Fetch amaala.com/en and redseaglobal.com destinations | WebFetch | HTTP 403 on both (bot protection). Limitation |
| 3 | Search "AMAALA resorts now open Triple Bay 2026"; "Thuwal Private Retreat official site booking" | WebSearch | Leads only (opening dates, Thuwal description) |
| 4 | curl amaala.com, redseaglobal.com with browser user agent | Bash curl | amaala.com 403 (Cloudflare "Just a moment"). redseaglobal.com 200 on some pages, 403 on others. thuwalretreat.sa 200 but script-rendered |
| 5 | Open amaala.com in built-in browser (own tab tab-5), read home, then fetch same-origin pages and parse | Browser | Worked. Read home, resorts list, 9 resort pages, yacht club, plan-your-trip x3, FAQs, contact, experiences, wellness x3, dining, residences, destination, biennale, travel trade, offers, app, sitemap, robots, /ar/resorts, map |
| 6 | Inspect BOOK buttons; click a room BOOK button on Six Senses page | Browser | Opened on-page search widget. No search run. Dropdown contents not enumerated (widget closed on click) |
| 7 | Scan amaala.com script bundles for booking routes and hosts | Browser JS | Routes and API host recorded (S26) |
| 8 | Read redseaglobal.com portfolio AMAALA, Thuwal, subsidiaries (Fly Red Sea, RSSE, DMC, Hospitality) | Browser | Done. Mobility Company page not captured cleanly |
| 9 | RSG media centre: listing JSON endpoint (searchTag news), 265 items | Browser JS | Full 2025 to 2026 news list captured (S37). The `?q=` search endpoint hung or returned 400 |
| 10 | Read 11 RSG press releases | Browser | S38 to S48 |
| 11 | Searches for RSG release URLs, Daraah, Jayasom, Six Senses, yacht club | WebSearch | Leads; URLs confirmed in step 9 |
| 12 | thuwalretreat.sa: home, villas, experience, dining, location, enquire | Browser | Done. /contact-us and /contact return storage errors; reached /en/enquire/ through the Contact Us control. Form not submitted |
| 13 | redseaglobalhospitality.com, flyredsea.com, tbha-hotel.com | Browser | Done (WebFetch returned empty for the first two) |
| 14 | Operator pages: Four Seasons (home, getting-here, contact), Six Senses (home, contact), Equinox, Nammos (home, AMAALA, booking-policy), Clinique La Prairie | Browser | Done. Nammos booking-policy body not captured |
| 15 | Operator pages: Rosewood, Jayasom (home, booking, contact-us), Ritz-Carlton | WebFetch | Model summaries only |
| 16 | amaalayachtclub.sa | Browser | Redirects to amaala.com/en/amaala-yacht-club |
| 17 | visitredsea.com Fly Red Sea offers page; visitredsea.com Corallium guess | Browser | Fly page read. Corallium 404 |
| 18 | Searches for Equinox, Nammos, CLP, Ritz-Carlton, WAMA/Galaxea/Akun, Corallium official pages | WebSearch | Found Ritz-Carlton URL. No official WAMA, Galaxea, Akun or Corallium sites found |

Limitations:
- amaala.com and redseaglobal.com block WebFetch and curl. All content from them came through the built-in browser on 12 Oct 2026.
- WebFetch output for Rosewood, Jayasom and Ritz-Carlton is a model summary. Quotes from those three should be re-read on the live page before being relied on.
- Some first room-card names on amaala.com were cut by my text slicing and were reconstructed from descriptions or the operator page (Four Seasons first card, Rosewood first card, Equinox first card, Daraah first card).
- No availability search, no form submission, no account creation.
- Press release excerpts were truncated to roughly 3,000 to 3,800 characters each. Later paragraphs were not read.
- Arabic versions were sampled only at /ar/resorts.
- Operator "getting here", accessibility and policy sub-pages were opened only for Four Seasons.

---

## 9. Source register

All accessed 12 Oct 2026.

| ID | Title | Publisher | URL | Publication / update date | Claims supported | Limitations |
|---|---|---|---|---|---|---|
| S01 | AMAALA home | AMAALA (RSG) | https://www.amaala.com/en | © 2026, undated | 9 resorts, BOOK and "Opening Soon" labels, contact | Browser only |
| S02 | Resorts list | AMAALA | https://www.amaala.com/en/resorts | undated | Names, BOOK buttons, Jayasom external link | |
| S03 | Rosewood AMAALA | AMAALA | https://www.amaala.com/en/resorts/rosewood-resort-amaala | undated | Rooms, policies, licences, dining, shared arrival block | First card name cut |
| S04 | Nammos Resort, AMAALA | AMAALA | https://www.amaala.com/en/resorts/nammos-resort-amaala | undated | Rooms, child, pets, rates, dining | |
| S05 | Six Senses Resort, AMAALA | AMAALA | https://www.amaala.com/en/resorts/six-senses-amaala | undated | Rooms, child policy, rates, booking widget | |
| S06 | Equinox Resort, AMAALA | AMAALA | https://www.amaala.com/en/resorts/equinox-resort-amaala | undated | Rooms, dining, accessible rooms | No policy block |
| S07 | Four Seasons Resort and Residences, AMAALA | AMAALA | https://www.amaala.com/en/resorts/four-seasons-resort-and-residences-amaala | undated | Rooms, occupancy, breakfast, dining | No policy block |
| S08 | Jayasom Wellness Resort, AMAALA | AMAALA | https://www.amaala.com/en/resorts/jayasom-wellness-resort-amaala | undated | Description, BOOK NOW link | No rooms |
| S09 | Daraah Resort | AMAALA | https://www.amaala.com/en/resorts/daraah-resort-amaala | undated | Rooms, dining, location wording | Internal inconsistencies |
| S10 | Clinique La Prairie Health Resort, AMAALA | AMAALA | https://www.amaala.com/en/resorts/clinique-la-prairie-health-resort-amaala | undated | "Opening in 2025", 74 rooms | Stale date |
| S11 | The Ritz-Carlton, AMAALA | AMAALA | https://www.amaala.com/en/resorts/the-ritz-carlton-amaala | undated | 390 guestrooms, amenities | |
| S12 | AMAALA Yacht Club | AMAALA | https://www.amaala.com/en/amaala-yacht-club | undated | Facilities, contact, marina | |
| S13 | Airport & Flights | AMAALA | https://www.amaala.com/en/plan-your-trip/the-airport-and-flights | undated, live flight board | Gateways, 45 minutes, general info | |
| S14 | Getting to & Around | AMAALA | https://www.amaala.com/en/plan-your-trip/getting-to-and-around | undated | Transfer modes | |
| S15 | Weather & Proximity | AMAALA | https://www.amaala.com/en/plan-your-trip/weather-and-proximity | undated | Flight times | |
| S16 | Booking FAQs | AMAALA / Visit Red Sea | https://www.amaala.com/en/faqs-booking | undated | Booking rules | |
| S17 | Contact Us | AMAALA / Visit Red Sea | https://www.amaala.com/en/contact-us | undated | Phone, form | |
| S18 | Above Water experiences | AMAALA | https://www.amaala.com/en/experiences/water-sports/above-water | undated | WAMA activities, ages, prices, cancellation | 7th item name from page data |
| S19 | Wellness (a), HYLIAA Spa (b), Wellness at Daraah (c) | AMAALA | https://www.amaala.com/en/wellness ; /en/wellness/hylaa-wellness-and-spa ; /en/wellness/wellness-at-daraah-resort | undated | Spa hours, access | |
| S20 | Dining | AMAALA | https://www.amaala.com/en/dining | undated | 22 outlets, reservation links | Outlet list partly from page data |
| S21 | AMAALA Opening Offers | AMAALA | https://www.amaala.com/en/offers-and-packages/amaala-opening-offers | "Offer valid until 31 December" | Booking deep links, hotelIds, offer terms | |
| S22 | AMAALA Residences | AMAALA | https://www.amaala.com/en/residences | undated | Residence brands | |
| S23 | Destination AMAALA | AMAALA | https://www.amaala.com/en/destinations/amaala | undated | "Triple Bay, AMAALA's wellness hub" | |
| S24 | Travel Trade toolkit; AMAALA Biennale | AMAALA | https://www.amaala.com/en/amaala-travel-trade-toolkit ; /en/destinations/amaala/amaala-biennale | undated | Ocean Race 2027, "Opening its first phase in 2026" | Factsheet PDFs not opened |
| S25 | Visit Red Sea App | AMAALA | https://www.amaala.com/en/visitredsea-app | undated | App scope and links | |
| S26 | sitemap.xml, robots.txt, script bundles | AMAALA | https://www.amaala.com/sitemap.xml | n/a | Routes, 404 pages, API host | Code-level evidence |
| S27 | Resorts (Arabic) | AMAALA | https://www.amaala.com/ar/resorts | undated | Same nine resorts | Partial read |
| S30 | AMAALA portfolio page | Red Sea Global | https://www.redseaglobal.com/en/portfolio/amaala/ | undated | Key facts, Corallium, timeline | Partly stale |
| S31 | Thuwal Private Retreat portfolio page | Red Sea Global | https://www.redseaglobal.com/en/portfolio/thuwal/ | undated | Ownership, buy-out model | |
| S32 | Our Portfolio (navigation) | Red Sea Global | https://www.redseaglobal.com/en/portfolio/ | undated | Destination list, asset lists | |
| S33 | Fly Red Sea subsidiary page | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/fly-red-sea/ | undated | Role, licences | |
| S34 | Red Sea Sports & Entertainment Company | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/sports-entertainment-company/ | undated | WAMA, Galaxea, AKUN definitions | |
| S35 | Regenerative Escapes Tourism Company (DMC) | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/regenerative-escapes-tourism-company/ | undated | Visit Red Sea booking role | |
| S36 | Red Sea Global Hospitality subsidiary page | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/red-sea-global-hospitality/ | undated | Operator role, Thuwal | |
| S37 | Media Center news listing (JSON, 265 items) | Red Sea Global | https://www.redseaglobal.com/en/media-center/ | through 1 Oct 2026 | Chronology of releases, absence of Daraah Resort release | Titles and dates only |
| S38 | Four Seasons AMAALA opening | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/red-sea-global-opens-four-seasons-resort-and-residences-amaala-at-triple-bay/ | 15 Jun 2026 | Opening, facilities | Excerpt |
| S39 | Six Senses AMAALA opening | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/rsg-openins-six-senses-amaala/ | 8 Jul 2026 | Opening, facilities | Excerpt |
| S40 | Rosewood AMAALA opening | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/rsg-opens-rosewood-amaala-luxury-resort/ | 18 Aug 2026 | Opening, facilities | Excerpt |
| S41 | Equinox Resort AMAALA opens its doors | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/equinox-resort-amaala-opens-its-doors/ | 3 Sep 2026 | Opening, facilities | Wrong title tag |
| S42 | Nammos Resort AMAALA opening | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/rsg-unveils-nammos-resort-amaala/ | 7 Sep 2026 | Opening, facilities | Excerpt |
| S43 | AMAALA Yacht Club opens | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/AMAALA-Yacht-Club-opens-putting-the-Red-Sea-on-the-global-yachting-map/ | 14 Sep 2026 | Operations start, facilities | Excerpt |
| S44 | Jayasom Wellness Resort opening | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/ | 16 Sep 2026 | Opening, zones, keys | Excerpt |
| S45 | Yachting Network launches | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/yachting-network-launches-red-sea/ | 23 Sep 2026 | Operator, berths, Thuwal "opened in 2024" | |
| S46 | AMAALA Marina & Shura Marina licences | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/amaala-marina-shura-marina/ | 1 Oct 2026 | "seven at AMAALA", licences | |
| S47 | Opening of AMAALA announcement | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/red-sea-global-announces-the-opening-of-amaala-the-world-s-new-coastal-lifestyle-destination/ | 11 Nov 2025 | Phase One list, "AMAALA Hotel", Wellness Route | Pre-opening, forward-looking |
| S48 | AlWajh International Airport modernization | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/rsg-completes-modernization-of-alwajh-international-airport/ | 7 Jun 2026 | Airport reopening, flights | Excerpt |
| S50 | Thuwal Private Retreat site (home, villas, experience, dining, location, enquire) | Red Sea Global | https://www.thuwalretreat.sa/en/ ; /en/villas/ ; /en/experience/ ; /en/dining/ ; /en/location/ ; /en/enquire/ | footer "© Red Sea 2024" | Capacity, full board, access, contact | Script-rendered |
| S51 | Red Sea Global Hospitality | RSG Hospitality | https://www.redseaglobalhospitality.com/en/ | © 2026 | Property list incl. Daraah Resort, Thuwal | |
| S52 | DARAAH RESORT | Daraah Resort | https://tbha-hotel.com/en/ | © 2026 | Location wording, booking links, offer | Sparse page |
| S53 | Fly Red Sea | Fly Red Sea (RSG) | https://flyredsea.com/en/ | © 2026 | Services, FAQs, booking links | |
| S54 | Fly Red Sea offers | Visit Red Sea | https://www.visitredsea.com/en/offers-and-packages/fly-red-sea | undated | Booking CTAs, contact | The Red Sea focus |
| S60 | Four Seasons AMAALA (home, getting-here, contact-us) | Four Seasons | https://www.fourseasons.com/amaalaredsea/ ; /getting-here/ ; /contact-us/ | © 1997-2026 | Booking URLs, airports, contact | |
| S61 | Six Senses AMAALA (home, contact) | Six Senses | https://www.sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/amaala/ ; /contact/ | undated | Contact, dining, booking button | WebFetch 403, browser used |
| S62 | Rosewood AMAALA | Rosewood Hotel Group | https://www.rosewoodhotels.com/en/amaala | © 2026 | Booking engine, contact, arrival | WebFetch summary |
| S63 | Equinox Resort AMAALA | Equinox Hotels | https://equinox-hotels.com/amaala/ | © 2026 | Adults only, booking URL, FAQ | |
| S64 | Nammos Hotels & Resorts; Nammos Resort AMAALA | Nammos Hotels & Resorts | https://www.nammoshotels.com/ ; https://www.nammoshotels.com/amaala | © 2026 | Booking URL, contact, amenities | |
| S65 | Jayasom (home, booking, contact-us) | Jayasom PTE Ltd | https://www.jayasom.com/ ; /booking ; /contact-us | © 2026 | Retreats, minimum stay, contact, transfers | WebFetch summaries |
| S66 | Clinique La Prairie (site navigation; AMAALA destination page) | Clinique La Prairie | https://cliniquelaprairie.com/destinations/saudi-arabia-amaala/ | © 2026 | "opening 2027", booking resorts list | |
| S67 | The Ritz-Carlton, AMAALA overview | Marriott International | https://www.ritzcarlton.com/en/hotels/ejhaz-the-ritz-carlton-amaala/overview/ | undated | Accessibility, airports, policies | WebFetch summary |

Third-party leads seen only as search results and not opened (not used as evidence): Journal des Palaces, Arab News, Boat International, FACT Magazines (Daraah Resort "144 rooms"), Hospitality Net, hotels.com listings.
