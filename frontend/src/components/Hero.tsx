import { Box, Button, Container, Typography, useTheme, Backdrop, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// New Grid Background Component
const GridBackground = () => (
    <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundImage: `
      linear-gradient(to right, #222 1px, transparent 1px),
      linear-gradient(to bottom, #222 1px, transparent 1px)
    `,
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        opacity: 0.3,
        pointerEvents: 'none',
    }} />
);

// Improved Gradient Glow
const GlowEffect = () => (
    <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
    }} />
);

const Hero = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnalyze = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            navigate('/docs');
        }, 2000);
    };

    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
            }}
        >
            <GridBackground />
            <GlowEffect />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Badge/Pill */}
                    <Box
                        sx={{
                            display: 'inline-block',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: '50px',
                            border: '1px solid #333',
                            bgcolor: 'rgba(255,255,255,0.05)',
                            mb: 4,
                            backdropFilter: 'blur(5px)'
                        }}>
                        <Typography variant="caption" sx={{ color: '#aaa', fontWeight: 500 }}>
                            AEGIS CLI v2.0 Is Now Available
                        </Typography>
                    </Box>

                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 800,
                            // Gradient text
                            background: 'linear-gradient(to bottom, #ffffff 0%, #b0b0b0 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                            fontSize: { xs: '3rem', md: '5rem' } // Slightly smaller for better fit
                        }}
                    >
                        AI-Driven<br />Observability Copilot
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            mb: 6,
                            maxWidth: '640px',
                            mx: 'auto',
                            lineHeight: 1.6,
                            fontWeight: 400,
                            fontSize: '1.25rem'
                        }}
                    >
                        Translate natural language into <b>PromQL</b> instantly with the Aegis CLI.
                        Detect, diagnose, and remediate infrastructure anomalies in seconds.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleAnalyze}
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: '1rem',
                                height: '48px'
                            }}
                        >
                            Analyze Project
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            href="/docs"
                            sx={{
                                py: 1.5,
                                px: 4,
                                height: '48px',
                                fontSize: '1rem'
                            }}
                        >
                            Documentation
                        </Button>
                    </Box>

                </motion.div>
            </Container>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', gap: 2, backdropFilter: 'blur(5px)' }}
                open={analyzing}
            >
                <CircularProgress color="inherit" size={40} thickness={4} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>Scanning codebase...</Typography>
            </Backdrop>
        </Box>
    );
};

export default Hero;
