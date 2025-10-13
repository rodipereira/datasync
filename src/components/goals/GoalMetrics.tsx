import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/pages/Goals";
import { Target, TrendingUp, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

interface GoalMetricsProps {
  goals: Goal[];
}

const GoalMetrics = ({ goals }: GoalMetricsProps) => {
  const calculateMetrics = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const onTrack = goals.filter(g => g.status === 'on-track').length;
    const atRisk = goals.filter(g => g.status === 'at-risk').length;
    const inProgress = goals.filter(g => g.status === 'in-progress').length;
    const overdue = goals.filter(g => new Date() > g.endDate && g.status !== 'completed').length;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const riskRate = total > 0 ? (atRisk / total) * 100 : 0;
    
    const totalProgress = goals.reduce((sum, goal) => {
      const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
      return sum + progress;
    }, 0);
    const averageProgress = total > 0 ? totalProgress / total : 0;

    return {
      total,
      completed,
      onTrack,
      atRisk,
      inProgress,
      overdue,
      completionRate,
      riskRate,
      averageProgress
    };
  };

  const metrics = calculateMetrics();

  const metricCards = [
    {
      title: "Total de Metas",
      value: metrics.total,
      icon: Target,
      color: "text-blue-600 bg-blue-100",
      description: "Metas definidas"
    },
    {
      title: "Taxa de Conclusão",
      value: `${metrics.completionRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
      description: `${metrics.completed} de ${metrics.total} concluídas`
    },
    {
      title: "Progresso Médio",
      value: `${metrics.averageProgress.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
      description: "Média geral de progresso"
    },
    {
      title: "Metas em Risco",
      value: metrics.atRisk,
      icon: AlertTriangle,
      color: "text-red-600 bg-red-100",
      description: `${metrics.riskRate.toFixed(1)}% do total`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metricCards.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {metric.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Status Overview */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Visão Geral dos Status</CardTitle>
          <CardDescription>
            Distribuição das metas por status atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Concluídas</span>
              <Badge variant="secondary">{metrics.completed}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">No Prazo</span>
              <Badge variant="secondary">{metrics.onTrack}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Em Progresso</span>
              <Badge variant="secondary">{metrics.inProgress}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Em Risco</span>
              <Badge variant="secondary">{metrics.atRisk}</Badge>
            </div>
            {metrics.overdue > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-700 rounded-full"></div>
                <span className="text-sm">Atrasadas</span>
                <Badge variant="destructive">{metrics.overdue}</Badge>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Progresso Geral: {metrics.averageProgress.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.averageProgress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalMetrics;