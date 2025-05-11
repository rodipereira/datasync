
import NavBar from "@/components/NavBar";
import FileUpload from "@/components/FileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Upload de Dados</h1>
          <p className="text-gray-500">
            Envie seus arquivos para análise automática
          </p>
        </div>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
            <TabsTrigger value="history">Histórico de Uploads</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="grid gap-8 md:grid-cols-2">
              <FileUpload />
              
              <Card>
                <CardHeader>
                  <CardTitle>Instruções</CardTitle>
                  <CardDescription>
                    Como preparar seus arquivos para upload
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Formatos aceitos</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      <li>Excel (.xlsx, .xls)</li>
                      <li>CSV (.csv)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Tamanho máximo</h3>
                    <p className="text-sm text-gray-600">
                      Os arquivos devem ter no máximo 10MB cada.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Estrutura de dados</h3>
                    <p className="text-sm text-gray-600">
                      Para melhor análise, seus arquivos devem conter cabeçalhos claros e dados organizados.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Dados recomendados</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      <li>Vendas: data, produto, quantidade, valor</li>
                      <li>Estoque: produto, quantidade, localização</li>
                      <li>Clientes: nome, contato, histórico de compras</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Arquivos</CardTitle>
                <CardDescription>
                  Arquivos enviados previamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    Conecte seu backend para visualizar o histórico de uploads
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Templates Disponíveis</CardTitle>
                <CardDescription>
                  Use nossos modelos para organizar seus dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    Conecte seu backend para acessar templates predefinidos
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Upload;
