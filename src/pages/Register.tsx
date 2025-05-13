
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Register using Supabase authentication
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            company: data.company
          },
        },
      });
      
      if (error) {
        throw error;
      }

      // Success
      toast.success("Registro realizado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar usuário");
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
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os campos abaixo para começar a usar a plataforma
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow">
          <AuthForm type="register" onSubmit={handleRegister} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Register;
