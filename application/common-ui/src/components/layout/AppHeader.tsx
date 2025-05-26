import React from 'react';
import { Dropdown } from 'react-bootstrap';

interface AppHeaderProps {
  title?: string;
  showProfileMenu?: boolean;
  onSignOut?: () => void;
}

const headerStyle: React.CSSProperties = {
  backgroundColor: "#5d4037",
  padding: "0 20px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  color: "#f5f5dc",
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
  textShadow: "1px 1px 1px #3e2723",
  flex: 1,
  textAlign: "center"
};

const profileIconStyle: React.CSSProperties = {
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  backgroundColor: "#8d6e63",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  color: "#f5f5dc",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s ease"
};

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = "E PUNCH.IO", 
  showProfileMenu = false, 
  onSignOut 
}) => {
  return (
    <header style={headerStyle}>
      <div style={{ width: showProfileMenu ? "40px" : "0" }}></div>
      <div style={logoStyle}>{title}</div>
      
      {showProfileMenu && (
        <Dropdown align="end">
          <Dropdown.Toggle 
            as="div"
            style={profileIconStyle}
            bsPrefix="custom-dropdown-toggle"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#a1887f';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#8d6e63';
            }}
          >
            <i className="bi bi-person-fill"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={onSignOut}>
              Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </header>
  );
};

export default AppHeader; 