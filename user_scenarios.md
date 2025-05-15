# E-PUNCH.io User Scenarios

This document outlines key user scenarios for the E-PUNCH.io application.

## I. User Profiles & States

1.  **New Anonymous User:**
    *   First-time user; no `userId` in local storage.
    *   On first app launch (direct URL or merchant QR), a `userId` is generated and stored locally.
    *   Displays warning about potential data loss (encourages future authentication).

2.  **Returning Anonymous User:**
    *   Has `userId` in local storage from previous use. Not centrally authenticated.
    *   App loads data for the local `userId`. Data loss warning may still apply.

3.  **Authenticated User (Future Scope):**
    *   Signed in (e.g., via Google). Data tied to the authenticated account.
    *   Data syncs across devices; no local cache data loss risk.
    *   Needs a process for anonymous users to authenticate and link data.

## II. Core User Journeys

### Journey A: Accessing via Direct URL (e.g., `epunch.io`)

**A1: First-Time App Launch (New Anonymous User)**
1.  User navigates to `epunch.io`.
2.  System generates and stores `userId` locally.
3.  App displays welcome, data loss warning, and personal QR code.
4.  No punch cards initially.

**A2: Returning to App (Returning Anonymous / Authenticated User)**
1.  User navigates to `epunch.io`.
2.  System loads data (local `userId` or authenticated session).
3.  Displays personal QR code, existing punch cards, statuses, and reward history.

**A3: Acquiring First Punch Card (New Loyalty Program)**
    *"Card appears after manager scans user QR for the first time."*
1.  At a merchant, user makes a purchase.
2.  User presents personal QR code.
3.  Merchant scans user QR, selects "Add Punch" for the Loyalty Program.
4.  New punch card for that program appears in user's app with 1 punch (Status: `ACTIVE`).
    *   *Backend:* Creates `punch_card` (linked to user/loyalty program) and `punch` records.

**A4: Adding Punch to Existing `ACTIVE` Card**
1.  At a merchant with an `ACTIVE` card, user makes a purchase.
2.  User presents personal QR code.
3.  Merchant scans user QR, selects "Add Punch" for the Loyalty Program.
4.  `current_punches` on the card increments.
5.  **If `current_punches` == `required_punches`:**
    *   Card status -> `REWARD_READY`. User sees "Reward Ready!"
    *   Backend creates a new, `ACTIVE` `punch_card` (0 punches) for the same Loyalty Program. This becomes the card for new punches.

**A5: Redeeming a Reward**
    *"Show card QR, card resets to 0/10, see '1 free coffee redeemed'."*
1.  User has `REWARD_READY` card(s).
2.  User selects specific `REWARD_READY` card in-app.
3.  App displays a QR code unique to that `REWARD_READY` card. User presents this to merchant.
4.  Merchant scans this card-specific QR; system processes redemption for that `punch_card_id`.
5.  User app shows "Success! Reward Redeemed."
6.  The redeemed card's status -> `REWARD_REDEEMED`. User sees the new `ACTIVE` card (created in A4.5) for this program (0 punches).
7.  Redemption record visible (e.g., "1 free coffee redeemed at Pottery Cafe on [date]").

### Journey B: Accessing by Scanning Merchant's QR Code

*Merchant QR codes may link to `epunch.io` generically or include `merchantId`/`loyaltyProgramId(s)`.*

**B1: New Anonymous User Scans Merchant QR**
1.  User scans merchant QR.
2.  App launches; generates/stores `userId`; displays data loss warning & personal QR.
3.  **If Merchant QR links to specific Loyalty Program(s):**
    *   New, `ACTIVE` punch card(s) for these program(s) might display with 0 punches. User ready for first punch (like A3, but card pre-exists with 0 punches).
4.  **If Merchant QR links generically:**
    *   Behaves as A1 (empty state). User proceeds to A3 for first card/punch.

**B2: Returning User Scans Merchant QR**
1.  User scans merchant QR.
2.  App launches/foregrounds; loads user data. Displays personal QR.
3.  **If Merchant QR links to specific Loyalty Program(s):**
    *   App may highlight/navigate to relevant card(s).
    *   If card for a program doesn't exist, new `ACTIVE` card (0 punches) might be created.
4.  User proceeds to add punch (A4) or redeem (A5).

## III. Punch Card States & Management

1.  **`ACTIVE`:**
    *   Actively accumulating punches.
    *   Only one `ACTIVE` card per user per loyalty program (DB unique index).

2.  **`REWARD_READY`:**
    *   `required_punches` met. Reward redeemable.
    *   User can have multiple `REWARD_READY` cards for same or different programs.

3.  **`REWARD_REDEEMED`:**
    *   Reward for this card instance redeemed. Historical record.
    *   User can have multiple `REWARD_REDEEMED` cards.