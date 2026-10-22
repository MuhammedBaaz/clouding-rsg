# Claude Code prompt: Visit Red Sea visual replica with a completed AI concierge conversation

## ROLE

You are a Senior Front-End Engineer, Visual Interface Designer, and Arabic Conversation Designer specializing in luxury hospitality and Saudi guest communication.

Build a polished local website that visually reproduces Visit Red Sea and contains a realistic chat widget showing a complete, already-finished conversation between a customer and our proposed AI booking concierge.

This is a visual demonstration. The customer journey is prewritten and already completed. The reviewer opens the widget and scrolls through the entire conversation. You are not building a working AI assistant or a reservation integration.

Implement the actual website files. Do not stop at a plan, wireframe, transcript, or code excerpt.

## 1. PROJECT CONTEXT AND SOURCE FILES

Working directory: D:\Clouding\RSG

Inspect the existing project and applicable project instructions before changing files. Preserve the existing presentation, research, and evidence. Place the implementation in a new subdirectory, such as visitredsea-chat-mockup.

Read these existing files:

- D:\Clouding\RSG\Clouding_RSG_POC_Presentation.html
- D:\Clouding\RSG\reports\Red Sea Global POC due diligence.md
- D:\Clouding\RSG\reports\Mockup spec R1 Shebara Desert Rock.md
- D:\Clouding\RSG\reports\csv\resort_inventory.csv
- D:\Clouding\RSG\reports\csv\price_observations.csv
- D:\Clouding\RSG\reports\csv\policy_matrix.csv
- D:\Clouding\RSG\reports\csv\source_register.csv
- D:\Clouding\RSG\research_notes\Red Sea Global POC due diligence\02_brand_architecture.md
- Relevant evidence under D:\Clouding\RSG\evidence

The latest customer-provided screenshots are:

1. Accommodation summary:
   D:\Clouding\RSG\evidence\mockup_references\01_shebara_booking_summary_23-25_oct_2026.png

2. Transportation:
   D:\Clouding\RSG\evidence\mockup_references\02_shebara_transportation_yanbu_to_rsia.png

3. Guest information:
   D:\Clouding\RSG\evidence\mockup_references\03_guest_information_fields.png

If a file is missing, search for it by filename. If still unavailable, tell me exactly which file you need. Do not claim to have read it.

The previous mockup spec used older scenarios. This new brief supersedes its implementation scope, dates, and restrictions on showing the requested Visit Red Sea visual identity and real property imagery. It does not make unrelated historical prices valid for this new scenario.

Keep factual evidence from the earlier research, and replace scenario-specific details only where the latest screenshots or my instructions supply updated information.

## 2. INSPECT AND USE RELEVANT SKILLS

First inspect the skills actually available to your Claude Code session, including project skills, user skills, and enabled plugin skills. Read the relevant SKILL.md files before applying them.

Useful local skills were found at:

- C:\Users\Compumarts\.claude\skills\browse\SKILL.md
  For inspecting the actual reference website and checking the local result in a browser.

- C:\Users\Compumarts\.claude\skills\design-html\SKILL.md
  Potentially useful for implementation. Use it only if its implementation approach fits this simple visual website.

- C:\Users\Compumarts\.claude\skills\design-review\SKILL.md
  For reviewing typography, spacing, layout, and the rendered result.

Relevant official Anthropic skills to use if installed:

- frontend-design:
  https://github.com/anthropics/skills/tree/main/skills/frontend-design

- webapp-testing:
  https://github.com/anthropics/skills/tree/main/skills/webapp-testing

frontend-design is useful for visual implementation quality. webapp-testing provides browser inspection and screenshot testing support.

Check whether these skills are installed through a plugin or another location before saying they are unavailable.

If a recommended skill is missing, tell me its exact name and how to provide or install it. Do not pretend to have used it. Continue with suitable installed capabilities where possible.

Optional installation commands for me to run:

    npx skills add https://github.com/anthropics/skills --skill frontend-design
    npx skills add https://github.com/anthropics/skills --skill webapp-testing

Reference fidelity is the design objective. Do not let a skill's preference for originality, device mockups, animation, or a new visual direction override this brief.

Do not introduce a complex framework, paid generation service, image-generation workflow, or deployment process just because a skill recommends it.

## 3. INTERPRET "VISUAL ONLY / NO UX" CORRECTLY

