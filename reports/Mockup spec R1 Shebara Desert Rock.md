# Mockup spec: route R1, Shebara and Desert Rock

Source material for a mockup of an AI booking assistant on the visitredsea.com destination-site booking flow (route R1), limited to Shebara and Desert Rock. Everything here is extracted from the due diligence package dated 12 October 2026. Nothing was re-checked against the live site for this file.

Source IDs such as R219 resolve to URLs in section 19 of `Red Sea Global POC due diligence.md` and in `csv\source_register.csv`.

## 1. Ground rules for the mockup

| Rule | Reason |
|---|---|
| Static data only. No live call to visitredsea.com | The booking terms prohibit automated extraction of pricing and availability (R168). RSG has given no permission |
| Show prices as "illustrative, observed 12 Oct 2026" | They are single observations for one scenario, not quotes |
| Use the demo dates the data was observed for | Shebara and Desert Rock returned nothing on R1 for January and March 2027 (R220, R225). Prices exist for 10 to 13 Nov 2026, one family case for 15 to 19 Nov 2026, and one Shebara villa for 16 to 17 Oct 2026 |
| Label step 5 (payment, review, confirmation) as assumed | That step was never reached. Its screens are our invention |
| No RSG logos, fonts, photos or page copy | Site terms allow personal, non-commercial use only and reserve trademarks. No brand guidelines are public |
| Quote policies from the visitredsea.com channel only | The resorts' own sites state different cancellation windows (section 7) |

Evidence labels used below:

