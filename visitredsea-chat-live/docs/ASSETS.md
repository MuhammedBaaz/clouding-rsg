# Asset manifest

All files were fetched on 14 October 2026 from the public pages named below, at the project owner's request, for this internal demo. Renditions are the site's own `cq5dam.web.1280.0.webp` (or 2880) outputs unless stated. Each image was viewed before assignment.

## Fonts (`assets/fonts/`)

| File | Family, weight | Origin |
|---|---|---|
| FedraSansAL-Light/Book/Demi/Medium/Bold.woff2 | Fedra Sans AL 300/400/500/600/700 | https://www.visitredsea.com/content/dam/red-sea/en/system/fonts/ (declared in the site CSS chunk e9bef7166ea3db4a.css) |
| FedSerDis-Regular/Medium/SemiBold/Bold.woff2 | Fedra Serif Display 400/500/600/700 | same |
| FedraSerifArabic-Book/Demi/Medium/Bold.woff2 | Fedra Serif Arabic AR 400/450/600/700 | same |

Fedra Sans AL contains Arabic glyphs (116 code points in the Arabic block, checked with fontTools), so Arabic dialogue renders in the same family the site uses for body text. These are commercial typefaces by Typotheque; see the README licensing note.

## Logos (`assets/logos/`)

| File | Subject | Origin |
|---|---|---|
| vrs-logo-light.svg | Visit Red Sea bilingual lockup, light version (header on dark hero, footer) | https://www.visitredsea.com/content/dam/red-sea/en/master/logos/VRS%20Logo-light.svg/_jcr_content/renditions/original |
| vrs-logo-dark.svg | Dark version (not used on the page, kept for reference) | …/VRS%20Logo-dark.svg/_jcr_content/renditions/original |
| rsg-logo-stacked.svg | Red Sea Global corporate logo, stacked (gold symbol, white wordmark), as used in the redseaglobal.com header | https://www.redseaglobal.com/content/experience-fragments/redsea-rsc/en/header/header-no-gradient/_jcr_content/root/header/logo.coreimg.svg/1769789309753/rsg-logo.svg (downloaded 18 Oct 2026; identical to the file embedded in the executive deck) |
| rsg-logo-horizontal.svg | Red Sea Global corporate logo, horizontal lockup, as used in the redseaglobal.com footer; header of the booking-summary PDF | https://www.redseaglobal.com/content/experience-fragments/redsea-rsc/en/footer-v2/master/_jcr_content/root/footer/logo-img.coreimg.svg/1775821533074/logo.svg (downloaded 18 Oct 2026) |
| shebara-logo-main-color.svg | Shebara resort mark (not displayed; kept for reference) | …/logos/resorts-logos/Shebara-logo-main-color.svg/_jcr_content/renditions/original |
| vrs-turtle-mark.svg | The coloured turtle mark only, cut from VRS Logo-light.svg (five coloured paths, viewBox fitted to their bounds). Used as the concierge avatar in the chat header, beside concierge messages and on the minimised bar. It is a brand mark, not a person | Derived from vrs-logo-light.svg, 18 Oct 2026 |

## Site backdrop (`assets/site/`)

| File | Subject | Origin | Note |
|---|---|---|---|
| hero-video-poster.webp | Home hero: aerial lagoon still (the live hero is a video; this is its poster frame) | https://www.visitredsea.com/content/dam/red-sea/en/master/homepage/interactive-menu/interactive-menu_placeholder.png/_jcr_content/renditions/cq5dam.web.2880.0.webp | Resized to 2000 px |
| hero-video-frame-2s.jpg, hero-video-frame-6s.jpg | Frames extracted from the hero video for comparison | …/homepage/interactive-menu/Section1-1080P-30FPS.mp4/_jcr_content/renditions/original | Not used on the page |
| shura-island-section.webp | Shura Island aerial (Shura band, one stats tile) | …/destination/shura-island/shura-island-20.png/_jcr_content/renditions/cq5dam.web.2880.0.webp | Resized to 2000 px |
| resorts-hero-shebara.webp | Shebara aerial used as the resorts page hero (one stats tile) | …/resort/shebara/details/Shebara_D7_08788_v3@2x.jpg/_jcr_content/renditions/cq5dam.web.2880.0.webp | |
| offer-romantic-getaway.webp | "Romantic Getaway at The Red Sea" offer image (couple at Shebara) | …/resort/shebara/details/Shebara_couples.jpg/… | |
| offer-seaplane.webp | "Fly Red Sea Seaplane Special Offers" image (also one stats tile) | …/offers/seaplane/Hero.jpg/… | |
| offer-alula.webp | "The Red Sea & AlUla Expedition" image | …/offers/alula-promotions/alula-hero3.jpg/… | |
| offer-wellness.webp | "Red Sea Wellness Escape" image | …/offers/campaigns/wellness/st.regis-wellness.jpg/… | |
| apple-store.png, google-play.png | Store badges | https://www.visitredsea.com/images/footer/ | Not displayed |

