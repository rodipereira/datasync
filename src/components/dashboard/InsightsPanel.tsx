
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Target, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

interface SmartMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  prediction?: string;
  insights: string[];
}

interface InsightsPanelProps {
  selectedMetric: string;
  metrics: SmartMetric[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ selectedMetric, metrics }) => {
  const metric = metrics.find(m => m.id === selectedMetric);

  if (!metric) return null;

  const getInsightIcon = (index: number) => {
    const icons = [Target, TrendingUp, AlertTriangle, Lightbulb];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />
          <span>Insights Inteligentes - {metric.title}</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            IA
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Predição em destaque */}
        {metric.prediction && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Previsão IA</span>
            </div>
            <p className="text-sm text-blue-700">{metric.prediction}</p>
          </div>
        )}

        {/* Lista de insights */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Análises Detalhadas
          </h4>
          {metric.insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
              {getInsightIcon(index)}
              <div className="flex-1">
                <span className="text-sm leading-relaxed text-gray-700">{insight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ações sugeridas */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              Ver Relatório Completo
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Exportar Dados
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Configurar Alerta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
