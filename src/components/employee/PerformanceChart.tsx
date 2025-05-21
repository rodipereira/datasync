
import React from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface MetricData {
  month: string;
  revenue: number;
  clients_acquired: number;
  employees_hired: number;
}

interface PerformanceChartProps {
  metrics: MetricData[];
}

const PerformanceChart = ({ metrics }: PerformanceChartProps) => {
  const formatChartData = () => {
    // Ordenar por data (mais antiga para mais recente)
    return [...metrics]
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .map((metric) => ({
        name: format(new Date(metric.month), "MMM/yy", { locale: pt }),
        receita: metric.revenue,
        clientes: metric.clients_acquired,
        funcionarios: metric.employees_hired,
      }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Evolução de Desempenho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formatChartData()}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, "dataMax + 1"]}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="receita"
                name="Receita (R$)"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="clientes"
                name="Clientes"
                stroke="#82ca9d"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="funcionarios"
                name="Funcionários"
                stroke="#ffc658"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
