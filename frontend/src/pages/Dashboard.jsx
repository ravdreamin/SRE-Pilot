import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Activity, RefreshCw, Layers, Zap, Cpu, Database, Network, Clock } from 'lucide-react';

const MetricCard = ({ label, value, unit, icon: Icon, delay }) => (
    <div className={`group bg-card/40 border border-border rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.01] animate-in ${delay}`}>
        <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors font-bold">{label}</span>
            <Icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors opacity-40" />
        </div>
        <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-semibold tabular-nums tracking-tighter mono">
                {value}
            </span>
            {unit && <span className="text-sm font-light text-muted-foreground mono uppercase">{unit}</span>}
        </div>
        <div className="mt-4 h-1 w-full bg-muted/30 rounded-full overflow-hidden">
            <div
                className="h-full bg-primary/40 group-hover:bg-primary transition-all duration-1000"
                style={{ width: `${Math.min(parseFloat(value) || 0, 100)}%` }}
            />
        </div>
    </div>
);

export default function Dashboard() {
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState(null);
    const [lastSync, setLastSync] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const syncMetrics = async () => {
        setIsSyncing(true);
        try {
            const data = await api.getMetrics();
            setMetrics(data);
            setError(null);
            setLastSync(new Date());
        } catch (err) {
            setError("Connection Refused / Daemon Offline");
        } finally {
            setTimeout(() => setIsSyncing(false), 600);
        }
    };

    useEffect(() => {
        syncMetrics();
        const interval = setInterval(syncMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    const extract = (val) => {
        if (val === undefined || val === null) return "---";
        if (typeof val === 'number') return val.toFixed(1);
        const match = val.toString().match(/=> ([\d.]+)/);
        if (match) return parseFloat(match[1]).toFixed(1);
        const num = parseFloat(val);
        return isNaN(num) ? "---" : num.toFixed(1);
    };

    if (error) {
        return (
            <div className="py-20 animate-in">
                <div className="inline-flex items-center gap-2 text-xs text-red-400 mono uppercase tracking-widest mb-6 px-3 py-1 bg-red-400/5 border border-red-400/10 rounded">
                    <Activity size={12} className="animate-pulse" /> Status: Offline
                </div>
                <h2 className="text-4xl font-semibold mb-4 tracking-tight">{error}</h2>
                <p className="text-muted-foreground font-light mb-10 max-w-sm leading-relaxed text-lg">
                    Unable to establish a link with the QryPilot agent. Ensure the CLI is monitoring on port 8081.
                </p>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <code className="w-full md:w-auto bg-card border border-border px-6 py-4 rounded-xl text-sm mono text-primary/80">
                        ./qrypilot --watch
                    </code>
                    <button
                        onClick={syncMetrics}
                        className="w-full md:w-auto h-14 px-10 bg-white text-black text-sm font-bold uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all"
                    >
                        Re-initialize Link
                    </button>
                </div>
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="py-40 flex flex-col items-center justify-center animate-in">
                <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
                <span className="text-xs text-muted-foreground mono tracking-[0.4em] uppercase animate-pulse">Establishing handshake...</span>
            </div>
        );
    }

    return (
        <div className="animate-in pb-20">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
                <div className="space-y-1">
                    <h1 className="text-4xl font-semibold tracking-tight">System Terminal</h1>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mono uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span>Prometheus Node / active</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 px-6 py-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase text-muted-foreground tracking-[0.2em] mb-1 font-bold">Latency</span>
                        <span className="text-xs font-medium mono text-primary">0.42ms</span>
                    </div>
                    <div className="w-px h-8 bg-border/50" />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase text-muted-foreground tracking-[0.2em] mb-1 font-bold">Sync</span>
                        <div className="flex items-center gap-2">
                            <RefreshCw size={10} className={isSyncing ? "animate-spin text-primary" : "text-muted-foreground"} />
                            <span className="text-xs font-medium mono text-foreground">
                                {lastSync ? lastSync.toLocaleTimeString([], { hour12: false }) : "--:--:--"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <MetricCard label="CPU Load" value={extract(metrics.cpu)} unit="%" icon={Cpu} delay="stagger-1" />
                <MetricCard label="Mem Usage" value={extract(metrics.memory)} unit="%" icon={Database} delay="stagger-2" />
                <MetricCard label="Traffic / RPS" value={extract(metrics.rps)} unit="req/s" icon={Network} delay="stagger-3" />
                <MetricCard
                    label="P95 Latency"
                    value={metrics.latency ? (parseFloat(extract(metrics.latency)) * 1000).toFixed(0) : "---"}
                    unit="ms"
                    icon={Clock}
                    delay="stagger-4"
                />
            </div>

            {/* System Log / RAW (Mocked for aesthetic) */}
            <div className="bg-card/50 border border-border rounded-xl overflow-hidden animate-in delay-500">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-[10px] mono uppercase tracking-widest font-bold text-muted-foreground">Standard Output Stream</span>
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    </div>
                </div>
                <div className="p-6 font-mono text-[11px] text-muted-foreground/60 leading-tight space-y-1 select-none">
                    <p>[{new Date().toISOString()}] INFO: Prometheus scraper linked at 127.0.0.1:9090</p>
                    <p>[{new Date().toISOString()}] INFO: Health-check loop initialized (5000ms)</p>
                    <p>[{new Date().toISOString()}] DEBUG: Received metric buffer ({Math.floor(Math.random() * 1000)}B)</p>
                    <p className="text-primary/40 animate-pulse">[{new Date().toISOString()}] STREAMING: live metrics available</p>
                </div>
            </div>
        </div>
    );
}
