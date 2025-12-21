// src/components/StatusRail.jsx
import React from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import StatusCard from "./StatusCard";

// --- Mock Data ---
const METRICS = [
    { id: 1, label: "CPU LOAD", value: "42%", delta: "+2.4%", isPositive: true, color: "#007AFF", data: [20, 25, 30, 28, 35, 42] },
    { id: 2, label: "MEMORY", value: "64%", delta: "+1.1%", isPositive: false, color: "#FF9500", data: [55, 60, 58, 62, 63, 64] },
    { id: 3, label: "NETWORK", value: "1.2 GB/s", delta: "+5.0%", isPositive: true, color: "#34C759", data: [0.8, 1.0, 1.1, 0.9, 1.3, 1.2] },
    { id: 4, label: "ACTIVE PODS", value: "42", delta: "0%", isPositive: true, color: "#AF52DE", data: [38, 40, 41, 39, 42, 42] },
    { id: 5, label: "ERROR RATE", value: "0.01%", delta: "-0.05%", isPositive: true, color: "#34C759", data: [0.05, 0.04, 0.03, 0.02, 0.015, 0.01] },
    { id: 6, label: "LATENCY", value: "12ms", delta: "-2ms", isPositive: true, color: "#007AFF", data: [18, 16, 15, 14, 13, 12] },
    { id: 7, label: "DISK I/O", value: "84 MB/s", delta: "+12%", isPositive: false, color: "#8E8E93", data: [70, 75, 80, 78, 82, 84] }
];

const GAP = 16;
const CARD_WIDTH = 200;

const StatusRail = () => {
    // Duplicate metrics to create a seamless infinite loop
    const SCROLL_ITEMS = [...METRICS, ...METRICS, ...METRICS];

    return (
        <Box
            sx={{
                width: "100%",
                overflow: "hidden",
                py: 2,
                position: "relative",
                // Edges fade out for cool effect
                maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
            }}
        >
            <motion.div
                animate={{ x: [0, -1 * (METRICS.length * (CARD_WIDTH + GAP))] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30, // Adjust for speed
                        ease: "linear",
                    },
                }}
                style={{
                    display: "flex",
                    gap: GAP,
                    width: "fit-content",
                    paddingLeft: GAP, // Initial offset
                }}
            >
                {SCROLL_ITEMS.map((metric, index) => (
                    <Box key={`${metric.id}-${index}`} sx={{ flexShrink: 0 }}>
                        <StatusCard {...metric} />
                    </Box>
                ))}
            </motion.div>
        </Box>
    );
};

export default StatusRail;
