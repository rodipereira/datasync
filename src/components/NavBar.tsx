
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
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
            <Link to="/profile" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Perfil
            </Link>
            <Link to="/employees" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary/10">
              <Users className="h-4 w-4" />
              Funcionários
            </Link>
            <Button variant="outline" size="sm" className="ml-4" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
          
          <div className="md:hidden flex items-center">
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
            <Link to="/profile" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Perfil
            </Link>
            <Link to="/employees" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary/10">
              <Users className="h-4 w-4" />
              Funcionários
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
