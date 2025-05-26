
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryFormDialog from "@/components/inventory/InventoryFormDialog";
import { toast } from "sonner";

export interface InventoryItem {
  id: string;
  product_name: string;
  quantity: number;
  minimum_level: number;
  category: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

const Inventory = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Buscar dados de inventário do usuário logado
  const { data: inventoryData, isLoading, error, refetch } = useQuery({
    queryKey: ["inventoryData"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("Usuário autenticado:", user.id);

      // Primeiro, vamos tentar buscar itens com user_id
      const { data: userItems, error: userError } = await supabase
        .from("inventory")
        .select("*")
        .eq("user_id", user.id)
        .order("product_name", { ascending: true });
      
      if (userError) {
        console.error("Erro ao buscar itens do usuário:", userError);
      } else {
        console.log("Itens do usuário encontrados:", userItems?.length || 0);
      }

      // Se não encontrarmos itens do usuário, vamos buscar itens sem user_id e atribuí-los
      if (!userItems || userItems.length === 0) {
        console.log("Buscando itens sem user_id para atribuir ao usuário...");
        
        const { data: orphanItems, error: orphanError } = await supabase
          .from("inventory")
          .select("*")
          .is("user_id", null)
          .order("product_name", { ascending: true });

        if (orphanError) {
          console.error("Erro ao buscar itens órfãos:", orphanError);
          toast.error(`Erro ao buscar dados do inventário: ${orphanError.message}`);
          throw orphanError;
        }

        console.log("Itens sem user_id encontrados:", orphanItems?.length || 0);

        // Se encontrarmos itens sem user_id, vamos atribuí-los ao usuário atual
        if (orphanItems && orphanItems.length > 0) {
          console.log("Atribuindo itens órfãos ao usuário atual...");
          
          const { error: updateError } = await supabase
            .from("inventory")
            .update({ user_id: user.id })
            .is("user_id", null);

          if (updateError) {
            console.error("Erro ao atribuir itens ao usuário:", updateError);
            toast.error(`Erro ao atribuir itens: ${updateError.message}`);
          } else {
            console.log("Itens atribuídos com sucesso!");
            toast.success("Itens do inventário foram atribuídos à sua conta");
            
            // Buscar novamente os dados atualizados
            const { data: updatedItems, error: finalError } = await supabase
              .from("inventory")
              .select("*")
              .eq("user_id", user.id)
              .order("product_name", { ascending: true });

            if (finalError) {
              console.error("Erro ao buscar dados atualizados:", finalError);
              throw finalError;
            }

            console.log("Dados finais:", updatedItems?.length || 0);
            return updatedItems || [];
          }
        }
      }
      
      console.log("Retornando dados do usuário:", userItems?.length || 0);
      return userItems || [];
    },
  });

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("Item removido com sucesso");
      refetch();
    } catch (error: any) {
      toast.error(`Erro ao remover item: ${error.message}`);
    }
  };

  const handleFormClose = () => {
    setIsCreateDialogOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (formData: Omit<InventoryItem, "id" | "created_at" | "updated_at" | "user_id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      if (editingItem) {
        // Atualizar item existente
        const { error } = await supabase
          .from("inventory")
          .update({
            product_name: formData.product_name,
            quantity: formData.quantity,
            minimum_level: formData.minimum_level,
            category: formData.category,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingItem.id)
          .eq("user_id", user.id); // Garantir que só atualiza itens do próprio usuário

        if (error) {
          throw error;
        }

        toast.success("Item atualizado com sucesso");
      } else {
        // Criar novo item
        const { error } = await supabase
          .from("inventory")
          .insert({
            product_name: formData.product_name,
            quantity: formData.quantity,
            minimum_level: formData.minimum_level,
            category: formData.category,
            user_id: user.id // Definir o user_id para o usuário logado
          });

        if (error) {
          throw error;
        }

        toast.success("Item adicionado com sucesso");
      }

      handleFormClose();
      refetch();
    } catch (error: any) {
      toast.error(`Erro ao salvar item: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold accent-text">Gerenciamento de Inventário</h1>
            <p className="text-gray-400">Adicione, edite e remova itens do seu estoque pessoal</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </div>
        
        <Card className="dashboard-chart">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Seus Itens em Estoque</CardTitle>
            <CardDescription className="text-gray-300">
              Listagem completa do seu inventário pessoal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-8">
                <p>Erro ao carregar dados do inventário.</p>
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  className="mt-4"
                >
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <InventoryTable 
                inventory={inventoryData} 
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            )}
          </CardContent>
        </Card>

        <InventoryFormDialog 
          open={isCreateDialogOpen || !!editingItem} 
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          item={editingItem}
        />
      </main>
    </div>
  );
};

export default Inventory;
