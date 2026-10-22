# Red Sea Global guest-facing digital ecosystem, UX and account entry points (redseaglobal.com, visitredsea.com, amaala.com)

Research date: 12 October 2026. All live observations were made between 18:45 and 19:13 UTC (21:45 to 22:13 KSA time) in the built-in browser, in a dedicated tab, at a 1024x768 desktop viewport unless stated, and at 375x812 for the mobile pass. Timestamps in brackets are UTC and come from the page clock at the moment of capture.

Evidence labels: [OBSERVED-LIVE] seen in the rendered page in the browser. [FETCHED-HTML] read from fetched markup or the DOM without being displayed on screen (not interactive evidence). [OFFICIAL-DOC] an official RSG-published page or store listing stating something about the product. [THIRD-PARTY] non-RSG source. [CONFLICT] two official sources disagree. "Not verified" means the step was blocked or out of scope, with the reason given.

Method limits that apply to every section:
- No form was submitted, no account created, no chat opened, no CAPTCHA or OTP attempted. Availability searches (resort, dates, 2 adults) were run because they carry no personal data and were needed to record the first booking screen URL.
- The browser profile is shared with other researchers. OneTrust consent cookies on visitredsea.com and amaala.com were already set to "strictly necessary only" (OptanonAlertBoxClosed = 2026-10-12T18:46:02Z, groups C0001:1, C0002:0, C0003:0, C0004:0) before my first load of those sites, so I never saw the cookie banner itself.
- Screenshots could not be saved. Where a screenshot was the evidence, it is described with URL and time.
- The mobile app was not installed or tested. Only its store listings were read.

## 1. What is the full top-level and second-level navigation of each site (header, footer, burger menu), in English and Arabic? Which outbound domains are linked from navigation?

### Takeaway
The three sites are two different builds. redseaglobal.com is a corporate site (AEM components, mega menu, no booking, no account). visitredsea.com and amaala.com share one guest platform (Next.js front end over AEM content and a `/api/booking/v1` back end) with the same header pattern: language/currency, Map, Account, BOOK and a flat one-level menu. Arabic versions mirror the English structure on all three, with a few link-level differences.

### Cited Findings

**redseaglobal.com, English header** [OBSERVED-LIVE 18:46]
- Top bar: language switcher (English / عربي), logo, Search button. Mega menu top level and second level: Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/)
  - Who we are: About us, Leadership, Partnerships, Governance, Awards
  - Our Business: Services (third level: Real Estate, Engineering & Constructions, Tourism & Hospitality, each with fourth-level items), Subsidiaries (third level: Operations & Infrastructure, Hospitality & Tourism, Environment & Regeneration, with 13 subsidiary pages)
  - Our Portfolio: The Red Sea, AMAALA, Thuwal (each with third-level groups Residential, Hospitality, Leisure & Entertainment, Facilities)
  - Positive Impact: Regenerative Tourism, Responsible Development (People, Planet), Reports
  - Invest: links to /en/investment (panel shows Invest with us, Governance, Projects, Sustainability Report)
  - Join Us: Careers, Training & Education (Education Program, Training Programs)
  - Media Center: Latest news, All news
