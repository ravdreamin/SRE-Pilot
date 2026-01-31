import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Terminal, Zap } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Nav */}
            <nav className="flex items-center justify-between px-6 md:px-12 py-8 animate-in">
                <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/10 border border-primary/20 rounded group-hover:scale-105 transition-transform">
                        <Terminal size={16} className="text-primary" />
                    </div>
                    <span className="font-medium tracking-tight mono">qrypilot <span className="text-muted-foreground font-light text-xs">v0.1.0</span></span>
                </div>
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <Link to="/setup" className="hover:text-primary transition-colors">Setup</Link>
                    <a href="https://github.com/ravdreamin/QryPilot" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-2">
                        <Github size={14} /> GitHub
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <main className="max-w-6xl mx-auto px-6 md:px-12 pt-16 md:pt-32 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="animate-in stagger-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] uppercase tracking-widest text-primary mb-8">
                            <Zap size={10} /> Live Observability
                        </div>
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] mb-8">
                            Observability,<br />
                            <span className="text-muted-foreground italic font-extralight font-serif">humanized.</span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-light leading-relaxed mb-12 max-w-md">
                            A minimalist CLI and dashboard that translates natural questions into executable PromQL—connecting your data to your intuition.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="h-12 px-8 flex items-center bg-primary text-black font-medium rounded hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10">
                                Launch Console
                            </Link>
                            <a href="https://github.com/ravdreamin/QryPilot" target="_blank" className="h-12 px-8 flex items-center border border-border rounded hover:bg-muted transition-all text-sm">
                                View GitHub
                            </a>
                        </div>
                    </div>

                    <div className="animate-in stagger-2 relative">
                        {/* Fake Console UI */}
                        <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden interactive-border">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                </div>
                                <span className="text-[10px] mono text-muted-foreground uppercase tracking-widest">qrypilot --ask</span>
                            </div>
    <div className="relative aspect-video bg-black">
                                <video 
                                    src="/demo.mov" 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                            </div>
                        </div>
                        {/* Shadow decoration */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                    </div>
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-40 border-t border-border pt-20 animate-in stagger-3">
                    <div>
                        <span className="text-[10px] uppercase text-primary tracking-widest mb-4 block">01 / Syntax Free</span>
                        <h3 className="text-lg font-medium mb-3">PromQL Optional</h3>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                            Stop context switching to look up metric names. Ask in English and let the engine handle the rest.
                        </p>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase text-primary tracking-widest mb-4 block">02 / Open Engine</span>
                        <h3 className="text-lg font-medium mb-3">Runs Everywhere</h3>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                            A single binary build in Go. Lightweight, portable, and integrates with any Prometheus endpoint.
                        </p>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase text-primary tracking-widest mb-4 block">03 / Dev Focused</span>
                        <h3 className="text-lg font-medium mb-3">Low Overhead</h3>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                            No heavy dashboards. No complex setups. Just the data you need when you need it.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto px-6 md:px-12 py-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 animate-in">
                <span className="text-xs text-muted-foreground mono tracking-tight">© 2026 QryPilot — Built for SREs</span>
                <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <a href="#" className="hover:text-primary transition-colors">Systems</a>
                    <a href="#" className="hover:text-primary transition-colors">Metrics</a>
                    <a href="#" className="hover:text-primary transition-colors">AI Docs</a>
                </div>
            </footer>
        </div>
    );
}
