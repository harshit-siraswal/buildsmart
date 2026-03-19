import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const suggestions = [
  "What if I change material to steel?",
  "Reduce budget by 20%",
  "Add 2 more floors",
];

interface Message {
  role: "user" | "ai";
  text: string;
}

export function AIChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! I'm your BuildSmart AI assistant. Ask me anything about your project — costs, materials, timelines, and more." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Great question! Based on the current project parameters, I'd estimate that change would adjust the overall cost by approximately 12-15%. Would you like me to run a detailed re-estimation?",
        },
      ]);
    }, 800);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl flex flex-col max-h-[28rem]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-heading font-semibold text-sm">AI Assistant</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    m.role === "ai"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground ml-auto"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Suggestion chips */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2 p-3 border-t border-border">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask anything..."
                className="bg-secondary border-border text-sm"
              />
              <Button size="icon" onClick={() => send(input)} className="shrink-0">
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow hover:scale-105 transition-transform"
      >
        <MessageCircle size={20} />
      </button>
    </>
  );
}
