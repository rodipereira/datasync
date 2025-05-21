
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartDataPoint, ChartConfig } from "@/types/chartTypes";

interface LineChartDisplayProps {
  data: ChartDataPoint[];
  config: ChartConfig;
}

export const LineChartDisplay = ({ data, config }: LineChartDisplayProps) => {
  return (
    <ChartContainer config={config}>
      <LineChart data={data}>
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
        <Line
          type="monotone"
          dataKey="vendas"
          strokeWidth={2}
          activeDot={{ r: 8, fill: "#2563eb" }}
          stroke="#2563eb"
        />
        <Line
          type="monotone"
          dataKey="lucro"
          strokeWidth={2}
          stroke="#10b981"
        />
        <Line
          type="monotone"
          dataKey="estoque"
          strokeWidth={2}
          stroke="#8b5cf6"
        />
      </LineChart>
    </ChartContainer>
  );
};
