import React, { useState } from "react";
import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TerminalIcon from '@mui/icons-material/Terminal';

export const CommandBlock = ({ role, content, error }) => {
    const isUser = role === 'user';
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isUser) {
        return (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    my: 2,
                    pt: 2,
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <TerminalIcon sx={{ color: '#087EA4', fontSize: 20 }} />
                    <Typography sx={{
                        fontFamily: '"SF Mono", "Fira Code", monospace',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: '#1D1D1F'
                    }}>
                        {content}
                    </Typography>
                </Box>
            </motion.div>
        );
    }

    // Agent/System Output
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Box sx={{
                ml: 4,
                mb: 3,
                position: 'relative',
                borderLeft: error ? '2px solid #ef4444' : '2px solid #e5e5e5',
                pl: 2
            }}>
                {/* Output Controls (Optional collapse/copy for long outputs) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box
                        onClick={() => setIsExpanded(!isExpanded)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            userSelect: 'none',
                            opacity: 0.7,
                            '&:hover': { opacity: 1 }
                        }}
                    >
                        <Typography variant="caption" sx={{
                            fontWeight: 600,
                            color: error ? '#ef4444' : '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {error ? 'Execution Error' : 'Output Result'}
                        </Typography>
                    </Box>

                    {!error && (
                        <IconButton onClick={handleCopy} size="small" sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
                            {copied ? <CheckIcon sx={{ fontSize: 14, color: '#10b981' }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                        </IconButton>
                    )}
                </Box>

                <Collapse in={isExpanded}>
                    <Box sx={{
                        fontSize: '0.9rem',
                        color: '#333',
                        lineHeight: 1.6,
                        '& p': { mt: 0, mb: 1.5 },
                        '& pre': { m: 0, borderRadius: '8px', overflow: 'hidden' },
                        '& code': { fontFamily: '"SF Mono", monospace', fontSize: '0.85em', bgcolor: '#f1f3f5', px: 0.6, py: 0.1, borderRadius: '4px' }
                    }}>
                        {error ? (
                            <Box sx={{ fontFamily: 'monospace', color: '#b91c1c', bgcolor: '#fef2f2', p: 2, borderRadius: 2 }}>
                                {content}
                            </Box>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                customStyle={{ margin: '0.5em 0', borderRadius: '8px' }}
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        )}
                    </Box>
                </Collapse>
            </Box>
        </motion.div>
    );
};