- **Observed**: seen on the rendered screen on 12 Oct 2026.
- **API output**: returned by replaying the site's own search request. Not a rendered screen.
- **Official text**: published on a visitredsea.com page.
- **Computed**: our arithmetic on observed figures.
- **Assumed**: not evidenced. Invented for the mockup.
- **Team screenshot**: captured by a Clouding team member walking the live flow on 13 Oct 2026 (Shebara, 16 to 17 Oct 2026, 2 adults, booked as a guest, not logged in). Screens without personal data are saved in `evidence\screenshots\`. The guest-information and verification screens contain a real name, email and phone number, so they are not stored and their values are not repeated here.

## 2. Flow at a glance

| Step | Screen heading | URL path | Evidence for Shebara | Evidence for Desert Rock |
|---|---|---|---|---|
| 0 | BOOK widget, Resorts tab | Home page overlay | Observed (R095) | Observed, same widget |
| 1 | "Accommodations" | `/en/booking/accommodation-list` | Observed (R219) | Observed (R237) |
| 2 | "Transportation" | `/en/booking/mobility` | Observed (R221) | Not reached |
| 3 | "Explore experiences" | `/en/booking/enhance` | Observed (R222) | Not reached |
| 4 | "Guest information" | `/en/booking/guest-information` | Observed, fields read only (R223). Filled and submitted in the team screenshot | Not reached |
| 4a | "Verify" dialog over step 4 | Same URL | Team screenshot. Code not entered | Not reached |
| 5 | Not named on screen | Not reached | Assumed | Assumed |

The step rail shows numbers "01 02 03 04 05" with no step names. Selections travel in the URL query string (resort, dates, rooms, currency).

For Desert Rock, steps 2 to 4 in the mockup reuse the Shebara layout. That is an assumption. The transfer content must differ, because Desert Rock is reached by car only (section 6).

## 3. What the assistant has to collect

| # | Item | Required on R1 | Options and limits | Step | Evidence |
|---|---|---|---|---|---|
| 1 | Resort | Yes | 11 resorts in the live list. Mockup: Shebara, Desert Rock | 0 | Observed |
| 2 | Check-in date | Yes | Calendar picks check-in only | 0 | Observed |
| 3 | Nights | Yes, default 1 | Stepper. Upper limit not verified | 0 | Observed |
| 4 | Adults (12+ years) | Default 2 | 2 to 12 seen | 0 | Observed |
| 5 | Children (0 to 11 years) | Optional | 0 to 5 seen | 0 | Observed |
| 6 | Age of each child | Marked with an asterisk | "Less than 1", 1 to 11 | 0 | Observed. The live site did not enforce it (section 8) |
| 7 | Accommodation and rate plan | At least one unit | Quantity stepper per rate plan | 1 | Observed |
| 8 | Arrival mode | One always selected | BY PLANE, BY PRIVATE JET, BY CAR, BY YACHT | 2 | Observed, Shebara |
| 9 | Arrival airport | Yes for plane and private jet | Red Sea International Airport - RSIA, Yanbu Airport, Al Wajh Domestic Airport | 2 | Observed, Shebara |
| 10 | Departure airport | Yes for plane and private jet | Same list. Appears after arrival airport is chosen | 2 | Observed, Shebara |
| 11 | Arrival and departure time, airline, flight number | Optional (plane). Times are required for BY CAR | Dropdowns | 2 | Observed, Shebara |
| 12 | Experiences | Optional step, "SKIP & CONTINUE" | If added: Activity Options, Select Guests, Select date, all required | 3 | Observed, Shebara. Adding one was not tested |
| 13 | Booking for | Default "FOR MYSELF" | "FOR MYSELF" or "FOR SOMEONE ELSE" (adds separate booker and main guest blocks) | 4 | Observed |
| 14 | Title | Yes | Mr., Mrs., Ms., Master. | 4 | Observed |
| 15 | First Name | Yes | Text, max 50 | 4 | Observed |
| 16 | Family Name | Yes | Text, max 50 | 4 | Observed |
| 17 | E-Mail | Yes | Text, max 100. Label says "We'll send a verification code" | 4 | Observed |
| 18 | Mobile Number | Yes | Country selector, default +966, max 15 digits | 4 | Observed |
| 19 | Marketing opt-in | Optional, unticked by default | Checkbox | 4 | Observed |
| 20 | Other adult guests' names | Optional | First Name, Family Name per extra adult | 4 | Observed |
| 21 | Other Requirements | Optional | Free text, max 200 | 4 | Observed |

Not asked on the rendered step 4 form: nationality, date of birth, passport or ID. Labels for those exist as text strings in the page source (R258), but where or whether they appear is not verified. Leave them out of the mockup, or mark them as assumed if you include them.

Terms acceptance on step 4 is by statement, not checkbox: "By submitting this form, you confirm that you have read and agreed to our Terms & Conditions and Privacy Policy".

## 4. Step 1 data: accommodations and prices

All amounts in SAR. Demo scenario: 2 adults, 10 to 13 Nov 2026 (3 nights), observed at about 18:53 to 19:06 UTC on 12 Oct 2026. Nightly figures are shown on screen as "Average price per night excluding taxes". Stay totals are shown as "All taxes included". The price breakdown lists a single tax line, "VAT", at 15% of the accommodation total.

### 4.1 Shebara (hotelId 1035)

Rate plans as named on screen:
- A: "SHP - Stay 3 Nights Or More And Enjoy 20% Off"
- B: "SHP - Book Now and Receive 10% Off Your Villa 2026"
- C: "Villa Flat Rate"

| Accommodation | Screen facts | Avg night A | Avg night B | Avg night C | Stay total A | Stay total B | Stay total C |
|---|---|---|---|---|---|---|---|
| One Bedroom Beach Villa | "Maximum occupancy: Up to 4 Guests", 1 Bedroom, 1 King Bed, Beachfront View, 248 sqm, Private Pool | 7,644.00 | 8,599.50 | 9,555.00 | 26,371.80 (API output) | 29,668.28 (API output) | 32,964.75 (Observed) |
| One Bedroom Overwater Villa | 188 sqm, private pool (resort page, R158) | 8,484.00 | 9,544.50 | 10,605.00 | 29,269.80 (Computed) | 32,928.53 (Computed) | 36,587.25 (Computed) |
| Two Bedroom Beach Villa | 367 sqm, private pool (resort page, R158) | 13,328.00 | 14,994.00 | 16,660.00 | 45,981.60 (Computed) | 51,729.30 (Computed) | 57,477.00 (Observed, 4-adult search) |

Nightly averages are Observed (R219). Computed totals use average night x 3 x 1.15, a method that reproduces the three observed totals exactly.

Observed breakdown for One Bedroom Beach Villa, Villa Flat Rate: Nov 10 9,450.00, Nov 11 9,765.00, Nov 12 9,450.00, "Total accommodations 28,665.00", "VAT 4,299.75", "TOTAL PRICE 32,964.75".

No meal plan label was shown for Shebara on R1.

Extra cases:

| Case | Result | Evidence |
|---|---|---|
| 4 adults, same dates | Only two-bedroom villas returned. Two Bedroom Overwater Villa averages 14,672.00 / 16,506.00 / 18,340.00. Quantity 2 of Two Bedroom Beach Villa flat rate gave 114,954.00 | Observed (R219) |
| 2 adults + children aged 5 and 10, 15 to 19 Nov 2026 (4 nights) | Two Bedroom Beach Villa flat total 76,797.00 (discount plans 69,117.31 / 61,437.60). Two Bedroom Overwater Villa flat total 83,559.00 (75,203.12 / 66,847.20). One-bedroom villas not returned | API output (R225) |
| 2 adults, 12 to 15 Jan 2027 | "Shebara has no availability for the selected dates" | Observed (R220). Not proof of closure |

Second date set, from the team screenshots (2 adults, 16 to 17 Oct 2026, 1 night, captured 13 Oct 2026):

| Item | Value on screen | Evidence |
|---|---|---|
| Two Bedroom Beach Villa card | "Maximum occupancy: Up to 7 Guests", "2 Bedrooms", "1 King + 2 Queens", "Beachfront View", "367 sqm", "Private Pool" | Team screenshot 01 |
| Two Bedroom Beach Villa, "Villa Flat Rate" | 21,105.00 "Average price per night excluding taxes". Summary total 24,270.75, "All taxes included" | Team screenshot 01. 21,105.00 x 1.15 = 24,270.75 |
| Accommodation actually carried into steps 2 to 4 | One Bedroom Beach Villa, as stated by the team member who made the booking walk-through. It is not visible in the screenshots (summary section collapsed). Rate plan not recorded. The later totals imply 11,592.00 including tax, which is 10,080.00 before tax for the one night | Villa: team member's statement. Amount: Computed, 15,738.90 total less 4,146.90 transfers |
| Booking lead time | A stay starting 3 days after the capture date was accepted through step 4 | Team screenshots. Consistent with the FAQ's one-day minimum |

The same villa and rate plan cost 16,660.00 average per night on 10 to 13 Nov 2026 and 21,105.00 on 16 Oct 2026. Prices move by date, so the mockup should not present one figure as "the" price.

Villa types on the resort page but with no R1 price observation: Two Bedroom Overwater Villa for 2 adults, Three Bedroom Beach Crown Villa, One Bedroom Beach Crown Villa, Four Bedroom Beach Royal Villa, One Bedroom Beach Royal Villa (R158).

### 4.2 Desert Rock (hotelId 1053)

Rate plans as named on screen: "DR - Stay 2 Nights or Longer and Save 20%" and "Villa Flat Rate" (suites: "Suite Flat Rate"). Plan chip on screen: "Bed and Breakfast".

| Accommodation | Published occupancy and size (resort page, R100) | Avg night, 20% plan | Avg night, flat | Stay total, 20% plan | Stay total, flat |
|---|---|---|---|---|---|
| One bedroom Wadi Villa | 2 adults + 1 child or 3 adults, 171 sqm | 6,636.00 | 8,295.00 | 22,894.20 | 28,617.75 |
| One Bedroom Cliff Hanging Villa | 2 adults + 1 child or 3 adults, 180 sqm | 8,176.00 | 10,220.00 | 28,207.20 | 35,259.00 |
| One Bedroom Mountain Cave Suite | 2 adults, 130 sqm | 9,128.00 | 11,410.00 | 31,491.60 | 39,364.50 |
| Two Bedroom Wadi Villa | 4 adults + 2 children or 5 adults, 259 sqm | Not observed | Not observed | 47,527.20 | 59,409.00 |
| Two Bedroom Cliff Hanging Villa | 4 adults + 2 children or 5 adults, 250 sqm | Not observed | Not observed | 54,772.20 | 68,465.25 |

Nightly averages are Observed (R237). All Desert Rock stay totals are API output (R225), tax at 15% of the net amount.

The villa is written "One bedroom Wadi Villa" on the R1 screen and "One-Bedroom Wadi Villa" on the resort's own engine. desertrock.sa lists villa types and occupancies that visitredsea.com does not. Use the visitredsea.com names.

## 5. Step 2 data: transportation

### 5.1 Shebara (Observed, R221)

Choosing BY PLANE with RSIA for arrival and departure makes the engine add "Recommended transportation option for your booking." There was no control to decline it on that tile.

| Leg | Label on screen | Duration | Capacity text | Price |
|---|---|---|---|---|
| Arrival | "Red Sea International Airport - RSIA to Shebara": "Private Luxury Car + Shared High-Speedboat" | "1h 45m" | Car "Up to 3 guests", speedboat "Up to 16 guests" | 1,191.40, "Total price (all taxes included) / 2 Adults" |
| Departure | "Shebara to Red Sea International Airport - RSIA": "Shared Speed Boat + Private Luxury Car" | "1h 45m" | Same | 1,191.40 |

Transfers total 2,382.80. Stay plus transfers for the flat-rate One Bedroom Beach Villa: 35,347.55 (Observed, R223).

Different departure airport, from the team screenshots (2 adults, arrive 16 Oct, depart 17 Oct 2026):

| Leg | Label on screen | Price |
|---|---|---|
| Arrival | "Red Sea International Airport - RSIA" to "Shebara": "Private Luxury Car + Shared High-Speedboat", "1h 45m", same capacity text | 1,191.40, "Total price (all taxes included) \| 2 Adults" |
| Departure | "Shebara" to "Yanbu Airport": "Shared Speed Boat + Private Luxury Car" | 2,955.50, "Total price (all taxes included) \| 2 Adults" |

"Transportation Trip Details" total: 4,146.90 (Team screenshots 03 and 04). The arrival and departure airports can differ. The RSIA arrival leg price matches the 12 Oct observation.

With RSIA chosen, the Arrival Time dropdown held "14:10" and the Airline and Flight Number fields showed "Saudia" and "SV1565" (Team screenshot 02). The 12 Oct standalone transfer test showed "12:20" and "SV1569" for a different date, so the flight list depends on the date. Whether the airline and flight were filled automatically in the team walk-through is not shown.

Other tiles:
- BY CAR: "A marine transfer is required to reach the resort, please choose one that suits your needs. We will contact to provide the parking details." Arrival Time and Departure Time are required.
- BY YACHT: "We will reach out to you before your arrival to finalize the arrangements." No inputs, continue is enabled.
- BY PRIVATE JET: airports required, times optional.

The transfer "CANCELLATION DETAILS" dialog returned an error: "Cancellation policy details are currently unavailable, Please try again later." There is no R1 transfer cancellation policy to quote.

A seaplane is described on the Shebara resort page (30 minutes flying time) but was not offered in the R1 transfer step for this scenario. Do not show a seaplane option as bookable on R1.

### 5.2 Desert Rock (not reached on R1)

| Fact | Value | Evidence |
|---|---|---|
| Access | Car only, "a scenic 20-minute drive" from RSI. One RSG page says 30 minutes | Official text (R100), conflicting |
| R1 transfer options and prices | Not verified: requires walking step 2 for Desert Rock | None |
| Reference from the other channel | The resort's own engine sells a round-trip sedan at SAR 771 and an MPV at SAR 806 "per booking" | Observed on route R2 only. Not an R1 price |
| Nearest R1 observation | RSIA to Turtle Bay Hotel, one way, 1 adult: Private Luxury Car 299.00 (up to 3 guests), Private Luxury Van 310.50 (up to 5 guests) | Observed (R224). Different destination |

Recommendation: show a car transfer for Desert Rock with a placeholder price labeled "assumed". Do not reuse the SAR 771 figure as if it came from this channel.

## 6. Step 3 data: experiences

Shown for the Shebara booking as "SHEBARA (5)" (Observed, R222). Prices are "From / Per person".

| Category tag | Name | From price | Notes on screen |
|---|---|---|---|
| NATURE | Garden Discovery and Planting Experience | 184.58 | |
| LAHA BEACH | Laha Beach Ladies Club | 275.00 | "Ladies Only", "Free entry for kids under 6", "Boys Under 6 Allowed", "50% off for children aged 6-12" |
| GOLF | 9 Holes | 500.00 | |
| ADRENA | Adrena | 500.00 | |
| GOLF | 18 Holes | 650.00 | |

After choosing an activity the screen says: "Our customer care team will contact you to confirm the exact time of your activity." The mockup should not show a confirmed time slot.

The list changes with the stay dates. For 16 to 17 Oct 2026 the heading read "SHEBARA (12)", against "SHEBARA (5)" for 10 to 13 Nov 2026. Cards seen in the team screenshots:

| Category tag | Name | Tags on card | Price |
|---|---|---|---|
| NATURE | Garden Discovery and Planting Experience | "1-2-hour", "Beginner", "Solo / Group Activity", "Mobility may be required" | Not visible in the capture |
| Not visible | Stand Up Paddle-Boarding | "1 hr", "Age: 8+", "Beginner", "Solo / Group Activity", "Booking a transportation may be required". Links "ACTIVITY DETAILS" and "CANCELLATION DETAILS" | 200.00 for 1 adult, "Total Price \| (all taxes included)" |
| WATER SPORTS | Single Kayak - Shebara | "1 hr", "Age: 8+", "Beginner", "Solo / Group Activity", "Booking a transportation may be required" | "From \| Per person" 200.00 |

Adding an experience, as walked in team screenshots 06 to 08:

1. "VIEW OPTIONS" opens three required dropdowns. Values chosen: Activity Options "Rental: 11:00 - 12:00", Select Guests "1 Adult", Select date "Fri, Oct 16, 2026".
2. "SELECT" adds the activity. The button becomes "UNSELECT" and the card footer is highlighted.
3. The Booking Summary gains an "EXPERIENCES" section and the total rises by the activity price (15,738.90 to 15,938.90).
4. The summary button changes from "SKIP & CONTINUE" to "CONTINUE".

The activity option carries a time window ("Rental: 11:00 - 12:00") while the page still says customer care will confirm the exact time. Show both in the mockup, as the live site does.

Experiences for a Desert Rock booking were not observed. Reusing this list for Desert Rock is an assumption.

## 7. Policies to quote (visitredsea.com channel only)

| Topic | Shebara | Desert Rock | Evidence |
|---|---|---|---|
| Cancellation, flat rate (booking flow dialog) | "Cancellation within 7 days of service start": "100% of booking amount will be charged", applied "Per Booking" | 100% from 7 days before service start, 100% on no-show | Shebara Observed (R219). Desert Rock API output (R237) |
| Cancellation, discount plans | "100% of booking amount will be charged". No "when" line. Flagged non-refundable in the API | Not captured | Observed and API output |
| Cancellation, resort page | By 6:00 PM KSA at least 7 days before arrival, otherwise the full stay | At least 7 days before arrival | Official text (R158, R100) |
| Deposit, resort page | Full stay charged 14 days before arrival | Full stay charged 14 days before arrival | Official text |
| Check-in and check-out | 3:00 PM and 12:00 noon | Not captured | Official text (R158) |
| Children | Under 12 free sharing with parents. 12 and over SAR 1,500 + VAT and municipality tax per night | Under 12 free sharing. 12 and over SAR 1,500 per night | Official text |
| Taxes, resort page | Rates subject to 5% municipality tax and 15% VAT | Not captured | Official text (R158) |

Known conflicts. Do not smooth these over in the mockup:

1. shebara.sa and desertrock.sa both say cancellation needs at least 14 days, against 7 days on visitredsea.com.
2. The Shebara resort page says 5% municipality tax plus 15% VAT. The R1 price breakdown shows one "VAT" line at 15%.
3. The resort page says the full stay is charged 14 days before arrival. What R1 charges at booking is unknown (step 5 not reached).
4. Shebara boat time is "30-40 minute" on visitredsea.com and "45-minute" on an RSG page. The R1 transfer leg shows "1h 45m" door to door.

## 8. Channel rules and observed behaviour

| Rule or behaviour | Detail | Evidence |
|---|---|---|
| Booking window | At least one day in advance. Up to 6 months in advance | Official text, booking FAQ (`https://www.visitredsea.com/en/faqs-booking`). Not tested in the date picker |
| Short notice | Widget text: "For bookings under 24 hours, please chat with us directly." | Observed |
| Multi-resort | The FAQ sends multi-resort bookings to live chat. The widget offers "ADD ANOTHER RESORT" | Conflicting |
| Children dropped | A search with 2 children and blank ages was accepted and priced for 2 adults, with no warning | Observed (R237). A defect on the live site. The assistant should always collect ages |
| No rooms control | 4 adults are sent as one unit and only two-bedroom villas come back. Extra units are added with the quantity stepper | Observed |
| Currency | The site lists CNY, EUR, GBP, RUB, SAR and USD. After USD was selected the engine still priced in SAR | Observed, single session. Show SAR only |
| Account | Guest checkout is offered. "LOGIN / SIGN UP" is optional at step 4 | Observed |
| Contracting party | Regenerative Escapes Tourism Company, not the resort. Changes go through it | Official text (R168) |
| Changes after booking | "submit a request to modify or cancel" from "My Trips" in the account | Official text, booking FAQ. "My Trips" was not viewed |
| Loyalty | None live. Banner: "Your rewards are secured. Complete your booking and register, exclusive benefits will be ready soon." | Observed |

