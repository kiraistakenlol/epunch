# User App Spec

Customer-facing app for the ePunch loyalty system. Runs in a mobile browser.

## Card types

Cards have a type. For v2 MVP only punch cards are implemented, but the design should be able to accommodate other types in the future.

- **Punch card** (v2) — collect N punches, get a reward. Shows progress as filled/total.
- **Bundle** (future) — pre-paid package (e.g. "5 coffees for the price of 4"). Shows remaining uses.
- **Benefit card** (future) — ongoing discount/perk (e.g. "10% off all drinks"). Shows active/expired status.

Each card type has different data and progress visualization, but they all belong to a shop and appear in the same list.

## What the user needs to do

**Show their QR code**
- Every user has a personal QR code that merchants scan
- Must be easy to access — this is the most frequent action

**Scan a merchant's QR code**
- Scanning a merchant's QR creates a new card for that shop
- Merchant shows it from their portal screen
- This is handled by the phone's camera, not the app itself

**See their cards**
- Users may have cards of different types from different shops
- Each card shows: shop name, card type, type-specific progress
- Punch cards specifically show: program description, punch progress (collected vs total)
- Cards that are ready for redemption should be visually distinct

**Redeem a reward**
- When a card is complete (or a bundle use is available), the user needs a way to redeem it
- Redemption works by showing a special QR code (different from the regular one) to the merchant
- The user should clearly understand they're in redemption mode and be able to cancel it
- After redemption, the card is removed (or updated for bundles)

**View card details**
- Shop name and address (with a link to maps)
- Type-specific progress and info
- Reward/benefit description
- Remaining progress or redeem action

**Sign in (optional but important)**
- Users can use the app as guests with no account — they get a device-bound ID
- As a guest, all cards are stored locally. If they clear browser data or lose the device, their progress is gone
- Signing in syncs cards to an account so they persist across devices and browser resets
- The app should communicate this risk and suggest signing in, but never block the user from using the app

## States

**QR code modes**
1. Normal — encodes user ID, used for collecting punches
2. Redemption — encodes a specific completed card, used for redeeming a reward

**Card statuses**
1. Active — has some punches, not complete
2. Reward ready — all punches collected, can be redeemed
3. Redeemed — removed from view

**Auth**
1. Guest — device-bound ID, can collect punches, sees sign-in suggestion
2. Signed in — cards synced, no sign-in suggestion

## User flows

**Collecting a punch**
1. User opens app and presents their QR code
2. Merchant scans it → punch is added
3. Card appears or updates in real time

**Getting a new card**
1. User scans a merchant's QR (shown from their portal screen)
2. New empty card for that shop appears

**Redeeming a reward**
1. Card fills up → user sees it's complete
2. User initiates redemption → QR switches to redemption mode
3. Merchant scans → reward redeemed → card removed
