import React, { useRef } from "react";
import { Box, Typography, Paper, Chip, useMediaQuery, useTheme } from "@mui/material";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { CodeSnippetVisual, LiveGraphVisual, RemediationVisual, IntegrationVisual, ScalingVisual } from "./FeatureVisuals";

export const HorizontalScrollSection = () => {
    const targetRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const x = useTransform(smoothProgress, [0, 1], ["1%", "-75%"]);

    const features = [
        {
            title: "Watchtower Core",
            subtitle: "Autonomous Guardian",
            desc: "Always-on monitoring that tracks system heartbeats in real-time.",
            bg: "linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)", // Professional Dark
            visual: <LiveGraphVisual />,
            badge: "MONITORING"
        },
        {
            title: "Neural Diagnosis",
            subtitle: "AI Root Cause Analysis",
            desc: "Aegis ingests error logs and outputs precise fix suggestions code.",
            bg: "linear-gradient(135deg, #2D3436 0%, #000000 100%)",
            visual: <CodeSnippetVisual />,
            badge: "INTELLIGENCE"
        },
        {
            title: "Auto-Remediation",
            subtitle: "One-Click Fixes",
            desc: "Turn insights into action with approved automated healing scripts.",
            bg: "linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)", // Blue-Aqua
            visual: <RemediationVisual />,
            badge: "AUTOMATION"
        },
        {
            title: "Integration Hub",
            subtitle: "Plug & Play",
            desc: "Seamlessly connects with your existing observability stack.",
            bg: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)", // Red-Pink
            visual: <IntegrationVisual />,
            badge: "ECOSYSTEM"
        },
        {
            title: "Predictive Scaling",
            subtitle: "Future-Proof",
            desc: "Anticipates traffic spikes and scales resources before they are needed.",
            bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", // Green Gradient
            visual: <ScalingVisual />,
            badge: "PERFORMANCE"
        }
    ];

    return (
        <Box id="features" ref={targetRef} sx={{ height: isMobile ? "auto" : "300vh", position: "relative", bgcolor: "#fff", py: isMobile ? 8 : 0 }}>
            <Box sx={{
                position: isMobile ? "relative" : "sticky",
                top: 0,
                height: isMobile ? "auto" : "100vh",
                display: "flex",
                alignItems: "center",
                overflow: isMobile ? "visible" : "hidden",
                bgcolor: "#fff",
                flexDirection: isMobile ? "column" : "row"
            }}>
                <motion.div style={{
                    x: isMobile ? 0 : x,
                    display: "flex",
                    gap: "40px",
                    paddingLeft: isMobile ? 0 : "5vw",
                    paddingRight: isMobile ? 0 : 0,
                    paddingBottom: isMobile ? "40px" : 0,
                    flexDirection: isMobile ? "column" : "row",
                    width: isMobile ? "100%" : "auto",
                    alignItems: isMobile ? "center" : "flex-start"
                }}>

                    {/* Header Card */}
                    <Box sx={{
                        minWidth: isMobile ? "90%" : "25vw",
                        maxWidth: isMobile ? "90%" : "none",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        pr: isMobile ? 0 : 4,
                        textAlign: isMobile ? "center" : "left",
                        mb: isMobile ? 4 : 0
                    }}>
                        <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>CAPABILITIES</Typography>
                        <Typography variant="h2" fontWeight={800} sx={{ mb: 2, background: "linear-gradient(45deg, #1D1D1F, #424245)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: { xs: "2.5rem", md: "3.75rem" } }}>The Aegis Platform</Typography>
                        <Typography variant="h5" color="text.secondary" lineHeight={1.6} sx={{ fontSize: { xs: "1.1rem", md: "1.5rem" } }}>Scroll to explore how we are redefining reliability.</Typography>
                    </Box>

                    {/* Feature Cards */}
                    {features.map((feature, i) => (
                        <Paper key={i} elevation={4} sx={{
                            minWidth: isMobile ? "90%" : "400px",
                            maxWidth: isMobile ? "90%" : "400px",
                            height: isMobile ? "500px" : "60vh",
                            background: feature.bg,
                            borderRadius: "32px",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.1)",
                            transition: "transform 0.3s",
                            "&:hover": { transform: isMobile ? "none" : "translateY(-10px) scale(1.02)" }
                        }}>
                            {/* Top Visual Area */}
                            <Box sx={{
                                height: "50%",
                                p: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.05)"
                            }}>
                                {feature.visual}
                            </Box>

                            {/* Bottom Content Area */}
                            <Box sx={{
                                flex: 1,
                                bgcolor: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(20px)",
                                p: 4,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}>
                                <Chip label={feature.badge} size="small" sx={{ width: "fit-content", mb: 2, fontWeight: 700, bgcolor: "#1D1D1F", color: "#fff" }} />
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: "#1D1D1F" }}>{feature.title}</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#86868B", mb: 2 }}>{feature.subtitle}</Typography>
                                <Typography variant="body1" sx={{ color: "#5F6368", lineHeight: 1.6 }}>{feature.desc}</Typography>
                            </Box>
                        </Paper>
                    ))}
                </motion.div>
            </Box>
        </Box>
    );
};
