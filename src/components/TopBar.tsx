import { User } from "lucide-react";

interface TopBarProps {
  projectName: string;
}

export function TopBar({ projectName }: TopBarProps) {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0">
      <h2 className="font-heading text-sm font-semibold text-foreground truncate">
        {projectName}
      </h2>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User size={16} className="text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
