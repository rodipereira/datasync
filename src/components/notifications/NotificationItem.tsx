
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle,
  X
} from "lucide-react";

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error': return <X className="h-4 w-4 text-red-500" />;
    default: return <Bell className="h-4 w-4 text-blue-500" />;
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  return (
    <div
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        notification.read 
          ? 'bg-gray-50 border-gray-200' 
          : 'bg-white border-primary/20 shadow-sm'
      }`}
      onClick={() => {
        if (!notification.read) {
          onMarkAsRead(notification.id);
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
  );
};

export default NotificationItem;
