
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
  created_at?: string;
  updated_at?: string;
}

const Inventory = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Buscar dados de inventário
  const { data: inventoryData, isLoading, error, refetch } = useQuery({
    queryKey: ["inventoryData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .order("product_name", { ascending: true });
      
      if (error) {
        toast.error(`Erro ao buscar dados do inventário: ${error.message}`);
        throw error;
      }
      
      return data || [];
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

  const handleFormSubmit = async (formData: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => {
    try {
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
          .eq("id", editingItem.id);

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
            category: formData.category
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
            <p className="text-gray-400">Adicione, edite e remova itens do estoque</p>
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
            <CardTitle className="text-lg font-semibold text-white">Itens em Estoque</CardTitle>
            <CardDescription className="text-gray-300">
              Listagem completa do inventário
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
