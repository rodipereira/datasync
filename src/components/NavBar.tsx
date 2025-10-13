
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Users, Package, Bell, FileText, Target, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications";
import CompactNotificationTabs from "./notifications/CompactNotificationTabs";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();
  
  const { notifications, isLoading, markAsRead } = useNotifications();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleLogout = async () => {
    try {
      // Sign out using Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Show success message
      toast.success("Logout realizado com sucesso!");
      
      // Redirect to login page
      navigate("/login");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer logout");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="text-primary font-bold text-xl">DataSync</div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/upload" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Upload
            </Link>
            <Link to="/employees" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Funcionários
            </Link>
            <Link to="/inventory" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventário
            </Link>
            <Link to="/reports" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </Link>
            <Link to="/goals" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metas
            </Link>
            <Link to="/workflow" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflows
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Perfil
            </Link>
            
            {/* Notificações Popover */}
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4 mr-2" />
                  Notificações
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0 bg-white border shadow-lg" align="end">
                <CompactNotificationTabs
                  notifications={notifications || []}
                  isLoading={isLoading}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" className="ml-4" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Notificações para mobile */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative mr-2">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-white border shadow-lg" align="end">
                <CompactNotificationTabs
                  notifications={notifications || []}
                  isLoading={isLoading}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/dashboard" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </Link>
            <Link to="/upload" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Upload
            </Link>
            <Link to="/employees" className="text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium">
              <Users className="h-4 w-4" />
              Funcionários
            </Link>
            <Link to="/inventory" className="text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium">
              <Package className="h-4 w-4" />
              Inventário
            </Link>
            <Link to="/reports" className="text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium">
              <FileText className="h-4 w-4" />
              Relatórios
            </Link>
            <Link to="/goals" className="text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium">
              <Target className="h-4 w-4" />
              Metas
            </Link>
            <Link to="/workflow" className="text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium">
              <Workflow className="h-4 w-4" />
              Workflows
            </Link>
            <Link to="/profile" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Perfil
            </Link>
            <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
