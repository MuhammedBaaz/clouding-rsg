# Red Sea Global brand architecture and observable branding (as of 12 October 2026)

Research date and access date for every source: 12 October 2026 (fetches made between about 18:45 and 19:05 UTC; first curl request logged at 18:45:31 UTC, page clock on the Visit Red Sea contact page read 09:55 PM Riyadh time, which is 18:55 UTC). Method notes that affect how to read this file:

- `redseaglobal.com` and `amaala.com` returned HTTP 403 with header `cf-mitigated: challenge` to curl and WebFetch. They were read through the built-in browser, which loaded normally with no interactive challenge. Their CSS was read with same-origin `fetch()` inside the page. `visitredsea.com` and the resort sites were fetched with curl.
- Labels: [OFFICIAL-SPEC] = a brand rule published by RSG. [OFFICIAL-DOC] = text on an official RSG-controlled page (copy, legal terms, corporate statements). [OBSERVED-IMPLEMENTATION] = what the live HTML, CSS or rendered page does. [THIRD-PARTY], [CONFLICT], and "Not verified: requires ..." as named.
- No [OFFICIAL-SPEC] finding exists anywhere in this file. No published brand guideline, palette, type specification or logo rule was found. Every font, colour and logo statement below is observed implementation only.
- No forms were submitted, no accounts created, no files downloaded. OneTrust cookie banners on visitredsea.com and amaala.com did not block content and were left untouched (nothing accepted).
- Source IDs (S1 to S58) refer to the source register at the end.

---

## 1. What is the exact official English and Arabic name and spelling of each brand?

### Takeaway
The architecture has four visible layers: the corporate brand Red Sea Global (RSG), three destinations (The Red Sea, AMAALA, Thuwal Private Retreat), a hospitality operator subsidiary (Red Sea Global Hospitality) running five RSG-operated properties, and experience and transport brands (Adrena, Laha Beach, Shura Links, WAMA, Galaxea, AKUN, Fly Red Sea). AMAALA is written in full capitals in English body copy on every official page checked, and "أمالا" in Arabic. Several names are spelled inconsistently across official pages, in both languages.

### Cited Findings

**Corporate**

