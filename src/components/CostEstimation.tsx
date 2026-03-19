import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import { formatCurrencyINR, type CostRow, type ProjectDetails } from "@/lib/project-model";
import { toast } from "@/components/ui/sonner";

const COLORS = [
  "hsl(37,90%,55%)", "hsl(200,70%,50%)", "hsl(152,60%,45%)",
  "hsl(280,60%,55%)", "hsl(0,72%,51%)", "hsl(30,80%,50%)",
  "hsl(180,60%,45%)", "hsl(340,65%,50%)", "hsl(60,70%,50%)",
];

interface CostEstimationProps {
  project: ProjectDetails;
  rows: CostRow[];
  contingencyPct: number;
  confidence: number;
  onChangeContingency: (value: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function CostEstimation({
  project,
  rows,
  contingencyPct,
  confidence,
  onChangeContingency,
  onBack,
  onNext,
}: CostEstimationProps) {
  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

  const exportReport = () => {
    const lines = [
      ["Category", "Unit", "Quantity", "Unit Cost", "Total"].join(","),
      ...rows.map((row) => [row.category, row.unit, row.qty, Math.round(row.unitCost), Math.round(row.total)].join(",")),
      ["Grand Total", "", "", "", Math.round(grandTotal)].join(","),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}-cost-report.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Cost report downloaded");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-heading font-bold mb-6">Cost Estimation</h1>

      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{project.name} — {project.location}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {project.type[0].toUpperCase() + project.type.slice(1)} · {project.areaSqFt.toLocaleString("en-IN")} sq ft · {project.material}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-heading font-bold text-primary">{formatCurrencyINR(grandTotal)}</p>
          <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-success/15 text-success">
            <CheckCircle size={12} /> {confidence}% Confidence
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium">Contingency Buffer: {contingencyPct}%</p>
          <p className="text-xs text-muted-foreground">Adjust risk margin before finalizing resources.</p>
        </div>
        <Slider
          className="mt-3"
          value={[contingencyPct]}
          onValueChange={(v) => onChangeContingency(v[0])}
          min={5}
          max={25}
          step={1}
        />
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
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition">
                  <td className="px-4 py-2.5 font-medium">{row.category}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.unit}</td>
                  <td className="px-4 py-2.5 text-right">{row.qty.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">{formatCurrencyINR(row.unitCost)}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{formatCurrencyINR(row.total)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="px-4 py-3" colSpan={4}>Grand Total</td>
                <td className="px-4 py-3 text-right text-primary">{formatCurrencyINR(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Cost Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={rows}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                strokeWidth={0}
              >
                {rows.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(215,35%,15%)", border: "1px solid hsl(215,30%,22%)", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "hsl(210,40%,96%)" }}
                formatter={(value: number) => formatCurrencyINR(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Details
        </Button>
        <Button variant="outline" className="gap-2" onClick={exportReport}>
          <Download size={16} /> Download Report
        </Button>
        <Button onClick={onNext} className="gap-2">
          Proceed to Resource Planning <ArrowRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
}