The page and conversation should look real, but the booking process itself is static.

Required interactions:

- Open the chat using a floating chat widget.
- Close and reopen it.
- Scroll the entire completed transcript.
- Open the real Shebara details page from its rich resort card.
- Open the exact supplied checkout URL from a payment card.

Everything else in the conversation is a visual record of choices that have already happened.

Do not build:

- A live chatbot or LLM connection.
- Message submission or newly generated replies.
- A branching conversation.
- Editable booking forms.
- An interactive calendar or new date selection.
- Working rate, villa, or transportation selection.
- Real account creation, email verification, payment processing, or reservation submission.
- A backend, database, analytics integration, or external chat service.

Display the full conversation immediately when the widget opens, positioned at the beginning. No typing simulation, timed playback, staged reveals, or automatic jumping to the bottom.

A decorative composer is acceptable if clearly inactive. Enter and send controls must not appear to send real messages.

Use only minimal JavaScript for the requested shell behavior.

## 4. REFERENCE WEBSITE AND VISUAL DIRECTION

Primary visual reference:
https://www.visitredsea.com/en

Shebara details page:
https://www.visitredsea.com/en/resorts/shebara

Inspect the rendered website if browser tools are available. Capture reference screenshots and identify the actual:

- Header and navigation.
- Logo treatment.
- Hero imagery and its crop.
- Page width and spacing.
- Typography.
- Color palette.
- Buttons and borders.
- Resort cards.
- Booking summary appearance.
- Footer and floating-widget positioning.

Reproduce the homepage as closely as the available references and assets allow. Build enough of its real visual structure to make the chat feel embedded in Visit Red Sea.

The backdrop should be a Visit Red Sea page, not a Clouding sales landing page or the previous presentation turned into a website.

Use the presentation for business context and evidence, not as the primary visual theme.

The research recorded these implementation details as leads to verify:

- Aqua: #71bfb7
- Deep teal: #37706c
- Blue charcoal: #1e282f
- Pale aqua: #e6f6f5
- Pale sand: #fafaf7
- English body font: Fedra Sans AL
- English display font: Fedra Serif Display
- Arabic font family observed: Fedra Serif Arabic AR

These are observed implementation values, not a substitute for inspecting the reference.

Use the actual available logo and font assets. If an exact asset is inaccessible, identify the mismatch and request the file. Do not silently replace the logo or claim an approximate font is exact.

Do not reuse the official site's tracking, authentication, booking scripts, or live chat integrations.

Keep the local concept clearly identifiable through a restrained "Concept demo" or "Demo conversation" label in the chat shell or page footer. Preserve the premium visual appearance.

## 5. CHAT APPEARANCE

Make the widget feel like a real premium travel concierge embedded in the site.

- Closed initially, with an elegant floating launcher.
- On desktop, use a spacious side panel or anchored chat window, approximately 520–620 px wide where space permits, so the rich components remain readable.
- On mobile, adapt it to a usable full-height or near-fullscreen panel.
- Use a clear fixed header, distinct assistant/customer messages, readable timestamps, and restrained message-status styling.
- Keep the transcript as the independently scrollable area.
- Opening at the first greeting is mandatory.
- Preserve scroll position when closed and reopened.
- Closing must not erase or regenerate the transcript.
- Show every rich component inline. Do not hide important content in accordions or require carousel actions to see the catalog.
- Distinguish selected cards visually as already-selected choices, not live controls.
- Use genuine HTML/CSS components, not screenshots of entire booking screens pasted into message bubbles.
- Use source screenshots as references for rebuilding the summary, transportation, and guest-information components.
- Keep the panel above the page with restrained shadow, correct stacking, and no clipped content.

Conversation text is Arabic with natural Saudi phrasing and RTL direction.

All rich-component content remains English, including descriptions, headings, field labels, dates, resort names, villa names, rate-plan names, and button labels. Arabic is used for the dialogue around those components; proper names can remain English inside Arabic messages.

Use explicit LTR containers or bdi where needed so English names, amounts, dates, email addresses, and phone numbers render correctly within RTL messages.

## 6. PERSONA AND LANGUAGE

The AI concierge serves luxury travelers. Its voice should be:

- Warm and welcoming.
- Calm, confident, and attentive.
- Professional without sounding bureaucratic.
- Naturally Saudi without exaggerated slang.
- Concise while explaining decisions and costs clearly.

