import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface RealTimeMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
  unit?: string;
  target?: number;
  description: string;
}

interface ActivityLog {
  id: string;
  timestamp: Date;
  action: string;
  user?: string;
  impact: 'high' | 'medium' | 'low';
  category: 'sales' | 'inventory' | 'user' | 'system';
}

const RealTimeAnalytics = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [realtimeData, setRealtimeData] = useState<number[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate new data point
      setRealtimeData(prev => {
        const newValue = Math.floor(Math.random() * 100) + 50;
        return [...prev.slice(-19), newValue]; // Keep last 20 points
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const realTimeMetrics: RealTimeMetric[] = [
    {
      id: "active_users",
      title: "Usuários Ativos",
      value: 127,
      change: 8.2,
      trend: 'up',
      status: 'normal',
      description: "Usuários online no sistema"
    },
    {
      id: "sales_today",
      title: "Vendas Hoje",
      value: "R$ 15.847",
      change: -2.1,
      trend: 'down',
      status: 'warning',
      target: 18000,
      description: "Receita acumulada no dia"
    },
    {
      id: "conversion_rate",
      title: "Taxa de Conversão",
      value: "3.2%",
      change: 12.5,
      trend: 'up',
      status: 'normal',
      description: "Visitantes que realizaram compra"
    },
    {
      id: "avg_response_time",
      title: "Tempo de Resposta",
      value: "1.2s",
      change: 15.3,
      trend: 'down',
      status: 'critical',
      target: 2,
      unit: "s",
      description: "Tempo médio de resposta do sistema"
    },
    {
      id: "cart_abandonment",
      title: "Abandono do Carrinho",
      value: "23.5%",
      change: -5.2,
      trend: 'up',
      status: 'warning',
      description: "Taxa de carrinhos abandonados"
    },
    {
      id: "error_rate",
      title: "Taxa de Erro",
      value: "0.3%",
      change: 45.2,
      trend: 'down',
      status: 'critical',
      description: "Porcentagem de requisições com erro"
    }
  ];

  const activityLogs: ActivityLog[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 2 * 60000),
      action: "Nova venda de R$ 285,90 processada",
      user: "Cliente #1247",
      impact: 'medium',
      category: 'sales'
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 5 * 60000),
      action: "Estoque baixo detectado: Produto #SKU789",
      impact: 'high',
      category: 'inventory'
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 8 * 60000),
      action: "Novo usuário registrado",
      user: "user@email.com",
      impact: 'low',
      category: 'user'
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 12 * 60000),
      action: "Backup automático executado com sucesso",
      impact: 'low',
      category: 'system'
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 15 * 60000),
      action: "Pico de tráfego detectado (+150%)",
      impact: 'high',
      category: 'system'
    }
  ];

  // Generate chart data for real-time visualization
  const chartData = realtimeData.map((value, index) => ({
    time: `${index}s`,
    value: value
  }));

  const getStatusColor = (status: RealTimeMetric['status']) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const getTrendIcon = (trend: RealTimeMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getActivityIcon = (category: ActivityLog['category']) => {
    switch (category) {
      case 'sales': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'inventory': return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'user': return <Users className="h-4 w-4 text-purple-600" />;
      case 'system': return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: ActivityLog['impact']) => {
    switch (impact) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Analytics em Tempo Real
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                Atualizado {formatTimeAgo(lastUpdate)}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLastUpdate(new Date())}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {realTimeMetrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status === 'normal' && 'Normal'}
                  {metric.status === 'warning' && 'Atenção'}
                  {metric.status === 'critical' && 'Crítico'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {getTrendIcon(metric.trend)}
                    <span className={
                      metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                {metric.status === 'critical' && (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Real-time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tráfego em Tempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Log de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activityLogs.map((log) => (
                <div 
                  key={log.id}
                  className={`p-3 border-l-4 rounded-r-lg bg-muted/50 ${getImpactColor(log.impact)}`}
                >
                  <div className="flex items-start gap-3">
                    {getActivityIcon(log.category)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      {log.user && (
                        <p className="text-xs text-muted-foreground">{log.user}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(log.timestamp)}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        log.impact === 'high' ? 'border-red-300 text-red-700' :
                        log.impact === 'medium' ? 'border-yellow-300 text-yellow-700' :
                        'border-green-300 text-green-700'
                      }
                    >
                      {log.impact === 'high' ? 'Alto' : 
                       log.impact === 'medium' ? 'Médio' : 'Baixo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Saúde do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <p className="text-sm text-muted-foreground">Resp. Média</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">45GB</div>
              <p className="text-sm text-muted-foreground">Dados Processados</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2.1K</div>
              <p className="text-sm text-muted-foreground">Req/min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;