import React, { useState } from "react";
import UserManagement from "../Dashboard/UserManagement";
import MonthlyManagement from "../Dashboard/MonthlyManagement";
import { Tabs, Tab, Box } from "@mui/material";
import Layout from "./Layout";  // import your existing Layout with header/sidebar

const AdminLayout = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Tabs value={tabIndex} onChange={handleChange} sx={{ mb: 2 }}>
          <Tab label="User Management" />
          <Tab label="Monthly Data Management" />
        </Tabs>

        {tabIndex === 0 && <UserManagement />}
        {tabIndex === 1 && <MonthlyManagement />}
      </Box>
    </Layout>
  );
};

export default AdminLayout;
