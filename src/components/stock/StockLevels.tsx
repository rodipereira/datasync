
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface StockItem {
  id: string;
  product_name: string;
  quantity: number;
  minimum_level: number;
  category: string;
}

interface StockLevelsProps {
  stockData: StockItem[];
}

const StockLevels: React.FC<StockLevelsProps> = ({ stockData }) => {
  // Preparando os dados para o gráfico
  const chartData = stockData.map(item => ({
    name: item.product_name,
    quantidade: item.quantity,
    nivel_minimo: item.minimum_level
  })).slice(0, 10); // Limitando a 10 itens para melhor visualização

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantidade" fill="#82ca9d" name="Quantidade Atual" />
          <Bar dataKey="nivel_minimo" fill="#ff8042" name="Nível Mínimo" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLevels;