| Item | English as used | Arabic as used | Label and source |
|---|---|---|---|
| Corporate name | "Red Sea Global", short form "RSG", first mention "Red Sea Global (RSG)" | Page title "شركة البحر الأحمر الدولية"; body copy `"البحر الأحمر الدولية"` (in quotation marks); boilerplate "البحر الأحمر الدولية (RSG)" | [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/), [S20](https://www.redseaglobal.com/en/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/) |
| Arabic footer copyright | n/a | "© 2026 ، البحر الاحمر الدولية. جميع الحقوق محفوظة." (الاحمر without hamza, unlike الأحمر elsewhere on the same page) | [OBSERVED-IMPLEMENTATION] [CONFLICT] [S2](https://www.redseaglobal.com/ar/) |
| Legal entity statement | `Red Sea Global ("RSG", "We", "Our", Us") is registered in the Kingdom of Saudi Arabia` | not checked | [OFFICIAL-DOC] [S21](https://www.redseaglobal.com/en/terms-and-conditions/) |
| Parent endorsement | "As a Public Investment Fund (PIF) company"; "RSG is a PIF company" | "إحدى شركات صندوق الاستثمارات العامة" | [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/) |

**Destinations (officially listed under "Our Destinations" in the RSG footer: The Red Sea, AMAALA, Thuwal)**

| Item | English as used | Arabic as used | Label and source |
|---|---|---|---|
| The Red Sea (destination) | "The Red Sea" with capital T in running text ("at The Red Sea", "The Heart of The Red Sea") | "البحر الأحمر"; often `وجهة "البحر الأحمر"` or "وجهة البحر الأحمر" | [OFFICIAL-DOC] [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/), [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar) |
| Consumer site brand | "Visit Red Sea" (page titles end "\| Visit Red Sea"; footer "© 2026, Visit Red Sea. All rights reserved."; app name "Visit Red Sea App") | Arabic home title keeps Latin: "وجهة البحر الأحمر \| Visit Red Sea"; footer "2026 © Visit Red Sea. جميع الحقوق محفوظة."; "تطبيق Visit Red Sea" | [OBSERVED-IMPLEMENTATION] [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar), [S37](https://www.visitredsea.com/ar/contact-us) |
| Header wordmark on visitredsea.com | Rendered logo reads "THE RED SEA" with "البحر الأحمر" beneath (seen in browser at https://www.visitredsea.com/en/resorts/shebara, about 18:51 UTC). Image alt text is "visit red sea" | same bilingual lockup on /ar | [OBSERVED-IMPLEMENTATION] [S26](https://www.visitredsea.com/en/resorts/shebara) |
| AMAALA | "AMAALA" in capitals in all body copy, headings, nav and footer ("© 2026, AMAALA. All rights reserved.") | "أمالا"; `وجهة "أمالا"`; footer "جميع الحقوق محفوظة © أمالا 2026" | [OFFICIAL-DOC] [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar), [S8](https://www.redseaglobal.com/en/portfolio/amaala/) |
| AMAALA mixed-case exceptions | Page title "Amaala Yacht Club \| AMAALA"; RSG news category label "Amaala"; RSG logo file name "Amaala-horizontal-logo.svg"; image alt "AMALA Resort" (one A missing) on the Daraah site | n/a | [OBSERVED-IMPLEMENTATION] [CONFLICT] [S47](https://www.amaala.com/en/amaala-yacht-club), [S20](https://www.redseaglobal.com/en/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/), [S1](https://www.redseaglobal.com/en/), [S53](https://tbha-hotel.com/en/) |
| Thuwal | Nav and footer "Thuwal"; page heading "Thuwal Private Retreat"; site title "Thuwal - Private Retreat" | Nav "ثول"; `منتجع "ثول الخاص"`; press boilerplate `منتجع "ثُوَل الخاص"` (with diacritics) | [OFFICIAL-DOC] [S9](https://www.redseaglobal.com/en/portfolio/thuwal/), [S54](https://www.thuwalretreat.sa/en/), [S20](https://www.redseaglobal.com/ar/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/) |
| Other portfolio items named by RSG | "the Al Wajh Airport upgrade, and a new development in Italy" (no brand name given) | "مشروع تطوير مطار الوجه، وتطويراً جديداً في إيطاليا" | [OFFICIAL-DOC] [S5](https://www.redseaglobal.com/en/about-us/), [S6](https://www.redseaglobal.com/ar/about-us/) |

**RSG-operated hospitality (Red Sea Global Hospitality lists five properties under "Hotels & Resorts")**

| Item | English as used | Arabic as used | Label and source |
|---|---|---|---|
| Operator | "Red Sea Global Hospitality"; "Red Sea Global Hospitality Company" in RSG nav; tagline "Establishing the Kingdom's first luxury hotel operator" | "البحر الأحمر الدولية للضيافة" | [OFFICIAL-DOC] [S11](https://www.redseaglobal.com/en/subsidiaries/red-sea-global-hospitality/), [S48](https://redseaglobalhospitality.com/en/) |
| Shebara | "Shebara" (resort); "Shebara Resort" in RSG nav and page title; island is "Sheybarah Island" | "شيبارة"; `منتجع "شيبارة"`; island `جزيرة "شيبارة"` | [OFFICIAL-DOC] [S16](https://www.redseaglobal.com/en/portfolio/projects/shebara-resort/), [S26](https://www.visitredsea.com/en/resorts/shebara), [S49](https://www.shebara.sa/en/) |
| Desert Rock | "Desert Rock"; RSG nav "Desert rock" (lower-case r); RSGH copy "Desert Rock Resort" | "ديزرت روك"; RSG page `منتجع "ديزرت روك" الجبلي` | [OFFICIAL-DOC] [CONFLICT on capitalisation] [S17](https://www.redseaglobal.com/en/portfolio/projects/desert-rock-resort/), [S1](https://www.redseaglobal.com/en/), [S48](https://redseaglobalhospitality.com/en/), [S50](https://www.desertrock.sa/en/) |
| Turtle Bay | "Turtle Bay Hotel" on Visit Red Sea and on its own site ("TURTLE BAY HOTEL, THE RED SEA, SAUDI ARABIA"); "Turtle Bay Resort" on the RSGH site; copyright string "2026 © TurtleBayHotel" | "فندق تيرتل باي" (Visit Red Sea, own site) versus "منتجع ترتل باي" (RSGH Arabic) | [CONFLICT] [S22](https://www.visitredsea.com/en), [S52](https://turtlebayhotel.sa/en/), [S48](https://redseaglobalhospitality.com/en/) |
| Daraah | H1 "Daraah Resort"; page title "Book Your Stay at Darrah Resort \| AMAALA"; own site "DARAAH RESORT" | "منتجع دارة" | [CONFLICT on Daraah/Darrah] [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala), [S53](https://tbha-hotel.com/en/) |
| Thuwal Private Retreat | listed by RSGH as a property | "منتجع ثول الخاص" | [OFFICIAL-DOC] [S48](https://redseaglobalhospitality.com/en/) |

**Experience, transport and facility brands**

| Item | English as used | Arabic as used | Label and source |
|---|---|---|---|
| Shura Island | "Shura Island", nav "SHURA ISLAND" | Three spellings on visitredsea.com: nav "جزيرة شُورى", home "جزيرة شورى", Shebara page "جزيرة شورا" | [CONFLICT] [S23](https://www.visitredsea.com/ar), [S26](https://www.visitredsea.com/ar/resorts/shebara) |
| Shura Links | "Shura Links"; also "Shura Links Golf Club" and "Shura Links Golf Course" on RSG pages | "شورى لينكس" | [OFFICIAL-DOC] [S55](https://shuralinks.com/), [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/), [S23](https://www.visitredsea.com/ar) |
| Adrena | "Adrena"; RSG corporate "ADRENA The Adventure & Entertainment District"; "an adventure and entertainment district" | "أدرينا" (Visit Red Sea) versus "أديرينا" (RSG Arabic subsidiary page) | [CONFLICT] [S23](https://www.visitredsea.com/ar), [S12](https://www.redseaglobal.com/ar/subsidiaries/sports-entertainment-company/) |
| Laha Beach | "Laha Beach", "LAHA Beach", "Laha Beach Ladies Club" | `شاطئ "لَها"`, `شاطئ "لَها" الخاص للسيدات` | [OFFICIAL-DOC] [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar), [S39](https://www.visitredsea.com/en/laha-beach-ladies-club) |
| WAMA, Galaxea, AKUN | Named by RSG as the activity brands of Red Sea Sports & Entertainment Company (RSSE): above-water, below-water and inland respectively | "واما", "جالاكسيا", "أكون" | [OFFICIAL-DOC] [S12](https://www.redseaglobal.com/en/subsidiaries/sports-entertainment-company/) |
| Fly Red Sea | "Fly Red Sea"; legal entity listed as "The Red Sea Air Services Company" | "فلاي رد سي" | [OFFICIAL-DOC] [S14](https://www.redseaglobal.com/en/subsidiaries/fly-red-sea/), [S10](https://www.redseaglobal.com/en/subsidiaries/), [S57](https://www.flyredsea.com/en/) |
| Airport | "Red Sea International Airport (RSI)"; RSI site H1 "Welcome to The Red Sea International Airport" | `مطار "البحر الأحمر الدولي"`; "مطار البحر الأحمر الدولي (RSI)" | [OFFICIAL-DOC] [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/), [S56](https://rsiairport.sa/en/), [S26](https://www.visitredsea.com/ar/resorts/shebara) |
| DMC | "Regenerative Escapes Tourism Company (DMC)", described as "the operational arm of Visit Red Sea" | not captured | [OFFICIAL-DOC] [S15](https://www.redseaglobal.com/en/subsidiaries/regenerative-escapes-tourism-company/) |
| Mobility | Nav "Mobility Company"; page heading "Coastal Transportation Services Company" | not captured | [OFFICIAL-DOC] [S13](https://www.redseaglobal.com/en/subsidiaries/mobility-company/) |
| AMAALA assets | "AMAALA Yacht Club", "Triple Bay", "Corallium", "Triple Bay Marina" | "نادي أمالا لليخوت"; Triple Bay appears as both "تريبل باي" and "تربل باي" | [OFFICIAL-DOC] [CONFLICT on Arabic spelling] [S5](https://www.redseaglobal.com/en/about-us/), [S41](https://www.amaala.com/ar), [S43](https://www.amaala.com/ar/resorts/daraah-resort-amaala) |
| Residences | "Red Sea Residences", "AMAALA Residences", umbrella heading "Red Sea Global Residences" | "البحر الأحمر ريزيدنسز", "أمالا ريزيدنسز", "البحر الأحمر الدولية ريزيدنسز" | [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/) |
| Environment subsidiaries | "Reef", "Botanica" | "شركة ريف لخدمات التجديد البيئي", "بوتانيكا" | [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/) |

**Third-party operator brands as named on the destination sites**

- The Red Sea (visitredsea.com lists "13 resorts"): "Six Senses Southern Dunes, The Red Sea"; "The St. Regis Red Sea Resort"; "Nujuma, a Ritz-Carlton Reserve"; "The Red Sea EDITION"; "InterContinental The Red Sea Resort"; "SLS The Red Sea"; "Four Seasons The Red Sea"; "Miraval The Red Sea"; "Grand Hyatt The Red Sea"; "Raffles The Red Sea"; plus Shebara, Desert Rock, Turtle Bay Hotel. [OBSERVED-IMPLEMENTATION] [S22](https://www.visitredsea.com/en), [S25](https://www.visitredsea.com/en/resorts)
- Arabic forms on visitredsea.com/ar: "شيبارة", "ديزرت روك", "فندق تيرتل باي", "نجومه، ريتز - كارلتون ريزيرف", "منتجع سانت ريجس البحر الأحمر", "إديشن البحر الأحمر", "منتجع انتركونتيننتال البحر الأحمر", "إس إل إس البحر الأحمر", "منتجع فورسيزونز البحر الأحمر", "منتجع ميرافال البحر الأحمر", "منتجع جراند حياة البحر الأحمر", "رافلز البحر الأحمر". Six Senses is left in Latin script: "Six Senses, Southern Dunes البحر الأحمر". [OBSERVED-IMPLEMENTATION] [S23](https://www.visitredsea.com/ar)
- AMAALA (amaala.com home carousel shows nine): "Rosewood Resort", "Nammos Resort", "Six Senses Resort", "Equinox Resort", "Four Seasons Resort And Residences", "Jayasom Wellness Resort", "Daraah Resort", and "Opening Soon": "Clinique La Prairie Health Resort", "The Ritz-Carlton Resort". Arabic: "منتجع روزوود", "منتجع ناموس", "منتجع Six Senses", "منتجع إكوينوكس", "منتجع ومساكن فور سيزونز", "منتجع جاياسوم الصحي", "منتجع دارة", "منتجع كلينيك لابريري الصحي", "منتجع الريتز-كارلتون". [OBSERVED-IMPLEMENTATION] [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar)
- The same AMAALA resort is named three ways on amaala.com: card "Six Senses Resort", H2 "Six Senses Resort, AMAALA", body and offers "Six Senses AMAALA". Rosewood appears as "Rosewood Resort" and "Rosewood AMAALA". [CONFLICT] [S43](https://www.amaala.com/en/resorts/six-senses-amaala), [S45](https://www.amaala.com/en/offers-and-packages/amaala-opening-offers)

**Which resorts are RSG-owned and operated: official statements disagree**

- Shebara is "the first luxury resort to be fully owned and operated by Red Sea Global (RSG)". [OFFICIAL-DOC] [S16](https://www.redseaglobal.com/en/portfolio/projects/shebara-resort/)
- Desert Rock is the "Fifth resort to open at The Red Sea, and the third owned and operated by Red Sea Global". [OFFICIAL-DOC] [S17](https://www.redseaglobal.com/en/portfolio/projects/desert-rock-resort/)
- The hospitality subsidiary page lists "2 Owned & Operated Resorts". [OFFICIAL-DOC] [S11](https://www.redseaglobal.com/en/subsidiaries/red-sea-global-hospitality/)
- Turtle Bay Hotel is "a self-operated property serving staff and business visitors". [OFFICIAL-DOC] [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/)
- Thuwal Private Retreat is "developed, owned, and operated by Red Sea Global" and "100% RSG". [OFFICIAL-DOC] [S9](https://www.redseaglobal.com/en/portfolio/thuwal/)
- The RSGH site lists five properties: Shebara, Thuwal Private Retreat, Desert Rock, Turtle Bay Resort, Daraah Resort. [OFFICIAL-DOC] [S48](https://redseaglobalhospitality.com/en/)
- [CONFLICT] "first", "third", "2" and a five-property list cannot all be read the same way. The count depends on whether Turtle Bay, Thuwal and Daraah are counted.

### Inferences
- "Visit Red Sea" is the name of the consumer channel (site, app, social handles, copyright line) while "The Red Sea" is the name of the destination and is what the logo lockup shows. An agent would need a rule for when to say which. This is my reading of usage, not a published rule.
- The RSG-operated set relevant to a POC is most likely Shebara, Desert Rock, Turtle Bay Hotel, Thuwal Private Retreat and Daraah Resort, based on the RSGH property list.
- Arabic transliteration of sub-brands is not controlled by a visible glossary. Shura, Adrena, Triple Bay, Turtle Bay and Thuwal each appear in more than one Arabic spelling on official pages.

### Gaps
- Registered trademark forms (word marks, classes, owners) were not checked. Not verified: requires a SAIP or WIPO trademark search or RSG legal confirmation.
- No official bilingual naming glossary was found. Not verified: requires RSG brand team to supply the approved English and Arabic name list.
- Arabic names for the Mobility company and the DMC were not captured.
- The Thuwal site is client-rendered and its body copy was not extracted, so naming on that site beyond the title and nav is unverified.

---

## 2. What positioning, value proposition, brand story, taglines and recurring phrases does each official site state?

### Takeaway
RSG positions itself as a "vertically integrated real estate developer" under PIF with "regenerative tourism" and "people and planet" as the repeated ideas. The Red Sea is sold on untouched nature and luxury ("Step Into The Extraordinary"). AMAALA is sold on wellness and personal rhythm ("Discover Your Rhythm"). Shebara and Desert Rock have their own resort-level taglines on separate sites.

### Cited Findings

**Red Sea Global (corporate)**
- Hero lines: "Building Destinations with Purpose" / "We create destinations and projects to transform places and enrich futures"; "Built for Long-Term Value Creation"; "Pioneering Residential Investment". [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/)
- Positioning statement: "Shaping a Better Future for People and Planet" / "Red Sea Global (RSG) is a vertically integrated real estate developer with a diverse portfolio spanning tourism, residential, experiences, infrastructure, transport, healthcare, and services." [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/)
- Arabic equivalents: "وجهات نبتكرها لرسم ملامح الغد"; "نبتكر مستقبلاً أجمل.. للإنسان والطبيعة". [OFFICIAL-DOC] [S2](https://www.redseaglobal.com/ar/)
- Meta description: "Welcome to Red Sea Global, a PIF giga-project redefining luxury tourism through regenerative destinations and forward-thinking investment opportunities." [OBSERVED-IMPLEMENTATION] [S1](https://www.redseaglobal.com/en/)
- Vision: "Our vision is to become the world's most responsible developer by trailblazing new global standards which see built environments become enablers for social and ecological transformation." Mission: "Our mission is to act as agents of change, by partnering with the world's greatest minds to spearhead new innovations that redefines the boundaries of our sector and create a better world for people and planet." Values listed: Responsibility, Collaboration, Passion (list continues beyond what was captured). [OFFICIAL-DOC] [S5](https://www.redseaglobal.com/en/about-us/)
- Press boilerplate (16 September 2026 release): "Red Sea Global (RSG) is a vertically integrated real estate developer with a diverse portfolio across tourism, residential, experiences, infrastructure, transport, healthcare, and services. This includes the luxury regenerative tourism destinations The Red Sea, which began welcoming guests in 2023, and AMAALA, which welcomed its first guests in 2026." Release lead-in descriptor: "Red Sea Global (RSG), the regenerative tourism developer". [OFFICIAL-DOC] [S20](https://www.redseaglobal.com/en/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/)
- Recurring phrases across RSG pages: "regenerative tourism", "responsible development", "people and planet", "Positive Impact", "new global benchmarks", "30% Targeted net conservation gain at our destinations by 2040". [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/), [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/), [S8](https://www.redseaglobal.com/en/portfolio/amaala/)

**The Red Sea**
- Corporate descriptor: "The world's most ambitious regenerative tourism destination." and "our flagship regenerative tourism destination, built to showcase the harmony between luxury and sustainability." [OFFICIAL-DOC] [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/)
- Consumer hero: H1 "Step Into The Extraordinary", H2 "Prepare for a world of luxury". Arabic H1 "هُنا تبدأ رحلتك الاستثنائية". [OBSERVED-IMPLEMENTATION] [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar)
- Brand story copy: "One of the world's last hidden treasures, The Red Sea is home to the one of the world's largest barrier reef system. This 28,000-square-kilometer haven features an archipelago of over 90 untouched islands, dormant volcanoes, sweeping desert dunes, mountain canyons, and culturally rich historical sites." [OFFICIAL-DOC] [S22](https://www.visitredsea.com/en)
- Proof points shown as counters: "40+ Epic & diverse experiences", "90 Pristine Islands", "50+ World-class resorts", "100% Run on Renewable energy". [OFFICIAL-DOC] [S22](https://www.visitredsea.com/en)
- Recurring phrases: "The Heart of The Red Sea" (Shura Island), "here, nature is your host", "Where every moment is unforgettable", "A Seamless Arrival", "Find your Own Extraordinary" (Residences). [OFFICIAL-DOC] [S22](https://www.visitredsea.com/en), [S33](https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights), [S36](https://www.visitredsea.com/en/residential)
- Third-party endorsement used on site: "Red Sea Global achieves world's first destination-wide verification with Forbes Travel Guide at The Red Sea". [OFFICIAL-DOC] [S22](https://www.visitredsea.com/en)
- [CONFLICT] Resort count: visitredsea.com home says "50+ World-class resorts", the resort list says "13 resorts", RSG corporate says "18 Hotels in total with around 3,000 keys". The figures may describe different horizons (planned versus open), but the pages do not say so. [S22](https://www.visitredsea.com/en), [S25](https://www.visitredsea.com/en/resorts), [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/)

**AMAALA**
- Consumer hero: "AMAALA" / "Discover Your Rhythm". Arabic: "أمالا" / "بها تتناغم اللحظات". [OBSERVED-IMPLEMENTATION] [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar)
- Welcome copy: "On Saudi Arabia's northwestern coast, AMAALA is a place to return to yourself." [OFFICIAL-DOC] [S40](https://www.amaala.com/en)
- Pillar labels on home: "A Coastal Icon", "Inspiring Experiences", "World-class Resorts", "The Wellness Destination". Arabic: "أيقونة ساحلية", "تجارب ملهمة", "منتجعات عالمية", "وجهة الاستشفاء الأولى". [OFFICIAL-DOC] [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar)
- Meta description: "AMAALA is a luxury tourism destination focused on wellness, offering exceptional tailored experiences amid pristine natural landscapes." [OBSERVED-IMPLEMENTATION] [S40](https://www.amaala.com/en)
- Corporate descriptors: "The global wellness haven on Saudi Arabia's Red Sea coast"; "AMAALA reimagines the art of living well"; "AMAALA is a luxury wellness and lifestyle destination designed to nurture mind, body, and planet."; nav strapline "A Coastal Sanctuary of Splendor". [OFFICIAL-DOC] [S8](https://www.redseaglobal.com/en/portfolio/amaala/), [S5](https://www.redseaglobal.com/en/about-us/)
- Recurring phrases: "Choose Your Own Rhythm", "Your Journey to AMAALA Begins Here", "Year-round destination", "The New Yachting Icon", "the rhythm of the Red Sea". [OFFICIAL-DOC] [S40](https://www.amaala.com/en)

**Thuwal Private Retreat**
- "Where Exclusivity Meets Luxury"; "the only private island in the Red Sea available for exclusive use"; "operates as a buy-out-only property, welcoming just one group at a time". [OFFICIAL-DOC] [S9](https://www.redseaglobal.com/en/portfolio/thuwal/)

**Red Sea Global Hospitality and its resorts**
- RSGH: "Shaping the Future of Hospitality"; "Pioneering hotels and resorts, bespoke residences, and world-class dining; all united by an unwavering commitment to authentic Saudi Arabian heritage." [OFFICIAL-DOC] [S48](https://redseaglobalhospitality.com/en/)
- RSG states an explicit brand-related responsibility for RSGH: "Brand Integration & Growth: Support RSG's continued expansion by leveraging its established brand equity to create a seamless, fully integrated developer and operator model" and "Distinctive Service Culture: Define and uphold a unique service culture rooted in Saudi hospitality traditions." [OFFICIAL-DOC] [S11](https://www.redseaglobal.com/en/subsidiaries/red-sea-global-hospitality/)
- Shebara tagline: "WHERE NOW IS FOREVER" (H1 and footer); closing line "Shebara: where now is forever." Sub-phrases: "barefoot sophistication", "Ethereal Design", "Pure Connection with Nature", "Exemplary Experiences". [OFFICIAL-DOC] [S49](https://www.shebara.sa/en/)
- Shebara Arabic H1 is not a translation of the English tagline: "حيث المستقبل المستدام". [OBSERVED-IMPLEMENTATION] [S49](https://www.shebara.sa/ar/)
- Desert Rock: H1 "A Luxury Mountain Sanctuary Above the Red Sea"; "Life On A Higher Plane"; "Desert Rock: a resort unlike any other."; uses the Arabic hospitality term in English copy: "the spirit of hafawah - genuine, caring Saudi hospitality". Arabic H1 "تصميم يتخطى المألوف". [OFFICIAL-DOC] [S50](https://www.desertrock.sa/en/), [S50](https://www.desertrock.sa/ar/)
- Turtle Bay Hotel: "Your Hotel Gateway to Saudi Arabia's Red Sea"; "A laid-back hotel escape on Saudi Arabia's Red Sea Coast". [OFFICIAL-DOC] [S52](https://turtlebayhotel.sa/en/)
- Daraah Resort: "Where WELLNESS Meets WONDER at DARAAH on the Saudi Red Sea"; "Mindful tranquility immersed in nature". [OFFICIAL-DOC] [S53](https://tbha-hotel.com/en/)

**Experience and transport brands**
- Fly Red Sea: "Above all experiences – making the Red Sea as memorable from above as it is on the ground" (RSG page); own site "From The Calm Red Sea Into The Sky Above". [OFFICIAL-DOC] [S14](https://www.redseaglobal.com/en/subsidiaries/fly-red-sea/), [S57](https://www.flyredsea.com/en/)
- Shura Links: H1 "Never The Same Twice"; "An Exclusive Golfing Experience on the Shores of the Red Sea". [OFFICIAL-DOC] [S55](https://shuralinks.com/)
- Laha Beach Ladies Club: "Designed Purely for Her"; "A shoreline for women"; "A vibrant haven for her". [OFFICIAL-DOC] [S39](https://www.visitredsea.com/en/laha-beach-ladies-club), [S22](https://www.visitredsea.com/en)
- Adrena: "your all-access gateway to one of The Red Sea's most dynamic lifestyle destinations". [OFFICIAL-DOC] [S39](https://www.visitredsea.com/en/experiences/adrena/adrena)

### Inferences
- The corporate voice sells capability and investment. The destination voices sell feeling. A guest-facing agent should not borrow corporate phrases such as "vertically integrated" or "institutional-grade asset". This is interpretation, not an RSG rule.
- "Regenerative" is the corporate signature word but is nearly absent from visitredsea.com and amaala.com guest copy that was captured, where "luxury", "pristine", "seamless", "wellness" and "rhythm" dominate.

### Gaps
- No page labelled "brand story", "brand promise" or "brand pillars" was found on any site. The quotes above are marketing and corporate copy, not a declared brand platform. Not verified: requires RSG brand platform documents.
- Thuwal consumer-site copy not captured (client-rendered).
- WAMA, Galaxea and AKUN have no standalone sites that were found, so their positioning comes only from RSG corporate and AMAALA pages.

---

## 3. Are audiences explicitly stated anywhere?

### Takeaway
No audience segmentation or persona statement was found. Audiences are named only in passing, mostly on corporate pages.

### Cited Findings
- "for both B2B and B2C audiences" and "Reservation management for corporate and individual clients", "VIP care". [OFFICIAL-DOC] [S15](https://www.redseaglobal.com/en/subsidiaries/regenerative-escapes-tourism-company/)
- A "Travel Trade" page exists for trade partners on visitredsea.com. [OFFICIAL-DOC] [S30](https://www.visitredsea.com/en/theredsea-travel-trade-toolkit)
- Investors are addressed directly: "Invest with us", "Institutional-grade asset. Diversfied portfolio. Proven delivery." (typo is on the page). [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/)
- Women: Laha Beach Ladies Club, "our all-female team". [OFFICIAL-DOC] [S39](https://www.visitredsea.com/en/laha-beach-ladies-club)
- Families and generations: Jayasom "wellness experiences for adults and families" (RSG social post shown on home); "Six Senses AMAALA invites guests of all generations". [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/), [S43](https://www.amaala.com/en/resorts/six-senses-amaala)
- Staff and business visitors: Turtle Bay Hotel is "a self-operated property serving staff and business visitors". [OFFICIAL-DOC] [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/)
- Yachting: "Now welcoming founding members and visiting yachts"; "Whether you're an elite racer, a novice sailor". [OFFICIAL-DOC] [S1](https://www.redseaglobal.com/en/), [S47](https://www.amaala.com/en/amaala-yacht-club)
- Residence buyers: "the world's most sophisticated homeowners". [OFFICIAL-DOC] [S47](https://www.amaala.com/en/residences)
- Couples appear only through an offer name: "Romantic Getaway at The Red Sea ... crafted for couples". [OFFICIAL-DOC] [S22](https://www.visitredsea.com/en)

### Inferences
- The live sites imply at least these audience groups: leisure guests (couples, families, wellness seekers), residence buyers, travel trade, investors, yacht owners, job seekers and suppliers. This list is assembled from navigation and copy, not from any RSG statement of target audiences.

### Gaps
- Target markets by nationality, source market priorities, and persona definitions. Not verified: requires RSG marketing strategy or persona documents.

---

## 4. What tone of voice is demonstrated?

### Takeaway
Guest-facing English is elevated and sensory, with second-person address and frequent superlatives. Corporate English is formal and achievement-led. Arabic copy is rewritten rather than translated literally, uses Modern Standard Arabic with a literary register, and puts brand names inside quotation marks. Microcopy is plain and functional in both languages. All of this is observation of live copy, not an RSG tone-of-voice rule.

### Cited Findings

| Site | Type | English example | Arabic example | Source |
|---|---|---|---|---|
| visitredsea.com | Headline | "Step Into The Extraordinary" | "هُنا تبدأ رحلتك الاستثنائية" | [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar) |
| visitredsea.com | Section line | "Experience the pinnacle of elegance and comfort" | "وجهات الرفاهية والفخامة" | [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar) |
| visitredsea.com | Body | "With coral reefs glowing, wild blooms swaying, and life unfolding in its purest form, here, nature is your host." | "هُنا، تستقبلك الطبيعة بسخائها؛ من توهج المرجان وتفتّح الأزهار البرية… تبدو وكأنها تبتهج برؤية ضيوفها." | [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar) |
| visitredsea.com | Newsletter | "Stay Connected" / "Sign up to receive exclusive updates, news, and insights about destinations, offers, and experiences." | "ابقَ على اطلاع" / "اشترك في النشرة البريدية؛ لتكون أول من يعلم بآخر أخبار الوجهات، وأحدث التجارب، وأفضل العروض" | [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar) |
| visitredsea.com | Contact form | "Let us know how can we assist you"; fields "First Name", "Last Name", "Email", "Phone", "Select your enquiry", "Additional Comments (Optional)" | "كيف يمكننا مساعدتك؟"; "الاسم الأول", "اسم العائلة", "البريد الإلكتروني", "الهاتف", "حدد استفسارك", "تعليقات إضافية (اختياري)" | [S37](https://www.visitredsea.com/en/contact-us), [S37](https://www.visitredsea.com/ar/contact-us) |
| visitredsea.com | Consent line | "By submitting this form, you confirm that you have read and agreed to our Terms and Conditions and Privacy Policy." | "بتقديمك لهذا النموذج، فإنك تؤكد أنك قد قرأت ووافقت على الشروط والأحكام وسياسة الخصوصية." | [S37](https://www.visitredsea.com/en/contact-us), [S37](https://www.visitredsea.com/ar/contact-us) |
| visitredsea.com | System message | "Processing action... This process may take a few seconds, do not close the screen." | not captured | [S22](https://www.visitredsea.com/en) |
| visitredsea.com | Operational notice | "Surf Lagoon is temporarily closed." | "بحيرة الأمواج (Surf Lagoon) مغلقة مؤقتًا." | [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar) |
| amaala.com | Headline | "Discover Your Rhythm" | "بها تتناغم اللحظات" | [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar) |
| amaala.com | Body | "every experience is shaped around a deeper connection... to your wellbeing, to nature, to the people around you and to the rhythm that feels entirely your own." | "تفتح لك وجهة \"أمالا\" مساحةً تعود فيها إلى ذاتك، وتستعيد فيها صلتك بالطبيعة" | [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar) |
| amaala.com | Newsletter | "Stay Connected" / "Sign Up" | "كن أول من يعرف" / "اشترك الآن" | [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar) |
| amaala.com | Policy copy | "If you cancel between 24 and 48 hours before the scheduled start time, you will receive a 50% refund." | not captured | [S44](https://www.amaala.com/en/experiences/water-sports/above-water) |
| redseaglobal.com | Headline | "Building Destinations with Purpose" | "وجهات نبتكرها لرسم ملامح الغد" | [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/) |
| redseaglobal.com | Body | "RSG is guided by Saudi Arabia's Vision 2030 to create destinations and projects that deliver lasting social, environmental, and economic value" | "تستلهم \"البحر الأحمر الدولية\" رؤية السعودية 2030" | [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/) |
| redseaglobal.com | Form | "Get in touch" / "To learn more about Red Sea Global, please get in touch."; "News & Updates" / "Subscribe to get the latest news and updates right to your inbox." | "ابقَ على تواصل" (section label) | [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/) |
| shebara.sa | Headline | "WHERE NOW IS FOREVER" | "حيث المستقبل المستدام" | [S49](https://www.shebara.sa/en/), [S49](https://www.shebara.sa/ar/) |
| desertrock.sa | Body | "Welcoming with warmth and the spirit of hafawah - genuine, caring Saudi hospitality" | "عِش تجربة لا تُنسى، صُممت خصيصًا لك برفقة مُضيفك الشخصي." | [S50](https://www.desertrock.sa/en/), [S50](https://www.desertrock.sa/ar/) |

Other observed traits, each [OBSERVED-IMPLEMENTATION]:
- British and American spellings are mixed on visitredsea.com: "enquiry" and "travellers" alongside "personalized" and "Accommodations". [S37](https://www.visitredsea.com/en/contact-us), [S22](https://www.visitredsea.com/en), [S26](https://www.visitredsea.com/en/resorts/shebara)
- Live copy contains uncorrected errors: "Seemlesly Connected", "the one of the world's largest barrier reef system", "or or scenic road trips", "Up to to 5 attendees", "1 Activites". [S32](https://www.visitredsea.com/en/visitredsea-app), [S22](https://www.visitredsea.com/en), [S33](https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights), [S34](https://www.visitredsea.com/en/experiences/water-sports), [S39](https://www.visitredsea.com/en/experiences/adrena/adrena)
- Headline capitalisation is not uniform on visitredsea.com: title case ("Step Into The Extraordinary"), sentence case ("Prepare for a world of luxury") and all caps ("EXPLORE SHURA ISLAND") on the same page. [S22](https://www.visitredsea.com/en)
- Arabic on visitredsea.com uses Western digits in most places ("90", "28,000") and Arabic-Indic digits in one line ("أكثر من ٢٠ تجربة"). [S23](https://www.visitredsea.com/ar)
- Arabic copy uses decorative kashida in a section label: "الــمــنــتــجــعــات". [S23](https://www.visitredsea.com/ar), [S41](https://www.amaala.com/ar)

### Inferences
- Guest tone can be summarised as warm, elevated, nature-led and second person. Policy and booking text switches to plain, direct sentences. This summary is mine.
- Arabic is transcreated: the English and Arabic taglines often carry different ideas (Shebara, AMAALA hero). An agent cannot produce on-brand Arabic by translating English lines.

### Gaps
- No tone-of-voice guideline, glossary, banned-word list or style guide was found. Not verified: requires RSG to supply tone-of-voice guidance in English and Arabic.
- Transactional copy (booking confirmation page, confirmation email, error states, chat greetings) was not observed because no booking was made and the chat was not opened.

---

## 5. What do buttons and calls to action say on each site?

### Takeaway
The destination platforms use "Book" as the single primary CTA and "Explore" for discovery. The RSG-operated resort sites use "Check Availability" instead. "Plan your trip" is a navigation label, not a button. "Enquire" appears only for residences.

### Cited Findings
All [OBSERVED-IMPLEMENTATION]. Many labels are sentence case in the DOM and displayed in capitals by CSS, so the same button reads "Book" in HTML and "BOOK" on screen.

| Site | English | Arabic | Source |
|---|---|---|---|
| visitredsea.com header and nav | "Book", "Map", "Account", "Log In or Sign Up", "English / SAR"; nav "Resorts", "Experiences", "Dining", "Promotions", "SHURA ISLAND", "Plan your trip" | "احجز", "الخريطة", "حسابي", "تسجيل الدخول أو التسجيل", "عربى / ريال سعودي"; nav "المنتجعات", "التجارب", "المطاعم", "عروض حصرية", "جزيرة شُورى", "خطط رحلتك" | [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar) |
| visitredsea.com page CTAs | "EXPLORE", "EXPLORE ALL RESORTS", "EXPLORE NOW", "EXPLORE ALL OFFERS", "EXPLORE OFFER", "EXPLORE ALL EXPERIENCES", "EXPLORE LAHA", "BOOK", "BOOK NOW", "Details", "Discover More", "DOWNLOAD THE APP", "DOWNLOAD NOW", "Request a quote", "Email Us", "Sign up", "Contact Us", "SUBMIT", "Reserve Today", "BACK TO RESORTS LIST", "7 more resorts" | "استكشف جميع المنتجعات", "استكشف الآن", "استكشف جميع العروض", "استكشف جميع التجارب", "اكتشف المزيد", "اشترك الآن", "تواصل معنا", "إرسال", "العودة إلى المنتجعات" | [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar), [S25](https://www.visitredsea.com/en/resorts), [S26](https://www.visitredsea.com/en/resorts/shebara), [S30](https://www.visitredsea.com/en/theredsea-travel-trade-toolkit), [S34](https://www.visitredsea.com/en/experiences/water-sports), [S37](https://www.visitredsea.com/ar/contact-us) |
| visitredsea.com booking widget (opened, not submitted) | Tabs "Resorts", "Experiences", "Transportation"; fields "Where would you like to go?" / "Select resort", "Guests" / "2 Adults, 0 Children", "Check in — Check out" / "Select date", "Nights"; buttons "ADD ANOTHER RESORT", "SEARCH", "CLOSE" | not captured | Seen in browser at [S26](https://www.visitredsea.com/en/resorts/shebara), about 18:51 UTC |
| visitredsea.com residences | "Enquire about Ownership" | not captured | [S36](https://www.visitredsea.com/en/residential) |
| amaala.com | "Book", "BOOK", "BOOK NOW", "EXPLORE ALL RESORTS", "EXPLORE ALL EXPERIENCES", "Explore More", "EXPLORE OFFERS", "Sign Up", "Contact Us", "Log In or Sign Up", "Register Your Interest", "BACK TO RESORTS LIST", "SHOW MORE AMENITIES", "GO BACK"; status label "Opening Soon"; nav "RESORTS", "EXPERIENCES", "AMAALA YACHT CLUB", "PLAN YOUR TRIP" | "احجز", "احجز الآن", "استكشف جميع المنتجعات", "استكشف جميع التجارب", "اكتشف المزيد", "اكتشف العروض", "اشترك الآن", "تواصل معنا", "تسجيل الدخول أو التسجيل", "العودة إلى المنتجعات"; "الافتتاح قريبا"; nav "المنتجعات", "التجارب", "نادي أمالا لليخوت", "خطط لرحلتك" | [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar), [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala), [S47](https://www.amaala.com/en/residences) |
| redseaglobal.com | "Explore Our Portfolio", "Invest with Us", "Explore Red Sea Residences", "More About Us", "Our Services", "Explore", "View", "View Services", "View Subsidiaries", "View Destination", "View Website", "Visit Website", "Meet Our Leadership", "Read more", "Show more +", "Contact us", "Submit", "Download", "All news" | "اكتشف محفظة مشاريعنا", "استثمر معنا", "اكتشف مساكن البحر الأحمر", "المزيد عنّا", "اكتشف المزيد", "عرض المزيد +", "تفضل بزيارة الموقع", "جميع الأخبار" | [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/), [S9](https://www.redseaglobal.com/ar/portfolio/thuwal/), [S19](https://www.redseaglobal.com/en/media-center/) |
| shebara.sa, desertrock.sa | "Check Availability", "Discover the Villas", "Explore More Offers", "Getting Here", "Contact Us", "Back to top", language switch "العربية" | "إحجز إقامتك", language switch "En"; nav "الڤلل", "العروض", "تناول الطعام", "التجارب والنشاطات", "للتواصل معنا" | [S49](https://www.shebara.sa/en/), [S49](https://www.shebara.sa/ar/), [S50](https://www.desertrock.sa/en/), [S50](https://www.desertrock.sa/ar/) |
| turtlebayhotel.sa | "CHECK AVAILABILITY", "Menu" | "إحجز إقامتك", "القائمة" | [S52](https://turtlebayhotel.sa/en/), [S52](https://turtlebayhotel.sa/ar/) |
| tbha-hotel.com (Daraah) | "Check Availability", "SIGN UP", "Back To Top" | "التحقق من التوفر", "العودة إلى الأعلى" | [S53](https://tbha-hotel.com/en/), [S53](https://tbha-hotel.com/ar/) |
| flyredsea.com | "Book Tour", "Book Now", "Watch Video", "View Details" | not captured | [S57](https://www.flyredsea.com/en/) |
| shuralinks.com | "BOOK NOW" | not captured | [S55](https://shuralinks.com/) |
| redseaglobalhospitality.com | "Explore more", "Explore Now", "View Opportunities" | not captured | [S48](https://redseaglobalhospitality.com/en/) |

- [CONFLICT] The same English CTA "Check Availability" is rendered in Arabic as "إحجز إقامتك" (book your stay) on Shebara, Desert Rock and Turtle Bay, and as "التحقق من التوفر" (check availability) on Daraah. [S49](https://www.shebara.sa/ar/), [S53](https://tbha-hotel.com/ar/)
- "إحجز" is written with a hamza under the alif on the resort sites, and "احجز" without it on visitredsea.com and amaala.com. [OBSERVED-IMPLEMENTATION] [S49](https://www.shebara.sa/ar/), [S23](https://www.visitredsea.com/ar)

### Inferences
- A POC agent that hands off to booking should use "Book" / "احجز" when acting inside the destination platforms and "Check Availability" when sending a guest to an RSG Hospitality resort site, to match what guests already see. This is a suggestion drawn from the observed labels.

### Gaps
- CTA labels inside the booking flow after "SEARCH" (rate selection, guest details, payment, confirmation) were not observed. Not verified: requires a supervised walkthrough with test data or screenshots from RSG.
- Arabic labels of the Visit Red Sea booking widget were not captured.

---

## 6. What naming conventions are used for destinations, room and villa types, packages and experiences?

### Takeaway
Operator resorts at The Red Sea follow "[Operator brand] The Red Sea" in most cases. At AMAALA the pattern is "[Operator brand] Resort" on cards and "[Operator brand] AMAALA" in copy. RSG-operated resorts use a single coined name. Villas follow "[Bedroom count] Bedroom [Setting] [Tier] Villa". Offers are named by theme and nearly always include the destination name.

### Cited Findings
All [OBSERVED-IMPLEMENTATION] unless marked.

- Destination naming: "The Red Sea" takes the definite article and a capital T mid-sentence ("at The Red Sea", "Arriving at The Red Sea"). Sub-areas: "Shura Island", "Ummahat", "Laheq", "Sheybarah Island", "Southern Dunes", "Turtle Bay". AMAALA sub-areas: "Triple Bay", "Daraah Village". [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/), [S36](https://www.visitredsea.com/en/residential), [S53](https://tbha-hotel.com/en/)
- Resort cards on visitredsea.com carry a location eyebrow: "The Red Sea" or "The Red Sea | Shura Island". Filter categories: "All Resorts", "Beachfront", "Wellness", "Over-water", "Rocky Mountains", "Dune" (Arabic: "كل المنتجعات", "على الشاطئ", "للاستشفاء", "على البحر", "بين الجبال", "بين الكثبان الرملية"). [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar)
- Shebara villa types: "One Bedroom Overwater Villa", "Two Bedroom Overwater Villa", "One Bedroom Beach Villa", "Two Bedroom Beach Villa", "One Bedroom Beach Crown Villa", "Three Bedroom Beach Crown Villa", "One Bedroom Beach Royal Villa", "Four Bedroom Beach Royal Villa". The same eight names appear on shebara.sa. [S26](https://www.visitredsea.com/en/resorts/shebara), [S49](https://www.shebara.sa/en/villas/)
- Shebara Arabic villa names: "فيلا فوق الماء بغرفة نوم واحدة", "فيلا فوق الماء بغرفتي نوم", "فيلا شاطئية بغرفتي نوم", "فيلا كراون الشاطئية بثلاث غرف نوم", "فيلا رويال الشاطئية بأربع غرف نوم". The one-bedroom beach villa breaks the pattern: "فيلا فاخرة على الشاطئ تضم غرفة نوم واحدة". Tier names are transliterated ("كراون", "رويال"). [S26](https://www.visitredsea.com/ar/resorts/shebara)
- Desert Rock on visitredsea.com: "One bedroom Wadi Villa" (lower-case b), "Two Bedroom Wadi Villa", "One Bedroom Cliff Hanging Villa", "Two Bedroom Cliff Hanging Villa", "One Bedroom Mountain Cave Suite", "One Bedroom Mountain Crevice Villa", "Two Bedroom Mountain Crevice Skyline Villa", "Three Bedroom Royal Villa". [S27](https://www.visitredsea.com/en/resorts/desert-rock)
- [CONFLICT] Desert Rock on its own site hyphenates and adds a category the destination site does not list: "One-Bedroom Wadi Villa", "One-Bedroom Mountain View Villa", "Two-Bedroom Mountain View Villa", "One-Bedroom Cliff Hanging Villa", "Three-Bedroom Royal Villa", grouped under "Wadi Villas", "Mountain View Villas", "Cliff Hanging Villas", "Mountain Cave Suites", "Mountain Crevice Villas", "Royal Villa". [S50](https://www.desertrock.sa/en/villas/)
- Turtle Bay Hotel and Daraah Resort use hotel-style names: "Deluxe King Room", "Deluxe King Room with Garden View", "Deluxe King Room with Sea View", "Deluxe Twin Room", "Deluxe Twin Room Sea View", "Deluxe Twin Room Garden View"; Daraah adds "Family Room". View naming is inconsistent ("with Sea View" versus "Sea View"). Arabic at Daraah: "غرفة ديلوكس كينغ", "غرفة ديلوكس توأم بإطلالة على البحر", "غرفة عائلية". [S28](https://www.visitredsea.com/en/resorts/turtle-bay), [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala), [S43](https://www.amaala.com/ar/resorts/daraah-resort-amaala)
- Operator examples: St. Regis "One Bedroom Dune Villa", "One Bedroom Sunset Coral Villa", "The Astor Villas", "Presidential Dune Villa", and one misspelling "Two Bedroom Sunset Dune Accesible Villa". Six Senses AMAALA "Bayview Suite", "Lagoon Pool Suite", "One Bedroom Pool Villa" to "Four Bedroom Pool Villa". [S29](https://www.visitredsea.com/en/resorts/the-st-regis-red-sea-resort), [S43](https://www.amaala.com/en/resorts/six-senses-amaala)
- Room card attribute order on visitredsea.com: occupancy, bedrooms, bed type, view or setting, area, pool. Example: "2 Adults + 1 Child + 1 Infant 1 Bedroom 1 King Bed Overwater Villa 188 sqm Private Pool". Room detail tabs: "Bedroom", "Bathroom", "Living Room", "Outdoor" (Arabic "غرفة النوم", "الحمام", "غرفة المعيشة", "المنطقة الخارجية"). [S26](https://www.visitredsea.com/en/resorts/shebara)
- Accommodation section headings: "Your Private Escape" / "Accommodations" on both destination platforms (Arabic "ملاذك الخاص" / "أماكن الإقامة" on AMAALA; "استمتع بتجربة التناغم المطلق" on the Shebara page). [S26](https://www.visitredsea.com/en/resorts/shebara), [S43](https://www.amaala.com/ar/resorts/daraah-resort-amaala)
- Offer and package names at The Red Sea: "Multi-Resort Escape Offer", "The Red Sea & AlUla Expedition", "Red Sea Wellness Escape", "Romantic Getaway at The Red Sea", "Fly Red Sea Seaplane Special Offers", "Adrena Day Pass". Validity format: "Offer valid until 18 December". The nav calls the section "Promotions", the URL is `/offers-and-packages`, the H2 says "OFFERS", and the listing says "4 promotions". [S22](https://www.visitredsea.com/en), [S35](https://www.visitredsea.com/en/offers-and-packages)
- Arabic offer names are rewritten, not transliterated: "باقات تجمع بين عالمين", "رحلة رومانسية للزوجين إلى وجهة البحر الأحمر", "عروض جولات الطيران المائي", "تجربة تذكرة اليوم في أدرينا". [S23](https://www.visitredsea.com/ar)
- AMAALA offers: "AMAALA Resorts Opening Offers" with sub-offers "Four Seasons AMAALA Opening Offer", "Six Senses AMAALA Opening Offer", "Rosewood AMAALA Opening Offer". [S45](https://www.amaala.com/en/offers-and-packages/amaala-opening-offers)
- Resort-site offers are descriptive sentences: "Stay 3 Nights Or More And Enjoy 20% Off The Villa Rate". A cross-resort product is named "Sea to Mountains" on Shebara and "Mountains to Sea" on Desert Rock, both at URL slug `7-days-2-worlds`. [S49](https://www.shebara.sa/en/), [S50](https://www.desertrock.sa/en/)
- Experience categories at The Red Sea: "Water Sports", "Adventure Sports", "Nature", "Adrena", "Laha Beach", "Golf" / "Shura Links". Activities use generic nouns: "Scuba Diving", "Sailing", "Snorkeling", "Windsurfing", "WingSup", "Kayaking". Card attributes: "5 Activities", "8+ Years old", "Able to swim". [S34](https://www.visitredsea.com/en/experiences/water-sports)
- The RSSE activity brands are not used as category labels on visitredsea.com: categories say "Water Sports" and "Adventure Sports", while the Adventure Sports icon alt text is "akun". On amaala.com the brand is used in copy: "WAMA-led activities", "WAMA Cancellation Policy". [S22](https://www.visitredsea.com/en), [S44](https://www.amaala.com/en/experiences/water-sports/above-water)
- AMAALA experience naming: category "Above Water"; H1 "Water Experiences"; items "E-Scooter", "E-Foil", "Seabob", "Stand Up Paddle Board", "Single kayak", "Tandem kayak"; price format "Rental: SAR 700, 40 mins". [S44](https://www.amaala.com/en/experiences/water-sports/above-water)
- Restaurant names are short coined words with a cuisine descriptor: "Nyra" (wood-fire dining), "Basalt" (Saudi and International Flavours), "Mica" (Mixology Artistry), "Gishiki 45" (Japanese); at Shebara "Saria", "Ariamare", "Iki.roe", "Lunara", "Solera". Mica is written "MICA" on desertrock.sa. [S38](https://www.visitredsea.com/en/dining), [S26](https://www.visitredsea.com/en/resorts/shebara), [S50](https://www.desertrock.sa/en/)
- Currency and rate conventions: "SAR" before or after the figure ("SAR 700", "1,500 SAR + VAT & MT"); "All room rates, charges and fees are in Saudi Arabian Riyal (SAR) and are subject to 5% Municipality tax (MT) and 15% Value added tax (VAT)". [S26](https://www.visitredsea.com/en/resorts/shebara), [S44](https://www.amaala.com/en/experiences/water-sports/above-water)

### Inferences
- Room and villa names are a controlled list per resort and should be loaded from data, never generated. The Desert Rock mismatch between two official sites shows that the list itself needs an owner-confirmed source of truth.
- The category "Promotions" versus "Offers" versus "Packages" is not settled on the live site.

### Gaps
- Official room-type master list and Arabic equivalents per resort. Not verified: requires RSG Hospitality inventory or PMS room-type export.
- Whether WAMA, Galaxea and AKUN are meant to be guest-facing brand names at The Red Sea. Not verified: requires RSSE or brand team confirmation.

---

## 7. What fonts and colours are actually implemented?

### Takeaway
Each brand layer runs a different type system: RSG corporate uses Questa Grande, Paralucent and Noto Kufi Arabic; Visit Red Sea uses the Fedra family; AMAALA uses three custom "AMAALA" faces; Shebara uses Montserrat; Desert Rock adds "presicaLT" and "swissraRegular". Colour tokens are named and scaled in CSS for RSG, Visit Red Sea and AMAALA. Everything in this section is [OBSERVED-IMPLEMENTATION] and must not be read as an official palette or type specification.

### Cited Findings

**redseaglobal.com** (file: https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css, about 1.0 MB, read via in-page fetch)
- `@font-face` families declared: `Questa Grande` (weights 100, 400, 700; files QuestaGrande-Light/Regular/Bold.woff2), `Paralucent` (100, 400, 700; Paralucent-Light/Medium/Bold.woff2), `Noto Kufi Arabic` (100, 400, 700), `swiper-icons`. [S3](https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css)
- `font-family` declaration counts in that file: `Noto Kufi Arabic` 57, `Questa Grande` 32, `Paralucent` 24. [S3](https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css)
- Computed in browser on /en/: body `Paralucent`, h1 and h2 `"Questa Grande"`. On /ar/: body, h1 and h2 all `"Noto Kufi Arabic"`. [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/)
- Custom properties, exactly as found: `--rsg-blue-25:#ebf5fc`, `--rsg-blue-50:#d5e5f0`, `--rsg-blue-100:#c1d5e3`, `--rsg-blue-200:#a8c3d6`, `--rsg-blue-300:#8eadc4`, `--rsg-blue-400:#7496ae`, `--rsg-blue-500:#587991`, `--rsg-blue-600:#3f617a`, `--rsg-blue-700:#1f415a`, `--rsg-blue-800:#04253c`, `--rsg-blue-900:#0a1d2d`; `--rsg-gold-25:#faf7f2`, `--rsg-gold-50:#f2efe8`, `--rsg-gold-100:#e2dcd0`, `--rsg-gold-200:#d4c8b2`, `--rsg-gold-300:#c3af8a`, `--rsg-gold-400:#b89c67`, `--rsg-gold-500:#a1885a`, `--rsg-gold-600:#8a734d`, `--rsg-gold-700:#75613d`, `--rsg-gold-800:#5a4c31`, `--rsg-gold-900:#3d3525`; `--rsg-grey-25:#f1f3f5` through `--rsg-grey-900:#111314`. [S3](https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css)
- Named accent tokens: `--rsg-blue-lagoon-200:#74c0c4`, `-500:#0e868f`, `-600:#007481`; `--rsg-crystal-waters-200:#54c0e8`, `-500:#0c85b5`, `-600:#006f9c`; `--rsg-blooming-nature-200:#85d6bb`, `-500:#00946e`, `-600:#007657`; `--rsg-majestic-mountains-200:#de9696`, `-500:#a83535`, `-600:#852e2c`; `--rsg-thriving-corals-200:#ffc7ab`, `-500:#ff5c35`, `-600:#cc492a`; `--rsg-sandy-dunes-200:#f7e0b2`, `-500:#f4b223`, `-700:#936a15`; `--rsg-volcanic-ash-200:#c0c1c1`, `-500:#6f7271`, `-600:#5a5c5b`. [S3](https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css)
- Most frequent literal hex values in the file: `#e6e6e6` (25), `#0a1d2d` (17), `#f2efe8` (17), `#04253c` (9), `#569ff7` (8). [S3](https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css)
- Type scale variables: `--heading-font-size-2xl:72px`, `-xl:64px`, `-l:48px`, `-m:32px`, `-s:24px`, `-xs:20px`; `--text-font-size-l:18px`, `-m:16px`, `-s:14px`, `-xs:12px` (a second, smaller set also exists, presumably for a breakpoint). [S3](https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css)
- Implementation defect: the file contains uncompiled Sass variables as literal values, `--cmp-button__font__ltr:$font-family-body` and `--cmp-button__font__rtl:$font-family-body-arabic`. A second stylesheet sets `--cmp-button__font__ltr:Roboto` and `--cmp-button__font__rtl:Arial`. A button measured in the browser computed to `Paralucent`, radius `999px`. [S3](https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css), [S4](https://www.redseaglobal.com/etc.clientlibs/rsgfactory/clientlibs/clientlib-site.min.eb79e8521c820e7406aba0b899de6bbc.css), [S11](https://www.redseaglobal.com/en/subsidiaries/red-sea-global-hospitality/)

**visitredsea.com** (21 CSS chunks under `/_next/static/chunks/`; font faces in https://www.visitredsea.com/_next/static/chunks/e9bef7166ea3db4a.css)
- `@font-face` families: `Fedra Sans AL` (300 Light, 400 Book, 500 Demi, 600 Medium, 700 Bold), `Fedra Serif Display` (400, 500, 600, 700), `Fedra Serif Arabic AR` (400 Book, 450 Demi, 600 Medium, 700 Bold). Font files are served from `/content/dam/red-sea/en/system/fonts/`, for example `FedraSansAL-Book.woff2`, `FedSerDis-Regular.woff2`, `FedraSerifArabic-Book.woff2`. [S24](https://www.visitredsea.com/_next/static/chunks/e9bef7166ea3db4a.css)
- `font-family` declarations across the chunks: `Fedra Sans AL` 33, `Fedra Serif Display` 9, `Fedra Serif Arabic AR` 5; fallbacks named in rules: `Fedra Sans AL,Jost,sans-serif`, `Noto Sans,sans-serif`, `var(--Font-family-Fedra-Sans,"Fedra Sans Pro")`, `var(--Typeface-font-heading-LTR,"Fedra Serif Display")`. [S24](https://www.visitredsea.com/_next/static/chunks/e9bef7166ea3db4a.css)
- Computed in browser: body `"Fedra Sans AL", Arial, sans-serif` on both /en and /ar. On /ar/contact-us the fonts reported as loaded were `Fedra Sans AL 400` and `Fedra Serif Arabic AR 450`. [S37](https://www.visitredsea.com/ar/contact-us)
- Colour tokens (found in chunks `61314f95ff831413.css`, `ca4f8fc3e8dbe210.css`, `e9bef7166ea3db4a.css`): families `--colors-vrs-aqua`, `--colors-vrs-blue-charcoal`, `--colors-vrs-purple`, `--colors-vrs-sand`, `--colors-vrs-sea`, `--colors-vrs-stone`, `--colors-vrs-turquoise`. Values: `--colors-vrs-aqua-50:#e6f6f5`, `-100:#d0ede9`, `-200:#a8e0db`, `-300:#89d2cb`, `-400:#71bfb7`, `-500:#589e98`, `-600:#43807b`, `-700:#37706c`, `-800:#2c5c59`, `-900:#224a47`; `--colors-vrs-blue-charcoal-25:#f5f8fa`, `-50:#f0f3f5`, `-100:#dadfe3`, `-200:#c5cdd2`, `-300:#b2bac1`, `-400:#9ba7b0`, `-500:#88949e`, `-600:#6c7882`, `-700:#535e66`, `-800:#353e44`, `-900:#1e282f`; `--colors-vrs-turquoise-25:#effcfc`, `-50:#dff9f9`, `-100:#d7f7f7`; `--colors-vrs-sand-25:#fafaf7`, `-50:#f5f5f3`, `-100:#efeeea`; `--colors-vrs-sea-50:#eaf1f2`, `-200:#c2cdce`, `-500:#627f81`; `--colors-vrs-stone-50:#ebeded`, `-200:#a2a6a6`, `-500:#696e6e`; `--colors-vrs-purple-50:#efeaf7`, `-200:#c5bcd4`, `-500:#8b809e`. [S24](https://www.visitredsea.com/_next/static/chunks/e9bef7166ea3db4a.css)
- Semantic tokens: `--color-main-brand-primary-50:#d7f7f7`, `-200:#a8e0db`, `-500:#71bfb7`, `-700:#37706c`, `-900:#224a47`; `--color-main-brand-secondary-50:#dfedff`, `-200:#9ab4d2`, `-500:#456b91`, `-700:#375d80`, `-900:#04253c`; `--color-main-brand-tertiary-50:#fbf3ea`, `-200:#e9a695`, `-300:#b89c67`, `-500:#d44d2b`, `-700:#7f2e1a`, `-900:#40170d`. [S24](https://www.visitredsea.com/_next/static/chunks/e9bef7166ea3db4a.css)
- The header "Book" button computed to background `rgb(113, 191, 183)` (equal to `#71bfb7`), text `rgb(30, 40, 47)` (equal to `#1e282f`), `border-radius: 9999px`. [S37](https://www.visitredsea.com/en/contact-us)
- Most frequent literal hex values: `#1c1917` (19), `#1e282f` (16), `#f5f5f4` (11), `#f04438` (11), `#37706c` (10). [S24](https://www.visitredsea.com/_next/static/chunks/e9bef7166ea3db4a.css)

**amaala.com** (23 CSS chunks; font faces in https://www.amaala.com/_next/static/chunks/6a956b724013fd95.css; read via in-page fetch)
- `@font-face` families: `AMAALA Closed Eye` (400, 500, 700), `AMAALA Open Eye` (400, 500, 700, each in normal and italic), `AMAALA Sans` (400, 500, 700 normal; 400 italic). Files are hashed woff2 under `/_next/static/media/`. [S42](https://www.amaala.com/_next/static/chunks/6a956b724013fd95.css)
- Root variables computed in browser: `--font-family-amaala-body: "AMAALA Sans",sans-serif`; `--font-family-amaala-heading: "AMAALA Closed Eye",serif`; `--font-family-amaala-heading-ar: "AMAALA Closed Eye",serif`; `--font-family-amaala-caption: "AMAALA Open Eye",serif`. Some rules prepend `"Fedra Sans AL"` before the AMAALA body variable. [S40](https://www.amaala.com/en), [S42](https://www.amaala.com/_next/static/chunks/6a956b724013fd95.css)
- Computed: body `"Amaala Sans", sans-serif`; h1 `"AMAALA Closed Eye", serif`; on /ar h2 `"AMAALA Open Eye", serif`. [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar)
- Colour tokens (found in the stylesheets linked from amaala.com/en; the exact chunk was not isolated): `--colors-amaala-gold-50:#f9f4ec`, `-100:#f0e4cd`, `-200:#e6d3b0`, `-300:#d5ba8f`, `-400:#cba97c`, `-500:#c1a681`, `-600:#a88d6c`, `-700:#8a7255`, `-800:#665640`, `-900:#3e2f17`; `--colors-amaala-blackrock-25:#f6f9f8`, `-50:#eef1ef`, `-100:#dce3e0`, `-200:#b9c7c1`, `-300:#93a69e`, `-400:#71857d`, `-500:#576b63`, `-600:#485f54`, `-700:#3c4540`, `-800:#2d3630`, `-900:#20302b`; `--colors-amaala-pearl-25:#fbfaf6`, `-50:#f8f5ec`, `-100:#e8e5d9`; `--colors-amaala-calmteal-50:#eef7f5`, `-200:#abe0d4`, `-400:#59968f`, `-500:#468278`, `-700:#226e66`; `--colors-amaala-perfectpurple-50:#efeff5`, `-100:#d0d2f0`, `-400:#757698`, `-500:#626284`, `-700:#4e5472`; `--colors-amaala-brushedred-400:#da5f2e`, `-500:#c6511d`, `-600:#a2452f`; `--colors-amaala-canvasorange-300:#d17b3a`, `-500:#b66e30`, `-700:#9b572c`; `--colors-amaala-subtlegreen-400:#889273`, `-500:#768064`, `-600:#676d56`; `--colors-amaala-stylishblue-500:#4f6f8e`, `-600:#455b75`, `-700:#3e4b65`, `-800:#232c3a`; plus `reef` and `darkreef` neutral scales. [S40](https://www.amaala.com/en)
- Semantic tokens: `--color-main-brand-primary-500:#c1a681` (also 50 `#f9f4ec`, 200 `#e6d3b0`, 700 `#8a7255`, 900 `#3e2f17`); `--color-main-brand-secondary-500:#468278` (900 `#20302b`); `--color-main-brand-tertiary-500:#626284`. [S40](https://www.amaala.com/en)
- "Book" buttons computed to background `rgb(213, 186, 143)` (equal to `#d5ba8f`) with text `rgb(60, 69, 64)` (equal to `#3c4540`), and `rgb(193, 166, 129)` (equal to `#c1a681`) with white text; `border-radius: 9999px`. [S40](https://www.amaala.com/en)
- Most frequent literal hex values: `#3c4540` (35), `#1c1917` (21), `#8a7255` (20), `#1e282f` (14), `#c1a681` (11). The AMAALA CSS also contains Visit Red Sea values such as `#37706c` and `#1e282f`. [S40](https://www.amaala.com/en)

**RSG Hospitality resort sites**
- shebara.sa: `@font-face` families `Montserrat` and `Montserrat Fallback`; body class `montserrat_...__variable`; custom properties `--beige:#e9e2e0`, `--darkGray:#231f20`, `--gray:#ada2a2`. The same body class is used on /ar/. [S49](https://www.shebara.sa/en/)
- desertrock.sa: `@font-face` families `Montserrat`, `presicaLT`, `swissraRegular` (each with a "Fallback"); custom properties `--beige:#f5efe4`, `--body-background:#271d10`, `--themeWhite:#f2f6f6`, `--gray:#ddd`. [S50](https://www.desertrock.sa/en/)
- redseaglobalhospitality.com links the RSG corporate client libraries (`/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202607301309-lc.min.css`), an older build stamp than redseaglobal.com's `202609291724`. Its fonts and colours were not separately extracted. [S48](https://redseaglobalhospitality.com/en/)

### Inferences
- The token names in RSG's CSS ("blue-lagoon", "crystal-waters", "thriving-corals", "sandy-dunes", "volcanic-ash") and AMAALA's ("blackrock", "pearl", "calmteal", "perfectpurple", "brushedred") look like names taken from a design system. That suggests an internal palette exists, but the CSS does not prove which tokens are primary brand colours or how they may be combined.
- RSG gold 400 `#b89c67` also appears as a Visit Red Sea tertiary token, and Visit Red Sea secondary 900 `#04253c` equals RSG blue 800. This hints at a deliberate link between corporate and destination palettes. Not confirmed.
- Fedra, Questa Grande and Paralucent are commercial typefaces by name. The licence terms RSG holds, and whether a vendor may use them in a POC, are unknown.
- `swissraRegular` and `presicaLT` on desertrock.sa are probably the Arabic and Latin faces for that site. This is a guess from the names; which elements use them was not measured.

### Gaps
- Official primary and secondary palette, colour ratios, accessibility pairings: Not verified: requires RSG brand guidelines per brand.
- Official typeface names, weights, licences and permitted fallbacks: Not verified: requires RSG brand guidelines and font licence confirmation.
- The exact AMAALA CSS chunk that defines the colour tokens was not isolated.
- Fonts and colours of thuwalretreat.sa, turtlebayhotel.sa, tbha-hotel.com, flyredsea.com, rsiairport.sa and shuralinks.com were not extracted (shuralinks.com loads the same CSS chunk names as visitredsea.com, so it very likely shares the Fedra system).
- Mobile app (Visit Red Sea) styling was not examined.

---

## 8. Logo variants: what logo files and variants are visibly used?

### Takeaway
Each site references separate light and dark or English and Arabic logo files. RSG has a distinct Arabic header logo. AMAALA uses a single "Bilingual Logotype" file in both languages. The "A PIF company" endorsement mark appears in the RSG and RSGH footers. None of these files comes with published usage terms, and site terms reserve all trademark rights.

### Cited Findings
All [OBSERVED-IMPLEMENTATION]. URLs are asset locations, not licences to reuse.

**Red Sea Global**
- Header logo (EN): https://www.redseaglobal.com/content/experience-fragments/redsea-rsc/en/header/header-no-gradient/_jcr_content/root/header/logo.coreimg.svg/1769789309753/rsg-logo.svg (alt "RSG Logo"). [S1](https://www.redseaglobal.com/en/)
- Header logo (AR): https://www.redseaglobal.com/content/experience-fragments/redsea-rsc/ar/header/header-arabic/_jcr_content/root/header_copy/logo.coreimg.svg/1775821472264/red-sea-ar.svg (alt "شعار RSG"). [S2](https://www.redseaglobal.com/ar/)
- Footer logo (EN): `.../en/footer-v2/master/_jcr_content/root/footer/logo-img.coreimg.svg/1775821533074/logo.svg` (alt "RedSea Logo - Click to navigate to homepage"). Footer logo (AR): `.../ar/footer-v2/master2/_jcr_content/root/footer/logo-img.coreimg.svg/1772803481652/rsg-ar-white-rgb-horizontal-rsg-ar-rgb-horizontal.svg`. [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/)
- PIF endorsement mark in footer: `.../footer/brand-logo.coreimg.svg/1775821532595/apifcompany.svg`. Its alt text is "Airport", which is wrong. [S1](https://www.redseaglobal.com/en/)
- Favicons: `/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site/resources/images/favicons/favicon.svg`, `favicon-96x96.png`, `favicon.ico`, `apple-touch-icon.png`. [S1](https://www.redseaglobal.com/en/)
- Destination logos used on the corporate site: `/content/dam/redsea-rsc/common/logos/vrs-horizontal-logo.svg`, `/content/dam/redsea-rsc/common/logos/Amaala-horizontal-logo.svg`, `/content/dam/redsea-rsc/common/logos/Thuwal-logo-01.svg` and, on /ar, `Thuwal-logo-01%20AR.svg`. Alt texts are placeholders ("LogoAlt", "logo2", "Logo3"). [S1](https://www.redseaglobal.com/en/), [S2](https://www.redseaglobal.com/ar/)

**Visit Red Sea / The Red Sea**
- Header and footer: https://www.visitredsea.com/content/dam/red-sea/en/master/logos/VRS%20Logo-light.svg/_jcr_content/renditions/original and `VRS%20Logo-dark.svg` (alts "visit red sea", "vrs turtle logo", "visit red sea turtle"). The same two files are used on /ar. The rendered lockup is bilingual. [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar)
- Favicons: `/favicon.ico` (56x56), `/icon.png` (16x16), `/icon2.png` (32x32), `/icon3.png` (192x192), `/icon4.png` (512x512), `/apple-icon.png` (180x180). [S22](https://www.visitredsea.com/en)
- Resort logos hosted by the destination: `/content/dam/red-sea/en/master/logos/resorts-logos/Shebara-logo-white-color.svg`, `Shebara-logo-main-color.svg`, `DeserRock-logo-white-color.svg` (file name misspelt), `Nujuma-logo-white-color.svg`, `SixSenses-logo-white-color.svg`, `StRegis-logo-white-color.svg`, `four-seasons-white-ar.svg`, `updated-edition-logos/EDITION_Logo_TheRedSea-white.svg`, `updated-ic-logos/IC%20The%20Red%20Sea%20Resort-white.svg`, `updated-sls-logos/SLS_Logo_TheRedSea_Hotel-Residences-white.svg`, and `/content/dam/red-sea/en/master/resort/turtle-bay-hotel/Turtle%20Bay_Bilingual_logo_white.svg`. [S22](https://www.visitredsea.com/en)
- Experience logos appear as image alts "Adrena logo", "Laha Beach logo", "sports logo", "akun", "Nature logo", "Golf logo". File URLs were not captured. [S22](https://www.visitredsea.com/en)
- Third-party mark displayed: Forbes Travel Guide "VerifiedLockup". [S22](https://www.visitredsea.com/en)

**AMAALA**
- Header: https://www.amaala.com/content/dam/red-sea/amaala/master/logos/AMAALA_Bilingual_Logotype_Pt_White_RGB.svg/_jcr_content/renditions/original (same file on /en and /ar). Compact mark: `.../logos/AMAALA_favicon.svg`. Footer: https://www.amaala.com/images/svg/amaala-logo-white-footer.svg, whose alt text is "Visit Red Sea". [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar)
- Favicons: `/favicon-light.svg`, `/favicon-dark.svg`, `/apple-icon.png`. [S40](https://www.amaala.com/en)
- Resort logos: `.../resorts/rosewood/latest-rosewood-amaala-logo-white.png`, `.../nammos-resort/nammos-logo-resort-amaala-white.svg`, `.../six-senses/amaala-six-senses-white-logo.svg`, `.../equinox/equinox-amaala-white-logo.svg`, `.../daraah-resort/daraah-logo-en.svg`, `.../the-ritz-carlton/ritz-carlton-white-logo.png`. [S40](https://www.amaala.com/en)
- In one browser view of https://www.amaala.com/en/resorts/daraah-resort-amaala (about 18:54 UTC) the header showed no logo at all over a dark hero. This may have been a load-timing effect. [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala)

**RSG Hospitality and others**
- RSGH footer: `/content/experience-fragments/redsea-hospitality/en/footer/master1/_jcr_content/root/footer/logo-img.coreimg.svg/1780558447044/rsgh-en-logo-white.svg` plus the same `apifcompany.svg`. It reuses the RSG favicon set. [S48](https://redseaglobalhospitality.com/en/)
- Thuwal: English `thuwal_logo_77af57fe1a.png` and Arabic `logo_arabic_7221f10c7f.png`, both on an Oracle object storage host (`axqkeco0itrs.objectstorage.me-jeddah-1.oci.customer-oci.com/.../thuwal-assets/`). [S54](https://www.thuwalretreat.sa/en/), [S54](https://www.thuwalretreat.sa/ar/)
- Fly Red Sea footer: `.../footer/logo-img.coreimg.png/1764068009433/fly-red-sea-horizontal-logo-white-rgb.png` and `.../brand-logo.coreimg.png/1764068021499/group-logo.png`. [S57](https://www.flyredsea.com/en/)
- RSI airport footer: `logo-rsi-white.svg` and `icon-logo-rsg.svg`. [S56](https://rsiairport.sa/en/)
- Shura Links: `/content/dam/red-sea/en/master/logos/shura-links-logos/Shura_Links_white_Logo-small-main.svg`; the page also shows the Visit Red Sea logo (alt "visit red sea"). [S55](https://shuralinks.com/)
- The reservations engine header shows the resort logo (alt "Shebara Logo header") under the page title "Red Sea Global Hospitality". [S51](https://reservations.redseaglobalhospitality.com/multi-dest-search-rates?hotel=62780)

### Inferences
- Endorsement appears to run downward: PIF endorses RSG and RSGH; RSG's mark sits in the airport footer; the Visit Red Sea mark sits on Shura Links. No RSG or PIF mark was seen on visitredsea.com or amaala.com page chrome in the content captured.
- Operator logos on the destination sites are destination-specific lockups (for example "EDITION_Logo_TheRedSea"), so operator marks are co-branded with the destination, and each operator's own brand rules will also apply.

### Gaps
- Logo files were not opened or visually compared, apart from the two screenshots described. Variant descriptions rely on file names and alt text.
- Clear space, minimum size, colour-on-background rules, co-branding and endorsement rules: Not verified: requires RSG brand guidelines for each brand and the operator brand guidelines for third-party marks.
- Permission to use any logo in a POC: Not verified: requires written permission. Site terms say nothing grants "any license or right to use any trademark, logo displayed on the Platforms without the owner's prior written permission". [S21](https://www.redseaglobal.com/en/terms-and-conditions/)

---

## 9. How is Arabic handled?

### Takeaway
The three main sites and the Shebara, Desert Rock, Turtle Bay and RSGH sites serve Arabic at `/ar` with `lang="ar" dir="rtl"`. Thuwal and Daraah serve Arabic content without setting `lang` or `dir` on the `<html>` element. Arabic copy is rewritten rather than translated, and some Arabic pages lag the English ones or contain placeholder metadata.

### Cited Findings
All [OBSERVED-IMPLEMENTATION].

| Site | `<html>` on Arabic page | Arabic font observed | Notes | Source |
|---|---|---|---|---|
| redseaglobal.com/ar/ | `lang="ar" dir="rtl"` | `"Noto Kufi Arabic"` for body and headings | 36 `[dir=rtl]`-type selectors in main CSS; separate Arabic header logo | [S2](https://www.redseaglobal.com/ar/), [S3](https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css) |
| visitredsea.com/ar | `lang="ar" dir="rtl"` | body `"Fedra Sans AL"`; `Fedra Serif Arabic AR` loaded | 166 `[dir=rtl]` selectors plus `:lang(ar)` mirroring rules (for example `left:unset;right:80px`); same logo files as English | [S23](https://www.visitredsea.com/ar), [S24](https://www.visitredsea.com/_next/static/chunks/e9bef7166ea3db4a.css) |
| amaala.com/ar | `lang="ar" dir="rtl"` | computed families stay `AMAALA Sans` / `AMAALA Closed Eye` / `AMAALA Open Eye`; no separate Arabic `@font-face` | 193 `[dir=rtl]` selectors; same bilingual logotype | [S41](https://www.amaala.com/ar), [S42](https://www.amaala.com/_next/static/chunks/6a956b724013fd95.css) |
| shebara.sa/ar/ | `lang="ar" dir="rtl"` | same Montserrat body class as English | English video file name "English_Only_Music_and_Logo" used on the Arabic page | [S49](https://www.shebara.sa/ar/) |
| desertrock.sa/ar/ | `lang="ar" dir="rtl"` | not measured | page title is the placeholder "desert rock" and meta description is "desert rock desert rock desert rock desert rock desert rock" | [S50](https://www.desertrock.sa/ar/) |
| turtlebayhotel.sa/ar/ | `lang="ar" dir="rtl"` | not measured | full Arabic title and nav | [S52](https://turtlebayhotel.sa/ar/) |
| redseaglobalhospitality.com/ar/ | `lang="ar" dir="rtl"` | not measured | | [S48](https://redseaglobalhospitality.com/ar/) |
| thuwalretreat.sa/ar/ | `lang="en"`, no `dir` attribute on `<html>` | not measured | title stays English "Thuwal - Private Retreat"; Arabic nav labels present; separate Arabic logo file | [S54](https://www.thuwalretreat.sa/ar/) |
| tbha-hotel.com/ar/ (Daraah) | `lang="en"`, no `dir` attribute on `<html>` | not measured | Arabic title "منتجع دارة" | [S53](https://tbha-hotel.com/ar/) |

Language switch and locale conventions:
- visitredsea.com and amaala.com pair language with currency in one control: "English / SAR" and "عربى / ريال سعودي". Note "عربى" is spelled with a final alif maqsura rather than "عربي". [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar)
- redseaglobal.com uses "English" / "عربي". Resort sites use "العربية" / "En" or "EN". [S1](https://www.redseaglobal.com/en/), [S49](https://www.shebara.sa/en/), [S52](https://turtlebayhotel.sa/ar/)
- Phone numbers on Arabic pages: "+966 11 222 2222" in the contact block and "+966 11222 2222" in the footer of the same page; Turtle Bay Arabic shows "966920011099+". [S37](https://www.visitredsea.com/ar/contact-us), [S52](https://turtlebayhotel.sa/ar/)
- Time format on the Arabic contact page: "09:55 م". [S37](https://www.visitredsea.com/ar/contact-us)

Content differences between /en and /ar:
- RSG press boilerplate: English says AMAALA "welcomed its first guests in 2026" and mentions the airport reopening "in May 2026". The Arabic boilerplate on the same release says "\"أمالا\" التي ستفتح أبوابها للزوار في عام 2025" (will open in 2025) and omits the reopening. [CONFLICT] [S20](https://www.redseaglobal.com/en/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/), [S20](https://www.redseaglobal.com/ar/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/)
- RSG AMAALA page: English gives "4,200km2" and "9 Hotels"; Arabic gives "4,155 كيلومتر مربع", "7 منتجعات" and "تُفتتح المرحلة الأولى في 2025". [CONFLICT] [S8](https://www.redseaglobal.com/en/portfolio/amaala/), [S8](https://www.redseaglobal.com/ar/portfolio/amaala/)
- RSG The Red Sea page: the English overview lists openings through "early 2026" (Adrena); the Arabic overview captured stops at 2024 openings. [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/), [S7](https://www.redseaglobal.com/ar/portfolio/the-red-sea/)
- RSG Arabic nav text for the media centre reads "المركز الإعلامي العالمي للبحر الأحمر", while the body says "المركز الإعلامي لشركة \"البحر الأحمر الدولية\"". The Arabic sort control label "الترتيب حسب" also appears untranslated on the English media centre. [S2](https://www.redseaglobal.com/ar/), [S19](https://www.redseaglobal.com/en/media-center/)
- RSG social feed captions on the Arabic home are mostly English. [S2](https://www.redseaglobal.com/ar/)
- Daraah Resort description on amaala.com differs in substance: English says "Located around 20–30 minutes north of Triple Bay"; Arabic says the resort is "في تريبل باي" and "18 دقيقة فقط بالسيارة" from Corallium and the yacht club, and lists padel, tennis and a golf simulator that the English does not. [CONFLICT] [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala), [S43](https://www.amaala.com/ar/resorts/daraah-resort-amaala)
- Wind speed unit on the AMAALA home: "mph" in English, "كم/س" (km/h) in Arabic, with the same figures "9-16". [CONFLICT] [S40](https://www.amaala.com/en), [S41](https://www.amaala.com/ar)
- visitredsea.com Arabic experience tiles use different icon files and alts from the English ones (for example "watersports" versus "sports logo"; an Arabic-named golf logo file). [S22](https://www.visitredsea.com/en), [S23](https://www.visitredsea.com/ar)

### Inferences
- A canvas text-width test on amaala.com/ar gave different widths for an Arabic string in `AMAALA Sans` (265 px), `AMAALA Closed Eye` (234 px), `AMAALA Open Eye` (248 px) and the fallback alone (245 px). That suggests the AMAALA font files contain Arabic glyphs. It is indirect evidence only.
- Whether Fedra Sans AL covers Arabic on visitredsea.com was not tested. The "AL" suffix and the body computed style suggest it does.
- English and Arabic content are maintained separately and drift. An agent grounded in one language's pages can state facts that contradict the other language's pages.

### Gaps
- Visual confirmation of mirrored layout (nav order, carousel direction, icon flipping) was not done by screenshot comparison. Mirroring is inferred from `dir="rtl"` and RTL CSS rules.
- Arabic numerals policy, Hijri dates, gendered address and dialect guidance: Not verified: requires RSG Arabic style guidance.
- Arabic experience of the booking flow, the chat widget and the app was not observed.

---

## 10. Do public brand guidelines, press kits, media kits or asset libraries exist?

### Takeaway
No public brand guidelines, press kit or media kit were found for RSG, The Red Sea or AMAALA. The closest items are a Travel Trade toolkit on visitredsea.com (four downloads, whose host did not resolve from the research machine), a Resources list of ten corporate PDFs, and an unlicensed "Image Gallery" on the RSG media centre. Site terms allow personal, non-commercial use only and grant no trademark or logo rights.

### Cited Findings
- Travel Trade toolkit page lists four downloads: "The Red Sea Factsheets", "Media Pitches", "The Red Sea Boilerplate", "The Red Sea Images", each a "DOWNLOAD NOW" link to `https://webserver-redseaportal-prd.lfr.cloud/documents/d/guest/...` (`theredsea-factsheets-zip`, `theredsea-media-pitches-zip`, `theredsea-boiler-plate-zip-1-`, `theredsea-images-zip`). No usage or licensing terms are stated on the page. [OFFICIAL-DOC] [S30](https://www.visitredsea.com/en/theredsea-travel-trade-toolkit)
- A header-only request to that host failed with "Could not resolve host: webserver-redseaportal-prd.lfr.cloud". The files were not downloaded and their contents are unknown. [OBSERVED-IMPLEMENTATION] [S30](https://www.visitredsea.com/en/theredsea-travel-trade-toolkit)
- RSG media centre sections: "All publications", "Blog", "Media coverage", "News", "Insights", "Resources", plus "Films", "Awards & Certifications" and "Image Gallery" (categories "Destinations", "Residential", "Iconic Projects", "Positive Impact", "Regenerative Tourism", "Training & Education"). Counts shown: 407 results overall, 10 under Resources. [OFFICIAL-DOC] [S19](https://www.redseaglobal.com/en/media-center/)
- The ten Resources are reports and policies, none about brand: for example "Supplier Code of Conduct English.pdf", "Unlocking Innovation For Regenerative Tourism.pdf", "Enhancing Destination Resilience EN.pdf", "Future Faces White Paper - English.pdf", "Baseline Survey 2022 - English.pdf", "Social Development Annual Bulletin - The year of Handcraft 2025- V3.pdf", under `/content/dam/redsea-rsc/common/media-center/resources/`. [OFFICIAL-DOC] [S19](https://www.redseaglobal.com/en/media-center/)
- Guessed URLs on redseaglobal.com all returned 404: `/en/brand/`, `/en/brand-guidelines/`, `/en/brand-center/`, `/en/media-kit/`, `/en/press-kit/`, `/en/downloads/`, `/en/media-center/press-kit/`, `/en/media-center/media-kit/`, `/en/media-center/resources/`. [OBSERVED-IMPLEMENTATION] [S19](https://www.redseaglobal.com/en/media-center/)
- Terms on redseaglobal.com, visitredsea.com and amaala.com share the same wording: "RSG owns (and where applicable is the licensee of) all Intellectual Property Rights in the Content. All rights, including those not expressly granted, in and to the Platforms and the Content accessible thereon, are reserved by RSG." [OFFICIAL-DOC] [S21](https://www.redseaglobal.com/en/terms-and-conditions/), [S31](https://www.visitredsea.com/en/terms-and-conditions), [S46](https://www.amaala.com/en/terms-and-conditions)
- "Content" is defined to include "the underlying HTML, text, graphics, logos, button icons and images, audio clips, video clips, digital downloads (as well as the organization and layout of Our Platforms), software and other content". [OFFICIAL-DOC] [S21](https://www.redseaglobal.com/en/terms-and-conditions/)
- Licence granted: "You may access, copy, download and print the Content contained on Our Platforms for your personal and non-commercial use ... Any other use of Content on Our Platforms, including but not limited to the modification, distribution, transmission, performance, broadcast, publication, uploading, licensing is expressly prohibited." The licence "is revocable at any time in RSG's sole discretion". [OFFICIAL-DOC] [S31](https://www.visitredsea.com/en/terms-and-conditions)
- Trademark carve-out: "nothing on Our Platforms shall be construed as granting, by implication, estoppel, or otherwise, any license or right to use any trademark, logo displayed on the Platforms without the owner's prior written permission." [OFFICIAL-DOC] [S21](https://www.redseaglobal.com/en/terms-and-conditions/)
- A web search for "Red Sea Global" with "brand guidelines", "brand book", "media kit" and "press kit" returned no official guideline document. Results were news about the 2022 rename and unrelated guideline pages. These results were not opened and are leads only. [THIRD-PARTY] [S58](https://meconstructionnews.com/55044/red-sea-global-confirms-new-brand-identity-and-mandate/amp)

Where I looked: redseaglobal.com home, footer, media centre (all tabs present in HTML), terms; nine guessed brand and press URLs; visitredsea.com footer, Travel Trade page, terms, app page; amaala.com footer and terms; redseaglobalhospitality.com home and about; one web search.

### Inferences
- Reusing live-site copy, images, logos, fonts or layout in a POC that is shown to anyone outside "personal and non-commercial use" is outside the stated licence. A POC built for RSG still needs RSG to supply or approve the assets in writing.
- The Travel Trade toolkit shows that RSG does prepare partner asset packs. A trade or agency asset portal probably exists behind the unreachable host or behind login.

### Gaps
- Contents and terms of the four Travel Trade zip files. Not verified: requires the user's approval to download, and a network that can resolve the host, or RSG supplying the files directly.
- Whether the media-centre "Image Gallery" images carry any press-use licence. Not verified: requires RSG communications confirmation.
- AMAALA and Thuwal press or trade kits: none found.
- Privacy policies were not read for this audit.

---

## 11. Which brand owns each journey stage?

### Takeaway
There are at least two parallel guest journeys. On the destination platforms (visitredsea.com and amaala.com) the destination brand owns discovery, resort pages, an on-domain booking flow and live chat, with RSG as the legal entity in the terms. On the RSG-operated resort sites the resort brand owns discovery and Red Sea Global Hospitality owns the booking engine and reservations contact. Some bookings leave to third parties (Jayasom, SevenRooms, airlines). Confirmation and post-booking branding were not observed.

### Cited Findings

**Path A: destination platform (The Red Sea via visitredsea.com; AMAALA via amaala.com)**

| Stage | Governing brand as observed | Evidence | Label and source |
|---|---|---|---|
| Discovery | Destination brand: "The Red Sea" lockup, "Visit Red Sea" titles and copyright; AMAALA logotype and copyright | Header logo, titles, footer copyright | [OBSERVED-IMPLEMENTATION] [S22](https://www.visitredsea.com/en), [S40](https://www.amaala.com/en) |
| Corporate hand-off into discovery | RSG corporate links out to the destination sites: "Explore more" on Shebara and Desert Rock project pages goes to `visitredsea.com/en/resorts/shebara` and `/desert-rock`; "VISIT RED SEA" goes to `visitredsea.com/en/resorts` | Outbound links on RSG pages | [OBSERVED-IMPLEMENTATION] [S16](https://www.redseaglobal.com/en/portfolio/projects/shebara-resort/), [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/) |
| AMAALA entry | RSG footer "AMAALA" links to `https://www.visitredsea.com/en/destinations/amaala`, which redirected to `https://www.amaala.com/en` when fetched | Redirect observed | [OBSERVED-IMPLEMENTATION] [S1](https://www.redseaglobal.com/en/), [S40](https://www.amaala.com/en) |
| Resort page | Destination chrome with the resort's own logo and name; eyebrow "THE RED SEA" above "Shebara" | Browser view of the Shebara page | [OBSERVED-IMPLEMENTATION] [S26](https://www.visitredsea.com/en/resorts/shebara) |
| Booking entry | Destination-branded widget inside the same header: tabs "Resorts", "Experiences", "Transportation"; multi-resort option "ADD ANOTHER RESORT" | Widget opened, not submitted | [OBSERVED-IMPLEMENTATION] [S26](https://www.visitredsea.com/en/resorts/shebara) |
| Booking engine | On-domain routes in the site's JavaScript on both visitredsea.com and amaala.com: `/booking/resorts-list`, `/booking/accommodation-list`, `/booking/experiences`, `/booking/experiences/activity-list`, `/booking/mobility`, `/booking/mobility/mobility-list`, `/booking/guest-information`, `/booking/checkout`, `/booking/details`, `/booking/my-trips`, `/booking/add-luggage`, `/booking/track-my-luggage`, `/booking/car-entry-permit` | Route strings found by scanning the page's script files | [OBSERVED-IMPLEMENTATION] [S26](https://www.visitredsea.com/en/resorts/shebara), [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala) |
| Confirmation | Routes exist on-domain: `/booking/checkout/success`, `/booking/checkout/failure`, `/booking/checkout/uberesque/confirmation`, `/booking/uberesque/cancellation-error`. The pages themselves were not seen | Route strings only | [OBSERVED-IMPLEMENTATION] [S26](https://www.visitredsea.com/en/resorts/shebara) |
| Operating company behind booking | "Regenerative Escapes Tourism Company (DMC) manages guest logistics, bookings, and destination experiences across The Red Sea, serving as the operational arm of Visit Red Sea"; "24/7 Booking Operations"; "End‑to‑End Guest Journey: From booking to departure" | Corporate statement | [OFFICIAL-DOC] [S15](https://www.redseaglobal.com/en/subsidiaries/regenerative-escapes-tourism-company/) |
| Legal owner of the platform | Terms on visitredsea.com and amaala.com name "RSG" as the party ("RSG owns ... all Intellectual Property Rights in the Content") | Terms text | [OFFICIAL-DOC] [S31](https://www.visitredsea.com/en/terms-and-conditions), [S46](https://www.amaala.com/en/terms-and-conditions) |
| Licences shown to guests | visitredsea.com footer "MOT license: 73104512", "CR: 1010916245"; Shebara page "CR: 4701103056", "Ministry of Tourism License: 10009362" | Footer and resort page | [OFFICIAL-DOC] [S22](https://www.visitredsea.com/en), [S26](https://www.visitredsea.com/en/resorts/shebara) |
| Support: chat | Live chat widget served from the destination domain (`https://www.visitredsea.com/chat/widgetloader.html?lang=en`, `https://www.amaala.com/chat/widgetloader.html?lang=en`) with iframes titled "Livechat launcher icon" and "Chat Conversation Window", and a frame from `attachuk.imi.chat` | iframes in the page | [OBSERVED-IMPLEMENTATION] [S26](https://www.visitredsea.com/en/resorts/shebara), [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala) |
| Support: phone and email | Same phone "+966 11 222 2222" on visitredsea.com and amaala.com; emails info@visitredsea.com and info@amaala.com | Footers and contact page | [OBSERVED-IMPLEMENTATION] [S37](https://www.visitredsea.com/en/contact-us), [S40](https://www.amaala.com/en) |
| Support: app | "Visit Red Sea App" covers both destinations ("The Red Sea and AMAALA"), with "My Trips" and "24/7 concierge service"; Android package id `com.redseaglobal.mobile` | App page | [OFFICIAL-DOC] [S32](https://www.visitredsea.com/en/visitredsea-app) |
| Post-booking services | "Track My Luggage" ("Enter your PNR or bag tags to check the current status of your luggage.") under `/booking/` on visitredsea.com | Page text | [OBSERVED-IMPLEMENTATION] [S22](https://www.visitredsea.com/en/booking/track-my-luggage) |

**Path B: RSG Hospitality resort sites (Shebara, Desert Rock, Turtle Bay Hotel, Daraah Resort, Thuwal Private Retreat)**

| Stage | Governing brand as observed | Evidence | Label and source |
|---|---|---|---|
| Discovery and resort page | Resort brand on its own domain; footer "© Red Sea Global Hospitality 2026 . All rights reserved" on shebara.sa; "2026 © TurtleBayHotel"; "2026 © DARAAH Resort" | Footers | [OBSERVED-IMPLEMENTATION] [S49](https://www.shebara.sa/en/), [S52](https://turtlebayhotel.sa/en/), [S53](https://tbha-hotel.com/en/) |
| Chain of official links | redseaglobal.com links to redseaglobalhospitality.com, which links to shebara.sa, desertrock.sa, thuwalretreat.sa, turtlebayhotel.sa and tbha-hotel.com | Outbound links | [OBSERVED-IMPLEMENTATION] [S11](https://www.redseaglobal.com/en/subsidiaries/red-sea-global-hospitality/), [S48](https://redseaglobalhospitality.com/en/) |
| Booking engine | "Check Availability" goes to `https://reservations.redseaglobalhospitality.com/multi-dest-search-rates?hotel=62780` (Shebara) and `?hotel=62782` (Desert Rock). The engine page title is "Red Sea Global Hospitality" and its header shows the Shebara logo, with "SAR"/"USD" and "EN"/"العربية" switches. Sub-domains `reservations.shebara.sa`, `reservations.desertrock.sa`, `reservations.turtlebayhotel.sa`, `reservations.tbha-hotel.com` are also linked | Links and landing HTML | [OBSERVED-IMPLEMENTATION] [S49](https://www.shebara.sa/en/), [S51](https://reservations.redseaglobalhospitality.com/multi-dest-search-rates?hotel=62780), [S52](https://turtlebayhotel.sa/en/), [S53](https://tbha-hotel.com/en/) |
| Support | Turtle Bay lists "reservations@redseaglobalhospitality.com" and "+966 9200 11099" | Footer | [OBSERVED-IMPLEMENTATION] [S52](https://turtlebayhotel.sa/en/) |
| Confirmation | Not observed | | Not verified: requires a test booking or RSG-supplied samples |

**Path C: hand-offs to other parties**
- Jayasom Wellness Resort "BOOK" on amaala.com goes to `https://www.jayasom.com/booking`. [OBSERVED-IMPLEMENTATION] [S40](https://www.amaala.com/en)
- Restaurant "BOOK" buttons on visitredsea.com go to `sevenrooms.com` reservation pages. [OBSERVED-IMPLEMENTATION] [S38](https://www.visitredsea.com/en/dining)
- Flight listings link to airline sites (Qatar Airways, Etihad, Saudia, flydubai). [OBSERVED-IMPLEMENTATION] [S33](https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights)
- Fly Red Sea's own site sends "Book Tour" and "Book Now" back to visitredsea.com offer pages. [OBSERVED-IMPLEMENTATION] [S57](https://www.flyredsea.com/en/)
- Shura Links runs on the Visit Red Sea platform (same CSS chunk file names, Visit Red Sea logo in header) with "BOOK NOW" to `shuralinks.com/stay-and-play-packages`. [OBSERVED-IMPLEMENTATION] [S55](https://shuralinks.com/)
- Experiences are operated by RSSE under WAMA, Galaxea and AKUN: "The company collaborates with hospitality partners to integrate experiences into guest itineraries". [OFFICIAL-DOC] [S12](https://www.redseaglobal.com/en/subsidiaries/sports-entertainment-company/)
- Transfers: "Coastal Transportation Services Company delivers integrated and sustainable mobility solutions across land, air, and marine networks within Red Sea Global destinations." [OFFICIAL-DOC] [S13](https://www.redseaglobal.com/en/subsidiaries/mobility-company/)

**Shared platform evidence**
- amaala.com and visitredsea.com share a stylesheet file name (`8ca1ac25e82ef10b.css`), the `/content/dam/red-sea/` asset root, the same `/booking/` route set, the same chat loader path and the same phone number. [OBSERVED-IMPLEMENTATION] [S22](https://www.visitredsea.com/en), [S40](https://www.amaala.com/en)
- amaala.com resort pages contain a link to a non-production host: "EXPLORE ALL EXPERIENCES" points to `https://amaala.uat.webconnectorprojects.com/en/experiences/water-sports/above-water`. shebara.sa/ar/ references `uat-shebara-preview.prismetic.com`. [OBSERVED-IMPLEMENTATION] [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala), [S49](https://www.shebara.sa/ar/)

### Inferences
- One codebase appears to serve The Red Sea, AMAALA and Shura Links with brand themes swapped by CSS tokens and fonts. A POC agent embedded in that platform would need the same theme switch: one behaviour, several brand skins.
- The same RSG-operated resort can be booked through two different engines with two different brand wrappers (destination platform, or resort site into RSG Hospitality reservations). Which path a guest used decides which brand should speak in confirmation and support. That needs a decision from RSG before an agent is designed.
- For third-party operated resorts (Six Senses, St. Regis and others) the destination site shows "BOOK" buttons that open the on-domain widget, which suggests the destination platform sells operator inventory directly. It was not confirmed where the search lands for each operator.

### Gaps
- What the on-domain booking engine is, who supplies it, and whether it books operator inventory live. Not verified: requires RSG digital or DMC confirmation, or a supervised test with test data.
- Brand and sender of confirmation pages, confirmation emails, pre-arrival messages and invoices on both paths. Not verified: requires RSG-supplied samples.
- Which brand answers the live chat and the 24/7 concierge (Visit Red Sea, the DMC, or the resort). The chat was not opened. Not verified: requires RSG contact-centre confirmation.
- Whether Thuwal Private Retreat has any online booking at all (it is "buy-out-only").
- The reservations engine vendor behind reservations.redseaglobalhospitality.com was not identified.

---

## Conflicts found across official sources (consolidated)

| # | Conflict | Sources |
|---|---|---|
| 1 | RSG-operated resort count: Shebara "first", Desert Rock "third", "2 Owned & Operated Resorts", five properties on RSGH site | [S16](https://www.redseaglobal.com/en/portfolio/projects/shebara-resort/), [S17](https://www.redseaglobal.com/en/portfolio/projects/desert-rock-resort/), [S11](https://www.redseaglobal.com/en/subsidiaries/red-sea-global-hospitality/), [S48](https://redseaglobalhospitality.com/en/) |
| 2 | "Turtle Bay Hotel" versus "Turtle Bay Resort"; Arabic "فندق تيرتل باي" versus "منتجع ترتل باي" | [S52](https://turtlebayhotel.sa/en/), [S48](https://redseaglobalhospitality.com/en/) |
| 3 | "Daraah Resort" versus "Darrah Resort" (page title) | [S43](https://www.amaala.com/en/resorts/daraah-resort-amaala) |
| 4 | AMAALA capitalisation exceptions: "Amaala Yacht Club" title, "Amaala" news tag, "AMALA Resort" alt | [S47](https://www.amaala.com/en/amaala-yacht-club), [S53](https://tbha-hotel.com/en/) |
| 5 | Arabic spellings: Shura (شُورى / شورى / شورا), Adrena (أدرينا / أديرينا), Triple Bay (تريبل باي / تربل باي), الأحمر / الاحمر in RSG footer | [S23](https://www.visitredsea.com/ar), [S12](https://www.redseaglobal.com/ar/subsidiaries/sports-entertainment-company/), [S41](https://www.amaala.com/ar), [S2](https://www.redseaglobal.com/ar/) |
| 6 | Resort counts at The Red Sea: "50+", "13 resorts", "18 Hotels" | [S22](https://www.visitredsea.com/en), [S25](https://www.visitredsea.com/en/resorts), [S7](https://www.redseaglobal.com/en/portfolio/the-red-sea/) |
| 7 | Desert Rock villa names differ between visitredsea.com and desertrock.sa | [S27](https://www.visitredsea.com/en/resorts/desert-rock), [S50](https://www.desertrock.sa/en/villas/) |
| 8 | English versus Arabic facts: AMAALA opening year, area and hotel count; Daraah location; wind-speed unit | [S20](https://www.redseaglobal.com/ar/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/), [S8](https://www.redseaglobal.com/ar/portfolio/amaala/), [S43](https://www.amaala.com/ar/resorts/daraah-resort-amaala), [S41](https://www.amaala.com/ar) |
| 9 | Arabic CTA for "Check Availability": "إحجز إقامتك" versus "التحقق من التوفر" | [S49](https://www.shebara.sa/ar/), [S53](https://tbha-hotel.com/ar/) |
| 10 | Mobility subsidiary: "Mobility Company" (nav) versus "Coastal Transportation Services Company" (page); subsidiary count "28+" versus "approximately 28 ... of which 14 are public-facing" | [S13](https://www.redseaglobal.com/en/subsidiaries/mobility-company/), [S10](https://www.redseaglobal.com/en/subsidiaries/) |

---

## Research log

| # | Approx. time (UTC, 12 Oct 2026) | Action | Tool | Result |
|---|---|---|---|---|
| 1 | 18:45 | Fetch six home pages (RSG, Visit Red Sea, AMAALA; en and ar) | curl | visitredsea.com 200; redseaglobal.com and amaala.com 403 (Cloudflare challenge) |
| 2 | 18:46 | Retry RSG and AMAALA | WebFetch | 403 on both |
| 3 | 18:46 | Download 21 Visit Red Sea CSS chunks; extract `@font-face`, `font-family`, custom properties, hex counts | curl, grep | Fedra families and `--colors-vrs-*` tokens found |
| 4 | 18:47 | Open redseaglobal.com/en/ in own browser tab; read text, DOM metadata, logos, computed fonts | Browser | Loaded with no challenge |
| 5 | 18:48 | Read RSG CSS files via in-page fetch | Browser JS | Questa Grande, Paralucent, Noto Kufi Arabic, `--rsg-*` tokens |
| 6 | 18:49 | redseaglobal.com/ar/ and amaala.com/en: text, fonts, logos, links, buttons, CSS | Browser | Captured; OneTrust banner on AMAALA left untouched |
| 7 | 18:50 | amaala.com/ar: text, fonts, buttons | Browser | Captured |
| 8 | 18:50 | Fetch 16 Visit Red Sea sub-pages (resorts, Shebara en/ar, Desert Rock, Turtle Bay, St. Regis, trade, terms, offers, experiences, app, Shura, plan, residential, luggage) | curl | 200; `/en/destinations/amaala` redirected to amaala.com (403 to curl) |
| 9 | 18:51 | Open Shebara page on visitredsea.com; open header "Book" widget (not submitted); scan scripts for `/booking/` routes and chat iframes | Browser | Widget labels, 20 booking routes, imi.chat widget |
| 10 | 18:52 | Header request to Travel Trade toolkit host | curl | DNS failure; nothing downloaded |
| 11 | 18:52 | RSG corporate pages via in-page fetch: about, portfolio (3), subsidiaries (6), project pages (3), Arabic equivalents, media centre, terms, one news release en/ar | Browser JS | Captured |
| 12 | 18:54 | Probe nine guessed brand and press URLs on redseaglobal.com | Browser JS | All 404 |
| 13 | 18:54 | amaala.com resort, experiences, offers, terms, yacht club, plan, residences, Arabic Daraah page; script scan; Arabic glyph width test | Browser JS | Captured; UAT link found |
| 14 | 18:55 | Fetch more Visit Red Sea pages (dining, Adrena, Laha, contact, ar resorts, getting around) | curl | 200; `/en/destinations/the-red-sea` redirected to `/en` |
| 15 | 18:55 | visitredsea.com contact page in en and ar: form microcopy, computed fonts, button colours | Browser | Captured |
| 16 | 18:57 | Fetch thuwalretreat.sa, shuralinks.com, rsiairport.sa, flyredsea.com, shebara.sa, desertrock.sa (en and ar) | curl | All 200 |
| 17 | 18:58 | Fetch redseaglobalhospitality.com (en, ar, about), reservations landing page, Shebara and Desert Rock villas, their CSS | curl | All 200; property list and reservations host found |
| 18 | 18:59 | Fetch turtlebayhotel.sa and tbha-hotel.com (en and ar) | curl | All 200 |
| 19 | 19:00 | Web search for public brand guidelines, press or media kit | WebSearch | No official document; leads only, not opened |
| 20 | 19:00 | Confirm outbound links from RSG pages to hospitality and resort sites | Browser JS | Confirmed |
| 21 | 19:01 | Close own browser tab | Browser | Closed |

---

## Source register

All sources accessed 12 October 2026. "n/s" means no publication or update date is stated on the page.

| Source ID | Title | Publisher | URL | Publication/update date | Access date | Claims supported | Limitations |
|---|---|---|---|---|---|---|---|
| S1 | Red Sea Global - Official site (EN home) | Red Sea Global | https://www.redseaglobal.com/en/ | n/s (footer © 2026) | 2026-10-12 | Corporate name, hero copy, nav, CTAs, logos, favicons, fonts computed, footer destinations | Read via browser only (403 to curl) |
| S2 | شركة البحر الأحمر الدولية - الموقع الرسمي (AR home) | Red Sea Global | https://www.redseaglobal.com/ar/ | n/s | 2026-10-12 | Arabic names, copy, RTL, Arabic logo, footer spelling | Browser only |
| S3 | RSG clientlib-site CSS | Red Sea Global | https://www.redseaglobal.com/etc.clientlibs/redsea-rsc/clientlibs/clientlib-site.lc-202609291724-lc.min.css | Build stamp 2026-09-29 in file name | 2026-10-12 | `@font-face`, `--rsg-*` tokens, hex counts, type scale | Read via in-page fetch; summarised by regex, not line by line |
| S4 | RSG rsgfactory clientlib CSS | Red Sea Global | https://www.redseaglobal.com/etc.clientlibs/rsgfactory/clientlibs/clientlib-site.min.eb79e8521c820e7406aba0b899de6bbc.css | n/s | 2026-10-12 | Button tokens, Roboto and Arial defaults | Same |
| S5 | About Red Sea Global | Red Sea Global | https://www.redseaglobal.com/en/about-us/ | n/s | 2026-10-12 | Vision, mission, values, portfolio nav names | Text truncated after about 2,600 characters; values list incomplete |
| S6 | نبذة عن شركة البحر الأحمر الدولية | Red Sea Global | https://www.redseaglobal.com/ar/about-us/ | n/s | 2026-10-12 | Arabic names and positioning | Truncated |
| S7 | The Red Sea: A Regenerative Tourism Destination | Red Sea Global | https://www.redseaglobal.com/en/portfolio/the-red-sea/ (AR: /ar/portfolio/the-red-sea/) | n/s | 2026-10-12 | Destination descriptor, opening timeline, key facts, Turtle Bay "self-operated" | Truncated; Arabic only first 700 characters |
| S8 | AMAALA: A Luxury Tourism Destination | Red Sea Global | https://www.redseaglobal.com/en/portfolio/amaala/ (AR: /ar/portfolio/amaala/) | n/s | 2026-10-12 | AMAALA descriptors, key facts, en/ar differences | Truncated |
| S9 | Thuwal Private Retreat: A Boutique Island | Red Sea Global | https://www.redseaglobal.com/en/portfolio/thuwal/ (AR: /ar/portfolio/thuwal/) | n/s | 2026-10-12 | Thuwal naming, ownership, positioning | Truncated |
| S10 | Our Subsidiaries Grid | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/ | n/s | 2026-10-12 | Subsidiary names and descriptions, counts | "Show more" items beyond the first 14 not captured |
| S11 | First Saudi Luxury Hotel Operator, Red Sea Global Hospitality | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/red-sea-global-hospitality/ (AR equivalent) | n/s | 2026-10-12 | RSGH role, "2 Owned & Operated Resorts", brand integration responsibility, link to RSGH site | Truncated |
| S12 | Red Sea Sports & Entertainment Company | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/sports-entertainment-company/ (AR: /ar/subsidiaries/sports-entertainment-company/) | n/s | 2026-10-12 | WAMA, Galaxea, AKUN; Arabic names; "أديرينا" | Truncated |
| S13 | Coastal Transportation Services Company | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/mobility-company/ | n/s | 2026-10-12 | Mobility naming and scope | Truncated |
| S14 | Fly Red Sea (subsidiary page) | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/fly-red-sea/ (AR equivalent) | n/s | 2026-10-12 | Fly Red Sea naming, tagline, Arabic name | Truncated |
| S15 | Regenerative Escapes Tourism Company (DMC) | Red Sea Global | https://www.redseaglobal.com/en/subsidiaries/regenerative-escapes-tourism-company/ | n/s | 2026-10-12 | DMC as "operational arm of Visit Red Sea", B2B and B2C | Truncated |
| S16 | Shebara Resort project page | Red Sea Global | https://www.redseaglobal.com/en/portfolio/projects/shebara-resort/ (AR equivalent) | n/s | 2026-10-12 | "first ... fully owned and operated", naming, link to visitredsea.com | Truncated |
| S17 | Desert Rock project page | Red Sea Global | https://www.redseaglobal.com/en/portfolio/projects/desert-rock-resort/ (AR equivalent) | n/s (copy says "on track opened in 2024") | 2026-10-12 | "third owned and operated", Arabic name | Page copy looks partly outdated |
| S18 | Turtle Bay Village | Red Sea Global | https://www.redseaglobal.com/en/portfolio/projects/turtle-bay-village/ | n/s | 2026-10-12 | Turtle Bay Hotel context | Truncated; used lightly |
| S19 | Media Center | Red Sea Global | https://www.redseaglobal.com/en/media-center/ | Latest item dated 1 October 2026 | 2026-10-12 | Sections, Resources list, Image Gallery, 404 probes for brand and press URLs | Client-side tabs read from HTML only; gallery not opened |
| S20 | Red Sea Global announces the opening of Jayasom Wellness Resort (EN and AR) | Red Sea Global | https://www.redseaglobal.com/en/media-center/news/Red-Sea-Global-announces-the-opening-of-Jayasom-Wellness-Resort-advancing-AMAALAs-wellness-vision/ (AR: same path under /ar/) | 16 September 2026 | 2026-10-12 | English and Arabic boilerplate, "Amaala" tag, Arabic Thuwal spelling | One release only |
| S21 | Terms and Conditions | Red Sea Global | https://www.redseaglobal.com/en/terms-and-conditions/ | n/s | 2026-10-12 | Legal entity, IP ownership, trademark carve-out | Not legal advice; Arabic version not read |
| S22 | Visit Red Sea home (EN) and Track My Luggage | Visit Red Sea / RSG | https://www.visitredsea.com/en ; https://www.visitredsea.com/en/booking/track-my-luggage | n/s (footer © 2026) | 2026-10-12 | Hero, counters, nav, CTAs, resort names, offers, logos, favicons, licences | Server HTML; carousels may hide items |
| S23 | Visit Red Sea home (AR) | Visit Red Sea / RSG | https://www.visitredsea.com/ar | n/s | 2026-10-12 | Arabic names, copy, CTAs, RTL | Same |
| S24 | Visit Red Sea CSS chunks | Visit Red Sea / RSG | https://www.visitredsea.com/_next/static/chunks/e9bef7166ea3db4a.css (also 61314f95ff831413.css, ca4f8fc3e8dbe210.css and 18 others under the same path) | n/s | 2026-10-12 | Fonts, colour tokens, RTL selector counts | Hashed file names will change on redeploy |
| S25 | Resorts list | Visit Red Sea / RSG | https://www.visitredsea.com/en/resorts (AR: /ar/resorts) | n/s | 2026-10-12 | "13 resorts", resort names, filters, licences | Only first six cards server-rendered |
| S26 | Shebara resort page (EN and AR) | Visit Red Sea / RSG | https://www.visitredsea.com/en/resorts/shebara ; https://www.visitredsea.com/ar/resorts/shebara | n/s | 2026-10-12 | Villa names, policies, booking widget, booking routes, chat widget, screenshots described | Booking not submitted; routes read from scripts (80 of 101 scanned) |
| S27 | Desert Rock resort page | Visit Red Sea / RSG | https://www.visitredsea.com/en/resorts/desert-rock | n/s | 2026-10-12 | Villa names | Headings only |
| S28 | Turtle Bay Hotel page | Visit Red Sea / RSG | https://www.visitredsea.com/en/resorts/turtle-bay | n/s | 2026-10-12 | Room names | Headings only |
| S29 | The St. Regis Red Sea Resort page | Visit Red Sea / RSG | https://www.visitredsea.com/en/resorts/the-st-regis-red-sea-resort | n/s | 2026-10-12 | Operator villa naming | Headings only |
| S30 | The Red Sea Travel Trade | Visit Red Sea / RSG | https://www.visitredsea.com/en/theredsea-travel-trade-toolkit | n/s | 2026-10-12 | Toolkit download list and link targets | Files not downloaded; host did not resolve |
| S31 | Terms & Conditions | Visit Red Sea / RSG | https://www.visitredsea.com/en/terms-and-conditions | n/s | 2026-10-12 | Licence wording, RSG as party | Not legal advice |
| S32 | Visit Red Sea App | Visit Red Sea / RSG | https://www.visitredsea.com/en/visitredsea-app | n/s | 2026-10-12 | App scope, concierge, store links | App itself not examined |
| S33 | Plan your trip: Airport & Flights | Visit Red Sea / RSG | https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights (also /getting-to-and-around) | n/s | 2026-10-12 | Copy, airline hand-offs | Partial |
| S34 | Water Sports experiences | Visit Red Sea / RSG | https://www.visitredsea.com/en/experiences/water-sports | n/s | 2026-10-12 | Experience naming, attributes, CTAs | Partial |
| S35 | Offers and packages | Visit Red Sea / RSG | https://www.visitredsea.com/en/offers-and-packages | n/s | 2026-10-12 | Offer names and labels | Partial |
| S36 | Residential | Visit Red Sea / RSG | https://www.visitredsea.com/en/residential | n/s | 2026-10-12 | Residences copy, "Enquire about Ownership", form labels | Form not submitted |
| S37 | Contact Us (EN and AR) | Visit Red Sea / RSG | https://www.visitredsea.com/en/contact-us ; https://www.visitredsea.com/ar/contact-us | n/s | 2026-10-12 | Form microcopy, computed fonts, button colours, phone formats | Browser; form not submitted |
| S38 | Dining | Visit Red Sea / RSG | https://www.visitredsea.com/en/dining | n/s | 2026-10-12 | Restaurant naming, SevenRooms hand-off | Partial |
| S39 | Adrena Day Pass; Laha Beach Ladies Club | Visit Red Sea / RSG | https://www.visitredsea.com/en/experiences/adrena/adrena ; https://www.visitredsea.com/en/laha-beach-ladies-club | n/s | 2026-10-12 | Sub-brand copy | Partial |
| S40 | AMAALA home (EN) | AMAALA / RSG | https://www.amaala.com/en | n/s (footer © 2026) | 2026-10-12 | Hero, resort names, CTAs, logos, fonts, colour tokens, Jayasom hand-off, redirect target | Browser only; colour-token chunk not isolated |
| S41 | AMAALA home (AR) | AMAALA / RSG | https://www.amaala.com/ar | n/s | 2026-10-12 | Arabic names, copy, CTAs, fonts, RTL | Browser only |
| S42 | AMAALA font CSS chunk | AMAALA / RSG | https://www.amaala.com/_next/static/chunks/6a956b724013fd95.css | n/s | 2026-10-12 | `@font-face` families | In-page fetch; hashed name |
| S43 | AMAALA resort pages | AMAALA / RSG | https://www.amaala.com/en/resorts/daraah-resort-amaala ; https://www.amaala.com/ar/resorts/daraah-resort-amaala ; https://www.amaala.com/en/resorts/six-senses-amaala ; https://www.amaala.com/en/resorts | n/s | 2026-10-12 | Room names, Daraah/Darrah, en/ar differences, UAT link, booking routes, chat | Booking not submitted |
| S44 | Above Water experiences | AMAALA / RSG | https://www.amaala.com/en/experiences/water-sports/above-water | n/s | 2026-10-12 | WAMA naming, prices, policy tone | Partial |
| S45 | AMAALA Resorts Opening Offers | AMAALA / RSG | https://www.amaala.com/en/offers-and-packages/amaala-opening-offers | n/s (offers valid to 31 December 2026) | 2026-10-12 | Offer naming, operator naming | Partial |
| S46 | Terms & Conditions | AMAALA / RSG | https://www.amaala.com/en/terms-and-conditions | n/s | 2026-10-12 | Same IP wording; RSG named 32 times | First 1,300 characters read |
| S47 | AMAALA Yacht Club; Plan your trip; Residences | AMAALA / RSG | https://www.amaala.com/en/amaala-yacht-club ; https://www.amaala.com/en/plan-your-trip/the-airport-and-flights ; https://www.amaala.com/en/residences | n/s | 2026-10-12 | Sub-brand copy, title capitalisation, audiences | Partial |
| S48 | Red Sea Global Hospitality (EN, AR, About) | Red Sea Global Hospitality | https://redseaglobalhospitality.com/en/ ; https://redseaglobalhospitality.com/ar/ ; https://redseaglobalhospitality.com/en/about-us/ | n/s | 2026-10-12 | Property list, positioning, Arabic names, shared RSG clientlibs, logos | Fonts and colours not extracted |
| S49 | Shebara resort site (EN, AR, Villas) | Red Sea Global Hospitality | https://www.shebara.sa/en/ ; https://www.shebara.sa/ar/ ; https://www.shebara.sa/en/villas/ | n/s (footer © 2026) | 2026-10-12 | Tagline, CTAs, villa names, fonts, colours, reservations links, UAT reference | Reached by guessing the domain, then confirmed via link from S48 |
| S50 | Desert Rock resort site (EN, AR, Villas) | Red Sea Global Hospitality | https://www.desertrock.sa/en/ ; https://www.desertrock.sa/ar/ ; https://www.desertrock.sa/en/villas/ | n/s | 2026-10-12 | Positioning, villa names, fonts, colours, Arabic placeholder metadata | Same |
| S51 | Reservations landing page | Red Sea Global Hospitality | https://reservations.redseaglobalhospitality.com/multi-dest-search-rates?hotel=62780 | n/s | 2026-10-12 | Booking engine host, title, logo, currency and language switches | Landing HTML only; no search run |
| S52 | Turtle Bay Hotel site (EN, AR) | Red Sea Global Hospitality | https://turtlebayhotel.sa/en/ ; https://turtlebayhotel.sa/ar/ | n/s | 2026-10-12 | Naming, CTAs, reservations contact | Partial |
| S53 | Daraah Resort site (EN, AR) | Red Sea Global Hospitality | https://tbha-hotel.com/en/ ; https://tbha-hotel.com/ar/ | n/s | 2026-10-12 | Naming, CTAs, missing `lang`/`dir`, "AMALA Resort" alt | Partial |
| S54 | Thuwal - Private Retreat (EN, AR) | Red Sea Global | https://www.thuwalretreat.sa/en/ ; https://www.thuwalretreat.sa/ar/ | n/s | 2026-10-12 | Title, nav, logo files, missing Arabic `lang`/`dir` | Client-rendered; body copy not captured |
| S55 | Shura Links | Red Sea Global | https://shuralinks.com/ | n/s ("Soft Opening: September 2025") | 2026-10-12 | Tagline, shared platform, logos | Home only |
| S56 | Red Sea International Airport | Red Sea Global | https://rsiairport.sa/en/ | n/s | 2026-10-12 | Naming, logos | Home only |
| S57 | Fly Red Sea | Fly Red Sea / RSG | https://www.flyredsea.com/en/ | n/s | 2026-10-12 | Tagline, CTAs, hand-off to visitredsea.com, logos | Home only |
| S58 | Red Sea Global confirms new brand identity and mandate | Middle East Construction News | https://meconstructionnews.com/55044/red-sea-global-confirms-new-brand-identity-and-mandate/amp | not checked | 2026-10-12 (search result only) | None. Listed as a lead for the 2022 rename | Not opened; search snippet only; no claim in this file relies on it |

---

## Brand items that need approval or documents from RSG

1. Brand guidelines for each brand that an agent would speak for: Red Sea Global, The Red Sea / Visit Red Sea, AMAALA, Red Sea Global Hospitality, Shebara, Desert Rock, Turtle Bay Hotel, Daraah Resort, Thuwal Private Retreat.
2. A written decision on which brand the agent represents at each stage (discovery, booking, confirmation, in-stay, support), for both the destination-platform path and the RSG Hospitality path.
3. Approved name list in English and Arabic for destinations, islands, resorts, sub-brands and subsidiaries, including the rule for "The Red Sea" versus "Visit Red Sea" and the capitalisation rule for AMAALA.
4. Tone-of-voice guidance in English and Arabic: register, forms of address, numerals, dialect, banned words, and whether Arabic is to be transcreated.
5. Official palettes and type specifications, with accessibility pairings. The CSS tokens listed here cannot stand in for them.
6. Font licences and approval for a vendor to use Questa Grande, Paralucent, Fedra and the AMAALA typefaces, or approved fallbacks.
7. Logo files, variants and usage rules, plus written permission to use them in a POC. Site terms require "the owner's prior written permission".
8. Permission and guidelines for third-party operator marks and names (Six Senses, St. Regis, Ritz-Carlton Reserve, EDITION, InterContinental, SLS, Four Seasons, Miraval, Grand Hyatt, Raffles, Rosewood, Nammos, Equinox, Jayasom, Clinique La Prairie), which belong to those operators.
9. Licence for copy, imagery and video. Current site terms allow "personal and non-commercial use" only.
10. The Travel Trade toolkit contents (factsheets, media pitches, boilerplate, images) and their usage terms.
11. Room and villa type master data per resort in both languages, and a resolution of the Desert Rock naming mismatch.
12. Approved CTA vocabulary per brand and language ("Book" versus "Check Availability"; Arabic equivalents).
13. Confirmation page, confirmation email and chat scripts as currently used, to match brand and sender.
14. Whether WAMA, Galaxea and AKUN are guest-facing names at each destination.
15. Clarification of the conflicts listed in the consolidated table, especially resort counts and English/Arabic factual differences, before any of those facts are used as agent knowledge.

---

## Explicit gaps

- No official brand specification of any kind was found. Every design statement in this file is observed implementation.
- Booking flow beyond the search widget was not walked through: rate pages, guest details, payment, confirmation, emails. No form was submitted.
- Live chat was not opened. Who answers, in which brand voice, and in which languages is unknown.
- The Visit Red Sea mobile app was not examined.
- Travel Trade toolkit files were not downloaded (host unresolvable, and downloads need the user's approval).
- Logo files were not opened individually. Variant descriptions come from file names, alt text and two described screenshots.
- Mirrored RTL layout was inferred from attributes and CSS, not verified by side-by-side screenshots.
- Thuwal consumer site body copy, and fonts and colours for thuwalretreat.sa, turtlebayhotel.sa, tbha-hotel.com, flyredsea.com, rsiairport.sa, shuralinks.com and redseaglobalhospitality.com, were not extracted.
- Privacy policies, the RSG Privacy Center and cookie policy were not read.
- Social media profiles were not reviewed for brand usage.
- Trademark registrations were not searched.
- Third-party operator resort pages outside RSG domains (for example Six Senses or Marriott sites) were not checked for how they name the destination.
- RSG corporate page text was captured in truncated form (first 1,000 to 2,600 characters per page), so later sections of those pages are not covered.
- shebara.sa and desertrock.sa were first reached by guessing the domain. Their official status rests on links from redseaglobalhospitality.com, which is linked from redseaglobal.com.
- Page content, CSS file names and build stamps reflect 12 October 2026 and will change on redeploy.