## 9. Verification, step 5 and after

### 9.1 Email verification (Team screenshot, 13 Oct 2026)

Pressing "CONTINUE" on a completed step 4 form, as a guest who is not logged in, opened a dialog over the page:

| Element | On screen |
|---|---|
| Heading | "Verify" |
| Instruction | "Enter the 6-digit code sent to" followed by the email with its middle masked (first two characters, six asterisks, last character before the @, full domain) |
| Input | Six single-character boxes, first one focused |
| Resend | "You can resend code in 00:54" (countdown). The starting value was not captured. 60 seconds is an inference |
| Dismiss | Close button (X) at top right |

So the code is sent on step 4 submit, before any payment screen, and it applies to guest checkout. Not verified: what happens on a wrong or expired code, how long a code stays valid, whether closing the dialog keeps the entered details, and whether submitting step 4 creates a customer record or a hold on RSG's side.

In the same capture the marketing checkbox was ticked and "CONTINUE" was enabled. On 12 Oct the checkbox was unticked by default, so the tick is read as the tester's own action.

### 9.2 Step 5 and after: assumed

Nothing below was observed. Published statements are the only anchors.

| Element | What is published | What the mockup has to invent |
|---|---|---|
| After verification | Nothing | What screen follows a correct code |
| Payment methods | "Credit and MADA cards, and Apple Pay (available only on Mac devices using Safari and in the iOS app)" (booking FAQ) | The payment screen, card fields, 3-D Secure, amount charged at booking against at 14 days |
| Review screen | Nothing | Whole screen |
| Confirmation | Nothing | Confirmation number format, confirmation email, what "confirmed" means |
| Inventory hold | Nothing. No booking write was seen up to step 4 | Whether and when a hold exists |

