
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BellOff, CheckCheck, Clock, AlertTriangle, InfoIcon } from "lucide-react";

// Tipos de notificação e suas características
type NotificationType = "info" | "warning" | "success" | "error";
type NotificationStatus = "read" | "unread";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  date: Date;
}

// Dados de exemplo para notificações
const demoNotifications: Notification[] = [
  {
    id: "1",
    title: "Estoque Baixo",
    message: "O produto 'Caneta Esferográfica' está com estoque abaixo do mínimo recomendado.",
    type: "warning",
    status: "unread",
    date: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
  },
  {
    id: "2",
    title: "Fatura Paga",
    message: "A fatura #12345 foi paga com sucesso pelo cliente Empresa ABC Ltda.",
    type: "success",
    status: "unread",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
  },
  {
    id: "3",
    title: "Nova Venda Registrada",
    message: "Uma nova venda no valor de R$ 1.250,00 foi registrada para o cliente João Silva.",
    type: "info",
    status: "read",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 horas atrás
  },
  {
    id: "4",
    title: "Erro de Sincronização",
    message: "Houve um erro ao sincronizar os dados com o servidor. Tente novamente mais tarde.",
    type: "error",
    status: "read",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 dia atrás
  },
  {
    id: "5",
    title: "Meta de Vendas Atingida",
    message: "Parabéns! A meta de vendas mensal foi atingida com sucesso.",
    type: "success",
    status: "read",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 dias atrás
  }
];

// Componente para formatar a data da notificação
const formatNotificationDate = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Agora mesmo";
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} horas atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Ontem";
  
  return `${diffInDays} dias atrás`;
};

// Ícone baseado no tipo de notificação
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "info":
      return <InfoIcon className="h-5 w-5 text-blue-500" />;
    case "success":
      return <CheckCheck className="h-5 w-5 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "error":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
  }
};

// Badge de tipo de notificação
const NotificationTypeBadge = ({ type }: { type: NotificationType }) => {
  const variants = {
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  
  const labels = {
    info: "Informação",
    success: "Sucesso",
    warning: "Aviso",
    error: "Erro"
  };
  
  return (
    <Badge className={variants[type]} variant="outline">
      {labels[type]}
    </Badge>
  );
};

// Card de notificação
const NotificationCard = ({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification, 
  onMarkAsRead: (id: string) => void 
}) => {
  return (
    <Card 
      className={`mb-4 overflow-hidden ${
        notification.status === "unread" 
          ? "border-l-4 border-l-primary" 
          : "opacity-80"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <NotificationIcon type={notification.type} />
            <CardTitle className="text-lg">{notification.title}</CardTitle>
          </div>
          <NotificationTypeBadge type={notification.type} />
        </div>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatNotificationDate(notification.date)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80">{notification.message}</p>
      </CardContent>
      {notification.status === "unread" && (
        <CardFooter>
          <Button
            variant="ghost" 
            size="sm" 
            className="ml-auto" 
            onClick={() => onMarkAsRead(notification.id)}
          >
            Marcar como lida
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  
  // Filtrar notificações baseado na aba ativa
  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => n.status === "unread");
    
  // Contar notificações não lidas
  const unreadCount = notifications.filter(n => n.status === "unread").length;
  
  // Marcar como lida
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, status: "read" as NotificationStatus } : n
    ));
  };
  
  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, status: "read" as NotificationStatus })));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold accent-text">Notificações</h1>
            <p className="text-muted-foreground">
              Acompanhe alertas e atualizações do sistema
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "unread")}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">
                Todas
              </TabsTrigger>
              <TabsTrigger value="unread">
                Não Lidas {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            {notifications.length === 0 ? (
              <EmptyNotifications />
            ) : (
              notifications.map(notification => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="unread">
            {filteredNotifications.length === 0 ? (
              <EmptyNotifications type="unread" />
            ) : (
              filteredNotifications.map(notification => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Componente para exibir quando não há notificações
const EmptyNotifications = ({ type = "all" }: { type?: "all" | "unread" }) => {
  return (
    <div className="text-center py-12 bg-secondary/30 rounded-lg border border-primary/20">
      <BellOff className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-medium">
        {type === "all" ? "Nenhuma notificação" : "Nenhuma notificação não lida"}
      </h3>
      <p className="mt-2 text-muted-foreground">
        {type === "all" 
          ? "Você não tem notificações para exibir no momento." 
          : "Todas as suas notificações foram marcadas como lidas."}
      </p>
    </div>
  );
};

export default Notifications;
