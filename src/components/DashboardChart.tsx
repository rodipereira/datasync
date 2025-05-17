
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
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

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

// Chart configuration for shadcn/ui chart components
const chartConfig = {
  vendas: {
    label: "Vendas",
    color: "#3b82f6" // Blue
  },
  lucro: {
    label: "Lucro",
    color: "#10b981" // Green
  },
  estoque: {
    label: "Estoque",
    color: "#f59e0b" // Amber
  }
};

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
              <ChartContainer config={chartConfig}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lucro"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="estoque"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="bar" className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="vendas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lucro" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="estoque" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
