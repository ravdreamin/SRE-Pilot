import React, { useState, useEffect } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export const TypingEffect = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let index = 0;
        setDisplayedText(""); // Reset on text change
        const timer = setInterval(() => {
            index++;
            setDisplayedText(text.slice(0, index));
            if (index === text.length) clearInterval(timer);
        }, 50);
        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayedText}</span>;
};

export const LiveStatusPulse = () => {
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

export const DynamicMetricPill = () => {
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
