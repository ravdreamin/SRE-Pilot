import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, useTheme, Button, Stack, Fade } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplayIcon from '@mui/icons-material/Replay';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DnsIcon from '@mui/icons-material/Dns';
import SpeedIcon from '@mui/icons-material/Speed';
import HubIcon from '@mui/icons-material/Hub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Mock Data
const trafficData = [
    { time: 'Sun', requests: 4000, latency: 45 },
    { time: 'Mon', requests: 3000, latency: 35 },
    { time: 'Tue', requests: 5500, latency: 120 },
    { time: 'Wed', requests: 4800, latency: 90 },
    { time: 'Thu', requests: 3500, latency: 180 },
    { time: 'Fri', requests: 6000, latency: 90 },
    { time: 'Sat', requests: 4500, latency: 60 },
];

const errorDistribution = [
    { name: '4xx Errors', value: 45, color: '#6366F1' }, // Indigo
    { name: '5xx Errors', value: 15, color: '#EC4899' }, // Pink
    { name: 'Success', value: 940, color: '#10B981' }, // Emerald
];

const analysisHistory = [
    { id: 1, service: 'auth-service', status: 'Healthy', timestamp: '14:30', impact: 'Low', message: 'All systems operational' },
    { id: 2, service: 'payment-gateway', status: 'Warning', timestamp: '13:15', impact: 'Medium', message: 'Increased latency detected' },
    { id: 3, service: 'notification-worker', status: 'Critical', timestamp: '11:45', impact: 'High', message: 'Pod crash loop backoff' },
    { id: 4, service: 'database-shard-01', status: 'Healthy', timestamp: '10:20', impact: 'None', message: 'Backup completed successfully' },
];

const KPICard = ({ title, value, subtext, icon: Icon, trend }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>{value}</Typography>
                {subtext && (
                    <Typography variant="caption" sx={{ color: trend === 'up' ? '#10B981' : '#6B7280', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        {trend === 'up' && <TrendingUpIcon fontSize="inherit" />} {subtext}
                    </Typography>
                )}
            </Box>
            <Box sx={{
                p: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                color: '#4B5563',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8)'
            }}>
                <Icon />
            </Box>
        </Paper>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={{
                bgcolor: '#1F2937',
                color: '#fff',
                p: 1.5,
                borderRadius: 2,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
                <Typography variant="caption" sx={{ opacity: 0.7, mb: 0.5, display: 'block' }}>{label}</Typography>
                {payload.map((entry, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: entry.color }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {entry.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    }
    return null;
};

const Dashboard = () => {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', pb: 8 }}>
            {/* Header Banner */}
            <Box sx={{
                background: 'linear-gradient(120deg, #4F46E5 0%, #7C3AED 100%)', // Indigo to Violet
                pt: 12,
                pb: 12,
                px: 4,
                borderRadius: '0 0 40px 40px',
                color: '#fff',
                position: 'relative',
                mb: 10
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mb: 1 }}>
                                System Overview
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500 }}>
                                Real-time monitoring and analysis dashboard
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<CalendarTodayIcon />}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 3,
                                boxShadow: 'none',
                                textTransform: 'none',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                            }}
                        >
                            Last 7 Days
                        </Button>
                    </Box>

                    {/* Floating KPI Cards */}
                    <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: -60, px: 4 }}>
                        <Container maxWidth="xl">
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <KPICard title="Total Traffic" value="2.4M" subtext="+14% this week" trend="up" icon={DnsIcon} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <KPICard title="Avg. Latency" value="124ms" subtext="-5ms avg" trend="up" icon={SpeedIcon} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <KPICard title="Error Rate" value="0.4%" subtext="Stable" icon={WarningIcon} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <KPICard title="Health Score" value="98/100" subtext="Optimal" trend="up" icon={HubIcon} />
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    {/* Main Chart */}
                    <Grid item xs={12} lg={8}>
                        <Paper sx={{ p: 4, borderRadius: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>Traffic Trends</Typography>
                                <IconButton size="small"><MoreHorizIcon /></IconButton>
                            </Box>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={trafficData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="requests" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Side Chart */}
                    <Grid item xs={12} lg={4}>
                        <Paper sx={{ p: 4, borderRadius: 5, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>Response Status</Typography>
                            </Box>
                            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={errorDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            cornerRadius={8}
                                        >
                                            {errorDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Table */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 0, borderRadius: 5, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <Box sx={{ p: 4, pb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>Recent Activity</Typography>
                            </Box>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                                        <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: '0.75rem', py: 2 }}>SERVICE</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: '0.75rem', py: 2 }}>TIMESTAMP</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: '0.75rem', py: 2 }}>STATUS</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: '0.75rem', py: 2 }}>IMPACT</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: '0.75rem', py: 2 }}>FINDINGS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {analysisHistory.map((row) => (
                                        <TableRow key={row.id} hover sx={{ '& td': { borderColor: '#F3F4F6' } }}>
                                            <TableCell sx={{ fontWeight: 600, color: '#111827' }}>{row.service}</TableCell>
                                            <TableCell sx={{ color: '#6B7280' }}>{row.timestamp}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 600,
                                                        borderRadius: 1.5,
                                                        bgcolor: row.status === 'Healthy' ? '#DEF7EC' : row.status === 'Warning' ? '#FEECDC' : '#FDE8E8',
                                                        color: row.status === 'Healthy' ? '#03543F' : row.status === 'Warning' ? '#92400E' : '#9B1C1C'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: '#6B7280', fontWeight: 500 }}>{row.impact}</TableCell>
                                            <TableCell sx={{ color: '#4B5563' }}>{row.message}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;
