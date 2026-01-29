import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import { Terminal, Send, Trash2, Cpu, MessageSquare } from 'lucide-react';

const examples = [
    "Identify current bottleneck",
    "Compare CPU usage with yesterday",
    "List top 5 memory consuming nodes",
    "Is latency trending upwards?"
];

export default function Chat() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (qText) => {
        const textToSubmit = qText || input;
        if (!textToSubmit.trim() || loading) return;

        setInput('');
        setLoading(true);
        setMessages(prev => [...prev, { type: 'q', text: textToSubmit }]);

        try {
            const resp = await api.chat(textToSubmit);
            setMessages(prev => [...prev, {
                type: 'a',
                text: resp.Payload || resp.payload || "Engine returned empty payload."
            }]);
        } catch {
            setMessages(prev => [...prev, { type: 'a', text: "Critical: Error reaching inference engine. check ./qrypilot --watch" }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col animate-in h-[calc(100vh-14rem)]">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2 uppercase tracking-[0.3em] text-[10px] text-primary font-medium">
                        <Cpu size={12} className="opacity-50" />
                        <span>Inference Engine</span>
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight">AI Assistant</h1>
                </div>
                <button
                    onClick={() => setMessages([])}
                    className="p-2 text-muted-foreground hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/5 group"
                    title="Clear history"
                >
                    <Trash2 size={16} className="group-active:scale-90" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-8 space-y-10 pr-4" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="py-12 animate-in stagger-1">
                        <div className="flex items-center gap-3 mb-6 opacity-30">
                            <MessageSquare size={18} />
                            <span className="text-xs mono uppercase tracking-widest font-light">History is empty</span>
                        </div>
                        <p className="text-xl font-light text-muted-foreground mb-8 leading-relaxed max-w-sm">
                            Query your infrastructure in natural language.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {examples.map((ex, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSubmit(ex)}
                                    className="text-left px-5 py-4 bg-muted/20 border border-border rounded-xl text-sm font-light hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-[0.98] animate-in"
                                    style={{ animationDelay: `${(i + 1) * 100}ms` }}
                                >
                                    {ex}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-6 animate-slide`}>
                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 border ${msg.type === 'q' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground'
                            }`}>
                            {msg.type === 'q' ? <span className="text-[10px] font-bold">U</span> : <span className="text-[10px] font-bold">AI</span>}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mono font-bold">
                                {msg.type === 'q' ? 'Local User' : 'QryPilot Engine'}
                            </div>
                            <div className={`${msg.type === 'q' ? 'text-sm' : 'text-xs mono'} leading-relaxed font-light ${msg.type === 'q' ? 'text-foreground font-medium' : 'text-muted-foreground whitespace-pre-wrap'}`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-6 animate-in">
                        <div className="shrink-0 w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center mt-1">
                            <span className="text-[10px] font-bold text-primary animate-pulse italic">...</span>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mono font-bold">Thinking</div>
                            <div className="text-xs mono font-light text-muted-foreground italic animate-pulse">Running inference against Prometheus schema...</div>
                        </div>
                    </div>
                )}
            </div>

            <form
                onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                className="relative group animate-in delay-200"
            >
                <div className="absolute left-5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded border border-primary/20 bg-primary/5">
                    <Terminal size={12} className="text-primary" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe the insight you're looking for..."
                    className="w-full bg-card/60 backdrop-blur-sm border border-border rounded-xl pl-14 pr-16 py-5 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 active:scale-[0.995]"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-primary text-black disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                >
                    <Send size={16} />
                </button>
            </form>
            <div className="mt-4 px-2 flex items-center justify-between text-[10px] text-muted-foreground mono uppercase tracking-widest">
                <span>Direct Prometheus Link Active</span>
                <span>CTRL + ENT to send prompt</span>
            </div>
        </div>
    );
}
