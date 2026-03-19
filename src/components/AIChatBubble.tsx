import { useState } from "react";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrencyINR, type ProjectDetails } from "@/lib/project-model";
import type { Screen } from "@/components/AppSidebar";

interface Message {
  role: "user" | "ai";
  text: string;
}

interface AIChatBubbleProps {
  project: ProjectDetails;
  screen: Screen;
  totalCost: number;
  onApplyBudgetChange: (deltaPct: number) => void;
}

export function AIChatBubble({ project, screen, totalCost, onApplyBudgetChange }: AIChatBubbleProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! I am your BuildSmart AI assistant. Ask about cost, material, timeline, or try quick actions below." },
  ]);
  const [input, setInput] = useState("");

  const suggestions = [
    "How far are we from budget?",
    "What if material changes to steel?",
    "Apply 10% budget cut",
  ];

  const generateReply = (text: string) => {
    const q = text.toLowerCase();
    const budgetGap = totalCost - project.budget;
    const overUnder = budgetGap > 0 ? "over" : "under";

    if (q.includes("budget")) {
      return `Current estimate is ${formatCurrencyINR(totalCost)}, which is ${formatCurrencyINR(Math.abs(budgetGap))} ${overUnder} your budget of ${formatCurrencyINR(project.budget)}.`;
    }

    if (q.includes("steel")) {
      const steelEstimate = Math.round(totalCost * 1.08);
      return `Switching to steel usually increases structural and labor cost. Expected estimate: ${formatCurrencyINR(steelEstimate)} (about +8%).`;
    }

    if (q.includes("timeline") || q.includes("duration")) {
      const approxWeeks = Math.max(16, Math.round(project.areaSqFt / 800 + 8));
      return `For ${project.areaSqFt.toLocaleString("en-IN")} sq ft, expected duration is around ${approxWeeks} weeks from ${project.startDate.toLocaleDateString("en-IN")}.`;
    }

    if (q.includes("apply 10% budget cut") || q.includes("reduce budget by 10")) {
      onApplyBudgetChange(-10);
      return "Applied a 10% budget cut to project settings. Re-open cost and timeline to compare impact.";
    }

    return `You are in the ${screen} stage for ${project.name}. Ask me to compare budget, materials, or timeline trade-offs.`;
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const clean = text.trim();
    setMessages((m) => [...m, { role: "user", text: clean }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: generateReply(clean),
        },
      ]);
    }, 450);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        text: "Chat reset. Ask another question about your latest project state.",
      },
    ]);
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
              <div className="flex items-center gap-2">
                <button onClick={clearChat} className="text-muted-foreground hover:text-foreground">
                  <Trash2 size={14} />
                </button>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
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
