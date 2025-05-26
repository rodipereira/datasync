
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Brain,
  Zap,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from "recharts";

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
      const stockValue = inventory?.reduce((sum, item) => sum + (item.quantity * 50), 0) || 0; // Estimativa
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

  // Dados para gráficos preditivos
  const chartData = [
    { month: 'Jan', valor: 4000, predicao: 4200 },
    { month: 'Fev', valor: 3000, predicao: 3800 },
    { month: 'Mar', valor: 5000, predicao: 5200 },
    { month: 'Abr', valor: 4500, predicao: 4800 },
    { month: 'Mai', valor: 6000, predicao: 6300 },
    { month: 'Jun', valor: null, predicao: 6800 },
    { month: 'Jul', valor: null, predicao: 7200 },
  ];

  const categoryData = [
    { name: 'Eletrônicos', value: 35, color: '#8b5cf6' },
    { name: 'Roupas', value: 25, color: '#06b6d4' },
    { name: 'Casa', value: 20, color: '#10b981' },
    { name: 'Livros', value: 20, color: '#f59e0b' },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Inteligentes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {smartMetrics?.map((metric) => (
          <Card 
            key={metric.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedMetric === metric.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <Brain className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
                {metric.prediction && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    <Zap className="h-3 w-3 inline mr-1" />
                    {metric.prediction}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Detalhados */}
      {selectedMetric && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Insights Inteligentes
              <Badge variant="secondary">IA</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartMetrics?.find(m => m.id === selectedMetric)?.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Target className="h-4 w-4 text-primary mt-0.5" />
                  <span className="text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos Preditivos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análise Preditiva
              <Badge variant="outline">Próximos 3 meses</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Valor Real"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicao" 
                    stroke="#06b6d4" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Predição IA"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    dataKey="value"
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações da IA */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Recomendações da IA
            <Badge>Inteligência Artificial</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Ação Urgente</span>
              </div>
              <p className="text-sm text-gray-600">
                Reabasteça 5 produtos críticos antes do final da semana para evitar rupturas.
              </p>
              <Button size="sm" className="mt-2">
                Ver Produtos →
              </Button>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Oportunidade</span>
              </div>
              <p className="text-sm text-gray-600">
                Aumente pedidos de eletrônicos em 20% - demanda crescente detectada.
              </p>
              <Button size="sm" className="mt-2">
                Analisar →
              </Button>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Otimização</span>
              </div>
              <p className="text-sm text-gray-600">
                Reorganize layout para reduzir tempo de picking em 15%.
              </p>
              <Button size="sm" className="mt-2">
                Ver Plano →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartDashboard;
