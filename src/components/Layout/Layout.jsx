// src/components/Layout/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Layout = ({ children, onLogout }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Hedge Fund Tracker
          </Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex" }}>
        <nav style={{ width: "200px", padding: "20px", background: "#f4f4f4" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin">User Management</Link>
            </li>
          </ul>
        </nav>
        <main style={{ padding: "20px", flexGrow: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
