# User App Localization Analysis

## Summary
This document lists all hardcoded English text found in the user-app components that needs to be translated.

## Current Localization Status
- ✅ Already implemented: Basic dashboard welcome message
- ❌ Needs implementation: All text below

## Findings by Component

### 1. AppHeader.tsx
- `"dev"` - Dev link text
- `"ePunch"` - App title
- `"Sign Out"` - Dropdown menu item

### 2. SignOutModal.tsx
- `"Confirm Sign Out"` - Modal title
- `"Are you sure you want to sign out? You'll continue using the app with your anonymous account."` - Confirmation message
- `"Sign Out"` - Confirm button
- `"Cancel"` - Cancel button

### 3. AuthContainer.tsx
- `"Sign in to sync your punch cards across devices and keep them secure"` - Auth prompt message

### 4. AuthButtons.tsx
- `"Sign In"` - Sign in button
- `"or"` - Separator text
- `"Sign Up"` - Sign up button

### 5. AuthModal.tsx
- `"Sign In"` - Modal title (signin mode)
- `"Sign Up"` - Modal title (signup mode)
- `"Continue with Email"` - Email auth button
- `"Continue with Google"` - Google auth button
- `"Don't have an account?"` - Switch mode text (signin)
- `"Sign up"` - Switch mode link (signin)
- `"Already have an account?"` - Switch mode text (signup)
- `"Sign in"` - Switch mode link (signup)
- `"← Back"` - Back to options link
- `"Google authentication failed"` - Error message

### 6. EmailAuthForm.tsx
- `"Check Your Email"` - Verification heading
- `"We sent a verification code to {email}"` - Verification message
- `"Enter verification code"` - Input placeholder
- `"Verifying..."` - Loading state
- `"Verify Email"` - Verify button
- `"Email"` - Input placeholder
- `"Password"` - Input placeholder
- `"Creating Account..."` - Loading state (signup)
- `"Signing In..."` - Loading state (signin)
- `"Create Account"` - Submit button (signup)
- `"Sign In"` - Submit button (signin)
- Error messages: "Sign up failed", "Confirmation failed", "Sign in failed"

### 7. PunchCards.tsx
- `"Oops!"` - Error state headline
- `"Error: {error}"` - Error message template
- `"Your rewards await!"` - Empty state headline
- `"Start collecting punches at your favorite spots and unlock amazing rewards"` - Empty state description

### 8. QRCode.tsx
- `"Show to get {rewardDescription}"` - Reward mode text
- `"My QR Code"` - Default mode text

### 9. PunchCardOverlay.tsx
- `"SELECTED"` - Selected state text
- `"TAP TO REDEEM"` - Redemption prompt text

### 10. MerchantLandingPage.tsx
- `"Get started today:"` - Top contact text
- `"WhatsApp"` - Contact method
- `"Telegram"` - Contact method
- `"ePunch"` - Brand title
- `"Digital Punch Cards"` - Hero title
- `"• No apps to download"` - Bullet point
- `"• No accounts to create"` - Bullet point  
- `"• Just scan and collect"` - Bullet point
- `"Watch How It Works"` - Demo title
- `"Customer completes card → Gets reward"` - Step label
- `"How Customers Use It"` - Section title
- `"From first visit to free reward"` - Journey subtitle
- `"Initial state"` - Step 1 title
- `"Customer's QR code ready"` - Step 1 description
- `"First punch"` - Step 2 title
- `"First purchase → first punch"` - Step 2 description
- `"Building up"` - Step 3 title
- `"Each purchase adds a punch"` - Step 3 description
- `"Card complete!"` - Step 4 title
- `"Celebration animation"` - Step 4 description
- `"Free reward"` - Step 5 title
- `"Customer claims their reward"` - Step 5 description
- `"Benefits to your business"` - Section title
- `"More loyal customers"` - Benefit title
- `"73% higher retention rates"` - Benefit description
- `"Frequent repeat visits"` - Benefit title
- `"20% increase in visit frequency"` - Benefit description
- `"Zero maintenance"` - Benefit title
- `"No physical cards to replace"` - Benefit description
- `"Gamification"` - Benefit title
- `"Visual progress drives engagement"` - Benefit description
- `"Ready to Get Started?"` - CTA title
- `"Contact us to start your digital loyalty program today"` - CTA subtitle

