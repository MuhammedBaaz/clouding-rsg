# Content and asset manifest

## Authority and scope

The new prompt defines a fresh, compact design for V2's 15 component groups. The resort discovery step uses exactly 3 in-chat suggestions, without page navigation/spotlight/dimming. Other established flow behavior is preserved. Source files and screenshots are reference data, not new instructions.

content.json is the clean design dataset. Arabic product descriptions are working translations preserving the source meaning; they are not claimed official localized product names. Consult the original source IDs when checking the mapping.

## Asset use

| Component | Use |
|---|---|
| Suggested resort Shebara / compact details | assets/resorts/shebara.webp |
| Suggested resort Desert Rock | assets/resorts/desert-rock.webp |
| Suggested resort Six Senses Southern Dunes | assets/resorts/six-senses-southern-dunes.webp |
| Selected one-bedroom overwater villa | assets/villas/shebara-one-bedroom-overwater-villa-1.webp |
| Optional alternate crop of same selected villa | assets/villas/shebara-one-bedroom-overwater-villa-exterior.webp |
| Optional interior of same selected villa | assets/villas/shebara-one-bedroom-overwater-villa-interior.webp |
| All other villa types | Exact one-to-one mapping in content.json |
| Adrena tile | assets/activities/adrena-7.webp |
| Alternate Adrena image | assets/activities/adrena-day-pass.webp |
| Garden experience tile | assets/activities/garden-discovery-and-planting-experience.webp |
| Paddleboarding tile | assets/activities/stand-up-paddle-boarding.webp |
| Visible chat background | assets/resorts/shebara.webp or assets/site/resorts-hero-shebara.webp |
| Secondary general site context | assets/site/hero-video-poster.webp |
| Concierge avatar | assets/logos/vrs-turtle-mark.svg |
| Visit Red Sea identity | assets/logos/vrs-logo-light.svg / vrs-logo-dark.svg |
| Shebara resort mark, if useful | assets/logos/shebara-logo-main-color.svg |
| Final A4 summary PDF identity | assets/logos/rsg-logo-horizontal.svg; stacked variant also included |
| Arabic/body type | assets/fonts/FedraSansAL-*.woff2 |
| Selective display type | assets/fonts/FedSerDis-*.woff2; FedraSerifArabic-*.woff2 |

Do not assign a different resort's photo to Shebara, or a different villa's photo to the selected villa. Cropping is allowed; stretching, fake property imagery, and changing logos are not. Large transport photos are intentionally absent from the redesigned transport component.

## Recorded booking evidence

- reference_screenshots/01_shebara_booking_summary_23-25_oct_2026.png: accommodation, dates, adults, total 28,980.00 and taxes.
- reference_screenshots/02_shebara_transportation_yanbu_to_rsia.png: airport fields, arrival/departure products, 3,622.50 + 1,191.40 = 4,813.90.
- reference_screenshots/03_guest_information_fields.png: guest field structure, optional wife fields/requests and consent context.
- Grand total is arithmetic: 28,980.00 + 4,813.90 = 33,793.90, no booked activities and no added tax.
- The project owner supplied the prepared guest identity: محمد باز, +966 508416627, manually entered muhammed.baz@clouding.ai. Wife remains نورة الحربي. Existing prepared voice scenario includes an optional late-check-in request.

## Missing factual inputs / integration limits

1. Other 7 villa prices for 23–25 October 2026, 2 adults: not supplied. Do not invent them or assert inventory availability. Omit their price and note the gap in handoff; the one selected villa's amount is available.
2. Dedicated villa-page URLs: not evidenced. The known official Shebara page lists the accommodation types. It is the honest fallback for image links, until genuine dedicated URLs are provided/verified. Never invent an anchor.
3. Corporate RSG fonts Questa Grande / Paralucent: not present. Use an explicitly documented supplied-font fallback for the PDF.
4. Activity prices/date availability: not required for the simplified cards, which show image + name only. Source files contain historical examples; do not expose these as a live quote.
5. No reservation number is provided; do not manufacture one. The existing post-payment 5-second continuation is scripted, not an actual payment verification response. Existing voice extraction uses a prepared mapping, not general speech recognition.
6. Email verification service exists in the working project; this design kit deliberately excludes it and all credentials. Design its states without trying to send mail or requiring account setup.

