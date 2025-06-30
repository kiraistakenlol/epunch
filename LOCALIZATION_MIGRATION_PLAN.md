# Migration Plan: Custom Localization → react-i18next

## Phase 1: Setup
- [ ] Install react-i18next dependencies: `yarn workspace e-punch-common-ui add react-i18next i18next i18next-browser-languagedetector`
- [ ] Create `application/common-ui/src/i18n/` directory
- [ ] Create `application/common-ui/src/i18n/resources/en/` directory
- [ ] Create `application/common-ui/src/i18n/resources/es/` directory

## Phase 2: Extract Translations
- [ ] Create `common.json` files in both language directories
- [ ] Create `auth.json` files in both language directories
- [ ] Create `dashboard.json` files in both language directories
- [ ] Create `merchant-onboarding.json` files in both language directories
- [ ] Create `punch-cards.json` files in both language directories
- [ ] Copy translations from `LocalizationProvider.tsx` to respective JSON files

## Phase 3: Setup i18n
- [ ] Create `application/common-ui/src/i18n/i18n.ts` configuration file
- [ ] Create `application/common-ui/src/i18n/I18nProvider.tsx`
- [ ] Delete `application/common-ui/src/localization/LocalizationProvider.tsx`
- [ ] Update `application/common-ui/src/localization/index.ts` exports
- [ ] Update `application/common-ui/src/index.ts` exports
- [ ] Update `LanguageSwitch.tsx` to use react-i18next

## Phase 4: Update Apps
- [ ] Update `application/user-app/src/App.tsx` - replace LocalizationProvider with I18nProvider
- [ ] Update `application/merchant-app/src/App.tsx` - replace LocalizationProvider with I18nProvider

## Phase 5: Update Components
### User App Components
- [ ] `AuthButtons.tsx` - replace useLocalization with useTranslation
- [ ] `AuthContainer.tsx` - replace useLocalization with useTranslation  
- [ ] `AuthModal.tsx` - replace useLocalization with useTranslation
- [ ] `EmailAuthForm.tsx` - replace useLocalization with useTranslation
- [ ] `DashboardPreviewPage.tsx` - replace useLocalization with useTranslation
- [ ] `PunchCards.tsx` - replace useLocalization with useTranslation
- [ ] `CompletionOverlay.tsx` - replace useLocalization with useTranslation
- [ ] `PunchCardBack.tsx` - replace useLocalization with useTranslation
- [ ] `PunchCardOverlay.tsx` - replace useLocalization with useTranslation
- [ ] `AppHeader.tsx` - replace useLocalization with useTranslation
- [ ] `SignOutModal.tsx` - replace useLocalization with useTranslation
- [ ] `QRCode.tsx` - replace useLocalization with useTranslation
- [ ] `MerchantLandingPage.tsx` - replace useLocalization with useTranslation

### Merchant App Components
- [ ] `MerchantOnboardingPage.tsx` - replace useLocalization with useTranslation
- [ ] `HeroSection.tsx` - replace useLocalization with useTranslation
- [ ] `CTASection.tsx` - replace useLocalization with useTranslation
- [ ] `LoadingState.tsx` - replace useLocalization with useTranslation
- [ ] `FuturePlansSection.tsx` - replace useLocalization with useTranslation
- [ ] `ProblemSolutionSection.tsx` - replace useLocalization with useTranslation
- [ ] `WorkflowStep.tsx` - replace useLocalization with useTranslation
- [ ] `ErrorState.tsx` - replace useLocalization with useTranslation
- [ ] `HowItWorksSection.tsx` - replace useLocalization with useTranslation
- [ ] `TeaserSection.tsx` - replace useLocalization with useTranslation
- [ ] `BenefitsSection.tsx` - replace useLocalization with useTranslation
- [ ] `SocialProofSection.tsx` - replace useLocalization with useTranslation

## Phase 6: Test & Clean
- [ ] Test user-app in both languages
- [ ] Test merchant-app in both languages
- [ ] Test language switching works
- [ ] Remove `application/common-ui/src/localization/` directory
- [ ] Verify all apps build successfully 