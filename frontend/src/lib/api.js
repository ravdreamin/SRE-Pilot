const API_BASE = ""; // Use relative path to leverage Vite proxy

export const api = {
    health: async () => {
        try {
            const res = await fetch(`${API_BASE}/health`);
            return res.ok;
        } catch {
            return false;
        }
    },

    getMetrics: async () => {
        const res = await fetch(`${API_BASE}/api/metrics`);
        if (!res.ok) throw new Error("Failed to fetch metrics");
        return res.json();
    },

    getEvents: async () => {
        const res = await fetch(`${API_BASE}/api/events`);
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
    },

    chat: async (message, history = []) => {
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                UserPrompt: message,
                Context: "Web Console",
                History: history
            }),
        });
        if (!res.ok) throw new Error("Chat failed");
        return res.json();
    }
};
