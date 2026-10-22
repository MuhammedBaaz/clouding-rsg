# Quiet Tide / هدوء البحر

A separate design proposal for Clouding's RSG concierge. Neither existing website was edited.

Updated rich-component backgrounds: soft aqua and warm sand gradients across the full set, with deep teal payment/confirmation cards and subtle supplied-photo layers. The board and chat share the same styles.

Open `http://127.0.0.1:4175` while the preview server is running. To restart, run `Start-Preview.ps1` or `node server.cjs` in this folder. `index.html` also opens directly for the board; the local server enables the PDF download to use the latest saved guest edits.

- **المكونات:** all 15 component groups, each with an Arabic state selector.
- **داخل المحادثة:** clickable booking journey, stage shortcuts and 472 / 390 / 360 widths. Start from **البداية** for the greeting. Default opens at resort suggestions.
- **ملف الرحلة:** printable A4 RSG layout and PDF download.
- **تسليم التصميم:** inspectable tokens, mapping, links and integration limits.

The email-completed state uses the supplied email. In the journey, voice populates the coordinated form with the recorded guest data **except email**; enter it manually. The review editor preserves values and supports save/cancel.

Microphone motion is a local visual preview. It never requests the microphone. No speech recognition or email service is connected. OTP boxes never accept a fabricated working code. The external review control **عرض حالة التحقق المكتمل** advances the visual journey. Board payment interaction is local. Only the chat payment action opens the exact official checkout URL, followed by a scripted five-second transition. No purchase or payment verification is performed.

`final-information.pdf` contains the original recorded scenario. Dynamic downloads use the last saved guest data. This is a designed information page, not a live reservation confirmation or payment receipt. Guest edits are stored in this browser's localStorage; no information is sent to an external service by the artifact. See `HANDOFF.md` for detailed source IDs, behavior and missing inputs.

All photographs, logos and Fedra WOFF2 files were extracted from the supplied kit. The kit's original rights context remains in `ASSET-PROVENANCE.md`. No generated or stock resort imagery is used. `vendor/lucide.min.js` is the bundled Lucide distribution; see `vendor/LICENSE`.
