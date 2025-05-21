
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

// Full year data
const fullData = [
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

// Daily data - sample for a week (simplified)
const dailyData = [
  { name: "Seg", vendas: 500, lucro: 300, estoque: 2400 },
  { name: "Ter", vendas: 650, lucro: 420, estoque: 2350 },
  { name: "Qua", vendas: 420, lucro: 280, estoque: 2300 },
  { name: "Qui", vendas: 580, lucro: 350, estoque: 2280 },
  { name: "Sex", vendas: 750, lucro: 480, estoque: 2220 },
  { name: "Sáb", vendas: 850, lucro: 520, estoque: 2200 },
  { name: "Dom", vendas: 300, lucro: 180, estoque: 2180 },
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
  const [chartType, setChartType] = useState("line");

  // Filter data based on the selected period
  const getFilteredData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    
    switch (period) {
      case "diario":
        // Daily data (show the week)
        return dailyData;
      case "mensal":
        // Last month data (just show the current month)
        return [fullData[currentMonth]];
      case "trimestral":
        // Last 3 months data
        const startMonth = currentMonth >= 2 ? currentMonth - 2 : (currentMonth + 12 - 2) % 12;
        const quarterData = [];
        
        for (let i = 0; i < 3; i++) {
          const monthIndex = (startMonth + i) % 12;
          quarterData.push(fullData[monthIndex]);
        }
        return quarterData;
      case "anual":
      default:
        // Full year data
        return fullData;
    }
  };

  const displayData = getFilteredData();

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
              value={period} 
              className="w-[320px]" 
              onValueChange={setPeriod}
            >
              <TabsList className="bg-secondary/50">
                <TabsTrigger 
                  value="diario" 
                  className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
                >
                  Diário
                </TabsTrigger>
                <TabsTrigger 
                  value="mensal" 
                  className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
                >
                  Mensal
                </TabsTrigger>
                <TabsTrigger 
                  value="trimestral"
                  className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
                >
                  Trimestral
                </TabsTrigger>
                <TabsTrigger 
                  value="anual"
                  className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
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
          <Tabs defaultValue="line" value={chartType} onValueChange={setChartType}>
            <TabsList className="mb-4 bg-secondary/50">
              <TabsTrigger 
                value="line"
                className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
              >
                Linha
              </TabsTrigger>
              <TabsTrigger 
                value="bar"
                className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"  
              >
                Barras
              </TabsTrigger>
            </TabsList>
            <TabsContent value="line" className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <LineChart data={displayData}>
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
                <BarChart data={displayData}>
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
