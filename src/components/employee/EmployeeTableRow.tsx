
import React from "react";
import { format } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2 } from "lucide-react";

interface EmployeeTableRowProps {
  employee: {
    id: string;
    name: string;
    position: string;
    hire_date: string;
  };
  onViewMetrics: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

const EmployeeTableRow = ({
  employee,
  onViewMetrics,
  onDeleteClick,
}: EmployeeTableRowProps) => {
  return (
    <TableRow key={employee.id} className="hover:bg-gray-50">
      <TableCell className="font-medium text-gray-800">{employee.name}</TableCell>
      <TableCell className="text-gray-600">{employee.position}</TableCell>
      <TableCell className="text-gray-600">{format(new Date(employee.hire_date), 'dd/MM/yyyy')}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100" 
            onClick={() => onViewMetrics(employee.id)}
          >
            Ver Métricas
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(employee.id)}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;
