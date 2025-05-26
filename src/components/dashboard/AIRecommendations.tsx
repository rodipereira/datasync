
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  AlertTriangle, 
  TrendingUp, 
  Target
} from "lucide-react";

const AIRecommendations = () => {
  return (
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
  );
};

export default AIRecommendations;