Rewrite the requested conversation in this voice. Do not copy my rough phrasing literally.

Suitable expressions include "حياك الله", "يسعدني أساعدك", "اختيار جميل", and "على راحتك", used naturally and sparingly.

Avoid repetitive praise, excessive emojis, aggressive upselling, exaggerated promises, and repeatedly saying the customer's name in every sentence.

Use one coherent fictional demo customer. You may use "خالد" as the first name and refer to his wife naturally.

Fictional customer messages and concierge copy are authorized for this demonstration. Resort facts, prices, policies, and claims of real availability must still be evidenced.

Use an example.com email address and a masked Saudi mobile number. Do not reuse real personal information from research screenshots or files.

## 7. FIXED BOOKING SCENARIO

The completed conversation must consistently use:

- Resort: Shebara
- Accommodation: One Bedroom Overwater Villa
- Guests: 2 Adults
- Children: 0
- Check-in: Friday, 23 October 2026
- Check-out: Sunday, 25 October 2026
- Nights: 2
- Selected rate plan: Villa Flat Rate
- Accommodation total: SAR 28,980.00, all taxes included
- Arrival mode: By Plane
- Arrival airport: Yanbu Airport
- Arrival transfer: Yanbu Airport to Shebara
- Arrival transfer product: Private Luxury Car + Shared Leisure Boat
- Arrival transfer price: SAR 3,622.50 for 2 adults, all taxes included
- Departure airport: Red Sea International Airport - RSIA
- Departure transfer: Shebara to Red Sea International Airport - RSIA
- Departure transfer product: Shared Speed Boat + Private Luxury Car
- Departure transfer price: SAR 1,191.40 for 2 adults, all taxes included
- Transfers total: SAR 4,813.90
- Activities added: None
- Final demonstrated total: SAR 33,793.90

The final total is arithmetic on the supplied screenshot amounts:
28,980.00 + 3,622.50 + 1,191.40 = 33,793.90.

Do not add tax again to amounts already labeled "all taxes included".

Do not invent a tax breakdown, nightly pre-tax rate, meal inclusion, flight ticket price, refund condition, or charge date from these totals.

Do not replace the new transportation scenario with the older research example where both airports were RSI.

Do not substitute the old November 2026 three-night prices.

## 8. COMPLETE CONVERSATION: REQUIRED ORDER

Write the entire natural conversation, including all customer replies, and render it as a completed transcript.

### A. Greeting and remembering the name

1. The agent welcomes the guest and asks how it should address him.
2. The guest introduces himself as Khalid.
3. The agent acknowledges his name and asks how it can help.
4. The guest says he wants a holiday with his wife and wants to explore the resorts.

Remember the first name for the rest of the conversation and the final guest-information card. Do not ask for it again.

### B. Resort discovery with genuine rich cards

5. The agent presents the relevant RSG resort portfolio with real photos, official English names, destination labels, and short sourced descriptions.

Before dates are supplied, describe these as resort options to explore. Do not claim that every resort has rooms available for the eventual stay.

Use the verified inventory, grouped by destination. Include all relevant operating resorts established by the sources, rather than only the two previously shortlisted properties.

The existing research includes:

The Red Sea:
- Six Senses Southern Dunes, The Red Sea
- The St. Regis Red Sea Resort
- Nujuma, a Ritz-Carlton Reserve
- Turtle Bay Hotel
- Shebara
- Desert Rock
- The Red Sea EDITION
- InterContinental The Red Sea Resort
- SLS The Red Sea
- Miraval The Red Sea
- Four Seasons Resort and Residences Red Sea at Shura Island

AMAALA:
- Four Seasons Resort and Residences AMAALA at Triple Bay
- Six Senses AMAALA
- Rosewood AMAALA
- Equinox Resort AMAALA
- Nammos Resort AMAALA
- Jayasom Wellness Resort AMAALA

Other:
- Thuwal Private Retreat, clearly identified as enquiry-based.

Check each property's exact published name against the source files. Do not merge similarly named properties from different destinations.

Daraah Resort has conflicting or incomplete opening evidence in the earlier research. If showing it, preserve that status rather than inventing a confirmed opening. Do not force the catalog to a claimed count of 19 by treating an inference as verified.

