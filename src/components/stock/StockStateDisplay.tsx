
import React from "react";
import { Loader2 } from "lucide-react";

interface StockStateDisplayProps {
  loading: boolean;
  isEmpty: boolean;
  error: boolean;
}

const StockStateDisplay: React.FC<StockStateDisplayProps> = ({ 
  loading, 
  isEmpty,
  error
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">
          Erro ao carregar dados do estoque. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <p className="text-white opacity-70 font-medium">
          Nenhum dado de estoque encontrado. Comece adicionando produtos ao seu inventário.
        </p>
      </div>
    );
  }

  return null;
};

export default StockStateDisplay;
