import React from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { colors } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { ProfileMenu } from './ProfileMenu';

interface AppHeaderProps {
  onDrawerToggle: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const merchant = useAppSelector(state => state.auth.merchant);

  return (
    <AppBar
      className={`app-header ${isMobile ? 'mobile' : 'desktop'}`}
      sx={{
        backgroundColor: colors.primary,
        width: { md: 'calc(100% - 280px)' },
        ml: { md: '280px' },
      }}
    >
      <Toolbar className={`app-toolbar ${isMobile ? 'mobile' : 'desktop'}`}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component="div" 
          className={`app-title ${isMobile ? 'mobile' : 'desktop'}`}
          sx={{ color: colors.text.light }}
        >
          {isMobile ? 'E PUNCH MERCHANT' : 'E PUNCH.IO MERCHANT'}
          {merchant && (
            <Typography
              component="span"
              className={`app-subtitle ${isMobile ? 'mobile' : 'desktop'}`}
            >
              {merchant.name}
            </Typography>
          )}
        </Typography>
        
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}; 