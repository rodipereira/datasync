
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTypewriterEffect } from "@/hooks/useTypewriterEffect";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { displayedText, isTyping } = useTypewriterEffect({
    text: "Transforme seus dados em insights poderosos para o seu negócio",
    speedFactor: 0.8
  });

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
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold accent-text">DataSync</h1>
        </motion.div>
        
        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="mt-2 text-3xl font-bold">
              Crie sua conta
            </h2>
            <p className="mt-2 h-16 text-muted-foreground">
              {displayedText}
              {isTyping && <span className="inline-block ml-1 w-1.5 h-5 bg-primary animate-pulse" />}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.4,
              type: "spring",
              stiffness: 100
            }}
            className="glass-card p-8 rounded-xl shadow-lg backdrop-blur-sm"
          >
            <AuthForm type="register" onSubmit={handleRegister} isLoading={isLoading} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-sm text-muted-foreground"
          >
            Ao se registrar, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:underline">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="text-primary hover:underline">
              Política de Privacidade
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
