import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export const ConsoleGridBackground = () => (
    <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.4
    }}>
        {/* Tech Grid */}
        <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `
        linear-gradient(rgba(8, 126, 164, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(8, 126, 164, 0.03) 1px, transparent 1px)
      `,
            backgroundSize: '40px 40px',
        }} />

        {/* Scanline */}
        <motion.div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '20vh',
                background: 'linear-gradient(to bottom, transparent, rgba(8, 126, 164, 0.02), transparent)',
                pointerEvents: 'none'
            }}
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
    </Box>
);

export const TypingIndicator = () => (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', p: 1 }}>
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: '#087EA4',
                }}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                }}
            />
        ))}
        <Box sx={{ ml: 1, fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>
            Aegis is thinking...
        </Box>
    </Box>
);
