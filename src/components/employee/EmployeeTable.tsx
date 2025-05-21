
import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import EmployeeTableRow from "./EmployeeTableRow";

interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date: string;
  created_at: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onViewMetrics: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

const EmployeeTable = ({
  employees,
  loading,
  onViewMetrics,
  onDeleteClick,
}: EmployeeTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum funcionário cadastrado</p>
      </div>
    );
  }

  return (
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
            <EmployeeTableRow 
              key={employee.id}
              employee={employee}
              onViewMetrics={onViewMetrics}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
