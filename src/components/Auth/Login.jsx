import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const wineRedTheme = createTheme({
  palette: {
    primary: { main: "#722f37" },
  },
});

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/admin/user-management");
    }
  }, [user, navigate]);

  return (
    <ThemeProvider theme={wineRedTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f4f4f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5 },
            maxWidth: 400,
            width: "100%",
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Admin Login
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Enter your credentials to access the dashboard.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} mt={3}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
