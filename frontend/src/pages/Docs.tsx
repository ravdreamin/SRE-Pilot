import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider, Link, Breadcrumbs, Container } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';

// --- Components ---

const TocItem = ({ label, targetId }: { label: string; targetId: string }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <ListItem disablePadding>
            <Link
                href={`#${targetId}`}
                onClick={handleClick}
                underline="none"
                sx={{
                    fontSize: '0.85rem',
                    color: '#888',
                    display: 'block',
                    py: 0.5,
                    borderLeft: '2px solid transparent',
                    pl: 2,
                    '&:hover': { color: '#e6522c', borderLeftColor: '#e6522c' },
                    transition: 'all 0.2s'
                }}
            >
                {label}
            </Link>
        </ListItem>
    );
};

const SidebarGroup = ({ title, items, expanded = false }: { title: string; items: { label: string; id: string; active?: boolean }[]; expanded?: boolean }) => (
    <Box sx={{ mb: 2 }}>
        <Typography
            sx={{
                color: '#ededed',
                fontSize: '1rem',
                fontWeight: 600,
                mb: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
            }}
        >
            {title}
        </Typography>
        {expanded && (
            <List dense sx={{ p: 0 }}>
                {items.map(item => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton
                            component="a"
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            sx={{
                                py: 0.5,
                                px: 2,
                                pl: 4,
                                bgcolor: item.active ? 'rgba(230, 82, 44, 0.15)' : 'transparent',
                                borderRight: item.active ? '3px solid #e6522c' : '3px solid transparent',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    color: item.active ? '#e6522c' : '#aaa',
                                    fontWeight: item.active ? 600 : 400
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        )}
    </Box>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{
        bgcolor: '#0d0d10',
        p: 2,
        borderRadius: 1,
        border: '1px solid #333',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        color: '#eee',
        overflowX: 'auto',
        my: 2
    }}>
        {children}
    </Box>
);

// --- Main Page ---

const Docs = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: '#1b1b1d', // Prometheus Dark Gray
            color: '#fff',
            fontFamily: '"Open Sans", sans-serif',
        }}>
            {/* Top Bar (Simulated) */}
            <Box sx={{
                height: '60px',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                px: 4,
                position: 'sticky',
                top: 0,
                bgcolor: '#1b1b1d',
                zIndex: 10
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#e6522c', mr: 4 }}>
                    SRE-Pilot
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{
                    bgcolor: '#28282b',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #444',
                    width: '200px'
                }}>
                    <SearchIcon sx={{ color: '#888', fontSize: '1.2rem', mr: 1 }} />
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Search</Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.75rem', ml: 'auto' }}>Ctrl+K</Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                {/* Left Sidebar - Navigation */}
                <Box className="no-scrollbar" sx={{
                    width: '300px',
                    position: 'sticky',
                    top: '60px',
                    height: 'calc(100vh - 60px)',
                    overflowY: 'auto',
                    borderRight: '1px solid #333',
                    py: 4,
                    display: { xs: 'none', md: 'block' }
                }}>
                    <SidebarGroup
                        title="Introduction"
                        expanded={true}
                        items={[
                            { label: 'Overview', id: 'overview', active: true },
                            { label: 'Installation', id: 'installation' }
                        ]}
                    />
                    <SidebarGroup
                        title="CLI Reference"
                        expanded={true}
                        items={[
                            { label: 'aegis --ask', id: 'cmd-ask' },
                            { label: 'aegis --watch', id: 'cmd-watch' },
                            { label: 'aegis --dry-run', id: 'cmd-dry-run' }
                        ]}
                    />
                    <SidebarGroup
                        title="Architecture"
                        expanded={true}
                        items={[
                            { label: 'Watchtower Engine', id: 'watchtower' },
                            { label: 'Billing & Quotas', id: 'billing' }
                        ]}
                    />
                </Box>

                {/* Main Content Area */}
                <Box sx={{ flexGrow: 1, p: { xs: 3, md: 8 }, maxWidth: '900px' }}>
                    <Typography id="overview" variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 700, mb: 4 }}>
                        Overview
                    </Typography>

                    <Typography variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 600, mb: 2 }}>What is SRE-Pilot?</Typography>
                    <Typography paragraph sx={{ color: '#ccc', lineHeight: 1.7, fontSize: '1.05rem', mb: 3 }}>
                        SRE-Pilot (powered by the <strong style={{ color: '#fff' }}>Aegis CLI</strong>) is an open-source observability assistant.
                        Unlike traditional dashboards, Aegis interacts directly with Metrics APIs to answer natural language questions and predict failures using calculus-based heuristics.
                    </Typography>
                    <Link href="#" sx={{ color: '#e6522c', textDecorationColor: 'rgba(230, 82, 44, 0.4)' }}>
                        Check out the theory behind the Watchtower engine &rarr;
                    </Link>

                    <Divider sx={{ my: 6, borderColor: '#333' }} />

                    <Typography id="installation" variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 600, mb: 3 }}>Installation</Typography>
                    <Typography paragraph sx={{ color: '#ccc' }}>
                        The CLI is built in Go. You can install it directly using the `go install` command:
                    </Typography>
                    <CodeBlock>
                        $ go install github.com/sre-pilot/cli/cmd/aegis@latest
                    </CodeBlock>
                    <Typography paragraph sx={{ color: '#ccc' }}>
                        Or build from source found in the `cli` folder:
                    </Typography>
                    <CodeBlock>
                        $ cd cli<br />
                        $ go build -o Aegis cmd/aegis/main.go
                    </CodeBlock>

                    <Divider sx={{ my: 6, borderColor: '#333' }} />

                    <Typography id="cmd-ask" variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 600, mb: 3 }}>Command: ask</Typography>
                    <Typography paragraph sx={{ color: '#ccc' }}>
                        The `ask` flag is the primary entry point for AI interactions. It takes a natural language string, analyzes it using Gemini 1.5, translates it into a Prometheus Query Language (PromQL) statement, and executes it.
                    </Typography>
                    <CodeBlock>
                        $ aegis --ask "What is the 99th percentile latency of the checkout service?"
                    </CodeBlock>
                    <Typography paragraph sx={{ color: '#ccc', fontStyle: 'italic', pl: 2, borderLeft: '3px solid #e6522c' }}>
                        Note: This command requires a valid entitlement in `data/subscription.json`. Free tier is limited to 10 queries/day.
                    </Typography>

                    <Box sx={{ height: '40px' }} />

                    <Typography id="cmd-watch" variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 600, mb: 3 }}>Command: watch</Typography>
                    <Typography paragraph sx={{ color: '#ccc' }}>
                        Starts the <strong>Watchtower Daemon</strong>. This process runs in the foreground and continuously analyzes metrics for anomalies.
                    </Typography>
                    <CodeBlock>
                        $ aegis --watch
                    </CodeBlock>
                    <List sx={{ color: '#ccc', pl: 2 }}>
                        <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
                            <ListItemText primary="Launches internal observability server on :8080" />
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
                            <ListItemText primary="Monitors `process_cpu_seconds_total`" />
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
                            <ListItemText primary="Triggers CRITICAL ALERT if metric slope > 0.5 (Saturation imminent)" />
                        </ListItem>
                    </List>

                    <Box sx={{ height: '40px' }} />

                    <Typography id="cmd-dry-run" variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 600, mb: 3 }}>Command: dry-run</Typography>
                    <Typography paragraph sx={{ color: '#ccc' }}>
                        Simulates the execution of a command without making actual network calls to the Monitoring backend. Useful for verifying AI query generation.
                    </Typography>
                    <CodeBlock>
                        $ aegis --ask "Show me error rates" --dry-run
                    </CodeBlock>
                </Box>

                {/* Right Sidebar - On this page */}
                <Box sx={{
                    width: '240px',
                    position: 'sticky',
                    top: '60px',
                    height: 'calc(100vh - 60px)',
                    p: 4,
                    display: { xs: 'none', lg: 'block' }
                }}>
                    <Typography sx={{
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#fff',
                        mb: 2,
                        letterSpacing: '1px'
                    }}>
                        On this page
                    </Typography>
                    <List dense disablePadding>
                        <TocItem label="Overview" targetId="overview" />
                        <TocItem label="Installation" targetId="installation" />
                        <TocItem label="aegis --ask" targetId="cmd-ask" />
                        <TocItem label="aegis --watch" targetId="cmd-watch" />
                        <TocItem label="aegis --dry-run" targetId="cmd-dry-run" />
                    </List>
                </Box>
            </Box>
        </Box>
    );
};

export default Docs;

