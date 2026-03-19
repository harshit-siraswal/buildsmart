import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, DollarSign, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputProject } from "./InputProject";
import { CostEstimation } from "./CostEstimation";
import { ResourcePlanning } from "./ResourcePlanning";
import { TimelineGantt } from "./TimelineGantt";

type Tab = "details" | "cost" | "resource" | "timeline";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "details", label: "Details", icon: FileText },
  { id: "cost", label: "Cost Estimation", icon: DollarSign },
  { id: "resource", label: "Resources", icon: Users },
  { id: "timeline", label: "Timeline", icon: BarChart3 },
];

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("cost");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-xl font-heading font-bold">Greenfield Residential Complex</h1>
          <p className="text-sm text-muted-foreground">Mumbai, India · Residential · 12,000 sq ft</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg bg-secondary/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={15} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "details" && <InputProject onSubmit={() => setActiveTab("cost")} />}
      {activeTab === "cost" && <CostEstimation onNext={() => setActiveTab("resource")} />}
      {activeTab === "resource" && <ResourcePlanning onNext={() => setActiveTab("timeline")} />}
      {activeTab === "timeline" && <TimelineGantt />}
    </motion.div>
  );
}
