
import DashboardChart from "@/components/DashboardChart";
import StockAnalysis from "@/components/stock/StockAnalysis";
import { ChartContainer } from "@/components/charts/ChartContainer";

const ChartsSection = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <DashboardChart />
      
      <ChartContainer 
        title="Análise de Estoque" 
        description="Visão geral da situação atual do estoque"
        className="h-full"
      >
        <div className="h-[calc(100%-88px)]">
          <StockAnalysis className="h-full" />
        </div>
      </ChartContainer>
    </div>
  );
};

export default ChartsSection;
