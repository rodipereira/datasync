
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartDataPoint, ChartConfig } from "@/types/chartTypes";

interface BarChartDisplayProps {
  data: ChartDataPoint[];
  config: ChartConfig;
}

export const BarChartDisplay = ({ data, config }: BarChartDisplayProps) => {
  return (
    <ChartContainer config={config}>
      <BarChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(255,255,255,0.1)"
        />
        <XAxis 
          dataKey="name" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          stroke="rgba(255,255,255,0.5)"
        />
        <YAxis 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          stroke="rgba(255,255,255,0.5)"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="vendas" radius={[4, 4, 0, 0]} fill="#2563eb" />
        <Bar dataKey="lucro" radius={[4, 4, 0, 0]} fill="#10b981" />
        <Bar dataKey="estoque" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
      </BarChart>
    </ChartContainer>
  );
};
