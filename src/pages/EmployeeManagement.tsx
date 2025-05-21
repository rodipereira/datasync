
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeList from "@/components/EmployeeList";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeMetrics from "@/components/EmployeeMetrics";

const EmployeeManagement = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const employeeIdFromUrl = searchParams.get("id");
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "list");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(employeeIdFromUrl);

  // Update state when URL parameters change
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
    
    if (employeeIdFromUrl) {
      setSelectedEmployee(employeeIdFromUrl);
    }
  }, [tabFromUrl, employeeIdFromUrl]);

  const handleSelectEmployee = (id: string | null) => {
    setSelectedEmployee(id);
    if (id) {
      setActiveTab("metrics");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Gerenciamento de Funcionários</h1>
          <p className="text-muted-foreground">
            Cadastre, gerencie e acompanhe o desempenho dos seus funcionários
          </p>
        </div>
        
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="list">Funcionários</TabsTrigger>
            <TabsTrigger value="add">Adicionar Funcionário</TabsTrigger>
            <TabsTrigger value="metrics" disabled={!selectedEmployee}>
              Métricas de Desempenho
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardContent className="p-6">
                <EmployeeList onSelectEmployee={handleSelectEmployee} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Funcionário</CardTitle>
                <CardDescription>Preencha os dados do funcionário para cadastrá-lo no sistema</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-w-2xl mx-auto">
                  <EmployeeForm 
                    onSaved={() => {
                      setActiveTab("list");
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            {selectedEmployee ? (
              <EmployeeMetrics employeeId={selectedEmployee} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Selecione um funcionário para visualizar suas métricas de desempenho.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeManagement;
