
export type ChartDataPoint = {
  name: string;
  vendas: number;
  lucro: number;
  estoque: number;
};

export type ChartPeriod = "diario" | "mensal" | "trimestral" | "anual";
export type ChartType = "line" | "bar";

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

export interface ChartDisplayProps {
  data: ChartDataPoint[];
  config: ChartConfig;
}
