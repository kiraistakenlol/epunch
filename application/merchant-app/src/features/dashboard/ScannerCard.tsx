import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { DashboardCard } from '@/components/shared/data-display/DashboardCard';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/cn';

export function ScannerCard() {
  const navigate = useNavigate();

  return (
    <DashboardCard
      title="Scanner"
      description="Scan QR codes to add punches or redeem rewards"
      className="col-span-1"
      footer={<Button onClick={() => navigate(ROUTES.SCANNER)}>Open Scanner</Button>}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <QrCode className="h-12 w-12 text-muted-foreground" />
      </div>
    </DashboardCard>
  );
} 