import { motion } from "framer-motion";
import { Download, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { formatCurrencyINR, type ProjectDetails, type TimelinePhase } from "@/lib/project-model";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

interface TimelineGanttProps {
  project: ProjectDetails;
  phases: TimelinePhase[];
  totalWeeks: number;
}

export function TimelineGantt({ project, phases, totalWeeks }: TimelineGanttProps) {
  const [criticalOnly, setCriticalOnly] = useState(false);
  const visiblePhases = useMemo(
    () => (criticalOnly ? phases.filter((phase) => phase.critical) : phases),
    [criticalOnly, phases],
  );

  const startDate = project.startDate;
  const projectEnd = new Date(startDate.getTime() + totalWeeks * 7 * 24 * 60 * 60 * 1000);

  const months = useMemo(() => {
    const labels: string[] = [];
    const cursor = new Date(startDate);
    while (cursor <= projectEnd) {
      labels.push(format(cursor, "MMM yyyy"));
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return labels;
  }, [startDate, projectEnd]);

  const exportTimeline = () => {
    const lines = [
      ["Phase", "Start Week", "Duration (weeks)", "Critical", "Milestone"].join(","),
      ...phases.map((phase) =>
        [phase.name, phase.startWeek + 1, phase.durationWeeks, phase.critical ? "Yes" : "No", phase.milestone ? "Yes" : "No"].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}-timeline.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Timeline exported");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Project Timeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(startDate, "MMMM yyyy")} - {format(projectEnd, "MMMM yyyy")} - {totalWeeks} weeks
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportTimeline}>
          <Download size={16} /> Export Timeline
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card px-4 py-3 mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Critical path filter</p>
          <p className="text-xs text-muted-foreground">
            {criticalOnly ? "Showing only critical phases" : "Showing full plan"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="critical-only" className="text-xs text-muted-foreground">Critical only</Label>
          <Switch id="critical-only" checked={criticalOnly} onCheckedChange={setCriticalOnly} />
        </div>
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
          {visiblePhases.map((phase, i) => {
            const leftPct = (phase.startWeek / totalWeeks) * 100;
            const widthPct = (phase.durationWeeks / totalWeeks) * 100;

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
      <div className="flex flex-wrap gap-6 mt-4 text-xs text-muted-foreground items-center">
        <span className="flex items-center gap-2">
          <span className="w-4 h-2 rounded bg-primary/70 inline-block" /> Normal
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-2 rounded bg-destructive/80 inline-block" /> Critical Path
        </span>
        <span className="flex items-center gap-2">
          <Diamond size={10} className="text-primary fill-primary" /> Milestone
        </span>
        <span>
          Budget guardrail: {formatCurrencyINR(project.budget)}
        </span>
      </div>
    </motion.div>
  );
}
