
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  LineChart, 
  Upload, 
  FileText, 
  Star, 
  CheckCircle, 
  HelpCircle,
  BarChart,
  Users,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Shield,
  ListOrdered
} from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

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

      {/* How It Works Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 accent-text">
            Como Funciona
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col items-center md:items-end">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative z-10">
                    <ListOrdered className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full transform translate-x-2 translate-y-2 rounded-full bg-primary/10 -z-10"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 accent-text text-center md:text-right">Carregue Seus Dados</h3>
                <p className="text-foreground/70 text-center md:text-right">
                  Faça o upload de planilhas ou conecte fontes de dados diretamente na plataforma.
                </p>
              </div>
              
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative z-10">
                    <BarChart className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full transform translate-x-2 translate-y-2 rounded-full bg-primary/10 -z-10"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 accent-text text-center md:text-left">Análise Automática</h3>
                <p className="text-foreground/70 text-center md:text-left">
                  Nossa plataforma processa e organiza seus dados automaticamente para análises precisas.
                </p>
              </div>
              
              <div className="flex flex-col items-center md:items-end">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative z-10">
                    <LineChart className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full transform translate-x-2 translate-y-2 rounded-full bg-primary/10 -z-10"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 accent-text text-center md:text-right">Visualize Resultados</h3>
                <p className="text-foreground/70 text-center md:text-right">
                  Acesse dashboards interativos com gráficos e métricas personalizáveis.
                </p>
              </div>
              
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative z-10">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full transform translate-x-2 translate-y-2 rounded-full bg-primary/10 -z-10"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 accent-text text-center md:text-left">Tome Decisões</h3>
                <p className="text-foreground/70 text-center md:text-left">
                  Utilize insights baseados em dados para tomar decisões estratégicas para seu negócio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-t from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 accent-text">
            Resultados Impressionantes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-8 text-center rounded-xl bg-gradient-to-br from-primary/10 to-background border border-primary/10 shadow-lg">
              <div className="text-4xl font-bold mb-2 accent-text">98%</div>
              <p className="text-foreground/70">Satisfação dos clientes</p>
            </div>
            
            <div className="p-8 text-center rounded-xl bg-gradient-to-br from-primary/10 to-background border border-primary/10 shadow-lg">
              <div className="text-4xl font-bold mb-2 accent-text">30%</div>
              <p className="text-foreground/70">Aumento de produtividade</p>
            </div>
            
            <div className="p-8 text-center rounded-xl bg-gradient-to-br from-primary/10 to-background border border-primary/10 shadow-lg">
              <div className="text-4xl font-bold mb-2 accent-text">50+</div>
              <p className="text-foreground/70">Formatos compatíveis</p>
            </div>
            
            <div className="p-8 text-center rounded-xl bg-gradient-to-br from-primary/10 to-background border border-primary/10 shadow-lg">
              <div className="text-4xl font-bold mb-2 accent-text">5min</div>
              <p className="text-foreground/70">Tempo médio de análise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 accent-text">
            O Que Dizem Nossos Clientes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 dashboard-card hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-1 text-primary mb-4">
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
              </div>
              <p className="text-foreground/80 mb-6 italic">
                "O DataSync transformou completamente nossa análise de dados. Economizamos horas todas as semanas e conseguimos insights que eram impossíveis antes."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Ana Silva</h4>
                  <p className="text-sm text-foreground/60">CEO, TechSolutions</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-8 dashboard-card hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-1 text-primary mb-4">
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
              </div>
              <p className="text-foreground/80 mb-6 italic">
                "A facilidade de uso e os relatórios personalizáveis são incomparáveis. Conseguimos identificar tendências que mudaram completamente nossa estratégia."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Carlos Mendes</h4>
                  <p className="text-sm text-foreground/60">CFO, RetailGroup</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-8 dashboard-card hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-1 text-primary mb-4">
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
                <Star className="fill-primary" size={20} />
              </div>
              <p className="text-foreground/80 mb-6 italic">
                "O suporte ao cliente é excepcional. Sempre que temos dúvidas, a equipe está pronta para ajudar. O DataSync superou todas as nossas expectativas."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Júlia Costa</h4>
                  <p className="text-sm text-foreground/60">COO, LogisticsPro</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-20 bg-gradient-to-t from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 accent-text">
            Perguntas Frequentes
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-primary/10">
                <AccordionTrigger className="py-5 text-xl font-medium hover:text-primary">
                  Como começar a usar o DataSync?
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-foreground/80">
                  Para começar, basta criar uma conta na plataforma, fazer login e começar a fazer upload dos seus arquivos. Nossa interface intuitiva guiará você pelo processo passo a passo.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-primary/10">
                <AccordionTrigger className="py-5 text-xl font-medium hover:text-primary">
                  Quais tipos de arquivos são compatíveis?
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-foreground/80">
                  O DataSync é compatível com diversos formatos, incluindo Excel (XLS, XLSX), CSV, PDF com tabelas, JSON, XML e muito mais. Se você tiver um formato específico, entre em contato com nossa equipe de suporte.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-primary/10">
                <AccordionTrigger className="py-5 text-xl font-medium hover:text-primary">
                  Como garantimos a segurança dos dados?
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-foreground/80">
                  Todos os dados são criptografados usando padrões de segurança de nível bancário. Temos certificações de segurança atualizadas e realizamos auditorias regulares para garantir a proteção completa das suas informações.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b border-primary/10">
                <AccordionTrigger className="py-5 text-xl font-medium hover:text-primary">
                  Posso personalizar os relatórios?
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-foreground/80">
                  Sim, o DataSync oferece amplas opções de personalização para seus relatórios e dashboards. Você pode selecionar métricas específicas, ajustar visualizações e criar templates para uso recorrente.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b border-primary/10">
                <AccordionTrigger className="py-5 text-xl font-medium hover:text-primary">
                  O DataSync oferece integração com outros sistemas?
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-foreground/80">
                  Sim, oferecemos integrações com diversos sistemas ERP, CRM, plataformas de e-commerce e ferramentas de marketing. Nossa API também permite desenvolver integrações personalizadas para necessidades específicas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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

      {/* Footer */}
      <footer className="bg-secondary py-10 text-foreground/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">DataSync</h3>
              <p className="mb-4">
                Transforme seus dados em decisões estratégicas com nossa plataforma completa de análise e organização.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate("/login")} className="hover:text-primary transition-colors">Login</button></li>
                <li><button onClick={() => navigate("/register")} className="hover:text-primary transition-colors">Registrar</button></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Funcionalidades</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Atualizações</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  <a href="mailto:contato@datasync.com" className="hover:text-primary transition-colors">contato@datasync.com</a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  <a href="tel:+55119999-9999" className="hover:text-primary transition-colors">+55 11 9999-9999</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">© 2023 DataSync. Todos os direitos reservados.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm hover:text-primary transition-colors">Termos de Uso</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Privacidade</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
