import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const labor = [
  { role: "Site Engineer", count: 2, dailyRate: 3500, days: 180, total: 1260000 },
  { role: "Project Manager", count: 1, dailyRate: 5000, days: 180, total: 900000 },
  { role: "Skilled Workers", count: 12, dailyRate: 800, days: 150, total: 1440000 },
  { role: "Helpers", count: 20, dailyRate: 500, days: 150, total: 1500000 },
];

const materials = [
  { item: "Cement (bags)", qty: "4,200", delivery: "Apr 15, 2025" },
  { item: "Steel Rods (tons)", qty: "28", delivery: "Apr 20, 2025" },
  { item: "Sand (cu m)", qty: "320", delivery: "Apr 10, 2025" },
  { item: "Bricks", qty: "85,000", delivery: "May 1, 2025" },
  { item: "Wiring (m)", qty: "6,500", delivery: "Jun 15, 2025" },
];

const equipment = [
  { name: "Tower Crane", rentalDays: 90, dailyCost: 8000, total: 720000 },
  { name: "Concrete Mixer", rentalDays: 120, dailyCost: 2500, total: 300000 },
  { name: "Excavator", rentalDays: 30, dailyCost: 6000, total: 180000 },
];

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const totalResource =
  labor.reduce((s, r) => s + r.total, 0) + equipment.reduce((s, r) => s + r.total, 0);

interface ResourcePlanningProps {
  onNext: () => void;
}

export function ResourcePlanning({ onNext }: ResourcePlanningProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-heading font-bold mb-6">Resource Planning</h1>

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
              {labor.map((r, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="py-2">
                    {r.role}
                    {r.count > 1 && <span className="text-muted-foreground"> ×{r.count}</span>}
                  </td>
                  <td className="py-2 text-right text-muted-foreground">{fmt(r.dailyRate)}</td>
                  <td className="py-2 text-right font-medium">{fmt(r.total)}</td>
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
              {materials.map((r, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="py-2">{r.item}</td>
                  <td className="py-2 text-right">{r.qty}</td>
                  <td className="py-2 text-right text-muted-foreground text-xs">{r.delivery}</td>
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
              {equipment.map((r, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 text-right">{r.rentalDays}</td>
                  <td className="py-2 text-right font-medium">{fmt(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-5 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Total Resource Cost</p>
          <p className="text-2xl font-heading font-bold text-primary">{fmt(totalResource)}</p>
        </div>
        <Button onClick={onNext} className="gap-2">
          View Timeline <ArrowRight size={16} />
        </Button>
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
