
// Dados de exemplo para o ano completo
export const fullData = [
  { name: "Jan", vendas: 4000, lucro: 2400, estoque: 2400 },
  { name: "Fev", vendas: 3000, lucro: 1398, estoque: 2210 },
  { name: "Mar", vendas: 2000, lucro: 9800, estoque: 2290 },
  { name: "Abr", vendas: 2780, lucro: 3908, estoque: 2000 },
  { name: "Mai", vendas: 1890, lucro: 4800, estoque: 2181 },
  { name: "Jun", vendas: 2390, lucro: 3800, estoque: 2500 },
  { name: "Jul", vendas: 3490, lucro: 4300, estoque: 2100 },
  { name: "Ago", vendas: 4000, lucro: 2400, estoque: 2400 },
  { name: "Set", vendas: 3000, lucro: 1398, estoque: 2210 },
  { name: "Out", vendas: 2000, lucro: 9800, estoque: 2290 },
  { name: "Nov", vendas: 2780, lucro: 3908, estoque: 2000 },
  { name: "Dez", vendas: 1890, lucro: 4800, estoque: 2181 },
];

// Dados diários - exemplo para uma semana (simplificado)
export const dailyData = [
  { name: "Seg", vendas: 500, lucro: 300, estoque: 2400 },
  { name: "Ter", vendas: 650, lucro: 420, estoque: 2350 },
  { name: "Qua", vendas: 420, lucro: 280, estoque: 2300 },
  { name: "Qui", vendas: 580, lucro: 350, estoque: 2280 },
  { name: "Sex", vendas: 750, lucro: 480, estoque: 2220 },
  { name: "Sáb", vendas: 850, lucro: 520, estoque: 2200 },
  { name: "Dom", vendas: 300, lucro: 180, estoque: 2180 },
];

// Configuração do gráfico para os componentes de gráfico shadcn/ui
export const chartConfig = {
  vendas: {
    label: "Vendas",
    color: "#2563eb" // Azul
  },
  lucro: {
    label: "Lucro",
    color: "#10b981" // Verde
  },
  estoque: {
    label: "Estoque",
    color: "#8b5cf6" // Roxo
  }
};
