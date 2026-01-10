// src/App.jsx
import React, { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createAppTheme } from "./theme";
import Layout from "./components/Layout";
import ScrollHandler from "./components/ScrollHandler";
import Hero from "./pages/Hero";
import Documentation from "./pages/Documentation";
import Console from "./pages/Console";
import Dashboard from "./pages/Dashboard";

function App() {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ScrollHandler />
        <Layout toggleColorMode={toggleColorMode} mode={mode}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/console" element={<Console />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