- Many third and fourth-level mega menu entries are anchors with no href (for example "Shura Island Residences", "Equinox Resort", "Corallium", "Triple Bay"). They are labels, not links. Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [FETCHED-HTML, DOM dump 18:46]
- Footer columns: Our Businesses (Investments, Services); Our Subsidiaries (Botanica, Red Sea Security Services, Reef, Coastal Contracting Company (C3)); Our Destinations (The Red Sea, AMAALA, Thuwal); Quick links (Vendor Registration, Careers, Media Center, Contact Us); legal row (Terms & Conditions, Privacy Policy, Privacy Center); five social icons; "© 2026, Red Sea Global. All rights reserved." A "News & Updates" newsletter form sits above the footer on every page checked. Source: [redseaglobal.com/en/contact-us/](https://www.redseaglobal.com/en/contact-us/) [OBSERVED-LIVE 18:47]
- Mobile (375x812): header collapses to a "Show menu button" burger, the logo and one unnamed 40x40 button (the search icon, no accessible name). Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [OBSERVED-LIVE 19:09]

**redseaglobal.com, Arabic header and footer** [OBSERVED-LIVE 18:48]
- Top level: من نحن, أعمالنا, مشاريعنا, التأثير والاستدامة, الاستثمار, انضم إلينا, المركز الإعلامي. Second level matches English one for one (نبذة عنّا, القيادة, الشراكات, الحوكمة, الجوائز; الخدمات, الشركات التابعة; البحر الأحمر, أمالا, ثول; السياحة المتجددة, التنمية المسؤولة, التقارير; الوظائف, التدريب والتعليم). `lang="ar"`, `dir="rtl"`. Source: [redseaglobal.com/ar/](https://www.redseaglobal.com/ar/)
- Arabic footer mirrors English (تسجيل الموردين, الوظائف, المركز الإعلامي, اتصل بنا, الشروط والأحكام, سياسة الخصوصية, مركز الخصوصية). Source: [redseaglobal.com/ar/](https://www.redseaglobal.com/ar/)

**redseaglobal.com outbound domains from navigation**
- linkedin.com, youtube.com, instagram.com, x.com, facebook.com (social icons, new tab). Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [OBSERVED-LIVE]
- visitredsea.com: English footer "AMAALA" points to `https://www.visitredsea.com/en/destinations/amaala`, which redirected to `https://www.amaala.com/en` when loaded. Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/); redirect seen at [visitredsea.com/en/destinations/amaala](https://www.visitredsea.com/en/destinations/amaala) [OBSERVED-LIVE 19:07]
- thuwalretreat.sa: footer "Thuwal" (`/en/` and `/ar/`). Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [OBSERVED-LIVE]; HEAD request returned 200 [FETCHED-HTML 19:12]
- careers.theredsea.sa: "View opportunities" on the Careers page opens `https://careers.theredsea.sa/go/Job-Opportunities/7716923/` in a new tab. Source: [redseaglobal.com/en/careers/](https://www.redseaglobal.com/en/careers/) [OBSERVED-LIVE 18:48]
- content.redseaglobal.com (supplier training videos), rsg-privacy.my.onetrust.com (privacy request iframe), mapbox.com (map attribution). Source: [vendor-registration](https://www.redseaglobal.com/en/vendor-registration/), [privacy-center](https://www.redseaglobal.com/en/privacy-center/), [home](https://www.redseaglobal.com/en/) [OBSERVED-LIVE]

**visitredsea.com, English** [OBSERVED-LIVE 18:49]
- Desktop header, top row: "English / SAR" button (aria-label "Open language settings"), live temperature (27.1°C), logo link "Explore" to /en, "Map" (/en/map), "Account" (no href, opens a drawer), "BOOK" (button, opens a booking widget). Source: [visitredsea.com/en](https://www.visitredsea.com/en)
- Desktop main menu, one level only, no dropdowns in the DOM: RESORTS (/en/resorts), EXPERIENCES (/en/experiences/water-sports), DINING (/en/dining), PROMOTIONS (/en/offers-and-packages), SHURA ISLAND (/en/shura-island), PLAN YOUR TRIP (/en/plan-your-trip/the-airport-and-flights). Source: [visitredsea.com/en](https://www.visitredsea.com/en)
- Second level exists only as in-page tab bars: Experiences has Water Sports, Adventure Sports, Nature, Adrena, Laha Beach, Shura Links. Plan Your Trip has Airport & Flights, Weather & Proximity, Getting to & Around. Source: [experiences/water-sports](https://www.visitredsea.com/en/experiences/water-sports) [18:56], [plan-your-trip/the-airport-and-flights](https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights) [18:58]
- Footer: "Connect" (TikTok, Facebook, X, Instagram, LinkedIn); "The Red Sea / Resources" (Residences, Track My Luggage, Travel Trade, Visit Red Sea App); "Contact Us" (+966 11 222 2222, info@visitredsea.com, CONTACT US button that opens a modal form); "DOWNLOAD THE APP" (App Store and Google Play badges); legal row (Terms & Conditions, Privacy Policy, Privacy Center, "MOT license: 73104512", "CR: 1010916245"); "© 2026, Visit Red Sea. All rights reserved." A "Stay Connected" sign-up band sits above the footer. Inside the booking flow the footer adds a "FAQ" link. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [18:49]; [booking page](https://www.visitredsea.com/en/booking/accommodation-list?hotelId=1035&resortName=Shebara&startDate=2026-10-20&endDate=2026-10-22&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortIndex=0&searchId=mv5m32rl) [18:54]
- Burger menu at 375x812: Close, a large "Log In or Sign Up" block, RESORTS, EXPERIENCES, DINING, PROMOTIONS, SHURA ISLAND, PLAN YOUR TRIP, Map, "English / SAR". The collapsed mobile header shows temperature, "English / SAR", burger, logo and BOOK. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 19:07]

**visitredsea.com, Arabic** [OBSERVED-LIVE 19:01]
- Header: "عربى / ريال سعودي", الخريطة, حسابي, احجز. Menu: المنتجعات, التجارب, المطاعم, عروض حصرية, جزيرة شُورى, خطط رحلتك. Same six destinations as English, with /ar/ paths. Source: [visitredsea.com/ar](https://www.visitredsea.com/ar)
- Footer: الوحدات السكنية, تتبع أمتعتي, شركاء السفر, تطبيق Visit Red Sea, تواصل معنا, الشروط والأحكام, سياسة الخصوصية, مركز الخصوصية, ترخيص وزارة السياحة: 73104512, رقم السجل التجاري: 1010916245. Source: [visitredsea.com/ar/resorts/shebara](https://www.visitredsea.com/ar/resorts/shebara)

**visitredsea.com outbound domains from navigation and nav-level pages**
- tiktok.com, facebook.com, x.com, instagram.com, linkedin.com (footer social, new tab); apps.apple.com and play.google.com (footer badges, new tab); redseaglobal.com (footer "Privacy Center" to `https://www.redseaglobal.com/en/privacy-center/`, new tab). Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:49]
- onelink.to ("DOWNLOAD THE APP" on the app page points to `https://onelink.to/visitredsea`). Source: [visitredsea-app](https://www.visitredsea.com/en/visitredsea-app) [18:55]
- rsiairport.sa, qatarairways.com, etihad.com, saudia.com, flydubai.com, visitsaudi.com (visa link). Source: [plan-your-trip/the-airport-and-flights](https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights) [18:58]
- amaala.com by redirect from /en/destinations/amaala. Source: [visitredsea.com/en/destinations/amaala](https://www.visitredsea.com/en/destinations/amaala) [19:07]

**amaala.com, English** [OBSERVED-LIVE 19:02]
- Header: "English / SAR", temperature, logo, an account icon link and a map icon link (both with no text and no accessible name at 1024px), "Book" button. Menu: RESORTS (/en/resorts), EXPERIENCES (/en/experiences/water-sports/above-water), AMAALA YACHT CLUB (/en/amaala-yacht-club), PLAN YOUR TRIP (/en/plan-your-trip/the-airport-and-flights). Source: [amaala.com/en](https://www.amaala.com/en)
- Footer: Quick Links (Offers to /en/offers-and-packages/amaala-opening-offers, Dining, Residences); Contact Us (+966 11 222 2222, info@amaala.com, Contact Us button); Connect (Facebook, X, Instagram); Terms & Conditions, Privacy Policy; "© 2026, AMAALA. All rights reserved." No app badges, no Privacy Center, no Track My Luggage, no MOT/CR line. The footer logo carries the alt text "Visit Red Sea". Source: [amaala.com/en](https://www.amaala.com/en)
- Mobile header at 375x812: burger, logo, Book. No language button visible in the collapsed header. Source: [amaala.com/en](https://www.amaala.com/en) [19:09]

**amaala.com, Arabic** [OBSERVED-LIVE 19:05]
- Menu: المنتجعات, التجارب, نادي أمالا لليخوت, خطط لرحلتك. Footer: العروض, المطاعم, ريزيدنسز, phone, email, social, الشروط والأحكام, سياسة الخصوصية. Source: [amaala.com/ar](https://www.amaala.com/ar)

**amaala.com outbound domains**
- facebook.com, x.com, instagram.com (footer). jayasom.com (resort card BOOK). amaala.uat.webconnectorprojects.com (two in-page links, see section 13). Source: [amaala.com/en/resorts](https://www.amaala.com/en/resorts), [six-senses-amaala](https://www.amaala.com/en/resorts/six-senses-amaala), [residences](https://www.amaala.com/en/residences) [OBSERVED-LIVE 19:04 to 19:06]

**Sitemaps and robots.txt**
- visitredsea.com robots.txt allows all, disallows `/web/guest/`, `/*?utm`, `/*/url-builder`, and declares `https://www.visitredsea.com/sitemap.xml`. The sitemap has 199 `<loc>` entries, each with en and ar hreflang alternates. Sections by path: plan-your-trip (5), resorts (20), offers-and-packages (53), destinations (7), experiences (36), residential (4), dining (64), plus single pages (preference-center, privacy-policy, terms-and-conditions, contact-us, contact-us-mobile, shura-links, general-terms-and-conditions-booking, faqs-booking, amaala-residences, events-at-the-red-sea, thuwal-private-retreat, marketing-campaign-form, two travel-trade toolkits, visitredsea-app, summer-guide). Source: [visitredsea.com/robots.txt](https://www.visitredsea.com/robots.txt), [visitredsea.com/sitemap.xml](https://www.visitredsea.com/sitemap.xml) [FETCHED-HTML 18:45]
- The visitredsea sitemap omits pages that are in the live menu (for example /en/shura-island, /en/map, /en/resorts/raffles-the-red-sea, /en/resorts/grand-hyatt-the-red-sea) and still lists nine AMAALA resort URLs and many past seasonal offers (Ramadan, Eid, Founding Day, Summer). Source: [visitredsea.com/sitemap.xml](https://www.visitredsea.com/sitemap.xml) compared with [visitredsea.com/en/resorts](https://www.visitredsea.com/en/resorts) [FETCHED-HTML / OBSERVED-LIVE]
- amaala.com robots.txt is the same template and declares `https://www.amaala.com/sitemap.xml`. That sitemap (loaded in the browser, curl got a Cloudflare 403 challenge) lists 63 URLs whose host is `www.visitredsea.com` and whose paths are internal AEM paths such as `/content/amaala/en/resorts/six-senses-amaala`. It includes test pages: `/content/amaala/en/test-amaala-slider-banner`, `wellness-amaala-test`, `experiences-test`, `airport-flights-test`, `wellnesss`, `contact-us1`. Source: [amaala.com/robots.txt](https://www.amaala.com/robots.txt), [amaala.com/sitemap.xml](https://www.amaala.com/sitemap.xml) [OBSERVED-LIVE 19:06]
- redseaglobal.com robots.txt is `User-agent: * / Allow: /` with no sitemap line. `/sitemap.xml` returns a plain "404 Not Found" page. A sitemap does exist at `/en.sitemap.xml` (636 URLs, host `redseaglobal.com` without www, every lastmod on 2026-04-06). By section: media-center 351, awards 141, responsible-development 24, partnerships 20, subsidiaries 13, plus 66 URLs under `/en/testing/` (for example `/en/testing/contact-us-test/`, `/en/testing/recaptcha-test/`, `/en/testing/vendor-registration-form/`, `/en/testing/rsi-brand-components/error-page-500/`) and `/en/testing-demo/`, `/en/careers1/`, `/en/governance1/`. Source: [redseaglobal.com/robots.txt](https://www.redseaglobal.com/robots.txt), [redseaglobal.com/sitemap.xml](https://www.redseaglobal.com/sitemap.xml), [redseaglobal.com/en.sitemap.xml](https://www.redseaglobal.com/en.sitemap.xml) [OBSERVED-LIVE 19:06 to 19:07]

### Inferences
- visitredsea.com and amaala.com run on one shared guest platform: identical header components, identical booking URL pattern, identical chat widget path (`/chat/widgetloader.html`), and the amaala sitemap is generated from the same content repository (`/content/amaala/...` on the visitredsea host).
- redseaglobal.com is positioned as corporate only. Its sole guest-direction links are "VISIT RED SEA" to visitredsea.com/en/resorts and "Explore more" links on project pages.
- The sitemaps are not maintained as navigation truth: they expose test and legacy pages and miss live ones.

### Gaps
- I did not open the redseaglobal.com mobile burger menu or expand every mega menu panel on screen. Third and fourth-level labels come from the DOM.
- amaala.com experience sub-tabs and the amaala mobile burger content were not opened.
- The Arabic mega menu on redseaglobal.com was read from the DOM, not expanded panel by panel.

## 2. How does a visitor discover destinations and resorts: listing pages, filters, comparison tools, maps, search?

### Takeaway
Discovery is card and carousel based. There is a resort listing per site, an interactive Mapbox map on visitredsea.com, and category tabs on the visitredsea homepage. On the day of testing the resorts listing filter had a single option, there is no comparison tool, no price or date filter outside the booking widget, and no site search on the guest sites.

### Cited Findings
- visitredsea.com /en/resorts shows "13 RESORTS", six cards then a "7 MORE RESORTS" load-more button. All 13 cards are labelled "THE RED SEA": Raffles, Grand Hyatt, Miraval, Four Seasons, SLS, InterContinental, Turtle Bay Hotel, The Red Sea EDITION, Desert Rock, Shebara, Nujuma, Six Senses Southern Dunes, The St. Regis. Cards carry tags (Wellness, Beachfront, Over-water, Rocky Mountains, Dune, and lower-case tags "family", "couples", "bleisure", "friends" on two cards), an EXPLORE link and, on ten of them, a BOOK button. Source: [visitredsea.com/en/resorts](https://www.visitredsea.com/en/resorts) [OBSERVED-LIVE 18:52 to 18:53]
- Raffles, Grand Hyatt and InterContinental cards have no BOOK button. Source: [visitredsea.com/en/resorts](https://www.visitredsea.com/en/resorts) [OBSERVED-LIVE 18:53]
- The listing's only filter is a sentence control, "I'm looking for a [breathtaking]" (a react-select combobox). When opened it offered one option, "breathtaking". Steps: load /en/resorts, click the sentence heading, read the option list. Source: [visitredsea.com/en/resorts](https://www.visitredsea.com/en/resorts) [OBSERVED-LIVE 18:53]
- The visitredsea homepage has a resort carousel with category tabs ALL RESORTS, BEACHFRONT, WELLNESS, OVER-WATER, ROCKY MOUNTAINS, DUNE, and an "EXPLORE ALL RESORTS" link. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:49]
- /en/destinations and /en/destinations/the-red-sea both redirect to the homepage, so there is no destinations index on visitredsea.com even though the sitemap lists one. Source: [visitredsea.com/en/destinations](https://www.visitredsea.com/en/destinations) [FETCHED-HTML, same-origin fetch 19:10]
- /en/map is a full-page Mapbox GL map with Zoom in, Zoom out and Reset bearing controls. No search box or category filter control was present in the DOM at load. The page has an empty `<title>`. Source: [visitredsea.com/en/map](https://www.visitredsea.com/en/map) [OBSERVED-LIVE 19:11]
- There is no search control in the visitredsea.com or amaala.com header. The only free-text search is "Search experiences and activities" inside the booking widget's Experiences tab. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:52]
- redseaglobal.com has a header Search button and a /en/search/ page. Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [OBSERVED-LIVE 18:46]
- amaala.com /en/resorts shows "9 resorts" (six cards plus "3 More Resorts"), no filter control in the DOM. Homepage carousel: Rosewood, Nammos, Six Senses, Equinox, Four Seasons Resort And Residences, Jayasom Wellness Resort, Daraah Resort (all with BOOK), and "Opening Soon" for Clinique La Prairie Health Resort and The Ritz-Carlton Resort. Source: [amaala.com/en/resorts](https://www.amaala.com/en/resorts), [amaala.com/en](https://www.amaala.com/en) [OBSERVED-LIVE 19:02 to 19:04]
- No comparison tool (side by side resorts, rooms or prices) was found on any page visited. Source: pages listed in the research log [OBSERVED-LIVE]
- redseaglobal.com presents destinations as corporate portfolio pages (The Red Sea, AMAALA, Thuwal) with a Mapbox map on the homepage and hands off with "VISIT RED SEA" to `https://www.visitredsea.com/en/resorts` (new tab). Source: [redseaglobal.com/en/portfolio/the-red-sea/](https://www.redseaglobal.com/en/portfolio/the-red-sea/) [OBSERVED-LIVE 19:12]

### Inferences
- The Red Sea and AMAALA inventories are split by domain. A visitor on visitredsea.com does not see AMAALA resorts in the listing or in the booking widget's resort list, and vice versa, although one account is said to work on both (section 6).
- The single-option filter looks like an unfinished or misconfigured content setting, not a designed state.

### Gaps
- Map marker behaviour (what a pin opens, whether pins deep-link to resort pages) was not tested because markers are drawn on a canvas.
- The redseaglobal.com search results page was not exercised with a query.
- amaala.com /en/map was not opened.

## 3. What information is available before booking on resort pages (rooms, dining, experiences, offers, location, transfers, FAQs)?

### Takeaway
Resort pages are content-rich on rooms, amenities, dining, access and policies, including a per-resort accessibility section, but they show no prices and no availability. Prices first appear on the booking results screen.

### Cited Findings
- Shebara page sections in order: hero and summary, "YOUR PRIVATE ESCAPE / Accommodations" (filter chips ALL and VILLA, eight villa cards with occupancy, bedrooms, bed type, view, size in sqm, pool, and a BOOK link), amenity list (28 items such as Spa, Kids Club, Gym, Padel & Tennis Courts), "DINING / Exceptional Dining Experiences" carousel, "EXPLORE SHURA ISLAND" promo, "Getting To Shebara Resort" (car and boat from RSI, seaplane from RSI, arriving by car, with durations), "OFFERS / Featured offers", "Reservation Policy" accordion, "Stay Connected". Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE 18:53]
- The Reservation Policy accordion covers Check-in Times (3:00 PM / 12:00 Noon), Rates (SAR, 5% municipality tax and 15% VAT), Early arrivals and late departures, Additional guests and children surcharge, Accommodation, Children Meal Plan, Cancellation Policy (7 days before arrival by 6:00 PM KSA), Reservation Guarantee Policy (deposit charged 14 days before arrival), Accessibility Information, Licenses Numbers (CR and Ministry of Tourism licence). Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE 18:53]
- The Accessibility Information panel describes four two-bedroom ADA villas, ramps, pool lifts, roll-in shower, accessible restrooms and golf carts, and lists equipment (1 wheelchair, pool lift, 1 beach wheelchair). Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OFFICIAL-DOC, page text 18:53]
- No room price, "from" rate or availability indicator appears on the resort page. Prices appear on the booking results page as "Average price per night excluding taxes" (for example One Bedroom Beach Villa 8,741.25 on a promotional rate and 9,712.50 on "Villa Flat Rate" for 20 to 22 Oct 2026, 2 adults). Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara); [booking results](https://www.visitredsea.com/en/booking/accommodation-list?hotelId=1035&resortName=Shebara&startDate=2026-10-20&endDate=2026-10-22&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortIndex=0&searchId=mv5m32rl) [OBSERVED-LIVE 18:54]
- Resort pages have no FAQ block. A general booking FAQ exists at /en/faqs-booking with 12 questions (how to book, same-day booking, 6-month booking window, payment methods, confirmation by email and SMS, modify or cancel through "My Trips", cost breakdown, multi-resort). Source: [visitredsea.com/en/faqs-booking](https://www.visitredsea.com/en/faqs-booking) [OBSERVED-LIVE headings 19:10; answers FETCHED-HTML because accordions were collapsed]
- Dining has its own section: /en/dining plus per-resort and per-restaurant pages (64 dining URLs in the sitemap). Source: [visitredsea.com/sitemap.xml](https://www.visitredsea.com/sitemap.xml) [FETCHED-HTML]
- Transfers and getting there: per-resort "Getting to" block, plus Plan Your Trip pages with a flight information widget ("Flights from [All airports] on [Sunday]", ARRIVALS / DEPARTURES tabs, four flights listed: QR1226 DOH, EY621 AUH, SV1569 RUH, FZ927 DXB) and practical notes (climate, visa, currency, language, taxes, dress). Source: [plan-your-trip/the-airport-and-flights](https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights) [OBSERVED-LIVE 18:58]
- amaala.com Six Senses Resort page: Accommodations (chips All, Suite, Villa; ten room types with BOOK), Experiences & Attractions, Featured offers, "Triple Bay, AMAALA", Reservation Policy accordion (no Accessibility panel in the heading list), "Getting to the Resort" (FLIGHTS, DRIVING, FLY RED SEA). Source: [amaala.com/en/resorts/six-senses-amaala](https://www.amaala.com/en/resorts/six-senses-amaala) [OBSERVED-LIVE 19:04]
- Raffles The Red Sea page lists room types (Signature Queen Room, Landmark Lagoon View King Room, suites) with occupancy and size, but has no BOOK control in the page body and no "opening soon" notice in the text captured. Source: [visitredsea.com/en/resorts/raffles-the-red-sea](https://www.visitredsea.com/en/resorts/raffles-the-red-sea) [OBSERVED-LIVE 19:13]

### Inferences
- A visitor cannot judge budget fit from resort pages. They must run a dated search to see any rate.
- Unbookable resorts (Raffles, Grand Hyatt) are presented the same way as bookable ones, without a stated reason.

### Gaps
- Only three resort pages were opened (Shebara, Raffles, Six Senses AMAALA). Third-party-brand resort pages such as The St. Regis were not individually checked.
- Dining detail pages and the room detail modal content were not read.

## 4. Where are the booking entry points on each site, what do their labels say, and what exact URL and domain does each one open?

### Takeaway
On visitredsea.com and amaala.com every stay booking entry opens the same on-site widget and then a same-domain, same-tab booking flow at `/en/booking/accommodation-list`, with resort, dates and guest counts carried in the query string. The one external handoff found is Jayasom on amaala.com, which opens jayasom.com in a new tab. redseaglobal.com has no booking function and only links out.

### Cited Findings
- Header "BOOK" (visitredsea.com) opens an overlay widget with three tabs. Resorts: "Where would you like to go?" (resort picker with the note "Planning to stay at multiple resorts? Select your favorites."), Guests (default "2 Adults, 0 Children"), "Check in — Check out", Nights counter, "ADD ANOTHER RESORT", SEARCH. Experiences: "What do you want to do?" (search box plus categories Laha Beach, Adrena, Adventure Sports, Golf, Water Sports, Nature), "Where are you staying?", "When?", SEARCH. Transportation: From, To, "When?", Guest (default "1 Adult"), SEARCH. While open, the BOOK button reads CLOSE. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:51 to 18:52]
- The widget's resort picker lists 11 resorts: Miraval The Red Sea (tagged "Adults only"), Four Seasons The Red Sea, SLS The Red Sea, InterContinental The Red Sea Resort, Turtle Bay Hotel, The Red Sea EDITION, Desert Rock, Shebara, Nujuma, Six Senses Southern Dunes, The St. Regis Red Sea Resort. Raffles and Grand Hyatt are absent. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:52]
- The date picker disables today and past dates, shows a legend "No arriving/departing flights" and the line "For bookings under 24 hours, please chat with us directly." SEARCH stays disabled until dates are chosen. Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE 18:54]
- Room card "BOOK" on a resort page is an anchor with `href=""` and `target="_blank"`. Clicking it does not open a new tab. It opens the same widget with the resort prefilled ("Shebara") and dates empty. The room type is not shown as carried over. Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE 18:54]
- Running the search (Shebara, 20 to 22 Oct 2026, 2 adults) navigated in the same tab to `https://www.visitredsea.com/en/booking/accommodation-list?hotelId=1035&resortName=Shebara&startDate=2026-10-20&endDate=2026-10-22&rooms=[{"adultCount":2,"childAges":[]}]&resortIndex=0&searchId=mv5m32rl` (page title "Booking Steps | Booking"). The first screen shows a five-step indicator (01 to 05), room and rate cards, a Booking Summary with CONTINUE, and the message "You're almost there. Your rewards are secured. Complete your booking and register — exclusive benefits will be ready soon." Source: [booking results](https://www.visitredsea.com/en/booking/accommodation-list?hotelId=1035&resortName=Shebara&startDate=2026-10-20&endDate=2026-10-22&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortIndex=0&searchId=mv5m32rl) [OBSERVED-LIVE 18:54]
- Experience card "BOOK NOW" (Scuba Diving, Single Dive) opens the widget on the Experiences tab with "Scuba Diving" prefilled (the category, not the specific activity) and resort and date empty. Source: [experiences/water-sports/scuba-diving](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving) [OBSERVED-LIVE 18:56]
- The Transportation "From" list mixes guest locations with operational ones: three airports (Red Sea International Airport, Yanbu Airport, Al Wajh Domestic Airport) and about 70 locations including "RSG Nursery", "RSG Hospital", "Tamimi Main Market", "CVO - TBO - Red Sea Project", "Bus Interchange TBV", several helipads, AlUla hotels and AMAALA resorts. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:52]
- amaala.com: header "Book" and room card "BOOK" open the same three-tab widget (labels in title case: "Where Would You Like To Go?", "Add Another Resort", "Search"; guests default "2 Adults"). Search for Six Senses Resort, 20 to 22 Oct 2026, 2 adults, navigated in the same tab to `https://www.amaala.com/en/booking/accommodation-list?hotelId=2841&resortName=Six+Senses+Resort&startDate=2026-10-20&endDate=2026-10-22&rooms=[{"adultCount":2,"childAges":[]}]&resortIndex=0&searchId=mv5mgiil`, with rate cards showing "Free cancellation anytime", "Pay online" and per-night prices excluding taxes. Source: [amaala.com/en/resorts/six-senses-amaala](https://www.amaala.com/en/resorts/six-senses-amaala); [amaala booking results](https://www.amaala.com/en/booking/accommodation-list?hotelId=2841&resortName=Six+Senses+Resort&startDate=2026-10-20&endDate=2026-10-22&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortIndex=0&searchId=mv5mgiil) [OBSERVED-LIVE 19:05]
- amaala.com Jayasom Wellness Resort card "BOOK" is a real link to `https://www.jayasom.com/booking`, `target="_blank"`, no parameters. Source: [amaala.com/en/resorts](https://www.amaala.com/en/resorts) [OBSERVED-LIVE 19:04]
- redseaglobal.com: no booking widget. "VISIT RED SEA" on the destination page opens `https://www.visitredsea.com/en/resorts` (new tab). "Explore more" on the Shebara project page opens `https://www.visitredsea.com/en/resorts/shebara` (new tab). No dates or guests are carried. Source: [portfolio/the-red-sea](https://www.redseaglobal.com/en/portfolio/the-red-sea/), [projects/shebara-resort](https://www.redseaglobal.com/en/portfolio/projects/shebara-resort/) [OBSERVED-LIVE 19:12]
- Mobile (375x812): BOOK stays in the collapsed header and opens the widget as a full-screen overlay (375x812) with a Close button, the same three tabs and SEARCH. In my session it opened on the Experiences tab. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 19:08]

### Inferences
- First-party booking covers the whole Red Sea portfolio shown in the widget, including third-party-operated brands (St. Regis, EDITION, Six Senses, Four Seasons), because their BOOK buttons stay on the RSG domain. Which engine sits behind `/api/booking/v1` is for the booking-engine researcher.
- "hotelId" values (1035, 2841) and "searchId" tokens are RSG platform identifiers carried in the URL. Deep links with resort and dates look constructible.
- The Experiences tab on mobile may simply have remembered my last-used tab. I would not treat it as the default.

### Gaps
- The first-screen URLs for an Experiences search and a Transportation search were not captured (each needs a resort or route plus a date; skipped for time). Not verified, requires running one search on each tab.
- "ADD ANOTHER RESORT" (multi-resort) was not exercised.
- Whether the booking flow forces login or registration at a later step was not checked (out of scope past the first screen).
- jayasom.com/booking was only confirmed to respond (HTTP 200 to a HEAD request), not opened.

## 5. What trip-planning, offers and packages, and experiences-booking features exist?

### Takeaway
There is a Plan Your Trip section with a live-looking flight board, an offers listing with four promotions, bookable experience cards, a three-step "Request a quote" trip-planning form and a luggage tracker. Several of these had content or state problems on the day.

### Cited Findings
- Plan Your Trip: three tabs (Airport & Flights, Weather & Proximity, Getting to & Around), flight board with day and airport selectors, "Before you visit" notes, and airline links. A fourth page, "seamless-wifi", is in the sitemap. Source: [plan-your-trip/the-airport-and-flights](https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights) [OBSERVED-LIVE 18:58]; [sitemap](https://www.visitredsea.com/sitemap.xml) [FETCHED-HTML]
- Offers listing: "4 PROMOTIONS" (Red Sea Wellness Escape, Romantic Getaway at The Red Sea, The Red Sea & AlUla Expedition, Fly Red Sea Seaplane Special Offers), each with "EXPLORE OFFER". The intro text reads "Celebrate the festive season...". Source: [offers-and-packages](https://www.visitredsea.com/en/offers-and-packages) [OBSERVED-LIVE 18:57]
- The Multi-Resort Escape Offer page is still live and still promoted in the "Featured Offers" carousel on /en/resorts, while its own terms say "Offer valid only between 2nd Jul to 20th Sep 2026". It prices the package at "17,250 SAR for 2 Guests" and its only call to action is "CONTACT US" (no direct booking). Source: [multi-resort-escape-offer](https://www.visitredsea.com/en/offers-and-packages/multi-resort-escape-offer) [18:57]; [resorts listing](https://www.visitredsea.com/en/resorts) [18:52] [OBSERVED-LIVE]
- Experiences: category page lists "8 EXPERIENCES" for water sports with age, group size and "Able to swim" notes. The scuba page lists "22 EXPERIENCES" with duration, minimum age, level, "Medically Fit", and "Booking a transportation may be required", plus "Extra Options" (Private Boat, Private Guide, Extra Passenger), a "FAQs" block holding Cancellation Policy and Additional Conditions, and BOOK NOW per activity. No prices are shown on the cards. Source: [experiences/water-sports](https://www.visitredsea.com/en/experiences/water-sports), [scuba-diving](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving) [OBSERVED-LIVE 18:56]
- "REACH OUT / Let us plan your journey / REQUEST A QUOTE" opens a modal titled "CRAFT YOUR EXCLUSIVE ESCAPE, Step into the Extraordinary", step 1 of 3, with three required questions ("What type of experiences would make your stay unforgettable?*", "What type of journey are you looking for?*", "Who are you travelling with?*"), CONTINUE, and "* You must complete all fields". The 14 answer options rendered as empty pills and empty cards with no text or icon (the label spans are empty in the DOM). Steps: open the scuba page, scroll to "Let us plan your journey", click REQUEST A QUOTE. Source: [scuba-diving](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving) [OBSERVED-LIVE, screenshot 18:57]
- Next to it, "BOOK NOW / Contact a personal assistant / START CHAT" offers the live chat. Source: [experiences/water-sports](https://www.visitredsea.com/en/experiences/water-sports) [OBSERVED-LIVE 18:56]
- Track My Luggage: tabs BAG TAGS and PNR, one field ("Bag Tags *"), note "All bags associated with PNR will be collected.", button TRACK MY LUGGAGE. Source: [booking/track-my-luggage](https://www.visitredsea.com/en/booking/track-my-luggage) [OBSERVED-LIVE 18:58]
- Homepage notices: "Surf Lagoon is temporarily closed." under Adrena. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:49]
- amaala.com promotes "AMAALA Resorts Opening Offers" at /en/offers-and-packages/amaala-opening-offers and experiences under "Above Water" (WAMA-led activities). Source: [amaala.com/en](https://www.amaala.com/en) [OBSERVED-LIVE 19:02]
- [CONFLICT] The booking FAQ says "To make a reservation for multiple resorts, please use the live assistant chat", while the booking widget offers "ADD ANOTHER RESORT" with the hint "Planning to stay at multiple resorts? Select your favorites." Source: [faqs-booking](https://www.visitredsea.com/en/faqs-booking) [FETCHED-HTML 19:10] versus [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:52]

### Inferences
- Packages are sold by enquiry (Contact us) while single stays are sold by the engine. That split is visible on the multi-resort offer page.
- The FAQ text predates the multi-resort widget feature.

### Gaps
- Steps 2 and 3 of the Request a quote form were not viewed because advancing requires selecting options and pressing CONTINUE. Not verified, requires stepping through with test selections.
- Other offer detail pages (wellness, romantic, AlUla, Fly Red Sea) were not opened, so their calls to action are unknown.
- Whether the flight board is live data or scheduled data was not established.

## 6. Is there any customer account, sign-in, "My trips", profile or loyalty feature on RSG-owned sites?

### Takeaway
Yes. visitredsea.com and amaala.com both have an email and password account, opened from the header as a drawer on the same domain. Registration starts with a single email field and the hint "Use the email from your booking". No social sign-in, no phone field and no password rules are visible on the screens that can be reached without submitting. A "My Trips" area is referenced in official text but could not be seen without logging in. No loyalty programme is live on the web. The booking screen only teases future "rewards". redseaglobal.com has no account feature.

### Cited Findings
- Entry points: "Account" in the desktop header (an anchor with no href), "Log In or Sign Up" at the top of the mobile burger menu, and "Account" in the booking flow header. On amaala.com the desktop entry is an unlabeled person icon. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [18:49, 19:07]; [amaala.com/en](https://www.amaala.com/en) [19:03] [OBSERVED-LIVE]
- Hosting: the drawer opens over the current page, the URL stays on `www.visitredsea.com` (or `www.amaala.com`). No redirect to a separate identity domain happened up to the first screen. A hidden reCAPTCHA Enterprise frame is loaded on the page. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:49]
- Log in view (visitredsea.com): title "Log in"; "Email *" (type email, required); "Password *" (type password, required) with a "Show password" toggle; "Forgot password?"; CONTINUE; "Don't have an account? Register". Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:49, screenshot 18:50]
- Log in view (amaala.com) adds two lines: "* You can use Red Sea account to log in if you have one." and "By continuing you confirm that you have read & agreed to our Terms and Conditions and Privacy Policy." Those lines were not in the visitredsea.com drawer text I captured. Source: [amaala.com/en](https://www.amaala.com/en) [OBSERVED-LIVE 19:03]
- Register view (visitredsea.com): title "Register"; one field "Email *" (required, autocomplete off); helper text "Use the email from your booking"; CONTINUE; "Already have an account? Log in". No name, phone, password, country-code picker, terms checkbox or marketing checkbox on this first step. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE, screenshot 18:49]
- Password recovery: "Forgot your password? Please enter your email address to restore your password." with "Email *" and CONTINUE. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:50]
- Social sign-in: none. No Google, Apple or other provider button appears in the Log in, Register or Forgot password views. Source: [visitredsea.com/en](https://www.visitredsea.com/en), [amaala.com/en](https://www.amaala.com/en) [OBSERVED-LIVE]
- Password rules shown on screen: none on the Log in view. The Register view has no password field at step 1. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE]
- Arabic drawer: opens on the left (mirrored), labels translated ("تسجيل الدخول", "البريد الإلكتروني *", "كلمة المرور *", "نسيت كلمة المرور؟", "متابعة", "ليس لديك حساب؟ تسجيل حساب جديد"). The password input keeps left-to-right direction. Two control names stay English in the markup ("Close", "Show password"). Source: [visitredsea.com/ar](https://www.visitredsea.com/ar) [OBSERVED-LIVE 19:02]
- "My Trips": the booking FAQ says a guest can request a change or cancellation "through your account in the 'My Trips' section". The app page describes "a dedicated 'My Trips' section". Source: [faqs-booking](https://www.visitredsea.com/en/faqs-booking) [OFFICIAL-DOC, FETCHED-HTML]; [visitredsea-app](https://www.visitredsea.com/en/visitredsea-app) [OFFICIAL-DOC, OBSERVED-LIVE 18:55]
- Loyalty: no loyalty page, tier or enrolment form was found. The only reference is the booking screen banner "Your rewards are secured. Complete your booking and register — exclusive benefits will be ready soon." Source: [booking results](https://www.visitredsea.com/en/booking/accommodation-list?hotelId=1035&resortName=Shebara&startDate=2026-10-20&endDate=2026-10-22&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortIndex=0&searchId=mv5m32rl) [OBSERVED-LIVE 18:54]
- Preference center: /en/preference-center shows only the heading "PREFERENCE CENTER / Personalize your journey" and the newsletter band, with no controls. Source: [preference-center](https://www.visitredsea.com/en/preference-center) [OBSERVED-LIVE 18:58]
- redseaglobal.com: no login, register, account or profile control on any page visited. Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) and pages in the research log [OBSERVED-LIVE]
- Keyboard behaviour: pressing Escape once did not close the account drawer. The Close button did. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:50, single attempt]

### Inferences
- The account is shared across The Red Sea and AMAALA (stated on amaala.com) and the same account concept exists in the app (App Store privacy label lists name, email and phone as data linked to the user).
- The register hint "Use the email from your booking" suggests the web account is designed to attach to an existing reservation, with booking first and registration second. The booking banner ("Complete your booking and register") points the same way.
- A loyalty or benefits scheme is planned but not launched, based on "will be ready soon".
- The empty preference center probably needs a tokenised link from an email. That is a guess.

### Gaps
- Everything after the first Register step: name and phone fields, password rules, email or phone OTP verification, country-code picker, terms and marketing consent. Not verified, requires submitting an email address, which was out of bounds.
- The logged-in area (profile, My Trips, saved guests, payment methods). Not verified, requires an account.
- Which API host and identity service handle authentication. Not verified, requires watching the network on a real login, which was not done.
- Whether visitredsea.com's drawer shows the same terms sentence as amaala.com in some state.

## 7. Classification of every form found

### Takeaway
Fourteen distinct forms or form entry points were found. Reservation, account, newsletter, guest enquiry and residential sales all live on the guest platform. Corporate, vendor and careers flows live on or behind redseaglobal.com. No loyalty enrolment form and no online check-in or guest registration form exist on the web.

### Cited Findings

| # | Site and URL | Form | Type (one of ten) | Visible fields and required markers | Notes | Label, time |
|---|---|---|---|---|---|---|
| F1 | [redseaglobal.com/en/contact-us/](https://www.redseaglobal.com/en/contact-us/) | "Contact us" | corporate inquiry | "I would like to talk about": Enquiry (custom dropdown: Investment, Marketing, Media, Other); Phone Number; Email; First Name; Last Name; "Type your message here"; checkbox "Subscribe to receive our latest updates, exclusive offers, and personalized content delivered straight to you."; Google reCAPTCHA v2 box; Submit. No asterisks on screen. In markup Email, First Name and Last Name carry `required`. | Consent sentence links "Terms and Conditions" and "Privacy Policy" to `/editor.html/content/redsea-rsc/en/testing/contact-us-test.html#` (an authoring-environment path). The checkbox label is marked up as an `<h1>`. | OBSERVED-LIVE 18:47; link targets FETCHED-HTML |
| F2 | redseaglobal.com, every page (seen on [contact-us](https://www.redseaglobal.com/en/contact-us/)) | "News & Updates" | newsletter subscription | First Name; Last Name; E-mail address; Submit. No required markers on screen or in markup. reCAPTCHA present. Sentence: "By submitting this form, you confirm that you have read and agreed to our Terms and Conditions and Privacy Policy." | Arabic: الاسم الأول, اسم العائلة, عنوان البريد الإلكتروني, إرسال | OBSERVED-LIVE 18:46 to 18:48 |
| F3 | [redseaglobal.com/en/vendor-registration/](https://www.redseaglobal.com/en/vendor-registration/) | "Register Your Interest" | supplier or vendor registration | Company Information: Company Name, Country of Registration, Registration Number, "HQ Office Location (Optional)", Business Address, Website URL, "Turnover in last calendar year (SAR)". Point of Contact: Key Contact Person, Position, Email, Phone Number, Mobile Number. Entity Type (Government, Private, Public, PIF Related Party, Individual). Vendor Business Type (Contractor, Consultant, Supplier, FFE&OSE, Sole Trader/Freelance). Scope of Services ("Add Scope of Services" opens about 100 checkboxes). Local Content: RHQ in KSA yes/no, LCGPA certificate yes/no. Documents: "Company Profile (Optional)", "Other Document (Optional, maximum 1)" (.jpeg, .jpg, .pdf, .png, 5 MB). Statement of Declaration checkbox. Submit. Optional fields are marked "(Optional)". In markup all others except Website URL carry `required`. | Consent links "Terms and Conditions" and "Privacy Policy" both point to `https://www.google.com/`. | OBSERVED-LIVE 18:47; requirement flags FETCHED-HTML |
| F4 | [redseaglobal.com/en/careers/](https://www.redseaglobal.com/en/careers/) | "View opportunities" link | careers | No form on redseaglobal.com. Opens `https://careers.theredsea.sa/go/Job-Opportunities/7716923/` in a new tab. | External careers site not inspected. | OBSERVED-LIVE 18:48 |
| F5 | [redseaglobal.com/en/privacy-center/](https://www.redseaglobal.com/en/privacy-center/) | OneTrust web form in an iframe (`rsg-privacy.my.onetrust.com/webform/...`) | corporate inquiry (closest fit: it is a privacy request form, outside the ten types) | Fields not read (cross-origin frame). | Linked from all three sites' "Privacy Center". | OBSERVED-LIVE 19:12 |
| F6 | [visitredsea.com/en](https://www.visitredsea.com/en), "Account" drawer | Log in, Register (step 1), Forgot password | customer account creation (and sign-in) | Log in: Email *, Password *. Register: Email * with hint "Use the email from your booking". Forgot: Email *. | Details in section 6. Same drawer on amaala.com with extra terms sentence. | OBSERVED-LIVE 18:49 to 18:50, 19:03 |
| F7 | [visitredsea.com/en/contact-us](https://www.visitredsea.com/en/contact-us) and footer CONTACT US modal on every page | "Let us know how can we assist you" | booking inquiry (general guest enquiry; ambiguous because it also routes Press and Partnership topics) | First Name *; Last Name *; Email *; Phone * with country flag and dial-code picker (default +966); "Select your enquiry *" (Booking and reservations, Experiences, Transportations, Guest Service, Events, "Partnership and sponorship", Press, General Enquiry, Feedback & Complaints); "Additional Comments (Optional)"; unchecked checkbox "Subscribe to receive our latest updates, exclusive offers, and personalized content delivered straight to you."; SUBMIT (disabled until complete). | Sentence: "By submitting this form, you confirm that you have read and agreed to our Terms and Conditions and Privacy Policy." Side panel shows info@visitredsea.com and +966 11 222 2222. | OBSERVED-LIVE 18:55 and 18:59, screenshot 18:59 |
| F8 | visitredsea.com and amaala.com, every page | "Stay Connected" SIGN UP (expands inline) | newsletter subscription | First Name; Surname; E-mail; SIGN UP. No asterisks. No separate consent checkbox. | Same terms sentence as F7. | OBSERVED-LIVE 18:59 |
| F9 | [visitredsea.com experience pages](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving) | "REQUEST A QUOTE" three-step modal | booking inquiry | Step 1: three required multi-select questions (5, 5 and 4 options). Options were blank on screen. Steps 2 and 3 not seen. | See section 5. | OBSERVED-LIVE 18:57 |
| F10 | [visitredsea.com/en/residential](https://www.visitredsea.com/en/residential) | "ENQUIRE ABOUT OWNERSHIP" | residential sales inquiry | An unlabeled dropdown before First Name (probably a title selector, not opened); First Name *; Last Name *; Email *; dial-code picker and "Phone number *"; Select Property Type; Bedrooms; Message; preferred contact method checkboxes (Email, Phone call, WhatsApp); marketing checkbox; SUBMIT. | "Terms and Conditions" links to `/en/terms-and-conditions.html` and "Privacy Policy" to `/en/private-policy.html`. Both URLs returned 404 on a same-origin fetch. redseaglobal.com "Register Interest" sends people here in a new tab. | OBSERVED-LIVE 18:58; 404s FETCHED-HTML 19:10 |
| F11 | [amaala.com/en/residences](https://www.amaala.com/en/residences) | "ENQUIRE ABOUT OWNERSHIP" | residential sales inquiry | Same field set as F10. | "Terms and Conditions" links to `https://amaala.uat.webconnectorprojects.com/en/terms-and-conditions`. | OBSERVED-LIVE 19:06 |
| F12 | visitredsea.com and amaala.com BOOK widget and `/en/booking/accommodation-list` | Stay, experience and transport search leading to a five-step booking | actual reservation | Search step: resort, guests, dates, nights (stay); activity, resort, date (experience); from, to, date, guests (transport). Later steps not viewed. | See section 4. | OBSERVED-LIVE 18:51 to 18:54, 19:05 |
| F13 | [amaala.com/en/resorts](https://www.amaala.com/en/resorts) Jayasom card | External booking link | actual reservation (external, jayasom.com) | Not inspected. | New tab. | OBSERVED-LIVE 19:04 |
| F14 | [visitredsea.com/en/marketing-campaign-form](https://www.visitredsea.com/en/marketing-campaign-form) | "Marketing Campaign Form" | newsletter subscription (marketing lead capture; placeholder content) | Title, First Name *, Last Name *, Email *, phone with dial code, "Where are you From?", "Select a destination", "Country of Residence", "Gender *", "Marital Status *", a second phone field, "Enter your birth date", "Checkbox 1 label", "Checkbox 2label", "Marketing terms message example", SUBMIT. | Listed in the public sitemap. Labels are template placeholders. | OBSERVED-LIVE 19:10 |

- Outside the ten types: "Track My Luggage" (Bag Tags or PNR lookup) at [booking/track-my-luggage](https://www.visitredsea.com/en/booking/track-my-luggage) is a status lookup, not any of the ten form types. [OBSERVED-LIVE 18:58]
- Not found on any site: loyalty enrollment form; guest registration or online check-in form. Source: pages in the research log [OBSERVED-LIVE]

### Inferences
- Forms F7, F8, F10, F11 and F14 use the same field naming (`customer.firstName`, `customer.email`, `marketingOpt`), which suggests one form service and probably one CRM behind the guest platform.
- Marketing consent is handled inconsistently: opt-in checkbox on enquiry forms, no checkbox on the newsletter form, and "agreed by submitting" wording throughout.

### Gaps
- amaala.com footer "Contact Us" modal was not opened. Not verified, requires one click on amaala.com.
- Travel Trade toolkit pages (/en/theredsea-travel-trade-toolkit, /en/amaala-travel-trade-toolkit) were not opened, so any trade registration form is unrecorded.
- /en/contact-us-mobile exists (HTTP 200) and was not opened.
- Arabic versions of F7, F9, F10 were not opened.
- Success and error states of all forms are unobserved by design.

## 8. What customer support channels are shown?

### Takeaway
Guest support on the web is one phone number, one email per brand, a contact form and a live chat widget. No WhatsApp link and no published opening hours appear on the websites. "24/7" is claimed only for the app.

### Cited Findings
- Phone +966 11 222 2222 (tel link) and email info@visitredsea.com in the footer and on the contact page. amaala.com shows the same phone and info@amaala.com. Source: [visitredsea.com/en/contact-us](https://www.visitredsea.com/en/contact-us) [18:55]; [amaala.com/en](https://www.amaala.com/en) [19:02] [OBSERVED-LIVE]
- Live chat: a floating "Livechat launcher icon" frame loads on visitredsea.com and amaala.com from `/chat/widgetloader.html?lang=en`, with a companion frame on `attachuk.imi.chat`. The site itself points to chat in three places: "START CHAT" under "Contact a personal assistant", "chat with us" in the date picker for stays under 24 hours, and the FAQ for same-day and multi-resort bookings. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [18:49], [experiences/water-sports](https://www.visitredsea.com/en/experiences/water-sports) [18:56], [resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [18:54], [amaala.com/en](https://www.amaala.com/en) [19:03] [OBSERVED-LIVE]; [faqs-booking](https://www.visitredsea.com/en/faqs-booking) [OFFICIAL-DOC]
- The chat was not opened, so whether the first responder is a bot or a person is unknown. The FAQ calls it "live assistant chat". Chat assets include calendar icons and a post-chat survey script. Source: [faqs-booking](https://www.visitredsea.com/en/faqs-booking); network log on [scuba-diving](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving) [FETCHED-HTML 18:57]
- WhatsApp: no wa.me or WhatsApp link on any page visited. WhatsApp appears only as a "preferred contact method" checkbox on the residential enquiry forms. Source: [residential](https://www.visitredsea.com/en/residential), [amaala residences](https://www.amaala.com/en/residences) [OBSERVED-LIVE]
- Hours and languages: none published on the web pages visited. The app page promises "24/7 concierge service". The Google Play "What's new" text lists "24/7 Guest Support – Round-the-clock chat and call support" and "Arabic chat" enhancements. Source: [visitredsea-app](https://www.visitredsea.com/en/visitredsea-app) [OFFICIAL-DOC 18:55]; [Google Play listing](https://play.google.com/store/apps/details?id=com.redseaglobal.mobile&hl=en&gl=US) [OFFICIAL-DOC 19:11]
- redseaglobal.com: contact form only (F1). No phone, email, chat or WhatsApp element was found on the home or contact page. Source: [redseaglobal.com/en/contact-us/](https://www.redseaglobal.com/en/contact-us/) [OBSERVED-LIVE 18:47]

### Inferences
- The chat widget file names (`imichat*.js`, `imi.chat`) match the Webex Connect (formerly imimobile) live chat product. Vendor identity is my reading of file names, not a statement on the site.
- Chat is a structural part of the booking design, since three booking scenarios are routed to it.

### Gaps
- Chat behaviour, pre-chat form fields, bot versus agent, languages and hours. Not verified, requires opening the chat, which was out of bounds.
- Whether the phone line is staffed 24/7 for web guests.

## 9. Is there an official mobile app?

### Takeaway
Yes: "Visit Red Sea", published by Red Sea Global, linked from the visitredsea.com footer and app page. The app was not installed or tested. Everything below is from the store listings and the official app page.

### Cited Findings
- Official links: footer badges and the /en/visitredsea-app page link to `https://apps.apple.com/us/app/visit-red-sea/id6714457903` and `https://play.google.com/store/apps/details?id=com.redseaglobal.mobile`, plus a smart link `https://onelink.to/visitredsea`. amaala.com has no app links in its footer. Source: [visitredsea-app](https://www.visitredsea.com/en/visitredsea-app) [OBSERVED-LIVE 18:55]; [amaala.com/en](https://www.amaala.com/en) [19:02]
- App Store: name "Visit Red Sea", subtitle "Plan & Book Your Red Sea Trip", developer Red Sea Global, seller RED SEA GLOBAL COMPANY, category Travel, free, version 1.6.1 dated "Oct 2" (year not printed; copyright line is "© 2026 Visit Red Sea"), size 268.9 MB, requires iOS 16.4 or later, 5.0 from 2 ratings, age 4+, languages English, Arabic, Dutch, French, Italian, Russian, Simplified Chinese. Version history shown runs from 1.0 (Jan 12) to 1.6.1 (Oct 2). Source: [App Store listing](https://apps.apple.com/us/app/visit-red-sea/id6714457903) [OFFICIAL-DOC, FETCHED-HTML via fetch tool, accessed 12 Oct 2026]
- App Store "What's New" for 1.6.1 mentions the Payment screen, map fixes, Arabic text highlighting and "Make the multi booking steps mobility arrival time and departure time optional." Source: [App Store listing](https://apps.apple.com/us/app/visit-red-sea/id6714457903) [OFFICIAL-DOC]
- App Store privacy label: data linked to the user includes Contact Info (email address, name, phone number) and Usage Data, used for third-party advertising, marketing, analytics, personalisation and app functionality. "Data used to track you": Contact Info, Usage Data. Source: [App Store listing](https://apps.apple.com/us/app/visit-red-sea/id6714457903) [OFFICIAL-DOC]
- Google Play: "Visit Red Sea", developer "Red Sea Global Company", 1K+ downloads, "Updated on Sep 21, 2026", category Travel & Local, rated Everyone. Version number is not shown on the web listing. Data safety summary: may share "Personal info, Financial info and 3 others", may collect "Personal info, Financial info and 2 others", encrypted in transit, deletion can be requested. Source: [Google Play listing](https://play.google.com/store/apps/details?id=com.redseaglobal.mobile&hl=en&gl=US) [OFFICIAL-DOC, OBSERVED-LIVE 19:11]
- Stated features (Google Play description): explore and book resorts and experiences, offers and packages, transportation "by yacht, seaplane, or luxury car", interactive maps, search, travel information, "24/7 chat and call support". "What's new" adds "Smart Country Codes – Automatic detection based on your network" and a "360° tour experience". Source: [Google Play listing](https://play.google.com/store/apps/details?id=com.redseaglobal.mobile&hl=en&gl=US) [OFFICIAL-DOC]
- Stated features (official app page): covers "The Red Sea and AMAALA", booking of resorts and experiences, tailored offers and events, a "My Trips" section, flights, activities and dining reservations, "24/7 concierge service", and an interactive map. Source: [visitredsea-app](https://www.visitredsea.com/en/visitredsea-app) [OFFICIAL-DOC 18:55]
- The same Google Play publisher lists three other apps: "Red Sea Health", "RSG Super App", "Jewar | جوار". Source: [Google Play listing](https://play.google.com/store/apps/details?id=com.redseaglobal.mobile&hl=en&gl=US) [OBSERVED-LIVE 19:11]
- The booking FAQ says Apple Pay is "available only on Mac devices using Safari and in the iOS app". Source: [faqs-booking](https://www.visitredsea.com/en/faqs-booking) [OFFICIAL-DOC, FETCHED-HTML]

### Inferences
- "Smart Country Codes" in the app implies a phone number field with a dial-code picker in the app's sign-up or booking, consistent with the App Store label listing phone number as linked data.
- The app is ahead of the web on features described officially (My Trips, dining reservations, concierge), and its install base on Android is small (1K+).

### Gaps
- The app itself was not tested. Sign-up fields, verification, loyalty and My Trips in the app are unverified.
- Android version number. Not verified, requires opening the "About this app" dialog on Google Play or a device.
- The year of App Store version dates is not printed on the listing.
- `onelink.to/visitredsea` returned HTTP 405 to a HEAD request and was not followed.

## 10. What language and currency switching exists, and does a language switch keep you on the same page?

### Takeaway
Two languages (English, Arabic) on all three sites, six display currencies on the guest platform, and the switch keeps the visitor on the same page on redseaglobal.com and visitredsea.com.

### Cited Findings
- visitredsea.com: the "English / SAR" header button opens a "Settings" modal with a Language dropdown (عربى, English), a Currency dropdown (CNY, EUR, GBP, RUB, SAR, USD) and CANCEL / SAVE. Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE 19:00]
- Choosing عربى and SAVE on /en/resorts/shebara navigated to /ar/resorts/shebara (same page, `lang="ar"`, `dir="rtl"`, Arabic title). hreflang alternates en, ar and x-default (English) are present. Source: [visitredsea.com/ar/resorts/shebara](https://www.visitredsea.com/ar/resorts/shebara) [OBSERVED-LIVE 19:01]
- redseaglobal.com: header language menu (English, عربي). On a deep page the Arabic link points to the same path under /ar/ (for example `/ar/portfolio/projects/red-sea-residences/`). No hreflang link tags on that page. No currency control. Source: [redseaglobal.com/en/portfolio/projects/red-sea-residences/](https://www.redseaglobal.com/en/portfolio/projects/red-sea-residences/) [OBSERVED-LIVE 18:48]
- amaala.com: same "English / SAR" control. hreflang en, ar, x-default present on the homepage. Source: [amaala.com/en](https://www.amaala.com/en) [OBSERVED-LIVE 19:02]
- The Plan Your Trip page states "One US dollar is equal to 3.75 SAR." Resort policy text states that rates are in SAR. Source: [plan-your-trip/the-airport-and-flights](https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights), [resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE]

### Inferences
- The App Store lists seven app languages while the web offers two, so the app is the wider-language channel.

### Gaps
- Currency switching was not applied, so I did not see whether booking prices convert, which rate is used or whether payment stays in SAR. Not verified, requires changing currency and re-running a search.
- Whether the language choice persists across sessions, and whether the language switch inside the booking flow preserves the search.
- amaala.com language switch on a deep page was not executed (only the control and hreflang were seen).

## 11. What differences exist between the English and Arabic versions?

### Takeaway
Arabic is a full right-to-left mirror with translated navigation, content and account screens on all three sites. Differences are small and mostly link or label level.

### Cited Findings
- redseaglobal.com footer "AMAALA": English links to `https://www.visitredsea.com/en/destinations/amaala`; Arabic links to the corporate page `https://redseaglobal.com/ar/portfolio/amaala/`. Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) versus [redseaglobal.com/ar/](https://www.redseaglobal.com/ar/) [OBSERVED-LIVE 18:46, 18:48]
- redseaglobal.com Arabic footer "مركز الخصوصية" (text link) points to the English page `/en/privacy-center/`. visitredsea.com Arabic footer "مركز الخصوصية" also points to `https://www.redseaglobal.com/en/privacy-center/`. Source: [redseaglobal.com/ar/](https://www.redseaglobal.com/ar/), [visitredsea.com/ar/resorts/shebara](https://www.visitredsea.com/ar/resorts/shebara) [OBSERVED-LIVE]
- redseaglobal.com Arabic homepage shows the social media feed posts in English, and the screen-reader text "opens in a new tab" is not translated. Source: [redseaglobal.com/ar/](https://www.redseaglobal.com/ar/) [OBSERVED-LIVE 18:48]
- visitredsea.com label differences: PROMOTIONS becomes "عروض حصرية" (exclusive offers), "Account" becomes "حسابي" (my account), room "BOOK" becomes "احجز الآن" (book now), currency shows as "ريال سعودي" instead of "SAR". The phone number is grouped differently ("+966 11222 2222"). Source: [visitredsea.com/ar](https://www.visitredsea.com/ar), [visitredsea.com/ar/resorts/shebara](https://www.visitredsea.com/ar/resorts/shebara) [OBSERVED-LIVE 19:01]
- visitredsea.com Arabic homepage is almost entirely Arabic. Remaining Latin strings: "Surf Lagoon", "The Red Sea", "Visit Red Sea". Homepage structure and section order match English. Source: [visitredsea.com/ar](https://www.visitredsea.com/ar) [OBSERVED-LIVE 19:01]
- Account drawer in Arabic is mirrored and translated, with English-only accessible names on Close and Show password. Source: [visitredsea.com/ar](https://www.visitredsea.com/ar) [OBSERVED-LIVE 19:02]
- amaala.com Arabic keeps "Six Senses" in Latin script inside an Arabic card title and keeps the footer logo alt text "Visit Red Sea". I did not find a "Contact Us" button in the Arabic footer link list, where English has one. Source: [amaala.com/ar](https://www.amaala.com/ar) [OBSERVED-LIVE 19:05, DOM list]
- Sitemaps for visitredsea.com and amaala.com declare an Arabic alternate for every English URL. The redseaglobal.com sitemap found is English only (`/en.sitemap.xml`). Source: [visitredsea sitemap](https://www.visitredsea.com/sitemap.xml), [RSG sitemap](https://www.redseaglobal.com/en.sitemap.xml) [FETCHED-HTML]

### Inferences
- Content parity is high. The gaps are shared assets that were never localised (privacy centre, social feed, accessible names).

### Gaps
- Arabic forms (contact, residential, vendor registration), Arabic booking results, Arabic offers and Arabic resort listing were not opened, so field-level and content-level parity there is unverified.
- The missing Arabic "Contact Us" footer button on amaala.com is a DOM-list observation and should be re-checked on screen.
- No Arabic sitemap for redseaglobal.com was looked for (`/ar.sitemap.xml` not tested).

## 12. On a mobile viewport (375x812), what changes?

### Takeaway
All three sites reflow without horizontal page overflow. Navigation collapses into a burger, the account entry moves inside the burger, the booking widget becomes a full-screen overlay, and there is no persistent booking bar: the header with BOOK hides on scroll down and returns on scroll up. The floating chat button overlaps body text.

### Cited Findings
- Emulation: 375x812, Android Chrome user agent, visitredsea.com/en reloaded. Document width equals viewport width (no horizontal page scroll). Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 19:07]
- Collapsed header: temperature, "English / SAR", burger (22x40 px hit area), logo, BOOK (85x40). Account and Map are not in the collapsed header. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 19:07]
- In the accessibility tree at mobile width the language and currency button has no name (it has the name "Open language settings" on desktop). Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 19:08, read_page]
- Burger menu items are 24 px tall text rows (menu links) and 18 px rows (Map, "English / SAR"). "Log In or Sign Up" is a large 343x88 block at the top. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 19:07]
- Booking widget on mobile: full-screen overlay with Close, three tabs, stacked fields and SEARCH (109x48). Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 19:08]
- Scroll behaviour on a resort page: the page scrolls inside a container (`#main-scroll-view`), the header gets hidden when scrolling down and reappears on scrolling up. No sticky bottom bar or sticky BOOK button exists. Fixed elements found: the chat launcher (70x70, bottom right) and an empty toast region. Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE 19:08 to 19:09]
- The chat launcher covers part of the body text on the resort page (screenshot at the top of the Shebara page: the bubble sits over the words in the intro paragraph; again over a text card further down). Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE, screenshots 19:09]
- In the first mobile screenshot of the Shebara page the hero area was dark with no image visible while the title, rating stars and header had rendered. Source: [visitredsea.com/en/resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [OBSERVED-LIVE, screenshot 19:09, about 14 s after navigation]
- amaala.com mobile header: burger (26x40), logo, Book (76x40). No horizontal overflow. Source: [amaala.com/en](https://www.amaala.com/en) [OBSERVED-LIVE 19:09]
- redseaglobal.com mobile header: burger, logo, an unnamed search button. No horizontal overflow. Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [OBSERVED-LIVE 19:09]

### Inferences
- On mobile a visitor who has scrolled into a long resort page has no visible booking control until they scroll up, since the room cards' BOOK links are the only in-page route.
- The dark hero may be a slow-loading video or image. One capture is not enough to call it broken.

### Gaps
- Mobile Arabic layouts, the mobile account drawer, mobile forms and the mobile booking results page were not inspected.
- Real-device behaviour (touch, iOS Safari, app-install banners) was not tested. This was desktop Chromium emulation.
- amaala.com and redseaglobal.com burger menus were not opened on mobile.

## 13. What loading, empty, error or unavailable states were seen, and what accessibility features or barriers were noticed?

### Takeaway
Several production defects are reproducible: staging (UAT) links and authoring-environment links in live pages, placeholder legal links, a filter with one option, a quote form with blank options, an expired offer still promoted, and test pages in public sitemaps. On accessibility there is real content effort (alt text, per-resort accessibility information) alongside structural barriers (unnamed icon links, no skip link, no main landmark, autoplay hero video without controls, no accessibility statement). No formal compliance claim is made here.

### Cited Findings

**States observed**
- 404 pages: visitredsea.com shows "PAGE NOT FOUND / 404 / Sorry, we could not find this page... / GO BACK HOME" with the full header and an empty `<title>`. redseaglobal.com shows a branded page titled "404" with full navigation for unknown /en/ paths, and a bare server "404 Not Found" page for /sitemap.xml. Source: [visitredsea 404 test URL](https://www.visitredsea.com/en/this-page-does-not-exist-xyz), [RSG 404 test URL](https://www.redseaglobal.com/en/this-page-does-not-exist-xyz/), [RSG /sitemap.xml](https://www.redseaglobal.com/sitemap.xml) [OBSERVED-LIVE 19:06]
- Bot protection: curl with a desktop browser user agent received a Cloudflare "Just a moment..." HTTP 403 challenge for redseaglobal.com/sitemap.xml and amaala.com/sitemap.xml, while robots.txt on all three and the visitredsea sitemap were served. Source: [redseaglobal.com/sitemap.xml](https://www.redseaglobal.com/sitemap.xml), [amaala.com/sitemap.xml](https://www.amaala.com/sitemap.xml) [FETCHED-HTML 18:45]
- Disabled states: booking SEARCH disabled until dates are picked; contact SUBMIT disabled until the form is complete; past dates and today disabled in the calendar. Source: [resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [18:54], contact modal [18:59] [OBSERVED-LIVE]
- Unavailable states: "Opening Soon" on two AMAALA resorts; "Surf Lagoon is temporarily closed."; resorts with no BOOK control and no explanation (Raffles, Grand Hyatt; InterContinental has no BOOK on its listing card but is in the widget list). Source: [amaala.com/en](https://www.amaala.com/en), [visitredsea.com/en](https://www.visitredsea.com/en), [visitredsea.com/en/resorts](https://www.visitredsea.com/en/resorts) [OBSERVED-LIVE]
- Empty states: preference center with no controls; resorts filter with one option; Request a quote with blank option chips. Source: [preference-center](https://www.visitredsea.com/en/preference-center), [resorts](https://www.visitredsea.com/en/resorts), [scuba-diving](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving) [OBSERVED-LIVE]
- Stale content: Multi-Resort Escape Offer valid to 20 Sep 2026 still promoted on 12 Oct 2026. Source: [multi-resort-escape-offer](https://www.visitredsea.com/en/offers-and-packages/multi-resort-escape-offer) [OBSERVED-LIVE 18:57]
- Console: repeated Content Security Policy errors ("Loading media from 'about:blank' violates... media-src") and one HTTP 401 on the live chat settings call followed by a 200 on retry. Source: [scuba-diving](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving) [OBSERVED-LIVE console 18:57]
- A "Processing action... This process may take a few seconds, do not close the screen." overlay exists in the markup. It was never displayed during my session, so it is not evidence of a state. Source: [faqs-booking](https://www.visitredsea.com/en/faqs-booking) [FETCHED-HTML]

**Environment and link defects**
- amaala.com links to a UAT host from production: "EXPLORE ALL EXPERIENCES" on the Six Senses page goes to `https://amaala.uat.webconnectorprojects.com/en/experiences/water-sports/above-water`, and the residences form's "Terms and Conditions" goes to `https://amaala.uat.webconnectorprojects.com/en/terms-and-conditions`. Both URLs answered HTTP 200 to a HEAD request without authentication. Source: [six-senses-amaala](https://www.amaala.com/en/resorts/six-senses-amaala) [19:04], [residences](https://www.amaala.com/en/residences) [19:06] [OBSERVED-LIVE]; status check [FETCHED-HTML 19:12]
- redseaglobal.com contact form legal links point to `/editor.html/content/redsea-rsc/en/testing/contact-us-test.html#`. Vendor form legal links point to `https://www.google.com/`. Source: [contact-us](https://www.redseaglobal.com/en/contact-us/), [vendor-registration](https://www.redseaglobal.com/en/vendor-registration/) [FETCHED-HTML / OBSERVED-LIVE 18:47]
- visitredsea.com: `/en/privacy-policy` redirects to the misspelled `/en/private-policy`; the residential form links to `/en/terms-and-conditions.html` and `/en/private-policy.html`, both 404. Source: [residential](https://www.visitredsea.com/en/residential) [OBSERVED-LIVE 18:58]; fetch results [FETCHED-HTML 19:10]
- Test and placeholder pages reachable or listed publicly: `/en/marketing-campaign-form` (live, placeholder labels), 66 `/en/testing/` URLs in the redseaglobal.com sitemap, four `*-test` pages in the amaala.com sitemap. I did not open the test URLs themselves. Source: [marketing-campaign-form](https://www.visitredsea.com/en/marketing-campaign-form) [OBSERVED-LIVE 19:10]; [RSG sitemap](https://www.redseaglobal.com/en.sitemap.xml), [amaala sitemap](https://www.amaala.com/sitemap.xml) [OBSERVED-LIVE 19:06 to 19:07]
- Typos in live UI text: "Partnership and sponorship" (enquiry option), "Seemlesly Connected" (app page), "Up to to 5 attendees" (experience cards), "payment method %100 upon confirmation" (offer terms). Source: [contact modal](https://www.visitredsea.com/en/preference-center) [18:59], [visitredsea-app](https://www.visitredsea.com/en/visitredsea-app) [18:55], [water-sports](https://www.visitredsea.com/en/experiences/water-sports) [18:56], [multi-resort offer](https://www.visitredsea.com/en/offers-and-packages/multi-resort-escape-offer) [18:57] [OBSERVED-LIVE]

**Cookie consent and tracking**
- visitredsea.com and amaala.com load OneTrust (`cdn.cookielaw.org`) and set Google consent defaults to "denied" for all storage types in an inline script. With consent recorded as necessary-only, the only script hosts on the visitredsea homepage were the site itself and cdn.cookielaw.org. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 18:49]
- redseaglobal.com homepage, on my first load in this shared profile, showed no cookie banner in the screenshot and had script tags from analytics.tiktok.com, tr.snapchat.com, snap.licdn.com, static.ads-twitter.com, connect.facebook.net, googleads.g.doubleclick.net and googletagmanager.com, plus an empty `#ot-sdk-cookie-policy` element. I cannot tell whether an earlier session in the shared profile had already answered a banner. Source: [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [OBSERVED-LIVE 18:46]

**Accessibility observations (not a compliance assessment)**
- Alt text: visitredsea.com homepage, 52 images, all with non-empty alt (some generic, such as "logo card", "vrs turtle logo"). Shebara page, 52 images, 14 with empty alt. redseaglobal.com homepage, 137 images, 12 with no alt attribute and 37 with empty alt. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [19:11], [resorts/shebara](https://www.visitredsea.com/en/resorts/shebara) [18:53], [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [18:46] [FETCHED-HTML, DOM counts]
- Landmarks and headings: redseaglobal.com has no `<header>`, `<main>` or `<footer>` elements (only `<nav>` for the language menu). visitredsea.com has header, footer and three nav elements but no `<main>`, and two `<h1>` on the homepage. The redseaglobal.com vendor page has 18 `<h1>` elements and the contact form uses an `<h1>` for a checkbox label. Source: same pages [FETCHED-HTML]
- Keyboard: on visitredsea.com the first Tab stop is "English / SAR". There is no skip link. For the first and fourth focus stops (language button, Account) the computed style in the focused state was `outline-style: none` and `box-shadow: none`. A focus indicator drawn another way (for example a border change) is possible and was not ruled out visually. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE 19:11]
- Unnamed controls: amaala.com account and map icon links (desktop), visitredsea.com language button (mobile), redseaglobal.com search button (mobile) have no accessible name. The Request a quote checkboxes have no label text. Source: [amaala.com/en](https://www.amaala.com/en) [19:03 read_page], [visitredsea.com/en](https://www.visitredsea.com/en) [19:08 read_page], [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [19:09], [scuba-diving](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving) [18:57]
- Named controls done well: carousels expose "Carousel previous item button" / "Carousel next item button", calendar days expose "Choose Tuesday October 20 of 2026", the nights counter exposes "Decrease nights", external links on redseaglobal.com carry "opens in a new tab". One leaked key: a video button named "wcag.playerButtons.fullscreen" on amaala.com. Source: [resorts/shebara](https://www.visitredsea.com/en/resorts/shebara), [redseaglobal.com/en/](https://www.redseaglobal.com/en/), [amaala residences](https://www.amaala.com/en/residences) [OBSERVED-LIVE]
- Motion: the visitredsea.com hero video is `autoplay`, `muted`, `loop` with no native controls. I did not find a pause control. redseaglobal.com's hero has a small pause-style button at the right edge in the screenshot. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [FETCHED-HTML 19:11]; [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [screenshot 18:46]
- Contrast: white navigation text sits directly on hero photography and video (visitredsea.com and redseaglobal.com), and placeholder labels in the account drawer are light grey on white in the screenshot. No contrast ratios were measured. Source: [visitredsea.com/en](https://www.visitredsea.com/en) [screenshots 18:49, 18:50]
- Accessibility statement: none linked in any header or footer on the three sites. `/en/accessibility` on visitredsea.com returns 404. Physical accessibility information is published per resort (section 3). Source: [visitredsea.com/en](https://www.visitredsea.com/en), [amaala.com/en](https://www.amaala.com/en), [redseaglobal.com/en/](https://www.redseaglobal.com/en/) [OBSERVED-LIVE]; 404 [FETCHED-HTML 19:10]
- Dialog behaviour: the Request a quote container has `role="dialog"` without an accessible name or `aria-modal`. The Settings modal closed on Escape. The account drawer did not on one attempt. Focus was placed in the First Name field when the contact modal opened. Source: [scuba-diving](https://www.visitredsea.com/en/experiences/water-sports/scuba-diving), [resorts/shebara](https://www.visitredsea.com/en/resorts/shebara), [visitredsea.com/en](https://www.visitredsea.com/en) [OBSERVED-LIVE]

### Inferences
- Release hygiene between the content authoring, UAT and production environments is weak on both platforms: the same class of defect (environment-specific URLs in published content) appears on redseaglobal.com and amaala.com.
- A publicly reachable UAT site for the guest platform is a security and brand exposure worth flagging to RSG, separate from UX.
- Accessibility has been considered at component level (named carousel and calendar controls) but not at page-template level (landmarks, skip link, focus styling).

### Gaps
- No screen reader, no automated audit tool and no contrast measurement was used. Findings are spot checks.
- The UAT site was only status-checked, not browsed.
- The cookie banner's wording, button labels and reject path on all three sites. Not verified, requires a clean browser profile.
- Whether marketing tags on redseaglobal.com fire before consent. Not verified, requires a clean profile and network capture.
- Page load performance was not measured and no claim is made about it.

## Research log

| # | Time (UTC, 12 Oct 2026) | Action | Tool | Result |
|---|---|---|---|---|
| 1 | 18:45 | Fetched robots.txt for the three sites | curl | 200 for all three |
| 2 | 18:45 | Fetched sitemap.xml for the three sites | curl | visitredsea 200 (199 URLs); redseaglobal and amaala 403 Cloudflare challenge |
| 3 | 18:46 | redseaglobal.com/en/ home: nav, footer, forms, scripts, screenshot | browser | Mega menu and newsletter form recorded |
| 4 | 18:47 | redseaglobal.com contact-us, vendor-registration | browser | Forms F1, F3 recorded; bad legal links found |
| 5 | 18:48 | redseaglobal.com careers, red-sea-residences, /ar/ | browser | Outbound links, Arabic nav recorded |
| 6 | 18:49 | visitredsea.com/en home: header, footer, consent cookies, screenshot | browser | Account and BOOK controls found; consent already set |
| 7 | 18:49 to 18:50 | Account drawer: Log in, Register, Forgot password | browser | Fields recorded, nothing submitted |
| 8 | 18:51 to 18:52 | BOOK widget: three tabs, resort list, transport locations | browser | Recorded |
| 9 | 18:52 to 18:53 | /en/resorts listing, load more, filter | browser | 13 resorts; filter has one option |
| 10 | 18:53 to 18:54 | /en/resorts/shebara: sections, room BOOK, calendar, search | browser | First booking screen URL captured |
| 11 | 18:55 | /en/contact-us, /en/visitredsea-app | browser | Form F7 and app links recorded |
| 12 | 18:55 | App Store listing | fetch tool | Listing details captured |
| 13 | 18:55 | Google Play listing | fetch tool | Failed (content truncated); redone in browser at 19:11 |
| 14 | 18:56 to 18:57 | Experiences pages, BOOK NOW, REQUEST A QUOTE, console and network | browser | Blank quote options found; chat stack identified |
| 15 | 18:57 to 18:58 | Offers listing, multi-resort offer, Plan Your Trip | browser | Expired offer found |
| 16 | 18:58 | /en/residential, track-my-luggage, preference-center | browser | Forms F10, lookup tool, empty preference center |
| 17 | 18:59 | Newsletter sign-up, footer CONTACT US modal, enquiry options, screenshot | browser | F7, F8 confirmed |
| 18 | 19:00 to 19:01 | Settings modal, language and currency options, switch to Arabic | browser | Same-page switch confirmed |
| 19 | 19:01 to 19:02 | visitredsea.com/ar home and Arabic account drawer | browser | Recorded |
| 20 | 19:02 to 19:05 | amaala.com/en home, account drawer, resorts, Six Senses page, booking search | browser | Shared account note, UAT link, booking URL captured |
| 21 | 19:05 to 19:06 | amaala.com/ar, /en/residences, sitemap.xml | browser | Form F11, UAT terms link, sitemap anomalies |
| 22 | 19:06 to 19:07 | redseaglobal sitemap probing, 404 pages, visitredsea /en/destinations/amaala | browser | /en.sitemap.xml found; redirect to amaala.com confirmed |
| 23 | 19:07 to 19:09 | Mobile 375x812: visitredsea home, burger, widget, resort page scroll, amaala, redseaglobal | browser | Recorded; viewport reset to desktop at 19:10 |
| 24 | 19:10 to 19:11 | faqs-booking, URL probes, marketing-campaign-form, map, keyboard focus test | browser | Recorded |
| 25 | 19:11 | Google Play listing | browser | Publisher, update date, description captured |
| 26 | 19:12 to 19:13 | redseaglobal privacy-center, portfolio handoffs, visitredsea Raffles page | browser | Recorded |
| 27 | 19:12 | Status check of outbound links (UAT host, jayasom, thuwal, careers, rsiairport, onelink) | curl HEAD | All 200 except onelink.to (405) |
| 28 | 19:13 | Closed research tab | browser | Done |

## Source register

| Source ID | Title | Publisher | URL | Publication/update date | Access date | Claims supported | Limitations |
|---|---|---|---|---|---|---|---|
| S1 | Red Sea Global - Official site (EN home) | Red Sea Global | https://www.redseaglobal.com/en/ | Not stated; footer © 2026 | 12 Oct 2026 | Corporate nav, footer, newsletter form, scripts, alt counts | Shared browser profile; mega menu partly read from DOM |
| S2 | Red Sea Global Arabic home | Red Sea Global | https://www.redseaglobal.com/ar/ | Not stated | 12 Oct 2026 | Arabic nav and footer, EN/AR differences | Panels not expanded on screen |
| S3 | Contact Us | Red Sea Global | https://www.redseaglobal.com/en/contact-us/ | Not stated | 12 Oct 2026 | Form F1, F2, legal link defect | Not submitted |
| S4 | Vendor Registration | Red Sea Global | https://www.redseaglobal.com/en/vendor-registration/ | Not stated | 12 Oct 2026 | Form F3, placeholder legal links | Conditional fields not triggered |
| S5 | Careers | Red Sea Global | https://www.redseaglobal.com/en/careers/ | Not stated | 12 Oct 2026 | Careers handoff to careers.theredsea.sa | External site not opened |
| S6 | Red Sea Residences | Red Sea Global | https://www.redseaglobal.com/en/portfolio/projects/red-sea-residences/ | Not stated | 12 Oct 2026 | "Register Interest" handoff, language link pattern | None |
| S7 | Privacy Center | Red Sea Global | https://www.redseaglobal.com/en/privacy-center/ | Not stated | 12 Oct 2026 | OneTrust web form iframe | Iframe fields not read |
| S8 | RSG sitemap | Red Sea Global | https://www.redseaglobal.com/en.sitemap.xml | lastmod 2026-04-06 | 12 Oct 2026 | Site structure, test pages listed | Not declared in robots.txt; found by probing |
| S9 | RSG robots.txt and /sitemap.xml | Red Sea Global | https://www.redseaglobal.com/robots.txt | Not stated | 12 Oct 2026 | No sitemap declared; /sitemap.xml 404 | None |
| S10 | The Red Sea portfolio page; Shebara project page | Red Sea Global | https://www.redseaglobal.com/en/portfolio/the-red-sea/ and https://www.redseaglobal.com/en/portfolio/projects/shebara-resort/ | Not stated | 12 Oct 2026 | Handoffs to visitredsea.com | Only two portfolio pages opened |
| S11 | Visit Red Sea home (EN) | Red Sea Global (Visit Red Sea) | https://www.visitredsea.com/en | Not stated; footer © 2026 | 12 Oct 2026 | Header, footer, account drawer, BOOK widget, chat, consent setup, keyboard test | Cookie banner not seen |
| S12 | Resorts listing | Visit Red Sea | https://www.visitredsea.com/en/resorts | Not stated | 12 Oct 2026 | 13 resorts, tags, filter state, BOOK presence | One load |
| S13 | Shebara resort page (EN and AR) | Visit Red Sea | https://www.visitredsea.com/en/resorts/shebara | Not stated | 12 Oct 2026 | Pre-booking information, room BOOK behaviour, calendar, language switch, mobile behaviour | One resort |
| S14 | Booking results, first screen | Visit Red Sea | https://www.visitredsea.com/en/booking/accommodation-list?hotelId=1035&resortName=Shebara&startDate=2026-10-20&endDate=2026-10-22&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortIndex=0&searchId=mv5m32rl | Dynamic | 12 Oct 2026 | Booking URL pattern, parameters, prices shown, rewards banner | Not walked past first screen; searchId is session-generated |
| S15 | Contact Us | Visit Red Sea | https://www.visitredsea.com/en/contact-us | Not stated | 12 Oct 2026 | Form F7, support channels | Not submitted |
| S16 | Visit Red Sea App page | Visit Red Sea | https://www.visitredsea.com/en/visitredsea-app | Not stated | 12 Oct 2026 | Official app links and stated features, "My Trips" | Marketing copy |
| S17 | Experiences: water sports, scuba diving | Visit Red Sea | https://www.visitredsea.com/en/experiences/water-sports/scuba-diving | Not stated | 12 Oct 2026 | Experience cards, BOOK NOW, Request a quote, chat, console errors | One category |
| S18 | Offers listing; Multi-Resort Escape Offer | Visit Red Sea | https://www.visitredsea.com/en/offers-and-packages/multi-resort-escape-offer | Offer validity 2 Jul to 20 Sep 2026 | 12 Oct 2026 | Offers features, expired offer | One offer detail opened |
| S19 | Plan Your Trip: Airport & Flights | Visit Red Sea | https://www.visitredsea.com/en/plan-your-trip/the-airport-and-flights | Not stated | 12 Oct 2026 | Trip planning content, outbound airline links | Flight data source unknown |
| S20 | Residential | Visit Red Sea | https://www.visitredsea.com/en/residential | Not stated | 12 Oct 2026 | Form F10, broken legal links | Not submitted |
| S21 | Track My Luggage | Visit Red Sea | https://www.visitredsea.com/en/booking/track-my-luggage | Not stated | 12 Oct 2026 | Lookup tool fields | Not submitted |
| S22 | Preference center | Visit Red Sea | https://www.visitredsea.com/en/preference-center | Not stated | 12 Oct 2026 | Empty state | Likely needs a token |
| S23 | Booking FAQs | Visit Red Sea | https://www.visitredsea.com/en/faqs-booking | Not stated | 12 Oct 2026 | My Trips, payment methods, booking window, chat routing | Answers read from fetched HTML |
| S24 | Marketing Campaign Form | Visit Red Sea | https://www.visitredsea.com/en/marketing-campaign-form | Not stated | 12 Oct 2026 | Placeholder form F14 | Purpose unclear |
| S25 | Map | Visit Red Sea | https://www.visitredsea.com/en/map | Not stated | 12 Oct 2026 | Mapbox map, controls | Markers not tested |
| S26 | Visit Red Sea Arabic home | Visit Red Sea | https://www.visitredsea.com/ar | Not stated | 12 Oct 2026 | Arabic nav, drawer, differences | Forms not opened |
| S27 | visitredsea robots.txt and sitemap | Visit Red Sea | https://www.visitredsea.com/sitemap.xml | No lastmod | 12 Oct 2026 | Site structure | Not aligned with live nav |
| S28 | AMAALA home (EN) | Red Sea Global (AMAALA) | https://www.amaala.com/en | Not stated; footer © 2026 | 12 Oct 2026 | Nav, footer, account drawer text, chat, mobile header | Cookie banner not seen |
| S29 | AMAALA resorts; Six Senses Resort | AMAALA | https://www.amaala.com/en/resorts/six-senses-amaala | Not stated | 12 Oct 2026 | Listing, Jayasom external link, UAT link, resort page sections | One resort |
| S30 | AMAALA booking results, first screen | AMAALA | https://www.amaala.com/en/booking/accommodation-list?hotelId=2841&resortName=Six+Senses+Resort&startDate=2026-10-20&endDate=2026-10-22&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortIndex=0&searchId=mv5mgiil | Dynamic | 12 Oct 2026 | Booking URL pattern on amaala.com | Not walked past first screen |
| S31 | AMAALA Residences | AMAALA | https://www.amaala.com/en/residences | Not stated | 12 Oct 2026 | Form F11, UAT terms link | Not submitted |
| S32 | AMAALA robots.txt and sitemap | AMAALA | https://www.amaala.com/sitemap.xml | No lastmod | 12 Oct 2026 | Sitemap host and test pages | Loaded in browser only |
| S33 | AMAALA Arabic home | AMAALA | https://www.amaala.com/ar | Not stated | 12 Oct 2026 | Arabic nav and footer | DOM list only for footer |
| S34 | Visit Red Sea on the App Store | Apple (listing by Red Sea Global) | https://apps.apple.com/us/app/visit-red-sea/id6714457903 | Version 1.6.1, "Oct 2" | 12 Oct 2026 | Publisher, version, features, privacy label | Read through a fetch tool summary; year not printed; US storefront |
| S35 | Visit Red Sea on Google Play | Google (listing by Red Sea Global Company) | https://play.google.com/store/apps/details?id=com.redseaglobal.mobile&hl=en&gl=US | Updated 21 Sep 2026 | 12 Oct 2026 | Publisher, update date, downloads, features, data safety | Version number not shown; US storefront |
| S36 | Raffles The Red Sea page | Visit Red Sea | https://www.visitredsea.com/en/resorts/raffles-the-red-sea | Not stated | 12 Oct 2026 | Unbookable resort presentation | First 1,500 characters and control scan |
| S37 | 404 test URLs | Visit Red Sea; Red Sea Global | https://www.visitredsea.com/en/this-page-does-not-exist-xyz | n/a | 12 Oct 2026 | Error page states | Synthetic URLs |
| S38 | AMAALA UAT host | Unknown operator (linked from amaala.com) | https://amaala.uat.webconnectorprojects.com/en/terms-and-conditions | n/a | 12 Oct 2026 | Publicly reachable staging host linked from production | Status check only (HEAD 200) |

## Outbound booking handoffs

| From page | Button label | Destination URL | Destination domain | Parameters carried |
|---|---|---|---|---|
| visitredsea.com, any page header | BOOK (then SEARCH in widget, Resorts tab) | https://www.visitredsea.com/en/booking/accommodation-list?hotelId={id}&resortName={name}&startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}&rooms=[{"adultCount":n,"childAges":[]}]&resortIndex=0&searchId={token} | www.visitredsea.com (same tab) | Resort id and name, check-in, check-out, adults, child ages, search id |
| visitredsea.com/en/resorts/shebara, room card | BOOK | Opens the widget on the same page with resort prefilled, then the URL above (observed: hotelId=1035, resortName=Shebara, 2026-10-20 to 2026-10-22, 2 adults, searchId=mv5m32rl) | www.visitredsea.com (same tab; the anchor has target="_blank" but no new tab opened) | Resort carried into widget; room type not visibly carried; dates and guests entered in widget |
| visitredsea.com/en/resorts, resort card | BOOK | Not clicked. Same button component as the room card | Not verified (requires one click) | Not verified |
| visitredsea.com experience page (scuba diving), activity card | BOOK NOW | Opens the widget, Experiences tab, "Scuba Diving" prefilled. Result URL not captured | www.visitredsea.com (widget); result URL not verified | Activity category carried; resort and date required |
| visitredsea.com header widget, Transportation tab | SEARCH | Not run | Not verified | From, To, date, guests entered in widget |
| visitredsea.com offer page (Multi-Resort Escape) | CONTACT US | Opens the contact modal on the same page (no booking URL) | www.visitredsea.com | None |
| amaala.com, header or room card | Book / BOOK (then Search) | https://www.amaala.com/en/booking/accommodation-list?hotelId=2841&resortName=Six+Senses+Resort&startDate=2026-10-20&endDate=2026-10-22&rooms=[{"adultCount":2,"childAges":[]}]&resortIndex=0&searchId=mv5mgiil | www.amaala.com (same tab) | Same parameter set as visitredsea.com |
| amaala.com/en and /en/resorts, Jayasom Wellness Resort card | BOOK | https://www.jayasom.com/booking | www.jayasom.com (new tab) | None |
| redseaglobal.com/en/portfolio/the-red-sea/ | VISIT RED SEA | https://www.visitredsea.com/en/resorts | www.visitredsea.com (new tab) | None |
| redseaglobal.com/en/portfolio/projects/shebara-resort/ | Explore more | https://www.visitredsea.com/en/resorts/shebara | www.visitredsea.com (new tab) | None |
| redseaglobal.com footer (EN) | AMAALA | https://www.visitredsea.com/en/destinations/amaala, which redirects to https://www.amaala.com/en | www.amaala.com after redirect (same tab) | None |
| redseaglobal.com/en/portfolio/projects/red-sea-residences/ | Register Interest | https://www.visitredsea.com/en/residential (residential enquiry, not a stay booking) | www.visitredsea.com (new tab) | None |
| visitredsea.com footer and app page | App Store / Google Play badges, DOWNLOAD THE APP | https://apps.apple.com/us/app/visit-red-sea/id6714457903 ; https://play.google.com/store/apps/details?id=com.redseaglobal.mobile ; https://onelink.to/visitredsea | apps.apple.com, play.google.com, onelink.to (new tab for badges) | None |

## Gaps and blocked steps

1. Cookie banners on all three sites were not seen. Consent had already been set to necessary-only in the shared browser profile at 18:46:02 UTC. A clean profile is needed to record banner text, buttons and pre-consent tag behaviour.
2. Account registration beyond step 1, email or phone verification, password rules, country-code picker in sign-up, consent checkboxes, and the logged-in area (My Trips, profile) were not seen. Blocked by the no-submission rule.
3. The authentication back end (API host, identity provider) was not identified. It needs a network capture of a real login.
4. Live chat was not opened. Bot versus agent, pre-chat fields, languages and hours are unknown.
5. The booking flow was not walked past the first results screen on either guest site (by scope). Whether login is forced, where payment happens and which engine is used are for the booking-engine researcher.
6. Experiences and Transportation search result URLs were not captured. Multi-resort ("ADD ANOTHER RESORT") was not exercised.
7. Currency switching was not applied, so price conversion behaviour is unknown.
8. Request a quote steps 2 and 3 were not seen. The blank options in step 1 were observed once on one page and should be re-tested on another page and browser.
9. Arabic forms, Arabic booking results and Arabic mobile layouts were not inspected.
10. amaala.com: footer Contact Us modal, map, experience sub-navigation, offers page, mobile burger and a deep-page language switch were not opened.
11. redseaglobal.com: search results, investment page forms (if any), training programme application links, the mobile burger and an Arabic sitemap were not checked.
12. Travel Trade toolkit pages and /en/contact-us-mobile on visitredsea.com were not opened.
13. The careers site (careers.theredsea.sa), jayasom.com/booking, thuwalretreat.sa and the OneTrust privacy web form were not inspected beyond confirming they respond.
14. The UAT host amaala.uat.webconnectorprojects.com was status-checked only. Its content and whether it accepts bookings or logins were not examined.
15. The mobile app was not tested. Android version number and the year of App Store version dates are unconfirmed.
16. Accessibility findings are spot checks from the DOM, the accessibility tree and a few screenshots. No screen reader, automated audit or contrast measurement was run, and no compliance conclusion is drawn.
17. Curl access to redseaglobal.com and amaala.com pages is challenged by Cloudflare (403), so those two sites were inspected only in the browser.
18. Publication or last-updated dates are not shown on almost any page. Only the redseaglobal.com sitemap (lastmod 6 Apr 2026), the offer validity dates and the store listings give dates.
