
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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm opacity-70">Carregando dados do estoque...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">
          Erro ao carregar dados do estoque. Verifique sua conexão e tente novamente.
        </p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-white font-medium mb-2">
              Nenhum item no estoque
            </p>
            <p className="text-white/70 text-sm">
              Adicione produtos ao seu inventário para ver a análise de estoque aqui.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StockStateDisplay;
