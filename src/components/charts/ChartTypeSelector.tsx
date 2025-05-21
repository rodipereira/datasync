
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartType } from "@/types/chartTypes";

interface ChartTypeSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (value: ChartType) => void;
}

export const ChartTypeSelector = ({ chartType, onChartTypeChange }: ChartTypeSelectorProps) => {
  return (
    <Tabs 
      value={chartType} 
      onValueChange={(value) => onChartTypeChange(value as ChartType)}
    >
      <TabsList className="mb-4 bg-secondary/50">
        <TabsTrigger 
          value="line"
          className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
        >
          Linha
        </TabsTrigger>
        <TabsTrigger 
          value="bar"
          className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"  
        >
          Barras
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
