import { Menu as RaMenu, MenuItemLink } from 'react-admin';
import { QrCodeScanner, Loyalty, Dashboard } from '@mui/icons-material';

export const Menu = () => {
  return (
    <RaMenu>
      <MenuItemLink
        to="/"
        primaryText="Dashboard"
        leftIcon={<Dashboard />}
      />
      <MenuItemLink
        to="/scanner"
        primaryText="QR Scanner"
        leftIcon={<QrCodeScanner />}
      />
      <MenuItemLink
        to="/loyalty-programs"
        primaryText="Loyalty Programs"
        leftIcon={<Loyalty />}
      />
    </RaMenu>
  );
}; 