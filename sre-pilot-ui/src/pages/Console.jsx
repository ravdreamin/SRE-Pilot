import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, IconButton, Stack, Chip, Tabs, Tab } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';

// Icons
import SendIcon from '@mui/icons-material/Send';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import TerminalIcon from '@mui/icons-material/Terminal';

// Components
import { AegisLogo } from "../components/common/AegisLogo";
import { CommandBlock } from "../components/console/CommandBlock";
import { MetricCard, LogEntry } from "../components/console/DashboardWidgets";
import { ConsoleGridBackground } from "../components/console/ConsoleEffects";

const API_URL = 'http://localhost:8080';

const Console = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sidebarTab, setSidebarTab] = useState(0);

  // Metrics (with fallback mock data)
  const [metrics, setMetrics] = useState({ cpu: 24.5, memory: 48.2, disk: 64.0 });
  const [chartData, setChartData] = useState([]);

  // Logs
  const [activityLogs, setActivityLogs] = useState([]);
  const [watchtowerLogs, setWatchtowerLogs] = useState([]);

  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([
    { id: 1, role: 'agent', content: `**Welcome to Aegis Console**\n\nConnecting to backend...` }
  ]);
  const scrollRef = useRef(null);

  const addLog = (setLogs, level, msg) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), level, msg }, ...prev.slice(0, 49)]);
  };

  // Connection check
  useEffect(() => {
    axios.get(`${API_URL}/health`, { timeout: 3000 })
      .then(() => {
        setConnected(true);
        setMessages([{ id: 1, role: 'agent', content: `**System Ready**\n\nConnected to local daemon. Waiting for input.` }]);
        addLog(setActivityLogs, 'INFO', 'Connected to Aegis CLI');
      })
      .catch(() => {
        setConnected(false);
        setMessages([{ id: 1, role: 'agent', content: `**Demo Mode Active**\n\nCannot reach local daemon at ${API_URL}. Using simulated data environment.`, error: false }]);
        addLog(setActivityLogs, 'WARN', 'Running in demo mode');
      });
  }, []);

  // Metrics fetching (with fallback)
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/metrics`, { timeout: 2000 });
        const data = res.data;

        // Parse Prometheus response format: "label => VALUE @[timestamp]"
        const parsePrometheusValue = (str) => {
          if (!str) return null;
          // Match the number after "=>" like "=> 6.770548582702207 @"
          const match = str.match(/=>\s*([\d.]+)/);
          if (match) {
            return parseFloat(match[1]);
          }
          return null;
        };

        let cpu = parsePrometheusValue(data.cpu);
        let memory = parsePrometheusValue(data.memory);
        let disk = parsePrometheusValue(data.disk);

        // CPU from Prometheus is often very low (< 1%) for idle systems
        // Scale it up a bit for visual representation or show real value
        if (cpu !== null && cpu < 1) {
          cpu = cpu * 100; // Convert to percentage if it's a ratio
        }

        const finalCpu = cpu !== null ? cpu.toFixed(1) : (20 + Math.random() * 15).toFixed(1);
        const finalMem = memory !== null ? memory.toFixed(1) : (40 + Math.random() * 20).toFixed(1);
        const finalDisk = disk !== null ? disk.toFixed(1) : '45.0';

        setMetrics({ cpu: finalCpu, memory: finalMem, disk: finalDisk });
        addLog(setWatchtowerLogs, 'INFO', `Metrics: CPU ${finalCpu}%, Mem ${finalMem}%`);
      } catch (err) {
        // Use mock data with slight variation
        setMetrics(prev => ({
          cpu: (20 + Math.random() * 15).toFixed(1),
          memory: (40 + Math.random() * 20).toFixed(1),
          disk: '45.0'
        }));
        addLog(setWatchtowerLogs, 'WARN', 'Using simulated metrics');
      }

      // Update chart with current metrics
      setChartData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: parseFloat(metrics.cpu) || 25,
          memory: parseFloat(metrics.memory) || 50
        };
        return [...prev.slice(-29), newPoint];
      });
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000); // Fetch every 3 seconds
    return () => clearInterval(interval);
  }, [metrics.cpu, metrics.memory]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isTyping) return;
    const userMessage = text.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);
    addLog(setActivityLogs, 'INFO', `Query: ${userMessage.substring(0, 30)}...`);

    try {
      if (connected) {
        const response = await axios.post(`${API_URL}/api/chat`, {
          UserPrompt: userMessage,
          Context: 'Web Console',
          History: history
        }, { timeout: 30000 });

        const { action, payload, confidence } = response.data;
        let formattedResponse = payload;
        if (action === 'QUERY') {
          formattedResponse = `**Executing Query**\n\n\`\`\`promql\n${payload}\n\`\`\``;
        }

        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', content: formattedResponse }]);
        setHistory(prev => [...prev, `User: ${userMessage}`, `Aegis: ${payload}`]);
        addLog(setActivityLogs, 'INFO', `${action} (${(confidence * 100).toFixed(0)}%)`);
      } else {
        // Demo mode response
        setTimeout(() => {
          const demoResponses = {
            status: `### System Status\n\n| Metric | Value | Status |\n|--------|-------|--------|\n| CPU | ${metrics.cpu}% | ✅ OK |\n| Memory | ${metrics.memory}% | ✅ OK |\n| Disk | ${metrics.disk}% | ✅ OK |`,
            pod: `### Kubernetes Pods\n\n| Pod | Status |\n|-----|--------|\n| aegis-core | ✅ Running |\n| aegis-worker | ✅ Running |`,
            default: `I processed your request: "${userMessage}"\n\nNo issues found. All systems operational.`
          };

          const q = userMessage.toLowerCase();
          let response = demoResponses.default;
          if (q.includes('status') || q.includes('health')) response = demoResponses.status;
          else if (q.includes('pod')) response = demoResponses.pod;

          setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', content: response }]);
          addLog(setActivityLogs, 'INFO', 'Demo response generated');
        }, 800);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', content: `**Error**\n\n${error.message}`, error: true }]);
      addLog(setActivityLogs, 'ERR', 'Request failed');
    } finally {
      setIsTyping(false);
    }
  };

  const QUICK_ACTIONS = ["System Status", "Check Pods", "Analyze Logs"];

  return (
    <Box sx={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, bgcolor: '#f8f9fb', display: 'flex', overflow: 'hidden' }}>

      {/* CHAT AREA */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff', borderRight: '1px solid #eaeaea', position: 'relative' }}>
        <ConsoleGridBackground />

        {/* Header */}
        <Box sx={{
          px: 4, py: 1.5,
          borderBottom: '1px solid #eaeaea',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <TerminalIcon sx={{ color: '#087EA4', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 600, color: '#111', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
              Terminal Session
            </Typography>
            <Chip
              label={connected ? "ONLINE" : "OFFLINE"}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 700,
                bgcolor: connected ? '#dcfce7' : '#fee2e2',
                color: connected ? '#166534' : '#991b1b',
                borderRadius: '4px'
              }}
            />
          </Stack>
          <Typography sx={{ fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>
            v1.0.4 stable
          </Typography>
        </Box>

        {/* Input Area (Moved to Top or High importance? No, Terminal style usually has input at bottom, but let's make it distinctive) */}

        {/* Messages */}
        <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', px: 4, py: 2, position: 'relative', zIndex: 1 }}>
          <AnimatePresence>
            {messages.map(msg => <CommandBlock key={msg.id} role={msg.role} content={msg.content} error={msg.error} />)}
          </AnimatePresence>

          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 2, ml: 1, opacity: 0.6 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#087EA4', animation: 'pulse 1s infinite' }} />
              <Typography sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#087EA4' }}>Processing...</Typography>
            </Box>
          )}
        </Box>

        {/* Command Input Area */}
        <Box sx={{ p: 0, borderTop: '1px solid #eaeaea', bgcolor: '#fff', zIndex: 10 }}>
          {/* Toolbar */}
          <Box sx={{ px: 4, py: 1, borderBottom: '1px solid #f5f5f5', display: 'flex', gap: 1 }}>
            {QUICK_ACTIONS.map((action) => (
              <Chip
                key={action}
                label={action}
                onClick={() => handleSend(action)}
                disabled={isTyping}
                size="small"
                variant="outlined"
                sx={{
                  borderRadius: '4px',
                  borderColor: '#e5e5e5',
                  color: '#666',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5', borderColor: '#d1d1d1', color: '#111' },
                }}
              />
            ))}
          </Box>

          <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: '#087EA4', fontWeight: 700, fontFamily: 'monospace', userSelect: 'none' }}>❯</Typography>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Enter command or query..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '0.95rem',
                  fontFamily: '"SF Mono", monospace',
                  fontWeight: 500,
                  color: '#1D1D1F'
                }
              }}
            />
            <IconButton
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              size="small"
              sx={{
                color: input.trim() ? '#087EA4' : '#ccc',
                bgcolor: input.trim() ? 'rgba(8,126,164,0.1)' : 'transparent',
                '&:hover': { bgcolor: input.trim() ? 'rgba(8,126,164,0.2)' : 'transparent' }
              }}
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* RIGHT SIDEBAR */}
      <Box sx={{ width: 380, display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', overflow: 'hidden', bgcolor: '#fafafa' }}>

        {/* Metrics Cards */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #eaeaea' }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Metrics
            </Typography>
            <Stack spacing={2}>
              <MetricCard icon={SpeedIcon} label="CPU Usage" value={metrics.cpu} unit="%" color="#3b82f6" />
              <MetricCard icon={MemoryIcon} label="Memory" value={metrics.memory} unit="%" color="#8b5cf6" />
              <MetricCard icon={StorageIcon} label="Disk" value={metrics.disk} unit="%" color="#f59e0b" />
            </Stack>
          </Box>
        </motion.div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #eaeaea', height: 200 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Performance Graph
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="url(#cpuGrad)" strokeWidth={2} name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fill="url(#memGrad)" strokeWidth={2} name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </motion.div>

        {/* Tabs */}
        <Tabs value={sidebarTab} onChange={(e, v) => setSidebarTab(v)}
          sx={{
            borderBottom: '1px solid #eaeaea', minHeight: 40, bgcolor: '#fff',
            '& .MuiTab-root': { minHeight: 40, fontSize: '0.75rem', fontWeight: 600, textTransform: 'none' },
            '& .Mui-selected': { color: '#087EA4' },
            '& .MuiTabs-indicator': { backgroundColor: '#087EA4' }
          }}>
          <Tab label="Watchtower" />
          <Tab label="Activity" />
        </Tabs>

        {/* Logs */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#fff' }}>
          <AnimatePresence>
            {(sidebarTab === 0 ? watchtowerLogs : activityLogs).length === 0 ? (
              <Typography sx={{ color: '#999', fontSize: '0.75rem', textAlign: 'center', mt: 4 }}>
                {sidebarTab === 0 ? 'Waiting for metrics...' : 'No activity yet'}
              </Typography>
            ) : (
              (sidebarTab === 0 ? watchtowerLogs : activityLogs).map((log, i) => <LogEntry key={i} {...log} />)
            )}
          </AnimatePresence>
        </Box>
      </Box>

    </Box>
  );
};

export default Console;
