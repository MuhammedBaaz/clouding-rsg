# Source map

Evidence classes: **Screenshot** = customer-supplied booking screenshots (`evidence/mockup_references/`, October 2026). **Research** = Clouding research of 12 October 2026 (`reports/Red Sea Global POC due diligence.md`, `reports/csv/*.csv`, `research_notes/`). **Live page** = official page read on 14 October 2026 while building. **Computed** = arithmetic on screenshot amounts. **Entered** = typed by the reviewer during the conversation. **Scripted** = steps the research never observed end to end (verification acceptance, payment completion, confirmation); the script accepts the customer's statement and continues, nothing is checked or charged.

Update 18 October 2026: the 10% rate plan was removed from the experience on the owner's instruction, the guest details are now entered in the chat form instead of being fixed, and customer-facing labels were removed. Rows below marked (removed) no longer appear on screen.

## Scenario and amounts

| Claim or field | Value | Source | Scenario and date | Status |
|---|---|---|---|---|
| Resort | Shebara | Screenshot 01 | 23–25 Oct 2026, 2 adults | Verified |
| Dates | Oct 23 - 25, 2026 | Screenshot 01 | same | Verified |
| Guests | 2 Adults, 0 children | Screenshot 01 | same | Verified |
| Villa | One Bedroom Overwater Villa | Screenshot 01 | same | Verified |
| Rate plan selected | Villa Flat Rate | Brief (user instruction) with Screenshot 01 total | same | Verified |
| Accommodation total | SAR 28,980.00, all taxes included | Screenshot 01 ("TOTAL 28,980.00 · All taxes included") | same | Verified |
| Occupancy message | "You've got enough rooms for your group, but feel free to add more if needed!" | Screenshot 01 | same | Verified |
| 10% rate plan name (removed) | SHP - Book Now and Receive 10% Off Your Villa 2026 | Research, booking step 1 observation (R219) | 10–13 Nov 2026 | Name only; price for 23–25 Oct never evidenced. Removed from the UI on 18 Oct 2026 |
| Arrival mode | By Plane (tiles: By Plane, By Private Jet, By Car, By Yacht) | Screenshot 02 | 23–25 Oct 2026 | Verified |
| Arrival airport | Yanbu Airport | Screenshot 02 | same | Verified |
| Departure airport | Red Sea International Airport - RSIA | Screenshot 02 | same | Verified |
| Optional flight fields | Arrival Time, Airline, Flight Number (Optional) | Screenshot 02 | same | Verified |
| Arrival transfer | Private Luxury Car + Shared Leisure Boat, SAR 3,622.50, "Total price (all taxes included) \| 2 Adults" | Screenshot 02 | same | Verified |
| Arrival transfer duration and capacities | 4h; car up to 3 guests; boat up to 18 guests; "1 Private Luxury Car, 1 Shared Leisure Boat needed" | Screenshot 02, read from a 3x upscale of small text | same | Read from small text; treat "18" as a best reading |
| Departure transfer | Shared Speed Boat + Private Luxury Car, SAR 1,191.40 | Screenshot 02 | same | Verified |
| Departure upgrade selector | "Upgrade Your Transportation" showing "Shared Speed Boat + Private…" | Screenshot 02 | same | Recorded choice, no upgrade price shown |
| Transfers total | SAR 4,813.90 | Screenshot 02 "TOTAL 4,813.90"; equals 3,622.50 + 1,191.40 | same | Verified and Computed |
| Grand total | SAR 33,793.90 | Computed: 28,980.00 + 3,622.50 + 1,191.40 | same | Computed |
| Activities added | None | Brief | same | Instruction |
| Guest form fields | Already registered banner; For Myself / For Someone Else; Title, First Name, Family Name, E-Mail (verification code), Mobile Number +966; marketing checkbox unticked; consent sentence with Terms & Conditions and Privacy Policy; Adult Guest 2 optional; Other Requirements optional | Screenshot 03 and Research (R223) | Oct 2026 | Verified |
| Email verification before payment | "Verify" dialog, 6-digit code sent to the masked email | Research, team screenshot of 13 Oct 2026 (`reports/Mockup spec R1 Shebara Desert Rock.md` §9.1) | 16–17 Oct 2026 walk-through | Observed once; shown as a static simulated step |
| Terms and Privacy URLs | visitredsea.com/en/terms-and-conditions, /en/privacy-policy | Live page footer links, 14 Oct 2026 | n/a | Verified links; content not relied on |
| Checkout URL | as supplied in the brief | Brief | n/a | Used verbatim; it does not prove a cart or price exists |

