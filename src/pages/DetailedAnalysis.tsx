
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ExportButton, ExportData } from "@/components/ui/export-button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { CalendarRange } from "lucide-react";

const allSalesData = [
  { month: "Jan", vendas: 4000, clientes: 240, lucro: 2400 },
  { month: "Fev", vendas: 3000, clientes: 198, lucro: 1398 },
  { month: "Mar", vendas: 5000, clientes: 320, lucro: 3200 },
  { month: "Abr", vendas: 2780, clientes: 190, lucro: 2000 },
  { month: "Mai", vendas: 1890, clientes: 140, lucro: 1500 },
  { month: "Jun", vendas: 2390, clientes: 200, lucro: 2100 },
  { month: "Jul", vendas: 3490, clientes: 210, lucro: 2300 },
  { month: "Ago", vendas: 4000, clientes: 240, lucro: 2400 },
  { month: "Set", vendas: 3000, clientes: 198, lucro: 1398 },
  { month: "Out", vendas: 5000, clientes: 320, lucro: 3200 },
  { month: "Nov", vendas: 2780, clientes: 190, lucro: 2000 },
  { month: "Dez", vendas: 1890, clientes: 140, lucro: 1500 },
];

const inventoryData = [
  { name: "Produtos A", value: 400 },
  { name: "Produtos B", value: 300 },
  { name: "Produtos C", value: 300 },
  { name: "Produtos D", value: 200 },
  { name: "Outros", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const DetailedAnalysis = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("vendas");
  const [timeRange, setTimeRange] = useState("mensal");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Filter data based on the selected time range
  const getFilteredData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    
    switch (timeRange) {
      case "semanal":
        // Last week data (simplification: just show the current month divided by 4)
        return [allSalesData[currentMonth]].map(item => ({
          ...item,
          vendas: Math.round(item.vendas / 4),
          clientes: Math.round(item.clientes / 4),
          lucro: Math.round(item.lucro / 4)
        }));
      case "mensal":
        // Last month data (just show the current month)
        return [allSalesData[currentMonth]];
      case "trimestral":
        // Last 3 months data
        const startMonth = currentMonth >= 2 ? currentMonth - 2 : (currentMonth + 12 - 2) % 12;
        const quarterData = [];
        
        for (let i = 0; i < 3; i++) {
          const monthIndex = (startMonth + i) % 12;
          quarterData.push(allSalesData[monthIndex]);
        }
        return quarterData;
      case "anual":
      default:
        // Full year data
        return allSalesData;
    }
  };

  const salesData = getFilteredData();
  
  // Prepare export data
  const getExportData = (): ExportData => {
    const columns = ["month", activeCategory];
    const title = `Relatório de ${activeCategory === "vendas" ? "Vendas" : 
                    activeCategory === "lucro" ? "Lucro" : "Clientes"}`;
                    
    return {
      columns,
      data: salesData,
      title
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold accent-text">Análise Detalhada</h1>
            <p className="text-gray-400">Métricas e tendências de desempenho</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Voltar ao Dashboard
            </Button>
            <ExportButton exportData={getExportData()} />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 mb-6">
          <Card className="overflow-hidden border border-primary/20 bg-gradient-to-br from-secondary/80 to-background">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl">Filtrar por Período</CardTitle>
                  <CardDescription>Selecione um intervalo de datas para análise</CardDescription>
                </div>
                <div className="w-full sm:w-auto">
                  <DateRangePicker 
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 grid-cols-1">
          <Card className="shadow-lg border border-primary/20 bg-gradient-to-br from-secondary/80 to-background">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-xl font-bold">Desempenho de Vendas</CardTitle>
                  <CardDescription>Análise de tendências e padrões</CardDescription>
                </div>
                <div className="mt-4 md:mt-0">
                  <Tabs value={timeRange} onValueChange={setTimeRange}>
                    <TabsList>
                      <TabsTrigger value="semanal">Semanal</TabsTrigger>
                      <TabsTrigger value="mensal">Mensal</TabsTrigger>
                      <TabsTrigger value="trimestral">Trimestral</TabsTrigger>
                      <TabsTrigger value="anual">Anual</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mt-4">
                <TabsList className="mb-4">
                  <TabsTrigger value="vendas">Vendas</TabsTrigger>
                  <TabsTrigger value="lucro">Lucro</TabsTrigger>
                  <TabsTrigger value="clientes">Clientes</TabsTrigger>
                </TabsList>
                <TabsContent value="vendas" className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="vendas" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="lucro" className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="lucro" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="clientes" className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clientes" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border border-primary/20 bg-gradient-to-br from-secondary/80 to-background">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Distribuição de Estoque</CardTitle>
                <CardDescription>Categorias de produtos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          
            <Card className="shadow-lg border border-primary/20 bg-gradient-to-br from-secondary/80 to-background">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Comparação de Metas</CardTitle>
                <CardDescription>Performance vs. Projeções</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { categoria: "Vendas", atual: 4000, meta: 4200 },
                        { categoria: "Clientes", atual: 240, meta: 300 },
                        { categoria: "Lucro", atual: 2400, meta: 2800 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoria" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="atual" fill="#8884d8" name="Atual" />
                      <Bar dataKey="meta" fill="#82ca9d" name="Meta" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailedAnalysis;
