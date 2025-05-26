
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Users, 
  CheckCircle,
  X,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [settings, setSettings] = useState({
    stockAlerts: true,
    performanceAlerts: true,
    employeeAlerts: true,
    systemAlerts: true
  });

  const queryClient = useQueryClient();

  // Buscar notificações
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Por enquanto vamos simular notificações até criar a tabela
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "warning",
          title: "Estoque Baixo",
          message: "5 produtos estão com estoque abaixo do nível mínimo",
          read: false,
          created_at: new Date().toISOString(),
          action_url: "/inventory"
        },
        {
          id: "2",
          type: "success",
          title: "Meta Atingida",
          message: "Parabéns! Você atingiu 95% da meta mensal",
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "3",
          type: "info",
          title: "Novo Funcionário",
          message: "João Silva foi adicionado à equipe",
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      return mockNotifications;
    },
  });

  // Marcar como lida
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // Aqui implementaria a atualização no banco
      console.log("Marking as read:", notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  // Gerar notificações automáticas baseadas no estoque
  const generateStockAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: inventory } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id)
      .lt("quantity", 5); // Usando comparação direta em vez de supabase.raw

    if (inventory && inventory.length > 0) {
      toast.warning(`${inventory.length} produtos com estoque baixo!`);
    }
  };

  useEffect(() => {
    if (settings.stockAlerts) {
      generateStockAlerts();
    }
  }, [settings.stockAlerts]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  }) || [];

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unread">
              Não Lidas {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="warning">Avisos</TabsTrigger>
            <TabsTrigger value="success">Sucessos</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma notificação encontrada
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-white border-primary/20 shadow-sm'
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsReadMutation.mutate(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              notification.read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${
                            notification.read ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          {notification.action_url && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 h-auto mt-2"
                            >
                              Ver detalhes →
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Configurações de Notificação */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-3">Configurações de Alerta</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Alertas de Estoque
              </Label>
              <Switch
                checked={settings.stockAlerts}
                onCheckedChange={(checked) => 
                  setSettings({...settings, stockAlerts: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Alertas de Performance
              </Label>
              <Switch
                checked={settings.performanceAlerts}
                onCheckedChange={(checked) => 
                  setSettings({...settings, performanceAlerts: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Alertas de Funcionários
              </Label>
              <Switch
                checked={settings.employeeAlerts}
                onCheckedChange={(checked) => 
                  setSettings({...settings, employeeAlerts: checked})
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
