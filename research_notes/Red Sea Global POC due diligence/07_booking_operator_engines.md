# Booking journeys on third-party operator engines for Red Sea Global resorts (The Red Sea and AMAALA)

Research date: 12 October 2026. All interactive observations were made in the built-in browser between 18:45 and 19:23 UTC (21:45 to 22:23 Saudi time). Times below are UTC from the browser clock.

Evidence labels: [OBSERVED-LIVE] seen in a rendered page in the built-in browser. [FETCHED-HTML] page HTML fetched and parsed, not rendered or interacted with (includes same-origin fetches made from inside the live browser session). [OFFICIAL-DOC] official documentation page. [CONFLICT] two official sources disagree. "Not verified" means no evidence was collected.

Test inputs. Scenario A: 2 adults, 1 room, 12 to 15 January 2027 (3 nights). Scenario B: 2 adults, 2 children aged 5 and 10, 1 room, 14 to 18 March 2027 (4 nights). One alternative date set was used once, on Jayasom only: 8 to 11 December 2026.

Compliance note. No name, email, phone or other identity data was typed anywhere. No account was created, no sign-in attempted, no terms box ticked, no guest form submitted, no enquiry sent, no CAPTCHA or OTP attempted. Two side effects of permitted rate-selection clicks must be disclosed: (1) on marriott.com, clicking "Select" on a rate opened the guest page with the banner "Room(s) held for 14:54", a timed hold that was not labelled on the button. I read the page and left; I did not repeat a rate selection on any other Marriott property. (2) on booking.slshotels.com, "Select this rate" created a draft booking identifier in the URL (/bookings/{uuid}/payment). No hold timer was shown. Both are documented under "Blocked steps and gaps".

---

## 1. Which resorts hand off to which operator domain from the official RSG page?

### Takeaway
The premise is wrong for almost every resort. visitredsea.com and amaala.com do not hand off to operator booking engines. Their BOOK buttons open RSG's own booking widget and the search stays on the RSG domain, including for Marriott, IHG, Hyatt, Accor, Four Seasons, Rosewood, Equinox and Nammos properties. The only external booking link found on either RSG site is Jayasom (amaala.com to jayasom.com/booking). Operator engines are therefore a parallel direct channel, reached from the operator's own website, not a continuation of the RSG journey.

### Cited Findings

Handoff table (RSG page, button label, destination, domain, parameters carried):

| RSG page | Button label | Destination URL after click | Domain | Parameters carried | Label |
|---|---|---|---|---|---|
| visitredsea.com/en/resorts/the-st-regis-red-sea-resort | BOOK (header) and BOOK (each room card) | Opens in-page widget (tabs Resorts, Experiences, Transportation). SEARCH leads to https://www.visitredsea.com/en/booking/accommodation-list?hotelId=1602&resortName=The+St.+Regis+Red+Sea+Resort&startDate=2027-01-12&endDate=2027-01-15&rooms=[{"adultCount":2,"childAges":[]}]&resortIndex=0&searchId=... | visitredsea.com (RSG) | hotelId, resortName, startDate, endDate, rooms JSON (adultCount, childAges), resortIndex, searchId. Nothing is passed to marriott.com | [OBSERVED-LIVE] 18:49 |
| visitredsea.com/en/resorts/nujuma-a-ritz-carlton-reserve | BOOK (10 occurrences in HTML) | No external operator link in page HTML. Resort is selectable in the RSG widget | visitredsea.com | Search on this property not run | [FETCHED-HTML] 18:46, widget list [OBSERVED-LIVE] |
| visitredsea.com/en/resorts/shura-the-red-sea-edition | BOOK (16) | Same as above | visitredsea.com | Not run | [FETCHED-HTML], widget [OBSERVED-LIVE] |
| visitredsea.com/en/resorts/six-senses-southern-dunes-the-red-sea | BOOK (12) | Same | visitredsea.com | Not run | same |
| visitredsea.com/en/resorts/shura-intercontinental-the-red-sea-resort | BOOK (10) | Same. Note the /en/resorts list card shows only EXPLORE for this resort, with no BOOK shortcut | visitredsea.com | Not run | same |
| visitredsea.com/en/resorts/miraval-the-red-sea | BOOK (17) | Same. Widget labels it "Adults only" | visitredsea.com | Not run | same |
| visitredsea.com/en/resorts/four-seasons-shura | BOOK (12) | Same. Widget name "Four Seasons The Red Sea" | visitredsea.com | Not run | same |
| visitredsea.com/en/resorts/shura-sls-the-red-sea | BOOK (11) | Same | visitredsea.com | Not run | same |
| visitredsea.com/en/resorts/raffles-the-red-sea | Header Book only. No room-card BOOK | Not in the RSG widget's resort list. No external link in HTML | none | n/a | [FETCHED-HTML] and widget [OBSERVED-LIVE] |
| visitredsea.com/en/resorts/grand-hyatt-the-red-sea | Header Book only. No room-card BOOK | Not in the RSG widget's resort list. No external link in HTML | none | n/a | same |
| amaala.com/en (Rosewood, Nammos, Six Senses, Equinox, Four Seasons, Daraah) | BOOK | Opens RSG-style widget on amaala.com with those six resorts selectable | amaala.com (RSG) | Search not run, so the result URL is not verified | widget [OBSERVED-LIVE] 18:50 |
| amaala.com/en/resorts/jayasom-wellness-resort-amaala and amaala.com/en home card | BOOK NOW / BOOK | https://www.jayasom.com/booking | jayasom.com (operator) | None. Plain link, no dates or guests in URL | [OBSERVED-LIVE] link, [FETCHED-HTML] resort page |
| amaala.com/en/resorts/the-ritz-carlton-amaala | Header Book only | Not in widget list, no external link | none | n/a | [FETCHED-HTML], widget [OBSERVED-LIVE] |
| amaala.com/en/resorts/clinique-la-prairie-health-resort-amaala | Header Book only | Not in widget list. Page text says "Opening in 2025" | none | n/a | same |

