
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

interface NotificationTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
}

const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
  notifications,
  isLoading,
  unreadCount,
  onMarkAsRead
}) => {
  const filteredNotifications = notifications?.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  }) || [];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-5 bg-secondary/30 p-1 h-12">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Todas
          </TabsTrigger>
          <TabsTrigger value="unread" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Não Lidas {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="warning" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Avisos
          </TabsTrigger>
          <TabsTrigger value="success" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Sucessos
          </TabsTrigger>
          <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Info
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Carregando notificações...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12 bg-secondary/20 rounded-lg border border-dashed">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Nenhuma notificação encontrada
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === "unread" 
                      ? "Todas as notificações foram lidas" 
                      : "Você não tem notificações no momento"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationTabs;
