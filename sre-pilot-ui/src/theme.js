// src/theme.js
import { createTheme } from "@mui/material/styles";

const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif';

export const createAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'light' ? "#F5F5F7" : "#000000",
        paper: mode === 'light' ? "#FFFFFF" : "#1C1C1E",
      },
      text: {
        primary: mode === 'light' ? "#1D1D1F" : "#F5F5F7",
        secondary: mode === 'light' ? "#86868B" : "#A1A1A6",
      },
      primary: {
        main: "#007AFF", // Apple Blue
      },
      error: {
        main: "#FF3B30",
      },
      warning: {
        main: "#FF9500",
      },
      success: {
        main: "#34C759",
      },
      divider: "#E5E5EA",
    },
    typography: {
      fontFamily: FONT_FAMILY,
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
      h1: { fontWeight: 700, letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, letterSpacing: "-0.02em" },
      h3: { fontWeight: 600, letterSpacing: "-0.01em" },
    },
    shape: {
      borderRadius: 20,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "#F5F5F7",
          }
        }
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5EA",
          },
          elevation0: {
            border: "1px solid #E5E5EA",
            boxShadow: "none",
          },
          rounded: {
            borderRadius: 16,
          }
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999, // Pill
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
    },
  });
