
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
  // Fetch stock data from Supabase
  const { data: stockData, isLoading, error } = useQuery({
    queryKey: ["stockData"],
    queryFn: async () => {
      // Usamos supabase.from com type assertion para informar o TypeScript sobre o formato da tabela
      const { data, error } = await supabase
        .from("inventory")
        .select("*") as { data: StockItem[] | null, error: Error | null };
      
      if (error) {
        throw new Error(`Erro ao buscar dados do estoque: ${error.message}`);
      }
      
      return data || [];
    },
  });

  const isEmpty = !isLoading && (!stockData || stockData.length === 0);
  
  return (
    <Tabs defaultValue="niveis" className={className}>
      <TabsList className="mb-4 bg-secondary/50">
        <TabsTrigger
          value="niveis"
          className="data-[state=active]:bg-primary/80"
        >
          Níveis
        </TabsTrigger>
        <TabsTrigger
          value="categorias"
          className="data-[state=active]:bg-primary/80"
        >
          Categorias
        </TabsTrigger>
      </TabsList>
      
      <StockStateDisplay loading={isLoading} isEmpty={isEmpty} error={!!error} />
      
      {!isLoading && !isEmpty && (
        <>
          <TabsContent value="niveis">
            <StockLevels stockData={stockData as StockItem[]} />
          </TabsContent>
          <TabsContent value="categorias">
            <StockCategories stockData={stockData as StockItem[]} />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default StockAnalysis;