Do not present coming-soon properties as currently operating.

Resort card anatomy:
- Correct property image.
- Official English name.
- Destination.
- One or two short factual attributes.
- Appropriate documented status where relevant.

The Shebara rich card must open:
https://www.visitredsea.com/en/resorts/shebara

Open the link in a new tab with appropriate rel attributes. Make the destination clear. Preserve the chat's reading position.

### C. Choosing Shebara and confirming party size

6. The guest says Shebara seems right for them.
7. The agent responds warmly, acknowledges the choice, and checks whether it is just the guest and his wife or whether anyone else will join.
8. In the same exchange, explain the published child accommodation policy accurately: children under 12 can stay free when sharing with their parents, subject to villa occupancy and the relevant conditions. Do not imply that meals, transfers, or activities are all free.
9. The guest confirms it is only the two of them.

### D. Date and length of stay

10. The agent asks for the arrival date.
11. The guest gives 23 October 2026.
12. Show a rich static calendar for October 2026 with the 23rd marked as check-in.
13. The agent asks how many nights.
14. The guest says two nights.
15. The agent responds courteously and shows the completed date component: 23–25 October 2026, 2 Nights, 2 Adults.

The calendar must have correct weekday alignment. Highlight the nights of the 23rd and 24th and clearly mark the 25th as checkout. Do not highlight it as a third occupied night.

All calendar controls are decorative; the reviewer does not select dates.

### E. Villas and rate plans

16. Present real Shebara accommodation types using genuine villa photos and source-backed features.
17. The guest selects One Bedroom Overwater Villa.
18. Show its selected state and factual details, including 188 sqm and a private pool if confirmed by the source material.
19. The agent presents these exact rate-plan names in side-by-side or stacked rich cards:

- SHP - Book Now and Receive 10% Off Your Villa 2026
- Villa Flat Rate

Show prices with their basis: total for 2 nights, 2 adults, currency, and tax inclusion.

Villa Flat Rate total is SAR 28,980.00 from the supplied screenshot and my selected-plan instructions.

The screenshot does NOT establish the actual price or conditions of the 10% plan for these dates. Find matching evidence in the supplied files or ask me for the appropriate screenshot.

Do not calculate SAR 26,082.00 and present it as the observed 10% offer. Do not reuse the older November offer. A plan name alone does not prove its base price, eligibility, availability, or refundability for this stay.

Likewise, do not claim every published villa type is available for 23–25 October without supporting evidence. If that listing is missing, ask for the actual accommodation results.

20. The guest explicitly chooses Villa Flat Rate.
21. Rebuild screenshot 1 as a rich Booking Summary:

- Shebara
- Oct 23–25, 2026
- 2 Adults
- One Bedroom Overwater Villa
- Villa Flat Rate
- Total: SAR 28,980.00
- All taxes included

Use the reference's charcoal summary surface, aqua details, clear hierarchy, elegant typography, and green occupancy-sufficiency status. Reproduce price-breakdown and continuation styling as appropriate, without making decorative controls perform a real booking action. Do not invent line-item taxes behind a price-breakdown label.

22. The guest approves the accommodation summary.

### F. Transportation

23. The agent asks how the guest plans to arrive.
24. Show four rich option tiles, each with an appropriate consistent line icon:

- By Plane
- By Private Jet
- By Car
- By Yacht

25. The guest chooses By Plane.
26. The agent asks for the arrival and departure airports.
27. The guest specifies arrival at Yanbu Airport and departure from Red Sea International Airport - RSIA.
28. Rebuild screenshot 2 as rich transportation components, including the two correct transfer products and their prices. Preserve its airport-selection summary, transport imagery, leg timeline, and visible duration/capacity information where legible and verified. Do not guess small unreadable labels. Any transportation-upgrade selector is shown as a static recorded choice, without inventing an upgrade price.

Arrival and departure times, airline, and flight number are optional in the observed plane flow. If not provided in the screenshots, the scripted guest can say those details will be shared later. Do not invent actual flight numbers or schedules.

Do not describe the transfer amounts as flight-ticket prices.

29. Show an updated Booking Summary:

- Accommodation: SAR 28,980.00
- Arrival transfer: SAR 3,622.50
- Departure transfer: SAR 1,191.40
- Transfers subtotal: SAR 4,813.90
- Total: SAR 33,793.90
- All taxes included for the evidenced line items

