
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardChart from "@/components/DashboardChart";
import FileHistory from "@/components/FileHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bot, Upload } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Visualize e analise os dados do seu negócio</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload de Arquivos
            </Button>
            <Button variant="outline" onClick={handleAIAssistant}>
              <Bot className="h-4 w-4 mr-2" />
              Assistente IA
            </Button>
            <Button onClick={handleDetailedAnalysis}>
              <span className="mr-1">Análise Detalhada</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <DashboardMetrics />
          
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardChart />
            
            <Card>
              <CardHeader>
                <CardTitle>Análise de Estoque</CardTitle>
                <CardDescription>
                  Visão geral da situação atual do estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="niveis">
                  <TabsList className="mb-4">
                    <TabsTrigger value="niveis">Níveis</TabsTrigger>
                    <TabsTrigger value="categorias">Categorias</TabsTrigger>
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Histórico de Arquivos</CardTitle>
                <CardDescription>
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
