import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ROLES } from 'e-punch-common-core';
import { useAppSelector } from '../../store/hooks';
import { colors } from '../../theme';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import './AppLayout.css';

export const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const shouldShowSidebar = user?.role === ROLES.ADMIN;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box className="app-layout" sx={{ backgroundColor: colors.background.default }}>
      <CssBaseline />
      
      <AppHeader 
        onDrawerToggle={handleDrawerToggle} 
        showMenuButton={shouldShowSidebar}
      />
      
      {shouldShowSidebar && (
        <AppSidebar 
          mobileOpen={mobileOpen} 
          onDrawerToggle={handleDrawerToggle} 
        />
      )}
      
      <Box
        component="main"
        className={`app-main-content ${isMobile ? 'mobile' : 'desktop'} ${!shouldShowSidebar ? 'no-sidebar' : ''}`}
        sx={{ backgroundColor: colors.background.default }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}; 