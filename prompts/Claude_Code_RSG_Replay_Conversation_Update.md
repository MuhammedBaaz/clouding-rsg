# Claude Code implementation brief: update the existing concierge conversation

## ROLE

You are a Senior Front-End Engineer, Scripted Conversation Engineer, and Saudi Arabic Conversation Designer specializing in premium hospitality interfaces.

Update the existing Visit Red Sea website and chat in place. Convert the currently pre-rendered conversation into a user-driven scripted replay, implement the revised journey below, and preserve the existing visual identity.

Implement and verify the changes. Do not stop at a plan or provide a replacement design proposal.

## 1. EXISTING PROJECT AND PRIORITY

Project directory:
D:\Clouding\RSG\visitredsea-chat-mockup

Read the applicable project instructions and inspect:

- index.html
- js/chat.js
- css/chat.css
- css/site.css
- data/transcript.js
- data/booking.js
- data/resorts.js
- data/villas.js
- docs/SOURCES.md
- docs/ASSETS.md
- docs/MISSING_INPUTS.md
- README.md
- The existing local image, logo, and font assets.

The current implementation renders the complete transcript at once, has an inactive composer, separate rate-plan cards, repeated airport fields, and a static guest-details card. Confirm the current structure before editing.

This brief supersedes earlier requirements for a fully visible completed transcript, an inactive composer, the 10% offer, and visible demonstration or simulation labels.

Reuse the existing page, components, verified property facts, imagery, and booking figures. Refactor the existing project rather than creating a second unrelated website.

Use relevant installed frontend/design/browser skills where available. Read their instructions and keep their use within this task. Do not introduce a live AI provider, database, or deployment workflow. Section 16 authorizes the minimal server-side email-verification capability needed for real OTP delivery.

## 2. TWO MANDATORY FINAL CHANGES

### Remove the 10% offer entirely

Remove this rate plan from the active UI, conversation, selectors, and booking data used by the experience:

SHP - Book Now and Receive 10% Off Your Villa 2026

Do not display its name, a discount badge, a missing-price message, an empty comparison card, or a question asking the customer to choose between it and another rate.

Villa Flat Rate is the only rate used for the booking journey.

Place its compact control or selected label directly below the relevant villa selection. A single rate does not need a redundant dropdown or an extra conversation turn asking which rate to choose.

Do not modify the underlying research documents simply to erase their historical evidence.

### Remove all customer-facing signs of a demonstration

Nothing visible in the page, chat, forms, summaries, payment card, confirmation, or exported PDF should describe the experience as:

- Demo.
- Test.
- Prototype.
- Mockup.
- Simulation or simulated.
- Fictional.
- Concept demo.
- Replay mode.
- An assumed or hypothetical transaction.
- تجربة، اختبار، محاكاة، افتراضي، نموذج تجريبي, or equivalent wording in this context.

Check badges, footnotes, banners, status text, tooltips, accessible labels, browser titles, print output, exported file names, and PDF content.

Remove the displayed DEMO-prefixed reference. If no real reservation reference is available, omit that field rather than inventing an official reference.

Keep the implementation technically scripted and local. Removing these labels does not mean adding real payment detection, reservation creation, or claims of an actual backend integration.

Internal code and developer documentation should still accurately describe how the implementation works. Do not add new customer-facing disclaimers elsewhere as replacements for the removed labels.

## 3. SCRIPTED REPLAY BEHAVIOR

The reviewer types the customer's messages, using the existing conversation as the starting point. The assistant returns the corresponding prepared replies and components, updated for this brief.

Mandatory message placement:

- Assistant/agent messages are physically aligned to the LEFT.
- Customer messages are physically aligned to the RIGHT.
- Keep this placement consistent on desktop, mobile, and conversation PDF pages.
- Arabic text inside both sides remains RTL. Do not force Arabic text to LTR just to position its bubble.
- Apply Section 19's Arabic rich-component localization while keeping numerical and international-identifier text readable; associate each component with its correct speaker.
- Check actual rendered positioning: inherited RTL layout must not accidentally reverse the requested left/right placement.

- Start with only the assistant's greeting visible.
- Enable the composer and send button.
- Enter sends; Shift+Enter adds a line break.
- Do not render future customer messages automatically.
- Do not display future assistant messages or components before their stage.
- Advance only after an accepted customer message or a relevant component action.
- Component actions such as choosing a resort or submitting the calendar generate one natural customer chat message and feed the same replay engine.
- Preserve Saudi Arabic wording and the concierge's warm, refined persona.
- Accept reasonable punctuation, spacing, Arabic/Western digit, and wording variations without requiring an exact character-for-character match.
- Remember the first name, selected resort, villa, rate, guest count, dates, airports, and submitted guest information in conversation state.
- Use prepared responses and deterministic state transitions. No live LLM or external chat API.
- For an unexpected input, give a short, neutral request for the information needed at the current step. Do not invent answers or skip stages.
- Do not mention replay, testing, or unsupported demo behavior in customer-facing replies.
- Prevent duplicate submissions and duplicate assistant replies when a button is clicked twice or Enter is pressed repeatedly.
- Keep progress and the transcript when the chat closes and reopens.
- Opening the chat must not reset the conversation.

If a reset mechanism is needed, keep it in a discreet action menu using a neutral label such as "Start a new conversation", not "Reset demo".

Do not build unrelated booking branches. The complete supported journey is Shebara, One Bedroom Overwater Villa, Villa Flat Rate, 2 adults, 23–25 October 2026.

## 4. RESORT DISCOVERY MUST NAVIGATE TO THE PAGE

Remove the multi-resort catalog rich component from the chat.

When the customer asks which resorts they can explore:

1. The assistant replies naturally in Saudi Arabic. Example meaning, not mandatory wording:
   "عرضت لك قسم المنتجعات في الصفحة. خذ راحتك في الاطلاع، وقل لي أي منتجع شدّ انتباهك."
2. Scroll the actual webpage to its existing Resorts section.
3. Highlight that section subtly so the customer understands where to look.
4. Reveal a Choose or اختر button on each resort card in that section.

The Choose controls should be hidden or inactive before this discovery stage. Reveal them when the assistant directs the customer to the section.

Use the existing section and resort cards; do not insert another complete catalog into the chat or rebuild the homepage.

Clicking a resort's Choose button must:

- Use that card's actual resort identity.
- Append a customer message with the selected resort name, for example "أختار Shebara".
- Update the selected-resort state.
- Return attention to the chat and reveal the corresponding assistant reply.
- Render a rich details card for the selected resort inside the conversation.

The intended selection is Shebara. Its details card should use the existing verified photo, official name, location, and concise facts, with the existing official details link.

Do not silently send Shebara when a different resort was clicked. For other properties, use their existing factual details and allow the customer to return to resort selection; you do not need to build complete booking flows for all properties.

Make page navigation genuinely visible:

- On desktop, do not let the open chat or a modal backdrop prevent viewing or choosing the page's resort cards.
- On small screens, temporarily minimize or collapse the panel to expose the section, then restore it after the resort is selected.
- Respect reduced-motion preferences.
- Do not reload the page or navigate away from the local site.

## 5. SHOW VILLAS IMMEDIATELY AFTER SHEBARA DETAILS

Immediately after the Shebara details card, show its room/villa rich components, before asking about the number of guests or dates.

