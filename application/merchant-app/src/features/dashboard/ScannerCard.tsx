import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';
import { ROUTES } from '@/lib/cn';

export function ScannerCard() {
  const navigate = useNavigate();

  return (
    <QuickActionCard
      icon={<Camera className="w-full h-full text-primary" />}
      title="Scanner"
      onClick={() => navigate(ROUTES.SCANNER)}
    />
  );
} 