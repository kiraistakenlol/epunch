import { Layout as RaLayout } from 'react-admin';
import { Menu } from './Menu';

export const Layout = (props: any) => (
  <RaLayout {...props} menu={Menu} />
); 