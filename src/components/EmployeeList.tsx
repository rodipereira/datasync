
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Loader2, Search } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";
import { useNavigate } from "react-router-dom";
import EmployeeTable from "./employee/EmployeeTable";
import EmployeeDeleteDialog from "./employee/EmployeeDeleteDialog";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) {
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
    <div className="space-y-6">
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
          <CardTitle className="text-xl text-gray-800">Lista de Funcionários</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            disabled={employees.length === 0 || exporting}
            onClick={handleExportData}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Exportar Dados
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-0">
              <EmployeeTable
                employees={filteredEmployees}
                loading={loading}
                onViewMetrics={handleViewMetrics}
                onDeleteClick={confirmDelete}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>

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
