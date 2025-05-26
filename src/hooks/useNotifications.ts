
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

  // Buscar notificações do banco de dados
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar notificações:", error);
        return [];
      }

      return data as Notification[];
    },
  });

  // Marcar como lida
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  // Gerar notificações automáticas baseadas no estoque
  const generateStockAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Chamar função do banco para criar notificações de estoque baixo
      const { error } = await supabase.rpc('create_stock_notifications');
      
      if (error) {
        console.error("Erro ao gerar alertas de estoque:", error);
        return;
      }

      // Invalidar cache para atualizar as notificações
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      
      // Verificar se há produtos com estoque baixo
      const { data: inventory } = await supabase
        .from("inventory")
        .select("*")
        .eq("user_id", user.id)
        .lt("quantity", "minimum_level");

      if (inventory && inventory.length > 0) {
        toast.warning(`${inventory.length} produtos com estoque baixo detectados!`);
      }
    } catch (error) {
      console.error("Erro ao gerar alertas:", error);
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    generateStockAlerts
  };
};
