
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartPeriod } from "@/types/chartTypes";

interface PeriodSelectorProps {
  period: ChartPeriod;
  onPeriodChange: (value: ChartPeriod) => void;
}

export const PeriodSelector = ({ period, onPeriodChange }: PeriodSelectorProps) => {
  return (
    <Tabs 
      value={period} 
      className="w-[320px]" 
      onValueChange={(value) => onPeriodChange(value as ChartPeriod)}
    >
      <TabsList className="bg-secondary/50">
        <TabsTrigger 
          value="diario" 
          className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
        >
          Diário
        </TabsTrigger>
        <TabsTrigger 
          value="mensal" 
          className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
        >
          Mensal
        </TabsTrigger>
        <TabsTrigger 
          value="trimestral"
          className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
        >
          Trimestral
        </TabsTrigger>
        <TabsTrigger 
          value="anual"
          className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
        >
          Anual
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
