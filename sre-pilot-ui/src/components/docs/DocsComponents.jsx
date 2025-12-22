import React from "react";
import { Box, Typography, Collapse, Link as MuiLink, Container } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const CollapsibleSection = ({ section, activeId, onSelect, isOpen, onToggle }) => (
    <Box sx={{ mb: 3 }}>
        <Box
            onClick={onToggle}
            sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                mb: 1.5,
                "&:hover .expand-icon": { opacity: 1 }
            }}
        >
            <Typography
                variant="caption"
                fontWeight={700}
                sx={{ letterSpacing: "0.08em", color: "#23272F", fontSize: "0.75rem", flex: 1 }}
            >
                {section.title}
            </Typography>
            <Box className="expand-icon" sx={{ opacity: 0.6, transition: "opacity 0.2s" }}>
                {isOpen ? <ExpandMoreIcon sx={{ fontSize: 16 }} /> : <ChevronRightIcon sx={{ fontSize: 16 }} />}
            </Box>
        </Box>
        <Collapse in={isOpen}>
            <Box>
                {section.items.map((item) => (
                    <Box
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        sx={{
                            py: 0.75,
                            px: 1,
                            borderLeft: activeId === item.id ? "2px solid #087EA4" : "2px solid transparent",
                            cursor: "pointer",
                            color: activeId === item.id ? "#087EA4" : "#23272F",
                            fontWeight: activeId === item.id ? 600 : 400,
                            fontSize: "0.9375rem",
                            transition: "all 0.1s",
                            "&:hover": { color: "#087EA4" }
                        }}
                    >
                        {item.label}
                    </Box>
                ))}
            </Box>
        </Collapse>
    </Box>
);

export const LearnCallout = ({ children }) => (
    <Box sx={{
        bgcolor: "#F6F9FC",
        borderRadius: "8px",
        p: 3,
        my: 4,
        borderLeft: "4px solid #087EA4"
    }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#23272F", mb: 2 }}>
            You will learn
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5, "& li": { mb: 1, color: "#23272F", fontSize: "0.9375rem", lineHeight: 1.6 } }}>
            {children}
        </Box>
    </Box>
);

export const CodeBlock = ({ children }) => (
    <Box sx={{
        bgcolor: "#23272F",
        borderRadius: "8px",
        p: 2.5,
        my: 3,
        overflow: "auto",
        fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
        fontSize: "0.875rem",
        lineHeight: 1.6
    }}>
        <Box component="code" sx={{ color: "#61DAFB" }}>
            {children}
        </Box>
    </Box>
);

export const SectionHeading = ({ children, id, level = "h2" }) => {
    const styles = {
        h1: { fontSize: "3rem", fontWeight: 800, mt: 0, mb: 3 },
        h2: { fontSize: "2rem", fontWeight: 700, mt: 8, mb: 3 },
        h3: { fontSize: "1.5rem", fontWeight: 600, mt: 6, mb: 2 }
    };

    return (
        <Typography
            id={id}
            variant={level}
            sx={{
                ...styles[level],
                color: "#23272F",
                letterSpacing: "-0.01em",
                scrollMarginTop: "100px"
            }}
        >
            {children}
        </Typography>
    );
};

export const DocsFooter = () => (
    <Box component="footer" sx={{ borderTop: "1px solid #EBECF0", mt: 12, pt: 8, pb: 6 }}>
        <Container maxWidth="xl">
            <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                <Box sx={{ maxWidth: 300 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#23272F" }}>Aegis</Typography>
                    <Typography variant="body2" sx={{ color: "#5E687", lineHeight: 1.6, mb: 3 }}>
                        Autonomous Site Reliability Engineering platform powered by eBPF and LLMs. Sleep better while Aegis watches your infrastructure.
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#99A1B3" }}>
                        © 2024 SRE-Pilot. Open Source MIT License.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: "#23272F", mb: 2, display: "block", letterSpacing: "0.05em" }}>
                        PLATFORM
                    </Typography>
                    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                        {["Watchtower (eBPF)", "Neural Engine", "Auto-Remediation", "Kubernetes Operator"].map((item) => (
                            <Box component="li" key={item} sx={{ mb: 1.5 }}>
                                <MuiLink href="#" underline="hover" sx={{ color: "#5E687", fontSize: "0.875rem", "&:hover": { color: "#087EA4" } }}>
                                    {item}
                                </MuiLink>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: "#23272F", mb: 2, display: "block", letterSpacing: "0.05em" }}>
                        INTEGRATION
                    </Typography>
                    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                        {["Prometheus", "Grafana", "Kubernetes", "CLI Reference"].map((item) => (
                            <Box component="li" key={item} sx={{ mb: 1.5 }}>
                                <MuiLink href="#" underline="hover" sx={{ color: "#5E687", fontSize: "0.875rem", "&:hover": { color: "#087EA4" } }}>
                                    {item}
                                </MuiLink>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: "#23272F", mb: 2, display: "block", letterSpacing: "0.05em" }}>
                        RESOURCES
                    </Typography>
                    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                        {["GitHub", "Quick Start", "API Docs", "Community"].map((item) => (
                            <Box component="li" key={item} sx={{ mb: 1.5 }}>
                                <MuiLink href="#" underline="hover" sx={{ color: "#5E687", fontSize: "0.875rem", "&:hover": { color: "#087EA4" } }}>
                                    {item}
                                </MuiLink>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Container>
    </Box>
);
