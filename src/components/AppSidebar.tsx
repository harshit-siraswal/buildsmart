import { useState } from "react";
import { ClipboardList, DollarSign, Users, BarChart3, Plus, ChevronLeft, ChevronRight, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type Screen = "input" | "cost" | "resource" | "timeline";

const navItems: { id: Screen; label: string; icon: React.ElementType }[] = [
  { id: "input", label: "Project Details", icon: ClipboardList },
  { id: "cost", label: "Cost Estimation", icon: DollarSign },
  { id: "resource", label: "Resource Planning", icon: Users },
  { id: "timeline", label: "Timeline", icon: BarChart3 },
];

const order: Screen[] = ["input", "cost", "resource", "timeline"];

interface AppSidebarProps {
  active: Screen;
  highestUnlocked: Screen;
  onNavigate: (s: Screen) => void;
  onNewProject: () => void;
}

export function AppSidebar({ active, highestUnlocked, onNavigate, onNewProject }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const unlockedIndex = order.indexOf(highestUnlocked);
  const activeIndex = order.indexOf(active);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
        {!collapsed && (
          <span className="font-heading text-lg font-bold text-foreground truncate">
            Build<span className="text-primary">Smart</span> AI
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded hover:bg-secondary text-muted-foreground"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const idx = order.indexOf(item.id);
          const isUnlocked = idx <= unlockedIndex;
          const isCompleted = idx < activeIndex;

          return (
          <button
            key={item.id}
            onClick={() => isUnlocked && onNavigate(item.id)}
            disabled={!isUnlocked}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active === item.id
                ? "bg-primary/15 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              !isUnlocked && "opacity-45 cursor-not-allowed"
            )}
          >
            <item.icon size={18} />
            {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
            {!collapsed && isCompleted && <Check size={14} className="text-success" />}
            {!collapsed && !isUnlocked && <Lock size={14} className="text-muted-foreground" />}
          </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={onNewProject}
          className={cn(
            "flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition justify-center"
          )}
        >
          <Plus size={16} />
          {!collapsed && <span>New Project</span>}
        </button>
      </div>
    </aside>
  );
}