Each accommodation card should include:

- Its correct existing image.
- Official accommodation name.
- A concise set of verified features.
- Occupancy where documented.
- A price next to the relevant option, where supported by evidence.
- A clear villa-selection control.

Use the existing villa data and real assets. Do not confuse resort photos with particular villa photos.

The intended selection is One Bedroom Overwater Villa.

Place Villa Flat Rate directly underneath the villa selection as a compact selection button or selected-rate control. Do not render the old standalone rate-plan comparison component or ask a separate rate-choice question.

The active rate is Villa Flat Rate only. No 10% offer appears anywhere.

Let the customer choose the villa and confirm the rate through this component. Append one appropriate customer message and update state without redundant selection messages.

Important pricing rule:

The verified selected accommodation total is SAR 28,980.00 for 2 adults, 2 nights, 23–25 October 2026, all taxes included.

Because cards now appear before the customer enters dates and headcount, retain the applicable date, stay length, and guest basis next to any displayed reference price. Do not imply that the price applies to every possible date or party.

Do not invent prices for the other villas or derive them from unrelated November observations. Search the existing evidence. If the requested villa-price listing is incomplete, ask me for the exact missing prices or screenshot while continuing supported work.

Do not place technical missing-evidence notices in the final customer-facing interface.

## 6. GUEST COUNT, THEN ONE COMBINED DATE QUESTION

After the villa-selection stage, ask whether the stay is for the customer and his wife only or whether anyone else will join.

Keep the child-policy explanation accurate and concise: children under 12 can stay free sharing with parents, subject to occupancy and the relevant accommodation conditions. Do not imply all meals, transfers, or activities are free.

The customer confirms that it is only the two of them.

Then ask one combined question about arrival and stay length, accompanied by one date-range calendar. Natural example:

"متى يناسبكم الوصول، وكم ليلة ودكم تقضون؟ حدّد الوصول والمغادرة في التقويم، وأرتّب لك المدة."

The customer selects check-in and check-out in the same calendar component.

Requirements:

- Select check-in and check-out as one date range.
- Calculate the number of nights automatically.
- Submit both dates through one action.
- Append one customer message containing the range and stay length.
- Do not ask "How many nights?" again.
- Do not ask for checkout in another message.
- Do not add a second editable calendar.
- Validate that checkout is later than check-in.
- Calculate calendar-day differences correctly without timezone or daylight-saving errors.

The supported route is:

- Check-in: Friday, 23 October 2026.
- Check-out: Sunday, 25 October 2026.
- Nights: 2.
- Adults: 2.

Preserve evidence-based pricing for this route. Do not claim live availability or quote new prices for other selected dates.

After date confirmation, show the accommodation summary using the chosen villa, Villa Flat Rate, the complete range, 2 Adults, and SAR 28,980.00 including taxes.

## 7. AIRPORT SELECTION APPEARS ONLY ONCE

Preserve the transportation-mode options:

- By Plane.
- By Private Jet.
- By Car.
- By Yacht.

Keep the appropriate icons. The scripted route selects By Plane.

Show the airport/arrival-information rich component once, when asking for the transportation information.

Collect the existing relevant fields in that component:

- Arrival airport.
- Departure airport.
- Optional arrival/departure time, airline, and flight number where applicable.

After submission, append a suitable customer message and display only Transportation Details in the assistant's next rich component.

Do not repeat the airport-selection form, editable airport controls, or the full arrival/departure field blocks in the transportation-details response.

Airport names may still appear as route endpoints in the leg descriptions. That is not a duplicate form.

Preserve:

- Arrival: Yanbu Airport to Shebara.
- Product: Private Luxury Car + Shared Leisure Boat.
- Arrival transfer: SAR 3,622.50.
- Departure: Shebara to Red Sea International Airport - RSIA.
- Product: Shared Speed Boat + Private Luxury Car.
- Departure transfer: SAR 1,191.40.
- Transfer subtotal: SAR 4,813.90.
- Accommodation plus transfers: SAR 33,793.90.

These transfer figures are for the recorded 2-adult scenario and already include taxes. Do not add tax again or treat them as flight-ticket prices.

In the current renderer, inspect airportFields(), C.transportAirports, and C.transportTrip. The trip component must stop re-rendering airportFields(true).

## 8. PRESERVE THE OPTIONAL ACTIVITY STAGE

Keep the existing relevant activity cards, real images, and source-backed pricing:

- Adrena.
- Garden Discovery and Planting Experience.
- Stand Up Paddle-Boarding.

The customer declines to add activities now and prefers to decide during the stay.

Reply naturally and courteously, noting that the resort team can help with suitable options subject to availability.

No activities are added or charged. The total remains SAR 33,793.90.

Keep the actual scope and date basis of recorded activity prices. Do not turn historical figures into guaranteed live quotes.

## 9. ONE MESSAGE AND ONE FORM FOR BOTH GUESTS

Replace the separate text questions and static guest-information display with one assistant message and one editable rich component for the customer and his wife.

The message should mean:

"باقي بياناتك وبيانات زوجتك لاستكمال الحجز. عبّئها هنا، واسمك الأول مسجّل عندي بالفعل."

Rewrite that in natural, polished Saudi Arabic.

Use one component containing clearly grouped sections:

Main Guest:
- Title.
- First Name, prefilled from the earlier introduction; do not ask for it again.
- Family Name.
- Email.
- Mobile country code and number.

Second Guest:
- First Name.
- Family Name.

Additional:
- Other Requirements, optional.
- Marketing subscription as a separate optional choice, not selected by default.

Use the verified source form to determine required versus optional fields. Do not invent a legal requirement for the wife's identity details, or add her email, phone, passport, or date of birth.

The intended replay fills both guests' names. If the second-guest fields were optional in the original evidence, preserve that status.

Submit the entire card with one action. Validate the relevant fields inline. Do not ask the customer's and wife's details in separate chat messages.

After submission:

- Save the submitted values to conversation state.
- Append one concise customer message confirming the details were supplied.
- Use those exact values in the final review, confirmation, and PDF.
- Do not overwrite them with the old hardcoded fictional guest object.
- Treat special requests as requests, not guaranteed hotel arrangements.

Keep review and consent consistent with the prepared journey. Apply Section 16 for voice-assisted details, actual email OTP verification, and the automatic payment continuation. Do not add a real payment integration.

## 10. DOWNLOAD THE FINAL BOOKING SUMMARY AS PDF

Add a Download PDF action inside the final complete booking-details/confirmation rich component.

The downloaded PDF must contain the booking summary, not the entire webpage or transcript:

- Resort and accommodation.
- Villa Flat Rate.
- Check-in and check-out.
- Number of nights and guests.
- The customer and second guest's submitted details as appropriate.
- Both transfer routes and products.
- Accommodation total.
- Arrival and departure transfer amounts.
- Transfer subtotal.
- No booked activities.
- Grand total: SAR 33,793.90.
- Relevant tax-inclusion wording.
- Special requests, if supplied, without promising fulfillment.

Generate the PDF from the current replay state.

Do not reuse Visit_Red_Sea_Concierge_Demo.pdf. It is an older whole-page/transcript export and is not the requested booking-summary download.

Download an actual valid .pdf file, for example:
Shebara_Booking_Summary_2026-10-23.pdf

