import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';
import { ROUTES } from '@/lib/cn';

export function QRCodeCard() {
  const navigate = useNavigate();

  return (
    <QuickActionCard
      icon={<QrCode className="w-full h-full text-primary" />}
      title="QR Code"
      onClick={() => navigate(ROUTES.WELCOME_QR)}
    />
  );
} 