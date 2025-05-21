
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, LineChart, Upload, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background pointer-events-none" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 accent-text">
              DataSync
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-foreground/80">
              Aplicação para automação de organização de arquivos e análise 
              de desempenho de negócios
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-primary/20"
                onClick={() => navigate("/login")}
              >
                Entrar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg bg-secondary/50 hover:bg-secondary px-8 py-6 rounded-xl"
                onClick={() => navigate("/register")}
              >
                Registrar
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gradient-to-t from-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 accent-text">
            Recursos Principais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center dashboard-card hover:translate-y-[-5px] transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 accent-text">Análise de Dados</h3>
              <p className="text-foreground/70">
                Visualize métricas de vendas, estoque e clientes em um dashboard intuitivo e 
                tome decisões baseadas em dados reais.
              </p>
            </Card>
            
            <Card className="p-8 text-center dashboard-card hover:translate-y-[-5px] transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 accent-text">Upload de Arquivos</h3>
              <p className="text-foreground/70">
                Envie planilhas e automatize a organização e classificação dos seus dados
                para análise rápida e eficiente.
              </p>
            </Card>
            
            <Card className="p-8 text-center dashboard-card hover:translate-y-[-5px] transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 accent-text">Relatórios</h3>
              <p className="text-foreground/70">
                Gere relatórios detalhados para identificar oportunidades e otimizar 
                sua gestão com insights valiosos.
              </p>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 accent-text">
              Pronto para melhorar seu negócio?
            </h2>
            <p className="text-xl mb-10 text-foreground/80">
              Comece hoje mesmo a utilizar o DataSync e transforme a forma como você gerencia seus dados.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-primary/20"
              onClick={() => navigate("/register")}
            >
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
