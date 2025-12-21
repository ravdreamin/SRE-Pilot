// src/components/Layout.jsx
import React from "react";
import { Box, Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Layout = ({ children }) => {
  const location = useLocation();
  // Simple hover state is enough, no need for complex pill animation if we want strict "Enterprise" look, 
  // but a subtle one is nice. keeping it minimal.
  const [hoveredPath, setHoveredPath] = React.useState(null);

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.8)", // High translucency
          backdropFilter: "blur(20px) saturate(180%)", // Apple-like frosting
          borderBottom: "1px solid #E5E5EA",
          height: 64, // Standard height
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between", minHeight: '64px !important' }}>

            {/* Left Side: Brand */}
            <Link to="/" style={{ textDecoration: "none", display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.primary" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    fontSize: "1.25rem",
                    color: "#1D1D1F",
                    letterSpacing: "-0.01em",
                    fontFamily: '"Outfit", sans-serif'
                  }}
                >
                  Aegis <Box component="span" sx={{ color: "#E5E5EA", mx: 1 }}>|</Box> <Box component="span" sx={{ color: "#86868B" }}>SRE-Pilot</Box>
                </Typography>
              </Box>
            </Link>

            {/* Center: Navigation Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              {[{ label: "Overview", path: "/" }, { label: "Features", path: "/#features" }, { label: "Documentation", path: "/docs" }, { label: "Console", path: "/console" }].map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        fontFamily: '"Inter", sans-serif',
                        color: isActive ? "#1D1D1F" : "#5F6368",
                        transition: "color 0.2s",
                        "&:hover": { color: "#1D1D1F" }
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                )
              })}
            </Box>

            {/* Right Side: Action Pills */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                component={Link}
                to="/console"
                sx={{
                  bgcolor: "#1D1D1F",
                  color: "#FFFFFF",
                  textTransform: "none",
                  borderRadius: "8px", // Slightly squared
                  px: 2,
                  py: 0.8,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#000000" },
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}
              >
                Access Console
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ pt: "64px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
      </Box>
    </>
  );
};

export default Layout;
