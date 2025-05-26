
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Buscar notificações
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Por enquanto vamos simular notificações até criar a tabela
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "warning",
          title: "Estoque Baixo",
          message: "5 produtos estão com estoque abaixo do nível mínimo",
          read: false,
          created_at: new Date().toISOString(),
          action_url: "/inventory"
        },
        {
          id: "2",
          type: "success",
          title: "Meta Atingida",
          message: "Parabéns! Você atingiu 95% da meta mensal",
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "3",
          type: "info",
          title: "Novo Funcionário",
          message: "João Silva foi adicionado à equipe",
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      return mockNotifications;
    },
  });

  // Marcar como lida
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // Aqui implementaria a atualização no banco
      console.log("Marking as read:", notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  // Gerar notificações automáticas baseadas no estoque
  const generateStockAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: inventory } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id)
      .lt("quantity", 5);

    if (inventory && inventory.length > 0) {
      toast.warning(`${inventory.length} produtos com estoque baixo!`);
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    generateStockAlerts
  };
};
