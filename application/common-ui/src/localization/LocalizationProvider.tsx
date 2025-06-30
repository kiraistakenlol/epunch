import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'es';

type TranslationKeys = {
  // Dashboard
  'dashboard.welcome': string;
  
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
  'punchCards.back.details': string;
  'punchCards.back.collectMessage': string;
  'punchCards.completion.complete': string;
  'punchCards.completion.ok': string;
  
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
  
  // Merchant Onboarding
  'merchantOnboarding.error.loyaltyProgramRequired': string;
  'merchantOnboarding.error.loyaltyProgramSetupFirst': string;
  'merchantOnboarding.error.contactMerchant': string;
  'merchantOnboarding.error.merchantNotFound': string;
  'merchantOnboarding.error.merchantNotFoundMessage': string;
  'merchantOnboarding.loading.merchantInformation': string;

  // Hero Section
  'merchantOnboarding.hero.digitalLoyaltyCards': string;
  'merchantOnboarding.hero.for': string;
  'merchantOnboarding.hero.tryItNow': string;
  'merchantOnboarding.hero.buyGetFree': string;

  // Problem Solution
  'merchantOnboarding.problemSolution.problem': string;
  'merchantOnboarding.problemSolution.problemTitle': string;
  'merchantOnboarding.problemSolution.problemDescription': string;
  'merchantOnboarding.problemSolution.solution': string;
  'merchantOnboarding.problemSolution.brandTagline': string;
  'merchantOnboarding.problemSolution.brandDescription': string;

  // Benefits
  'merchantOnboarding.benefits.title': string;
  'merchantOnboarding.benefits.retention.title': string;
  'merchantOnboarding.benefits.retention.description': string;
  'merchantOnboarding.benefits.spending.title': string;
  'merchantOnboarding.benefits.spending.description': string;
  'merchantOnboarding.benefits.competition.title': string;
  'merchantOnboarding.benefits.competition.description': string;
  'merchantOnboarding.benefits.data.title': string;
  'merchantOnboarding.benefits.data.description': string;

  // How It Works
  'merchantOnboarding.howItWorks.title': string;
  'merchantOnboarding.howItWorks.subtitle': string;
  'merchantOnboarding.howItWorks.step1.title': string;
  'merchantOnboarding.howItWorks.step1.note': string;
  'merchantOnboarding.howItWorks.step2.title': string;
  'merchantOnboarding.howItWorks.step2.note': string;
  'merchantOnboarding.howItWorks.step3.title': string;
  'merchantOnboarding.howItWorks.step3.note': string;
  'merchantOnboarding.howItWorks.step4.title': string;
  'merchantOnboarding.howItWorks.step4.note': string;
  'merchantOnboarding.howItWorks.step5.title': string;
  'merchantOnboarding.howItWorks.step5.note': string;
  'merchantOnboarding.howItWorks.step6.title': string;
  'merchantOnboarding.howItWorks.step6.note': string;
  'merchantOnboarding.howItWorks.step7.title': string;
  'merchantOnboarding.howItWorks.step7.note': string;
  'merchantOnboarding.howItWorks.qrPlaceholder': string;
  'merchantOnboarding.howItWorks.roleBadge.you': string;
  'merchantOnboarding.howItWorks.roleBadge.customer': string;
  'merchantOnboarding.howItWorks.twoAppsNote.prefix': string;
  'merchantOnboarding.howItWorks.twoAppsNote.suffix': string;

  // Future Plans
  'merchantOnboarding.futurePlans.title': string;
  'merchantOnboarding.futurePlans.subtitle': string;
  'merchantOnboarding.futurePlans.availableNow': string;
  'merchantOnboarding.futurePlans.comingSoon': string;
  'merchantOnboarding.futurePlans.year2025': string;
  'merchantOnboarding.futurePlans.multiplePrograms.title': string;
  'merchantOnboarding.futurePlans.multiplePrograms.description': string;
  'merchantOnboarding.futurePlans.customization.title': string;
  'merchantOnboarding.futurePlans.customization.description': string;
  'merchantOnboarding.futurePlans.analytics.title': string;
  'merchantOnboarding.futurePlans.analytics.description': string;
  'merchantOnboarding.futurePlans.targeting.title': string;
  'merchantOnboarding.futurePlans.targeting.description': string;
  'merchantOnboarding.futurePlans.bundles.title': string;
  'merchantOnboarding.futurePlans.bundles.description': string;
  'merchantOnboarding.futurePlans.behaviorAnalysis.title': string;
  'merchantOnboarding.futurePlans.behaviorAnalysis.description': string;
  'merchantOnboarding.futurePlans.aiSuggestions.title': string;
  'merchantOnboarding.futurePlans.aiSuggestions.description': string;

  // Social Proof
  'merchantOnboarding.socialProof.title': string;
  'merchantOnboarding.socialProof.retention.label': string;
  'merchantOnboarding.socialProof.frequency.label': string;
  'merchantOnboarding.socialProof.spending.label': string;

  // CTA
  'merchantOnboarding.cta.title': string;
  'merchantOnboarding.cta.subtitle': string;
  'merchantOnboarding.cta.whatsapp': string;
  'merchantOnboarding.cta.telegram': string;
  'merchantOnboarding.cta.email': string;

  // Contact
  'merchantOnboarding.contact.whatsapp': string;
  'merchantOnboarding.contact.telegram': string;
  'merchantOnboarding.contact.email': string;

  // Teaser Section
  'merchantOnboarding.teaser.titlePrefix': string;
  'merchantOnboarding.teaser.titleSuffix': string;
  'merchantOnboarding.teaser.button': string;
};

