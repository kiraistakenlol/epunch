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
    'common.errors.networkError': 'Network error occurred'
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
    'auth.syncMessage': 'Inicia sesión para sincronizar tus tarjetas en todos tus dispositivos y mantenerlas seguras',
    'auth.continueWithEmail': 'Continuar con Email',
    'auth.continueWithGoogle': 'Continuar con Google',
    'auth.noAccount': '¿No tienes una cuenta?',
    'auth.haveAccount': '¿Ya tienes una cuenta?',
    'auth.back': '← Atrás',
    'auth.checkEmail': 'Revisa tu Email',
    'auth.verificationSent': 'Enviamos un código de verificación a {{email}}',
    'auth.enterCode': 'Ingresa el código de verificación',
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
    'signOut.message': '¿Estás seguro de que quieres cerrar sesión? Continuarás usando la app con tu cuenta anónima.',
    'signOut.confirm': 'Cerrar Sesión',
    'signOut.cancel': 'Cancelar',
    
    // Punch Cards
    'punchCards.error.title': '¡Ups!',
    'punchCards.error.message': 'Error: {{error}}',
    'punchCards.empty.title': '¡Tus recompensas te esperan!',
    'punchCards.empty.message': 'Comienza a coleccionar sellos en tus lugares favoritos y desbloquea recompensas increíbles',
    'punchCards.back.details': 'Detalles',
    'punchCards.back.collectMessage': 'Colecciona {{totalPunches}} sellos en {{shopName}} y disfruta',
    'punchCards.completion.complete': 'Completado!',
    'punchCards.completion.ok': '¡OK!',
    
    // QR Code
    'qr.myCode': 'Mi Código QR',
    'qr.showToGet': 'Muestra para obtener {{reward}}',
    
    // Reward Overlay
    'reward.selected': 'SELECCIONADO',
    'reward.tapToRedeem': 'TOCA PARA CANJEAR',
    
    // Landing Page
    'landing.getStarted': 'Comienza hoy:',
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
    'common.errors.networkError': 'Error de red'
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
        translation = translation.replace(`{{${param}}}`, String(value));
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