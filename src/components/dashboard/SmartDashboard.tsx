
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SmartMetricCard from "./SmartMetricCard";
import InsightsPanel from "./InsightsPanel";
import PredictiveChart from "./PredictiveChart";
import DistributionChart from "./DistributionChart";
import AIRecommendations from "./AIRecommendations";

interface SmartMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  prediction?: string;
  insights: string[];
}

interface SmartDashboardProps {
  dateRange?: any;
}

const SmartDashboard: React.FC<SmartDashboardProps> = ({ dateRange }) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Dados inteligentes do dashboard
  const { data: smartMetrics, isLoading } = useQuery({
    queryKey: ["smartMetrics", dateRange],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Buscar dados de inventário
      const { data: inventory } = await supabase
        .from("inventory")
        .select("*")
        .eq("user_id", user.id);

      // Buscar dados de funcionários
      const { data: employees } = await supabase
        .from("employees")
        .select("*")
        .eq("user_id", user.id);

      // Gerar métricas inteligentes
      const totalItems = inventory?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      const lowStockItems = inventory?.filter(item => item.quantity <= item.minimum_level).length || 0;
      const stockValue = inventory?.reduce((sum, item) => sum + (item.quantity * 50), 0) || 0;
      const employeeCount = employees?.length || 0;

      const metrics: SmartMetric[] = [
        {
          id: "stock-health",
          title: "Saúde do Estoque",
          value: `${Math.round((1 - lowStockItems / (inventory?.length || 1)) * 100)}%`,
          change: -5,
          trend: lowStockItems > 0 ? 'down' : 'up',
          prediction: "Previsão: 3 itens precisarão de reposição em 7 dias",
          insights: [
            lowStockItems > 0 ? `${lowStockItems} itens com estoque baixo` : "Todos os itens em bom nível",
            "Categoria 'Eletrônicos' tem maior rotatividade",
            "Otimização sugerida: aumento de 15% no pedido mínimo"
          ]
        },
        {
          id: "inventory-value",
          title: "Valor do Inventário",
          value: `R$ ${stockValue.toLocaleString()}`,
          change: 12,
          trend: 'up',
          prediction: "Crescimento estimado: +8% este mês",
          insights: [
            "Aumento de 12% comparado ao mês passado",
            "ROI projetado de 15% nos próximos 3 meses",
            "Categoria com maior valor: Eletrônicos"
          ]
        },
        {
          id: "team-efficiency",
          title: "Eficiência da Equipe",
          value: `${employeeCount} funcionários`,
          change: 8,
          trend: 'up',
          prediction: "Produtividade: +20% com treinamento",
          insights: [
            "Equipe cresceu 8% este trimestre",
            "Tempo médio de processamento: 2.3 min",
            "Sugestão: Implementar automação para tarefas repetitivas"
          ]
        },
        {
          id: "performance-score",
          title: "Score de Performance",
          value: "87/100",
          change: 5,
          trend: 'up',
          prediction: "Meta 95/100 alcançável em 30 dias",
          insights: [
            "Melhoria de 5 pontos este mês",
            "Área forte: Gestão de estoque",
            "Área de oportunidade: Tempo de resposta"
          ]
        }
      ];

      return metrics;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded h-20 p-6"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Inteligentes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {smartMetrics?.map((metric) => (
          <SmartMetricCard
            key={metric.id}
            metric={metric}
            isSelected={selectedMetric === metric.id}
            onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
          />
        ))}
      </div>

      {/* Insights Detalhados */}
      {selectedMetric && smartMetrics && (
        <InsightsPanel selectedMetric={selectedMetric} metrics={smartMetrics} />
      )}

      {/* Gráficos Preditivos */}
      <div className="grid gap-6 md:grid-cols-2">
        <PredictiveChart />
        <DistributionChart />
      </div>

      {/* Recomendações da IA */}
      <AIRecommendations />
    </div>
  );
};

export default SmartDashboard;
