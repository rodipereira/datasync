import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportsChartProps {
  reportType: string;
  metrics: string[];
}

const ReportsChart = ({ reportType, metrics }: ReportsChartProps) => {
  // Dados simulados baseados no tipo de relatório
  const generateChartData = () => {
    switch (reportType) {
      case 'performance':
        return [
          { periodo: 'Jan', vendas: 4000, lucro: 2400, roi: 85 },
          { periodo: 'Fev', vendas: 3000, lucro: 1398, roi: 72 },
          { periodo: 'Mar', vendas: 2000, lucro: 9800, roi: 95 },
          { periodo: 'Abr', vendas: 2780, lucro: 3908, roi: 88 },
          { periodo: 'Mai', vendas: 1890, lucro: 4800, roi: 91 },
          { periodo: 'Jun', vendas: 2390, lucro: 3800, roi: 89 },
        ];
      
      case 'employees':
        return [
          { mes: 'Jan', total: 45, contratacoes: 3, demissoes: 1 },
          { mes: 'Fev', total: 47, contratacoes: 2, demissoes: 0 },
          { mes: 'Mar', total: 49, contratacoes: 4, demissoes: 2 },
          { mes: 'Abr', total: 51, contratacoes: 2, demissoes: 0 },
          { mes: 'Mai', total: 53, contratacoes: 3, demissoes: 1 },
          { mes: 'Jun', total: 55, contratacoes: 2, demissoes: 0 },
        ];
      
      case 'inventory':
        return [
          { categoria: 'Eletrônicos', total: 120, baixo: 5 },
          { categoria: 'Roupas', total: 89, baixo: 12 },
          { categoria: 'Casa', total: 156, baixo: 8 },
          { categoria: 'Livros', total: 67, baixo: 3 },
          { categoria: 'Esportes', total: 94, baixo: 7 },
        ];
      
      case 'financial':
        return [
          { mes: 'Jan', receitas: 50000, despesas: 35000 },
          { mes: 'Fev', receitas: 45000, despesas: 32000 },
          { mes: 'Mar', receitas: 62000, despesas: 38000 },
          { mes: 'Abr', receitas: 58000, despesas: 36000 },
          { mes: 'Mai', receitas: 67000, despesas: 41000 },
          { mes: 'Jun', receitas: 71000, despesas: 43000 },
        ];
      
      default:
        return [];
    }
  };

  const chartData = generateChartData();
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  const renderChart = () => {
    if (metrics.length === 0 || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Selecione métricas para visualizar o gráfico
        </div>
      );
    }

    switch (reportType) {
      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.includes('Vendas') && (
                <Line 
                  type="monotone" 
                  dataKey="vendas" 
                  stroke="#8884d8" 
                  name="Vendas"
                  strokeWidth={2}
                />
              )}
              {metrics.includes('Lucro') && (
                <Line 
                  type="monotone" 
                  dataKey="lucro" 
                  stroke="#82ca9d" 
                  name="Lucro"
                  strokeWidth={2}
                />
              )}
              {metrics.includes('ROI') && (
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#ffc658" 
                  name="ROI (%)"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'employees':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.includes('Total de Funcionários') && (
                <Bar dataKey="total" fill="#8884d8" name="Total" />
              )}
              {metrics.includes('Contratações') && (
                <Bar dataKey="contratacoes" fill="#82ca9d" name="Contratações" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'inventory':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.includes('Total de Produtos') && (
                <Bar dataKey="total" fill="#8884d8" name="Total de Produtos" />
              )}
              {metrics.includes('Estoque Baixo') && (
                <Bar dataKey="baixo" fill="#ff7300" name="Estoque Baixo" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'financial':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
              <Legend />
              {metrics.includes('Receitas') && (
                <Bar dataKey="receitas" fill="#82ca9d" name="Receitas" />
              )}
              {metrics.includes('Despesas') && (
                <Bar dataKey="despesas" fill="#ff7300" name="Despesas" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Visualização dos Dados</CardTitle>
        <CardDescription>
          Preview baseado nas métricas selecionadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ReportsChart;