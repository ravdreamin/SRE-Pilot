import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import CheckIcon from '@mui/icons-material/Check';
import GitHubIcon from '@mui/icons-material/GitHub';
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import SendIcon from '@mui/icons-material/Send';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const CodeSnippetVisual = () => (
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

export const LiveGraphVisual = () => (
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

export const RemediationVisual = () => (
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

export const IntegrationVisual = () => (
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

export const ScalingVisual = () => (
    <Box sx={{ width: "100%", height: 120, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
                position: 'absolute',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)'
            }}
        />
        <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            style={{
                position: 'absolute',
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.4)'
            }}
        />
        <Box sx={{
            bgcolor: "#fff",
            borderRadius: "12px",
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
            <TrendingUpIcon color="primary" />
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">Scaling Up</Typography>
        </Box>
    </Box>
);
