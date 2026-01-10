// src/components/Layout.jsx
import React, { useState } from "react";
import { Box, Container, AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Layout = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setMobileOpen(newOpen);
  };

  const navItems = [
    { label: "Features", path: "/#features" },

    { label: "Documentation", path: "/docs" },
    { label: "Console", path: "/console" },
    { label: "Contact", path: "/#contact" }
  ];

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

            {/* Center: Navigation Links (Desktop) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              {navItems.map((item) => {
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

            {/* Right Side: Desktop Action + Mobile Toggle */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: 'center' }}>


              {/* Mobile Menu Icon */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={toggleDrawer(true)}
                sx={{ display: { md: 'none' }, color: '#1D1D1F' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { width: '100%', maxWidth: 300, bgcolor: "#fff" } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pt: 2, pb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, fontFamily: '"Outfit", sans-serif' }}>Menu</Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link} to={item.path}
                  onClick={toggleDrawer(false)}
                  sx={{ borderRadius: 2, '&:hover': { bgcolor: '#f5f5f7' } }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '1.2rem', fontWeight: 500, color: '#1D1D1F' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 4 }}>

          </Box>
        </Box>
      </Drawer>

      <Box sx={{ pt: "64px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
      </Box>
    </>
  );
};

export default Layout;
