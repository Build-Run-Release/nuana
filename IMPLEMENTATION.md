# Nuana Implementation Status

**Document date:** November 24, 2026

**Validation:** Account isolation, outfit generation, travel capsules, and the private style helper have API regression coverage. Phase 1 context utilities include automated timezone, season, geocoding, forecast, and weather-failure checks.

## Product vision

Nuana recommends complete outfit ideas for people based on mood, presentation preferences, weather, occasion, and the clothing already owned by the user. The product is intended as styling inspiration, not medical advice or a diagnosis.

## Implemented now

### Core experience
- Responsive web interface for desktop and mobile.
- 24 mood choices organized into Bright, Soft, Bold, Deep, and Refined categories.
- 18 curated outfit concepts plus up to 60 local mix-and-match combinations per mood and presentation option.
- Three default recommendations, with up to 12 more ideas available per request.
- “Surprise me” mood selection.
- “Try another” recommendation rotation.
- Saved outfit collection.
- Browser-local preference persistence only after explicit opt-in.
- Clear styling-safety footer for mood-related use.

### Presentation and outfit specificity
- Unisex, women, and men presentation options.
- Specific pieces for tops, bottoms, footwear, and accessories.
- Occasion descriptions for each outfit.
- Mood-to-style mappings.
- Visual color palettes for each outfit.
- Exact outfit names and wear contexts rather than generic descriptions.

### Context controls
- Weather: any, cold, mild, hot, or rainy.
- Occasion: everyday, work, date/dinner, social event, travel, or outdoor.
- Basic wardrobe selection for owned items.
- Context preferences remain in the browser only after storage consent.
- Browser language and IANA time zone, local date/time of day, and hemisphere-aware season.
- Consent-based browser location or user-entered city lookup, with current weather and a three-day forecast.
- Graceful manual-weather recommendations if location, geocoding, or weather services are unavailable.

### Backend
- Dependency-free Node.js HTTP server.
- JSON API for health, moods, recommendations, saved outfits, history, and feedback.
- Static frontend delivery.
- Input validation for mood, presentation, weather, occasion, save payloads, and feedback.
- JSON-file persistence for saved looks, recommendation history, and feedback.
- Basic repetition avoidance.
- Work, outdoor, hot-weather, cold-weather, and rainy-weather recommendation adjustments.
- Full-length 1–14 day travel capsules with wardrobe-aware ranking.
- Local context (time of day, season, temperature, and rain forecast) contributes to recommendation ranking without persisting location.
- A private local stylist helper that interprets mood, weather, occasion, and wardrobe prompts without saving or externally sending them.
- Positive and negative look feedback used to rerank recommendations.

### API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Service status |
| GET | `/api/moods` | Available moods |
| GET | `/api/recommendations` | Generate recommendations |
| POST | `/api/stylist` | Interpret a styling request and return local outfit ideas |
| POST | `/api/travel/capsule` | Generate a 1–14 day travel capsule |
| GET | `/api/saved` | Retrieve saved outfits |
| POST | `/api/saved` | Save an outfit |
| DELETE | `/api/saved/:name` | Remove a saved outfit |
| GET | `/api/history` | Retrieve limited recommendation history |
| POST | `/api/history` | Record an outfit interaction |
| GET | `/api/feedback` | Retrieve account-scoped style feedback |
| POST | `/api/feedback` | Record the user’s style feedback |

## Risk controls included

### Mood and mental health
- Mood is treated as a styling prompt, not a diagnosis.
- The app includes a disclaimer that it is not mental-health guidance.
- Mood choices are descriptive and optional.
- Sensitive or prolonged emotional states are not interpreted or acted upon clinically.

### Gender and identity
- Users select **presentation**, not a medical or legal gender.
- Unisex recommendations are included as the default.
- Men and women options are offered only as practical wardrobe vocabulary.
- The system does not infer identity from a name or appearance.

### Repetition
- Previously suggested outfits are excluded where alternatives exist.
- Refreshing recommendations rotates available outfits.
- A history limit prevents indefinite accumulation.

