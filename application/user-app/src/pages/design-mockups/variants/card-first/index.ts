import { DesignVariant } from '../../types';
import DashboardScreen from './screens/DashboardScreen';
import CardsScreen from './screens/CardsScreen';
import RewardsScreen from './screens/RewardsScreen';

export const cardFirstVariant: DesignVariant = {
  id: 'card-first',
  name: 'Card-First Dashboard',
  description: 'Visual punch cards as the hero feature with QR on-demand',
  screens: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      component: DashboardScreen
    },
    {
      id: 'cards',
      name: 'My Cards',
      component: CardsScreen
    },
    {
      id: 'rewards',
      name: 'Rewards',
      component: RewardsScreen
    }
  ]
}; 