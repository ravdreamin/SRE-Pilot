import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

export const IsometricTerminalVisual = () => (
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

export const NetworkOrbVisual = () => (
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
