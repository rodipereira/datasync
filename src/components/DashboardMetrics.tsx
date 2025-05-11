
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

const metrics = [
  {
    title: "Vendas Totais",
    value: "R$ 45.231,89",
    change: "+12.5%",
    positive: true,
    description: "em relação ao mês passado"
  },
  {
    title: "Lucro Líquido",
    value: "R$ 15.742,30",
    change: "+8.2%",
    positive: true,
    description: "em relação ao mês passado"
  },
  {
    title: "Itens em Estoque",
    value: "412",
    change: "-3.1%",
    positive: false,
    description: "em relação ao mês passado"
  },
  {
    title: "Novos Clientes",
    value: "24",
    change: "+18.9%",
    positive: true,
    description: "em relação ao mês passado"
  }
];

const DashboardMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="metrics-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center pt-1">
              <span className={`flex items-center ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.positive ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </span>
              <CardDescription className="ml-2">{metric.description}</CardDescription>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
