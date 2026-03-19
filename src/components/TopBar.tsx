import { Database, RotateCcw, Upload, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyINR } from "@/lib/project-model";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  projectName: string;
  projectLocation: string;
  totalCost: number;
  onSaveDraft: () => void;
  onLoadDraft: () => void;
  onReset: () => void;
}

export function TopBar({
  projectName,
  projectLocation,
  totalCost,
  onSaveDraft,
  onLoadDraft,
  onReset,
}: TopBarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const signOut = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="min-w-0">
        <h2 className="font-heading text-sm font-semibold text-foreground truncate">{projectName}</h2>
        <p className="text-xs text-muted-foreground truncate">
          {projectLocation} • Current estimate {formatCurrencyINR(totalCost)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={onLoadDraft}>
          <Upload size={14} /> Load
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={onSaveDraft}>
          <Database size={14} /> Save
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={onReset}>
          <RotateCcw size={14} /> Reset
        </Button>
        <ThemeToggle />
        <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => navigate("/profile")}>
          <User size={14} /> Profile
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={signOut}>
          <LogOut size={14} /> Logout
        </Button>
      </div>
    </header>
  );
}
