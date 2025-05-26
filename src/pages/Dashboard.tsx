
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
import NotificationCenter from "@/components/notifications/NotificationCenter";
import DataAnalyzer from "@/components/ai/DataAnalyzer";
import ThemeCustomizer from "@/components/theme/ThemeCustomizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Bot, 
  Calendar, 
  Upload, 
  Bell, 
  Brain, 
  Palette,
  Sparkles,
  Zap,
  Settings
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
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
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
        {/* Header com controles aprimorados */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold accent-text">Dashboard Inteligente</h1>
            <p className="text-gray-400">Análise avançada com IA e insights personalizados</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
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

            {/* Central de Notificações */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center relative">
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Notificações</span>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[500px]">
                <NotificationCenter />
              </SheetContent>
            </Sheet>

            {/* Analisador de IA */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  <span>Analisar com IA</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Análise Inteligente de Dados</DialogTitle>
                </DialogHeader>
                <DataAnalyzer />
              </DialogContent>
            </Dialog>

            {/* Personalizador de Tema */}
            <Dialog open={showThemeCustomizer} onOpenChange={setShowThemeCustomizer}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  <span>Temas</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />
              </DialogContent>
            </Dialog>

            {/* Filtro de Data */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Filtrar por Data</span>
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
              className="bg-primary hover:bg-primary/90 flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              <span>Upload</span>
            </Button>
            <Button 
              onClick={handleAIAssistant}
              className="bg-primary hover:bg-primary/90 flex items-center"
            >
              <Bot className="h-4 w-4 mr-2" />
              <span>Assistente IA</span>
            </Button>
            <Button 
              onClick={handleDetailedAnalysis}
              className="bg-primary hover:bg-primary/90 flex items-center"
            >
              <span className="mr-1">Análise Detalhada</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Dashboard Inteligente ou Clássico */}
          {dashboardMode === "smart" ? (
            <SmartDashboard dateRange={dateRange} />
          ) : (
            <DashboardMetrics dateRange={dateRange} />
          )}
          
          <div className="grid gap-6 md:grid-cols-2">
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
              <TabsList className="mb-4 bg-secondary/50">
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-primary/80"
                >
                  Lista
                </TabsTrigger>
                <TabsTrigger
                  value="add"
                  className="data-[state=active]:bg-primary/80"
                >
                  Adicionar
                </TabsTrigger>
                <TabsTrigger
                  value="metrics"
                  className="data-[state=active]:bg-primary/80"
                  disabled={!selectedEmployeeId}
                >
                  Métricas
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
