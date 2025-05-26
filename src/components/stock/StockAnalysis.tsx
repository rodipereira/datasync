
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockLevels from "./StockLevels";
import StockCategories from "./StockCategories";
import StockStateDisplay from "./StockStateDisplay";

interface StockItem {
  id: string;
  product_name: string;
  quantity: number;
  minimum_level: number;
  category: string;
}

interface StockAnalysisProps {
  className?: string;
}

const StockAnalysis: React.FC<StockAnalysisProps> = ({ className }) => {
  // Fetch stock data from Supabase for the current user
  const { data: stockData, isLoading, error } = useQuery({
    queryKey: ["stockData"],
    queryFn: async () => {
      console.log("Buscando dados do estoque...");
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("Usuário autenticado:", user.id);

      // Primeiro, vamos buscar todos os itens do inventário
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) {
        console.error("Erro ao buscar dados do estoque:", error);
        throw new Error(`Erro ao buscar dados do estoque: ${error.message}`);
      }
      
      console.log("Dados do estoque encontrados:", data);
      
      // Se não houver dados com user_id, vamos buscar itens sem user_id e atribuí-los
      if (!data || data.length === 0) {
        console.log("Nenhum item encontrado para o usuário. Buscando itens órfãos...");
        
        const { data: orphanItems, error: orphanError } = await supabase
          .from("inventory")
          .select("*")
          .is("user_id", null);

        if (orphanError) {
          console.error("Erro ao buscar itens órfãos:", orphanError);
          throw new Error(`Erro ao buscar itens órfãos: ${orphanError.message}`);
        }

        console.log("Itens órfãos encontrados:", orphanItems?.length || 0);

        // Se encontrarmos itens órfãos, vamos atribuí-los ao usuário atual
        if (orphanItems && orphanItems.length > 0) {
          console.log("Atribuindo itens órfãos ao usuário atual...");
          
          const { error: updateError } = await supabase
            .from("inventory")
            .update({ user_id: user.id })
            .is("user_id", null);

          if (updateError) {
            console.error("Erro ao atribuir itens ao usuário:", updateError);
            throw new Error(`Erro ao atribuir itens: ${updateError.message}`);
          } else {
            console.log("Itens atribuídos com sucesso!");
            
            // Buscar novamente os dados atualizados
            const { data: updatedItems, error: finalError } = await supabase
              .from("inventory")
              .select("*")
              .eq("user_id", user.id);

            if (finalError) {
              console.error("Erro ao buscar dados atualizados:", finalError);
              throw finalError;
            }

            console.log("Dados finais após atribuição:", updatedItems?.length || 0);
            return updatedItems || [];
          }
        }
      }
      
      return data || [];
    },
  });

  console.log("Estado atual:", { isLoading, error, stockData });

  const isEmpty = !isLoading && (!stockData || stockData.length === 0);
  
  return (
    <div className="w-full h-full flex flex-col text-white">
      <Tabs defaultValue="niveis" className={`w-full h-full flex-1 flex flex-col ${className}`}>
        <TabsList className="mb-4 w-full bg-secondary/50">
          <TabsTrigger
            value="niveis"
            className="text-white data-[state=active]:bg-primary/80"
          >
            Níveis
          </TabsTrigger>
          <TabsTrigger
            value="categorias"
            className="text-white data-[state=active]:bg-primary/80"
          >
            Categorias
          </TabsTrigger>
        </TabsList>
        
        <StockStateDisplay loading={isLoading} isEmpty={isEmpty} error={!!error} />
        
        {!isLoading && !isEmpty && stockData && (
          <>
            <TabsContent value="niveis" className="text-white flex-1">
              <StockLevels stockData={stockData as StockItem[]} />
            </TabsContent>
            <TabsContent value="categorias" className="text-white flex-1">
              <StockCategories stockData={stockData as StockItem[]} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default StockAnalysis;
