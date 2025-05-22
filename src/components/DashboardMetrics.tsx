
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatUtils";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

interface MetricData {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  description: string;
}

interface DashboardMetricsProps {
  dateRange?: DateRange;
}

const DashboardMetrics = ({ dateRange }: DashboardMetricsProps) => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      title: "Vendas Totais",
      value: "...",
      change: "0%",
      positive: true,
      description: "carregando dados"
    },
    {
      title: "Lucro Líquido",
      value: "...",
      change: "0%",
      positive: true,
      description: "carregando dados"
    },
    {
      title: "Itens em Estoque",
      value: "...",
      change: "0%",
      positive: true,
      description: "carregando dados"
    },
    {
      title: "Novos Clientes",
      value: "...",
      change: "0%",
      positive: true,
      description: "carregando dados"
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Buscar os dois meses mais recentes para comparação
        let query = supabase
          .from('dashboard_metrics')
          .select('*')
          .order('period_end', { ascending: false })
          .limit(2);
          
        // Adicionar filtro por data se dateRange estiver definido
        if (dateRange?.from && dateRange?.to) {
          query = query.gte('period_end', dateRange.from.toISOString().split('T')[0])
            .lte('period_end', dateRange.to.toISOString().split('T')[0]);
        }
        
        const { data, error } = await query;

        if (error) throw error;

        if (data && data.length > 0) {
          const currentPeriod = data[0];
          const previousPeriod = data.length > 1 ? data[1] : null;

          // Calcular as variações percentuais
          const calculateChange = (current: number, previous: number | null) => {
            if (!previous || previous === 0) return "0%";
            const change = ((current - previous) / previous) * 100;
            return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
          };

          const updatedMetrics = [
            {
              title: "Vendas Totais",
              value: formatCurrency(currentPeriod.total_sales),
              change: calculateChange(currentPeriod.total_sales, previousPeriod?.total_sales),
              positive: previousPeriod ? currentPeriod.total_sales >= previousPeriod.total_sales : true,
              description: "em relação ao mês passado"
            },
            {
              title: "Lucro Líquido",
              value: formatCurrency(currentPeriod.net_profit),
              change: calculateChange(currentPeriod.net_profit, previousPeriod?.net_profit),
              positive: previousPeriod ? currentPeriod.net_profit >= previousPeriod.net_profit : true,
              description: "em relação ao mês passado"
            },
            {
              title: "Itens em Estoque",
              value: currentPeriod.inventory_count,
              change: calculateChange(currentPeriod.inventory_count, previousPeriod?.inventory_count),
              positive: previousPeriod ? currentPeriod.inventory_count >= previousPeriod.inventory_count : true,
              description: "em relação ao mês passado"
            },
            {
              title: "Novos Clientes",
              value: currentPeriod.new_customers,
              change: calculateChange(currentPeriod.new_customers, previousPeriod?.new_customers),
              positive: previousPeriod ? currentPeriod.new_customers >= previousPeriod.new_customers : true,
              description: "em relação ao mês passado"
            }
          ];

          setMetrics(updatedMetrics);
        }
      } catch (error: any) {
        console.error('Erro ao carregar métricas:', error);
        toast.error('Não foi possível carregar os dados das métricas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [dateRange]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="dashboard-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? "..." : metric.value}
            </div>
            <div className="flex items-center pt-1">
              <span className={`flex items-center ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                {metric.positive ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {isLoading ? "..." : metric.change}
              </span>
              <CardDescription className="ml-2 text-gray-400">{metric.description}</CardDescription>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
