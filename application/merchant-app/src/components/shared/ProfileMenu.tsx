import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';

export const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
        className="app-profile-button"
        sx={{
          backgroundColor: colors.primaryLight,
          '&:hover': {
            backgroundColor: colors.secondaryLight,
          },
        }}
      >
        <AccountCircle />
      </IconButton>
      
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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
    </>
  );
}; 