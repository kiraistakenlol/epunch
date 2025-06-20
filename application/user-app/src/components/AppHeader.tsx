import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { RootState } from '../store/store';
import { selectIsAuthenticated, selectSuperAdmin } from '../features/auth/authSlice';
import { openSignOutModal } from '../features/signOut/signOutSlice';
import { colors } from '../theme';

interface AppHeaderProps {
  onSignOut?: () => void;
}

const headerStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  padding: "0 20px",
          boxShadow: `0 2px 4px ${colors.shadow.border}`,
  color: colors.text.light,
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
  fontWeight: "bold",
  textShadow: `1px 1px 1px ${colors.text.secondary}`,
  flex: 1,
  textAlign: "center"
};

const profileIconStyle: React.CSSProperties = {
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  backgroundColor: colors.primaryLight,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  color: colors.text.light,
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s ease"
};

const devLinkStyle: React.CSSProperties = {
  fontSize: "10px",
  color: colors.text.disabled,
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
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isSuperAdmin = useSelector((state: RootState) => selectSuperAdmin(state));

  const title = "EPunch";
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
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = colors.text.disabled;
          }}
        >
          dev
        </a>
      )}
      <div style={{ width: showProfileMenu ? "40px" : "0" }}></div>
      <div style={logoStyle}>{title}</div>
      
      {showProfileMenu && (
        <Dropdown align="end">
          <Dropdown.Toggle 
            as="div"
            style={profileIconStyle}
            bsPrefix="custom-dropdown-toggle"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.secondaryLight;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryLight;
            }}
          >
            <i className="bi bi-person-fill"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleSignOut}>
              Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </header>
  );
};

export default AppHeader; 