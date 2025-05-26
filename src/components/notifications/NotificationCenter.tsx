
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationTabs from "./NotificationTabs";
import NotificationSettings from "./NotificationSettings";

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [settings, setSettings] = useState({
    stockAlerts: true,
    performanceAlerts: true,
    employeeAlerts: true,
    systemAlerts: true
  });

  const { notifications, isLoading, markAsRead, generateStockAlerts } = useNotifications();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    if (settings.stockAlerts) {
      generateStockAlerts();
    }
  }, [settings.stockAlerts]);

  const handleMarkAllAsRead = () => {
    if (notifications) {
      notifications
        .filter(n => !n.read)
        .forEach(n => markAsRead(n.id));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Central de Notificações</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Acompanhe alertas e atualizações importantes
                </p>
              </div>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 px-3 py-1">
                  {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Marcar todas como lidas
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <NotificationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            notifications={notifications || []}
            isLoading={isLoading}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
          />
          
          <NotificationSettings
            settings={settings}
            onSettingsChange={setSettings}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
