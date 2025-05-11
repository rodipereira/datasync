
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthForm from "@/components/AuthForm";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (data: any) => {
    console.log("Login tentado com:", data);
    
    // Simular um login bem-sucedido (aqui você integraria com seu backend)
    setTimeout(() => {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    }, 1000);
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
          <AuthForm type="login" onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