Do not rename HTML to .pdf. Do not provide only a print dialog when the action is labeled Download PDF.

Use a suitable local/client-side PDF approach that fits the existing project. Support Arabic guest names correctly, with readable embedded fonts or a reliable rendering method. Handle images, page breaks, and long text without clipping.

The PDF must not contain Demo, Test, Simulated, Fictional, Concept, افتراضي, اختبار, or equivalent labels, and must not display the old DEMO-prefixed reference.

Do not invent a real booking number. Omit an unavailable reference.

If PDF generation fails, give an appropriate retry state rather than a broken download. No external document service or guest-data upload.

## 11. AVATAR AND CHAT BACKGROUND

Add an actual profile image for the concierge instead of the current generic sparkle SVG.

Use a suitable existing image or brand asset. Keep it consistent in the chat header and beside assistant messages where avatars are shown. Do not imply a photographed individual is a specific real employee without evidence.

Add a real resort photograph as the chat conversation background. Any suitable existing resort image is acceptable; Shebara is a natural choice.

- Reuse a real local asset.
- Apply a subtle overlay or treatment so Arabic and card text remain readable.
- Keep strong contrast for assistant/customer bubbles.
- Avoid strong blur, busy imagery behind text, or excessive transparency.
- Keep the header and composer clear and stable.
- Preserve the existing Visit Red Sea colors, fonts, and overall styling.
- Do not redesign the website or add a Clouding landing-page theme.

If no appropriate profile asset exists, tell me the exact asset needed. Do not use a broken image or silently pretend a placeholder is the final profile image.

## 12. FINAL JOURNEY ORDER

Use this order and update the transcript/state model accordingly:

1. Greeting and customer's first name.
2. Customer asks about resorts.
3. Assistant scrolls the webpage to Resorts and reveals Choose buttons.
4. Customer chooses Shebara on the page; its name appears as a customer message.
5. Assistant shows the selected resort's details.
6. Immediately show villa cards and their evidenced prices.
7. Customer selects One Bedroom Overwater Villa, with Villa Flat Rate directly beneath its selection.
8. Confirm guest count: customer and wife, 2 adults.
9. One combined date question and one calendar selecting both endpoints.
10. Accommodation summary and customer approval.
11. Transportation mode.
12. One airport-information form.
13. Transportation Details only, without repeating the airport form.
14. Updated booking total and approval.
15. Activities offered; customer declines.
16. One message and one guest form for both guests.
17. Final review and the retained prepared verification/payment stages.
18. Successful-payment continuation, final booking card, Download PDF, and warm closure.

All conversational text remains natural Saudi Arabic. Apply Section 19 to localize the rich components into Arabic while retaining Western digits. Keep underlying property identities intact and handle mixed RTL/LTR text correctly.

## 13. IMPLEMENTATION GUIDANCE AND VERIFICATION

The current renderer uses T.forEach to append the entire transcript. Replace that all-at-once rendering with reusable message rendering driven by the current conversation stage.

Retain the resort data needed by the homepage even though its chat catalog component is removed.

Refactor existing components where practical:

- C.resorts: no longer render the multi-resort catalog inside the chat.
- C.villas: prices and villa selection with the inline Villa Flat Rate control.
- C.ratePlans: remove the standalone comparison and all active 10% references.
- C.calendar: interactive date-range selection.
- C.transportAirports: one editable airport component.
- C.transportTrip: transfer-leg details without airport fields.
- C.guest: one editable two-guest component.
- C.confirmation: booking summary with a working PDF download.

Confirm actual names in the code before editing.

Preserve open/close behavior, focus management, mobile usability, real images, external links, and source-backed booking figures.

Keep the exact existing official checkout URL and its query parameters for this fixed route. Do not send personal details to the URL or navigate there automatically.

Verify in a browser:

- Only the greeting appears initially.
- Agent bubbles are on the left and customer bubbles on the right; Arabic text still reads correctly RTL.
- Customer text drives the prepared assistant replies in order.
- Choosing resorts genuinely exposes and scrolls the page section.
- Choose buttons use the correct resort names.
- Shebara details and villas appear before the guest-count question.
- Villa Flat Rate is the only active rate, directly below the villa selection.
- No 10% offer or old rate-plan question remains.
- One calendar selects both dates and calculates two nights.
- No second question asks how many nights.
- Airport fields appear once; the next component is Transportation Details only.
- Both guests' details are collected in one message and one component.
- Submitted data is retained in the final summary and PDF.
- The avatar and resort-photo background load and remain readable.
- The downloaded PDF opens, contains the current booking, and handles Arabic names correctly.
- No customer-facing demo/test/fiction/simulation wording or DEMO reference remains, including the exported PDF.
- The original confirmed totals remain correct and taxes are not counted twice.
- Repeated clicks do not duplicate messages.
- Closing and reopening preserves the current stage.
- No live AI, actual reservation, or real payment request is made by the local implementation. Only the real email OTP delivery and verification explicitly authorized in Section 16 are added.
- Desktop and mobile layouts have no obstructed controls or clipped components.

Update the README and internal notes to describe the new scripted interaction and any genuine remaining data gaps accurately.

When finished, report the files changed, how to run the page, what you verified, and any missing factual inputs. Do not claim that live booking or payment functionality was implemented.

## 14. ALSO DELIVER THE ENTIRE EXPECTED CONVERSATION AS A SEPARATE PDF

In addition to the booking-summary Download PDF action, generate and deliver a separate complete conversation file:

RSG_Full_Conversation.pdf

This file is for me to read the entire intended journey and know exactly which customer messages to type and which component actions to perform.

Requirements:

- Include the complete canonical conversation, from the first greeting to the final closure.
- Include every customer message in full, not only agent replies or a conversation outline.
- Use exactly the same Saudi Arabic wording, order, facts, prices, and branch as the implemented replay.
- Derive the PDF from the same canonical transcript/state data used by the replay. Do not maintain a second inconsistent script.
- Show the agent's messages on the left and the customer's messages on the right.
- Preserve correct Arabic shaping and RTL reading order, with Western digits and the localized component names and labels required by Section 19.
- Include readable rendered rich components at the appropriate points: selected resort, villas with the inline Villa Flat Rate choice, calendar range, booking summaries, transportation selection/details, activities, combined guest form/details, payment card, and final confirmation.
- Do not restore the removed multi-resort chat catalog, the 10% offer, separate rate-plan cards, a second nights question, or repeated airport fields.
- The resort-navigation moment should be represented clearly. Add a brief action annotation or a relevant image showing that the customer chooses Shebara from the webpage, rather than inventing a resort-catalog message.
- Where a calendar, selection button, or form submission generates a customer message, include the exact resulting message. Add any necessary click/fill instruction as an annotation outside the chat bubbles, not as something the agent supposedly said.
- Include the correct official payment link as a clickable link in the PDF.
- Use the canonical customer details established for this journey. Apply the latest approved-contact requirements in Section 15; do not retain old placeholder contact details or export values that differ from the implemented journey.
- Do not add Demo, Test, Fictional, Simulated, افتراضي, اختبار, or equivalent labels, or the removed DEMO reference.
- Export an actual valid PDF with readable type, embedded/working fonts, suitable margins, intact components, and sensible page breaks. Do not clip Arabic text or cut card rows between pages.
- Open and inspect the generated PDF before delivery. If PDF inspection is unavailable, report the exact limitation.

