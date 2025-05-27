
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { exportToExcel } from "@/utils/exportUtils";
import { format } from "date-fns";

interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date: string;
  created_at: string;
  avatar_url?: string | null;
}

interface UseEmployeeActionsProps {
  employees: Employee[];
  onSelectEmployee: (id: string | null) => void;
}

export const useEmployeeActions = ({ employees, onSelectEmployee }: UseEmployeeActionsProps) => {
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  const handleExportData = async () => {
    try {
      setExporting(true);
      
      const dataForExport = employees.map(emp => ({
        'Nome': emp.name,
        'Cargo': emp.position,
        'Data de Contratação': format(new Date(emp.hire_date), 'dd/MM/yyyy'),
        'Cadastrado em': format(new Date(emp.created_at), 'dd/MM/yyyy')
      }));
      
      await exportToExcel(dataForExport, 'funcionarios');
      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar dados");
    } finally {
      setExporting(false);
    }
  };

  const handleViewMetrics = (employeeId: string) => {
    onSelectEmployee(employeeId);
    
    if (window.location.pathname === '/dashboard') {
      onSelectEmployee(employeeId);
    } else {
      navigate(`/employees?tab=metrics&id=${employeeId}`);
    }
  };

  return {
    exporting,
    handleExportData,
    handleViewMetrics
  };
};