30. The guest approves this updated summary.

### G. Optional activities

31. The agent offers these three activities using genuine images and separate rich cards:

- Adrena
- Garden Discovery and Planting Experience
- Stand Up Paddle-Boarding

Historical research recorded:

- Adrena: from SAR 500.00 per person.
- Garden Discovery and Planting Experience: from SAR 184.58 per person.
- Stand Up Paddle-Boarding: SAR 200.00 for one adult for one hour in the captured example, including taxes.

These are real recorded examples, but the earlier research does not establish all three prices or availability for 23–25 October 2026.

Locate matching evidence or ask me for current scenario screenshots. If using the recorded examples, label them "Indicative" and retain the source date and pricing basis; do not call them live quotes for this stay.

32. The guest says he would prefer to decide on activities after arrival.
33. The agent acknowledges that no activities will be added now. Say the resort team can help him explore suitable options during the stay, subject to availability. Do not guarantee last-minute activity availability.
34. Keep the booking total at SAR 33,793.90.

### H. Guest details and final review

35. The agent asks for the remaining required details from screenshot 3, remembering Khalid's first name:

- Preferred title.
- Family name.
- Email.
- Mobile number with country code.

36. The guest supplies clearly fictional demo information.
37. Ask naturally whether he wants to provide the second guest's name or any special requests; these are optional.
38. The guest may give a fictional name for his wife and a modest preference. Present special requests as requests, not guaranteed arrangements.
39. Marketing subscription remains a separate optional choice. Do not preselect it or treat it as mandatory.
40. Show a Guest Information rich card with:

- Booking for: For Myself
- Title
- First Name, already remembered
- Family Name
- Email
- Masked Mobile Number
- Adult Guest 2, if provided
- Other Requirements, if provided
- Marketing opt-in state

The reference's login/sign-up banner is an optional account alternative, not a required step. If represented visually, it must not create a live authentication flow.

Do not add passport, nationality, date of birth, or other fields as mandatory when not established by the observed form.

41. Show the complete final booking review and allow the scripted customer to approve it and the relevant terms.

Use actual Terms & Conditions and Privacy Policy destinations only if established by the sources.

The research observed email verification before payment. Represent that as a short, static demo verification exchange/status before the payment card. Never request, store, send, or validate a real OTP.

### I. Payment link

42. The agent presents an elegant payment rich card containing:

- Shebara
- One Bedroom Overwater Villa
- Oct 23–25, 2026
- 2 Adults
- Total: SAR 33,793.90
- A suitable English payment CTA

The CTA must use this exact URL:

https://www.visitredsea.com/en/booking/checkout?startDate=2026-10-23&endDate=2026-10-25&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortName=Shebara&hotelId=1035&currency=SAR

Use a standard external link, opening in a new tab. Do not embed checkout in an iframe, rewrite the parameters, append customer data, or transmit anything automatically.

The URL does not itself establish that a reservation, cart, price, or payment session exists. Do not claim it is guaranteed to reconstruct the booking without the official site's session.

The full transcript must remain available regardless of whether the reviewer clicks this link.

### J. Assumed successful payment and closure

43. Include the customer's scripted message saying payment was completed.
44. Include the agent's warm Saudi response acknowledging successful payment and confirming the booking within the fictional demonstration.
45. Show a premium confirmation rich card with the agreed resort, villa, dates, guests, transfers, no booked activities, and final total.
46. Close naturally using the customer's name and wishing him and his wife a pleasant stay.

The user explicitly authorizes assuming payment success for this demonstration. You may write that fictional exchange without obtaining real payment evidence.

Keep it clearly scoped through the demo label and a restrained "Simulated confirmation" label on the final card.

Do not fabricate a real RSG receipt, genuine reservation number, payment reference, or claim that any real charge or booking occurred.

If a demonstration reference is useful, prefix it with DEMO and identify it as illustrative.

## 9. REAL PHOTOGRAPHY AND ASSET SOURCING

Source the actual images required for:

- The Visit Red Sea page backdrop and hero.
- Every resort shown in the discovery catalog.
- Shebara's relevant villa types, especially One Bedroom Overwater Villa.
- Transportation imagery if shown.
- Adrena.
- Garden Discovery and Planting Experience.
- Stand Up Paddle-Boarding.
- The actual site logo and any necessary resort marks.

