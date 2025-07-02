
export * from '@/components/ui/button';
export * from '@/components/ui/input';
export * from '@/components/ui/card';
export * from '@/components/ui/table';
export * from '@/components/ui/form';
export * from '@/components/ui/select';
export * from '@/components/ui/switch';
export * from '@/components/ui/dialog';
export * from '@/components/ui/toast';
export * from '@/components/ui/badge';
export * from '@/components/ui/tabs';
export * from '@/components/ui/sheet';
export * from '@/components/ui/dropdown-menu';
export * from '@/components/ui/separator';
export * from '@/components/ui/skeleton';
export * from '@/components/ui/progress';
export * from '@/components/ui/alert';
export * from '@/components/ui/avatar';
export * from '@/components/ui/checkbox';
export * from '@/components/ui/label';
export * from '@/components/ui/scroll-area';
export * from '@/components/ui/sidebar';
export * from '@/components/ui/breadcrumb';
export * from '@/components/ui/navigation-menu';
export * from '@/components/ui/menubar';
export * from '@/components/ui/collapsible';

export * from './layout/AppShell';
export * from './layout/AppSidebar';
export * from './layout/PageContainer';

export { FormField as V2FormField } from './forms/FormField'
export { FormActions } from './forms/FormActions'
export { FormErrorDisplay } from './forms/FormErrorDisplay'
export { LoginForm } from './forms/LoginForm'
export { LoyaltyProgramForm } from './forms/LoyaltyProgramForm'
export { ColorPicker } from './forms/ColorPicker'
export { useLoginForm, useLoyaltyProgramForm } from './forms/hooks/useForm'

// Scanner components
export { ScannerInterface } from './scanner/ScannerInterface'
export { QRScanner } from './scanner/QRScanner'
export { ScannerCamera } from './scanner/ScannerCamera'
export { CustomerScanResult } from './scanner/CustomerScanResult'
export { PunchCardScanResult } from './scanner/PunchCardScanResult'
export { useScanner } from './scanner/hooks/useScanner'
export type { ScannerState, QRScanResult } from './scanner/hooks/useScanner'

// Design components - using actual existing components
export * from './design'

// Data Display components
export { StatusBadge } from './data-display/StatusBadge'

// Hooks
export { useDataTable } from './hooks/use-data-table'