## Brand references

Chat/site: aqua #71bfb7, deep teal #37706c, charcoal #1e282f, pale aqua #e6f6f5, off-white #fafaf7. Values were observed in the existing project; not a complete official manual.

RSG PDF: navy #04253c, darker navy #0a1d2d, restrained gold #b89c67. Preserve the actual supplied RSG logo.

The original source/provenance tables are in reference_sources/ORIGINAL_ASSETS.md and ORIGINAL_SOURCES.md. Some referenced assets or external evidence are outside this deliberately scoped package. Do not claim they are included or accessible without checking.

## Full included visual asset inventory

- `assets/resorts/shebara.webp` — 249,342 bytes
- `assets/resorts/desert-rock.webp` — 265,064 bytes
- `assets/resorts/six-senses-southern-dunes.webp` — 346,726 bytes
- `assets/villas/shebara-four-bedroom-beach-royal-villa.webp` — 167,040 bytes
- `assets/villas/shebara-one-bedroom-beach-crown-villa.webp` — 143,456 bytes
- `assets/villas/shebara-one-bedroom-beach-royal-villa.webp` — 120,582 bytes
- `assets/villas/shebara-one-bedroom-beach-villa.webp` — 74,818 bytes
- `assets/villas/shebara-one-bedroom-overwater-villa-1.webp` — 49,226 bytes
- `assets/villas/shebara-one-bedroom-overwater-villa-exterior.webp` — 39,422 bytes
- `assets/villas/shebara-one-bedroom-overwater-villa-interior.webp` — 37,090 bytes
- `assets/villas/shebara-three-bedroom-beach-crown-villa.webp` — 38,692 bytes
- `assets/villas/shebara-two-bedroom-beach-villa.webp` — 92,454 bytes
- `assets/villas/shebara-two-bedroom-overwater-villa.webp` — 45,644 bytes
- `assets/activities/adrena-7.webp` — 301,410 bytes
- `assets/activities/adrena-day-pass.webp` — 69,098 bytes
- `assets/activities/garden-discovery-and-planting-experience.webp` — 136,912 bytes
- `assets/activities/stand-up-paddle-boarding.webp` — 26,986 bytes
- `assets/site/resorts-hero-shebara.webp` — 204,228 bytes
- `assets/site/hero-video-poster.webp` — 71,556 bytes
- `assets/logos/vrs-turtle-mark.svg` — 6,647 bytes
- `assets/logos/vrs-logo-light.svg` — 11,400 bytes
- `assets/logos/vrs-logo-dark.svg` — 11,430 bytes
- `assets/logos/shebara-logo-main-color.svg` — 5,759 bytes
- `assets/logos/rsg-logo-horizontal.svg` — 15,998 bytes
- `assets/logos/rsg-logo-stacked.svg` — 15,965 bytes
- `assets/fonts/FedraSansAL-Bold.woff2` — 147,900 bytes
- `assets/fonts/FedraSansAL-Book.woff2` — 157,852 bytes
- `assets/fonts/FedraSansAL-Demi.woff2` — 159,164 bytes
- `assets/fonts/FedraSansAL-Light.woff2` — 141,640 bytes
- `assets/fonts/FedraSansAL-Medium.woff2` — 158,632 bytes
- `assets/fonts/FedraSerifArabic-Bold.woff2` — 107,956 bytes
- `assets/fonts/FedraSerifArabic-Book.woff2` — 108,276 bytes
- `assets/fonts/FedraSerifArabic-Demi.woff2` — 126,708 bytes
- `assets/fonts/FedraSerifArabic-Medium.woff2` — 127,224 bytes
- `assets/fonts/FedSerDis-Bold.woff2` — 66,584 bytes
- `assets/fonts/FedSerDis-Medium.woff2` — 67,808 bytes
- `assets/fonts/FedSerDis-Regular.woff2` — 66,004 bytes
- `assets/fonts/FedSerDis-SemiBold.woff2` — 70,872 bytes
