import React, { useState } from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { CollapsibleSection, LearnCallout, CodeBlock, SectionHeading, DocsFooter } from "../components/docs/DocsComponents";

// --- Navigation Data (React.dev style) ---
const sidebarSections = [
  {
    id: "get-started",
    title: "GET STARTED",
    items: [
      { id: "quick-start", label: "Quick Start" },
      { id: "installation", label: "Installation" },
      { id: "thinking-in-aegis", label: "Thinking in Aegis" }
    ]
  },
  {
    id: "learn-aegis",
    title: "LEARN AEGIS",
    items: [
      { id: "architecture", label: "System Architecture" },
      { id: "watchtower", label: "Watchtower (eBPF)" },
      { id: "neural-engine", label: "Neural Engine" },
      { id: "autonomy", label: "Autonomous Actions" }
    ]
  },
  {
    id: "api-reference",
    title: "API REFERENCE",
    items: [
      { id: "cli", label: "CLI Commands" },
      { id: "go-sdk", label: "Go SDK" },
      { id: "rest-api", label: "REST API" }
    ]
  }
];

const Documentation = () => {
  const [activeId, setActiveId] = useState("quick-start");
  const [openSections, setOpenSections] = useState({ "get-started": true, "learn-aegis": true, "api-reference": false });

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pt: { xs: 8, md: 10 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", gap: 8 }}>

          {/* LEFT SIDEBAR (React.dev style) */}
          <Box sx={{ width: 280, flexShrink: 0, display: { xs: "none", md: "block" } }}>
            <Box sx={{ position: "sticky", top: 100, maxHeight: "calc(100vh - 100px)", overflowY: "auto", pr: 2 }}>
              {sidebarSections.map((section) => (
                <CollapsibleSection
                  key={section.id}
                  section={section}
                  activeId={activeId}
                  onSelect={scrollTo}
                  isOpen={openSections[section.id]}
                  onToggle={() => toggleSection(section.id)}
                />
              ))}
            </Box>
          </Box>

          {/* MAIN CONTENT */}
          <Box sx={{ flex: 1, maxWidth: 760, pb: 16 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

              {/* Breadcrumb */}
              <Typography variant="caption" fontWeight={700} sx={{ color: "#087EA4", letterSpacing: "0.1em", mb: 2, display: "block" }}>
                GET STARTED
              </Typography>

              {/* Quick Start */}
              <SectionHeading id="quick-start" level="h1">Quick Start</SectionHeading>
              <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.7, color: "#23272F", mb: 4 }}>
                Welcome to the Aegis documentation! This page will give you an introduction to 80% of the Aegis concepts that you will use on a daily basis.
              </Typography>

              <LearnCallout>
                <li>How to install and configure Aegis</li>
                <li>How to create and deploy autonomous agents</li>
                <li>How to respond to incidents automatically</li>
                <li>How to integrate with Prometheus and Kubernetes</li>
                <li>How to enable safe autonomous remediation</li>
              </LearnCallout>

              <SectionHeading id="installation" level="h2">Installation</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Aegis runs as a sidecar to your infrastructure. You can install it using our CLI or deploy it directly in Kubernetes.
              </Typography>

              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 4, mb: 2, color: "#23272F" }}>
                Using Homebrew
              </Typography>
              <CodeBlock>brew install sre-pilot/tap/aegis</CodeBlock>

              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 4, mb: 2, color: "#23272F" }}>
                Using curl
              </Typography>
              <CodeBlock>curl -sL https://get.aegis.dev | bash</CodeBlock>

              <Divider sx={{ my: 6 }} />

              <SectionHeading id="architecture" level="h2">System Architecture</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Aegis uses a <b>closed-loop architecture</b> inspired by the OODA loop (Observe, Orient, Decide, Act). Unlike traditional monitoring that stops at "Observe," Aegis completes the cycle.
              </Typography>

              <Box sx={{ bgcolor: "#F6F9FC", borderRadius: "8px", p: 3, my: 4 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>The Aegis Loop</Typography>
                <Box component="ol" sx={{ pl: 2.5, m: 0, "& li": { mb: 2, color: "#23272F", lineHeight: 1.6 } }}>
                  <li><b>Observe:</b> Watchtower (eBPF) captures kernel-level signals and Prometheus metrics</li>
                  <li><b>Orient:</b> Neural Engine processes telemetry and detects anomalies</li>
                  <li><b>Decide:</b> LLM reasons about root cause and generates safe remediation plans</li>
                  <li><b>Act:</b> Autonomous agents execute verified fixes in sandboxed environments</li>
                </Box>
              </Box>

              <SectionHeading id="watchtower" level="h3">Watchtower (eBPF)</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Watchtower is the "eyes" of Aegis. It attaches to your kernel using <b>Extended Berkeley Packet Filter (eBPF)</b> to observe syscalls, network traffic, and resource usage with <code style={{ bgcolor: "#F6F9FC", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>&lt;1% overhead</code>.
              </Typography>

              <Divider sx={{ my: 6 }} />

              <SectionHeading id="autonomy" level="h2">Autonomous Actions</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Aegis can be configured to run in <b>supervised</b> or <b>autonomous</b> mode. In autonomous mode, Aegis will execute remediation actions without human approval—but only for whitelisted operations.
              </Typography>

              <Box sx={{ bgcolor: "#FFF4E5", border: "1px solid #FFE0B2", borderRadius: "8px", p: 3, my: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#E65100", mb: 1 }}>⚠️ Production Warning</Typography>
                <Typography variant="body2" sx={{ color: "#5D4037" }}>
                  Do not enable full autonomous mode in production without defining a <code style={{ bgcolor: "rgba(0,0,0,0.05)", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>safelist.yaml</code> configuration.
                </Typography>
              </Box>

              <Divider sx={{ my: 6 }} />

              {/* CLI Commands Section */}
              <SectionHeading id="cli" level="h2">CLI Commands</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                The Aegis CLI provides a powerful interface for managing your autonomous infrastructure agents.
              </Typography>

              <SectionHeading id="cli-watch" level="h3">aegis watch</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Attach Aegis to a running process or service for real-time monitoring.
              </Typography>
              <CodeBlock>aegis watch --pid 1234</CodeBlock>
              <CodeBlock>aegis watch --service nginx</CodeBlock>
              <Typography variant="body2" sx={{ color: "#5E687", mb: 3 }}>
                Options: <code style={{ bgcolor: "#F6F9FC", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>--pid</code> (process ID), <code style={{ bgcolor: "#F6F9FC", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>--service</code> (service name), <code style={{ bgcolor: "#F6F9FC", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>--namespace</code> (Kubernetes namespace)
              </Typography>

              <SectionHeading id="cli-init" level="h3">aegis init</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Initialize a new Aegis configuration in your project.
              </Typography>
              <CodeBlock>aegis init</CodeBlock>
              <CodeBlock>aegis init --template kubernetes</CodeBlock>
              <Typography variant="body2" sx={{ color: "#5E687", mb: 3 }}>
                Creates an <code style={{ bgcolor: "#F6F9FC", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>aegis.yaml</code> configuration file with sensible defaults.
              </Typography>

              <SectionHeading id="cli-deploy" level="h3">aegis deploy</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Deploy Aegis agents to your infrastructure.
              </Typography>
              <CodeBlock>aegis deploy --target kubernetes</CodeBlock>
              <CodeBlock>aegis deploy --config ./custom-aegis.yaml</CodeBlock>

              <SectionHeading id="cli-status" level="h3">aegis status</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Check the health and status of all Aegis agents.
              </Typography>
              <CodeBlock>aegis status</CodeBlock>
              <CodeBlock>aegis status --json</CodeBlock>

              <SectionHeading id="cli-logs" level="h3">aegis logs</SectionHeading>
              <Typography variant="body1" paragraph sx={{ color: "#23272F", lineHeight: 1.7 }}>
                Stream logs from Aegis agents.
              </Typography>
              <CodeBlock>aegis logs --follow</CodeBlock>
              <CodeBlock>aegis logs --agent aegis-primary-001 --tail 100</CodeBlock>

            </motion.div>
          </Box>

          {/* RIGHT SIDEBAR - On This Page */}
          <Box sx={{ width: 200, flexShrink: 0, display: { xs: "none", lg: "block" } }}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Typography variant="caption" fontWeight={700} sx={{ color: "#23272F", mb: 2, display: "block", fontSize: "0.75rem" }}>
                ON THIS PAGE
              </Typography>
              {[
                { id: "quick-start", label: "Quick Start" },
                { id: "installation", label: "Installation" },
                { id: "architecture", label: "Architecture" },
                { id: "watchtower", label: "Watchtower" },
                { id: "autonomy", label: "Autonomous Actions" },
                { id: "cli", label: "CLI Commands" }
              ].map((item) => (
                <Box
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  sx={{
                    py: 0.5,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    color: activeId === item.id ? "#087EA4" : "#5E687",
                    fontWeight: activeId === item.id ? 600 : 400,
                    transition: "color 0.2s",
                    "&:hover": { color: "#087EA4" }
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          </Box>

        </Box>
      </Container>

      <DocsFooter />
    </Box>
  );
};
export default Documentation;
