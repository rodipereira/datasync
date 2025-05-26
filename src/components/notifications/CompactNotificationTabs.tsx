
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
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

interface CompactNotificationTabsProps {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
}

const CompactNotificationTabs: React.FC<CompactNotificationTabsProps> = ({
  notifications,
  isLoading,
  unreadCount,
  onMarkAsRead
}) => {
  const [activeTab, setActiveTab] = useState<string>("unread");

  const filteredNotifications = notifications?.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  }) || [];

  const handleMarkAllAsRead = () => {
    notifications
      .filter(n => !n.read)
      .forEach(n => onMarkAsRead(n.id));
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList className="grid grid-cols-2 h-8 w-32">
            <TabsTrigger value="unread" className="text-xs">
              Novas {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs">
              Todas
            </TabsTrigger>
          </TabsList>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs h-6 px-2"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-80">
            <div className="p-2 space-y-2">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-xs text-muted-foreground mt-2">Carregando...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "unread" 
                      ? "Nenhuma notificação nova" 
                      : "Nenhuma notificação"}
                  </p>
                </div>
              ) : (
                filteredNotifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-medium truncate ${
                            notification.read ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className={`text-xs leading-tight line-clamp-2 ${
                          notification.read ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {new Date(notification.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-xs h-5 px-2 hover:bg-primary/10"
                            >
                              Marcar como lida
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {filteredNotifications.length > 5 && (
                <div className="text-center py-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Ver todas as notificações
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompactNotificationTabs;
