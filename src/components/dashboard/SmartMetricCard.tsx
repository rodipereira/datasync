
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain,
  Zap
} from "lucide-react";

interface SmartMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  prediction?: string;
  insights: string[];
}

interface SmartMetricCardProps {
  metric: SmartMetric;
  isSelected: boolean;
  onClick: () => void;
}

const SmartMetricCard: React.FC<SmartMetricCardProps> = ({ metric, isSelected, onClick }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
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
  );
};

export default SmartMetricCard;
