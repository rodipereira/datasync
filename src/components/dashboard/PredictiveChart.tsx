
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PredictiveChart = () => {
  const chartData = [
    { month: 'Jan', valor: 4000, predicao: 4200 },
    { month: 'Fev', valor: 3000, predicao: 3800 },
    { month: 'Mar', valor: 5000, predicao: 5200 },
    { month: 'Abr', valor: 4500, predicao: 4800 },
    { month: 'Mai', valor: 6000, predicao: 6300 },
    { month: 'Jun', valor: null, predicao: 6800 },
    { month: 'Jul', valor: null, predicao: 7200 },
  ];

  return (
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
  );
};

export default PredictiveChart;
