// src/pages/Hero.jsx
import React, { useEffect, useRef, useState } from "react";
import { Container, Typography, Box, Button, Grid, Paper, TextField, InputAdornment, Snackbar, Alert, Chip, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import TerminalIcon from '@mui/icons-material/Terminal';
import demoVideo from "../assets/demo.mov";
import StatusRail from "../components/StatusRail";

// --- Components ---

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) clearInterval(timer);
    }, 50); // Typing speed
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

const LiveStatusPulse = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#34C759", // Apple Green
          boxShadow: "0 0 8px rgba(52,199,89, 0.6)"
        }}
      />
      <Typography variant="caption" sx={{ fontWeight: 600, color: "#34C759", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        System Operational
      </Typography>
    </Box>
  );
};

const DynamicMetricPill = () => {
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * (18 - 8 + 1) + 8)); // Random between 8-18ms
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={latency}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Chip
          label={`Latency: ${latency}ms`}
          size="small"
          sx={{
            mt: 2,
            border: "1px solid rgba(0,0,0,0.05)",
            bgcolor: "rgba(255,255,255,0.5)",
            fontWeight: 600,
            color: "#666",
            fontSize: "0.7rem",
            backdropFilter: "blur(4px)"
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

// --- Background Effect ---
const GraphParticleEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null };

    const colors = [
      'rgba(66, 133, 244, 0.8)',
      'rgba(234, 67, 53, 0.8)',
      'rgba(251, 188, 5, 0.8)',
      'rgba(52, 168, 83, 0.8)'
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 3 + 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            const force = (200 - distance) / 200;
            this.vx -= (dx / distance) * force * 0.1;
            this.vy -= (dy / distance) * force * 0.1;
          }
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const colorParts = particles[i].color.match(/rgba?\((\d+), (\d+), (\d+)/);
            if (colorParts) {
              const alpha = 0.2 - (distance / 120) * 0.2;
              ctx.strokeStyle = `rgba(${colorParts[1]}, ${colorParts[2]}, ${colorParts[3]}, ${alpha})`;
            }
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach(particle => { particle.update(); particle.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => { mouse.x = e.x; mouse.y = e.y; }
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: 'transparent', pointerEvents: 'none' }} />
  );
};

// --- Sections ---



// --- Feature Visual Components ---
const CodeSnippetVisual = () => (
  <Box sx={{
    bgcolor: "#1E1E1E",
    borderRadius: "12px",
    p: 2,
    width: "100%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    fontFamily: '"SF Mono", monospace',
    fontSize: "0.7rem",
    color: "#D4D4D4",
    position: "relative",
    overflow: "hidden"
  }}>
    <Box sx={{ display: "flex", gap: 0.8, mb: 1.5 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#FF5F56" }} />
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#FFBD2E" }} />
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#27C93F" }} />
    </Box>
    <Stack spacing={0.5}>
      <Box sx={{ display: 'flex' }}><Box sx={{ color: '#569CD6', mr: 1 }}>func</Box> <Box sx={{ color: '#DCDCAA' }}>DiagnoseError</Box>() &#123;</Box>
      <Box sx={{ pl: 2, display: 'flex' }}><Box sx={{ color: '#C586C0', mr: 1 }}>if</Box> err != <Box sx={{ color: '#569CD6', ml: 1 }}>nil</Box> &#123;</Box>
      <Box sx={{ pl: 4, color: '#6A9955' }}>// AI analyzing root cause...</Box>
      <Box sx={{ pl: 4 }}>return <Box sx={{ color: '#CE9178' }}>"Memory Leak Detected"</Box></Box>
      <Box sx={{ pl: 2 }}>&#125;</Box>
      <Box>&#125;</Box>
    </Stack>
    <motion.div
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ position: 'absolute', bottom: 20, right: 20, width: 8, height: 16, background: '#4285F4' }}
    />
  </Box>
);

const LiveGraphVisual = () => (
  <Box sx={{ width: "100%", height: 120, position: "relative", display: "flex", alignItems: "flex-end", gap: 0.5 }}>
    {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95, 75, 50].map((h, i) => (
      <motion.div
        key={i}
        initial={{ height: 20 }}
        animate={{ height: `${h}%` }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.9)",
          borderRadius: "4px",
          boxShadow: "0 0 10px rgba(255,255,255,0.3)"
        }}
      />
    ))}
    <Box sx={{ position: "absolute", top: 0, right: 0, bgcolor: "#34C759", px: 1, borderRadius: 1 }}>
      <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700 }}>LIVE</Typography>
    </Box>
  </Box>
);

