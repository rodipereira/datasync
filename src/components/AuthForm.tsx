
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: any) => void;
}

const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
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
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
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
      
      <Button type="submit" className="w-full">
        {type === "login" ? "Entrar" : "Registrar"}
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
