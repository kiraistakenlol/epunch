import { DesignVariant } from '../../types';
import CardsScreen from './screens/CardsScreen';
import RewardsScreen from './screens/RewardsScreen';
import ActivityScreen from './screens/ActivityScreen';
import ProfileScreen from './screens/ProfileScreen';

export const cardFirstDesign: DesignVariant = {
  id: 'card-first',
  name: 'Card-First Design',
  description: 'Prioritizes card discovery and management with contextual QR access',
  screens: [
    { id: 'cards', name: 'Cards', component: CardsScreen },
    { id: 'rewards', name: 'Rewards', component: RewardsScreen },
    { id: 'activity', name: 'Activity', component: ActivityScreen },
    { id: 'profile', name: 'Profile', component: ProfileScreen },
  ]
}; 