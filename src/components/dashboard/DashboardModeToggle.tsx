
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface DashboardModeToggleProps {
  mode: "classic" | "smart";
  onModeChange: (mode: "classic" | "smart") => void;
}

const DashboardModeToggle = ({ mode, onModeChange }: DashboardModeToggleProps) => {
  return (
    <div className="flex bg-secondary/20 rounded-lg p-1">
      <Button
        variant={mode === "classic" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("classic")}
      >
        Clássico
      </Button>
      <Button
        variant={mode === "smart" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("smart")}
        className="flex items-center gap-1"
      >
        <Sparkles className="h-3 w-3" />
        Inteligente
      </Button>
    </div>
  );
};

export default DashboardModeToggle;
