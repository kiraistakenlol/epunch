import { DesignVariant } from '../../types';
import EmptyScreen from './screens/EmptyScreen';

export const minimalVariant: DesignVariant = {
  id: 'minimal',
  name: 'Safari Frame Preview',
  description: 'Empty screen to showcase the Safari browser chrome',
  screens: [
    {
      id: 'empty',
      name: 'Empty Screen',
      component: EmptyScreen
    }
  ]
}; 