
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EmployeeDeleteDialog from "./employee/EmployeeDeleteDialog";
import EmployeeListHeader from "./employee/EmployeeListHeader";
import EmployeeSearch from "./employee/EmployeeSearch";
import EmployeeEmptyState from "./employee/EmployeeEmptyState";
import EmployeeGrid from "./employee/EmployeeGrid";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeActions } from "@/hooks/useEmployeeActions";

interface EmployeeListProps {
  onSelectEmployee: (id: string | null) => void;
}

const EmployeeList = ({ onSelectEmployee }: EmployeeListProps) => {
  const { employees, loading, refetchEmployees } = useEmployeeData();
  const { exporting, handleExportData, handleViewMetrics } = useEmployeeActions({ 
    employees, 
    onSelectEmployee 
  });

  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const confirmDelete = (id: string) => {
    console.log("Confirmando exclusão do funcionário:", id);
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    console.log("Exclusão bem-sucedida, recarregando lista...");
    setEmployeeToDelete(null);
    refetchEmployees();
  };

  return (
    <div className="space-y-6">
      <Card className="border border-primary/20 bg-secondary/30">
        <EmployeeListHeader 
          employeeCount={employees.length}
          exporting={exporting}
          onExportData={handleExportData}
        />
        <CardContent>
          <EmployeeSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <EmployeeEmptyState />
          ) : (
            <EmployeeGrid 
              employees={filteredEmployees}
              onViewMetrics={handleViewMetrics}
              onDeleteClick={confirmDelete}
            />
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
