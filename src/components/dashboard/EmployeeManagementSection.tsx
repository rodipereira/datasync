
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/charts/ChartContainer";
import EmployeeList from "@/components/EmployeeList";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeMetrics from "@/components/EmployeeMetrics";

const EmployeeManagementSection = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [activeEmployeeTab, setActiveEmployeeTab] = useState("list");

  const handleSelectEmployee = (id: string | null) => {
    setSelectedEmployeeId(id);
    if (id) {
      setActiveEmployeeTab("metrics");
    }
  };

  return (
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
  );
};

export default EmployeeManagementSection;
