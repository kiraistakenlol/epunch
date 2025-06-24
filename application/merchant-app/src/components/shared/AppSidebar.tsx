import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  QrCodeScanner,
  Loyalty,
  Palette,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '../../theme';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'QR Scanner', icon: <QrCodeScanner />, path: '/scanner' },
  { text: 'Welcome QR', icon: <QrCodeIcon />, path: '/welcome-qr' },
  { text: 'Loyalty Programs', icon: <Loyalty />, path: '/loyalty-programs' },
  { text: 'DesignPage', icon: <Palette />, path: '/design' },
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ 
  mobileOpen, 
  onDrawerToggle 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onDrawerToggle();
    }
  };

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ color: colors.text.light, fontWeight: 'bold' }}
        >
          E-PUNCH
        </Typography>
      </Toolbar>
      
      <List className="app-nav-list">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              className={`app-nav-item ${location.pathname === item.path ? 'selected' : ''}`}
            >
              <ListItemIcon sx={{ color: colors.text.light }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: colors.text.light,
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  } 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" className="app-drawer">
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            backgroundColor: colors.secondary,
            ...theme.mixins.toolbar,
            width: 280,
          },
        }}
        className="app-drawer-paper"
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            backgroundColor: colors.secondary,
            width: 280,
          },
        }}
        className="app-drawer-paper"
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}; 