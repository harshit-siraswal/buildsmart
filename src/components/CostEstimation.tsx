import { motion } from "framer-motion";
import { ArrowRight, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const costData = [
  { category: "Foundation", unit: "cu m", qty: 320, unitCost: 4500, total: 1440000 },
  { category: "Structure", unit: "sq ft", qty: 12000, unitCost: 850, total: 10200000 },
  { category: "Roofing", unit: "sq ft", qty: 3200, unitCost: 350, total: 1120000 },
  { category: "Electrical", unit: "points", qty: 180, unitCost: 2200, total: 396000 },
  { category: "Plumbing", unit: "points", qty: 95, unitCost: 3100, total: 294500 },
  { category: "Interior Finishing", unit: "sq ft", qty: 10000, unitCost: 600, total: 6000000 },
  { category: "Labor", unit: "man-days", qty: 4500, unitCost: 800, total: 3600000 },
  { category: "Equipment", unit: "days", qty: 120, unitCost: 5500, total: 660000 },
  { category: "Contingency (10%)", unit: "—", qty: 1, unitCost: 2371050, total: 2371050 },
];

const grandTotal = costData.reduce((s, r) => s + r.total, 0);

const COLORS = [
  "hsl(37,90%,55%)", "hsl(200,70%,50%)", "hsl(152,60%,45%)",
  "hsl(280,60%,55%)", "hsl(0,72%,51%)", "hsl(30,80%,50%)",
  "hsl(180,60%,45%)", "hsl(340,65%,50%)", "hsl(60,70%,50%)",
];

interface CostEstimationProps {
  onNext: () => void;
}

export function CostEstimation({ onNext }: CostEstimationProps) {
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-heading font-bold mb-6">Cost Estimation</h1>

      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Greenfield Residential Complex — Mumbai</p>
          <p className="text-xs text-muted-foreground mt-0.5">Residential · 12,000 sq ft · Concrete</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-heading font-bold text-primary">{fmt(grandTotal)}</p>
          <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-success/15 text-success">
            <CheckCircle size={12} /> 87% Confidence
          </span>
        </div>
      </div>

      {/* Table + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left">
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Unit</th>
                <th className="px-4 py-3 font-medium text-right">Qty</th>
                <th className="px-4 py-3 font-medium text-right">Unit Cost</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {costData.map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition">
                  <td className="px-4 py-2.5 font-medium">{row.category}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.unit}</td>
                  <td className="px-4 py-2.5 text-right">{row.qty.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">{fmt(row.unitCost)}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{fmt(row.total)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="px-4 py-3" colSpan={4}>Grand Total</td>
                <td className="px-4 py-3 text-right text-primary">{fmt(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Cost Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={costData}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                strokeWidth={0}
              >
                {costData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(215,35%,15%)", border: "1px solid hsl(215,30%,22%)", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "hsl(210,40%,96%)" }}
                formatter={(value: number) => fmt(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="gap-2">
          <Download size={16} /> Download Report
        </Button>
        <Button onClick={onNext} className="gap-2">
          Proceed to Resource Planning <ArrowRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
}
