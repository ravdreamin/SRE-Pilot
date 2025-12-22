import React from "react";
import { Box, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PersonIcon from '@mui/icons-material/Person';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AegisLogo } from "../common/AegisLogo";

export const MessageBubble = ({ role, content, error }) => {
    const isUser = role === 'user';
    const [isHovered, setIsHovered] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 20 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Box sx={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: 1.5, maxWidth: '90%' }}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Avatar sx={{
                        width: 32, height: 32,
                        bgcolor: error ? '#fee2e2' : isUser ? '#111' : 'transparent',
                        color: error ? '#dc2626' : isUser ? '#fff' : '#111',
                        border: isUser ? 'none' : 'none',
                        flexShrink: 0
                    }}>
                        {error ? <ErrorOutlineIcon sx={{ fontSize: 16 }} /> :
                            isUser ? <PersonIcon sx={{ fontSize: 16 }} /> : <AegisLogo size={32} animated={false} />}
                    </Avatar>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    style={{ position: 'relative' }}
                >
                    <Box sx={{
                        bgcolor: error ? '#fef2f2' : isUser ? '#111' : '#f8f9fa',
                        color: error ? '#991b1b' : isUser ? '#fff' : '#111',
                        px: 2.5, py: 2,
                        borderRadius: '16px',
                        borderTopLeftRadius: isUser ? '16px' : '4px',
                        borderTopRightRadius: isUser ? '4px' : '16px',
                        fontSize: '0.9rem',
                        lineHeight: 1.7,
                        border: error ? '1px solid #fecaca' : isUser ? 'none' : '1px solid #dae1e7',
                        boxShadow: isUser ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
                        position: 'relative',
                        '& p': { m: 0, mb: 1 },
                        '& p:last-child': { mb: 0 },
                        '& h3': { fontSize: '1rem', fontWeight: 600, mt: 0, mb: 1 },
                        '& strong': { fontWeight: 600 },
                        '& code': { fontFamily: '"SF Mono", Menlo, monospace', fontSize: '0.85em', bgcolor: isUser ? 'rgba(255,255,255,0.15)' : '#e9ecef', px: 0.6, py: 0.2, borderRadius: '4px' },
                        '& table': { width: '100%', borderCollapse: 'collapse', my: 2, fontSize: '0.85rem', border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' },
                        '& th': { bgcolor: '#f8f9fa', py: 1.5, px: 2, textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #e5e5e5', color: '#555' },
                        '& td': { py: 1.5, px: 2, borderBottom: '1px solid #f0f0f0' }
                    }}>
                        {isUser ? content : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeString = String(children).replace(/\n$/, '');
                                        if (!inline && (match || codeString.includes('\n'))) {
                                            return (
                                                <SyntaxHighlighter style={oneDark} language={match ? match[1] : 'bash'} PreTag="div"
                                                    customStyle={{ margin: '12px 0', borderRadius: '8px', fontSize: '0.85rem', padding: '16px' }} {...props}>
                                                    {codeString}
                                                </SyntaxHighlighter>
                                            );
                                        }
                                        return <code {...props}>{children}</code>;
                                    }
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        )}

                        {/* Copy Button (only on hover and agent messages) */}
                        {!isUser && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(255,255,255,0.8)'
                                }}
                                onClick={handleCopy}
                            >
                                <Box sx={{ fontSize: '0.7rem', color: '#666', opacity: 0.8 }}>
                                    {copied ? 'Copied!' : 'Copy'}
                                </Box>
                            </motion.div>
                        )}
                    </Box>
                </motion.div>
            </Box>
        </motion.div>
    );
};
