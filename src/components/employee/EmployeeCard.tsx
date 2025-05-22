
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmployeeCardProps {
  employee: {
    id: string;
    name: string;
    position: string;
    hire_date: string;
    avatar_url?: string | null;
  };
  onViewMetrics: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

const EmployeeCard = ({
  employee,
  onViewMetrics,
  onDeleteClick,
}: EmployeeCardProps) => {
  return (
    <Card className="bg-secondary/30 shadow-sm border border-primary/20 h-full flex flex-col justify-between transition-all hover:shadow-md hover:border-primary/40">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage alt={employee.name} src={employee.avatar_url || ""} />
            <AvatarFallback className="bg-primary/20 text-primary">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="font-medium text-foreground text-center mb-2">{employee.name}</h3>
        <div className="space-y-2 text-sm text-center">
          <p className="text-muted-foreground">{employee.position}</p>
          <p className="text-muted-foreground text-xs">
            Contratado em: {format(new Date(employee.hire_date), 'dd/MM/yyyy')}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2 pt-4 border-t border-primary/10">
        <Button 
          variant="default" 
          size="sm"
          className="w-full flex items-center justify-center gap-1 text-primary-foreground bg-primary/90 hover:bg-primary" 
          onClick={() => onViewMetrics(employee.id)}
        >
          Ver Métricas
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteClick(employee.id)}
          className="w-full text-muted-foreground hover:text-destructive-foreground hover:bg-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remover
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmployeeCard;
