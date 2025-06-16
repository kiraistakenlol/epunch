import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { colors } from '../../theme';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import './AppLayout.css';

export const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box className="app-layout" sx={{ backgroundColor: colors.background.default }}>
      <CssBaseline />
      
      <AppHeader onDrawerToggle={handleDrawerToggle} />
      
      <AppSidebar 
        mobileOpen={mobileOpen} 
        onDrawerToggle={handleDrawerToggle} 
      />
      
      <Box
        component="main"
        className={`app-main-content ${isMobile ? 'mobile' : 'desktop'}`}
        sx={{ backgroundColor: colors.background.default }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}; 