import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const Layout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Hedge Fund Tracker
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex", flexGrow: 1 }}>
        <nav style={{ width: "200px", padding: "20px", background: "#f4f4f4" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/user-management">User Management</Link>
            </li>
            <li>
              <Link to="/admin/monthly-management">Monthly Data Management</Link>
            </li>
          </ul>
        </nav>
        <main style={{ padding: "20px", flexGrow: 1, overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
