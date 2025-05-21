
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardChart from "@/components/DashboardChart";
import FileHistory from "@/components/FileHistory";
import EmployeeList from "@/components/EmployeeList";
import EmployeeForm from "@/components/EmployeeForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bot, Upload } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [activeEmployeeTab, setActiveEmployeeTab] = useState("list");

  const handleDetailedAnalysis = () => {
    navigate("/detailed-analysis");
  };

  const handleUpload = () => {
    navigate("/upload");
  };
  
  const handleAIAssistant = () => {
    navigate("/ai-assistant");
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold accent-text">Dashboard</h1>
            <p className="text-gray-400">Visualize e analise os dados do seu negócio</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button 
              variant="outline" 
              onClick={handleUpload}
              className="border-primary/30 bg-primary/10 hover:bg-primary/20"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload de Arquivos
            </Button>
            <Button 
              variant="outline" 
              onClick={handleAIAssistant}
              className="border-primary/30 bg-primary/10 hover:bg-primary/20"
            >
              <Bot className="h-4 w-4 mr-2" />
              Assistente IA
            </Button>
            <Button 
              onClick={handleDetailedAnalysis}
              className="bg-primary hover:bg-primary/90"
            >
              <span className="mr-1">Análise Detalhada</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <DashboardMetrics />
          
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardChart />
            
            <Card className="dashboard-chart">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Análise de Estoque</CardTitle>
                <CardDescription className="text-gray-300">
                  Visão geral da situação atual do estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="niveis">
                  <TabsList className="mb-4 bg-secondary/50">
                    <TabsTrigger
                      value="niveis"
                      className="data-[state=active]:bg-primary/80"
                    >
                      Níveis
                    </TabsTrigger>
                    <TabsTrigger
                      value="categorias"
                      className="data-[state=active]:bg-primary/80"
                    >
                      Categorias
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="niveis">
                    <div className="h-[320px] flex items-center justify-center">
                      <p className="text-muted-foreground text-center">
                        Conecte seu backend para visualizar dados do estoque em tempo real
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="categorias">
                    <div className="h-[320px] flex items-center justify-center">
                      <p className="text-muted-foreground text-center">
                        Conecte seu backend para visualizar categorias do estoque em tempo real
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Adicionando o gerenciamento de funcionários ao Dashboard */}
          <Card className="dashboard-chart">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Gerenciamento de Funcionários</CardTitle>
              <CardDescription className="text-gray-300">
                Cadastre e gerencie a equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                </TabsList>
                <TabsContent value="list" className="pt-4">
                  <EmployeeList onSelectEmployee={setSelectedEmployeeId} />
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
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="dashboard-chart">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-white">Histórico de Arquivos</CardTitle>
                <CardDescription className="text-gray-300">
                  Arquivos enviados e suas análises
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <FileHistory />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
