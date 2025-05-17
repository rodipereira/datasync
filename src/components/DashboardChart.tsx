
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
    color: "#2563eb" // Blue
  },
  lucro: {
    label: "Lucro",
    color: "#10b981" // Green
  },
  estoque: {
    label: "Estoque",
    color: "#8b5cf6" // Purple
  }
};

const DashboardChart = () => {
  const [period, setPeriod] = useState("anual");

  return (
    <Card className="dashboard-chart">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold text-white">Análise de Desempenho</CardTitle>
            <CardDescription className="text-gray-300">
              Visualize os principais indicadores de desempenho
            </CardDescription>
          </div>
          <div>
            <Tabs 
              defaultValue="anual" 
              className="w-[260px]" 
              onValueChange={setPeriod}
            >
              <TabsList className="bg-secondary/50">
                <TabsTrigger 
                  value="mensal" 
                  className="data-[state=active]:bg-primary/80"
                >
                  Mensal
                </TabsTrigger>
                <TabsTrigger 
                  value="trimestral"
                  className="data-[state=active]:bg-primary/80"
                >
                  Trimestral
                </TabsTrigger>
                <TabsTrigger 
                  value="anual"
                  className="data-[state=active]:bg-primary/80"
                >
                  Anual
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <Tabs defaultValue="line">
            <TabsList className="mb-4 bg-secondary/50">
              <TabsTrigger 
                value="line"
                className="data-[state=active]:bg-primary/80"
              >
                Linha
              </TabsTrigger>
              <TabsTrigger 
                value="bar"
                className="data-[state=active]:bg-primary/80"  
              >
                Barras
              </TabsTrigger>
            </TabsList>
            <TabsContent value="line" className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <LineChart data={data}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(255,255,255,0.1)" 
                  />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    stroke="rgba(255,255,255,0.5)"
                  />
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    stroke="rgba(255,255,255,0.5)"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    strokeWidth={2}
                    activeDot={{ r: 8, fill: "#2563eb" }}
                    stroke="#2563eb"
                  />
                  <Line
                    type="monotone"
                    dataKey="lucro"
                    strokeWidth={2}
                    stroke="#10b981"
                  />
                  <Line
                    type="monotone"
                    dataKey="estoque"
                    strokeWidth={2}
                    stroke="#8b5cf6"
                  />
                </LineChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="bar" className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <BarChart data={data}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    stroke="rgba(255,255,255,0.5)"
                  />
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    stroke="rgba(255,255,255,0.5)"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="vendas" radius={[4, 4, 0, 0]} fill="#2563eb" />
                  <Bar dataKey="lucro" radius={[4, 4, 0, 0]} fill="#10b981" />
                  <Bar dataKey="estoque" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
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
