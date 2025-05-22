
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
    <TableRow key={employee.id} className="hover:bg-secondary/50">
      <TableCell className="font-medium text-foreground">{employee.name}</TableCell>
      <TableCell className="text-muted-foreground">{employee.position}</TableCell>
      <TableCell className="text-muted-foreground">{format(new Date(employee.hire_date), 'dd/MM/yyyy')}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1 text-foreground hover:text-primary-foreground hover:bg-primary/80" 
            onClick={() => onViewMetrics(employee.id)}
          >
            Ver Métricas
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(employee.id)}
            className="text-muted-foreground hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;
