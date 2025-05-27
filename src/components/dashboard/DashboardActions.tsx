
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PresetDateRangePicker } from "@/components/ui/date-range-picker";
import { ArrowUpRight, Bot, Calendar, Upload } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DashboardActionsProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onUpload: () => void;
  onAIAssistant: () => void;
  onDetailedAnalysis: () => void;
}

const DashboardActions = ({
  dateRange,
  onDateRangeChange,
  onUpload,
  onAIAssistant,
  onDetailedAnalysis
}: DashboardActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Filtro de Data */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Período
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtro de Período</SheetTitle>
            <SheetDescription>
              Selecione um período para filtrar os dados do dashboard
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <PresetDateRangePicker
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <Button 
        onClick={onUpload}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Upload
      </Button>
      
      <Button 
        onClick={onAIAssistant}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Bot className="h-4 w-4" />
        Assistente IA
      </Button>
      
      <Button 
        onClick={onDetailedAnalysis}
        className="flex items-center gap-2"
      >
        Análise Detalhada
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DashboardActions;
