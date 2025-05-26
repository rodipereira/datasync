
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  TrendingUp, 
  Users
} from "lucide-react";

interface NotificationSettingsProps {
  settings: {
    stockAlerts: boolean;
    performanceAlerts: boolean;
    employeeAlerts: boolean;
    systemAlerts: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  return (
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
              onSettingsChange({...settings, stockAlerts: checked})
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
              onSettingsChange({...settings, performanceAlerts: checked})
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
              onSettingsChange({...settings, employeeAlerts: checked})
            }
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
