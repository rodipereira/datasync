import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Loader2, Search, PlusCircle } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "./employee/EmployeeCard";
import EmployeeDeleteDialog from "./employee/EmployeeDeleteDialog";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";

interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date: string;
  created_at: string;
  avatar_url?: string | null;
}

interface EmployeeListProps {
  onSelectEmployee: (id: string | null) => void;
}

const EmployeeList = ({ onSelectEmployee }: EmployeeListProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = employees.filter(
        employee => 
          employee.name.toLowerCase().includes(lowercaseSearch) || 
          employee.position.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log("Buscando funcionários...");
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Usuário não autenticado");
        toast.error("Usuário não autenticado");
        return;
      }
      
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, position, hire_date, created_at, avatar_url')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
        
      if (error) {
        console.error("Erro ao buscar funcionários:", error);
        throw error;
      }
      
      console.log("Funcionários carregados:", data);
      setEmployees(data || []);
      setFilteredEmployees(data || []);
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

  const confirmDelete = (id: string) => {
    console.log("Confirmando exclusão do funcionário:", id);
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    console.log("Exclusão bem-sucedida, recarregando lista...");
    // Limpar o ID do funcionário a ser excluído
    setEmployeeToDelete(null);
    // Recarregar a lista de funcionários
    fetchEmployees();
  };

  const handleViewMetrics = (employeeId: string) => {
    // Option 1: Use the provided callback
    onSelectEmployee(employeeId);
    
    // Option 2: Use navigation to a dedicated route
    if (window.location.pathname === '/dashboard') {
      // In the dashboard, just change the active tab
      onSelectEmployee(employeeId);
    } else {
      // On the employees page, navigate to the metrics tab with the ID
      navigate(`/employees?tab=metrics&id=${employeeId}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-primary/20 bg-secondary/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
          <CardTitle className="text-xl text-foreground">Lista de Funcionários</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={employees.length === 0 || exporting}
              onClick={handleExportData}
              className="flex items-center gap-2 bg-secondary/50 hover:bg-primary/80 hover:text-primary-foreground text-foreground border-primary/20"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Exportar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/employees?tab=add')}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-primary/20 bg-secondary/50 text-foreground focus:border-primary/50 focus:ring focus:ring-primary/30"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12 bg-secondary/50 rounded-lg border border-primary/10">
              <p className="text-muted-foreground">Nenhum funcionário cadastrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onViewMetrics={handleViewMetrics}
                  onDeleteClick={confirmDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EmployeeDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        employeeId={employeeToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default EmployeeList;