These are two separate deliverables:

1. A booking-summary PDF downloaded from the final booking card.
2. RSG_Full_Conversation.pdf, containing the full expected conversation and supplied directly in your final response.

Also keep an editable full-transcript source alongside the project, and provide the final PDF's exact file path/link when reporting completion.

## 15. NATURAL PACING, WARMER CONCIERGE COPY, VISIBLE BACKGROUND, AND BELIEVABLE CONTACT PRESENTATION

Apply these refinements to the implemented conversation and refresh the full-conversation PDF afterward.

### A. Natural response timing and a visible typing state

The replies currently appear too quickly and consecutive messages feel instantaneous.

The current deliver() function in js/chat.js uses approximately 450 ms before a text reply and 250 ms between items. Inspect the current code and replace this pacing with a controlled sequential delivery queue.

Suggested configurable starting ranges, to adjust after experiencing the flow:

- Brief reading/acknowledgement pause after the customer submits: about 600–1,200 ms.
- Short assistant reply: about 1.5–2.5 seconds of typing.
- Normal reply: about 2.5–4.5 seconds of typing.
- Longer explanation: about 4.5–7 seconds, with a sensible maximum.
- Gap between separate assistant messages: about 900–1,800 ms before the next reply's typing begins.

Base typing duration on message length and context, with modest variation. Do not give every reply exactly the same delay or make a short acknowledgement wait excessively.

Show the existing left-aligned typing bubble or a restrained "يكتب..." indicator for the meaningful typing interval.

Deliver one message at a time:

1. Reading pause when applicable.
2. Typing state.
3. One completed assistant message.
4. Its associated rich component at the intended point.
5. A natural pause.
6. Typing for the next assistant message, if another is needed.

Do not insert an entire multi-message reply or all its future components at once. Do not show a rich component before the message that introduces it.

Treat an individual rich component as one coherent unit; do not apply a separate typing delay to every villa row or field inside a card.

Keep the existing scripted state machine and booking route. Do not add an LLM connection to achieve this effect.

Allow the customer to draft the next message while the assistant replies, but prevent duplicate sends and premature stage advancement. Never silently erase or lose a typed draft.

Resetting the conversation must cancel pending timers/queue callbacks so replies from an earlier run do not appear in the new conversation.

Closing and reopening must preserve the stage and must not cause duplicate messages or a burst of pending replies.

Respect reduced-motion preferences by reducing animation, not by setting all response delays to zero.

Do not force-scroll the customer to the bottom while they are reviewing earlier messages. Follow new replies when they are already near the bottom.

Keep delays centrally configurable. PDF generation should render the canonical transcript directly without waiting for real-time typing delays. Do not speed up the visible conversation just to accelerate PDF export.

### B. Warmer Saudi Arabic for luxury guests

Review the whole conversation and rewrite stiff or repetitive responses.

The concierge should feel attentive, welcoming, discreet, and polished when assisting a premium guest and his wife.

- Use natural Saudi Arabic with respectful, relaxed wording.
- Show care for their preferences without sounding overly familiar.
- Use the customer's name occasionally, not in every reply.
- Vary acknowledgements instead of repeating "تمام" or "اختيار مميز" mechanically.
- Keep each message concise and useful.
- Separate an acknowledgement and a detailed follow-up into distinct messages only when it improves the conversation, using the new timing.
- Avoid exaggerated flattery, repetitive "ذوق رفيع", aggressive sales language, and excessive emojis.
- Do not promise upgrades, private services, guaranteed availability, or amenities not established by the sources.
- Do not call the customer "Class A" in the interface.

Examples of tone, not lines to repeat mechanically:

"يا هلا فيك يا خالد، يسعدني أرتّب لك ولزوجتك إقامة تناسب اللي في بالكم."

"على راحتكم، نخلي الأنشطة بدون إضافة الآن، وفريق المنتجع يساعدكم تختارون الأنسب وقت الإقامة حسب التوافر."

Keep the existing booking facts, required fields, revised component order, and user choices intact.

### C. Make the resort background clearly visible

The current chat background uses an approximately 90% opaque light overlay, which almost hides the photo.

Use the existing real resort image, but make the photograph clearly recognizable in the chat viewport.

- Reduce the full-area wash substantially; a light overlay around 25–45% is a reasonable starting point to inspect visually.
- Adjust crop and positioning so recognizable resort features remain visible.
- Keep the image anchored to the visible conversation area rather than stretching its crop across the entire accumulated transcript height.
- Avoid heavy blur or another nearly opaque layer.
- Keep message bubbles and rich components sufficiently solid for easy reading.
- Preserve the visible photo in the gaps around and between messages.
- Verify the result on desktop and mobile rather than relying on opacity values alone.

Do not sacrifice Arabic text contrast or readability to reveal the image.

### D. Phone number and email should use normal, approved contact values

Remove conspicuous placeholder values from the customer journey and generated conversation PDF, including:

- 5x xxx xxxx and similar X-filled phone strings.
- 50 123 4567 and other obviously sequential placeholder numbers.
- khalid@example.com, khalid.demo@example.com, test addresses, and similar sample-looking values.

Use the actual mobile number and email address I choose for this presentation. If I have not supplied them, ask me for both together in one concise question. Continue independent timing, styling, and copy work while waiting.

Do not invent a random address on a real email provider or a random valid-looking telephone number that could belong to someone else. Do not pull unrelated real contact information from my machine or other documents.

Phone presentation:

- Show the approved number in normal readable international formatting.
- Keep the Saudi +966 code where applicable.
- Validate the input appropriately instead of accepting letters.
- Do not replace the approved digits with X characters in the normal guest review and PDF.
- Use a neutral field placeholder such as "Mobile Number" rather than an obviously fabricated sample number.

Email presentation:

- Use the approved email exactly as entered.
- Use a neutral input placeholder such as "Email address".
- Carry the same address through the guest form, review, payment-related copy where relevant, and both PDFs.
- Normal partial masking in the verification instruction is acceptable; it must be derived from the approved address, not from a hardcoded sample.

Do not send SMS, contact any unapproved address/number, or append these details to an external checkout URL. The real email OTP delivery specifically authorized in Section 16 is the exception to the earlier no-email requirement.

### E. Replace the obvious verification-code placeholder

Remove obvious patterns such as 123456, 000000, and 111111. Section 16 supersedes the former configured-code approach: generate an actual server-side, expiring email OTP for each verification request. Never put a fixed accepted code or an expected live OTP in client-side script or the PDF.

Display the verification field with polished digit spacing or six clean input cells. Accept Arabic and Western numerals appropriately.

Implement actual code delivery and verification as specified in Section 16. Do not claim that changing the displayed code alone implements authentication.

Do not add a customer-facing "use this test code" hint or any of the previously removed demonstration labels.

This request concerns the verification code. It is not permission to invent a real RSG reservation number or a genuine payment transaction identifier.

### F. Refresh outputs and verify the combined result

After the copy and approved contact values are finalized:

- Regenerate RSG_Full_Conversation.pdf with the exact updated conversation and verification sequence; do not print an actual live OTP.
- Keep the booking-summary PDF synchronized with the submitted customer details.
- Preserve agent messages on the left and customer messages on the right.
- Preserve Villa Flat Rate only and all previous structural changes.
- Preserve the previously requested absence of customer-facing demonstration/test/simulation labels.
- Verify naturally paced consecutive replies, typing visibility, reset behavior, preserved drafts, and mobile background visibility.
- Report exactly what remains missing if the approved mobile number or email address has not yet been supplied.