The four stats tiles on the live page use their own images (islands, reef, a boat, a diver). Those files were not identified, so the tiles here reuse site images already in the manifest. This is a backdrop deviation, not a factual one.

## Resorts (`assets/resorts/`), discovery catalog and backdrop rail

| File | Resort | Origin page | Asset |
|---|---|---|---|
| six-senses-southern-dunes.webp | Six Senses Southern Dunes, The Red Sea | visitredsea.com/en (resort card) | …/resort/six-senses-southern-dunes/Six-Senses-Shoutern-Dunes-header@2x.jpg |
| st-regis-red-sea.webp | The St. Regis Red Sea Resort | same | …/resort/the-st--regis-red-sea-resort/St-Reigis2x.jpg |
| nujuma.webp | Nujuma, a Ritz-Carlton Reserve | same | …/resort/nujuma/Nujuma-headerx.jpg |
| turtle-bay-hotel.webp | Turtle Bay Hotel | same | …/resort/turtle-bay-hotel/36782777_4K.jpg |
| shebara.webp | Shebara (resort card, details card, confirmation, PDF, and the chat background at 10% opacity behind a sand overlay) | same | …/resort/shebara/Shebara-header@2x.jpg |
| desert-rock.webp | Desert Rock | same | …/resort/desert-rock/desertrock-header@2x.jpg |
| red-sea-edition.webp | The Red Sea EDITION | same | …/resort/edition-shura/Lobby%20-%20Terrace.jpg |
| intercontinental-red-sea.webp | InterContinental The Red Sea Resort | same | …/resort/shura-intercontinental/main-images/vrs-travil-trade-intercont.jpg |
| sls-red-sea.webp | SLS The Red Sea | same | …/resort/shura-sls/sls-hero2.jpg |
| miraval-red-sea.webp | Miraval The Red Sea | same | …/resort/miraval/Beach-Front-Pool-Views.jpg |
| four-seasons-shura.webp | Four Seasons Resort and Residences Red Sea at Shura Island | same | …/resort/four-seasons-shura/four-seasons-main4.jpg |
| four-seasons-amaala.webp | Four Seasons Resort and Residences AMAALA at Triple Bay | amaala.com/en/resorts (card alt "Four Seasons Resort and Residences") | https://www.amaala.com/content/dam/red-sea/amaala/master/resorts/four-seasons-resort-and-residences/four-seasons-amaala-hero.jpg |
| six-senses-amaala.webp | Six Senses AMAALA | same (alt "Six Senses Resort") | …/resorts/six-senses/amaala-six-senses-hero.jpg |
| rosewood-amaala.webp | Rosewood AMAALA | same (alt "Rosewood Resort") | …/resorts/rosewood/rosewood-amaala-sea-front-private-pool-villa.jpg |
| equinox-amaala.webp | Equinox Resort AMAALA | same | …/resorts/equinox/amaala-equinox1.jpg |
| nammos-amaala.webp | Nammos Resort AMAALA | same | …/resorts/nammos-resort/nammos-amaala-website7.jpg |
| jayasom-amaala.webp | Jayasom Wellness Resort AMAALA | same | …/resorts/jayasom-wellness-resort/jayasom-amaala-view_adult_villa_pool.jpg |
| thuwal-private-retreat.jpg | Thuwal Private Retreat (villa beach exterior) | thuwalretreat.sa/en | https://objectstorage.me-jeddah-1.oraclecloud.com/n/axqkeco0itrs/b/thuwal-assets/o/Thuwal_Typical_Villa_Beach_EXT_Sun_Edited_1_1_a03ba286b7.jpg (resized to 1600 px) |

All The Red Sea and AMAALA images are the card images the official listing pages use for the same resort, matched by alt text.

## Shebara villas (`assets/villas/`)

From https://www.visitredsea.com/en/resorts/shebara, accommodation section, folder `…/resort/shebara/acommodation/<villa>/`:

