import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export const MetricCard = ({ icon: Icon, label, value, unit, color, loading }) => (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }}>
        <Box sx={{
            p: 2,
            bgcolor: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
        }}>
            <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ duration: 2, repeat: loading ? Infinity : 0, ease: "linear" }}
            >
                <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: `${color}12`, color }}>
                    <Icon sx={{ fontSize: 20 }} />
                </Box>
            </motion.div>
            <Box>
                <Typography sx={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</Typography>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: loading ? '#ccc' : '#111' }}>
                    {loading ? '—' : value}<span style={{ fontSize: '0.7rem', color: '#888', marginLeft: 3 }}>{unit}</span>
                </Typography>
            </Box>
        </Box>
    </motion.div>
);

export const LogEntry = ({ time, level, msg }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
    >
        <Box sx={{ display: 'flex', gap: 1.5, py: 1.5, borderBottom: '1px solid #f5f5f5', fontFamily: '"SF Mono", Menlo, monospace', fontSize: '0.7rem' }}>
            <span style={{ color: '#aaa', minWidth: 65 }}>{time || new Date().toLocaleTimeString()}</span>
            <span style={{
                color: level === 'INFO' ? '#10b981' : level === 'WARN' ? '#f59e0b' : '#ef4444',
                fontWeight: 700,
                minWidth: 36,
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: level === 'INFO' ? '#ecfdf5' : level === 'WARN' ? '#fffbeb' : '#fef2f2'
            }}>{level}</span>
            <span style={{ color: '#444', wordBreak: 'break-word' }}>{msg}</span>
        </Box>
    </motion.div>
);
