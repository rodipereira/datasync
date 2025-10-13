import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2,
  ArrowUpDown,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
}

const BusinessIntelligence = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("last_30_days");
  const [selectedKPI, setSelectedKPI] = useState("revenue");

  // Sample AI-generated insights
  const aiInsights: AIInsight[] = [
    {
      id: "1",
      title: "Oportunidade de Crescimento Detectada",
      description: "Análise de padrões indica aumento de 35% na demanda por produtos eletrônicos nas próximas 3 semanas. Recomenda-se aumentar estoque.",
      type: "opportunity",
      impact: "high",
      confidence: 87,
      actionable: true
    },
    {
      id: "2", 
      title: "Risco de Ruptura de Estoque",
      description: "5 produtos críticos estão com previsão de esgotamento em 7-10 dias baseado no padrão de consumo atual.",
      type: "risk",
      impact: "high",
      confidence: 92,
      actionable: true
    },
    {
      id: "3",
      title: "Tendência de Sazonalidade",
      description: "Padrão sazonal identificado: vendas aumentam 23% durante as sextas-feiras. Considere promoções estratégicas.",
      type: "trend",
      impact: "medium",
      confidence: 78,
      actionable: true
    },
    {
      id: "4",
      title: "Otimização de Processos",
      description: "Funcionários levam 15% mais tempo em tarefas manuais. Automação pode reduzir custos operacionais em R$ 2.400/mês.",
      type: "recommendation",
      impact: "medium",
      confidence: 84,
      actionable: true
    }
  ];

  // Sample predictive data
  const predictiveData = [
    { month: 'Jan', atual: 45000, previsto: 48000, otimista: 52000, pessimista: 44000 },
    { month: 'Fev', atual: 52000, previsto: 55000, otimista: 60000, pessimista: 50000 },
    { month: 'Mar', atual: 48000, previsto: 51000, otimista: 56000, pessimista: 46000 },
    { month: 'Abr', atual: null, previsto: 54000, otimista: 59000, pessimista: 49000 },
    { month: 'Mai', atual: null, previsto: 58000, otimista: 63000, pessimista: 53000 },
    { month: 'Jun', atual: null, previsto: 61000, otimista: 67000, pessimista: 55000 },
  ];

  // Sample market analysis data
  const marketAnalysis = [
    { categoria: 'Eletrônicos', participacao: 35, crescimento: 12, oportunidade: 'alta' },
    { categoria: 'Roupas', participacao: 25, crescimento: 8, oportunidade: 'média' },
    { categoria: 'Casa & Decoração', participacao: 20, crescimento: 15, oportunidade: 'alta' },
    { categoria: 'Livros', participacao: 12, crescimento: 3, oportunidade: 'baixa' },
    { categoria: 'Esportes', participacao: 8, crescimento: 18, oportunidade: 'alta' },
  ];

  // Sample performance radar data
  const performanceRadar = [
    { metric: 'Vendas', A: 88, B: 75, fullMark: 100 },
    { metric: 'Estoque', A: 92, B: 85, fullMark: 100 },
    { metric: 'Atendimento', A: 79, B: 90, fullMark: 100 },
    { metric: 'Qualidade', A: 85, B: 88, fullMark: 100 },
    { metric: 'Eficiência', A: 73, B: 70, fullMark: 100 },
    { metric: 'Inovação', A: 81, B: 65, fullMark: 100 },
  ];

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'trend': return <Activity className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'risk': return 'text-red-600 bg-red-100';
      case 'trend': return 'text-blue-600 bg-blue-100';
      case 'recommendation': return 'text-purple-600 bg-purple-100';
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Business Intelligence & Analytics Avançado
            </CardTitle>
            <div className="flex gap-4">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last_year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* AI Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Insights da Inteligência Artificial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {aiInsights.map((insight) => (
              <div 
                key={insight.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getImpactColor(insight.impact)}>
                      Impacto {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'}
                    </Badge>
                    <Badge variant="outline">
                      {insight.confidence}% confiança
                    </Badge>
                    {insight.actionable && (
                      <Button size="sm" className="text-xs">
                        Implementar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="predictions">Predições</TabsTrigger>
          <TabsTrigger value="market">Análise de Mercado</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Preditiva - Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value?.toLocaleString()}`} />
                    <Area 
                      type="monotone" 
                      dataKey="otimista" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.1}
                      name="Cenário Otimista"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pessimista" 
                      stackId="1"
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.1}
                      name="Cenário Pessimista"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="atual" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      name="Valor Atual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previsto" 
                      stroke="#06b6d4" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Predição IA"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Participação de Mercado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {marketAnalysis.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <div>
                        <span className="font-medium">{item.categoria}</span>
                        <p className="text-sm text-muted-foreground">
                          {item.participacao}% do mercado • +{item.crescimento}% crescimento
                        </p>
                      </div>
                    </div>
                    <Badge className={
                      item.oportunidade === 'alta' ? 'bg-green-100 text-green-800' :
                      item.oportunidade === 'média' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      Oportunidade {item.oportunidade}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Radar de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar 
                      name="Atual" 
                      dataKey="A" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      name="Meta" 
                      dataKey="B" 
                      stroke="#06b6d4" 
                      fill="#06b6d4" 
                      fillOpacity={0.3} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Tendências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🔥 Tendência em Alta</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Produtos sustentáveis estão crescendo 45% ao mês
                    </p>
                    <Badge className="bg-green-100 text-green-800">+45% crescimento</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📈 Oportunidade Emergente</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mercado de acessórios tech com potencial inexplorado
                    </p>
                    <Badge className="bg-blue-100 text-blue-800">Potencial: Alto</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">⚠️ Declínio Detectado</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Categoria livros físicos em declínio de 8%
                    </p>
                    <Badge className="bg-red-100 text-red-800">-8% este mês</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🎯 Recomendação Estratégica</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Focar em produtos de alta margem nos próximos 60 dias
                    </p>
                    <Badge className="bg-purple-100 text-purple-800">ROI Estimado: +25%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligence;