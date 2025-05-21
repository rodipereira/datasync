
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
    <TableRow key={employee.id}>
      <TableCell className="font-medium">{employee.name}</TableCell>
      <TableCell>{employee.position}</TableCell>
      <TableCell>{format(new Date(employee.hire_date), 'dd/MM/yyyy')}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1" 
            onClick={() => onViewMetrics(employee.id)}
          >
            Ver Métricas
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(employee.id)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;
