import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

export function V2Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
} 