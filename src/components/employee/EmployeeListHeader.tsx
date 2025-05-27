
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmployeeListHeaderProps {
  employeeCount: number;
  exporting: boolean;
  onExportData: () => void;
}

const EmployeeListHeader = ({ employeeCount, exporting, onExportData }: EmployeeListHeaderProps) => {
  const navigate = useNavigate();

  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
      <CardTitle className="text-xl text-foreground">Lista de Funcionários</CardTitle>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          disabled={employeeCount === 0 || exporting}
          onClick={onExportData}
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
  );
};

export default EmployeeListHeader;
