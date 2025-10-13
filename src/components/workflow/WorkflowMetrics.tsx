import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowRequest, WorkflowTemplate } from "@/pages/WorkflowManagement";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Timer
} from "lucide-react";

interface WorkflowMetricsProps {
  requests: WorkflowRequest[];
  workflows: WorkflowTemplate[];
}

const WorkflowMetrics = ({ requests, workflows }: WorkflowMetricsProps) => {
  const calculateMetrics = () => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const approvedRequests = requests.filter(r => r.status === 'approved').length;
    const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
    const activeWorkflows = workflows.filter(w => w.isActive).length;
    
    const approvalRate = totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0;
    
    // Calculate average processing time (mock calculation)
    const avgProcessingTime = 2.5; // days
    
    // Calculate overdue requests (mock)
    const overdueRequests = requests.filter(r => {
      if (r.status !== 'pending') return false;
      const daysSinceCreated = (Date.now() - r.requestedAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreated > 3; // Consider overdue after 3 days
    }).length;

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      activeWorkflows,
      approvalRate,
      avgProcessingTime,
      overdueRequests
    };
  };

  const metrics = calculateMetrics();

  const metricCards = [
    {
      title: "Total de Solicitações",
      value: metrics.totalRequests,
      icon: Users,
      color: "text-blue-600 bg-blue-100",
      description: "Todas as solicitações"
    },
    {
      title: "Pendentes",
      value: metrics.pendingRequests,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-100",
      description: "Aguardando aprovação"
    },
    {
      title: "Taxa de Aprovação",
      value: `${metrics.approvalRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
      description: "Solicitações aprovadas"
    },
    {
      title: "Tempo Médio",
      value: `${metrics.avgProcessingTime} dias`,
      icon: Timer,
      color: "text-purple-600 bg-purple-100",
      description: "Processamento médio"
    },
    {
      title: "Workflows Ativos",
      value: metrics.activeWorkflows,
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-100",
      description: "Templates em uso"
    },
    {
      title: "Em Atraso",
      value: metrics.overdueRequests,
      icon: AlertTriangle,
      color: "text-red-600 bg-red-100",
      description: "Solicitações atrasadas"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
    </div>
  );
};

export default WorkflowMetrics;