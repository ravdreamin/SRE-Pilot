import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Terminal, AlertCircle, CheckCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "json";
}

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call your Go Backend
      const res = await axios.post("/api/chat", { prompt: input });

      // Format the JSON response nicely
      const aiContent = JSON.stringify(res.data, null, 2);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiContent, type: "json" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not reach Aegis Core." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-mono">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-2 bg-gray-950">
        <Terminal className="text-emerald-500" />
        <h1 className="font-bold text-lg">
          Aegis <span className="text-gray-500 text-sm">/ Qwen 2.5 Coder</span>
        </h1>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-20">
            <p>System Online. Ready for PromQL queries.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              {msg.type === "json" ? (
                <pre className="text-xs overflow-x-auto text-emerald-300">
                  {msg.content}
                </pre>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 animate-pulse">Processing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-950 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Aegis to check metrics..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={sendMessage}
            className="bg-emerald-600 p-2 rounded hover:bg-emerald-500"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
