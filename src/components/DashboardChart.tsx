
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useChartData } from "@/hooks/useChartData";
import { chartConfig } from "@/data/chartData";
import { LineChartDisplay } from "@/components/charts/LineChartDisplay";
import { BarChartDisplay } from "@/components/charts/BarChartDisplay";
import { PeriodSelector } from "@/components/charts/PeriodSelector";
import { ChartTypeSelector } from "@/components/charts/ChartTypeSelector";
import { ChartContainer } from "@/components/charts/ChartContainer";

const DashboardChart = () => {
  const { period, setPeriod, chartType, setChartType, displayData, isLoading } = useChartData();

  if (isLoading) {
    return (
      <ChartContainer
        title="Análise de Desempenho"
        description="Carregando dados..."
        headerContent={
          <PeriodSelector 
            period={period} 
            onPeriodChange={setPeriod} 
          />
        }
      >
        <div className="h-[300px] mt-4 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Carregando dados...</div>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      title="Análise de Desempenho"
      description="Visualize os principais indicadores de desempenho baseados em dados reais"
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
        
        {displayData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p>Nenhum dado disponível para o período selecionado</p>
              <p className="text-sm mt-2">Adicione dados de métricas para visualizar o gráfico</p>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </ChartContainer>
  );
};

export default DashboardChart;
