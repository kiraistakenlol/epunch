import { DesignVariant } from '../../types';
import HomeDashboard from './screens/HomeDashboard';
import RewardsManagement from './screens/RewardsManagement';
import ActivityFeed from './screens/ActivityFeed';

export const qrFirstDesign: DesignVariant = {
  id: 'qr-first',
  name: 'QR-First Design',
  description: 'Minimalistic black & white design with Wallet, History, Account navigation',
  screens: [
    { id: 'wallet', name: 'Wallet', component: HomeDashboard },
    { id: 'history', name: 'History', component: ActivityFeed },
    { id: 'account', name: 'Account', component: RewardsManagement }
  ]
}; 