import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { formatCurrencyINR, type ProjectDetails, type ResourcePlan } from "@/lib/project-model";

interface ResourcePlanningProps {
  project: ProjectDetails;
  plan: ResourcePlan;
  crewMultiplier: number;
  accelerated: boolean;
  onChangeCrewMultiplier: (value: number) => void;
  onChangeAccelerated: (value: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ResourcePlanning({
  project,
  plan,
  crewMultiplier,
  accelerated,
  onChangeCrewMultiplier,
  onChangeAccelerated,
  onBack,
  onNext,
}: ResourcePlanningProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-heading font-bold mb-6">Resource Planning</h1>

      <div className="rounded-lg border border-border bg-card p-4 mb-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <div>
            <p className="text-sm font-medium">Crew Strength Multiplier: {crewMultiplier.toFixed(1)}x</p>
            <Slider
              className="mt-2"
              value={[crewMultiplier]}
              onValueChange={(v) => onChangeCrewMultiplier(v[0])}
              min={0.8}
              max={1.6}
              step={0.1}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <div>
              <Label htmlFor="accelerated-mode" className="text-sm font-medium">Accelerated Schedule</Label>
              <p className="text-xs text-muted-foreground">Compresses duration by adding more shifts.</p>
            </div>
            <Switch
              id="accelerated-mode"
              checked={accelerated}
              onCheckedChange={onChangeAccelerated}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Labor */}
        <Card title="Labor">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border">
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium text-right">Rate/day</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {plan.labor.map((r, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="py-2">
                    {r.role}
                    {r.count > 1 && <span className="text-muted-foreground"> ×{r.count}</span>}
                  </td>
                  <td className="py-2 text-right text-muted-foreground">{formatCurrencyINR(r.dailyRate)}</td>
                  <td className="py-2 text-right font-medium">{formatCurrencyINR(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Materials */}
        <Card title="Materials">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border">
                <th className="pb-2 font-medium">Item</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium text-right">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {plan.materials.map((r, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="py-2">{r.item}</td>
                  <td className="py-2 text-right">{r.qty}</td>
                  <td className="py-2 text-right text-muted-foreground text-xs">{format(r.delivery, "dd MMM yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Equipment */}
        <Card title="Equipment">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium text-right">Days</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {plan.equipment.map((r, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 text-right">{r.rentalDays}</td>
                  <td className="py-2 text-right font-medium">{formatCurrencyINR(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-5 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Total Resource Cost for {project.name}</p>
          <p className="text-2xl font-heading font-bold text-primary">{formatCurrencyINR(plan.totalCost)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft size={16} /> Back to Cost
          </Button>
          <Button onClick={onNext} className="gap-2">
            View Timeline <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:shadow-glow transition-shadow">
      <h3 className="font-heading font-semibold text-sm mb-3 text-primary">{title}</h3>
      {children}
    </div>
  );
}
