
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useChartData } from "@/hooks/useChartData";
import { chartConfig } from "@/data/chartData";
import { LineChartDisplay } from "@/components/charts/LineChartDisplay";
import { BarChartDisplay } from "@/components/charts/BarChartDisplay";
import { PeriodSelector } from "@/components/charts/PeriodSelector";
import { ChartTypeSelector } from "@/components/charts/ChartTypeSelector";

const DashboardChart = () => {
  const { period, setPeriod, chartType, setChartType, displayData } = useChartData();

  return (
    <Card className="dashboard-chart">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold text-white">Análise de Desempenho</CardTitle>
            <CardDescription className="text-gray-300">
              Visualize os principais indicadores de desempenho
            </CardDescription>
          </div>
          <div>
            <PeriodSelector 
              period={period} 
              onPeriodChange={setPeriod} 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ChartTypeSelector 
            chartType={chartType} 
            onChartTypeChange={setChartType}
          />
          
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
