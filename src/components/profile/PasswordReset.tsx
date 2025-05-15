
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PasswordReset = () => {
  const handleResetPassword = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email) {
        throw new Error("Usuário não possui email cadastrado");
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + '/profile'
      });
      
      if (error) throw error;
      
      toast.success("Email de redefinição de senha enviado com sucesso!", {
        description: "Verifique sua caixa de entrada e siga as instruções."
      });
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast.error("Não foi possível enviar o email de redefinição de senha");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="flex items-center gap-2 mt-2"
      onClick={handleResetPassword}
    >
      <Key className="h-4 w-4" />
      Alterar senha
    </Button>
  );
};

export default PasswordReset;