const RemediationVisual = () => (
  <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1.5 }}>
    {["Restarting Pod...", "Flushing Redis Cache...", "Scaling Replisets..."].map((text, i) => (
      <motion.div
        key={i}
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: i * 0.4 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, bgcolor: "rgba(255,255,255,0.2)", p: 1.5, borderRadius: "8px", backdropFilter: "blur(4px)" }}>
          <Box sx={{ bgcolor: "#34C759", borderRadius: "50%", p: 0.5 }}>
            <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
          </Box>
          <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500 }}>{text}</Typography>
        </Box>
      </motion.div>
    ))}
  </Box>
);

const IntegrationVisual = () => (
  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, width: "100%" }}>
    {[
      { icon: <GitHubIcon />, label: "GitHub" },
      { icon: <SecurityIcon />, label: "Vault" },
      { icon: <SpeedIcon />, label: "Grafana" },
      { icon: <SendIcon />, label: "Slack" }
    ].map((item, i) => (
      <motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Box sx={{
          bgcolor: "rgba(255,255,255,0.9)",
          borderRadius: "12px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <Box sx={{ color: "#333" }}>{item.icon}</Box>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#333" }}>{item.label}</Typography>
        </Box>
      </motion.div>
    ))}
  </Box>
);

const HorizontalScrollSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const x = useTransform(smoothProgress, [0, 1], ["1%", "-55%"]);

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
    }
  ];

  return (
    <Box ref={targetRef} sx={{ height: "200vh", position: "relative", bgcolor: "#fff" }}>
      <Box sx={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "hidden", bgcolor: "#fff" }}>
        <motion.div style={{ x, display: "flex", gap: "40px", paddingLeft: "5vw" }}>

          {/* Header Card */}
          <Box sx={{ minWidth: "25vw", display: "flex", flexDirection: "column", justifyContent: "center", pr: 4 }}>
            <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>CAPABILITIES</Typography>
            <Typography variant="h2" fontWeight={800} sx={{ mb: 2, background: "linear-gradient(45deg, #1D1D1F, #424245)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Aegis Platform</Typography>
            <Typography variant="h5" color="text.secondary" lineHeight={1.6}>Scroll to explore how we are redefining reliability.</Typography>
          </Box>

          {/* Feature Cards */}
          {features.map((feature, i) => (
            <Paper key={i} elevation={4} sx={{
              minWidth: "400px",
              height: "60vh",
              background: feature.bg,
              borderRadius: "32px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "transform 0.3s",
              "&:hover": { transform: "translateY(-10px) scale(1.02)" }
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


// --- Unified Dot Grid Background ---
const DotGridEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const dots = [];
    const spacing = 30;

    const init = () => {
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: i * spacing,
            y: j * spacing,
            baseX: i * spacing,
            baseY: j * spacing,
            size: 1.5,
            opacity: Math.random() * 0.5 + 0.1,
            offset: Math.random() * 100
          });
        }
      }
    };
    init();

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1d1d1f";

      dots.forEach(dot => {
        // Gentle floating
        dot.y = dot.baseY + Math.sin((time / 1000) + dot.offset) * 3;

        ctx.globalAlpha = dot.opacity;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.2, pointerEvents: "none" }} />;
};

// --- Modern Perspective Grid Background ---
const PerspectiveGridEffect = () => {
  return (
    <Box sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      zIndex: 0,
      perspective: "1000px",
      opacity: 0.4
    }}>
      <motion.div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "rotateX(60deg)"
        }}
        animate={{ translateY: ["0px", "60px"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, transparent 0%, white 100%)" }} />
    </Box>
  );
};

// --- Abstract Visuals ---