### Privacy and consent
- Browser preference storage is off by default and requires explicit opt-in.
- No account, camera, or tracking service is required; browser location is optional.
- Consent-based coordinates or a user-entered city are sent to Open-Meteo for weather lookup only and are not persisted by Nuana.
- Saved clothing and outfit data are stored locally or in local JSON files.
- The stylist helper is rules-based, not generative AI. Prompts are processed in the local server request and are not persisted or sent to a third-party service.
- A hosted generative model is not configured. Adding one requires a provider and server-side credentials, explicit opt-in before sharing any prompt or preference, output validation, and a local fallback.

### Responsible recommendations
- No purchase is required or recommended from a retailer.
- Existing wardrobe items are prioritized conceptually by local selection.
- Weather filters reduce inappropriate choices.
- Occasion filters favor practical work or outdoor options.
- Feedback categories avoid invasive or emotional profiling.

## Run the app

```powershell
npm start
```

Open `http://localhost:4173`.

## Implemented next after current MVP

### Phase 1: Reliable personalization
- Create user accounts and device synchronization.
- Replace JSON files with a real database.
- Add authentication and secure sessions.
- Store immutable recommendation and feedback history.
- Add an explicit data export and account deletion flow.
- Let users manage and remove their wardrobe list.
- Improve owned-item matching in the backend rather than only in the frontend.
- Add sizes, fit preferences, accessibility needs, and comfort restrictions.
- Add style preference learning from feedback.
- Add recently worn outfits and no-repeat windows.
- Explain why a recommendation was selected.

### Phase 2: Real-world utility
- Calendar and event planning.
- Travel and packing capsule generation (implemented; named itineraries and rewear planning remain).
- Laundry and re-wear tracking.
- Outfit calendar and planning reminders.
- Seasonal wardrobe planning.
- Sharing a saved look or outfit board.
- Offline frontend caching.
- Push notifications for daily looks.

### Phase 3: Image and shopping capabilities
- Wardrobe photo upload and item extraction.
- Human confirmation and correction for identified items.
- Visual try-on with explicit, consent-based photo handling.
- Brand and product inventory integration.
- Exact size, price, availability, and sustainability metadata.
- One-tap shopping links.
- Clear separation between editorial recommendations and sponsored results.

### Phase 4: Human expertise and premium services
- Human stylist matching.
- Paid event styling reports.
- Seasonal wardrobe audits.
- Travel capsule reports.
- One-time business-trip and wedding styling.
- Optional paid premium preference profiles.

### Phase 5: Operations and trust
- Automated tests for recommendation, feedback, saved-item, and API behavior.
- Structured application logging and monitoring.
- Database migrations and backups.
- Rate limits and abuse prevention.
- Privacy policy, terms, accessibility statement, and responsible-use notice.
- WCAG-focused accessibility review.
- Consent records and data-retention policies.
- Sponsored placement labels and affiliate disclosure.
- Regional climate and cultural dress-code guidance.
- Separate brand moderation and content safety reviews.

## Potential monetization without manipulation

Start with a free useful tier and charge for costly or labor-intensive features:

- Personal wardrobe scanning and extraction.
- Travel capsule planning.
- Calendar-aware and location-aware styling.
- Visual try-on.
- Human stylist consultations.
- Seasonal wardrobe reset reports.
- One-time event styling.
- Family or shared trip wardrobes.

Avoid:

- Paywalls for core safety or accessibility features.
- Dark patterns or urgent scarcity claims.
- Purchases required to complete a basic outfit.
- Mood-based advertising or sensitive-inference advertising.
- Unclear or undisclosed retailer sponsorship.
- Holding user data hostage or making deletion difficult.

## Recommended MVP priorities — implementation status

The following priorities are an explicit implementation sequence. They remain documentation-only and are not exposed as a roadmap view to users.

1. **Persist and secure account data**
   - **Status: Partially implemented; account ownership isolation implemented.**
   - Added account registration, login, logout, scrypt password hashing, HTTP-only SameSite session cookies, account deletion, and account-status UI.
   - Saved looks, history, and feedback are now scoped to the signed-in account; guest data remains in a separate guest scope.
   - Local no-account use remains available.
   - Remaining priority: replace JSON files with a real database and migrations, deploy over HTTPS, add CSRF protection, MFA, rate limiting, and cross-device synchronization.

