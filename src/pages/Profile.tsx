
import NavBar from "@/components/NavBar";
import ProfileForm from "@/components/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Perfil do Usuário</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie sua senha e as configurações de segurança da conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alterar senha</h3>
                  <p className="text-sm text-gray-500">
                    Por razões de segurança, recomendamos que você altere sua senha periodicamente
                  </p>
                  <Button variant="outline">Alterar senha</Button>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Autenticação em duas etapas</h3>
                  <p className="text-sm text-gray-500">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                  <Button variant="outline">Configurar autenticação em duas etapas</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>
                  Configure suas preferências na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificações</h3>
                  <p className="text-sm text-gray-500">
                    Configure como e quando deseja receber notificações
                  </p>
                  <Button variant="outline">Gerenciar notificações</Button>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Exportação de dados</h3>
                  <p className="text-sm text-gray-500">
                    Baixe um relatório com todos os seus dados
                  </p>
                  <Button variant="outline">Exportar dados</Button>
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
