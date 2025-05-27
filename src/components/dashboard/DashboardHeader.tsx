
import DashboardModeToggle from "./DashboardModeToggle";
import DashboardActions from "./DashboardActions";
import { DateRange } from "react-day-picker";

interface DashboardHeaderProps {
  dashboardMode: "classic" | "smart";
  onModeChange: (mode: "classic" | "smart") => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onUpload: () => void;
  onAIAssistant: () => void;
  onDetailedAnalysis: () => void;
}

const DashboardHeader = ({
  dashboardMode,
  onModeChange,
  dateRange,
  onDateRangeChange,
  onUpload,
  onAIAssistant,
  onDetailedAnalysis
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold accent-text">
          Dashboard {dashboardMode === "smart" ? "Inteligente" : "Clássico"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {dashboardMode === "smart" 
            ? "Análise avançada com IA e insights personalizados - Dados em tempo real do Supabase"
            : "Visão clássica das métricas principais - Dados em tempo real do Supabase"
          }
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <DashboardModeToggle mode={dashboardMode} onModeChange={onModeChange} />
        <DashboardActions
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          onUpload={onUpload}
          onAIAssistant={onAIAssistant}
          onDetailedAnalysis={onDetailedAnalysis}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
