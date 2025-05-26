
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartDataPoint, ChartPeriod } from "@/types/chartTypes";

export function useChartData() {
  const [period, setPeriod] = useState<ChartPeriod>("anual");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Buscar dados reais do Supabase
  const { data: realData = [], isLoading } = useQuery({
    queryKey: ["chartData", period],
    queryFn: async (): Promise<ChartDataPoint[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Buscar métricas do dashboard
      const { data: dashboardMetrics } = await supabase
        .from("dashboard_metrics")
        .select("*")
        .order("period_end", { ascending: true })
        .limit(12);

      // Buscar dados do inventário para calcular estoque atual
      const { data: inventory } = await supabase
        .from("inventory")
        .select("*")
        .eq("user_id", user.id);

      const totalEstoque = inventory?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      // Se temos dados reais do dashboard_metrics, usamos eles
      if (dashboardMetrics && dashboardMetrics.length > 0) {
        return dashboardMetrics.map((metric) => ({
          name: new Date(metric.period_end).toLocaleDateString('pt-BR', { 
            month: 'short',
            year: '2-digit'
          }),
          vendas: Number(metric.total_sales) || 0,
          lucro: Number(metric.net_profit) || 0,
          estoque: Number(metric.inventory_count) || totalEstoque
        }));
      }

      // Dados de fallback apenas se não houver dados reais
      return [
        { name: "Jan/24", vendas: 4000, lucro: 2400, estoque: totalEstoque || 150 },
        { name: "Fev/24", vendas: 3000, lucro: 1398, estoque: totalEstoque || 180 },
        { name: "Mar/24", vendas: 2000, lucro: 9800, estoque: totalEstoque || 200 },
      ];
    },
  });

  // Filtra os dados com base no período selecionado
  const getFilteredData = (): ChartDataPoint[] => {
    if (!realData || realData.length === 0) return [];

    switch (period) {
      case "diario":
        // Para dados diários, simulamos uma semana baseada nos dados mais recentes
        const latestData = realData[realData.length - 1] || { vendas: 0, lucro: 0, estoque: 0 };
        return [
          { name: "Seg", vendas: latestData.vendas * 0.15, lucro: latestData.lucro * 0.15, estoque: latestData.estoque },
          { name: "Ter", vendas: latestData.vendas * 0.18, lucro: latestData.lucro * 0.18, estoque: latestData.estoque },
          { name: "Qua", vendas: latestData.vendas * 0.12, lucro: latestData.lucro * 0.12, estoque: latestData.estoque },
          { name: "Qui", vendas: latestData.vendas * 0.16, lucro: latestData.lucro * 0.16, estoque: latestData.estoque },
          { name: "Sex", vendas: latestData.vendas * 0.20, lucro: latestData.lucro * 0.20, estoque: latestData.estoque },
          { name: "Sáb", vendas: latestData.vendas * 0.12, lucro: latestData.lucro * 0.12, estoque: latestData.estoque },
          { name: "Dom", vendas: latestData.vendas * 0.07, lucro: latestData.lucro * 0.07, estoque: latestData.estoque },
        ];
      case "mensal":
        // Dados do último mês disponível
        return realData.slice(-1);
      case "trimestral":
        // Dados dos últimos 3 meses
        return realData.slice(-3);
      case "anual":
      default:
        // Dados do ano completo
        return realData;
    }
  };

  return {
    period,
    setPeriod,
    chartType, 
    setChartType,
    displayData: getFilteredData(),
    isLoading
  };
}
