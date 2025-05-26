
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target } from "lucide-react";

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

  return (
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
          {metric.insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Target className="h-4 w-4 text-primary mt-0.5" />
              <span className="text-sm">{insight}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
