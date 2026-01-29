import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Terminal, Command } from 'lucide-react';

const NavItem = ({ to, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `px-3 py-1.5 rounded transition-all duration-200 text-sm ${isActive
                ? 'text-primary bg-primary/5 font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted font-light'
            }`
        }
    >
        {label}
    </NavLink>
);

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group transition-transform active:scale-[0.98]">
                        <div className="w-7 h-7 flex items-center justify-center bg-primary/10 border border-primary/20 rounded">
                            <Terminal size={14} className="text-primary" />
                        </div>
                        <span className="font-semibold tracking-tight text-sm mono uppercase tracking-widest">qrypilot</span>
                    </Link>

                    <nav className="flex items-center gap-2 p-1 bg-muted/40 rounded-lg border border-border/60">
                        <NavItem to="/dashboard" label="Console" />
                        <NavItem to="/chat" label="Ask AI" />
                        <NavItem to="/setup" label="Guide" />
                    </nav>

                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card/50 text-[10px] text-muted-foreground mono tracking-widest cursor-default hover:bg-muted transition-colors">
                        <Command size={10} /> + K
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in">
                {children}
            </main>

            {/* System Status indicator */}
            <div className="fixed bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur shadow-xl animate-in delay-500">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
                <span className="text-[10px] mono text-muted-foreground uppercase tracking-wider">Node / OK</span>
            </div>
        </div>
    );
}
