import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { type ProjectDetails } from "@/lib/project-model";
import { toast } from "@/components/ui/sonner";

interface InputProjectProps {
  initialValue: ProjectDetails;
  onSubmit: (details: ProjectDetails) => void;
  onBackToProjects?: () => void;
}

export function InputProject({ initialValue, onSubmit, onBackToProjects }: InputProjectProps) {
  const [name, setName] = useState(initialValue.name);
  const [type, setType] = useState<ProjectDetails["type"]>(initialValue.type);
  const [location, setLocation] = useState(initialValue.location);
  const [areaSqFt, setAreaSqFt] = useState(initialValue.areaSqFt);
  const [material, setMaterial] = useState<ProjectDetails["material"]>(initialValue.material);
  const [budget, setBudget] = useState([initialValue.budget]);
  const [date, setDate] = useState<Date>(initialValue.startDate);

  const formatBudget = (v: number) =>
    v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`;

  const estimatedDurationMonths = Math.max(4, Math.round(areaSqFt / 1800) + 2);

  const handleSubmit = () => {
    if (!name.trim() || !location.trim()) {
      toast.error("Missing details", {
        description: "Project name and location are required.",
      });
      return;
    }

    if (areaSqFt < 1000) {
      toast.error("Area is too small", {
        description: "Use a project area of at least 1,000 sq ft.",
      });
      return;
    }

    onSubmit({
      name: name.trim(),
      type,
      location: location.trim(),
      areaSqFt,
      material,
      budget: budget[0],
      startDate: date,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      {onBackToProjects && (
        <Button variant="ghost" className="mb-3 -ml-2" onClick={onBackToProjects}>
          <ArrowLeft size={16} className="mr-1" /> Back to Projects
        </Button>
      )}
      <h1 className="text-2xl font-heading font-bold mb-1">Input Project Details</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Enter your construction project parameters for AI-powered estimation.
      </p>

      <div className="space-y-5">
        <Field label="Project Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Project Type">
            <Select value={type} onValueChange={(v) => setType(v as ProjectDetails["type"])}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-secondary border-border" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Total Area (sq ft)">
            <Input
              type="number"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Math.max(0, Number(e.target.value) || 0))}
              className="bg-secondary border-border"
            />
          </Field>

          <Field label="Primary Material">
            <Select value={material} onValueChange={(v) => setMaterial(v as ProjectDetails["material"])}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concrete">Concrete</SelectItem>
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="timber">Timber</SelectItem>
                <SelectItem value="brick">Brick</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label={`Budget Range — ${formatBudget(budget[0])}`}>
          <Slider
            value={budget}
            onValueChange={setBudget}
            min={10000}
            max={10000000}
            step={10000}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>$10K</span>
            <span>$10M</span>
          </div>
        </Field>

        <Field label="Start Date">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-secondary border-border")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full mt-4 text-base font-semibold"
        >
          Generate AI Estimate
          <ArrowRight className="ml-2" size={18} />
        </Button>

        <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <p className="font-medium">Quick feasibility snapshot</p>
          <p className="text-muted-foreground mt-1">
            Estimated duration: {estimatedDurationMonths} months · Budget density: ₹
            {Math.round(budget[0] / Math.max(areaSqFt, 1)).toLocaleString("en-IN")} / sq ft
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}