## 16. LATEST UPDATE: RESORT SPOTLIGHT, VOICE EXTRACTION, REAL EMAIL OTP, AUTOMATIC PAYMENT CONTINUATION, AND RSG PDF IDENTITY

This section takes priority over conflicting older instructions. Implement these changes in the existing project.

The approved email-verification recipient is:
muhammed.baz@clouding.ai

The email field must still be entered manually. The availability of this address in configuration is not permission to autofill it during voice extraction.

### A. Brief AI focus frame over the resort cards

When the assistant scrolls the webpage to the Resorts section:

1. Slightly dim the surrounding page.
2. Draw an elegant AI-style focus frame around a resort card, not around the entire page or a large unrelated region.
3. Show a subtle animated indicator moving between the visible resort choices to demonstrate where the customer can choose.
4. Apply the updated, longer indicator timing in Section 17. Do not remove the dimming and focus treatment on a short timer.
5. Keep the actual Choose buttons available and the surrounding page dimmed until a resort is selected, as specified in Section 17.

Use a premium, restrained treatment compatible with Visit Red Sea: a fine aqua frame, soft glow, or focus corners. Do not add a large explanatory modal or flashy effects.

Important interaction details:

- The decorative pointer is not the actual mouse cursor. Never move or hijack the customer's cursor.
- Do not automatically click or select a resort.
- Keep the focused card readable and undimmed while the rest of the page is darker.
- If using a moving spotlight, move its cutout/frame correctly from card to card.
- Use actual rendered card bounds, including scroll offsets and responsive layout.
- Animate only visible choices or bring the intended visible region into view without pointing at offscreen elements.
- Keep Choose buttons clickable during the effect. Decorative layers must not intercept pointer events.
- On selection, immediately remove the guidance overlay and continue to the selected resort's chat details.
- Clean up on resize, Escape, reset, and leaving this stage.
- Respect reduced motion using a brief static highlight instead of moving guidance.
- On mobile, expose the page through the existing chat-minimization behavior so the cards are actually visible.

Section 17 supersedes the earlier short-lived orientation cue: the moving indicator should have a longer, deliberate pass, while the dimmed surround and focus treatment persist until a choice or explicit cancellation.

### B. Record a voice message and populate guest information

At the step for the customer and his wife, ask for their details through a voice recording.

The agent's message should mean, in warm Saudi Arabic:
"إذا يناسبك، أرسل لي بياناتك وبيانات زوجتك برسالة صوتية، وأرتّبها لك هنا للمراجعة."

Implement a real microphone recording control with:

- An explicit Record action.
- A clear recording state and duration.
- Stop and playback controls.
- A Send voice message action.
- A customer-side audio bubble with the actual recorded duration and playback.

Request microphone permission only after an explicit user action. Stop microphone tracks after recording or cancellation. Do not show a successfully sent recording if no audio was captured.

After the voice message is sent:

- Show the normal processing/typing state.
- Populate the combined guest-information rich component.
- Keep the already-known first name and populate the remaining spoken details.
- Populate the customer's relevant title/name/phone fields, the wife's names, and requests actually included in the prepared voice scenario.
- Leave Email completely empty.
- Ask the customer to review the populated fields and manually add the email address.

Every field populated from the voice step should receive a small, tasteful "AI extracted" badge or AI icon immediately beside it.

- Do not badge the email as extracted.
- Do not badge manual corrections as if they still came unchanged from extraction.
- Keep populated fields editable for review.
- Distinguish a first name remembered from earlier conversation from a newly extracted field where relevant.
- Do not automatically opt into marketing based on the recording.

The user explicitly allows assuming that the recording contains all the required prepared information except email. For this existing scripted journey, a configured extraction mapping is acceptable; a new paid transcription/LLM service is not required.

Keep the recording real and the field-population interaction real, but do not introduce an unrequested external audio upload or claim in developer documentation that a fixed mapping performs general-purpose speech recognition.

Use the approved guest/phone values prepared for this journey. If the expected spoken details or approved phone number are missing, ask me for them. Do not populate unrelated personal details or invent a telephone number.

Do not replace a manually entered email with the configured OTP recipient. The customer must enter muhammed.baz@clouding.ai himself for this prepared flow.

Handle denied microphone permission and unsupported recording with a clear retry/manual-entry alternative. Preserve the collected information.

### C. Actually send and verify an email OTP

This is a real integration requirement. An on-screen "sent" message or accepting any six digits is insufficient.

The existing code accepts a six-digit string without verifying it against an emailed server-generated challenge. Replace that shortcut.

Use the existing authorized email infrastructure if configured, or add the smallest suitable server-side email capability using an authorized SMTP account or transactional email provider.

If sender configuration or credentials are not available:

- Ask me specifically for the provider/SMTP configuration and approved sender.
- Explain how I should supply secrets through server-side environment variables.
- Continue the independent UI, voice, payment-timer, and PDF work.
- Do not fabricate a successful send, silently fall back to a console-only code, or expose provider keys in the browser.

Required behavior:

1. The customer manually enters muhammed.baz@clouding.ai and submits/approves the guest information at the appropriate verification stage.
2. An explicit verification action requests the OTP from the server.
3. The server generates a random six-digit code, associates it with the current verification challenge/session, and sends it to muhammed.baz@clouding.ai.
4. The interface shows successful submission to the email provider only after a genuine successful response.
5. The customer enters the code received in that mailbox.
6. The server verifies that exact unexpired code for the correct challenge.
7. Continue to payment only after successful verification.

Use an approved, verified sender/account. Do not spoof Red Sea Global's sending address or claim that the email originated from an RSG system.

Implementation requirements:

- Keep SMTP/API credentials, accepted OTPs, and verification logic on the server.
- Do not return the OTP in the browser response, put it in query strings, or print it to customer-visible logs.
- Apply a short expiry, such as 5 minutes, a reasonable attempt limit, and a resend cooldown.
- Consume a verified challenge so it cannot be reused.
- Invalidate earlier codes when a replacement is issued.
- Tie verification to the email and current challenge; changing the email invalidates the verified state.
- Restrict this prepared integration's recipient to the explicitly approved address unless I authorize another address.
- Normalize Arabic/Western digits and show clear incorrect/expired-code feedback.
- Prevent duplicate sends from rerenders, double clicks, resets, or passive navigation.
- Do not send email while generating screenshots or either PDF, or as a side effect of an automated full-conversation export.
- Do not automatically send an email during implementation just to prove connectivity. After configuration, let me explicitly trigger the app's verification action to check the real mailbox.

Keep the delivery distinction accurate: a provider accepting a send request is not proof the message arrived in the inbox. Report what was actually tested.

No production deployment or broad authentication system is requested. This exception authorizes only the minimal real email-delivery and OTP-verification capability needed for this flow.

### D. Proceed to Payment automatically advances after about five seconds

Remove the requirement for the customer to type "تم الدفع", "دفعت", or another payment-completed message.

On the first Proceed to Payment click:

- Preserve the existing official checkout link and open it through the normal explicit click action.
- Start one approximately 5,000 ms timer in the local conversation.
- Do not send another agent message during that initial interval.
- After that interval, automatically deliver the prepared payment-verified acknowledgement, then the final booking confirmation and warm closure.
- Natural wording can mean:
  "تم التحقق من الدفع يا خالد، وتفاصيل إقامتكم صارت جاهزة. أتمنى لك ولزوجتك إقامة جميلة في Shebara."
- Keep the final booking card and Download PDF available.

This continuation remains part of the existing scripted journey. The timer is not an actual payment-provider verification response.

Do not add a real payment integration, interrogate or scrape the official checkout page, request card details, or claim in technical documentation that five elapsed seconds verifies a real payment.

Preserve the requested absence of customer-facing demonstration labels.

Timing/state requirements:

- Trigger only after the button is actually clicked, not when the payment card renders.
- Do not require a customer "paid" message afterward.
- Do not append an invented customer message saying he paid.
- Do not run multiple timers after repeated clicks.
- Cancel stale payment timers on a new conversation.
- Preserve pending state if the chat is closed/reopened.
- Account for the official checkout opening in another tab: on return, complete an elapsed continuation once without duplicate messages.
- Avoid stacking another long generic typing delay on top of the five-second wait.
- Keep the revised payment transition in the editable transcript and full-conversation PDF.

### E. Apply Red Sea Global corporate identity to the final booking PDF

Restyle the final downloaded booking-information PDF with Red Sea Global's identity.

Use:

- The actual Red Sea Global corporate logo.
- Source-backed RSG corporate colors and appropriate available typography.
- A premium header and restrained footer.
- Clear booking-summary hierarchy, generous spacing, and tidy financial rows.
- The correct resort image or Shebara mark where suitable as secondary content.

Do not confuse Red Sea Global's corporate identity with the Visit Red Sea destination logo or the Clouding presentation identity.

Search the existing presentation, brand research, supplied assets, and official source references for the correct logo and visual assets. The currently inspected website logo folder contains Visit Red Sea/Shebara assets; verify whether an RSG corporate logo exists elsewhere before assuming it is available.

If the necessary RSG asset is unavailable or cannot be confidently identified, ask me for that exact file. Do not draw a lookalike logo.

Preserve all current-state booking details:

- Shebara, One Bedroom Overwater Villa, Villa Flat Rate.
- 23–25 October 2026, 2 nights, 2 adults.
- Reviewed guest and spouse information.
- Manually supplied email address and approved phone number.
- Correct arrival/departure transfers.
- Accommodation SAR 28,980.00.
- Transfers SAR 4,813.90.
- Grand total SAR 33,793.90.
- No paid activities.

Keep it a booking-summary document. Do not invent a real RSG booking reference, tax-invoice identifier, signature, or payment-provider transaction number.

Ensure Arabic guest names, images, fonts, margins, and page breaks render correctly. Keep a genuine downloadable PDF and inspect the exported result.

### F. Refresh the full-conversation PDF and verify the new sequence

Regenerate RSG_Full_Conversation.pdf from the updated canonical flow, including:

- The latest AI guidance over the webpage resort cards, with persistent dimming until selection, represented by a suitable visual/action annotation.
- The voice-recording action and customer audio-message representation.
- The prepared voice content or a readable transcript annotation for review.
- Automatically populated guest fields and their AI extracted markers.
- The Email field remaining empty until manually entered.
- The real email-verification step, without displaying or baking in an actual live OTP.
- An instruction to enter the code received by email, rather than a hardcoded accepted code.
- Proceed to Payment followed by the approximately five-second automatic agent continuation.
- No customer message saying payment was completed.
- The final RSG-branded booking summary.

Do not trigger actual OTP emails or microphone recording merely to generate this PDF.

Check that existing left/right message placement, Saudi Arabic tone, visible resort background, natural typing, and previous structural changes remain intact.

In your final report, distinguish what was completed locally from what still needs email configuration, an approved phone/voice scenario, or an official RSG branding asset. Do not claim real inbox delivery or end-to-end verification without the corresponding test.

## 17. LATEST CORRECTIONS: PERSISTENT RESORT SPOTLIGHT, EMAIL CONNECTIVITY FIX, AND COMPOSER MICROPHONE

This section takes priority over any older instruction about a brief self-dismissed spotlight or a recording control inside a chat message.

Implement these changes in the existing project, preserving all previously approved behavior.

Latest screenshot:
D:\Clouding\RSG\evidence\mockup_references\04_email_server_unreachable_file_origin.png

### A. Navigate to the actual resort cards, not above the section

The current navigation lands slightly above the resort cards. Fix the actual scroll target and offset.

The inspected revealChoose() function in js/chat.js currently uses the outer resortsSection top minus 16 pixels. That is not necessarily the top of the cards themselves.

- Target the rendered resort-card rail or visible card bounds, not merely the section heading/container.
- Minimize the chat as required, then calculate the final geometry after layout has settled.
- Account for any sticky header and its actual height.
- Bring the card images, names, and Choose controls into a clear usable viewport.
- Avoid leaving a large band of heading or empty space above the actual resorts.
- Do not hide the Choose controls below the viewport.
- Use responsive calculations rather than a hardcoded scroll value that only works at one screen height.
- Align the spotlight only after scrolling settles and relevant image/layout changes are accounted for.
- Verify the result in a real browser on desktop and mobile.

Keep the page's resort carousel usable, including its horizontal navigation. Do not automatically choose Shebara.

### B. Longer indicator, persistent dimming until selection

The current js/spotlight.js automatically calls stop() after a short pass. Change this lifecycle.

The intended behavior:

1. Scroll precisely to the resort cards.
2. Dim the rest of the webpage while keeping the resort choices readable.
3. Show the AI focus frame on the actual resort-card area.
4. Move the indicator more slowly between the visible choices, giving the customer time to understand.
5. Keep the dimming and active focus treatment in place until the customer chooses a resort.
6. Once the customer chooses, immediately remove the effect and resume the chat.

Use a configurable dwell of approximately 1.5–2 seconds per visible card, with an overall introductory pass around 6–10 seconds where the number of visible cards permits. Adjust visually to avoid rushed movement.

After the moving pass, the indicator may become a subtle stationary cue. Do not remove the page dimming or the focus treatment because its introductory animation finished.

Do not create an endless fast-moving pointer loop.

Separate these responsibilities in code:

- Pointer-animation lifetime.
- Spotlight/dimming lifetime.
- Resort-selection stage lifetime.

Only selection or explicit cancellation/reset of this stage should clear its dimming.

Keep the focus frame correctly attached to the visible resort cards during:

- Window resize.
- Vertical page scroll.
- Horizontal carousel scroll.
- Mobile layout changes.

Decorative overlays must not block the Choose buttons, carousel arrows, scrolling, or keyboard access.

Do not dim the intended resort choices themselves. Avoid an opaque rectangle or a cutout at stale coordinates.

Retain cleanup for reset and cancelled navigation. Reduced motion should remove pointer animation, not automatically dismiss the persistent selection focus.

### C. Fix the real email problem at its source

The screenshot shows the page opened directly as:
file:///D:/Clouding/RSG/visitredsea-chat-mockup/index.html

It displays:
"The server could not be reached. Please try again."

The inspected frontend posts to relative endpoints:

- /api/otp/request
- /api/otp/verify

The existing server.py serves both the website and those endpoints, and provides:

- GET /api/otp/status

The current README still tells the user to run python -m http.server. That server serves files but does not implement the OTP API.

Treat this as a concrete origin/startup problem to correct first. Do not assume it is an email-provider failure, a spam-filter issue, or a fixed problem merely because a message says "sent".

Required corrections:

1. Establish one working launch path using the actual server.py backend.
2. Serve the UI and API from the same HTTP origin.
3. Document and verify the actual local address, normally http://127.0.0.1:8080/.
4. Correct stale README instructions that launch a static-only server for the OTP flow.
5. Add a convenient Windows startup helper if useful so I can launch the backend and open the correct HTTP URL without double-clicking index.html.
6. Detect file:// usage and provide a clear way to open the correct running local website. Do not silently attempt OTP fetches against a file origin.
7. Check /api/otp/status before claiming the verification service is ready.

The current server can be started from the project directory with:

    python server.py

or with an explicit port:

    python server.py 8080

Inspect the actual runtime before assuming the default port is free or that the correct process owns it. Do not terminate unrelated processes to free a port. If another server is in use, choose and document an appropriate available port.

Keep the API relative to the actual serving origin. Do not introduce arbitrary cross-origin URLs, wildcard CORS, disabled browser security, or hardcoded addresses that break on a different port.

Then verify SMTP configuration separately.

The current server reads these environment variable names:

- OTP_SMTP_HOST
- OTP_SMTP_PORT
- OTP_SMTP_USER
- OTP_SMTP_PASSWORD
- OTP_SMTP_FROM
- OTP_SMTP_SECURITY
- OTP_ALLOWED_RECIPIENTS

It reads process environment variables; do not assume that merely creating a .env file loads those values. If a .env-based workflow is intended, implement/configure loading appropriately or make the startup helper provide the environment correctly.

Do not expose credentials in frontend code, screenshots, logs, source-control commits, or the chat. Ask me to supply missing credentials through the appropriate local secret configuration.

Keep muhammed.baz@clouding.ai as the authorized recipient.

Distinguish the actual error cases:

- Backend unreachable or wrong origin/port.
- A static server running without the API.
- Email service not configured.
- SMTP connection/authentication/sender failure.
- Recipient rejected.
- Send request accepted by the provider.
- Incorrect or expired OTP.

Do not collapse HTML 404/unsupported responses, JSON parsing failures, configuration errors, and provider errors into one misleading "server could not be reached" message.

Provide concise, useful customer-facing feedback and sanitized diagnostic details for development. Do not add customer-facing demo/test labels.

The tools/local_smtp_sink.py helper is a local testing sink; success against it does not establish that email reached my real mailbox. Do not use that as the final solution or claim it proves live delivery.

Keep real sending initiated by my explicit Send code action in the app. Do not send emails on page load, health checks, screenshots, or PDF generation.

After the correct server and mail configuration are available, let me trigger a send and verify the actual received code. Report provider acceptance and confirmed inbox receipt as separate observations.

Do not bypass server verification or accept any arbitrary six-digit code to make the flow appear fixed.

### D. Put the microphone permanently beside Send

Move the voice recording entry point into the fixed chat composer, immediately next to the Send button.

- The microphone button is always present throughout the conversation, not inserted when a certain assistant message appears.
- It should match the size, spacing, and visual style of the Send control.
- Give it an appropriate microphone icon, accessible name, visible focus state, and touch target.
- Make it a non-submit button so clicking it does not accidentally send text.
- It must work on desktop and mobile without covering the textarea or Send button.

Completely remove the old Record button and recording-control rich card from the message stream. Do not merely hide one copy while leaving duplicate entry points or focusable hidden controls.

The assistant can still ask for the guest details by voice in a normal message. That message must not contain a separate Record CTA.

Expected composer interaction:

1. Click the persistent microphone button.
2. Request microphone permission through that explicit action.
3. Show the recording timer/state in a compact composer-level area.
4. Stop the recording.
5. Allow playback, cancellation/re-recording, and sending from the composer.
6. Once sent, show the actual audio message in the customer's right-aligned chat bubble.

The message history should contain the sent voice message and its playback control, not a recorder UI.

Preserve the existing voice-assisted information behavior:

- At the guest-details stage, sending the voice message populates the prepared guest and spouse information.
- AI extracted markers appear beside the appropriate populated fields.
- Email stays empty for manual entry.
- Manual corrections remain possible.

The microphone should be usable when the customer chooses to record, rather than existing only at the guest-details stage. Do not incorrectly run the guest-information extraction or advance that stage when a recording is sent during an unrelated stage. Preserve sensible stage handling without inventing general speech recognition.

Preserve any text draft while recording, cancelling, or receiving an agent reply.

Prevent simultaneous recordings, duplicate voice sends, empty recordings, or accidental text submission while the composer is in audio-send mode.

Stop microphone tracks on stop/cancel/reset/close as appropriate. Clean up pending recordings and unused object URLs without breaking playback of already sent audio messages.

Denied permission or unsupported recording should leave normal text entry usable and provide a concise retry option.

### E. Update documentation, PDFs, and verification

Update the full-conversation PDF and its action notes:

- The spotlight remains until resort selection.
- The page is aligned to the actual resort cards.
- Recording starts using the microphone beside Send.
- Remove instructions to click Record inside a message/card.
- Show the received-code step without exposing a live OTP or sending an email during export.

Correct launch instructions in the README and explain that the real OTP flow requires server.py and configured mail settings.

Verify:

- The resort cards, not a point above them, are the navigation destination.
- The indicator is noticeably slower.
- Dimming persists if the customer waits without choosing.
- Choosing a resort immediately clears the dimming and restores the chat.
- Carousel movement and viewport resizing keep the spotlight correctly aligned.
- The website runs from the correct HTTP server, and /api/otp/status returns the expected JSON.
- File-origin/static-server/configuration/provider failures are distinguished accurately.
- No fake sending or local-sink result is presented as real inbox delivery.
- One permanent microphone sits beside Send.
- No recorder card or Record CTA remains in the chat history.
- Actual audio can be recorded, reviewed, cancelled, sent, and played.
- Guest extraction and the empty manually completed Email field still work.
- All previous timing, branding, PDF, pricing, and left/right placement requirements remain intact.

State exactly what was fixed and what still needs SMTP configuration or a mailbox-delivery check. Do not report the email issue as fully resolved without the appropriate evidence.

## 18. LATEST VOICE UI REFINEMENT: RECORD INSIDE THE TEXT INPUT AREA

This section supersedes any interpretation that places recording controls in a separate area above the chat or composer.

### A. Replace the typing area in place

When I click the persistent microphone button beside Send, turn the existing text-entry area itself into the recording interface.

- Replace the textarea's visible slot with the voice-recording view inside the same composer row.
- Keep it anchored at the bottom where I normally type.
- Do not open a separate panel, popover, floating recorder, extra toolbar above the composer, or rich card in the message stream.
- Keep the composer footprint stable and responsive, without a sudden large height jump or displaced chat history.
- Preserve any existing text draft and restore it if I cancel the recording.

### B. Show that the microphone is actually receiving sound

The recording view should contain:

- A clear active-recording indicator.
- An elapsed-time counter.
- A live waveform or level bars.
- Stop and cancel/delete controls.
- The existing Send action when a recording is ready.

