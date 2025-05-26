
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <Tabs value={activeTab} onValueChange={onTabChange}>
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
  );
};

export default NotificationTabs;
