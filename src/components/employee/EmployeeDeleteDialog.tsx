
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmployeeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string | null;
  onDeleteSuccess: () => void;
}

const EmployeeDeleteDialog = ({
  open,
  onOpenChange,
  employeeId,
  onDeleteSuccess,
}: EmployeeDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteEmployee = async () => {
    if (!employeeId) return;
    
    try {
      setIsDeleting(true);
      
      // Primeiro, verificamos se há métricas relacionadas ao funcionário e as excluímos
      const { error: metricsError } = await supabase
        .from('employee_metrics')
        .delete()
        .eq('employee_id', employeeId);
      
      if (metricsError) {
        console.error("Erro ao deletar métricas do funcionário:", metricsError);
        toast.error("Erro ao excluir métricas do funcionário");
        return;
      }
      
      // Em seguida, excluímos o funcionário
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);
        
      if (error) throw error;
      
      toast.success("Funcionário removido com sucesso");
      onDeleteSuccess();
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      toast.error("Erro ao remover funcionário");
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita e 
            também removerá todas as métricas associadas a este funcionário.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteEmployee} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmployeeDeleteDialog;