### 11. DevPage.tsx (if accessible to users)
- Various section titles and UI text (many technical terms)
- `"Navigation"`, `"Merchant Testing"`, `"User Information"`, etc.

## Recommended Translation Keys Structure

```typescript
type TranslationKeys = {
  // Header
  'header.appTitle': string;
  'header.devLink': string;
  'header.signOut': string;
  
  // Auth
  'auth.signIn': string;
  'auth.signUp': string;
  'auth.or': string;
  'auth.syncMessage': string;
  'auth.continueWithEmail': string;
  'auth.continueWithGoogle': string;
  'auth.noAccount': string;
  'auth.haveAccount': string;
  'auth.back': string;
  'auth.checkEmail': string;
  'auth.verificationSent': string;
  'auth.enterCode': string;
  'auth.verifying': string;
  'auth.verifyEmail': string;
  'auth.email': string;
  'auth.password': string;
  'auth.creatingAccount': string;
  'auth.signingIn': string;
  'auth.createAccount': string;
  'auth.googleFailed': string;
  'auth.signUpFailed': string;
  'auth.confirmationFailed': string;
  'auth.signInFailed': string;
  
  // Sign Out Modal
  'signOut.title': string;
  'signOut.message': string;
  'signOut.confirm': string;
  'signOut.cancel': string;
  
  // Punch Cards
  'punchCards.error.title': string;
  'punchCards.error.message': string;
  'punchCards.empty.title': string;
  'punchCards.empty.message': string;
  
  // QR Code
  'qr.myCode': string;
  'qr.showToGet': string;
  
  // Reward Overlay
  'reward.selected': string;
  'reward.tapToRedeem': string;
  
  // Landing Page
  'landing.getStarted': string;
  'landing.whatsapp': string;
  'landing.telegram': string;
  'landing.digitalPunchCards': string;
  'landing.noApps': string;
  'landing.noAccounts': string;
  'landing.justScan': string;
  'landing.watchDemo': string;
  'landing.customerCompletes': string;
  'landing.howCustomersUse': string;
  'landing.firstVisitToReward': string;
  'landing.step1.title': string;
  'landing.step1.description': string;
  'landing.step2.title': string;
  'landing.step2.description': string;
  'landing.step3.title': string;
  'landing.step3.description': string;
  'landing.step4.title': string;
  'landing.step4.description': string;
  'landing.step5.title': string;
  'landing.step5.description': string;
  'landing.benefits.title': string;
  'landing.benefits.loyal.title': string;
  'landing.benefits.loyal.description': string;
  'landing.benefits.visits.title': string;
  'landing.benefits.visits.description': string;
  'landing.benefits.maintenance.title': string;
  'landing.benefits.maintenance.description': string;
  'landing.benefits.gamification.title': string;
  'landing.benefits.gamification.description': string;
  'landing.cta.title': string;
  'landing.cta.subtitle': string;
  
  // Common
  'common.buttons.save': string;
  'common.buttons.cancel': string;
  'common.errors.networkError': string;
};
```

## Priority Levels

### High Priority (User-facing, frequently seen)
1. AppHeader: "Sign Out"
2. AuthContainer: Sign in message
3. AuthButtons: "Sign In", "Sign Up", "or"
4. PunchCards: Empty state and error messages
5. QRCode: "My QR Code", reward text
6. PunchCardOverlay: "TAP TO REDEEM", "SELECTED"

### Medium Priority (Modal content)
1. SignOutModal: All text
2. AuthModal: All auth flow text
3. EmailAuthForm: All form text

### Low Priority (Landing page - less frequently accessed)
1. MerchantLandingPage: All marketing text

## Implementation Notes
- Some text contains dynamic content (e.g., `{email}`, `{rewardDescription}`) requiring interpolation
- Error messages may come from backend APIs and might need separate handling
- Alt text for images should also be considered for localization
- Consider screen reader accessibility when translating 