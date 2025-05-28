
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.name === 'Receita (R$)' 
                ? `R$ ${entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-white">Evolução de Desempenho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formatChartData()}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(156, 163, 175, 0.3)"
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, "dataMax + 1"]}
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  color: '#6B7280'
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="receita"
                name="Receita (R$)"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ 
                  fill: "#3B82F6", 
                  strokeWidth: 2,
                  r: 5
                }}
                activeDot={{ 
                  r: 7, 
                  fill: "#3B82F6",
                  strokeWidth: 2,
                  stroke: "#fff"
                }}
                connectNulls={true}
                tension={0.4}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="clientes"
                name="Clientes"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ 
                  fill: "#10B981", 
                  strokeWidth: 2,
                  r: 5
                }}
                activeDot={{ 
                  r: 7, 
                  fill: "#10B981",
                  strokeWidth: 2,
                  stroke: "#fff"
                }}
                connectNulls={true}
                tension={0.4}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="funcionarios"
                name="Funcionários"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ 
                  fill: "#F59E0B", 
                  strokeWidth: 2,
                  r: 5
                }}
                activeDot={{ 
                  r: 7, 
                  fill: "#F59E0B",
                  strokeWidth: 2,
                  stroke: "#fff"
                }}
                connectNulls={true}
                tension={0.4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
