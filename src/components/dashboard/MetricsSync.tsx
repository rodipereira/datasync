
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MetricsSync = () => {
  useEffect(() => {
    const syncInventoryMetrics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscar total de itens em estoque
        const { data: inventory } = await supabase
          .from("inventory")
          .select("quantity")
          .eq("user_id", user.id);

        const totalInventory = inventory?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        // Atualizar a métrica mais recente com o total atual do inventário
        const { error } = await supabase
          .from("dashboard_metrics")
          .update({ inventory_count: totalInventory })
          .eq("period_end", "2024-12-31");

        if (error) {
          console.error("Erro ao sincronizar métricas:", error);
        }
      } catch (error) {
        console.error("Erro na sincronização:", error);
      }
    };

    // Sincronizar ao carregar o componente
    syncInventoryMetrics();

    // Configurar listener para mudanças no inventário
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        () => {
          // Sincronizar métricas quando o inventário mudar
          syncInventoryMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null; // Componente invisível
};
