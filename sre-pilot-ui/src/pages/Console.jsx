// src/pages/Console.jsx
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, IconButton, Avatar, Stack, Chip, Tabs, Tab } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';

// Icons
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const API_URL = 'http://localhost:8080';

// --- Animated Aegis Logo ---
const AegisLogo = ({ size = 32, animated = true }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    style={{ width: size, height: size, position: 'relative' }}
  >
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="aegisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#087EA4" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Ring */}
      <motion.circle
        cx="50" cy="50" r="45"
        fill="none"
        stroke="url(#aegisGradient)"
        strokeWidth="2"
        strokeDasharray="283"
        initial={{ strokeDashoffset: 283 }}
        animate={{ strokeDashoffset: animated ? [283, 0] : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Inner Shield */}
      <motion.path
        d="M50 20 L75 35 L75 55 Q75 75 50 85 Q25 75 25 55 L25 35 Z"
        fill="url(#aegisGradient)"
        filter="url(#glow)"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ transformOrigin: 'center' }}
      />

      {/* Center A */}
      <motion.text
        x="50" y="58"
        textAnchor="middle"
        fill="#fff"
        fontSize="28"
        fontWeight="700"
        fontFamily="system-ui"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        A
      </motion.text>

      {/* Pulse Ring */}
      {animated && (
        <motion.circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="#087EA4"
          strokeWidth="1"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: 'center' }}
        />
      )}
    </svg>
  </motion.div>
);

// --- Message Component ---
const MessageBubble = ({ role, content, error }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 20 }}
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
            border: error ? '1px solid #fecaca' : isUser ? 'none' : '1px solid #eee',
            boxShadow: isUser ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
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
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

// --- Metric Card ---
const MetricCard = ({ icon: Icon, label, value, unit, color, loading }) => (
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

// --- Log Entry ---
const LogEntry = ({ time, level, msg }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2 }}
  >
    <Box sx={{ display: 'flex', gap: 1.5, py: 1.5, borderBottom: '1px solid #f5f5f5', fontFamily: '"SF Mono", Menlo, monospace', fontSize: '0.7rem' }}>
      <span style={{ color: '#aaa', minWidth: 65 }}>{time}</span>
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

// --- Main Component ---
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
        setMessages([{ id: 1, role: 'agent', content: `**Aegis Console** is ready.\n\nI'm connected to the CLI backend. Ask me anything about your infrastructure, or try:\n\n- "Show system status"\n- "List pods"\n- "Run diagnostics"` }]);
        addLog(setActivityLogs, 'INFO', 'Connected to Aegis CLI');
      })
      .catch(() => {
        setConnected(false);
        setMessages([{ id: 1, role: 'agent', content: `**Aegis Console** (Demo Mode)\n\nBackend not available. Using simulated data.\n\nTo connect:\n\`\`\`bash\ncd cli && go run ./cmd/aegis --watch\n\`\`\``, error: false }]);
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

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMessage = input.trim();
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

  return (
    <Box sx={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, bgcolor: '#f8f9fb', display: 'flex', overflow: 'hidden' }}>

      {/* CHAT AREA */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff', borderRight: '1px solid #eaeaea' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ px: 4, py: 2.5, borderBottom: '1px solid #eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AegisLogo size={36} />
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#111', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Aegis Console</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>AI-Powered SRE Assistant</Typography>
              </Box>
            </Stack>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Chip
                label={connected ? 'Connected' : 'Demo Mode'}
                size="small"
                sx={{
                  bgcolor: connected ? '#dcfce7' : '#fef3c7',
                  color: connected ? '#166534' : '#92400e',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 26,
                  border: connected ? '1px solid #bbf7d0' : '1px solid #fde68a'
                }}
              />
            </motion.div>
          </Box>
        </motion.div>

        {/* Messages */}
        <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', px: 4, py: 4 }}>
          <AnimatePresence>
            {messages.map(msg => <MessageBubble key={msg.id} role={msg.role} content={msg.content} error={msg.error} />)}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: 12, marginBottom: 16 }}
            >
              <AegisLogo size={32} animated={false} />
              <Box sx={{ bgcolor: '#f8f9fa', px: 3, py: 2, borderRadius: '16px', borderTopLeftRadius: '4px', display: 'flex', gap: 1, border: '1px solid #eee' }}>
                {[0, 0.15, 0.3].map((d, i) => (
                  <motion.span key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                    style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#087EA4' }} />
                ))}
              </Box>
            </motion.div>
          )}
        </Box>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Box sx={{ px: 4, py: 3, borderTop: '1px solid #eaeaea', bgcolor: '#fafafa' }}>
            <Box sx={{
              display: 'flex',
              gap: 2,
              bgcolor: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '14px',
              px: 3,
              py: 1.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
              '&:focus-within': { borderColor: '#087EA4', boxShadow: '0 0 0 3px rgba(8,126,164,0.1)' }
            }}>
              <TextField
                fullWidth variant="standard" placeholder="Ask Aegis anything..."
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
                InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem' } }}
              />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton onClick={handleSend} disabled={!input.trim() || isTyping}
                  sx={{
                    bgcolor: input.trim() ? '#087EA4' : '#f5f5f5',
                    color: input.trim() ? '#fff' : '#aaa',
                    width: 40,
                    height: 40,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: input.trim() ? '#066a8a' : '#f5f5f5' }
                  }}>
                  <SendIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
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