const translations = {
  en: {
    // Dashboard
    'dashboard.welcome': 'Welcome to E-Punch!',
    
    // Header
    'header.appTitle': 'ePunch',
    'header.devLink': 'dev',
    'header.signOut': 'Sign Out',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.or': 'or',
    'auth.syncMessage': 'Sign in to sync your punch cards across devices and keep them secure',
    'auth.continueWithEmail': 'Continue with Email',
    'auth.continueWithGoogle': 'Continue with Google',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.back': '← Back',
    'auth.checkEmail': 'Check Your Email',
    'auth.verificationSent': 'We sent a verification code to {{email}}',
    'auth.enterCode': 'Enter verification code',
    'auth.verifying': 'Verifying...',
    'auth.verifyEmail': 'Verify Email',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.creatingAccount': 'Creating Account...',
    'auth.signingIn': 'Signing In...',
    'auth.createAccount': 'Create Account',
    'auth.googleFailed': 'Google authentication failed',
    'auth.signUpFailed': 'Sign up failed',
    'auth.confirmationFailed': 'Confirmation failed',
    'auth.signInFailed': 'Sign in failed',
    
    // Sign Out Modal
    'signOut.title': 'Confirm Sign Out',
    'signOut.message': "Are you sure you want to sign out? You'll continue using the app with your anonymous account.",
    'signOut.confirm': 'Sign Out',
    'signOut.cancel': 'Cancel',
    
    // Punch Cards
    'punchCards.error.title': 'Oops!',
    'punchCards.error.message': 'Error: {{error}}',
    'punchCards.empty.title': 'Your rewards await!',
    'punchCards.empty.message': 'Start collecting punches at your favorite spots and unlock amazing rewards',
    'punchCards.back.details': 'Details',
    'punchCards.back.collectMessage': 'Collect {{totalPunches}} punches at {{shopName}} and enjoy',
    'punchCards.completion.complete': 'COMPLETE!!',
    'punchCards.completion.ok': 'OK!',
    
    // QR Code
    'qr.myCode': 'My QR Code',
    'qr.showToGet': 'Show to get {{reward}}',
    
    // Reward Overlay
    'reward.selected': 'SELECTED',
    'reward.tapToRedeem': 'TAP TO REDEEM',
    
    // Landing Page
    'landing.getStarted': 'Get started today:',
    'landing.whatsapp': 'WhatsApp',
    'landing.telegram': 'Telegram',
    'landing.digitalPunchCards': 'Digital Punch Cards',
    'landing.noApps': '• No apps to download',
    'landing.noAccounts': '• No accounts to create',
    'landing.justScan': '• Just scan and collect',
    'landing.watchDemo': 'Watch How It Works',
    'landing.customerCompletes': 'Customer completes card → Gets reward',
    'landing.howCustomersUse': 'How Customers Use It',
    'landing.firstVisitToReward': 'From first visit to free reward',
    'landing.step1.title': 'Initial state',
    'landing.step1.description': "Customer's QR code ready",
    'landing.step2.title': 'First punch',
    'landing.step2.description': 'First purchase → first punch',
    'landing.step3.title': 'Building up',
    'landing.step3.description': 'Each purchase adds a punch',
    'landing.step4.title': 'Card complete!',
    'landing.step4.description': 'Celebration animation',
    'landing.step5.title': 'Free reward',
    'landing.step5.description': 'Customer claims their reward',
    'landing.benefits.title': 'Benefits to your business',
    'landing.benefits.loyal.title': 'More loyal customers',
    'landing.benefits.loyal.description': '73% higher retention rates',
    'landing.benefits.visits.title': 'Frequent repeat visits',
    'landing.benefits.visits.description': '20% increase in visit frequency',
    'landing.benefits.maintenance.title': 'Zero maintenance',
    'landing.benefits.maintenance.description': 'No physical cards to replace',
    'landing.benefits.gamification.title': 'Gamification',
    'landing.benefits.gamification.description': 'Visual progress drives engagement',
    'landing.cta.title': 'Ready to Get Started?',
    'landing.cta.subtitle': 'Contact us to start your digital loyalty program today',
    
    // Common
    'common.buttons.save': 'Save',
    'common.buttons.cancel': 'Cancel',
    'common.errors.networkError': 'Network error occurred',
    
    // Merchant Onboarding
    'merchantOnboarding.error.loyaltyProgramRequired': 'Loyalty Program Required',
    'merchantOnboarding.error.loyaltyProgramSetupFirst': 'This merchant needs to set up a loyalty program first.',
    'merchantOnboarding.error.contactMerchant': 'Contact the merchant to create a loyalty program before accessing this page.',
    'merchantOnboarding.error.merchantNotFound': 'Merchant Not Found',
    'merchantOnboarding.error.merchantNotFoundMessage': 'The merchant "{{merchantSlug}}" could not be found.',
    'merchantOnboarding.loading.merchantInformation': 'Loading merchant information...',

    // Hero Section
    'merchantOnboarding.hero.digitalLoyaltyCards': 'Digital Loyalty Cards',
    'merchantOnboarding.hero.for': 'for',
    'merchantOnboarding.hero.tryItNow': 'Try It Now! 🚀',
    'merchantOnboarding.hero.buyGetFree': 'Buy 10 Get 1 Free',

    // Problem Solution
    'merchantOnboarding.problemSolution.problem': 'Problem',
    'merchantOnboarding.problemSolution.problemTitle': 'Customers visit once, then vanish forever',
    'merchantOnboarding.problemSolution.problemDescription': 'Like Tinder dates, 70% never come back. They forget you exist and swipe right on your competitors.',
    'merchantOnboarding.problemSolution.solution': 'Solution',
    'merchantOnboarding.problemSolution.brandTagline': 'Turn one-time visitors into obsessed regulars',
    'merchantOnboarding.problemSolution.brandDescription': 'Digital loyalty cards that actually work. No apps, no hassle, no "sorry we\'re out of paper cards." Just scan and watch them keep coming back.',

    // Benefits
    'merchantOnboarding.benefits.title': 'Why {{merchantName}} Needs This',
    'merchantOnboarding.benefits.retention.title': 'Stop the Vanishing Act',
    'merchantOnboarding.benefits.retention.description': '<strong>73% higher retention</strong> (no more ghosting customers)',
    'merchantOnboarding.benefits.spending.title': 'Bigger Bills',
    'merchantOnboarding.benefits.spending.description': 'Loyal customers spend <strong>18% more</strong> per visit',
    'merchantOnboarding.benefits.competition.title': 'Crush Competition',
    'merchantOnboarding.benefits.competition.description': '<strong>84% choose</strong> businesses with rewards over boring ones',
    'merchantOnboarding.benefits.data.title': 'Know Your People',
    'merchantOnboarding.benefits.data.description': 'Get <strong>real data</strong> (not just gut feelings)',

    // How It Works
    'merchantOnboarding.howItWorks.title': 'How It Actually Works',
    'merchantOnboarding.howItWorks.subtitle': 'Simple, fast, and works instantly with any smartphone',
    'merchantOnboarding.howItWorks.step1.title': 'Put this QR code where people can see it',
    'merchantOnboarding.howItWorks.step1.note': 'Print it, frame it, or display it digitally',
    'merchantOnboarding.howItWorks.step2.title': 'Customer scans with their phone',
    'merchantOnboarding.howItWorks.step2.note': 'No app downloads, no sign-ups, just works instantly',
    'merchantOnboarding.howItWorks.step3.title': 'Scan their QR code back & hit PUNCH',
    'merchantOnboarding.howItWorks.step3.note': 'Takes 2 seconds on your phone',
    'merchantOnboarding.howItWorks.step4.title': 'They watch their card fill up ({{partial}}/{{full}} → {{full}}/{{full}})',
    'merchantOnboarding.howItWorks.step4.note': 'Instant gratification with every visit',
    'merchantOnboarding.howItWorks.step5.title': 'Card full = special reward QR appears',
    'merchantOnboarding.howItWorks.step5.note': 'They know exactly when they\'ve earned it',
    'merchantOnboarding.howItWorks.step6.title': 'Scan reward QR, hit REDEEM, done',
    'merchantOnboarding.howItWorks.step6.note': 'Card automatically resets for round 2',
    'merchantOnboarding.howItWorks.step7.title': 'Happy customer gets their reward',
    'merchantOnboarding.howItWorks.step7.note': 'And starts dreaming about their next free coffee',
    'merchantOnboarding.howItWorks.qrPlaceholder': 'QR Code will appear here',
    'merchantOnboarding.howItWorks.roleBadge.you': 'YOU',
    'merchantOnboarding.howItWorks.roleBadge.customer': 'CUSTOMER',
    'merchantOnboarding.howItWorks.twoAppsNote.prefix': ' and your ',
    'merchantOnboarding.howItWorks.twoAppsNote.suffix': ' have different apps',

    // Future Plans
    'merchantOnboarding.futurePlans.title': 'What\'s Coming',
    'merchantOnboarding.futurePlans.subtitle': 'Start with the good stuff today. Unlock mind-blowing features later.',
    'merchantOnboarding.futurePlans.availableNow': 'Available Now',
    'merchantOnboarding.futurePlans.comingSoon': 'Coming Soon',
    'merchantOnboarding.futurePlans.year2025': '2025',
    'merchantOnboarding.futurePlans.multiplePrograms.title': 'Run Multiple Programs',
    'merchantOnboarding.futurePlans.multiplePrograms.description': 'Coffee rewards, meal deals, service packages - all at once. Because why limit yourself?',
    'merchantOnboarding.futurePlans.customization.title': 'Make It Yours',
    'merchantOnboarding.futurePlans.customization.description': 'Upload your logo, pick your colors. Make cards so pretty customers want to show them off.',
    'merchantOnboarding.futurePlans.analytics.title': 'See What Works',
    'merchantOnboarding.futurePlans.analytics.description': 'Finally know which rewards actually work instead of guessing like everyone else.',
    'merchantOnboarding.futurePlans.targeting.title': 'Hunt Down Lost Customers',
    'merchantOnboarding.futurePlans.targeting.description': 'Send targeted promos via email/WhatsApp. Automatically stalk... er, re-engage inactive customers.',
    'merchantOnboarding.futurePlans.bundles.title': 'Get Paid Upfront',
    'merchantOnboarding.futurePlans.bundles.description': 'Sell $200 bundles, give discounts. Customers save money, you get cash flow. Win-win.',
    'merchantOnboarding.futurePlans.behaviorAnalysis.title': 'Know Everything',
    'merchantOnboarding.futurePlans.behaviorAnalysis.description': 'Deep behavior analysis, peak hours, seasonal trends. Become a mind reader.',
    'merchantOnboarding.futurePlans.aiSuggestions.title': 'Let AI Do the Thinking',
    'merchantOnboarding.futurePlans.aiSuggestions.description': 'Get personalized suggestions for pricing and targeting. Because robots are smarter than us.',

    // Social Proof
    'merchantOnboarding.socialProof.title': 'The Numbers Don\'t Lie',
    'merchantOnboarding.socialProof.retention.label': 'Stop ghosting you',
    'merchantOnboarding.socialProof.frequency.label': 'Come back more often',
    'merchantOnboarding.socialProof.spending.label': 'Spend more money',

    // CTA
    'merchantOnboarding.cta.title': 'Ready to Make {{merchantName}} Addictive?',
    'merchantOnboarding.cta.subtitle': 'Hit us up and let\'s turn those one-time visitors into obsessed regulars',
    'merchantOnboarding.cta.whatsapp': 'Let\'s Chat on WhatsApp',
    'merchantOnboarding.cta.telegram': 'Slide Into Our Telegram',
    'merchantOnboarding.cta.email': 'Good Old Email',

    // Contact
    'merchantOnboarding.contact.whatsapp': 'WhatsApp',
    'merchantOnboarding.contact.telegram': 'Telegram',
    'merchantOnboarding.contact.email': 'Email',

    // Teaser Section
    'merchantOnboarding.teaser.titlePrefix': 'How',
    'merchantOnboarding.teaser.titleSuffix': 'can make more money?',
    'merchantOnboarding.teaser.button': 'Tell me'
  },
  es: {
    // Dashboard
    'dashboard.welcome': '¡Bienvenido a E-Punch!',
    
    // Header
    'header.appTitle': 'ePunch',
    'header.devLink': 'dev',
    'header.signOut': 'Cerrar Sesión',
    
    // Auth
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    'auth.or': 'o',
    'auth.syncMessage': 'Iniciá sesión para sincronizar tus tarjetas en todos tus dispositivos y mantenerlas seguras',
    'auth.continueWithEmail': 'Continuar con Email',
    'auth.continueWithGoogle': 'Continuar con Google',
    'auth.noAccount': '¿No tenés una cuenta?',
    'auth.haveAccount': '¿Ya tenés una cuenta?',
    'auth.back': '← Atrás',
    'auth.checkEmail': 'Revisá tu Email',
    'auth.verificationSent': 'Enviamos un código de verificación a {{email}}',
    'auth.enterCode': 'Ingresá el código de verificación',
    'auth.verifying': 'Verificando...',
    'auth.verifyEmail': 'Verificar Email',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.creatingAccount': 'Creando Cuenta...',
    'auth.signingIn': 'Iniciando Sesión...',
    'auth.createAccount': 'Crear Cuenta',
    'auth.googleFailed': 'Falló la autenticación con Google',
    'auth.signUpFailed': 'Falló el registro',
    'auth.confirmationFailed': 'Falló la confirmación',
    'auth.signInFailed': 'Falló el inicio de sesión',
    
    // Sign Out Modal
    'signOut.title': 'Confirmar Cierre de Sesión',
    'signOut.message': '¿Estás seguro de que querés cerrar sesión? Vas a continuar usando la app con tu cuenta anónima.',
    'signOut.confirm': 'Cerrar Sesión',
    'signOut.cancel': 'Cancelar',
    
    // Punch Cards
    'punchCards.error.title': '¡Ups!',
    'punchCards.error.message': 'Error: {{error}}',
    'punchCards.empty.title': '¡Tus recompensas te esperan!',
    'punchCards.empty.message': 'Comenzá a coleccionar sellos en tus lugares favoritos y desbloqueá recompensas increíbles',
    'punchCards.back.details': 'Detalles',
    'punchCards.back.collectMessage': 'Coleccioná {{totalPunches}} sellos en {{shopName}} y disfrutá',
    'punchCards.completion.complete': 'Completado!',
    'punchCards.completion.ok': '¡OK!',
    
    // QR Code
    'qr.myCode': 'Mi Código QR',
    'qr.showToGet': 'Mostrá para obtener {{reward}}',
    
    // Reward Overlay
    'reward.selected': 'SELECCIONADO',
    'reward.tapToRedeem': 'TOCA PARA CANJEAR',
    
    // Landing Page
    'landing.getStarted': 'Comenzá hoy:',
    'landing.whatsapp': 'WhatsApp',
    'landing.telegram': 'Telegram',
    'landing.digitalPunchCards': 'Tarjetas de Sellos Digitales',
    'landing.noApps': '• Sin apps que descargar',
    'landing.noAccounts': '• Sin cuentas que crear',
    'landing.justScan': '• Solo escanea y colecciona',
    'landing.watchDemo': 'Ve Cómo Funciona',
    'landing.customerCompletes': 'Cliente completa tarjeta → Obtiene recompensa',
    'landing.howCustomersUse': 'Cómo la Usan los Clientes',
    'landing.firstVisitToReward': 'De la primera visita a la recompensa gratis',
    'landing.step1.title': 'Estado inicial',
    'landing.step1.description': 'Código QR del cliente listo',
    'landing.step2.title': 'Primer sello',
    'landing.step2.description': 'Primera compra → primer sello',
    'landing.step3.title': 'Acumulando',
    'landing.step3.description': 'Cada compra agrega un sello',
    'landing.step4.title': '¡Tarjeta completa!',
    'landing.step4.description': 'Animación de celebración',
    'landing.step5.title': 'Recompensa gratis',
    'landing.step5.description': 'Cliente reclama su recompensa',
    'landing.benefits.title': 'Beneficios para tu negocio',
    'landing.benefits.loyal.title': 'Clientes más leales',
    'landing.benefits.loyal.description': '73% más retención',
    'landing.benefits.visits.title': 'Visitas más frecuentes',
    'landing.benefits.visits.description': '20% más frecuencia de visita',
    'landing.benefits.maintenance.title': 'Cero mantenimiento',
    'landing.benefits.maintenance.description': 'Sin tarjetas físicas que reemplazar',
    'landing.benefits.gamification.title': 'Gamificación',
    'landing.benefits.gamification.description': 'El progreso visual genera compromiso',
    'landing.cta.title': '¿Listo para Comenzar?',
    'landing.cta.subtitle': 'Contáctanos para comenzar tu programa de lealtad digital hoy',
    
    // Common
    'common.buttons.save': 'Guardar',
    'common.buttons.cancel': 'Cancelar',
    'common.errors.networkError': 'Error de red',
    
    // Merchant Onboarding
    'merchantOnboarding.error.loyaltyProgramRequired': 'Programa de Lealtad Requerido',
    'merchantOnboarding.error.loyaltyProgramSetupFirst': 'Este comerciante necesita configurar un programa de lealtad primero.',
    'merchantOnboarding.error.contactMerchant': 'Contacta al comerciante para crear un programa de lealtad antes de acceder a esta página.',
    'merchantOnboarding.error.merchantNotFound': 'Comerciante No Encontrado',
    'merchantOnboarding.error.merchantNotFoundMessage': 'El comerciante "{{merchantSlug}}" no pudo ser encontrado.',
    'merchantOnboarding.loading.merchantInformation': 'Cargando información del comerciante...',

    // Hero Section
    'merchantOnboarding.hero.digitalLoyaltyCards': 'Tarjetas de Lealtad Digitales',
    'merchantOnboarding.hero.for': 'para',
    'merchantOnboarding.hero.tryItNow': '¡Pruébalo Ahora! 🚀',
    'merchantOnboarding.hero.buyGetFree': 'Compra 10 Llévate 1 Gratis',

    // Problem Solution
    'merchantOnboarding.problemSolution.problem': 'Problema',
    'merchantOnboarding.problemSolution.problemTitle': 'Los clientes visitan una vez, luego desaparecen para siempre',
    'merchantOnboarding.problemSolution.problemDescription': 'Como las citas de Tinder, el 70% nunca regresa. Se olvidan de que existes y se van con la competencia.',
    'merchantOnboarding.problemSolution.solution': 'Solución',
    'merchantOnboarding.problemSolution.brandTagline': 'Convierte visitantes ocasionales en clientes obsesionados',
    'merchantOnboarding.problemSolution.brandDescription': 'Tarjetas de lealtad digitales que realmente funcionan. Sin apps, sin complicaciones, sin "perdón, se nos acabaron las tarjetas de papel." Solo escanea y mira cómo siguen regresando.',

    // Benefits
    'merchantOnboarding.benefits.title': 'Por qué {{merchantName}} Necesita Esto',
    'merchantOnboarding.benefits.retention.title': 'Detén las Desapariciones',
    'merchantOnboarding.benefits.retention.description': '<strong>73% más retención</strong> (se acabaron los clientes fantasma)',
    'merchantOnboarding.benefits.spending.title': 'Cuentas Más Grandes',
    'merchantOnboarding.benefits.spending.description': 'Los clientes leales gastan <strong>18% más</strong> por visita',
    'merchantOnboarding.benefits.competition.title': 'Aplasta la Competencia',
    'merchantOnboarding.benefits.competition.description': '<strong>84% eligen</strong> negocios con recompensas sobre los aburridos',
    'merchantOnboarding.benefits.data.title': 'Conoce a Tu Gente',
    'merchantOnboarding.benefits.data.description': 'Obtén <strong>datos reales</strong> (no solo corazonadas)',

    // How It Works
    'merchantOnboarding.howItWorks.title': 'Cómo Funciona Realmente',
    'merchantOnboarding.howItWorks.subtitle': 'Simple, rápido, y funciona instantáneamente con cualquier smartphone',
    'merchantOnboarding.howItWorks.step1.title': 'Poné este código QR donde la gente pueda verlo',
    'merchantOnboarding.howItWorks.step1.note': 'Imprimilo, enmarcalo, o mostralo digitalmente',
    'merchantOnboarding.howItWorks.step2.title': 'El cliente escanea con su teléfono',
    'merchantOnboarding.howItWorks.step2.note': 'Sin descargas de apps, sin registros, funciona instantáneamente',
    'merchantOnboarding.howItWorks.step3.title': 'Escaneá su código QR de vuelta y presioná SELLAR',
    'merchantOnboarding.howItWorks.step3.note': 'Toma 2 segundos en tu teléfono',
    'merchantOnboarding.howItWorks.step4.title': 'Ven su tarjeta llenarse ({{partial}}/{{full}} → {{full}}/{{full}})',
    'merchantOnboarding.howItWorks.step4.note': 'Gratificación instantánea con cada visita',
    'merchantOnboarding.howItWorks.step5.title': 'Tarjeta llena = aparece QR de recompensa especial',
    'merchantOnboarding.howItWorks.step5.note': 'Saben exactamente cuándo se la han ganado',
    'merchantOnboarding.howItWorks.step6.title': 'Escaneá QR de recompensa, presioná CANJEAR, listo',
    'merchantOnboarding.howItWorks.step6.note': 'La tarjeta se reinicia automáticamente para la ronda 2',
    'merchantOnboarding.howItWorks.step7.title': 'Cliente feliz obtiene su recompensa',
    'merchantOnboarding.howItWorks.step7.note': 'Y empieza a soñar con su próximo café gratis',
    'merchantOnboarding.howItWorks.qrPlaceholder': 'El Código QR aparecerá aquí',
    'merchantOnboarding.howItWorks.roleBadge.you': 'TÚ',
    'merchantOnboarding.howItWorks.roleBadge.customer': 'CLIENTE',
    'merchantOnboarding.howItWorks.twoAppsNote.prefix': ' y tu ',
    'merchantOnboarding.howItWorks.twoAppsNote.suffix': ' tienen aplicaciones diferentes',

    // Future Plans
    'merchantOnboarding.futurePlans.title': 'Lo Que Viene',
    'merchantOnboarding.futurePlans.subtitle': 'Empieza con lo bueno hoy. Desbloquea funciones increíbles después.',
    'merchantOnboarding.futurePlans.availableNow': 'Disponible Ahora',
    'merchantOnboarding.futurePlans.comingSoon': 'Próximamente',
    'merchantOnboarding.futurePlans.year2025': '2025',
    'merchantOnboarding.futurePlans.multiplePrograms.title': 'Maneja Múltiples Programas',
    'merchantOnboarding.futurePlans.multiplePrograms.description': 'Recompensas de café, ofertas de comida, paquetes de servicios - todo a la vez. ¿Por qué limitarte?',
    'merchantOnboarding.futurePlans.customization.title': 'Hacelo Tuyo',
    'merchantOnboarding.futurePlans.customization.description': 'Subí tu logo, elegí tus colores. Hacé tarjetas tan bonitas que los clientes quieran presumirlas.',
    'merchantOnboarding.futurePlans.analytics.title': 'Mirá Qué Funciona',
    'merchantOnboarding.futurePlans.analytics.description': 'Finalmente sabés qué recompensas realmente funcionan en lugar de adivinar como todos los demás.',
    'merchantOnboarding.futurePlans.targeting.title': 'Caza Clientes Perdidos',
    'merchantOnboarding.futurePlans.targeting.description': 'Enviá promos dirigidas por email/WhatsApp. Automáticamente acosa... eh, re-engancha clientes inactivos.',
    'merchantOnboarding.futurePlans.bundles.title': 'Cobra por Adelantado',
    'merchantOnboarding.futurePlans.bundles.description': 'Vendé paquetes de $200, dá descuentos. Los clientes ahorran dinero, vos obtenés flujo de efectivo. Todos ganan.',
    'merchantOnboarding.futurePlans.behaviorAnalysis.title': 'Saber Todo',
    'merchantOnboarding.futurePlans.behaviorAnalysis.description': 'Análisis profundo de comportamiento, horas pico, tendencias estacionales. Convertite en un lector de mentes.',
    'merchantOnboarding.futurePlans.aiSuggestions.title': 'Dejá que la IA Piense',
    'merchantOnboarding.futurePlans.aiSuggestions.description': 'Obtené sugerencias personalizadas para precios y segmentación. Porque los robots son más inteligentes que nosotros.',

    // Social Proof
    'merchantOnboarding.socialProof.title': 'Los Números No Mienten',
    'merchantOnboarding.socialProof.retention.label': 'Dejan de ignorarte',
    'merchantOnboarding.socialProof.frequency.label': 'Regresan más seguido',
    'merchantOnboarding.socialProof.spending.label': 'Gastan más dinero',

    // CTA
    'merchantOnboarding.cta.title': '¿Listo para Hacer {{merchantName}} Adictivo?',
    'merchantOnboarding.cta.subtitle': 'Contáctanos y convirtamos esos visitantes ocasionales en clientes obsesionados',
    'merchantOnboarding.cta.whatsapp': 'Charlemos por WhatsApp',
    'merchantOnboarding.cta.telegram': 'Deslízate a Nuestro Telegram',
    'merchantOnboarding.cta.email': 'Buen Viejo Email',

    // Contact
    'merchantOnboarding.contact.whatsapp': 'WhatsApp',
    'merchantOnboarding.contact.telegram': 'Telegram',
    'merchantOnboarding.contact.email': 'Email',

    // Teaser Section
    'merchantOnboarding.teaser.titlePrefix': '¿Cómo',
    'merchantOnboarding.teaser.titleSuffix': 'puede ganar más dinero?',
    'merchantOnboarding.teaser.button': 'Dime cómo'
  }
} as const;

const detectDeviceLanguage = (): Locale => {
  const browserLanguage = navigator.language.toLowerCase();
  
  if (browserLanguage.startsWith('es')) {
    return 'es';
  }
  
  return 'en';
};

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('epunch-language') as Locale;
    return saved || detectDeviceLanguage();
  });

  useEffect(() => {
    localStorage.setItem('epunch-language', locale);
  }, [locale]);

  const t = (key: keyof TranslationKeys, params?: Record<string, string | number>): string => {
    let translation: string = translations[locale][key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replaceAll(`{{${param}}}`, String(value));
      });
    }
    
    return translation;
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
}; 