
import NavBar from "@/components/NavBar";
import ProfileForm from "@/components/profile/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PasswordReset from "@/components/profile/PasswordReset";
import { exportReport } from "@/utils/exportUtils";
import { toast } from "sonner";

const Profile = () => {
  const handleExportData = async () => {
    try {
      // Mock data for demonstration purposes
      const userData = [
        { id: 1, name: "Perfil Pessoal", email: "usuario@exemplo.com" },
        { id: 2, name: "Configurações", valor: "Tema escuro" },
        { id: 3, name: "Preferências", valor: "Ativado" },
      ];
      
      await exportReport(userData, "dados_usuario");
      
      toast.success("Dados exportados com sucesso!", {
        description: "Seu arquivo foi baixado."
      });
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Falha ao exportar dados");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 accent-text">Perfil do Usuário</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 bg-secondary/50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/80">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary/80">Segurança</TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-primary/80">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie sua senha e as configurações de segurança da conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alterar senha</h3>
                  <p className="text-sm text-foreground/70">
                    Por razões de segurança, recomendamos que você altere sua senha periodicamente
                  </p>
                  <PasswordReset />
                </div>
                
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-lg font-medium">Autenticação em duas etapas</h3>
                  <p className="text-sm text-foreground/70">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                  <Button variant="outline">Configurar autenticação em duas etapas</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>
                  Configure suas preferências na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificações</h3>
                  <p className="text-sm text-foreground/70">
                    Configure como e quando deseja receber notificações
                  </p>
                  <Button variant="outline">Gerenciar notificações</Button>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-lg font-medium">Exportação de dados</h3>
                  <p className="text-sm text-foreground/70">
                    Baixe um relatório com todos os seus dados
                  </p>
                  <Button variant="outline" onClick={handleExportData}>Exportar dados</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
