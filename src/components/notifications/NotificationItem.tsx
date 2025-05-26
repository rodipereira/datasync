
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle,
  X,
  ExternalLink
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
    case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error': return <X className="h-5 w-5 text-red-500" />;
    default: return <Bell className="h-5 w-5 text-blue-500" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'success': return 'bg-green-100 text-green-800 border-green-200';
    case 'error': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'warning': return 'Aviso';
    case 'success': return 'Sucesso';
    case 'error': return 'Erro';
    default: return 'Info';
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div
      className={`p-6 rounded-lg border transition-all hover:shadow-md ${
        notification.read 
          ? 'bg-gray-50/50 border-gray-200' 
          : 'bg-white border-primary/20 shadow-sm ring-1 ring-primary/10'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <h4 className={`font-semibold text-base ${
                notification.read ? 'text-gray-600' : 'text-gray-900'
              }`}>
                {notification.title}
              </h4>
              <Badge 
                variant="outline" 
                className={`text-xs ${getTypeColor(notification.type)}`}
              >
                {getTypeLabel(notification.type)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500">
                {formatTime(notification.created_at)}
              </span>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
          </div>
          
          <p className={`text-sm leading-relaxed mb-4 ${
            notification.read ? 'text-gray-500' : 'text-gray-700'
          }`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              {notification.action_url && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ver detalhes
                </Button>
              )}
            </div>
            
            {!notification.read && (
              <Button
                variant="ghost" 
                size="sm" 
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs hover:bg-primary/10"
              >
                Marcar como lida
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
