
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Login using Supabase authentication
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        throw error;
      }

      // Success
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">DataSync</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Bem-vindo(a) de volta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entre com sua conta para acessar o dashboard
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow">
          <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Login;
