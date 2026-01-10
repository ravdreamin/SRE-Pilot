import React from "react";
import { Container, Typography, Box, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionIcon from "@mui/icons-material/Description";
import demoVideo from "../assets/demo.mov";
import StatusRail from "../components/StatusRail";

// Components

import { TypingEffect, LiveStatusPulse, DynamicMetricPill } from "../components/home/HeroWidgets";
import { HorizontalScrollSection } from "../components/home/HorizontalScrollSection";
import { PlatformOptionsSection, ContactSection, Footer } from "../components/home/HomeSections";

const Hero = () => {
  return (
    <Box sx={{ width: "100%", bgcolor: "#fff" }}>

      {/* 1. Hero Area */}
      <Box sx={{ position: "relative", minHeight: "100vh", width: "100%", marginTop: "-64px", paddingTop: "140px", display: "flex", flexDirection: "column", alignItems: "center", pb: 15, overflow: "hidden" }}>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
          <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>

            {/* Live Status Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Box sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                mb: 4,
                px: 2.5,
                py: 1,
                borderRadius: "99px",
                // Glassmorphism V2: Light
                background: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(12px) saturate(180%)",
                WebkitBackdropFilter: "blur(12px) saturate(180%)",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6)"
              }}>
                <LiveStatusPulse />
              </Box>
            </motion.div>

            {/* Title & Typing Effect */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: "3rem", md: "5.5rem" }, lineHeight: 1.1, color: "#1d1d1f", mb: 1, letterSpacing: "-0.03em", fontFamily: '"SF Pro Display", "Outfit", sans-serif' }}>
                Meet{" "}
                <Box component="span" sx={{
                  background: "linear-gradient(135deg, #A8B2C1 0%, #4285F4 100%)", // Silver to Blue
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Aegis
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", md: "1.1rem" }, color: "#6e6e73", mb: 3, maxWidth: 800, letterSpacing: "0.15em", wordSpacing: "0.2em", fontFamily: '"SF Mono", "Roboto Mono", monospace', textTransform: "uppercase" }}>
                <TypingEffect text="Autonomous Site Reliability Engineer" />
              </Typography>

              <DynamicMetricPill />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mt: 6, justifyContent: "center", alignItems: "center" }}>
                <Button component={Link} to="/console" variant="contained" endIcon={<ArrowForwardIcon />} size="large" sx={{
                  bgcolor: "#1d1d1f", color: "#fff", borderRadius: 99, px: 4, py: 1.8, fontSize: "1rem", textTransform: "none", fontWeight: 600, boxShadow: "0 4px 14px rgba(0,0,0,0.2)", "&:hover": { bgcolor: "#000", transform: "scale(1.02)" }, transition: "all 0.2s", width: { xs: "100%", sm: "auto" }
                }}>
                  Start Monitoring
                </Button>
                <Button component={Link} to="/docs" startIcon={<DescriptionIcon />} size="large" sx={{
                  color: "#1d1d1f", bgcolor: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 99, px: 4, py: 1.8, fontSize: "1rem", textTransform: "none", fontWeight: 600, backdropFilter: "blur(10px)", "&:hover": { bgcolor: "#fff", borderColor: "#000" }, width: { xs: "100%", sm: "auto" }
                }}>
                  Docs
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Video */}
      <Box sx={{ position: "relative", zIndex: 20, mt: "-15vh", mb: 10 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Box sx={{
              position: "relative",
              borderRadius: { xs: "24px", md: "32px" },
              overflow: "hidden",
              bgcolor: "#000",
              boxShadow: "0 40px 100px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05) inset",
              aspectRatio: "16/9",
              border: "1px solid rgba(0,0,0,0.05)"
            }}>
              <Box component="video" src={demoVideo} autoPlay loop muted playsInline sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Status Rail - Live Telemetry */}
      <Box sx={{ py: 6, bgcolor: "#F5F5F7" }}>
        <Container maxWidth="xl" sx={{ overflow: "hidden" }}>
          <Typography variant="overline" sx={{ display: "block", mb: 3, ml: 3, color: "#86868B", letterSpacing: 1.5, fontWeight: 600, fontSize: "0.75rem" }}>
            LIVE SYSTEM METRICS
          </Typography>
          <StatusRail />
        </Container>
      </Box>

      {/* 2. Horizontal Scroll Features */}
      <HorizontalScrollSection />

      {/* 3. Platform Options (CLI & Web) */}
      <PlatformOptionsSection />

      {/* 4. Stunning Contact Form */}
      <ContactSection />

      {/* 5. Footer */}
      <Footer />

      {/* MASSIVE BACKGROUND TEXT */}
      <Box sx={{
        position: "absolute",
        bottom: "-2vw",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        textAlign: "center",
        zIndex: 1,
        pointerEvents: "none"
      }}>
        <Typography sx={{
          fontSize: { xs: "12vw", md: "16vw" },
          fontWeight: 800,
          lineHeight: 0.8,
          color: "rgba(0,0,0,0.03)", // Subtle watermark style
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          userSelect: "none"
        }}>
          AEGIS SRE-PILOT
        </Typography>
      </Box>

    </Box>
  );
};

export default Hero;
