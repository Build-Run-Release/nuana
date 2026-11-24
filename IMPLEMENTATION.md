# Nuana Implementation Status

**Document date:** November 24, 2026

**Validation:** Frontend/backend syntax and smoke tests pass as of implementation. Recommended MVP items are marked implemented, partial, or deferred below.

## Product vision

Nuana recommends complete outfit ideas for people based on mood, presentation preferences, weather, occasion, and the clothing already owned by the user. The product is intended as styling inspiration, not medical advice or a diagnosis.

## Implemented now

### Core experience
- Responsive web interface for desktop and mobile.
- 24 mood choices organized into Bright, Soft, Bold, Deep, and Refined categories.
- 18 distinct outfit concepts with varied visual identities.
- Three recommendations for each mood and presentation option.
- “Surprise me” mood selection.
- “Try another” recommendation rotation.
- Saved outfit collection.
- Browser-local preference persistence.
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
- Context preferences remain in the browser.

### Backend
- Dependency-free Node.js HTTP server.
- JSON API for health, moods, recommendations, saved outfits, history, and feedback.
- Static frontend delivery.
- Input validation for mood, presentation, weather, occasion, save payloads, and feedback.
- JSON-file persistence for saved looks, recommendation history, and feedback.
- Basic repetition avoidance.
- Work, outdoor, hot-weather, cold-weather, and rainy-weather recommendation adjustments.

### API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Service status |
| GET | `/api/moods` | Available moods |
| GET | `/api/recommendations` | Generate recommendations |
| GET | `/api/saved` | Retrieve saved outfits |
| POST | `/api/saved` | Save an outfit |
| DELETE | `/api/saved/:name` | Remove a saved outfit |
| GET | `/api/history` | Retrieve limited recommendation history |
| POST | `/api/history` | Record an outfit interaction |
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
- Wardrobe, presentation, weather, and occasion preferences use browser storage.
- No account, camera, location, or tracking service is required.
- Saved clothing and outfit data are stored locally or in local JSON files.
- No AI or third-party service receives personal clothing data yet.

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
- Automatic location-based weather, with explicit consent.
- Calendar and event planning.
- Travel and packing capsule generation.
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
   - **Status: Partially implemented.**
   - Added account registration, login, logout, scrypt password hashing, HTTP-only SameSite session cookies, account deletion, and account-status UI.
   - Local no-account use remains available.
   - Remaining: real database, migrations, cross-device account-scoped data, HTTPS deployment, CSRF protection, MFA, and rate limiting.

2. **Improve explanation, feedback, and no-repeat logic**
   - **Status: Implemented for MVP.**
   - Each result explains the mood, weather, occasion, and style rationale.
   - Added “Good fit,” “Not my style,” “Too formal,” and “Worn” controls.
   - Added session exclusions and a recently-worn history list for repetition control.
   - Remaining enhancement: configurable no-repeat periods and conservative preference ranking from feedback.

3. **Add real weather location only with consent**
   - **Status: Implemented for MVP.**
   - The location button requires confirmation before browser geolocation.
   - Live Open-Meteo temperature/rain data determines cold, mild, hot, or rainy recommendations.
   - Coordinates are not stored by Nuana; manual weather remains available as fallback.
   - Remaining: provider privacy disclosure in runtime copy and weather failure monitoring.

4. **Add outfit ownership matching**
   - **Status: Implemented for MVP.**
   - Users select owned wardrobe categories.
   - The API ranks recommendations by whether a look contains selected owned-item names.
   - Missing items are optional and are not presented as required purchases.
   - Remaining: size, fit, comfort, accessibility, garment records, and exact ownership confirmation.

5. **Add event and travel planning**
   - **Status: Travel implemented; event calendar pending.**
   - Occasion filters cover everyday, work, date, event, travel, and outdoor use.
   - Added a 1–14 day weather- and presentation-aware travel capsule generator with a packing tip.
   - Remaining: named event records, calendar consent, dress-code metadata, rewear planning, and laundry tracking.

6. **Add automated tests and database backups**
   - **Status: Partially implemented.**
   - `npm test` validates health, mood, and recommendation routes.
   - `npm run backup` creates timestamped local JSON backups.
   - Remaining: auth, saved-item, feedback, travel, privacy, and deletion tests; CI; migrations; logs; monitoring; rate limits; encrypted backups; restore automation; and restore drills.

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
