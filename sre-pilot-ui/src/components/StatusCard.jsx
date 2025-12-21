// src/components/StatusCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

// --- Constants ---
const CARD_WIDTH = 200;
const CARD_HEIGHT = 100;
const FONT_FAMILY = '"SF Pro Text", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// --- Smooth Sparkline Component ---
const Sparkline = ({ data, color = "#007AFF" }) => {
    const width = 160;
    const height = 40;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Generate points
    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / range) * height
    }));

    // Generate smooth Bézier curve
    const pathD = points.reduce((acc, point, i, arr) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prev = arr[i - 1];
        const cpx1 = prev.x + (point.x - prev.x) / 3;
        const cpx2 = prev.x + 2 * (point.x - prev.x) / 3;
        return `${acc} C ${cpx1} ${prev.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`;
    }, "");

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0
            }}
        >
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>

            <path d={`${pathD} L ${width} ${height} L 0 ${height} Z`} fill={`url(#grad-${color})`} />
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

// --- Main Component ---
const StatusCard = ({ label, value, delta, isPositive, data, color = "#007AFF" }) => {
    return (
        <motion.div
            whileHover={{ y: -2, borderColor: "#C7C7CC" }}
            whileTap={{ scale: 0.98 }}
            style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid #E5E5EA",
                padding: "16px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                transition: "box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2 }}>
                <Typography variant="caption" sx={{ fontFamily: FONT_FAMILY, fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", color: "#86868B", textTransform: "uppercase" }}>
                    {label}
                </Typography>
                {delta && (
                    <Box sx={{ bgcolor: isPositive ? "rgba(52, 199, 89, 0.1)" : "rgba(255, 59, 48, 0.1)", borderRadius: "4px", px: 0.5, py: 0.25, display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontFamily: FONT_FAMILY, fontSize: "10px", fontWeight: 600, color: isPositive ? "#34C759" : "#FF3B30", lineHeight: 1 }}>{delta}</Typography>
                    </Box>
                )}
            </Box>

            <Typography variant="h4" sx={{ fontFamily: FONT_FAMILY, fontSize: "24px", fontWeight: 500, color: "#1D1D1F", fontFeatureSettings: '"tnum"', letterSpacing: "-0.02em", zIndex: 2, mt: 1 }}>
                {value}
            </Typography>

            <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", zIndex: 1, opacity: 0.8, pointerEvents: "none" }}>
                <Sparkline data={data} color={color} />
            </Box>
        </motion.div>
    );
};

export default StatusCard;
