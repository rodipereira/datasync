
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
    name: item.product_name.length > 15 ? 
      item.product_name.substring(0, 15) + '...' : 
      item.product_name,
    quantidade: item.quantity,
    nivel_minimo: item.minimum_level
  })).slice(0, 8); // Limitando a 8 itens para melhor visualização

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="text-white font-medium">{`Produto: ${label}`}</p>
          <p className="text-green-400">{`Quantidade Atual: ${payload[0].value}`}</p>
          <p className="text-orange-400">{`Nível Mínimo: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)" 
          />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.7)"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.7)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              color: 'rgba(255,255,255,0.8)'
            }}
          />
          <Bar 
            dataKey="quantidade" 
            fill="#10b981" 
            name="Quantidade Atual"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="nivel_minimo" 
            fill="#f59e0b" 
            name="Nível Mínimo"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLevels;