const IsometricTerminalVisual = () => (
  <motion.div
    animate={{ y: [0, -10, 0], rotateZ: [0, 2, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg width="140" height="140" viewBox="0 0 200 200" fill="none">
      {/* Base Shadow */}
      <ellipse cx="100" cy="170" rx="60" ry="10" fill="black" fillOpacity="0.1" />

      {/* Isometric Cube Body */}
      <path d="M100 40 L160 70 V140 L100 170 L40 140 V70 Z" fill="#1D1D1F" />
      <path d="M100 40 L160 70 L100 100 L40 70 Z" fill="#2C2C2E" />
      <path d="M100 100 L160 70 V140 L100 170 Z" fill="#000000" fillOpacity="0.2" />

      {/* Terminal Screen Glow */}
      <path d="M100 100 L40 70 V140 L100 170 Z" fill="#2C2C2E" />

      {/* Code Lines */}
      <rect x="65" y="105" width="40" height="4" rx="2" fill="#34C759" transform="rotate(-26 65 105)" />
      <rect x="65" y="115" width="25" height="4" rx="2" fill="#34C759" transform="rotate(-26 65 115)" opacity="0.5" />

      {/* Prompt */}
      <text x="110" y="70" fill="#34C759" fontSize="24" fontFamily="monospace" fontWeight="bold" transform="rotate(26 110 70)">&gt;_</text>
    </svg>
  </motion.div>
);

const NetworkOrbVisual = () => (
  <Box sx={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {/* Orbit Rings */}
    <motion.div
      style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0, 122, 255, 0.2)', borderRadius: '50%' }}
      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      style={{ position: 'absolute', width: '70%', height: '70%', border: '1px dashed rgba(0, 122, 255, 0.4)', borderRadius: '50%' }}
      animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />

    {/* Core */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 3, repeat: Infinity }}
      style={{
        width: 40,
        height: 40,
        background: "linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)",
        borderRadius: "50%",
        boxShadow: "0 0 30px rgba(0, 122, 255, 0.6)"
      }}
    />
  </Box>
);


const PlatformOptionsSection = () => {
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

            <Button variant="contained" size="large" sx={{
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

// --- Contact Section ---
const ContactSection = () => {
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
    <Box sx={{ py: 10, px: 2, bgcolor: "#fff" }}>
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

// --- Footer ---
const Footer = () => {
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
          ].map((col) => (
            <Grid item xs={6} md={2} key={col.title}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#1D1D1F", mb: 3, display: "block", letterSpacing: 1 }}>{col.title}</Typography>
              <Stack spacing={2}>
                {col.links.map((item) => (
                  <Link key={item} href="#" underline="none" sx={{ color: "#86868B", fontSize: "0.9rem", "&:hover": { color: "#1D1D1F" }, transition: "color 0.2s" }}>
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ pt: 4, borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="body2" color="#86868B">© 2024 SRE-Pilot Inc.</Typography>
          <Stack direction="row" spacing={3}>
            <Link href="#" underline="none" sx={{ color: "#86868B", fontSize: "0.875rem", "&:hover": { color: "#1D1D1F" } }}>Privacy</Link>
            <Link href="#" underline="none" sx={{ color: "#86868B", fontSize: "0.875rem", "&:hover": { color: "#1D1D1F" } }}>Terms</Link>
          </Stack>
        </Box>
      </Container>

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

// --- Main Page Component ---
const LandingPage = () => {
  return (
    <Box sx={{ width: "100%", bgcolor: "#fff" }}>

      {/* 1. Hero Area */}
      <Box sx={{ position: "relative", minHeight: "100vh", width: "100%", marginTop: "-64px", paddingTop: "140px", display: "flex", flexDirection: "column", alignItems: "center", pb: 15, overflow: "hidden" }}>
        <GraphParticleEffect />
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
              <Box sx={{ display: "flex", gap: 2, mt: 6, justifyContent: "center" }}>
                <Button component={Link} to="/console" variant="contained" endIcon={<ArrowForwardIcon />} size="large" sx={{
                  bgcolor: "#1d1d1f", color: "#fff", borderRadius: 99, px: 4, py: 1.8, fontSize: "1rem", textTransform: "none", fontWeight: 600, boxShadow: "0 4px 14px rgba(0,0,0,0.2)", "&:hover": { bgcolor: "#000", transform: "scale(1.02)" }, transition: "all 0.2s"
                }}>
                  Start Monitoring
                </Button>
                <Button component={Link} to="/docs" startIcon={<PlayCircleOutlineIcon />} size="large" sx={{
                  color: "#1d1d1f", bgcolor: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 99, px: 4, py: 1.8, fontSize: "1rem", textTransform: "none", fontWeight: 600, backdropFilter: "blur(10px)", "&:hover": { bgcolor: "#fff", borderColor: "#000" }
                }}>
                  Watch Demo
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

    </Box>
  );
};

export default LandingPage;
