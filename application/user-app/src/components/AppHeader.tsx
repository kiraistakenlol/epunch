import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { useLocalization, LanguageSwitch } from 'e-punch-common-ui';
import { RootState } from '../store/store';
import { selectIsAuthenticated, selectSuperAdmin } from '../features/auth/authSlice';
import { openSignOutModal } from '../features/signOut/signOutSlice';
import { appColors } from '../theme';

interface AppHeaderProps {
  onSignOut?: () => void;
}

const headerStyle: React.CSSProperties = {
  padding: "0 20px",
  color: appColors.epunchBlack,
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "70px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 1000
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.8em",
  flex: 1,
  textAlign: "center"
};

const profileIconStyle: React.CSSProperties = {
  height: "45px",
  aspectRatio: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  border: "none",
  cursor: "pointer",
  backgroundColor: 'transparent',
};

const devLinkStyle: React.CSSProperties = {
  fontSize: "10px",
  color: appColors.epunchBlack,
  textDecoration: "none",
  padding: "2px 4px",
  borderRadius: "2px",
  transition: "color 0.2s ease",
  position: "absolute",
  left: "10px",
  top: "50%",
  transform: "translateY(-50%)"
};

const AppHeader: React.FC<AppHeaderProps> = () => {
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isSuperAdmin = useSelector((state: RootState) => selectSuperAdmin(state));

  const title = t('header.appTitle');
  const showProfileMenu = isAuthenticated;
  const showDevLink = isSuperAdmin;

  const handleSignOut = () => {
    dispatch(openSignOutModal());
  };



  return (
    <header style={headerStyle}>
      {showDevLink && (
        <a
          href="/dev"
          style={devLinkStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.color = appColors.epunchBeige;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = appColors.epunchBlack;
          }}
        >
          {t('header.devLink')}
        </a>
      )}
      
      <LanguageSwitch 
        style={{
          color: appColors.epunchBlack,
          marginRight: '10px'
        }}
      />
      
      <div style={{ width: showProfileMenu ? "40px" : "0" }}></div>
      <div style={logoStyle}>{title}</div>

      {showProfileMenu && (
        <Dropdown align="end">
          <Dropdown.Toggle
            as="div"
            style={profileIconStyle}
            bsPrefix="custom-dropdown-toggle"
          >
            <i className="bi bi-person-fill"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleSignOut}>
              {t('header.signOut')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </header>
  );
};

export default AppHeader; 