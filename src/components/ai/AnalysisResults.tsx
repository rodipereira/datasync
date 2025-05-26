
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb,
  BarChart3
} from "lucide-react";

interface AnalysisResult {
  type: 'insight' | 'recommendation' | 'alert' | 'prediction';
  title: string;
  content: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

interface AnalysisResultsProps {
  analysis: AnalysisResult[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'insight': return <Lightbulb className="h-4 w-4" />;
      case 'recommendation': return <TrendingUp className="h-4 w-4" />;
      case 'prediction': return <BarChart3 className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'insight': return 'text-blue-400';
      case 'recommendation': return 'text-green-400';
      case 'prediction': return 'text-purple-400';
      case 'alert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (analysis.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
        <Zap className="h-5 w-5 text-yellow-400" />
        Resultados da Análise
      </h3>
      
      {analysis.map((result, index) => (
        <Card key={index} className="border-l-4 border-l-purple-500 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={getColor(result.type)}>
                  {getIcon(result.type)}
                </span>
                <h4 className="font-medium text-white">{result.title}</h4>
                <Badge 
                  variant={result.impact === 'high' ? 'destructive' : 
                          result.impact === 'medium' ? 'default' : 'secondary'}
                  className={result.impact === 'high' ? 'bg-red-600' : 
                            result.impact === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'}
                >
                  {result.impact === 'high' ? 'Alto Impacto' : 
                   result.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                </Badge>
              </div>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {result.confidence}% confiança
              </Badge>
            </div>
            
            <p className="text-gray-300">{result.content}</p>
            
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                Ver Detalhes
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Aplicar Sugestão
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalysisResults;
