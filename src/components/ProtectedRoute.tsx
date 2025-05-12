
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const userData = localStorage.getItem("userData");
    
    if (!userData) {
      // Se não estiver autenticado, redireciona para o login
      navigate("/login");
    }
  }, [navigate]);

  // Se chegou aqui, o usuário está autenticado, renderiza o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;
