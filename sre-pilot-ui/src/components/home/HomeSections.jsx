import React, { useState } from "react";
import { Container, Typography, Box, Button, Grid, TextField, Chip, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { PerspectiveGridEffect } from "./BackgroundEffects";
import { IsometricTerminalVisual, NetworkOrbVisual } from "./AbstractVisuals";

export const PlatformOptionsSection = () => {
    return (
        <Box sx={{ py: 15, bgcolor: "#fff", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center" }}>
            <PerspectiveGridEffect />

            {/* Centered Wrapper */}
            <Box sx={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: "1000px",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 8, md: 0 }
            }}>

                {/* Left: For Developers (CLI) */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} style={{ flex: 1, width: "100%" }}>
                    <Box sx={{
                        width: "100%",
                        borderRight: { md: "1px dashed rgba(0,0,0,0.1)" },
                        p: { xs: 2, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                    }}>
                        <Chip label="DEVELOPER PREVIEW" size="small" sx={{
                            bgcolor: "rgba(52, 199, 89, 0.1)",
                            borderRadius: "8px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            color: "#34C759",
                            mb: 3,
                            px: 1
                        }} />

                        <Typography variant="h3" sx={{ fontWeight: 600, color: "#1D1D1F", mb: 0.5, letterSpacing: "-0.03em" }}>
                            For Developers
                        </Typography>
                        <Typography variant="h3" sx={{
                            fontWeight: 800,
                            mb: 4,
                            letterSpacing: "-0.02em",
                            background: "linear-gradient(135deg, #1D1D1F 0%, #86868B 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Build without limits.
                        </Typography>

                        <Box sx={{ mb: 6, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <IsometricTerminalVisual />
                        </Box>

                        <Button variant="contained" size="large" href="https://github.com/ravdreamin/SRE-Pilot" target="_blank" sx={{
                            bgcolor: "#1d1d1f",
                            color: "#fff",
                            borderRadius: "16px",
                            px: 5,
                            py: 1.8,
                            fontSize: "0.95rem",
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)",
                            "&:hover": { bgcolor: "#000", transform: "translateY(-2px)", boxShadow: "0 25px 50px -10px rgba(0,0,0,0.4)" },
                            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
                        }}>
                            Download CLI v1.0
                        </Button>
                    </Box>
                </motion.div>

                {/* Right: For Organizations (Web) */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} style={{ flex: 1, width: "100%" }}>
                    <Box sx={{
                        width: "100%",
                        p: { xs: 2, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                    }}>
                        <Chip label="ENTERPRISE SCALE" size="small" sx={{
                            bgcolor: "rgba(0, 122, 255, 0.1)",
                            borderRadius: "8px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            color: "#007AFF",
                            mb: 3,
                            px: 1
                        }} />

                        <Typography variant="h3" sx={{ fontWeight: 600, color: "#1D1D1F", mb: 0.5, letterSpacing: "-0.03em" }}>
                            For Teams
                        </Typography>
                        <Typography variant="h3" sx={{
                            fontWeight: 800,
                            mb: 4,
                            letterSpacing: "-0.02em",
                            background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)", // Blue to Purple
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Scale with intelligence.
                        </Typography>

                        <Box sx={{ mb: 6, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <NetworkOrbVisual />
                        </Box>

                        <Button variant="outlined" size="large" component={Link} to="/console" sx={{
                            borderColor: "rgba(0,0,0,0.1)",
                            color: "#1d1d1f",
                            bgcolor: "#fff",
                            borderRadius: "16px",
                            px: 5,
                            py: 1.8,
                            fontSize: "0.95rem",
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                            "&:hover": { borderColor: "#000", bgcolor: "#fff", transform: "translateY(-2px)" },
                            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
                        }}>
                            Open Console
                        </Button>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
};

export const ContactSection = () => {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSend = () => {
        if (!message) return;
        const subject = encodeURIComponent("Inquiry from SRE-Pilot");
        const body = encodeURIComponent(`From: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:ravcr8r@gmail.com?subject=${subject}&body=${body}`;
        setOpenSnackbar(true);
        setMessage(""); setEmail("");
    };

    return (
        <Box id="contact" sx={{ py: 10, px: 2, bgcolor: "#fff" }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        position: "relative",
                        bgcolor: "#000", // Keep this one black for contrast (Contact Card)
                        borderRadius: "48px",
                        p: { xs: 6, md: 10 },
                        minHeight: 500,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "flex-start", md: "center" },
                        justifyContent: "space-between",
                        gap: 6,
                        color: "#fff"
                    }}
                >
                    {/* Left Content */}
                    <Box sx={{ position: "relative", zIndex: 1, maxWidth: 500 }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                            <Typography variant="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500, color: "#fff", fontSize: { xs: "2.5rem", md: "3.5rem" }, lineHeight: 1.2, mb: 5 }}>
                                Get in touch with<br />
                                <Box component="span" sx={{ color: "#4285f4" }}>SRE-Pilot</Box>
                            </Typography>
                        </motion.div>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button variant="contained" startIcon={<GitHubIcon />} href="https://github.com/ravdreamin" target="_blank" sx={{ bgcolor: "#fff", color: "#000", borderRadius: 99, px: 4, py: 1.5, "&:hover": { bgcolor: "#f1f3f4" } }}>
                                Follow on GitHub
                            </Button>
                            <Button variant="contained" startIcon={<LinkedInIcon />} href="https://www.linkedin.com/in/ravdreamin/" target="_blank" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 99, px: 4, py: 1.5, "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
                                Connect on LinkedIn
                            </Button>
                        </Box>
                    </Box>

                    {/* Right Content */}
                    <Box sx={{ position: "relative", zIndex: 1, width: { xs: "100%", md: 350 } }}>
                        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", mb: 3 }}>Or send a quick message:</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <TextField label="Email Address" variant="filled" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ disableUnderline: true }} sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2, input: { color: "#fff" } }} />
                            <TextField label="Message" variant="filled" fullWidth multiline rows={4} value={message} onChange={(e) => setMessage(e.target.value)} InputProps={{ disableUnderline: true }} sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2, textarea: { color: "#fff" } }} />
                            <Button variant="contained" fullWidth onClick={handleSend} disabled={!message} sx={{ bgcolor: "#4285f4", borderRadius: 99, py: 1.5 }}>Send</Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%', borderRadius: 4, bgcolor: "#34a853", color: "#fff" }}>Opening your email client...</Alert>
            </Snackbar>
        </Box>
    );
};

export const Footer = () => {
    return (
        <Box sx={{ bgcolor: "#F5F5F7", pt: 12, pb: 4, px: { xs: 2, md: 8 }, overflow: "hidden", position: "relative" }}>
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
                <Grid container spacing={8} sx={{ mb: 12 }}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1D1D1F", mb: 2, letterSpacing: "-0.02em" }}>
                            Aegis.
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#86868B", maxWidth: 300, lineHeight: 1.6 }}>
                            Redefining infrastructure reliability with autonomous intelligence.
                        </Typography>
                    </Grid>

                    {[
                        { title: "PRODUCT", links: ['Features', 'Integrations', 'Security', 'Enterprise'] },
                        { title: "RESOURCES", links: ['Documentation', 'API Reference', 'Status', 'Blog'] },
                        { title: "COMPANY", links: ['About', 'Careers', 'Legal', 'Privacy'] }
                    ].map((col, i) => (
                        <Grid key={i} item xs={6} md={2}>
                            <Typography variant="caption" sx={{ color: "#1D1D1F", fontWeight: 700, mb: 3, display: "block", letterSpacing: "0.05em" }}>
                                {col.title}
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {col.links.map(link => (
                                    <Typography key={link} variant="body2" sx={{ color: "#86868B", cursor: "pointer", "&:hover": { color: "#007AFF" } }}>
                                        {link}
                                    </Typography>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ borderTop: "1px solid #E5E5EA", pt: 4, display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                    <Typography variant="caption" sx={{ color: "#86868B" }}>
                        © 2024 Aegis AI Inc. All rights reserved.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 4 }}>
                        <Typography variant="caption" sx={{ color: "#86868B" }}>Privacy Policy</Typography>
                        <Typography variant="caption" sx={{ color: "#86868B" }}>Terms of Use</Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
