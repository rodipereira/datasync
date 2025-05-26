
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings } from "lucide-react";
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
  );
};

export default NotificationCenter;