| File | Villa | Asset |
|---|---|---|
| shebara-one-bedroom-overwater-villa-1.webp | One Bedroom Overwater Villa, exterior (selected villa, list, confirmation) | one-bedroom-overwater-villa/1-min.jpg |
| shebara-one-bedroom-overwater-villa-exterior.webp | One Bedroom Overwater Villa, terrace and pool (payment card) | one-bedroom-overwater-villa/Shebara_1_BD_Water_Villa_238_Exterior_Shebara_D8_12234-min.jpg |
| shebara-one-bedroom-overwater-villa-interior.webp | One Bedroom Overwater Villa, interior (not displayed) | one-bedroom-overwater-villa/Shebara_1_BD_Water_Villa_238_Interior_Shebara_D4_04059-min.jpg |
| shebara-two-bedroom-overwater-villa.webp | Two Bedroom Overwater Villa | two-bedroom-overwater-villa/Shebara_2_BD_Water_Villa_230_Exterior_….jpg |
| shebara-one-bedroom-beach-villa.webp | One Bedroom Beach Villa | one-bedroom-beach-villa/Shebara_1BD_Beach_Villa_502_Exterior_….jpg |
| shebara-two-bedroom-beach-villa.webp | Two Bedroom Beach Villa | two-bedroom-beach-villa/Shebara_2_BD_Beach_Villa_314_Exterior_….jpg |
| shebara-three-bedroom-beach-crown-villa.webp | Three Bedroom Beach Crown Villa | three-bedroom-beach-crown-villa/Shebara_3_BD_Beach_Villa_404_Exterior_….jpg |
| shebara-one-bedroom-beach-crown-villa.webp | One Bedroom Beach Crown Villa | one-bedroom-beach-crown-villa/OneBedroomBeachCrownVilla1.jpg |
| shebara-four-bedroom-beach-royal-villa.webp | Four Bedroom Beach Royal Villa | four-bedroom-beach-royal-villa/Shebara_Royal_Beach_Villa_504_Drone_….jpg |
| shebara-one-bedroom-beach-royal-villa.webp | One Bedroom Beach Royal Villa | one-bedroom-beach-royal-villa/OneBedroomBeachRoyalVilla1.jpg |

## Activities (`assets/activities/`)

| File | Subject | Origin page | Asset |
|---|---|---|---|
| adrena-7.webp | ADRENA (aerial of the park), used on the activity card | visitredsea.com/en/experiences/adrena/adrena (alt "Adrena") | …/landing-pages/adrena/Adrena-7.jpg |
| adrena-day-pass.webp | ADRENA Day Pass Experience (cliff jump), used in the backdrop experiences section | visitredsea.com/en (alt "ADRENA Day Pass Experience") | …/landing-pages/adrena/adrena_main5.jpg |
| garden-discovery-and-planting-experience.webp | Garden Discovery and Planting Experience | visitredsea.com/en/experiences/nature/experience-botanica (alt matches the activity name) | …/experiences/nature/Tours2.jpg |
| stand-up-paddle-boarding.webp | Stand-Up Paddleboarding | visitredsea.com experiences listing (alt "Stand-Up Paddleboarding") | …/experiences/sports/stand-up-paddle-boarding/StanUp-paddle-boarding.png |

## Transport (`assets/transport/`)

| File | Subject | Origin | Note |
|---|---|---|---|
| getting-to-and-around-5.webp | Visit Red Sea destination car on a desert road, used on the arrival transfer card | visitredsea.com "Getting to and around" content, …/before-you-visit/getting-to-and-around/getting_to_and_around5.png | **Not the booking flow's own photo.** The flow shows a different teal car image (visible in Screenshot 02) whose asset URL is only reachable inside a booking session, which was not opened. Replace if the original is supplied |
| driving-to-the-red-sea.webp | Road to The Red Sea (aerial), with the same teal transfer car | …/before-you-visit/getting-to-and-around/driving_to_the_red_sea.jpg | Departure transfer card (Shared Speed Boat + Private Luxury Car); it shows the road part of that leg. **Missing:** a verified photo of the shared speed boat, and the booking flow's own photo for the departure leg (collapsed in Screenshot 02). Replace if supplied |

## Not sourced

- Icons: all line icons (plane, jet, car, yacht, bed, route, check, chat) are hand-drawn inline SVGs in this repo, not site assets.
- The Saudi riyal currency glyph used on the live site is replaced by the text "SAR".
- Resort logos for the catalog cards were not used.
