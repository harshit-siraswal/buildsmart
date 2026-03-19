import { motion } from "framer-motion";
import { Plus, MapPin, Calendar, ArrowRight, Building2, Factory, Landmark, HardHat } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ProjectSummary {
  id: string;
  name: string;
  type: string;
  location: string;
  area: number;
  budget: number;
  startDate: string;
  estimatedCost: number;
  status: "estimated" | "in-progress" | "completed";
}

const demoProjects: ProjectSummary[] = [
  {
    id: "1",
    name: "Greenfield Residential Complex",
    type: "Residential",
    location: "Mumbai, India",
    area: 12000,
    budget: 2500000,
    startDate: "Apr 1, 2025",
    estimatedCost: 26081550,
    status: "estimated",
  },
  {
    id: "2",
    name: "Horizon Commercial Tower",
    type: "Commercial",
    location: "Bangalore, India",
    area: 45000,
    budget: 8000000,
    startDate: "Jun 15, 2025",
    estimatedCost: 72400000,
    status: "in-progress",
  },
  {
    id: "3",
    name: "Riverside Infrastructure Bridge",
    type: "Infrastructure",
    location: "Delhi, India",
    area: 8000,
    budget: 5000000,
    startDate: "Mar 10, 2025",
    estimatedCost: 41200000,
    status: "completed",
  },
];

const typeIcons: Record<string, React.ElementType> = {
  Residential: Building2,
  Commercial: Landmark,
  Industrial: Factory,
  Infrastructure: HardHat,
};

interface ProjectListProps {
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
}

export function ProjectList({ onSelectProject, onNewProject }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectSummary["status"]>("all");
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
  const statusColors: Record<string, string> = {
    estimated: "bg-accent/15 text-accent",
    "in-progress": "bg-primary/15 text-primary",
    completed: "bg-success/15 text-success",
  };

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();

    return demoProjects.filter((project) => {
      const matchesStatus = statusFilter === "all" ? true : project.status === statusFilter;
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.type.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredProjects.length} of {demoProjects.length} projects · Select one to view AI estimates
          </p>
        </div>
        <Button onClick={onNewProject} className="gap-2">
          <Plus size={16} /> New Project
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 mb-5 space-y-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project, city, or type"
          className="bg-secondary border-border"
        />
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All" },
            { id: "estimated", label: "Estimated" },
            { id: "in-progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatusFilter(item.id as "all" | ProjectSummary["status"])}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                statusFilter === item.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProjects.map((project, i) => {
          const Icon = typeIcons[project.type] || Building2;
          return (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelectProject(project.id)}
              className="group text-left rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                  <Icon size={20} className="text-primary" />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[project.status]}`}>
                  {project.status.replace("-", " ")}
                </span>
              </div>

              <h3 className="font-heading font-semibold text-base mb-1 group-hover:text-primary transition">
                {project.name}
              </h3>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {project.startDate}
                </span>
              </div>

              <div className="flex items-end justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Cost</p>
                  <p className="text-lg font-heading font-bold text-primary">{fmt(project.estimatedCost)}</p>
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No projects match your current search/filter.
          </div>
        )}

        {/* Add new project card */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: demoProjects.length * 0.08 }}
          onClick={onNewProject}
          className="rounded-xl border-2 border-dashed border-border hover:border-primary/40 p-5 flex flex-col items-center justify-center gap-3 min-h-[200px] text-muted-foreground hover:text-primary transition-all group"
        >
          <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-primary/10 transition">
            <Plus size={24} />
          </div>
          <span className="text-sm font-medium">Add New Project</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
