import { motion } from "framer-motion";
import { Download, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";

const phases = [
  { name: "Site Preparation", start: 0, duration: 3, critical: false, milestone: false },
  { name: "Foundation", start: 2, duration: 5, critical: true, milestone: true },
  { name: "Structure", start: 6, duration: 8, critical: true, milestone: false },
  { name: "MEP Works", start: 10, duration: 6, critical: true, milestone: false },
  { name: "Interior", start: 14, duration: 5, critical: false, milestone: true },
  { name: "Finishing", start: 18, duration: 4, critical: false, milestone: false },
  { name: "Handover", start: 21, duration: 2, critical: true, milestone: true },
];

const totalWeeks = 24;
const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export function TimelineGantt() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Project Timeline</h1>
          <p className="text-sm text-muted-foreground mt-1">April 2025 — September 2025 · 24 weeks</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} /> Export Timeline
        </Button>
      </div>

      {/* Month header */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Month labels */}
          <div className="flex border-b border-border">
            <div className="w-40 shrink-0 px-4 py-2 text-sm font-medium text-muted-foreground">Phase</div>
            <div className="flex-1 flex">
              {months.map((m) => (
                <div key={m} className="flex-1 text-center text-xs font-medium text-muted-foreground py-2 border-l border-border/50">
                  {m} 2025
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {phases.map((phase, i) => {
            const leftPct = (phase.start / totalWeeks) * 100;
            const widthPct = (phase.duration / totalWeeks) * 100;

            return (
              <div key={i} className="flex items-center border-b border-border/30 hover:bg-secondary/30 transition">
                <div className="w-40 shrink-0 px-4 py-3 text-sm font-medium flex items-center gap-2">
                  {phase.milestone && <Diamond size={12} className="text-primary fill-primary" />}
                  {phase.name}
                </div>
                <div className="flex-1 relative h-10">
                  {/* Grid lines */}
                  {months.map((_, mi) => (
                    <div
                      key={mi}
                      className="absolute top-0 bottom-0 border-l border-border/20"
                      style={{ left: `${(mi / months.length) * 100}%` }}
                    />
                  ))}
                  {/* Bar */}
                  <div
                    className={`absolute top-2 h-6 rounded-md ${
                      phase.critical ? "bg-destructive/80" : "bg-primary/70"
                    }`}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="w-4 h-2 rounded bg-primary/70 inline-block" /> Normal
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-2 rounded bg-destructive/80 inline-block" /> Critical Path
        </span>
        <span className="flex items-center gap-2">
          <Diamond size={10} className="text-primary fill-primary" /> Milestone
        </span>
      </div>
    </motion.div>
  );
}