- The RSG widget on visitredsea.com lists exactly 11 resorts: Miraval The Red Sea (Adults only), Four Seasons The Red Sea, SLS The Red Sea, InterContinental The Red Sea Resort, Turtle Bay Hotel, The Red Sea EDITION, Desert Rock, Shebara, Nujuma a Ritz-Carlton Reserve, Six Senses Southern Dunes The Red Sea, The St. Regis Red Sea Resort. Raffles and Grand Hyatt are absent. [OBSERVED-LIVE] 18:48. Source: [visitredsea St. Regis page](https://www.visitredsea.com/en/resorts/the-st-regis-red-sea-resort)
- The /en/resorts page states "13 resorts" and lists Raffles and Grand Hyatt with EXPLORE only. [FETCHED-HTML] 18:47. Source: [visitredsea resorts](https://www.visitredsea.com/en/resorts)
- None of the 13 visitredsea resort pages contains a link to marriott.com, ihg.com, hyatt.com, accor.com, fourseasons.com, sixsenses.com, slshotels.com or raffles.com. [FETCHED-HTML] 18:46. Source: [visitredsea resorts](https://www.visitredsea.com/en/resorts)
- RSG's own engine returned St. Regis rates for Scenario A: One Bedroom Dune Villa, "Stay Longer On Us" 5,525.00, "Flexible Rate with Breakfast" 6,500.00, "Rejuvenate Escape" 7,700.00, each "Average price per night excluding taxes", currency selector showing SAR. [OBSERVED-LIVE] 18:49. Source: [RSG accommodation list](https://www.visitredsea.com/en/booking/accommodation-list)
- Those three figures equal Marriott.com's non-member and package rates for the same villa and dates (5,525, 6,500, 7,700 SAR, see section 6). [OBSERVED-LIVE] 18:52. Source: [Marriott rate list](https://www.marriott.com/reservation/rateListMenu.mi)
- The AMAALA widget lists six resorts: Rosewood Resort, Nammos Resort, Six Senses Resort, Equinox Resort, Four Seasons Resort And Residences, Daraah Resort. [OBSERVED-LIVE] 18:50. Source: [amaala.com](https://www.amaala.com/en)
- Six amaala.com resort pages (Rosewood, Nammos, Six Senses, Equinox, Four Seasons, Daraah) contain an "EXPLORE ALL EXPERIENCES" link pointing to a UAT host, https://amaala.uat.webconnectorprojects.com/en/experiences/water-sports/above-water. Not visited. [FETCHED-HTML] 18:49. Source: [amaala Rosewood page](https://www.amaala.com/en/resorts/rosewood-resort-amaala)

Lead-by-lead verdict on "books on the operator's own engine via RSG handoff":

| Lead | RSG handoff? | Operator engine exists and sells the property directly? |
|---|---|---|
| St. Regis Red Sea Resort (Marriott) | Rejected. RSG engine | Confirmed, marriott.com, property code EJHXR [OBSERVED-LIVE] |
| Nujuma, a Ritz-Carlton Reserve (Marriott) | Rejected | Confirmed, ritzcarlton.com form posts to marriott.com/reservation/availabilitySearch.mi, code EJHRZ [OBSERVED-LIVE] |
| The Red Sea EDITION (Marriott) | Rejected | Confirmed, marriott.com, code EJHEB [OBSERVED-LIVE] |
| Six Senses Southern Dunes (IHG brand, own site) | Rejected | Confirmed, sixsenses.com own engine, hotel code RSISD [OBSERVED-LIVE] |
| InterContinental The Red Sea Resort (IHG) | Rejected | Confirmed, ihg.com, hotel code RUHSI [OBSERVED-LIVE] |
| Grand Hyatt The Red Sea (Hyatt) | Not offered on RSG at all | Not verified. hyatt.com blocked automated browsing |
| Miraval The Red Sea (Hyatt) | Rejected. RSG engine | Not verified. hyatt.com blocked |
| SLS The Red Sea (Ennismore/Accor) | Rejected | Confirmed, booking.slshotels.com (Ennismore engine, not all.accor.com) [OBSERVED-LIVE] |
| Raffles The Red Sea (Accor) | Not offered on RSG at all | Confirmed, raffles.com/booking, Accor hotel code B9K9, labelled "Opening Soon" yet selling January 2027 [OBSERVED-LIVE] |
| Fairmont | No Fairmont page exists on visitredsea.com or amaala.com | Not verified. Not researched further |
| Rosewood AMAALA | Rejected. RSG engine on amaala.com | Confirmed, Sabre SynXis at be.synxis.com, Chain 5159, Hotel 97591 [OBSERVED-LIVE] |
| Four Seasons (Shura Island and AMAALA) | Rejected | Confirmed, reservations.fourseasons.com, codes RSI052 and RSI740 [OBSERVED-LIVE] |
| Jumeirah | No Jumeirah page on either RSG site | Not verified |
| Equinox Resort AMAALA | Rejected | Confirmed, SynXis, chain 23412, hotel 98093 [OBSERVED-LIVE] |
| Nammos Resort AMAALA | Rejected | Confirmed, SynXis white-labelled at reservationsamaala.nammoshotels.com, Chain 10205, Hotel 98226 [OBSERVED-LIVE] |
| Jayasom AMAALA (not in the lead list) | Confirmed. Only true handoff | jayasom.com/booking, custom engine [OBSERVED-LIVE] |

### Inferences
- RSG acts as a merchant or distribution channel for operator inventory. Matching non-member rates between RSG and Marriott for the St. Regis suggest RSG is fed the operator's public rate plans, probably through a channel connection, and does not show member rates.
- Raffles and Grand Hyatt are in a gap state on RSG: content pages with policies exist but no inventory is connected. For Raffles the operator engine is ahead of the RSG channel.
- An RSG POC that assumes "send the guest to the operator" would be building something the live sites do not do. The realistic integration surface is RSG's own engine, with operator engines as a competing direct channel and a possible source of price or policy mismatch.

### Gaps
- The amaala.com widget search was not executed, so the AMAALA result URL and domain are inferred from the identical widget, not observed. Needs one search on amaala.com.
- Only one RSG search was run (St. Regis). Whether every one of the other ten Red Sea resorts returns inventory on RSG is not verified. The parallel researcher owns that scope.
- Who is merchant of record on RSG bookings for operator resorts, and how RSG bookings appear in operator systems, is not verified. Requires RSG terms review or a test booking in an authorized environment.

---

## 2. Step-by-step journey per distinct operator engine

### Takeaway
Seven distinct engines were traced to the guest-details page without entering data: Marriott, IHG, Six Senses, Accor brand engine (Raffles), Ennismore (SLS), Four Seasons, and Sabre SynXis (Rosewood, with Equinox and Nammos confirmed on the same platform up to rate list). Jayasom's custom engine was also traced to guest details. Hyatt was fully blocked by bot protection. Shared mechanics are stated only where two properties were actually seen on the same engine.

### Cited Findings

#### 2.1 Marriott (marriott.com). Verified properties: St. Regis Red Sea (full, to guest page), Nujuma and EDITION (to rate list only)

| # | Page title and URL | Visible labels and choices | Required inputs | Validation, price and policy text | Next-step trigger | Observed? |
|---|---|---|---|---|---|---|
| 1 | "The St. Regis Red Sea Resort" property page, marriott.com/en-us/hotels/ejhxr-the-st-regis-red-sea-resort/overview/ | DATES (1 NIGHT), ROOMS & GUESTS (default "1 Room, 1 Adult"), SPECIAL RATES ("Lowest Regular Rate"), "View Rates", "Check Availability". Header "Sign in or Join" | Dates | Defaults to today, 1 night, 1 adult | "View Rates" | [OBSERVED-LIVE] 18:51. I then used the deep link below instead of the widget |
| 2 | "Marriott Find & Reserve - Choose Dates, Rooms & Rates", /reservation/rateListMenu.mi (reached via /reservation/availabilitySearch.mi?propertyCode=...&fromDate=01/12/2027&toDate=01/15/2027&numberOfRooms=1&numberOfAdults=2&childrenCount=0) | Summary bar: STAY DATES (3 NIGHTS), ROOMS & GUESTS "1 Room, 2 Guests", SPECIAL RATES, checkbox "Use Points/Awards", "Edit". Toggle "Show with taxes and fees". Currency button (SAR, USD, AUD, CAD, EUR, GBP, HKD, JPY, MXN, CNY, ZAR, IDR, RUB, KRW, ILS, KES). Room cards with "Room Details", "View Rates". Pagination (2 rooms per page) | None | "Rates from 5,249 SAR Avg / Night, 15,747 Total Per Room". Message "You can select accessible room options after choosing a room." | "View Rates" expands rate plans in place | [OBSERVED-LIVE] 18:52 |
| 3 | Same URL, rates expanded | Rate rows labelled "Member Rate", "Non-Member Rate" or "Package Rate", each with "Select". Banner "Save on this and every stay by joining Marriott Bonvoy at checkout. Membership is free." | Choose one rate | Per-rate cancellation line, for example "Free cancellation before or on Jan 05, 2027" | "Select" | [OBSERVED-LIVE] 18:52 |
| 4 | Page title "Inline", /reservation/reviewguestinformation.mi | "Complete Your Booking". "Room(s) held for 14:54" countdown. "Sign in for Faster Booking". Sections: Guest Information, Join Marriott Bonvoy, Payment Information, "Are you a travel agent?", Room Requests and Accessibility, Hotel Messages, Cancellation policy, Summary of Charges | See data dictionary | "All fields are required unless otherwise stated." Total 25,929.05 SAR | Final button "Book now" (not clicked) | [OBSERVED-LIVE] 18:53. STOPPED HERE |

- Guest count rules in the editor: "Adults (Max: 8 total guests/room)", "Children (Max: 8 total guests/room)", "Age-based rates may be available", one numeric input per child "Child 1: Age (Required)", placeholder "<1", range shown <1 to 17. Ages 5 and 10 carried from the URL parameter childrenAges=5,10. [OBSERVED-LIVE] 18:56. Source: [Marriott rate list](https://www.marriott.com/reservation/rateListMenu.mi)
- Two rooms: numberOfRooms=2 produced "2 Rooms, 2 Guests" (guest count is per room) and prices stay "Total Per Room". [OBSERVED-LIVE] 19:23, EDITION. Source: [Marriott rate list](https://www.marriott.com/reservation/rateListMenu.mi)
- Nujuma: the ritzcarlton.com property page's booking form has action https://www.marriott.com/reservation/availabilitySearch.mi, and the same rateListMenu.mi page rendered for code EJHRZ. Rate rows show only "Non-Member Rate" and "Package Rate". No "Member Rate" row appeared. [OBSERVED-LIVE] 18:54 to 18:55. Source: [Nujuma page](https://www.ritzcarlton.com/en/hotels/ejhrz-nujuma-a-ritz-carlton-reserve/overview/)
- A direct ritzcarlton.com/reservation/availabilitySearch.mi URL returned "404 Not Found". [OBSERVED-LIVE] 18:54
- EDITION: same rateListMenu.mi page for code EJHEB, with Member and Non-Member rows. [OBSERVED-LIVE] 18:55
- Payment fields sit in iframes from secure-fields.marriott.gr4vy.app (titles "Secure Input", "Secure Controller"). Visible labels: "Card Number", "Expiration Date", "Zip/Postal Code". [OBSERVED-LIVE] 18:54. Source: [Marriott guest page](https://www.marriott.com/reservation/reviewguestinformation.mi)
- Language selector on the engine lists Arabic (العربية) among 25+ languages. Arabic inside the engine was not opened. [OBSERVED-LIVE] 18:54

#### 2.2 IHG (ihg.com). Verified property: InterContinental The Red Sea Resort (hotel code RUHSI)

| # | Page title and URL | Visible labels and choices | Required | Price and policy text | Trigger | Observed? |
|---|---|---|---|---|---|---|
| 1 | "Select your room", ihg.com/intercontinental/hotels/us/en/find-hotels/select-roomrate?qCiD=12&qCiMy=002027&qCoD=15&qCoMy=002027&qAdlt=2&qChld=0&qRms=1&qSlH=RUHSI... (month parameter is zero-based) | Bar: DESTINATION, 3 NIGHTS, ROOMS & GUESTS, RATE PREFERENCE "Best Available", Search. Filters: Bed type, Amenities, Select Currency (SAR), Deals & Packages. Payment type: Money, Points + Cash, Points. Checkbox "Includes taxes and fees". "Flexible Dates? Check prices for your 3-night stay". "Book from 24,666 points". Header: "My stays", "Join for free", "Sign in" | None | "20 rooms found". Cards show struck price and member price, "IHG One Rewards Discount", "Excludes taxes", scarcity tags such as "Only 1 room left" | "View prices" per room | [OBSERVED-LIVE] 18:57 |
| 2 | Same page, room expanded | Switch "Apply IHG One Rewards Discount", ON by default. Text "Not a member yet? No worries, you can join for free as you check out." Four rate rows with "Select". Link "View room deals & packages" | Choose rate | See price table | "Select" | [OBSERVED-LIVE] 18:58 |
| 3 | "Add Extras, InterContinental, The Red Sea Resort", .../find-hotels/select-enhance-stay?...qSlRtc=IGCOR&qSlRc=KCSN | "Upgrade your room": "Next-tier room" Junior Suite +1,000 SAR per night, One Bedroom Suite +2,000, Two Bedroom Suite +5,500, each "Add". "Get more points": "Your stay earns 24,689 IHG One Rewards points", "1,000 pts Add for 20 SAR per night". "No thanks, skip it >", "Continue" | None | n/a | "No thanks, skip it" | [OBSERVED-LIVE] 18:58 |
| 4 | "IHG Guest Payment Information", ihg.com/intercontinental/hotels/us/en/pay/payments | "Complete your reservation". Sections: Personal Information, Address Information, Country and phone Information, "Add a Special Request", "Join us as an InterContinental Ambassador" (checkbox "Become an Ambassador today for 225 USD", unchecked), "Pay with: Reserve with payment", Payment Information, accordions (Deposit and Cancellation Policy, Description of Taxes and Additional Charges, Other charges that may apply, Payment Policies, Disclaimers), IHG One Rewards enrolment block, Terms and Conditions | See data dictionary | "Your room will be held until your arrival on the day of your check-in." "You pay nothing today. A card simply holds your reservation." Total 11,193.54 SAR | Final button "Book for 11,193.54 SAR" (not clicked) | [OBSERVED-LIVE] 18:59. STOPPED HERE |

- Language prompt on the payment page: "You are currently viewing this site in English. Would you like to make this your default language? Yes / No". Site language selector on this page offered 2 options. [OBSERVED-LIVE] 18:59. Source: [IHG payment page](https://www.ihg.com/intercontinental/hotels/us/en/pay/payments)
- Scenario B deep link with qChld=2 and qChAge=5, qChAge=10 loaded the page shell but never rendered rooms after about 30 seconds. Children handling on IHG is not verified. [OBSERVED-LIVE] 19:19

#### 2.3 Six Senses (sixsenses.com own engine). Verified: Six Senses Southern Dunes (RSISD) to guest page, Six Senses AMAALA (RSIAM) to rate list

| # | Page title and URL | Visible labels and choices | Required | Price and policy text | Trigger | Observed? |
|---|---|---|---|---|---|---|
| 1 | Property page, sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/southern-dunes-the-red-sea/ | "BOOK NOW" opens overlay "Check availability": Check-in, Check-out, "2 Adults, 0 Children", "Special codes", SEARCH. Two-month calendar with legend "Available", "Minimum stay", "No arrival" | Dates | Calendar colours every day by availability state before search | SEARCH | [OBSERVED-LIVE] 19:00 |
| 2 | "Saudi Arabia Hotel Room & Suite Accommodations", .../accommodation/?src=&Arrive=01/12/2027&Depart=01/15/2027&Rooms=1&Adult=2&Child=0&hotel=RSISD | Sort "PRICE (LOWEST FIRST)", FILTER, currency control (about 150 currencies, SAR marked "Hotel currency"). Room cards with DESCRIPTION, KEY FACTS, AMENITIES, FLOORPLAN, "ADD TO COMPARE", "Sign in to use your points", "BOOK A REWARD NIGHT". Rate rows with "RATE DETAILS" and "RESERVE". Language codes AR EN ES FR HE IT JP PT RU TR VN ZH. Header LOGIN | None | "Total 3 nights (taxes incl.)" plus "Price per night". Member row carries "Not a member yet? Join for free to book this rate." | RESERVE | [OBSERVED-LIVE] 19:01 |
| 3 | "extra", sixsenses.com/en/booking/extra/ | Progress: 1 ACCOMMODATION, 2 EXTRA, 3 GUEST-INFO, 4 BOOKING-CONFIRM. "Extras & enhancements" tabs TRANSFER, WELLNESS & SPA, DINING, EXPERIENCES. Each transfer has "Please select", "Flight number", "Airline", "Pickup date and time". "Skip, continue to checkout", "SKIP - YOU CAN ADD THEM LATER" | None | "The selected 'Extras' are not included in the total room price on the reservation confirmation. Cancellation and payment policies may be different from room rates." | "Skip, continue to checkout" | [OBSERVED-LIVE] 19:03 |
| 4 | "guest-info", sixsenses.com/en/booking/guest-info/ | "Guest information", "Payment Information", "Privacy & Booking Policies", booking summary with "Price Breakdown" and "Cancellation & deposit policies" | See data dictionary | "A valid credit card is required to hold the booking, you will not be charged at the time of booking unless stated in the rate description." | Final button "Confirm Reservation" (not clicked) | [OBSERVED-LIVE] 19:03. STOPPED HERE |

- Currency defaulted to EGP on first load (the test machine is in Egypt). Switching to SAR re-priced every row without a reload of the URL. [OBSERVED-LIVE] 19:01 to 19:02. Source: [Six Senses Southern Dunes results](https://www.sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/southern-dunes-the-red-sea/accommodation/)
- Arabic inside the engine: the /ar/ version of the same results URL rendered with lang="ar" and dir="rtl", Arabic labels for dates, guests, search and sort, room names left in English, prices in SAR. [OBSERVED-LIVE] 19:23
- The hotel selector lists both RSISD and RSIAM, and the AMAALA results page uses the identical layout and rate-row structure. [OBSERVED-LIVE] 19:04. Source: [Six Senses AMAALA results](https://www.sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/amaala/accommodation/)

#### 2.4 Accor brand engine (raffles.com/booking). Verified property: Raffles The Red Sea (Accor code B9K9)

| # | Page title and URL | Visible labels and choices | Required | Price and policy text | Trigger | Observed? |
|---|---|---|---|---|---|---|
| 0 | raffles.com/the-red-sea/ | Label "OPENING SOON". Widget: Check-in, Check-out, Rooms & Guests, "CHECK RATES", "Special Rates & Accessibility". Link "Reserve Your Stay" to permalink.raffles.com/booking/search?client=legacy.raffles&hotelCodes=B9K9&languageCode=en. "MAKE A BOOKING" is a mailto: to Raffles.TheRedSea@raffles.com. "Your bookings" link. Cookie banner with "Continue without Accepting" | n/a | n/a | "Reserve Your Stay" | [OBSERVED-LIVE] 19:05 |
| 1 | "Search for Your Next Stay", raffles.com/booking/en/search?dateIn=2027-01-12&hotelCodes=B9K9&lengthOfStayValue=3&product[0][adultNumber]=2 | Steps 1 SEARCH, 2 CHOOSE, 3 ENHANCE, 4 COMPLETE. Destination, Check-in, Check-out, Room 1 Adults, Children ("Child until 12 years old"), "Accessible room required", "ADD A ROOM", Special Rates (None, AAA/CAA Member, Government, Military & Veteran, Senior Discount, Promo Code), "8-digit IATA Code (Optional)", CHECK RATES. Currency "USD ($US)" default, language EN, "Account" | Dates | "Raffles The Red Sea (Opening Soon)". "Check-in From 2 PM, Check-out Until 12 PM". "BEST PRICE GUARANTEE" | CHECK RATES | [OBSERVED-LIVE] 19:06 |
| 2 | "Choose Your Room", /booking/en/stay?...dateIn=2027-01-12&lengthOfStayUnit=NIGHT&lengthOfStayValue=3&specialRate=none&product[0][adultNumber]=2&product[0][childrenNumber]=0 | Filters: Room type, Bed type, Lagoon view, Meal plan, Free cancellation, Accessible. 8 room cards with "SELECT THIS ROOM". Banner "Get 5% off when you join the ALL Accor loyalty program for free. JOIN OR SIGN IN" | None | "FROM US$2,972 for your stay. Taxes not included: $616.61." | "SELECT THIS ROOM" expands rates, then "CHOOSE THIS RATE" | [OBSERVED-LIVE] 19:06 to 19:07 |
| 3 | "Enhance Your Stay", /booking/en/enhance?...roomType=KGB&rateId=...&rateCode=... | "Upgrade your room: UPGRADE TO LANDMARK SEA VIEW KING ROOM +$159.72, Total $3,782.60". Cart panel with rate, taxes, total | None | "TOTAL Taxes & Fees included $4,374.64 or SAR 16,434.08". "Join for free or sign in to save up to $218.73 on this booking." | CONTINUE | [OBSERVED-LIVE] 19:07 |
| 4 | "Complete Your Reservation", /booking/en/complete?... | "Fields marked with an asterisk (*) are required." "Already a member of ALL Accor? Sign in". Radio pair: join ALL for member rate $4,155.91, or "No, I don't want member savings. I choose the public rate of $4,374.64" (neither preselected). Guest fields, "Stay preference (Optional)", button "Confirm", then heading "Finalize your reservation: Please, confirm your personal information before you can guarantee your reservation." | See data dictionary | Long Accor data-processing notice | "Confirm" on guest block (not clicked). The guarantee and payment block is gated behind it | [OBSERVED-LIVE] 19:07. STOPPED HERE |

- The URL keeps the full state (dates, room type, rate id) at every step. [OBSERVED-LIVE]. Source: [Raffles booking](https://www.raffles.com/booking/en/search)

#### 2.5 Ennismore engine (booking.slshotels.com). Verified property: SLS The Red Sea (hotelCode sls.theredsea-shuraisland)

| # | Page title and URL | Visible labels and choices | Required | Price and policy text | Trigger | Observed? |
|---|---|---|---|---|---|---|
| 0 | slshotels.com/the-red-sea/ | Booking bar: LOCATION, CHECK IN / OUT DATES, ROOMS AND GUESTS "1 room, 2 guests", "GOT A CODE?", CHECK AVAILABILITY. Form is a GET to https://booking.slshotels.com/en-US with fields hotelCode, checkin, checkout, rooms-total, rooms[0].adults, rateCode | Dates | Promo banner "SLS October Affair with 40% off your stay" | CHECK AVAILABILITY | [OBSERVED-LIVE] 19:07 |
| 1 | "Select Your Room, SLS Red Sea", booking.slshotels.com/en-us/availability?checkin=2027-01-12&checkout=2027-01-15&hotelCode=...&rooms[0].adults=2&rooms[0].children=0&rooms-total=1 | Summary: "Jan 12 - Jan 15, 2027, 3 Nights, 2 Guests, 1 Room, EDIT". "Open language and currency settings". 11 room cards, each with a price button "3 nights from SAR ... Inc. Taxes & Fees". "Members sign in" | None | Prices are stay totals including taxes and fees | Price button opens a side drawer with rate plans | [OBSERVED-LIVE] 19:08 |
| 2 | Same URL, rate drawer | Radio-style rate options, each with tags (Pay at hotel or Pay now, Free cancellation or Non-refundable, meal plan), link "Payment & Cancellation Policy", "Stay total". After choosing a radio, button "SELECT THIS RATE". Member option has "JOIN & BOOK NOW" | Choose rate | See price table and policy matrix | "SELECT THIS RATE" | [OBSERVED-LIVE] 19:09 |
| 3 | "Payment, SLS Red Sea", booking.slshotels.com/en-us/sls.theredsea-shuraisland/bookings/{uuid}/payment?publicBookingId={uuid} | "Guest and payment details": Main guest details, Billing details (checkbox "The Main Guest is the Bill Payer", checked), Bill Payer's Contact Information, Payment Information (Stripe iframes titled "Secure payment input frame"), marketing consent, Terms. "Back to rooms". Booking details panel | See data dictionary | "If you have chosen a Flexible Rate, reservations must be secured with a credit or debit card. The payment for the stay will not be taken now but will be due upon check-out using the billing details." "You'll need to authorize the payment now, but we won't take the money until you check-out from the hotel." | Final button "Make booking" (not clicked) | [OBSERVED-LIVE] 19:10. STOPPED HERE |

#### 2.6 Four Seasons (reservations.fourseasons.com). Verified: Red Sea at Shura Island (RSI052) to guest page, AMAALA at Triple Bay (RSI740) to room list

| # | Page title and URL | Visible labels and choices | Required | Price and policy text | Trigger | Observed? |
|---|---|---|---|---|---|---|
| 0 | fourseasons.com/redseashuraisland/ | "CHECK RATES" links to reservations.fourseasons.com/en?hotelCode=RSI052&roomOwsCodes=... per room type | n/a | n/a | CHECK RATES | [OBSERVED-LIVE] 19:10 |
| 1 | "Four Seasons", reservations.fourseasons.com/choose-your-room?hotelCode=RSI052&checkIn=2027-01-12&checkOut=2027-01-15&adults=2&children=0 | Steps 1 PLAN YOUR STAY, 2 CHOOSE YOUR ROOM, 3 CONFIRM YOUR STAY, 4 PERSONALIZE YOUR STAY. FIND A DESTINATION, CHECK IN - CHECK OUT, GUESTS, PROMO CODE, CHANGE SEARCH. Tabs "Choose Room", "Choose Package". FILTER ROOM OPTIONS, SORT BY RATE, CONVERT CURRENCY (54 currencies, SAR shown), ACCESSIBLE ROOMS, toggle ALL-IN PRICE. Header "Sign In", "BEST RATE GUARANTEED" | None | "from SAR 3,750 avg. price per night". Some rooms show "To Book this Room Please Call +966 920 034 456" instead of a price | SELECT ROOM, then "CHOOSE BED OPTION" (One king bed, Two twin beds) | [OBSERVED-LIVE] 19:11 |
| 2 | Same URL, "CHOOSE A PACKAGE" | Package rows with "What's Included" and "SELECT PACKAGE" | Choose package | "FREE CANCELLATION UNTIL JAN 10TH 2027" | SELECT PACKAGE | [OBSERVED-LIVE] 19:11 |
| 3 | reservations.fourseasons.com/confirm-your-stay?_s_icmp=rbf_check_out_guest&bookingType=guest | "Confirm Your Stay". Radios "Booking for myself", "Booking for someone else", "Travel agent booking". Guest Details, Credit Card Details, "Accepted Cards", Terms & Conditions, reservation summary with daily rates and tax lines | See data dictionary | "By selecting Book I acknowledge that Four Seasons will process my personal information as set out in the Four Seasons Privacy Notice." "Free Cancellation until Jan 10th 2027" | Final button "Book" (not clicked). Step 4 "Personalize Your Stay" comes after booking | [OBSERVED-LIVE] 19:11. STOPPED HERE |

- Disclaimer on the room list: "Rates are per room, per night, vary by arrival date and/or length of stay, and may or may not include applicable mandatory property fees (for example resort fees or service charges), gratuities or government-imposed taxes, service charges, levies or surcharges. Early departure fees may apply." [OBSERVED-LIVE] 19:11. Source: [Four Seasons room list](https://reservations.fourseasons.com/choose-your-room)
- Scenario B via URL (adults=2&children=2) was accepted with no age parameter: "1 Room - 2 Adults, 2 Children". Standard rooms switched to "Please Call" and only suites were priced. [OBSERVED-LIVE] 19:20
- Four Seasons AMAALA renders the same page with code RSI740 and a different call number, +966 920 034 118. [OBSERVED-LIVE] 19:12

#### 2.7 Sabre SynXis booking engine. Verified: Rosewood AMAALA (to guest page), Equinox Resort AMAALA and Nammos Resort AMAALA (to rate list)

| # | Page title and URL | Visible labels and choices | Required | Price and policy text | Trigger | Observed? |
|---|---|---|---|---|---|---|
| 0 | rosewoodhotels.com/en/amaala | "RESERVE" links to https://be.synxis.com/?Chain=5159&Hotel=97591&arrive=... Cookie banner with "Reject All" | n/a | n/a | RESERVE | [OBSERVED-LIVE] 19:13 |
| 1 | "Rosewood AMAALA - Reservations - Room Availability", be.synxis.com/?adult=2&arrive=2027-01-12&chain=5159&child=0&currency=SAR&depart=2027-01-15&hotel=97591&level=hotel&locale=en-US&productcurrency=SAR&rooms=1 | Menu ROOMS, ABOUT, MY BOOKINGS, currency (SAR), language (ENGLISH - US), YOUR CART. Search bar Guests, Check-in, Check-out, "SPECIAL CODES OR RATES" (Promo Code, Agent ID). Filters, Sort, "Accessible". Rate rows with "BOOK NOW", "VIEW MORE RATES", "Room Details" | None | "SAR 3,334 Average per night, before taxes. Excluding taxes and fees" | BOOK NOW adds to cart | [OBSERVED-LIVE] 19:13 |
| 2 | "Enhance Your Stay", be.synxis.com/addons?...&sbe_rc=... | "ADD TO YOUR ROOM", category "AIRPORT TRANSPORTATION SERVICE", four transfer items with "ADD TO MY STAY". Cart with EDIT, REMOVE, "ADD A ROOM", CHECKOUT, "CONTINUE TO BOOK" | None | Cart total with tax lines | CHECKOUT | [OBSERVED-LIVE] 19:13 |
| 3 | "Guest Details", be.synxis.com/checkout?... | "Contact Info (* Required)", "Reservation Details" (collapsed), "Special Requests" (collapsed), "Payment", "Policies", "Acknowledgement", "Price Details" | See data dictionary | "We use secure transmission and encrypted storage to protect your personal information." | Final button "Confirm Booking" (not clicked) | [OBSERVED-LIVE] 19:14. STOPPED HERE |

- Equinox Resort AMAALA: equinox-hotels.com/amaala "BOOK NOW" links to be.synxis.com/?chain=23412&hotel=98093. Same SynXis page structure. Its rate rows show both "Per Night" and "Total for 3 nights" and a guarantee line "Guaranteed with Credit Card". Site languages EN and AR. [OBSERVED-LIVE] 19:17. Source: [Equinox AMAALA](https://equinox-hotels.com/amaala/)
- Nammos Resort AMAALA: nammoshotels.com/amaala "BOOK NOW" links to reservationsamaala.nammoshotels.com/?Hotel=98226&Chain=10205, which normalises to the same SynXis parameter set and page structure on the Nammos subdomain. The property page title still reads "Opening 2026". [OBSERVED-LIVE] 19:18. Source: [Nammos AMAALA](https://www.nammoshotels.com/amaala)
- Scenario B on Rosewood: URL parameters child=2&childages=5|10 were retained and the header read "2 adults, 2 children". [OBSERVED-LIVE] 19:20. Source: [Rosewood SynXis](https://be.synxis.com/?Chain=5159&Hotel=97591)

#### 2.8 Jayasom custom engine (jayasom.com/booking). The only RSG handoff target

| # | Page and URL | Visible labels and choices | Required | Price and policy text | Trigger | Observed? |
|---|---|---|---|---|---|---|
| 1 | "JAYASOM Wellness Resort - Amaala, Book Your Journey", jayasom.com/booking (URL never changes) | "PLAN YOUR RETREAT". DESTINATION radio: "Jayana, Adults" (default) or "Jayela, Families". ARRIVAL, DEPARTURE, NIGHTS. ADULTS stepper (2), ROOMS stepper (1). "Have a promo code?". Header: MANAGE BOOKING, phone +966 14 514 4000, WhatsApp, currency SAR. Cookie banner Accept / Decline | Dates | "Our stays start from one night - how long is entirely up to you." | "PROCEED, AND SELECT YOUR WELLNESS RETREAT" | [OBSERVED-LIVE] 19:14 |
| 1a | Same, Scenario A dates | Modal "No availability. There is no room availability for the selected number of guests, rooms, or dates. Please try again by changing the number of rooms or dates." DISMISS | n/a | n/a | n/a | [OBSERVED-LIVE] 19:15 |
| 2 | Step 1 of 4 "Select Retreat" (8 to 11 Dec 2026) | Steps: 1 Select Retreat, 2 Select Room, 3 Guest Details, 4 Confirmation. Tabs "Lead Guest", "Guest 2", one retreat choice per guest. Card "ESSENCE OF JAYASOM, MIN. 1 NIGHT", "VIEW DETAILS", "Select". "YOUR JOURNEY SUMMARY". BACK, CONTINUE | A retreat for each guest | "PRICE FOR 3 NIGHTS SAR 7,200 / person, full retreat" | CONTINUE | [OBSERVED-LIVE] 19:15 |
| 3 | Step 2 of 4 "Select Your Room or Villa" | Room cards with quantity steppers. Terrace rooms "PER NIGHT INCLUDED IN THE RATE", "One Bedroom Pool Villa - Beachfront PER NIGHT +SAR 2,100" | One room | Summary with tax lines, total SAR 17,388 | CONTINUE | [OBSERVED-LIVE] 19:16 |
| 4 | Step 3 of 4 "Guest Details" | Per guest: Title, First Name, Last Name, Email Address, Phone Number, Age (optional), Gender (optional), Airport Transfer selects, "Apply same travel information to all guests", "MAKE LEAD", "+ ADD GUEST". Booking Policies. Two agreement statements | See data dictionary | "We will send a wellness questionnaire to this email address." | Final button "CONFIRM BOOKING" (not clicked). No card fields on this page | [OBSERVED-LIVE] 19:16. STOPPED HERE |

#### 2.9 Hyatt (hyatt.com). Grand Hyatt The Red Sea (rsigh), Miraval The Red Sea (rsiob). BLOCKED
- https://www.hyatt.com/shop/rooms/rsigh?checkinDate=2027-01-12&checkoutDate=2027-01-15&rooms=1&adults=2&kids=0 returned a blank document containing only a Kasada challenge script (window.KPSDK, /149e9513-.../ips.js). No content rendered after 13 seconds. [OBSERVED-LIVE] 19:04. Source: [Hyatt shop URL](https://www.hyatt.com/shop/rooms/rsigh)
- The property page https://www.hyatt.com/grand-hyatt/en-US/rsigh-grand-hyatt-the-red-sea returned the same challenge-only document. [OBSERVED-LIVE] 19:05
- Static fallback also failed: WebFetch on the Miraval policies page and the Grand Hyatt hotel-info page both returned "HTTP 403 Forbidden". No Hyatt content was obtained by any method. [FETCHED-HTML attempt, failed]. Source: [Miraval policies](https://www.hyatt.com/en-US/hotel/saudi-arabia/miraval-the-red-sea/rsiob/policies)
- I did not try to get around the challenge.

### Inferences
- Rosewood, Equinox and Nammos share one vendor platform (SynXis) but are three separate chain configurations (5159, 23412, 10205). Page structure is shared. Rate labels, guarantee wording and add-ons are per hotel.
- Marriott, IHG, Six Senses and Four Seasons guest pages have no query parameters, so state lives in a server session. Raffles and SynXis carry state in the URL, and SLS in a booking UUID. Back-button and refresh behaviour will differ accordingly. This was not tested by actually pressing Back.
- Marriott is the only engine that displayed an explicit inventory hold and timer. SLS creating a booking UUID before guest details suggests a server-side draft, possibly with a hold that is not surfaced.

### Gaps
- Hyatt: every step. Needs a human in a normal browser, or an authorized test environment with allow-listed access.
- Marriott guest page for Nujuma and EDITION: not opened, to avoid creating further timed holds. The "same flow" claim for those two is verified only up to the rate list.
- Raffles payment and guarantee block: hidden until the guest block is confirmed with real data.
- Post-submit steps everywhere (review, confirmation, Four Seasons step 4, Jayasom step 4, 3-D Secure or OTP): not reachable under the stop rules.
- IHG with children, Raffles with children, SLS with children, Six Senses with children: not run.
- Back navigation, unavailable-date messaging and session expiry were not systematically tested on each engine. Observed only: Jayasom's no-availability modal and Marriott's 15-minute hold countdown.

---

## 3. Account or loyalty requirement, guest checkout, and what is gated

### Takeaway
Every engine reached offers guest checkout. Loyalty is pushed hard rather than required: member prices are shown by default on IHG, enrolment is pre-ticked on Marriott, and Accor, Six Senses and SLS each hold back one cheaper rate for members.

### Cited Findings
- Marriott: header "Sign In or Join", "Sign in for Faster Booking" on the guest page, guest fields available without sign-in. Checkbox "Join Marriott Bonvoy now for free." was already checked on load. Checkbox "I would like to receive personalized communications, including offers, details about promotions, and travel-related products from the Marriott Group via email." was also already checked. Note under Member Number: "To be credited for this stay, the name on your Marriott Bonvoy account must match the guest name." "Use Points/Awards" checkbox on the rate list. [OBSERVED-LIVE] 18:53. Source: [Marriott guest page](https://www.marriott.com/reservation/reviewguestinformation.mi)
- Marriott member versus non-member, St. Regis Dune Villa: Flexible 6,370 member versus 6,500 non-member per night. Stay Longer On Us 5,249 member versus 5,525 non-member. [OBSERVED-LIVE] 18:52
- Nujuma showed no member-rate rows. [OBSERVED-LIVE] 18:55
- IHG: switch "Apply IHG One Rewards Discount" is ON by default, so list prices show the member price with the public price struck through (2,231 versus 2,348 SAR). Turning it off shows public prices. Guest checkout page was reached with the public rate. The enrolment block reads "Join the free IHG One Rewards and instantly enjoy these benefits. Already a member? Sign In for faster booking. Enroll for free as you book". A checkbox with id "non-member-rate-checkbox" was in the checked state in that block. Its exact label binding was not confirmed. Points payment options (Points + Cash, Points) appear on the rate list. [OBSERVED-LIVE] 18:58 to 18:59. Source: [IHG payment page](https://www.ihg.com/intercontinental/hotels/us/en/pay/payments)
- Six Senses: "Member Exclusive Best Flex" carries "Not a member yet? Join for free to book this rate." "Sign in to use your points" and "BOOK A REWARD NIGHT" appear on room cards. Guest checkout reached for the public Best Flexible Rate. [OBSERVED-LIVE] 19:01 to 19:03. Source: [Six Senses results](https://www.sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/southern-dunes-the-red-sea/accommodation/)
- Raffles/Accor: each rate shows "Public" and "Member" prices and "Sign in or join to book the member rate". On the Complete page the guest must pick one of two radios, join ALL for the member rate or keep the public rate. Neither is preselected. "Already a member of ALL Accor? Sign in". [OBSERVED-LIVE] 19:07. Source: [Raffles complete page](https://www.raffles.com/booking/en/complete)
- SLS/Ennismore: "20% OFF FLEXIBLE RATE, Membership rate, Members save: SAR 2,245.22. Sign up to our Dis-loyalty membership to receive this exclusive flexible rate", button "JOIN & BOOK NOW". Other rates proceed without an account. [OBSERVED-LIVE] 19:09. Source: [SLS availability](https://booking.slshotels.com/en-us/availability)
- Four Seasons: selecting a package went straight to confirm-your-stay with bookingType=guest. "Sign In" is optional in the header. No member pricing seen. [OBSERVED-LIVE] 19:11. Source: [Four Seasons confirm page](https://reservations.fourseasons.com/confirm-your-stay)
- SynXis (Rosewood, Equinox, Nammos): no loyalty prompt, no sign-in on the path. "MY BOOKINGS" in the menu. [OBSERVED-LIVE] 19:13 to 19:18
- Jayasom: no account prompt on the path. [OBSERVED-LIVE] 19:16

### Inferences
- An RSG channel that only carries public rates will always look more expensive than the operator's member price by roughly 2 to 5 percent on Marriott, IHG and Accor, and 20 percent on SLS's member flexible rate.

### Gaps
- Whether choosing a member-labelled rate forces sign-in or enrolment before the guest page: not tested on any engine, because it would require starting enrolment.
- Points redemption flows: not tested (sign-in required).

---

## 4. Personal details requested on each guest form (field-level data dictionary)

### Takeaway
Forms range from four fields (Rosewood on SynXis) to a full postal address plus nationality (Accor). No engine asked for date of birth, ID or passport at booking. Nationality is asked only by Accor. Flight details are asked only as optional transfer add-ons (Six Senses, Jayasom).

### Cited Findings

| Field label | Purpose stated by the interface | Required/optional | Format/options | Validation observed | Conditional trigger | Journey step | Property/channel scope | Source |
|---|---|---|---|---|---|---|---|---|
| First Name | none stated | Required ("All fields are required unless otherwise stated") | text | none (nothing typed) | none | Guest page | Marriott, St. Regis | [Marriott guest page](https://www.marriott.com/reservation/reviewguestinformation.mi) |
| Last Name | none stated | Required | text | none | none | Guest page | Marriott | same |
| Email Address | none stated | Required | text | none | none | Guest page | Marriott | same |
| Member Number | "To be credited for this stay, the name on your Marriott Bonvoy account must match the guest name." | Optional (placeholder "Optional") | text | none | none | Guest page | Marriott | same |
| Mobile Phone | "By providing your phone number, you agree that we may contact you via SMS regarding your stay and other important updates." | Required | country-code select (247 options, default "(+1) USA") plus tel input | none | none | Guest page | Marriott | same |
| Country/Region | none | Required | select, 244 options, default USA | none | State list follows country | Guest page | Marriott | same |
| Address Line 1 | none | Required | text | none | none | Guest page | Marriott | same |
| Address Line 2 | none | Optional | text | none | none | Guest page | Marriott | same |
| City | none | Required | text | none | none | Guest page | Marriott | same |
| State/Province | none | Required as shown for USA | select, 63 options | none | Depends on country | Guest page | Marriott | same |
| Zip Code | none | Required | text | none | none | Guest page | Marriott | same |
| Join Marriott Bonvoy now for free. | "Free Wi-Fi + mobile check-in + our lowest member rates all the time" | Optional, pre-checked | checkbox | n/a | Unlocks marketing consent wording | Guest page | Marriott | same |
| Marketing email consent | personalized communications from the Marriott Group | Optional, pre-checked | checkbox | n/a | none | Guest page | Marriott | same |
| Card Number, Expiration Date, Zip/Postal Code | "A valid form of payment must be presented at check-in." "Pay using a Credit/Debit Card" | Required | gr4vy hosted iframes | not tested | none | Guest page | Marriott | same |
| IATA Number | "For travel agents" | Optional | text | none | Expands under "Are you a travel agent?" | Guest page | Marriott | same |
| Room Features, Room Location | "Request Only". Options: Extra towels, Crib or pack and play (Fees may apply), Rollaway bed (Fees may apply), Extra feather pillows, Extra foam pillows, Foam pillows, Feather free room, High floor, Low floor, Near elevator | Optional | checkboxes with Apply / Clear All | n/a | Expands under "Room Requests and Accessibility" | Guest page | Marriott | same |
| First Name, Last Name | none | No asterisk or required attribute visible | text | none | "Add guest names" button adds more | Payment page | IHG, InterContinental | [IHG payment page](https://www.ihg.com/intercontinental/hotels/us/en/pay/payments) |
| Email Address | none | not marked | email | none | none | Payment page | IHG | same |
| Country/Region, Address, Additional Address Information, City/Town, Postal Code | "Address Information" | not marked | select (251) and text | none | State select appears for some countries | Payment page | IHG | same |
| Country/Region Code, Phone Number | "Country and phone Information" | not marked | select (251) and tel | none | none | Payment page | IHG | same |
| Special Request | none | Optional | text area revealed by "Add a Special Request" | none | button click | Payment page | IHG | same |
| Become an Ambassador today for 225 USD | paid InterContinental Ambassador membership | Optional, unchecked | checkbox | n/a | none | Payment page | IHG, InterContinental brand | same |
| Card Number, Expiration (MM, YY) | "You pay nothing today. A card simply holds your reservation." | Required for "Reserve with payment" | text and selects (years 26 to 45). No CVV field seen | none | none | Payment page | IHG | same |
| Title | none | Optional | Mr., Mrs., Ms., Dr., Prof., Prince, Princess, Sheikh, Sheikhah | none | none | Step 3 guest-info | Six Senses Southern Dunes | [Six Senses guest-info](https://www.sixsenses.com/en/booking/guest-info/) |
| First Name*, Last Name*, E-mail Address* | none | Required | text | none | none | Step 3 | Six Senses | same |
| Country*, Address*, Address additional information, City*, Postal Code*, Phone* | none | Required except additional address line | select (238) and text/tel | none | none | Step 3 | Six Senses | same |
| Payment Type*, Card Number*, Cardholder Name*, Month, Year, Security Code* | "A valid credit card is required to hold the booking, you will not be charged at the time of booking unless stated in the rate description." | Required | Card types: American Express, Visa, Mastercard, Diners Club, Carte Blanche, EURO credit card, JCB International, China UnionPay. Native inputs on the page, not an iframe | none | none | Step 3 | Six Senses | same |
| "I have read and agree to the above booking policies and the data privacy policy." | consent | Required, unchecked | checkbox | n/a | none | Step 3 | Six Senses | same |
| "I agree to receive marketing communications via email." | consent | Optional, unchecked | checkbox | n/a | none | Step 3 | Six Senses | same |
| Transfer: Flight number, Airline, Pickup date and time | airport transfer add-on | Optional (only if a transfer is added) | text and date-time | none | Appears per transfer product | Step 2 extras | Six Senses | [Six Senses extras](https://www.sixsenses.com/en/booking/extra/) |
| Title* | none | Required | Ms., Professor, Mr, Mrs, Doctor | none | none | Step 4 Complete | Raffles (Accor) | [Raffles complete](https://www.raffles.com/booking/en/complete) |
| First name*, Last name* | "LET'S GET ACQUAINTED" | Required | text | none | none | Step 4 | Raffles | same |
| Nationality* | "To help the hotelier to welcome you" | Required | select, 249 options | none | none | Step 4 | Raffles | same |
| Phone number* | "We'll only call you if there are questions about your booking." | Required | dial-code select (245) plus tel, placeholder "(XXX) XXX-XXXX" | none | none | Step 4 | Raffles | same |
| Email address* | "This is where we will send the confirmation email." | Required | email | none | none | Step 4 | Raffles | same |
| Country / Region*, State* | "Where do you live ?" | Required | selects (248, 52). State shown for default United States | none | State depends on country | Step 4 | Raffles | same |
| Newsletter opt-in | "I accept that Accor sends me by e-mail the news and personalized offers of the Raffles brand" | Optional, unchecked | checkbox | n/a | none | Step 4 | Raffles | same |
| Stay preference (Optional) | "Specify the reason for your stay if necessary or if you have any requests" | Optional | free text | none | none | Step 4 | Raffles | same |
| ALL membership choice | member rate versus public rate | One must be chosen (inferred from layout), none preselected | radio | not tested | none | Step 4 | Raffles | same |
| Title (optional), First name, Last name, Email | "Please provide the details of the main guest on this booking" | First, last, email required | select (Mr, Mrs, Ms, Dr, plus one more) and text | none | none | Payment page | SLS The Red Sea | [SLS payment page](https://booking.slshotels.com/en-us/availability) |
| "Any special requests or information for the hotel? (optional)" | special requests | Optional | textarea | none | none | Payment page | SLS | same |
| The Main Guest is the Bill Payer | billing | Checked by default | checkbox | n/a | Unchecking presumably frees the billing name fields (not tested) | Payment page | SLS | same |
| Billing First name, Last name, Billing address, City, Country, Postcode / ZIP Code | billing details | Required except postcode | text, select (251) | none | none | Payment page | SLS | same |
| Bill payer Email | "We'll send a copy of the confirmation to this address" | Required | email | none | none | Payment page | SLS | same |
| Bill payer Phone | "We'll only contact you in relation to this booking" | Required | tel | none | none | Payment page | SLS | same |
| Marketing consent | "I consent to receive email marketing communications from the Ennismore Group, including offers, promotions, and updates from our brands and venues." | Optional, unchecked | checkbox | n/a | none | Payment page | SLS | same |
| "I agree to all Terms & Conditions" | consent | Required, unchecked | checkbox | n/a | none | Payment page | SLS | same |
| Card details | "You'll need to authorize the payment now, but we won't take the money until you check-out from the hotel." | Required | Stripe Elements iframes | not tested | none | Payment page | SLS | same |
| Booking type | "Booking for myself", "Booking for someone else", "Travel agent booking" | One selected | radio | n/a | Other choices presumably add fields (not tested) | Step 3 | Four Seasons Shura Island | [Four Seasons confirm](https://reservations.fourseasons.com/confirm-your-stay) |
| First Name*, Last Name* | none | Required | text | none | none | Step 3 | Four Seasons | same |
| Mobile Phone Number* | none | Required | dial-code select plus tel | none | none | Step 3 | Four Seasons | same |
| Email Address*, Confirm Email Address* | none | Required | email, entered twice | none | none | Step 3 | Four Seasons | same |
| Country/Region* | none | Required | select, 243 options | none | none | Step 3 | Four Seasons | same |
| Name On Card*, Credit Card Number*, Expiry Month, Year | "Credit Card Details", "Accepted Cards" | Required | native inputs. No CVV field seen | none | none | Step 3 | Four Seasons | same |
| "I have read & accepted the Terms & Conditions" | consent | Required, unchecked | checkbox | n/a | none | Step 3 | Four Seasons | same |
| Marketing consent | "I consent to Four Seasons sending me electronic communications ... You may withdraw this consent at any time by emailing guest.historian@fourseasons.com." | Optional, unchecked | checkbox | n/a | none | Step 3 | Four Seasons | same |
| Prefix | none | Optional | select | none | none | Guest Details | Rosewood AMAALA (SynXis) | [Rosewood checkout](https://be.synxis.com/checkout) |
| First Name *, Last Name *, Email Address * | "This is the email we will send your confirmation to." | Required | text, email | none | none | Guest Details | Rosewood | same |
| Reservation Details, Special Requests | collapsed sections, content not opened | not verified | not verified | none | expand | Guest Details | Rosewood | same |
| Card Number *, Expiration Date (MM/YY) *, Name on Card * | "We use secure transmission and encrypted storage to protect your personal information." | Required | native inputs. No CVV field seen | none | none | Guest Details | Rosewood | same |
| "* I agree with the Privacy Terms." | consent, plus "By completing this booking, I agree with the Booking Conditions." | Required, unchecked | checkbox | n/a | none | Guest Details | Rosewood | same |
| Title | none | not marked | Ms, Mrs, Mr, Dr | none | none | Step 3 | Jayasom AMAALA | [Jayasom booking](https://www.jayasom.com/booking) |
| First Name *, Last Name *, Email Address * | "We will send a wellness questionnaire to this email address." | Required for lead guest. Guest 2 name and email inputs were not flagged required in the DOM although labels carry asterisks | text, email | none | none | Step 3 | Jayasom | same |
| Phone Number * | none | Required for both guests | dial-code select (15 options, default "+966 (SA)") plus tel "5XX XXX XXXX" | none | none | Step 3 | Jayasom | same |
| Age (optional) | none | Optional | number, "e.g. 34" | none | none | Step 3 | Jayasom | same |
| Gender (optional) | none | Optional | Female, Male, Prefer not to say | none | none | Step 3 | Jayasom | same |
| Need airport pickup? * | "A dedicated member of our Guest Experience Team will personally contact you before your arrival to arrange and confirm your transfer" | Required | Select, with pickup from Al Wajh Airport, Red Sea Airport, Tabuk Airport, Neom Airport (plus one further option not captured) | none | none | Step 3 | Jayasom | same |
| Know flight details? * | transfer planning | Required | Select: Yes, Not yet | none | "Yes" presumably reveals flight fields (not tested) | Step 3 | Jayasom | same |

- Not asked on any engine reached: date of birth, passport or national ID, arrival time as a standalone field. [OBSERVED-LIVE] across the pages above.

### Inferences
- Accor is the only operator that will hold nationality for an RSG guest booked direct. If RSG needs nationality for Saudi guest registration, the other operators collect it at check-in, not at booking.
- Four Seasons, Rosewood and IHG take card number and expiry without a CVV field at this stage, which is consistent with a guarantee rather than an immediate charge.

### Gaps
- Field validation messages were not triggered anywhere, because no input was typed and no submit was clicked.
- Marriott, IHG and SLS card fields are inside hosted iframes whose inner labels were not all readable.
- Hyatt form: not verified.

---

## 5. Price observations (test scenario only, not quotes)

### Takeaway
All prices below are single observations for the stated scenario on 12 October 2026. Tax presentation differs by engine: some show pre-tax nightly averages, some tax-inclusive stay totals. Effective tax where itemised was 20.75 percent everywhere, and Marriott added a separate transfer charge for the St. Regis.

### Cited Findings

| Property | Dates | Guests/rooms | Accommodation and rate plan | Currency | Amount | Inclusions/exclusions | Timestamp (UTC) | Conditions |
|---|---|---|---|---|---|---|---|---|
| St. Regis Red Sea (marriott.com) | 12-15 Jan 2027 | 2 adults, 1 room | Dune Villa 1 Bedroom, Flexible Rate with Breakfast, Non-Member | SAR | 6,500 avg/night, 19,500 total per room pre-tax. With taxes and fees 8,643 avg/night, 25,929 total | "Includes breakfast for 2 guests at Nesma Restaurant" | 18:52 | Free cancellation before or on Jan 05, 2027 |
| same | same | same | same room, Member Rate Flexible with Breakfast ("MOST POPULAR") | SAR | 6,370 avg/night, 19,110 total. With taxes 8,486 / 25,458 | breakfast for 2 daily | 18:52 | Free cancellation before or on Jan 05, 2027. Member rate |
| same | same | same | Stay Longer On Us, Member / Non-Member | SAR | 5,249 / 5,525 avg/night. 15,747 / 16,575 total. With taxes 21,397 / 22,397 total | "Save 10% or more as you stay longer, includes breakfast" | 18:52 | Free cancellation before or on Jan 05, 2027 |
| same | same | same | Rejuvenate Escape, Package Rate | SAR | 7,700 avg/night, 23,100 total. With taxes 30,276 total | "breakfast daily, one spa treatment per stay" | 18:52 | "prepay in full, non-refundable if cancelled more than 1 day after booking" |
| same | same | same | Sunset Dune Villa 1 Bedroom, lowest rate | SAR | from 5,653 avg/night, 16,959 total | not expanded | 18:52 | rate plan not opened |
| St. Regis, charge breakdown for the Non-Member Flexible rate | same | same | Summary of Charges on guest page | SAR | 3 x 6,500.00 = 19,500.00 "Total Cash Rate". "Estimated Government Taxes and Fees" 4,046.25. "Transfer / Transportation Charge" 2,382.80. "Total for Stay" 25,929.05 | "Changes to taxes or fees implemented after booking will affect the total room price" | 18:54 | The page also showed a US credit-card promotion line "eGiftCard - 250.00 USD", unrelated to the rate |
| St. Regis (marriott.com), Scenario B | 14-18 Mar 2027 | 2 adults, 2 children (5, 10), 1 room | Sunset Dune Villa 2 Bedroom (King + Queen, or King + 2 Twin) | SAR | from 11,760 avg/night, 47,040 total per room | not expanded | 18:56 | Only two-bedroom villas were offered for 4 guests |
| St. Regis on RSG's own engine (comparison) | 12-15 Jan 2027 | 2 adults | One Bedroom Dune Villa: Stay Longer On Us / Flexible Rate with Breakfast / Rejuvenate Escape | SAR | 5,525.00 / 6,500.00 / 7,700.00 | "Average price per night excluding taxes" | 18:49 | visitredsea.com, not an operator engine |
| Nujuma (marriott.com) | 12-15 Jan 2027 | 2 adults | Sunset Beach Villa 1 Bedroom: Flexible Rate with Breakfast (Non-Member) | SAR | 11,263 avg/night, 33,789 total, "Taxes and all fees included" | breakfast | 18:55 | Free cancellation before or on Jan 05, 2027 |
| same | same | same | Stay Longer On Us (Package Rate) | SAR | 9,692 / 29,078 incl. taxes and fees | "Save 10% or more as you stay longer, includes breakfast" | 18:55 | Free cancellation before or on Jan 05, 2027 |
| same | same | same | Celestial Wellness Package | SAR | 12,591 / 37,774 incl. | "breakfast daily, 60 min spa treatment per stay" | 18:55 | Free cancellation before or on Jan 05, 2027 |
| same | same | same | An Extraordinary Honeymoon Experience by the Red Sea | SAR | 12,869 / 38,607 incl. | breakfast for 2, one in-villa dinner for 2, 60 min spa treatment | 18:55 | "prepay in full, non-refundable if cancelled less than 21 days before arrival" |
| same | same | same | Water Villa / Sunset Water Villa, lowest | SAR | from 11,745 / 12,258 avg/night incl. (35,237 / 36,776 total) | not expanded | 18:55 | |
| The Red Sea EDITION (marriott.com) | 12-15 Jan 2027 | 2 adults | Superior King, Golf view, Terrace: Flexible Rate with Breakfast, Member / Non-Member | SAR | 2,587 / 2,640 avg/night. 7,761 / 7,920 total, pre-tax | "Includes breakfast daily" | 18:56 | Free cancellation before or on Jan 05, 2027 |
| same | same | same | Member Stay Longer and Save with Breakfast (Package) | SAR | 2,199 / 6,597 pre-tax | breakfast | 18:56 | Free cancellation before or on Jan 05, 2027 |
| same | same | same | Stay Longer On Us (Package) | SAR | 2,244 / 6,732 pre-tax | breakfast | 18:56 | same |
| same | same | same | Re_VIVE (Package) | SAR | 3,940 / 11,820 pre-tax | "breakfast daily, one spa treatment per stay" | 18:56 | same |
| InterContinental The Red Sea (ihg.com) | 12-15 Jan 2027 | 2 adults | 1 King Classic: Stay Longer Pay Less With Breakfast | SAR | 2,348 per night public, 2,231 with IHG One Rewards Discount, excludes taxes | Free Breakfast | 18:58 | Non-refundable, Pay in advance |
| same | same | same | Book Early & Save | SAR | 2,472 public, 2,348 member | Free Breakfast | 18:58 | Non-refundable, Pay in advance |
| same | same | same | Best Flexible Rate | SAR | 3,090 public, 2,936 member. Stay: 3 x 3,090.00 + taxes 1,923.54 = 11,193.54 | Free Breakfast. "Taxes 15.75 Percent VAT, 5 Percent Municipality Tax" | 18:58 to 18:59 | "Fully refundable before Jan 12, 2027. No prepayment needed - pay at the property" |
| same | same | same | Dinner, Bed And Breakfast | SAR | 3,690 per night | Free Breakfast, Includes dinner | 18:58 | Fully refundable before Jan 12, 2027 |
| same | same | same | Other room types, member "From" prices | SAR | Classic Lagoon View 2,592. Classic Sea View 2,772. Classic Beachfront 3,043. Junior Suite 3,133. Club Beachfront 3,404. 1 Bedroom Suite 4,036. 2 Bedroom Family Suite 7,195. Red Sea Suite 11,166 | excludes taxes | 18:57 | "20 rooms found" |
| Six Senses Southern Dunes (sixsenses.com) | 12-15 Jan 2027 | 2 adults | Wadi King Room: The Red Sea Residents Escape | SAR | 9,660 total 3 nights "taxes incl.", 3,220 per night | Breakfast included | 19:02 | Free cancellation 2 days prior to stay. Eligibility for "Residents" not checked |
| same | same | same | Winter Couples Escape | SAR | 11,592 / 3,864 | Breakfast included | 19:02 | Free cancellation 2 days prior |
| same | same | same | Member Exclusive Best Flex | SAR | 13,620.60 / 4,540.20 | Breakfast included | 19:02 | Member only |
| same | same | same | Best Flexible Rate | SAR | 14,490 / 4,830 | "daily breakfast with Arabic welcome amenities and WiFi ... use of wellness facilities as well as swimming pool" | 19:02 | See policy matrix |
| same | same | same | Journey To Wellness | SAR | 14,490 / 4,830 | Breakfast included | 19:02 | Free cancellation 7 days prior |
| same, first load in EGP | same | same | Best Flexible Rate | EGP | 193,938.51 total, 64,646.17 per night | same | 19:01 | Display currency auto-set by visitor location |
| Six Senses AMAALA (sixsenses.com) | 12-15 Jan 2027 | 2 adults | Lagoon Suite: Time For Two | SAR | 13,041 total, 4,347 per night, taxes incl. | Breakfast included | 19:04 | Free cancellation 2 days prior |
| same | same | same | Taste Of Amaala - Half Board | SAR | 13,856.07 / 4,618.69 | Breakfast and dinner included | 19:04 | Free cancellation 14 days prior |
| same | same | same | Member Exclusive Best Flex / Best Flexible Rate | SAR | 15,323.19 (5,107.73) / 16,301.25 (5,433.75) | Breakfast included | 19:04 | Free cancellation 2 days prior |
| Raffles The Red Sea (raffles.com) | 12-15 Jan 2027 | 2 adults | Signature King Room: Stay Longer And Save Rate - Breakfast Included | USD | Public 2,972 for stay (991 avg/night), Member 2,824 (942). Taxes not included: 616.61 | Breakfast included | 19:07 | Guarantee: Online payment. Non-refundable |
| same | same | same | Flexible Rate - Breakfast Included | USD | Public 3,623 (1,208), Member 3,442 (1,148). Taxes 751.75. Cart: 3,622.89 + 751.75 = 4,374.64 "or SAR 16,434.08" | Breakfast included | 19:07 | No prepayment required. Cancel free of charge until Jan 9th 6:00 PM |
| same | same | same | Stay Longer And Save Rate - Half Board | USD | Public 3,771 (1,257), Member 3,582 (1,194). Taxes 782.31 | Half board | 19:07 | Online payment. Non-refundable |
| same | same | same | Flexible Rate - Half Board | USD | Public 4,422 (1,474), Member 4,201 (1,401). Taxes 917.45 | Half board | 19:07 | No prepayment. Cancel free until Jan 9th 6:00 PM |
| SLS The Red Sea (booking.slshotels.com) | 12-15 Jan 2027 | 2 adults | Delight King With Terrace: Advance Saver With Breakfast | SAR | 9,451.64 stay total, Inc. Taxes & Fees | Breakfast included | 19:09 | Pay now, Non-refundable. "Payment is due through Pay-By-Link that you will receive via email and must be made before check-in." |
| same | same | same | Flexible Rate With Breakfast | SAR | 10,863.87 stay total incl. (avg nightly 3,621.29) | Breakfast included | 19:09 to 19:10 | Pay at hotel, Free cancellation |
| same | same | same | Flexible Rate With Half Board / Advance Saver With Half Board | SAR | 12,675.12 / 11,262.89 incl. | Half board, set menu dinner | 19:09 | Pay at hotel / Pay now, non-refundable |
| same | same | same | 20% OFF FLEXIBLE RATE (membership) | SAR | 8,980.89, shown against 11,226.11 | no meal plan stated | 19:09 | Dis-loyalty members. Free cancellation and amendments until one day prior to check-in (3pm), then first night charged |
| Four Seasons Red Sea at Shura Island | 12-15 Jan 2027 | 2 adults | Garden-View Room, one king bed, Bed and Breakfast | SAR | 3,750.00 per night x 3 = 11,250.00. VAT (15% of room rate) 1,687.50. Municipality Tax (5% of VAT) 84.39. Municipality Tax (5% of room rate) 562.50. Estimated Total 13,584.39 | "Start each day with a signature Four Seasons breakfast." | 19:11 | Free cancellation until Jan 10th 2027 |
| same | same | same | Garden-View Room, Golf Package | SAR | 4,750 avg/night | "18 holes, access to the practice range and breakfast" | 19:11 | Free cancellation until Jan 10th 2027 |
| same | same | same | Other rooms, "from" avg/night | SAR | Sea-View Room 4,250. Beachfront Room 4,750. Sea-View Suite 9,000. Premier Sea-View Suite 12,000. Grand Sea-View Suite 45,000 | pre-tax | 19:11 | Sea-View Accessible Room and Presidential Suite: call to book |
| same, Scenario B | 14-18 Mar 2027 | 2 adults, 2 children | Sea-View Suite / Premier Sea-View Suite / Grand Sea-View Suite | SAR | from 9,000 / 12,000 / 45,000 avg/night | pre-tax | 19:20 | Standard rooms showed "Please Call" |
| Four Seasons AMAALA at Triple Bay | 12-15 Jan 2027 | 2 adults | Superior Room with Terrace / Deluxe Sea-View Room with Terrace | SAR | from 3,300 / 3,500 avg/night | pre-tax, package not opened | 19:12 | |
| Rosewood AMAALA (SynXis) | 12-15 Jan 2027 | 2 adults | Sea View Private Pool Pavilion, "More Rosewood 3rd Night Complimentary" | SAR | 3,334 average per night before taxes | not expanded | 19:13 | |
| same | same | same | Sea View Private Pool Pavilion, Opening Offer | SAR | 5,167 avg/night. Cart: 15,500.00 for 3 nights, "Muncipality Fees" 775.00, "Value added Tax" 2,441.25, total 18,716.25 | "room upgrade upon arrival, daily breakfast, and a USD 100 wellbeing credit per day" | 19:13 to 19:14 | See policy matrix |
| same | same | same | Other rooms, 3rd Night Complimentary / Opening Offer | SAR | Sea Front Pavilion 3,534 / 5,467. Sea View Pool Suite 4,334 / 6,667. Sea Front Pool Suite 4,534 / 6,967 | before taxes | 19:13 | |
| same, Scenario B | 14-18 Mar 2027 | 2 adults, 2 children (5, 10) | Sea View Private Pool Pavilion: 3rd Night Complimentary / Flexible Rate | SAR | 4,125 / 5,375 avg/night before taxes | not expanded | 19:20 | |
| Rosewood AMAALA transfers | n/a | n/a | One-way Premium Sedan EV, Red Sea International Airport / NEOM International Airport | SAR | 1,580 / 1,695 "Per Stay Excluding Taxes and Fees" | max 3 adults or 2 adults and 2 children (truncated text) | 19:13 | "Reservation must be cancelled 2 days before arrival to avoid 100% charge of the service plus taxes." |
| Equinox Resort AMAALA (SynXis) | 12-15 Jan 2027 | 2 adults | Core Room 1 King: Best Available Flexible Rate / Afterglow | SAR | 3,000 per night, 9,000 total / 3,950, 11,850. Excluding taxes and fees | Breakfast Included / "Recovery, with somewhere to go after" | 19:17 | Free cancellation up to 3:00 PM 2 days before arrival. Guaranteed with Credit Card |
| same | same | same | Marina Room King / Bay Room King, Flexible | SAR | 3,500 (10,500) / 4,000 (12,000) | Breakfast | 19:17 | same |
| Nammos Resort AMAALA (SynXis) | 12-15 Jan 2027 | 2 guests | Bay View Room King: Book Early & Save up to 15% incl Bfast | SAR | 2,890 per night, 8,670 total, excluding taxes and fees | Breakfast and WIFI | 19:18 | Deposit Required |
| same | same | same | Best Flexible Rate - Breakfast, Minibar and Wi-Fi Included | SAR | 3,400 / 10,200 | breakfast, minibar, Wi-Fi | 19:18 | Free cancellation up to 3 days before arrival. Guaranteed with Credit Card |
| same | same | same | Experience Nammos First / Nammos Escape | SAR | 3,400 (10,200) / 3,860 (11,580) | breakfast at Nalu, 3-course dinner at Ilios, minibar / upgrade, breakfast, couples' massage, five-course dinner | 19:18 | Free cancellation up to 3 days before arrival |
| Jayasom AMAALA | 12-15 Jan 2027 | 2 adults, 1 room, Jayana | none | n/a | No availability | n/a | 19:15 | Modal message. Not proof of closure |
| Jayasom AMAALA (alternative dates) | 8-11 Dec 2026 | 2 adults, 1 room, Jayana | Essence of Jayasom retreat, One Bedroom Terrace Room - Sea View | SAR | 7,200 per person for 3 nights. Subtotal 14,400. Municipality Tax (5%) 720. VAT (15%) 2,160. Municipality Tax (5% of VAT) 108. Total 17,388 | accommodation, three wellness meals daily, consultation, treatments, activities | 19:15 to 19:16 | Pool Villa Beachfront +SAR 2,100 per night |
| Six Senses Southern Dunes extras | n/a | n/a | Shared Luxury Bus RSI transfer / RSI Sedan / RSI MPV / Yanbu Sedan / Yanbu MPV | SAR | 0 / 1,069.50 / 1,127 / 1,978 / 2,075.75 one way per car, "inclusive of tax" | Sedan: 1-3 adults or 2 adults and up to 2 children under 7 | 19:03 | Extras not included in room total |

### Inferences
- The Marriott "with taxes and fees" figure for the St. Regis includes the 2,382.80 SAR transfer charge. That is why it is about 33 percent above the base rate and not 20.75 percent. A like-for-like comparison with RSG's "excluding taxes" figure must strip both.
- Raffles prices default to USD with a SAR equivalent only in the cart. SAR was the default on Marriott, IHG, SLS, Four Seasons and SynXis for these properties, and geo-defaulted to EGP on Six Senses.

### Gaps
- Hyatt prices: none.
- Scenario B prices: only Marriott St. Regis, Four Seasons Shura and Rosewood.
- No per-child or extra-bed pricing was itemised on any engine.
- Whether the 9,660 SAR "Residents Escape" on Six Senses requires proof of residency is not verified.

---

## 6. Policy matrix per property and rate

### Takeaway
Cancellation windows for flexible rates on the same dates range from day-of-arrival 6 pm (InterContinental) to 7 days before arrival (St. Regis, Nujuma, EDITION). They are operator and rate specific and must not be generalised.

### Cited Findings

| Property and rate | Check-in / check-out | Guarantee and payment timing | Cancellation, no-show, early departure | Taxes and fees wording | Child, extra bed, age | Transfers | Source and label |
|---|---|---|---|---|---|---|---|
| St. Regis, Non-Member Flexible Rate with Breakfast | 3:00 pm / 12:00 pm (RSG page FAQ) | "A valid form of payment must be presented at check-in." Card required on form | "You may cancel your reservation for no charge before 11:59 PM local hotel time on January 5, 2027 (7 day[s] before arrival). Please note that we will assess a fee of 23546.25 SAR if you must cancel after this deadline. If you have made a prepayment, we will retain all or part of your prepayment. If not, we will charge your credit card. This fee equals your room charge plus tax for all the nights of your reservation." | "Estimated Government Taxes and Fees" 4,046.25 on 19,500 | "Due to safety concerns, a waiver must be signed for children under 12 years of age to stay in our overwater villas." Max 8 guests per room in selector | "Your island transfer is via electric sedan and speedboat. For a seaplane, contact 00966 1-45040000". Mandatory "Transfer / Transportation Charge" 2,382.80 SAR | [OBSERVED-LIVE] [Marriott guest page](https://www.marriott.com/reservation/reviewguestinformation.mi), [RSG St. Regis page](https://www.visitredsea.com/en/resorts/the-st-regis-red-sea-resort) |
| St. Regis, Rejuvenate Escape | same | "prepay in full" | "non-refundable if cancelled more than 1 day after booking" | not opened | same | not opened | [OBSERVED-LIVE] rate list |
| Nujuma, Honeymoon package | not captured | "prepay in full" | "non-refundable if cancelled less than 21 days before arrival" | "Taxes and all fees included" in the with-tax view | not captured | not captured | [OBSERVED-LIVE] rate list |
| Nujuma and EDITION, flexible and Stay Longer rates | EDITION 3:00 pm / 12:00 pm per search-engine summary of the Marriott page (not opened by me) | not opened | "Free cancellation before or on Jan 05, 2027" | not opened | not captured | not captured | [OBSERVED-LIVE] rate list |
| InterContinental, Best Flexible Rate | "Check in 3:00 pm" | "Reserve with payment. Your room will be held until your arrival on the day of your check-in." "You pay nothing today. A card simply holds your reservation." "Security deposit: One Night Charge" | "Canceling your reservation before 6:00 PM (local hotel time) on Tuesday, 12 January, 2027 will result in no charge. Canceling your reservation after 6:00 PM (local hotel time) on 12 January, 2027, or failing to show, will result in a charge equal to the first night's stay per room ... Taxes may apply. Failing to call or show before check-out time after the first night of a reservation will result in cancellation of the remainder of your reservation." "Early Departure Fee 2,000.00 SAR" | "20.75% per night not included in rate effective 12 January, 2027 through 15 January, 2027". Summary line "15.75 Percent VAT, 5 Percent Municipality Tax" | "Minimum Check-In Age: 18" | "Guests are requested to pre-book electric transport at an additional charge. Parking is available at the mainland Arrival Center, as the island remains car-free" | [OBSERVED-LIVE] [IHG payment page](https://www.ihg.com/intercontinental/hotels/us/en/pay/payments) |
| InterContinental, Stay Longer Pay Less and Book Early & Save | same | "Pay in advance" | "Non-refundable" | excludes taxes | same | same | [OBSERVED-LIVE] rate list |
| InterContinental, debit cards (all rates) | n/a | "Most IHG hotels and resorts place a hold on a debit card when it is presented at check-in ... typically release the hold within 5 days of check out ... funds may take up to 14 days or longer" | n/a | n/a | n/a | n/a | [OBSERVED-LIVE] Payment Policies accordion |
| Six Senses Southern Dunes, Best Flexible Rate | not captured | "A valid credit card is required to hold the booking, you will not be charged at the time of booking unless stated in the rate description." "A deposit for the entire stay is due on or before 10 January, 2027." | "Canceling your reservation before 6:00 PM (local hotel time) on Sunday, 10 January, 2027 will result in no charge. Canceling ... after 6:00 PM ... or failing to arrive will result in forfeiture of your deposit. Taxes may apply. Failing to call or show before check-out time after the first night of a reservation will result in cancellation of the remainder of your reservation." | "Municipality Fees 5% per night not included in rate", "VAT 15.75% per night not included in rate" | "For children aged below 12 years old, breakfast is charged a supplement of SAR 90 per night" (truncated). Sedan transfer sized for children "under 7" | Complimentary shared bus from RSI. Paid sedan and MPV options | [OBSERVED-LIVE] [Six Senses results](https://www.sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/southern-dunes-the-red-sea/accommodation/) |
| Six Senses AMAALA, rates listed | 3:00 pm check-in, 12:00 noon check-out (amaala.com page) | not opened | Time For Two and Best Flex: "Free cancellation 2 days prior to stay". Taste Of Amaala Half Board: "14 days prior" | "taxes incl." on list | amaala.com page: "children aged 12 and under stay free using existing bedding. Extra beds are available for an additional fee for children 12 and older, cots are available for free" | not captured | [OBSERVED-LIVE] rate list, [FETCHED-HTML] [amaala Six Senses page](https://www.amaala.com/en/resorts/six-senses-amaala) |
| Raffles, Flexible Rate | "From 2 PM" / "Until 12 PM" | "Guarantee Policy: No prepayment required" | "Cancel free of charge until Jan 9th 6:00 PM". Cart: "You can cancel your reservation for free until January 9, 2027 6:00 PM" | "Taxes not included" then "Taxes & Fees included" in cart | "Child until 12 years old" in selector. RSG page: "Extra Adult Fee: SAR 450. Complimentary breakfast for up to 2 children under 6. Children aged 6-12 receive 50% off breakfast." RSG page also: early check-in from 09:00 and late check-out until 18:00 each at 50% of the stay rate | not captured | [OBSERVED-LIVE] [Raffles booking](https://www.raffles.com/booking/en/stay), [FETCHED-HTML] [RSG Raffles page](https://www.visitredsea.com/en/resorts/raffles-the-red-sea) |
| Raffles, Stay Longer And Save | same | "Guarantee Policy: Online payment" | "Non-refundable" | same | same | same | [OBSERVED-LIVE] |
| SLS, Flexible Rate With Breakfast | "After 3:00 PM" / "Before 12:00 PM" | "Flexible bookings must be guaranteed with a credit card valid at the date of the start of your stay, unless otherwise specified." Payment "will not be taken now but will be due upon check-out". "A security deposit of SAR 500 per night/unit. Collected on arrival by card or cash, refunded at check-out or released within 14 working days." | "No cancellation charge applies prior to 11:59 (local time), up to 3 day before to arrival. Beyond that time, full amount will be charged." | "Inc. Taxes & Fees", no breakdown shown | not captured | not captured | [OBSERVED-LIVE] [SLS availability](https://booking.slshotels.com/en-us/availability) |
| SLS, Advance Saver | same | "Pay now". "Payment is due through Pay-By-Link that you will receive via email and must be made before check-in." | "Non-refundable" | same | not captured | not captured | [OBSERVED-LIVE] |
| Four Seasons Shura, Bed and Breakfast | not captured | Card details required on form. Timing of charge not stated on the page read | "Free Cancellation until Jan 10th 2027". "Early departure fees may apply." | VAT 15% of room rate, Municipality 5% of room rate, Municipality 5% of VAT | Kids accepted in search without ages | not captured | [OBSERVED-LIVE] [Four Seasons confirm](https://reservations.fourseasons.com/confirm-your-stay) |
| Rosewood AMAALA, Opening Offer | "Check-in after 3:00 pm. Check-out before 12:00 pm" | "Reservations must be guaranteed with a credit card at the time of booking. The room will be held until 3 pm hotel local time on the day of arrival." | "All cancellations and changes must be received by 3:00 pm local Resort time at least 2 days prior to the arrival date, or the Resort will charge one night's room rate, plus applicable taxes and fees. The same penalty applies to no-shows and early departure." | "Muncipality Fees" 5%, "Value added Tax" 15.75% of room rate (by arithmetic on 15,500) | not captured | Paid sedan transfers, cancel 2 days before arrival | [OBSERVED-LIVE] [Rosewood checkout](https://be.synxis.com/checkout) |
| Rosewood AMAALA, RSG-published policy | "3:00 PM" | "Room rates are subject to availability and quoted per room, per night" | "Any cancellation or amendment must be received at least 14 days prior to arrival, before 6 pm local time. Cancellations or amendments made within 14 days of arrival, as well as late cancellations or no-shows, will be charged for the full stay." | "All prices are quoted in Saudi Riyals" | not stated | not stated | [FETCHED-HTML] [amaala Rosewood page](https://www.amaala.com/en/resorts/rosewood-resort-amaala). [CONFLICT] with the 2-day rule on Rosewood's own engine for the Opening Offer |
| Equinox AMAALA, Best Available Flexible Rate | not captured | "Guaranteed with Credit Card" | "Free cancellation up to 3:00 PM 2 days before arrival" | "Excluding taxes and fees" | not captured | not captured | [OBSERVED-LIVE] [Equinox SynXis](https://be.synxis.com/?chain=23412&hotel=98093) |
| Nammos AMAALA, Best Flexible Rate | 3:00 PM / 12:00 PM (amaala.com page) | "Guaranteed with Credit Card". Book Early rate: "Deposit Required" | "Free cancellation up to 3 days before arrival" | Engine: "Excluding taxes and fees". amaala.com: "subject to 5% Municipality Tax (MT) and 15% Value Added Tax (VAT). The VAT is applied to the rate and MT." | amaala.com: "Children under 12 years of age stay complimentary when sharing existing bedding", "Rollaway/extra beds are available for SAR 1,000 per night", cribs complimentary, no pets | not captured | [OBSERVED-LIVE] [Nammos engine](https://reservationsamaala.nammoshotels.com/?Hotel=98226&Chain=10205), [FETCHED-HTML] [amaala Nammos page](https://www.amaala.com/en/resorts/nammos-resort-amaala) |
| Jayasom AMAALA, Essence of Jayasom | "Check-in: from 11:00. Check-out: until 14:00" | No card fields before "Confirm Booking". Payment timing not shown | "Cancellations must be received no later than 72 hours prior to arrival. Cancellations within 72 hours of arrival incur a charge equal to the full reserved stay." | Municipality 5%, VAT 15%, Municipality 5% of VAT | Jayana is adults. Jayela is families. "MIN. 1 NIGHT" | Pickup offered from Al Wajh, Red Sea, Tabuk and Neom airports, arranged by staff after booking | [OBSERVED-LIVE] [Jayasom booking](https://www.jayasom.com/booking) |
| Grand Hyatt The Red Sea, RSG-published policy only | "Check-in time: 3:00 PM" | not stated | "Cancellations made at least 48 hours before arriv..." (text truncated in capture) | "subject to 5% Municipality tax (MT) and 15% Value added tax (VAT). The VAT is applied on the rate and MT." | "no additional fee for children under 12 years ... Guests 12 years and over, a fee of 350 SAR + VAT & MT will be charged per night." Late departure free to 14:00, 50% to 18:00, 100% after | not stated | [FETCHED-HTML] [RSG Grand Hyatt page](https://www.visitredsea.com/en/resorts/grand-hyatt-the-red-sea). Operator source blocked |

- [CONFLICT] IHG's own page gives three wordings for the same rate: list "Fully refundable before Jan 12, 2027", payment page "Free cancellation until Jan 12" and "Change or cancel for free any time before 6:00 pm on Jan 12", policy accordion "before 6:00 PM (local hotel time) on Tuesday, 12 January, 2027". The accordion is the precise one. Source: [IHG payment page](https://www.ihg.com/intercontinental/hotels/us/en/pay/payments)
- [CONFLICT] Six Senses rate list says "Free cancellation 2 days prior to stay" and "taxes incl.", while the rate-details popup for the same rate says taxes are "not included in rate" and that a deposit for the entire stay is due on the cancellation deadline. Source: [Six Senses results](https://www.sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/southern-dunes-the-red-sea/accommodation/)
- [CONFLICT] Tax labelling. IHG, Six Senses and Rosewood label it 15.75% VAT plus 5% municipality. Four Seasons and Jayasom itemise 15% VAT, 5% municipality and a further 5% of VAT. RSG pages for Grand Hyatt and Nammos say 15% VAT applied on rate plus 5% municipality tax. All produce 20.75 percent where a total was shown. Source: [Four Seasons confirm](https://reservations.fourseasons.com/confirm-your-stay)

### Inferences
- A guest comparing RSG's page for Rosewood (14 days) with Rosewood's engine (2 days for the Opening Offer) would get contradictory answers. The RSG text may describe a different rate or season, which is exactly why policies must be stored per rate plan.

### Gaps
- Minimum-stay rules: only Jayasom's "MIN. 1 NIGHT" and Six Senses' calendar legend were seen. No engine returned a minimum-stay refusal for the test dates.
- Accepted payment card brands were listed only on Six Senses. Four Seasons shows "Accepted Cards" as images that were not read.
- Child and extra-bed charges inside operator engines: not itemised anywhere reached.

---

## 7. Properties not bookable online, or bookable only on one channel

### Takeaway
No operator property showed a pure "coming soon" wall. The gaps are channel-specific: Raffles and Grand Hyatt are absent from RSG's engine, Ritz-Carlton AMAALA and Clinique La Prairie are content-only, and some individual room types are phone-only on Four Seasons.

### Cited Findings
- Raffles The Red Sea: not in the RSG widget. Bookable on raffles.com for January 2027 while labelled "Opening Soon". Also offers a mailto "MAKE A BOOKING" link to Raffles.TheRedSea@raffles.com. [OBSERVED-LIVE] 19:05 to 19:07. Source: [raffles.com/the-red-sea](https://www.raffles.com/the-red-sea/)
- Grand Hyatt The Red Sea: not in the RSG widget. Operator site blocked. [OBSERVED-LIVE]. Source: [RSG Grand Hyatt page](https://www.visitredsea.com/en/resorts/grand-hyatt-the-red-sea)
- The Ritz-Carlton, AMAALA: page exists on amaala.com with future-tense copy ("Guests will enjoy"), not in the AMAALA widget, no booking link. [FETCHED-HTML]. Source: [amaala Ritz-Carlton page](https://www.amaala.com/en/resorts/the-ritz-carlton-amaala)
- Clinique La Prairie Health Resort, AMAALA: page says "Opening in 2025, the resort will feature 74 rooms", not in the widget, no booking link. The date is stale as of October 2026. [FETCHED-HTML]. Source: [amaala Clinique La Prairie page](https://www.amaala.com/en/resorts/clinique-la-prairie-health-resort-amaala)
- Four Seasons Shura Island: Sea-View Accessible Room and Presidential Suite show "To Book this Room Please Call +966 920 034 456". For 2 adults and 2 children the Garden-View Accessible, Sea-View Accessible and Beachfront rooms also switch to call-only. [OBSERVED-LIVE] 19:11 and 19:20. Source: [Four Seasons room list](https://reservations.fourseasons.com/choose-your-room)
- Four Seasons AMAALA: Accessible Deluxe Sea-View Room is call-only, +966 920 034 118. [OBSERVED-LIVE] 19:12
- Jayasom: bookable online, but returned no availability for 12 to 15 January 2027. [OBSERVED-LIVE] 19:15. Source: [Jayasom booking](https://www.jayasom.com/booking)
- Phone numbers shown on engines: St. Regis +966 1-45040000, Nujuma +966 1-45044444, EDITION +966 1-45044455 (as printed on Marriott pages), IHG 0800 00 096 91, Raffles 800-257-7544 (US and Canada toll free), Rosewood Saudi 800 865 6042, Equinox 966-501813030, Nammos 966-145-129888, Jayasom +966 14 514 4000. [OBSERVED-LIVE]
- Fairmont and Jumeirah: no resort page on either RSG site on the research date. [FETCHED-HTML]. Source: [visitredsea resorts](https://www.visitredsea.com/en/resorts), [amaala.com](https://www.amaala.com/en)

### Inferences
- "Not on RSG" does not mean "not open". Raffles shows the operator channel can go live first.

### Gaps
- Daraah Resort (in the AMAALA widget) and Turtle Bay, Desert Rock, Shebara were treated as RSG-owned scope and not researched here. Daraah's operator is not verified.
- Whether Miraval The Red Sea is bookable on hyatt.com: not verified (blocked).

---

## 8. Where bookings are managed, modified or cancelled, and identifiers needed

### Takeaway
Each operator has its own lookup, and each wants a confirmation number plus a second factor that differs by operator. A booking made on RSG's engine is presumably not retrievable with these tools unless the operator confirmation number is passed to the guest.

### Cited Findings

| Operator | Where | Identifiers requested | Stated scope | Label and source |
|---|---|---|---|---|
| Marriott | marriott.com/reservation/lookupReservation.mi ("My Trips") | Confirmation Number, Check-in Date, First Name on Reservation, Last Name on Reservation. "All fields are required." Or sign in | "Complete this form to review, modify or cancel a reservation." | [OBSERVED-LIVE] 19:20. Source: [Marriott lookup](https://www.marriott.com/reservation/lookupReservation.mi) |
| IHG | ihg.com/hotels/us/en/stay-mgmt/ManageYourStay ("My stays") | Confirmation number*, Last name*. Or sign in to IHG One Rewards | "View, change or cancel your hotel reservation." | [OBSERVED-LIVE] 19:21. Source: [IHG manage stay](https://www.ihg.com/hotels/us/en/stay-mgmt/ManageYourStay) |
| Six Senses | sixsenses.com/en/my-reservations/ | Property (select), Last Name*, Confirmation number* | "Please select the property and your reservation or itinerary confirmation number" | [OBSERVED-LIVE] 19:21. Source: [Six Senses my reservations](https://www.sixsenses.com/en/my-reservations/) |
| Raffles (Accor) | raffles.com/booking/en/find-my-booking ("Your bookings") | Confirmation number, Last Name, Check-in. All three fields are labelled "(Optional)" while the instruction says to enter confirmation number and last name | "retrieve your reservation made online, by phone, or in person" | [OBSERVED-LIVE] 19:21. Source: [Raffles find my booking](https://www.raffles.com/booking/en/find-my-booking) |
| Jayasom | jayasom.com/manage-booking | Reservation Number | "view your booking summary or cancel your reservation" | [OBSERVED-LIVE] 19:21. Source: [Jayasom manage booking](https://www.jayasom.com/manage-booking) |
| SynXis (Rosewood, Equinox, Nammos) | "MY BOOKINGS" menu item inside the engine | Not verified. The item is an in-page control and was not opened | not verified | [OBSERVED-LIVE] presence only. Source: [Rosewood SynXis](https://be.synxis.com/?Chain=5159&Hotel=97591) |
| Four Seasons | "FIND A RESERVATION" link in the property site footer | Not verified. A guessed URL redirected to plan-your-stay | not verified | [OBSERVED-LIVE] presence only. Source: [Four Seasons AMAALA site](https://www.fourseasons.com/amaalaredsea/) |
| SLS (Ennismore) | "Members sign in" on the engine. No guest lookup link seen | Not verified | not verified | [OBSERVED-LIVE] absence on pages read |
| Hyatt | not verified (blocked) | not verified | not verified | n/a |

### Inferences
- Raffles' lookup says it covers bookings made "online, by phone, or in person", which suggests any booking holding an Accor confirmation number is retrievable regardless of channel. Whether an RSG-originated booking carries one is unknown.

### Gaps
- No lookup was executed, so error handling and what a retrieved booking allows (modify dates, cancel, add extras) is not verified.
- Whether RSG-channel bookings can be modified on operator sites is not verified. Needs a real booking in an authorized environment.

---

## 9. Official developer or distribution API documentation

### Takeaway
Two official sources were found: Accor's developer portal and Sabre's SynXis developer portal. Nothing official and public was found for Marriott, IHG, Hyatt, Four Seasons, Ennismore or Jayasom. No endpoint was probed.

### Cited Findings
- Accor runs a developer portal that says "Sign up easily to start using for free our APIs" and "You will have your API key in less than 2 minutes", with a test environment and an "API Portfolio". The landing page names no specific booking API. Footer copyright 2026. [OFFICIAL-DOC], fetched 12 Oct 2026. Source: [developer.accor.com](https://developer.accor.com/)
- Search results list an Accor "Hotel Interface" API description page on the same portal. Not opened. [Not verified beyond the search snippet]. Source: [Accor hotel interface](https://developer.accor.com/api-portfolio/hotel-interface/api-description)
- Sabre's developer.sabre.com hospitality URL redirects to developer.synxis.com. The Channel Connect page (version 10.40 shown) describes an interface that "integrates SynXis CR directly to the third-party travel sites", with "Real time availability of ARI (availability, rates and inventory)" and "Seamless reservation delivery". It does not describe modify or cancel on that page and states no access requirement beyond a portal sign-in. [OFFICIAL-DOC], fetched 12 Oct 2026. Source: [SynXis Channel Connect](https://developer.synxis.com/apis/soap_apis/hotel/channel_connect)
- Search results also list an official "Sabre Hospitality - SynXis Booking Engine SSO" page (SAML 2.0). Not opened. [Not verified beyond the search snippet]. Source: [SynXis Booking Engine SSO](https://developer.sabre.com/sabre-hospitality-synxis-booking-engine-sso)
- developer.marriott.com and developer.ihg.com do not resolve (DNS ENOTFOUND). These were guesses, so this only shows those hostnames do not exist. [FETCHED-HTML attempt]
- Four Seasons' property page source references content endpoints under reservations.fourseasons.com/content/{lang}/... (status, regions, properties/{hotelCode}/offers, calendaravailability). These are internal site endpoints seen in page source, not documented APIs. Not called. [OBSERVED-LIVE] 19:10. Source: [Four Seasons Shura page](https://www.fourseasons.com/redseashuraisland/)

### Inferences
- Three AMAALA operators (Rosewood, Equinox, Nammos) sit on SynXis, so a single Sabre channel connection pattern could in principle cover them, subject to each hotel's contract. This is an inference from platform identity only.
- The practical route to Marriott, IHG and Hyatt inventory is a commercial channel-manager or GDS connection, not a public developer API. No official source was found to confirm or deny.

### Gaps
- Marriott, IHG, Hyatt, Four Seasons, Ennismore: no official public API documentation located in the time available. Absence of a find is not proof of absence.
- Accor portal: which APIs allow availability and booking, and under what partner terms, is not verified.
- How RSG's own engine is connected to operators (channel manager, CRS direct connect, or manual allotment) is not verified.

---

## 10. Behaviour checks, blocked steps and gaps per property

### Takeaway
Breadth was achieved: eight engines reached the guest page under Scenario A. Depth is limited by the stop rules, by Hyatt's bot wall, and by a hidden browser pane that made some clicks unreliable.

### Cited Findings

Behaviour checks actually observed:

| Check | Result | Label |
|---|---|---|
| 2 rooms | Marriott (EDITION) accepted numberOfRooms=2, displayed "2 Rooms, 2 Guests", prices per room. Not tested elsewhere | [OBSERVED-LIVE] 19:23 |
| Adults plus children | Marriott asks each child's age (<1 to 17), returned only 2-bedroom villas at St. Regis. Four Seasons accepted 2 children with no ages in the URL and restricted bookable rooms to suites. SynXis kept childages in the URL. Raffles labels a child as "until 12 years old". IHG deep link failed to render | [OBSERVED-LIVE] |
| Unavailable dates | Jayasom modal "No availability ... Please try again by changing the number of rooms or dates." Six Senses calendar shows per-day states before search. No other engine returned zero availability for the test dates | [OBSERVED-LIVE] |
| Currency switch | Six Senses EGP to SAR worked in place. Marriott offers 16 currencies, Four Seasons 54, Six Senses about 150. Raffles defaults to USD. Switch not exercised on others | [OBSERVED-LIVE] |
| Arabic inside the engine | Six Senses /ar/ results rendered RTL with Arabic UI labels and English room names. Marriott lists Arabic in its language dialog. Equinox site shows EN / AR. Four Seasons property site shows عربي. Not opened on those | [OBSERVED-LIVE] |
| Back navigation | Not tested by pressing Back. URL shapes recorded in section 2 | Not verified |
| Session timeout notice | Marriott "Room(s) held for 14:54" countdown on the guest page. None seen elsewhere in the few minutes spent per engine | [OBSERVED-LIVE] |
| Cookie banners | Declined or rejected on visitredsea.com and amaala.com (confirmed choices without enabling toggles, default toggle state not inspected), raffles.com ("Continue without Accepting"), SLS (closed), Rosewood ("Reject All"), Jayasom ("Decline"). Left unanswered on IHG, Six Senses and Four Seasons, where the only one-click option was accept. No banner appeared on Marriott | [OBSERVED-LIVE] |

Blocked steps and what an authorized test environment would need:

| Property / engine | Boundary reached | Blocked or not done | What is needed to go further |
|---|---|---|---|
| St. Regis (Marriott) | Guest page read. Timed hold was created by the rate click and left to expire | Submit, payment, confirmation, modify, cancel | Marriott-approved test profile and test card, or a refundable real booking made by an authorized person |
| Nujuma, EDITION (Marriott) | Rate list | Guest page not opened, to avoid further holds | Same as above |
| InterContinental (IHG) | Payment page read with accordions expanded | Submit. Children scenario | Test card and consent to create a reservation. Manual run for children |
| Six Senses Southern Dunes | Guest-info page read | Submit. Extras selection | Test card. Authorized guest identity |
| Six Senses AMAALA | Rate list | Extras and guest page (assumed same engine, not opened) | One more rate click |
| Raffles (Accor) | Complete page, guest block | Payment and guarantee block is hidden until guest data is confirmed | Authorized test identity to pass the "Confirm" gate |
| SLS (Ennismore) | Payment page read. A draft booking UUID was created | Submit. Whether the draft holds inventory | Ennismore confirmation of draft-booking behaviour, test card |
| Four Seasons Shura | Confirm Your Stay page read | Book, step 4 Personalize | Test card and identity |
| Four Seasons AMAALA | Room list | Package and guest page | One more click path |
| Rosewood AMAALA (SynXis) | Guest Details read | Collapsed "Reservation Details" and "Special Requests" not expanded. Submit | Expand sections. Test card |
| Equinox, Nammos (SynXis) | Rate list | Add-ons and guest page | One more click path each |
| Jayasom | Step 3 Guest Details read | Confirm, payment (not visible before confirm), step 4 | Authorized identity |
| Grand Hyatt, Miraval (Hyatt) | Nothing. Kasada challenge page in browser, HTTP 403 on static fetch | Everything | A human in a standard browser session, or Hyatt allow-listing |
| RSG widget on amaala.com | Resort list read | Search not run | One search (parallel researcher's scope) |

Research log (UTC, 12 October 2026):

| Time | Action | Result |
|---|---|---|
| 18:45 | Opened visitredsea.com/en, listed resort links | 13 resort pages found |
| 18:45-18:48 | St. Regis RSG page: cookie settings, BOOK header and room-card BOOK | Both open the RSG widget. 11 resorts in dropdown |
| 18:46-18:47 | Parsed all 13 visitredsea resort pages and /en/resorts | No operator links. Raffles and Grand Hyatt have no room-card BOOK |
| 18:49 | Ran RSG search, St. Regis, Scenario A | Stayed on visitredsea.com/en/booking/accommodation-list, prices shown |
| 18:49-18:50 | amaala.com/en: parsed 9 resort pages, opened widget | 6 resorts in widget. Jayasom external link. UAT link found |
| 18:50 | Guessed Marriott URL (rsixr) | 404. Correct code EJHXR found by search |
| 18:51-18:54 | Marriott St. Regis: property page, rate list, taxes toggle, currency list, Select non-member flexible, guest page | Guest page reached. Hold timer observed |
| 18:54-18:55 | ritzcarlton.com direct reservation URL, then Nujuma page, then Marriott rate list for EJHRZ | 404 on ritzcarlton.com path. Form posts to marriott.com. Rates read |
| 18:55-18:56 | Marriott rate list for EDITION (EJHEB) | Rates read |
| 18:56 | Marriott St. Regis Scenario B and guest editor | Child age inputs read |
| 18:57-18:59 | IHG InterContinental: rooms, rates, toggle off member discount, Select flexible, skip extras, payment page, accordions | Payment page reached |
| 18:59-19:03 | Six Senses Southern Dunes: 404 on guessed URL, correct page, date picker, search, currency switch, rate details, Reserve, extras, guest-info | Guest page reached |
| 19:04 | Six Senses AMAALA results via hotel=RSIAM | Rates read |
| 19:04-19:05 | Hyatt shop URL and property page. WebFetch on two Hyatt pages | Kasada challenge, then HTTP 403. Stopped |
| 19:05-19:07 | Raffles: property page, permalink, search, rooms, rates, enhance, complete | Complete page reached |
| 19:07-19:10 | SLS: property page, booking form target, availability, rate drawer, policy popup, Select this rate | Payment page reached. Draft booking UUID created |
| 19:10-19:12 | Four Seasons Shura: 404 on /redsea/, correct page, room list, bed option, package, confirm page. Then AMAALA room list | Guest page reached for Shura |
| 19:13-19:14 | Rosewood: property page, SynXis rooms, Book Now on Opening Offer, add-ons, checkout | Guest page reached |
| 19:14-19:16 | Jayasom: Scenario A no availability, alternative dates, retreat for both guests, room, guest details | Guest page reached |
| 19:17 | Equinox: property page and SynXis rate list | Rates read |
| 19:18 | Nammos: nammoshotels.com, AMAALA page, engine rate list | Rates read |
| 19:19 | IHG Scenario B deep link | Did not render |
| 19:20 | Four Seasons Scenario B. Rosewood Scenario B | Read |
| 19:20-19:22 | Manage-booking pages: Marriott, Six Senses, Raffles, Jayasom, IHG. Four Seasons guess failed. SynXis link not resolvable | Identifiers recorded |
| 19:23 | Six Senses Arabic results. Marriott 2 rooms | Read |
| after 19:23 | WebSearch and WebFetch for developer documentation | Accor and SynXis portals found |

Source register:

| Source ID | Title | Publisher | URL | Publication/update date | Access date | Claims supported | Limitations |
|---|---|---|---|---|---|---|---|
| S1 | St Regis Resort Red Sea, Visit Red Sea | Red Sea Global | https://www.visitredsea.com/en/resorts/the-st-regis-red-sea-resort | not shown | 12 Oct 2026 | Widget behaviour, resort list, check-in times | Search run once only |
| S2 | Resorts list and 13 resort pages | Red Sea Global | https://www.visitredsea.com/en/resorts | footer 2026 | 12 Oct 2026 | No operator links, Raffles and Grand Hyatt status, RSG-published policies | Parsed HTML, mostly not rendered |
| S3 | Booking Steps, Booking | Red Sea Global | https://www.visitredsea.com/en/booking/accommodation-list | n/a | 12 Oct 2026 | RSG engine URL and St. Regis prices | Other researcher's scope. One property |
| S4 | AMAALA home and 9 resort pages | Red Sea Global | https://www.amaala.com/en | not shown | 12 Oct 2026 | Widget list, Jayasom link, UAT link, policies | Search not run |
| S5 | Marriott Find & Reserve (rate list, guest page) | Marriott International | https://www.marriott.com/reservation/rateListMenu.mi | footer 2025/2026 | 12 Oct 2026 | Marriott steps, prices, fields, hold timer | Session URLs, not shareable. Entered by deep link |
| S6 | Nujuma, a Ritz-Carlton Reserve | Marriott International | https://www.ritzcarlton.com/en/hotels/ejhrz-nujuma-a-ritz-carlton-reserve/overview/ | not shown | 12 Oct 2026 | Form posts to marriott.com | Property page only |
| S7 | Select your room, Add Extras, Guest Payment Information | IHG | https://www.ihg.com/intercontinental/hotels/us/en/find-hotels/select-roomrate | footer 2026 | 12 Oct 2026 | IHG steps, prices, policies, fields | US/English locale. Children not tested |
| S8 | Six Senses Southern Dunes and AMAALA accommodation, booking/extra, booking/guest-info | Six Senses (IHG) | https://www.sixsenses.com/en/hotels-resorts/middle-east-africa/saudi-arabia/southern-dunes-the-red-sea/accommodation/ | not shown | 12 Oct 2026 | Six Senses steps, prices, extras, fields, Arabic | Geo currency default |
| S9 | Hyatt shop and property URLs | Hyatt | https://www.hyatt.com/shop/rooms/rsigh | n/a | 12 Oct 2026 | Bot block evidence only | No content |
| S10 | Raffles The Red Sea site and booking engine | Accor | https://www.raffles.com/the-red-sea/ | footer 2026 | 12 Oct 2026 | Raffles steps, prices, fields, Opening Soon label | Payment block not visible |
| S11 | SLS The Red Sea site and booking engine | Ennismore | https://booking.slshotels.com/en-us/availability | footer 2026 | 12 Oct 2026 | SLS steps, prices, policies, fields | Draft booking created |
| S12 | Four Seasons Shura Island and AMAALA, reservations engine | Four Seasons Hotels Limited | https://reservations.fourseasons.com/choose-your-room | footer 1997-2026 | 12 Oct 2026 | Four Seasons steps, prices, tax lines, fields | AMAALA to room list only |
| S13 | Rosewood AMAALA site and SynXis engine | Rosewood Hotel Group / Sabre | https://be.synxis.com/?Chain=5159&Hotel=97591 | not shown | 12 Oct 2026 | SynXis steps, prices, policies, fields | Two sections not expanded |
| S14 | Equinox Resort AMAALA site and SynXis engine | Equinox Hotels / Sabre | https://be.synxis.com/?chain=23412&hotel=98093 | not shown | 12 Oct 2026 | Engine identity, prices, policy lines | Rate list only |
| S15 | Nammos Resort AMAALA site and engine | Nammos Hotels & Resorts / Sabre | https://reservationsamaala.nammoshotels.com/?Hotel=98226&Chain=10205 | page title "Opening 2026" | 12 Oct 2026 | Engine identity, prices, policy lines | Rate list only |
| S16 | Jayasom booking and manage-booking | Jayasom PTE Ltd | https://www.jayasom.com/booking | footer 2026 | 12 Oct 2026 | Jayasom steps, prices, policies, fields | Alternative dates used |
| S17 | Lookup Reservation | Marriott International | https://www.marriott.com/reservation/lookupReservation.mi | n/a | 12 Oct 2026 | Identifiers | Not executed |
| S18 | Manage Reservations | IHG | https://www.ihg.com/hotels/us/en/stay-mgmt/ManageYourStay | n/a | 12 Oct 2026 | Identifiers | Not executed |
| S19 | My Reservations | Six Senses | https://www.sixsenses.com/en/my-reservations/ | n/a | 12 Oct 2026 | Identifiers | Not executed |
| S20 | Find my booking | Accor (Raffles) | https://www.raffles.com/booking/en/find-my-booking | n/a | 12 Oct 2026 | Identifiers | Not executed |
| S21 | Accor developer portal | Accor | https://developer.accor.com/ | footer 2026 | 12 Oct 2026 | Existence and sign-up wording | Landing page only, summarised by a fetch tool |
| S22 | SynXis Channel Connect | Sabre Hospitality | https://developer.synxis.com/apis/soap_apis/hotel/channel_connect | version 10.40, no date | 12 Oct 2026 | Channel Connect description | Summarised by a fetch tool, one page |

### Inferences
- The hidden-pane problem (the shared browser pane was often not displayed, so screenshots and some clicks timed out) did not change any finding, but it is why calendar interaction was replaced by deep links on Marriott, IHG, Raffles, SLS, Four Seasons and SynXis. Deep-link entry skips the operator's own search form, so default values on those forms were only partly observed.

### Gaps
- Everything after the final submit button on every engine.
- All of Hyatt.
- Systematic back-button, refresh and timeout testing.
- Validation messages on every form.
- Member-rate selection paths.
