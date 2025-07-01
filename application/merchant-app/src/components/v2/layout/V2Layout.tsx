import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

export function V2Layout() {
  // The breadcrumbs can be dynamic based on the route in a real app
  const breadcrumbs = [
    { label: 'V2', isCurrentPage: true },
  ];

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      <Outlet />
    </AppShell>
  );
} 