## Property facts

| Claim | Value | Source | Status |
|---|---|---|---|
| Shebara villa types, occupancy, bedrooms, beds, view, size, pool | 8 villa types as listed in `data/villas.js` | Live page visitredsea.com/en/resorts/shebara, 14 Oct 2026 | Verified |
| One Bedroom Overwater Villa: 188 sqm, private pool, description | as shown | Live page, same | Verified |
| Child policy | Under 12 free sharing with parents; 12 and over SAR 1,500 + VAT and MT per night (not shown in chat) | Research, Shebara resort page (R158) | Verified; chat states only the under-12 rule with its conditions |
| Shebara size | 73 villas: 38 overwater, 35 beachfront | Research (R046, R158) | Verified |
| Resort catalog names, places, key counts | see `data/resorts.js` | Research inventory (`reports/csv/resort_inventory.csv`) | Verified per row; EDITION shown as "240 rooms" because sources conflict on the suite count |
| Resort status "Open" | 11 at The Red Sea, 6 at AMAALA | Research (RSG release 1 Oct 2026, resort pages) | Verified; Daraah Resort omitted because its opening is not confirmed; coming-soon resorts omitted |
| Thuwal Private Retreat | Whole-island buy-out, up to 12 adults, enquiry only | Research (R127) | Verified |
| Miraval adults only; Equinox adults only | as shown | Research (R162, R214) | Verified (Equinox from the operator site) |

## Activities (indicative only)

| Activity | Price shown | Source | Date | Status |
|---|---|---|---|---|
| Adrena | From SAR 500.00 per person | Research, Shebara booking step 3 (R222) | 10–13 Nov 2026 stay, 12 Oct 2026 | Indicative, not for 23–25 Oct |
| Garden Discovery and Planting Experience | From SAR 184.58 per person | Research (R222) | same | Indicative |
| Stand Up Paddle-Boarding | SAR 200.00, 1 adult, 1 hour, taxes included | Team screenshot 13 Oct 2026 (`evidence/screenshots/...06_step3_paddleboarding_options_filled.png`) | 16–17 Oct 2026 stay | Indicative |
| Activity tags | 1-2-hour, Beginner, Solo / Group Activity; 1 hr, Age: 8+, Beginner | Live Botanica page 14 Oct 2026; team screenshot 13 Oct 2026 | | Verified |

## Entered and scripted

| Item | Value | Class |
|---|---|---|
| Customer first name | Whatever the reviewer types at the first question; prefilled into the guest form | Entered |
| Main guest title, family name, country code, mobile; second guest names; request | Spoken into the composer microphone, then filled into the guest form from the prepared mapping in `data/script.js` (`scenario.voice`) and marked "AI extracted"; editable. No speech recognition runs | Prepared mapping |
| E-mail, marketing choice | Typed into the guest form by the customer (the e-mail is never prefilled); carried into the review, verification, confirmation and PDF | Entered |
| Verification code | Generated, e-mailed and checked by `server.py` (hashed in memory, 5-minute expiry, 5 attempts, 30-second resend cooldown, consumed once verified). Owner-configured SMTP settings in `.env`; on 20 Oct 2026 the owner triggered Send code in the app and confirmed receipt of the code in the muhammed.baz@clouding.ai inbox | Real integration (verified end to end) |
| Payment | The first click on Proceed to payment opens the official checkout and starts a 5-second timer; the concierge then continues on its own. No charge, no booking, no provider response | Scripted |
| Confirmation card and PDF | Built from the entered and evidenced values; no reservation reference, invoice or transaction number is shown because none exists | Scripted |
| PDF identity | Red Sea Global horizontal and stacked logos from redseaglobal.com (header and footer logo URLs in `research_notes/.../02_brand_architecture.md`); colours from the RSG site CSS tokens recorded there: blue 800 `#04253c`, blue 900 `#0a1d2d`, blue 700 `#1f415a`, gold 400 `#b89c67`, gold 300 `#c3af8a`, logo gold `#bd9a5f`, volcanic ash 500 `#6f7271`. No published brand guideline was found, so these are observed implementation values | Research (observed) |
| All Arabic concierge wording | `data/script.js` | Authored |

## Backdrop copy

Hero headline, intro paragraphs, stats labels, resort section heading, Shura Island copy, offer titles and texts, ADRENA day-pass copy, footer labels, phone, email, licence numbers: visitredsea.com/en as read on 14 October 2026. The offer validity dates and the ADRENA day-pass promotion are time-sensitive.
