import React from 'react';

interface AppHeaderProps {
  title?: string;
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
  height: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.8em",
  fontWeight: "bold",
  textAlign: "center",
  textShadow: "1px 1px 1px #3e2723"
};

const AppHeader: React.FC<AppHeaderProps> = ({ title = "E PUNCH.IO" }) => {
  return (
    <header style={headerStyle}>
      <div style={logoStyle}>{title}</div>
    </header>
  );
};

export default AppHeader; 