Drive the waveform/level animation from the actual microphone signal, using the captured stream and a suitable audio-level analysis method such as Web Audio AnalyserNode.

- Bars should respond more strongly when I speak louder.
- The visualization should settle near its baseline during silence.
- Use smooth, restrained motion suitable for the existing premium interface.
- Do not substitute continuously random bars that animate identically with no microphone signal.
- A recording timer alone does not satisfy the sound-response requirement.
- Show the active state only after microphone permission is granted and recording has actually started.
- Do not show a successful audio-reception state if access is denied or no stream is available.

This is audio recording and visualization, not a request to introduce live speech transcription or a new external AI provider.

### C. Keep the entire recording lifecycle in the same slot

Use the following sequence:

1. Normal textarea with the persistent microphone beside Send.
2. Microphone click: the textarea area becomes the live recording view.
3. While recording: show elapsed time and microphone-responsive waveform.
4. Stop: show a compact recording preview with playback and duration in that same area.
5. Cancel/delete: discard the recording and restore the normal text input and its draft.
6. Send: post one right-aligned customer audio message, restore the normal composer, and continue the existing stage-specific handling.

Keep sending and stopping unambiguous. Do not send an unfinished or empty recording or append the audio bubble more than once.

Preserve the existing guest-information extraction behavior, AI extracted markers, and manually entered email.

### D. Cleanup and verification

- Stop microphone tracks when recording ends or is cancelled.
- Cancel animation frames and disconnect/close audio-analysis resources appropriately.
- Do not leave the microphone active after reset or closing the chat.
- Retain audio data needed for playback of a sent message.
- Make controls keyboard accessible and respect reduced-motion settings while keeping the recording status clear.
- Verify desktop and mobile layout.
- Test that speaking changes the waveform, silence settles it, and the saved recording can actually be played.
- Update the full-conversation PDF/action notes to describe recording in the text-input area, removing any older separate-recorder instructions.

Preserve all other approved conversation, branding, pricing, email, PDF, and navigation behavior.

## 19. LATEST UPDATE: ARABIC COMPONENTS, VISIBLE WAITING MESSAGE, AND AI-ADDED CHOOSE CONTROLS

This section supersedes earlier instructions to keep rich-component labels and descriptions in English. Preserve all other approved behavior.

### A. Arabic components with Western digits

Translate the customer-facing rich components into polished, natural Arabic.

Include:

- Resort details and accommodation features.
- Villa selection and rate labels.
- Calendar month/day labels, arrival/departure summaries, and number of nights.
- Booking-summary titles, rows, and tax-inclusion wording.
- Transportation modes, airport labels, route descriptions, and transfer details.
- Activity descriptions and price-basis wording.
- Guest and spouse field labels, required/optional wording, and extraction markers.
- Email-verification instructions, errors, and resend/countdown labels.
- Payment, confirmation, download, and other component buttons.

Use source-verified Arabic resort and place names where available. Translate descriptive accommodation names accurately. Do not invent an official Arabic brand name when none is established; request that particular naming input if necessary.

Keep official logo artwork intact, and preserve email addresses, URLs, and international identifiers in their normal readable format.

Western digits 0–9 must remain throughout the visible components and PDF output. Do not convert them to ٠–٩ or Persian numerals.

Examples:

- Booking Summary -> ملخص الحجز
- Arrival / Departure -> الوصول / المغادرة
- Guest information -> بيانات الضيوف
- AI extracted -> استُخرج بالذكاء الاصطناعي
- Choose -> اختر
- Download PDF -> تحميل ملف PDF
- Dates -> 23–25 أكتوبر 2026
- Total -> 33,793.90 ريال سعودي

The PDF file-format abbreviation may remain PDF; it identifies the actual downloadable format.

Keep the booking calendar Gregorian. Localization must not switch October 2026 into a Hijri calendar or change the actual stay dates.

Use RTL layout for the Arabic components. Isolate numbers, amounts, phone numbers, email addresses, and URLs appropriately so their characters do not reorder.

Do not change the physical speaker placement: assistant left, customer right.

Translate display strings, not JavaScript component keys, property IDs, API fields, checkout parameters, or source identifiers. Preserve matching for the prepared conversation and its existing valid selections.

This request does not require replacing the entire underlying homepage with a different language/version. Localize the chat's components and the assistant-added page controls/status while preserving the reference page.

### B. A clear persistent message while awaiting resort selection

When the assistant navigates to the resort cards, clearly tell the customer that the assistant is waiting for them to browse and choose.

Use natural Saudi Arabic in the agent's chat reply, with wording such as:

"خذ راحتك يا خالد في تصفّح المنتجعات، أنا بانتظار اختيارك. إذا شدّك منتجع، اضغط «اختر» ونكمل تفاصيله مع بعض."

In addition, show a clearly visible status message on the page while the chat is minimized:

بانتظار اختيارك للمنتجع

Supporting text can mean:
تصفّح الخيارات واضغط «اختر» على المنتجع اللي يناسبك.

Requirements:

- It must remain visible during the resort-selection stage, not disappear as a brief toast.
- It must be readable while the rest of the page is dimmed.
- Keep it close enough to the highlighted selection area to make its purpose obvious.
- Do not cover card names, Choose buttons, carousel arrows, or the main focus region.
- Make it work on mobile when the chat is minimized.
- Remove or update it immediately after selection, then continue the conversation.
- Do not display it on initial page load or outside the resort-selection stage.

Preserve the longer guidance indicator, precise scroll alignment, and persistent dimming required by Section 17.

Do not label waiting for the customer as "typing" or imply the assistant is still searching.

### C. Mark Choose with an icon only

Beside each temporary اختر button, retain only a small, restrained AI/sparkle icon.

Remove the visible phrase "أضافه المساعد" and its text-badge container. Do not replace it with another visible caption or an "AI" text label.

Keep a concise accessible description or optional tooltip where helpful, without adding visible explanatory text next to the button.

Keep the icon styling premium and compatible with the existing aqua focus treatment.

Lifecycle:

- The original homepage loads without these contextual controls.
- Entering resort selection reveals اختر and its adjacent AI/sparkle icon together.
- All currently selectable resort cards receive the same treatment.
- Selecting a card sends its actual resort identity to the conversation.
- Exiting/resetting the selection stage removes the assistant-added controls and icons.
- Preserve the underlying original resort-card actions.

Do not recommend one resort through this marker or describe the experience as a demo/test.

Keep the button and icon placement clean on small screens and keyboard accessible. The decorative icon must not trigger duplicate selections.

This change applies specifically to the marker beside اختر. Do not remove unrelated guest-field extraction indicators.

### D. Update PDFs and check consistency

Regenerate the full-conversation PDF using the localized components and updated waiting message. Show the assistant-added Choose control in any relevant resort-selection illustration.

Localize the final RSG-branded booking-summary PDF consistently, retain Western digits, and verify Arabic text shaping and page layout.

Check:

- No obsolete English component headings or field labels remain.
- All visible numbers use 0–9.
- Dates and totals are unchanged.
- The calendar remains Gregorian.
- The waiting message stays visible until resort selection.
- Every temporary اختر button carries its adjacent assistant-origin marker.
- Controls/status disappear appropriately after selection/reset.
- No previously removed discount, duplicate airport form, extra nights question, or demonstration label has returned.