2. **Improve explanation, feedback, and no-repeat logic**
   - **Status: Implemented for MVP; feedback-aware ranking added.**
   - Each result explains the mood, weather, occasion, and style rationale.
   - Added “Good fit,” “Not my style,” “Too formal,” “Too casual,” “Uncomfortable,” and “Worn” controls.
   - Positive and negative feedback adjusts future ranking; the private style helper can answer weather, occasion, and outfit-constraint requests using local rules.
   - Added session exclusions and a recently-worn history list for repetition control.
   - Remaining enhancement: configurable no-repeat periods and conservative preference ranking from feedback.

3. **Add real weather location only with consent**
   - **Status: Implemented for Phase 1.**
   - Browser time zone and language are detected locally; local time of day is an input to ranking.
   - The location button requires confirmation before browser geolocation; city lookup is an explicit user action when location is refused or unavailable.
   - Open-Meteo current weather and a three-day forecast set the season from the local date and latitude-derived hemisphere, and influence outfit ranking.
   - Coordinates and city searches are not stored; network failures retain manual weather and do not block recommendations.
   - Remaining: monitor live provider availability and independently review deployment privacy/legal requirements.

4. **Add outfit ownership matching**
   - **Status: Implemented for MVP.**
   - Users select owned wardrobe categories.
   - The API ranks recommendations by whether a look contains selected owned-item names.
   - Missing items are optional and are not presented as required purchases.
   - Remaining: size, fit, comfort, accessibility, garment records, and exact ownership confirmation.

5. **Add event and travel planning**
   - **Status: Full requested-length travel capsules implemented; event calendar pending.**
   - Occasion filters cover everyday, work, date, event, travel, and outdoor use.
   - The travel generator now returns one distinct look for every requested day (1–14), uses weather and presentation, and prioritizes selected wardrobe items.
   - Remaining: named event records, calendar consent, dress-code metadata, rewear planning, and laundry tracking.

6. **Add automated tests and database backups**
   - **Status: Partially implemented; expanded API behavior and ownership are tested.**
   - `npm test` validates health, mood, mix-and-match rotation, 1/3/14-day travel capsules, stylist parsing, account isolation, and local-context time/season/weather-fallback behavior.
   - `npm run backup` creates timestamped local JSON backups.
   - Remaining: broader saved-item, feedback, travel, privacy, and deletion coverage; CI; migrations; logs; monitoring; rate limits; encrypted backups; restore automation; and restore drills.

7. **Add explicit legal and privacy documents**
   - **Status: Implemented for MVP.**
   - Added privacy notice and terms pages.
   - Added data export, local data deletion, server data deletion, account deletion, and location-consent copy.
   - Remaining: legal review, retention schedules, consent audit records, accessibility statement, and correction workflow.

8. **Gate visual try-on and commerce**
   - **Status: Safely deferred; not implemented.**
   - No camera, photo upload, visual try-on, sponsored placement, retailer, or affiliate integration exists.
   - It remains gated until consent, deletion, moderation, security, sponsored disclosure, and accessibility controls are demonstrable.

### Priority acceptance principles

- Safety, privacy, deletion, and accessibility remain prerequisites rather than optional later enhancements.
- Mood remains a style preference and is never used as a medical or mental-health assessment.
- Presentation preference remains separate from identity, with unisex as an equal first-class option.
- Recommending from owned clothing takes priority over recommending new products.
- Automatic location, camera access, calendar access, and data sharing require explicit opt-in.
- Monetization begins only after core recommendations provide clear standalone value.

## Generative AI feasibility

Nuana now offers more outfit combinations and a private stylist helper, but those features use curated pieces and deterministic local rules—not a generative model. This works without an API key, external data transfer, service cost, or model availability risk. A true conversational model is feasible behind a server-side provider adapter, but provider choice, credentials, explicit user consent, data minimization, output validation, usage limits, and a non-AI fallback are still required before enabling it.

## Phase 1 context detection

The browser context module is `userContext.js`. It keeps language, IANA time zone, local date/time of day, optional city/coordinates, hemisphere-derived season, current weather, and a three-day forecast together in one in-memory object. Location and city lookup are initiated only by user action; the context request sent to Nuana's recommendation endpoint omits city names and coordinates, and location values are never written to browser or server storage.
