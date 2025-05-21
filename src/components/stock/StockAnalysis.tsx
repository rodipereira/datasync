
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
    <div className="w-full h-full text-white">
      <Tabs defaultValue="niveis" className={`w-full h-full ${className}`}>
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
        
        {!isLoading && !isEmpty && (
          <>
            <TabsContent value="niveis" className="text-white">
              <StockLevels stockData={stockData as StockItem[]} />
            </TabsContent>
            <TabsContent value="categorias" className="text-white">
              <StockCategories stockData={stockData as StockItem[]} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default StockAnalysis;
