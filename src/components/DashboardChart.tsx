
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", vendas: 4000, lucro: 2400, estoque: 2400 },
  { name: "Fev", vendas: 3000, lucro: 1398, estoque: 2210 },
  { name: "Mar", vendas: 2000, lucro: 9800, estoque: 2290 },
  { name: "Abr", vendas: 2780, lucro: 3908, estoque: 2000 },
  { name: "Mai", vendas: 1890, lucro: 4800, estoque: 2181 },
  { name: "Jun", vendas: 2390, lucro: 3800, estoque: 2500 },
  { name: "Jul", vendas: 3490, lucro: 4300, estoque: 2100 },
  { name: "Ago", vendas: 4000, lucro: 2400, estoque: 2400 },
  { name: "Set", vendas: 3000, lucro: 1398, estoque: 2210 },
  { name: "Out", vendas: 2000, lucro: 9800, estoque: 2290 },
  { name: "Nov", vendas: 2780, lucro: 3908, estoque: 2000 },
  { name: "Dez", vendas: 1890, lucro: 4800, estoque: 2181 },
];

const DashboardChart = () => {
  const [period, setPeriod] = useState("anual");

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Análise de Desempenho</CardTitle>
            <CardDescription>
              Visualize os principais indicadores de desempenho
            </CardDescription>
          </div>
          <div>
            <Tabs defaultValue="anual" className="w-[260px]" onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="mensal">Mensal</TabsTrigger>
                <TabsTrigger value="trimestral">Trimestral</TabsTrigger>
                <TabsTrigger value="anual">Anual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <Tabs defaultValue="line">
            <TabsList className="mb-4">
              <TabsTrigger value="line">Linha</TabsTrigger>
              <TabsTrigger value="bar">Barras</TabsTrigger>
            </TabsList>
            <TabsContent value="line" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lucro"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="estoque"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="bar" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vendas" fill="#3b82f6" />
                  <Bar dataKey="lucro" fill="#10b981" />
                  <Bar dataKey="estoque" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
