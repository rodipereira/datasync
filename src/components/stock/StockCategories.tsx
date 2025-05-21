
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface StockItem {
  id: string;
  product_name: string;
  quantity: number;
  minimum_level: number;
  category: string;
}

interface StockCategoriesProps {
  stockData: StockItem[];
}

const StockCategories: React.FC<StockCategoriesProps> = ({ stockData }) => {
  // Cores para as categorias
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#4CAF50", "#9C27B0", "#607D8B"];

  // Agregando dados por categoria
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    stockData.forEach(item => {
      if (item.category in categories) {
        categories[item.category] += item.quantity;
      } else {
        categories[item.category] = item.quantity;
      }
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  }, [stockData]);

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} unidades`, 'Quantidade']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockCategories;