First search the supplied files and existing local assets. Then inspect the corresponding official public pages.

Use correctly identified photos. A Shebara beach villa photo is not evidence of its overwater villa; another resort's photo is not an acceptable substitute.

Inspect the actual image before assigning it to a component. Record the source page and asset URL.

Store accessible images as local assets where permitted by your tools. Use descriptive filenames, appropriate crops, useful alt text, and sufficient resolution.

Do not invent image URLs, use unrelated stock photography, generate fictional property imagery, remove watermarks, or show broken image placeholders in the final review.

If a source is inaccessible, an image cannot be confidently identified, or the necessary asset is absent, tell me exactly which image or file to provide. Continue independent implementation work.

Maintain an asset manifest linking each image to its subject, source page, original URL, local path, and any unresolved identification issue.

## 10. EVIDENCE AND MISSING INPUTS

Maintain a compact source map for every factual component:

- Claim or field.
- Value.
- Source file/page/screenshot.
- Scenario and date.
- Evidence status.

Separate:

- Latest user-supplied screenshot facts.
- Earlier verified property facts.
- Historical price examples.
- Computed totals.
- Fictional demo conversation and customer details.
- Explicitly simulated verification, payment success, and confirmation.

Prioritize these known gaps:

1. Exact 10% offer price and conditions for One Bedroom Overwater Villa, 23–25 October 2026, 2 adults.
2. Actual villa results and any other villa prices for the same scenario.
3. Matching activity prices and availability if asserting them for the selected stay.
4. Missing or unidentified resort, villa, activity, logo, or font assets.

Do not infer missing prices from percentage names or silently substitute another date's data.

When blocked, ask one concise grouped question explaining:

- Exactly what is missing.
- Where it will appear.
- What you already searched.
- The screenshot, asset, or answer needed.

Continue the page shell, known components, and transcript portions that do not depend on the missing data.

Draft placeholders may be clearly marked during development, but do not call the result final while required content remains unresolved.

## 11. IMPLEMENTATION AND DELIVERY

Use the simplest suitable implementation. Prefer plain HTML, CSS, and minimal JavaScript with local assets unless an existing project stack gives a clear practical advantage.

Keep the transcript data, property facts, and pricing values easy to review and correct. Avoid repeated hardcoded amounts that can drift between cards.

Use real semantic elements, sensible focus handling, an accessible close control, and keyboard dismissal. These support the requested widget without adding business functionality.

Do not modify the original research or presentation to make them agree with the mockup.

Do not publish or deploy the site as part of this task.

Deliver:

- The implemented local website.
- All required local assets.
- The full Saudi Arabic transcript in an editable data/text file.
- A short README with how to open/run it.
- An asset/source manifest.
- A concise list of missing inputs, if any.
- Screenshots of the final page and representative chat positions if browser tools are available.

## 12. FINAL VISUAL AND CONTENT CHECK

Inspect the rendered result, not only the source code.

Check at desktop and mobile sizes:

- The backdrop closely matches the actual Visit Red Sea reference.
- The widget starts closed.
- Opening shows the first greeting.
- Every message and rich component already exists in the transcript.
- The conversation scrolls without moving or clipping the header.
- Both parties' messages are readable.
- Arabic reads naturally and English components render LTR correctly.
- All property images belong to the correct properties.
- The calendar correctly represents two nights, 23–25 October.
- The first name is requested once and remembered.
- The selected villa and rate remain consistent.
- Accommodation total is SAR 28,980.00.
- Transfers total is SAR 4,813.90.
- Final total is SAR 33,793.90.
- No activities are charged.
- No tax is added twice.
- Unsupported discount or villa prices have not been invented.
- The Shebara card opens the supplied details page.
- The payment CTA's href exactly matches the supplied URL.
- The external links preserve the local transcript.
- No network call sends messages, guest details, payment data, or booking requests.
- The final success message is visibly part of a simulated demonstration.
- No broken assets, overflow, console errors, or accidental live controls remain.

Use browser tools to verify local behavior and inspect link targets without submitting anything on the official booking site.

If browser verification is unavailable, say exactly what could not be checked. Do not claim successful visual testing.

Begin by inspecting the existing files, screenshots, and available skills. Identify essential missing evidence early, then build everything that is already supported.
