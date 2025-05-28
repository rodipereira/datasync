
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
    <div className={`w-full h-full flex flex-col ${className}`}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 h-full">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Análise de Estoque</h3>
          <p className="text-gray-300 text-sm">Visualização detalhada dos níveis de inventário</p>
        </div>

        <Tabs defaultValue="niveis" className="w-full h-[calc(100%-80px)] flex flex-col">
          <TabsList className="mb-6 w-full bg-gray-700/50 p-1">
            <TabsTrigger
              value="niveis"
              className="flex-1 text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
            >
              Níveis de Estoque
            </TabsTrigger>
            <TabsTrigger
              value="categorias"
              className="flex-1 text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
            >
              Por Categorias
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <StockStateDisplay loading={isLoading} isEmpty={isEmpty} error={!!error} />
            
            {!isLoading && !isEmpty && stockData && (
              <>
                <TabsContent value="niveis" className="h-full mt-0">
                  <div className="bg-gray-700/30 rounded-lg p-4 h-full">
                    <StockLevels stockData={stockData as StockItem[]} />
                  </div>
                </TabsContent>
                <TabsContent value="categorias" className="h-full mt-0">
                  <div className="bg-gray-700/30 rounded-lg p-4 h-full">
                    <StockCategories stockData={stockData as StockItem[]} />
                  </div>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StockAnalysis;
