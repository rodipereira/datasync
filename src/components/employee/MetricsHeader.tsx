
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { PlusCircle, Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MetricForm from "@/components/MetricForm";

interface EmployeeData {
  id: string;
  name: string;
  position: string;
}

interface MetricsHeaderProps {
  employee: EmployeeData;
  onMetricSaved: () => void;
  onExportData: () => void;
  isExporting: boolean;
  hasMetrics: boolean;
}

const MetricsHeader = ({
  employee,
  onMetricSaved,
  onExportData,
  isExporting,
  hasMetrics,
}: MetricsHeaderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMetricSaved = () => {
    setDialogOpen(false);
    onMetricSaved();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <CardTitle className="flex flex-col">
        <span>{employee.name}</span>
        <span className="text-sm font-normal text-muted-foreground">
          {employee.position}
        </span>
      </CardTitle>
      
      <div className="flex items-center gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Adicionar Métrica
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Métrica de Desempenho</DialogTitle>
            </DialogHeader>
            <MetricForm
              employeeId={employee.id}
              onSaved={handleMetricSaved}
            />
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="icon"
          disabled={!hasMetrics || isExporting}
          onClick={onExportData}
          title="Exportar dados"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MetricsHeader;
