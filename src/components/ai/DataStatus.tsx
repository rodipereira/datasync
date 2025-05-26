
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BusinessData {
  inventory: any[];
  employees: any[];
  totalInventoryValue: number;
  lowStockItems: number;
}

interface DataStatusProps {
  businessData: BusinessData | null;
}

const DataStatus: React.FC<DataStatusProps> = ({ businessData }) => {
  if (!businessData) return null;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <h4 className="font-medium mb-2 text-white">Status dos Dados Disponíveis:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Produtos:</span>
            <span className="ml-2 font-medium text-white">{businessData.inventory.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Funcionários:</span>
            <span className="ml-2 font-medium text-white">{businessData.employees.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Valor Total:</span>
            <span className="ml-2 font-medium text-white">R$ {businessData.totalInventoryValue.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Estoque Baixo:</span>
            <span className="ml-2 font-medium text-red-400">{businessData.lowStockItems}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataStatus;
