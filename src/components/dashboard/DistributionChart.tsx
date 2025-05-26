
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";

const DistributionChart = () => {
  const categoryData = [
    { name: 'Eletrônicos', value: 35, color: '#8b5cf6' },
    { name: 'Roupas', value: 25, color: '#06b6d4' },
    { name: 'Casa', value: 20, color: '#10b981' },
    { name: 'Livros', value: 20, color: '#f59e0b' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Distribuição Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                dataKey="value"
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({name, value}) => `${name}: ${value}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm">{category.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributionChart;
