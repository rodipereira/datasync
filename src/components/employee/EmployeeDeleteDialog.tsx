
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const handleDeleteEmployee = async () => {
    if (!employeeId) return;
    
    try {
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
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteEmployee} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmployeeDeleteDialog;