Put a visible "assumed for demonstration" marker on every screen in this section. Do not style a confirmation to look like a real RSG or RETC document.

## 10. Resort facts for assistant answers

| Fact | Shebara | Desert Rock |
|---|---|---|
| Location | Sheybarah Island, 25 km from the mainland | Hidden valley between the mountains near Umluj |
| Operator | Owned and operated by Red Sea Global, run by Red Sea Global Hospitality | Same |
| Size | 73 villas: 38 overwater, 35 beachfront. All with private pool | 64 keys: 54 villas, 10 suites |
| Dining | Saria, Ariamare, Iki.roe, Lunara, Solera | Basalt, Wadi Pool & Grill, Mica, Nyra, The Library, The Observatory |
| Amenities | Spa, gym, padel and tennis, dive centre, astronomy sessions | Spa, gym, adventure centre, astronomy, listening room |
| Accessibility | Four two-bedroom accessible villas, ramps, portable pool lifts, roll-in shower, accessible buggies and jetties | One accessible two-bedroom Wadi villa, accessible public areas and dining, buggy with wheelchair access |
| Meal plan | Not found on R1 | "Bed and Breakfast" chip on R1 |
| Phone and email (resort) | +966 9200 11099, Reservations@RedSeaGlobalHospitality.com | Same |
| Destination contact | +966 11 222 2222, info@visitredsea.com, live chat | Same |

All rows are Official text from visitredsea.com resort pages (R158, R100) and RSG pages, except the meal plan row (Observed).

## 11. Gaps this mockup papers over

1. Desert Rock steps 2 to 4 on R1 were never walked.
2. Step 5, payment and confirmation were never seen for either resort. The verification dialog was seen but no code was entered.
3. Prices cover two date ranges for Shebara (10 to 13 Nov 2026, and one villa for 16 to 17 Oct 2026) and one for Desert Rock. Any other date in the mockup is invented.
4. Adding an experience was seen once (one paddle-boarding rental for 1 adult). Multiple guests, multiple activities and removal were not tested.
5. Arabic was not inspected inside the booking flow.
6. Whether a by-plane guest can decline the Shebara transfer is not verified.
