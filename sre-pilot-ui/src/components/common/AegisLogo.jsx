import React from "react";
import { motion } from "framer-motion";

export const AegisLogo = ({ size = 32, animated = true }) => (
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ width: size, height: size, position: 'relative' }}
    >
        <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
                <linearGradient id="aegisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#087EA4" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Outer Ring */}
            <motion.circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="url(#aegisGradient)"
                strokeWidth="2"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: animated ? [283, 0] : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Inner Shield */}
            <motion.path
                d="M50 20 L75 35 L75 55 Q75 75 50 85 Q25 75 25 55 L25 35 Z"
                fill="url(#aegisGradient)"
                filter="url(#glow)"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ transformOrigin: 'center' }}
            />

            {/* Center A */}
            <motion.text
                x="50" y="58"
                textAnchor="middle"
                fill="#fff"
                fontSize="28"
                fontWeight="700"
                fontFamily="system-ui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                A
            </motion.text>

            {/* Pulse Ring */}
            {animated && (
                <motion.circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#087EA4"
                    strokeWidth="1"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    style={{ transformOrigin: 'center' }}
                />
            )}
        </svg>
    </motion.div>
);
