import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Copy, Check, Box, Database, Lock, Play, Activity } from 'lucide-react';

const Step = ({ num, title, description, code, note }) => {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-6 md:gap-10 animate-in group">
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-[10px] mono font-bold text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors">
                    0{num}
                </div>
                <div className="flex-1 w-px bg-border my-4 group-last:bg-transparent" />
            </div>

            <div className="flex-1 pb-16">
                <h3 className="text-xl font-medium mb-3 tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground font-light mb-6 leading-relaxed max-w-lg">
                    {description}
                </p>

                <div className="relative group/code bg-card border border-border rounded-xl overflow-hidden mb-3">
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground mono">
                        <span>Terminal</span>
                        <button onClick={onCopy} className="hover:text-primary flex items-center gap-1.5 transition-colors">
                            {copied ? <Check size={10} /> : <Copy size={10} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="p-5 overflow-x-auto font-mono text-xs text-muted-foreground leading-relaxed">
                        {code}
                    </div>
                </div>
                {note && <div className="text-[10px] mono text-primary/60 uppercase tracking-widest">{note}</div>}
            </div>
        </div>
    );
};

export default function Setup() {
    return (
        <div className="animate-in max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-16 uppercase tracking-widest font-bold">
                <ChevronLeft size={14} /> Back to systems
            </Link>

            <header className="mb-20">
                <h1 className="text-5xl font-semibold tracking-tight mb-6">Quick Start</h1>
                <p className="text-xl text-muted-foreground font-light max-w-xl">
                    Deploy QryPilot in less than 5 minutes. Connect your Prometheus instance and start asking questions.
                </p>
            </header>

            <div className="flex flex-col">
                <Step
                    num={1}
                    title="Binary Build"
                    description="Clone the QryPilot repository and build the Aegis engine. Requires Go v1.22+."
                    code={`git clone https://github.com/ravdreamin/QryPilot.git\ncd QryPilot/cli\ngo build -o qrypilot ./cmd/aegis`}
                    note="Checked: Go 1.22+ required"
                />

                <Step
                    num={2}
                    title="Auth Secret"
                    description="The inference engine needs a Groq API key. Create a .env file in the /cli directory."
                    code={`echo "GROQ_API_KEY=your_key_here" > .env`}
                    note={<>Need a key? <a href="https://console.groq.com" target="_blank" className="text-primary hover:underline">Get one free at Groq.com</a></>}
                />

                <Step
                    num={3}
                    title="Metrics Sink"
                    description="Start a local Prometheus instance using Docker Compose to handle system metrics."
                    code={`cd deployments\ndocker-compose up -d`}
                    note="Docker & Compose required"
                />

                <Step
                    num={4}
                    title="Initialize Web API"
                    description="Run the binary with the watch flag to start the server. This exposes the metrics for this UI."
                    code={`./qrypilot --watch`}
                    note="Running on http://localhost:8081"
                />

                <Step
                    num={5}
                    title="Direct Query"
                    description="Test the engine directly from your terminal using the ask flag. No web UI required."
                    code={`./qrypilot --ask "what is our current cpu load?"`}
                    note="Engine: Llama-3 / Groq"
                />
            </div>

            <section className="mt-20 pt-20 border-t border-border">
                <div className="flex items-center gap-3 mb-12">
                    <Activity size={18} className="text-primary" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Demo Walkthrough</span>
                </div>
                <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-2xl">
                    <video src="/demo.mov" controls className="w-full h-auto aspect-video" />
                </div>
                <div className="mt-8 flex justify-center">
                    <Link to="/dashboard" className="h-12 px-10 flex items-center bg-primary text-black font-bold text-xs uppercase tracking-widest rounded hover:opacity-90 active:scale-95 transition-all">
                        Launch Console Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
