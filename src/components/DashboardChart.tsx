
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useChartData } from "@/hooks/useChartData";
import { chartConfig } from "@/data/chartData";
import { LineChartDisplay } from "@/components/charts/LineChartDisplay";
import { BarChartDisplay } from "@/components/charts/BarChartDisplay";
import { PeriodSelector } from "@/components/charts/PeriodSelector";
import { ChartTypeSelector } from "@/components/charts/ChartTypeSelector";
import { ChartContainer } from "@/components/charts/ChartContainer";

const DashboardChart = () => {
  const { period, setPeriod, chartType, setChartType, displayData } = useChartData();

  return (
    <ChartContainer
      title="Análise de Desempenho"
      description="Visualize os principais indicadores de desempenho"
      headerContent={
        <PeriodSelector 
          period={period} 
          onPeriodChange={setPeriod} 
        />
      }
    >
      <div className="h-[300px] mt-4">
        <ChartTypeSelector 
          chartType={chartType} 
          onChartTypeChange={setChartType}
        />
        
        <Tabs value={chartType}>
          <TabsContent value="line" className="h-[300px]">
            <LineChartDisplay 
              data={displayData} 
              config={chartConfig} 
            />
          </TabsContent>
          
          <TabsContent value="bar" className="h-[300px]">
            <BarChartDisplay 
              data={displayData} 
              config={chartConfig} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </ChartContainer>
  );
};

export default DashboardChart;
