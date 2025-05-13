
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const AuthForm = ({ type, onSubmit, isLoading = false }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = type === "login" 
      ? { email, password } 
      : { email, password, name, company };
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {type === "register" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Digite seu nome completo" 
              required 
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input 
              id="company" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)} 
              placeholder="Digite o nome da sua empresa" 
              required 
              disabled={isLoading}
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="pl-10" 
            placeholder="Digite seu email" 
            required 
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="pl-10" 
            placeholder="Digite sua senha" 
            required 
            disabled={isLoading}
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      {type === "login" && (
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Esqueceu sua senha?
          </Link>
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {type === "login" ? "Entrando..." : "Registrando..."}
          </span>
        ) : (
          type === "login" ? "Entrar" : "Registrar"
        )}
      </Button>
      
      <div className="text-center text-sm text-gray-500">
        {type === "login" ? (
          <p>
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Registre-se
            </Link>
          </p>
        ) : (
          <p>
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Entre aqui
            </Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
