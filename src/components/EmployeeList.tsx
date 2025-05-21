
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";
import { useNavigate } from "react-router-dom";
import EmployeeTable from "./employee/EmployeeTable";
import EmployeeDeleteDialog from "./employee/EmployeeDeleteDialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

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
      
      console.log("Funcionários carregados:", data);
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

  const confirmDelete = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
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
    <div>
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
      
      <EmployeeTable
        employees={employees}
        loading={loading}
        onViewMetrics={handleViewMetrics}
        onDeleteClick={confirmDelete}
      />

      <EmployeeDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        employeeId={employeeToDelete}
        onDeleteSuccess={fetchEmployees}
      />
    </div>
  );
};

// Missing imports
import { format } from "date-fns";

export default EmployeeList;
