
import { useState } from "react";
import { fullData, dailyData } from "@/data/chartData";
import { ChartDataPoint, ChartPeriod } from "@/types/chartTypes";

export function useChartData() {
  const [period, setPeriod] = useState<ChartPeriod>("anual");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Filtra os dados com base no período selecionado
  const getFilteredData = (): ChartDataPoint[] => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    
    switch (period) {
      case "diario":
        // Dados diários (mostra a semana)
        return dailyData;
      case "mensal":
        // Dados do último mês (apenas mostra o mês atual)
        return [fullData[currentMonth]];
      case "trimestral":
        // Dados dos últimos 3 meses
        const startMonth = currentMonth >= 2 ? currentMonth - 2 : (currentMonth + 12 - 2) % 12;
        const quarterData = [];
        
        for (let i = 0; i < 3; i++) {
          const monthIndex = (startMonth + i) % 12;
          quarterData.push(fullData[monthIndex]);
        }
        return quarterData;
      case "anual":
      default:
        // Dados do ano completo
        return fullData;
    }
  };

  return {
    period,
    setPeriod,
    chartType, 
    setChartType,
    displayData: getFilteredData()
  };
}
