
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import NavBar from "@/components/NavBar";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardChart from "@/components/DashboardChart";
import FileHistory from "@/components/FileHistory";
import EmployeeList from "@/components/EmployeeList";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeMetrics from "@/components/EmployeeMetrics";
import StockAnalysis from "@/components/stock/StockAnalysis";
import SmartDashboard from "@/components/dashboard/SmartDashboard";
import DataAnalyzer from "@/components/ai/DataAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Bot, 
  Calendar, 
  Upload, 
  Brain,
  Sparkles
} from "lucide-react";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { PresetDateRangePicker } from "@/components/ui/date-range-picker";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [activeEmployeeTab, setActiveEmployeeTab] = useState("list");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [dashboardMode, setDashboardMode] = useState<"classic" | "smart">("smart");

  const handleDetailedAnalysis = () => {
    navigate("/detailed-analysis");
  };

  const handleUpload = () => {
    navigate("/upload");
  };
  
  const handleAIAssistant = () => {
    navigate("/ai-assistant");
  };

  const handleSelectEmployee = (id: string | null) => {
    setSelectedEmployeeId(id);
    if (id) {
      setActiveEmployeeTab("metrics");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header reorganizado e simplificado */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold accent-text">Dashboard Inteligente</h1>
            <p className="text-muted-foreground mt-1">
              Análise avançada com IA e insights personalizados
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Seletor de Modo Dashboard */}
            <div className="flex bg-secondary/20 rounded-lg p-1">
              <Button
                variant={dashboardMode === "classic" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDashboardMode("classic")}
              >
                Clássico
              </Button>
              <Button
                variant={dashboardMode === "smart" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDashboardMode("smart")}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                Inteligente
              </Button>
            </div>

            {/* Filtro de Data */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Período
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtro de Período</SheetTitle>
                  <SheetDescription>
                    Selecione um período para filtrar os dados do dashboard
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <PresetDateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                </div>
              </SheetContent>
            </Sheet>
            
            <Button 
              onClick={handleUpload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            
            <Button 
              onClick={handleAIAssistant}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Bot className="h-4 w-4" />
              Assistente IA
            </Button>
            
            <Button 
              onClick={handleDetailedAnalysis}
              className="flex items-center gap-2"
            >
              Análise Detalhada
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Análise com IA - Seção melhorada */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Análise Inteligente</h2>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Brain className="h-4 w-4 mr-2" />
                    Abrir Analisador IA
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Análise Inteligente de Dados
                    </DialogTitle>
                  </DialogHeader>
                  <DataAnalyzer />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Dashboard Inteligente ou Clássico */}
          {dashboardMode === "smart" ? (
            <SmartDashboard dateRange={dateRange} />
          ) : (
            <DashboardMetrics dateRange={dateRange} />
          )}
          
          {/* Gráficos lado a lado com melhor espaçamento */}
          <div className="grid gap-8 lg:grid-cols-2">
            <DashboardChart />
            
            <ChartContainer 
              title="Análise de Estoque" 
              description="Visão geral da situação atual do estoque"
              className="h-full"
            >
              <div className="h-[calc(100%-88px)]">
                <StockAnalysis className="h-full" />
              </div>
            </ChartContainer>
          </div>
          
          {/* Gerenciamento de funcionários */}
          <ChartContainer
            title="Gerenciamento de Funcionários"
            description="Cadastre e gerencie a equipe"
          >
            <Tabs value={activeEmployeeTab} onValueChange={setActiveEmployeeTab}>
              <TabsList className="mb-6 bg-secondary/50">
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-primary/80"
                >
                  Lista de Funcionários
                </TabsTrigger>
                <TabsTrigger
                  value="add"
                  className="data-[state=active]:bg-primary/80"
                >
                  Adicionar Funcionário
                </TabsTrigger>
                <TabsTrigger
                  value="metrics"
                  className="data-[state=active]:bg-primary/80"
                  disabled={!selectedEmployeeId}
                >
                  Métricas Individuais
                </TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="pt-4">
                <EmployeeList onSelectEmployee={handleSelectEmployee} />
              </TabsContent>
              <TabsContent value="add" className="pt-4">
                <div className="max-w-md mx-auto">
                  <EmployeeForm 
                    onSaved={() => {
                      setActiveEmployeeTab("list");
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="metrics" className="pt-4">
                {selectedEmployeeId && (
                  <EmployeeMetrics employeeId={selectedEmployeeId} />
                )}
              </TabsContent>
            </Tabs>
          </ChartContainer>
          
          {/* Histórico de Arquivos */}
          <ChartContainer
            title="Histórico de Arquivos"
            description="Arquivos enviados e suas análises"
          >
            <FileHistory />
          </ChartContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
