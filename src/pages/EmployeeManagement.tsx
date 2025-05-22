
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6 border-0 shadow-sm bg-white">
          <CardHeader className="bg-white border-b border-gray-100 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800">Gerenciamento de Funcionários</CardTitle>
            <CardDescription className="text-gray-600">
              Cadastre, gerencie e acompanhe o desempenho dos seus funcionários
            </CardDescription>
          </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="text-lg font-medium text-gray-800">Menu</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs 
                  defaultValue="list" 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  orientation="vertical" 
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto items-stretch bg-transparent space-y-1">
                    <TabsTrigger 
                      value="list" 
                      className="justify-start text-left px-3 py-2.5 rounded-md data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-700"
                    >
                      Funcionários
                    </TabsTrigger>
                    <TabsTrigger 
                      value="add" 
                      className="justify-start text-left px-3 py-2.5 rounded-md data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-700"
                    >
                      Adicionar Funcionário
                    </TabsTrigger>
                    <TabsTrigger 
                      value="metrics" 
                      className="justify-start text-left px-3 py-2.5 rounded-md data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-700"
                      disabled={!selectedEmployee}
                    >
                      Métricas de Desempenho
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="list" className="mt-0">
                    <EmployeeList onSelectEmployee={handleSelectEmployee} />
                  </TabsContent>
                  
                  <TabsContent value="add" className="mt-0">
                    <CardHeader className="px-0 pt-0 pb-6">
                      <CardTitle className="text-xl text-gray-800">Adicionar Novo Funcionário</CardTitle>
                      <CardDescription className="text-gray-600">Preencha os dados do funcionário para cadastrá-lo no sistema</CardDescription>
                    </CardHeader>
                    <div className="max-w-2xl">
                      <EmployeeForm 
                        onSaved={() => {
                          setActiveTab("list");
                        }} 
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="metrics" className="mt-0">
                    {selectedEmployee ? (
                      <EmployeeMetrics employeeId={selectedEmployee} />
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600">Selecione um funcionário para visualizar suas métricas de desempenho.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
