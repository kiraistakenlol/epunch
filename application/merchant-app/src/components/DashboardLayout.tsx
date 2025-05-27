import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  QrCodeScanner,
  Loyalty,
  AccountCircle,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'QR Scanner', icon: <QrCodeScanner />, path: '/scanner' },
  { text: 'Loyalty Programs', icon: <Loyalty />, path: '/loyalty-programs' },
];

export const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const merchant = useAppSelector(state => state.auth.merchant);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#f5f5dc', fontWeight: 'bold' }}>
          E-PUNCH
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                margin: '4px 8px',
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(245, 245, 220, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(245, 245, 220, 0.3)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(245, 245, 220, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#f5f5dc' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: '#f5f5dc',
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
    <Box sx={{ display: 'flex', backgroundColor: '#424242', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#5d4037',
          height: isMobile ? '60px' : '70px',
        }}
      >
        <Toolbar sx={{ height: isMobile ? '60px' : '70px', minHeight: `${isMobile ? '60px' : '70px'} !important` }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontSize: isMobile ? '1.4em' : '1.8em',
              fontWeight: 'bold',
              textShadow: '1px 1px 1px #3e2723',
              color: '#f5f5dc',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            {isMobile ? 'E PUNCH MERCHANT' : 'E PUNCH.IO MERCHANT'}
            {merchant && (
              <Typography
                component="span"
                sx={{
                  display: 'block',
                  fontSize: isMobile ? '0.7em' : '0.6em',
                  fontWeight: 'normal',
                  opacity: 0.9,
                  lineHeight: 1,
                  mt: isMobile ? 0.5 : 0.2,
                }}
              >
                {merchant.name}
              </Typography>
            )}
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              backgroundColor: '#8d6e63',
              '&:hover': {
                backgroundColor: '#a1887f',
              },
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#795548',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#795548',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#424242',
          minHeight: '100vh',
          marginTop: isMobile ? '60px' : '70px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}; 