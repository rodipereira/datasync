
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Download, ChevronRight, Loader2 } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";

interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date: string;
  created_at: string;
}

interface EmployeeListProps {
  onSelectEmployee: (id: string | null) => void;
}

const EmployeeList = ({ onSelectEmployee }: EmployeeListProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setEmployees(data || []);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      toast.error("Erro ao carregar lista de funcionários");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      
      // Formatar dados para exportação
      const dataForExport = employees.map(emp => ({
        'Nome': emp.name,
        'Cargo': emp.position,
        'Data de Contratação': format(new Date(emp.hire_date), 'dd/MM/yyyy'),
        'Cadastrado em': format(new Date(emp.created_at), 'dd/MM/yyyy')
      }));
      
      // Exportar para Excel
      await exportToExcel(dataForExport, 'funcionarios');
      
      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar dados");
    } finally {
      setExporting(false);
    }
  };
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Lista de Funcionários</h3>
          <Button 
            variant="outline" 
            size="sm"
            disabled={employees.length === 0 || exporting}
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Exportar Dados
          </Button>
        </div>
        
        {employees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum funcionário cadastrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data de Contratação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{format(new Date(employee.hire_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center gap-1" 
                        onClick={() => onSelectEmployee(employee.id)}
                      >
                        Ver Métricas
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeList;
