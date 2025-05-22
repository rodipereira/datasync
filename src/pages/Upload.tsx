
import NavBar from "@/components/NavBar";
import FileUpload from "@/components/FileUpload";
import FileHistory from "@/components/FileHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Upload = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold accent-text">Upload de Dados</h1>
          <p className="text-gray-400">
            Envie seus arquivos para análise automática
          </p>
        </div>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="mb-8 bg-secondary/50">
            <TabsTrigger value="upload" className="data-[state=active]:bg-primary/80">Upload de Arquivos</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary/80">Histórico de Uploads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="grid gap-8 md:grid-cols-2">
              <FileUpload />
              
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Instruções</CardTitle>
                  <CardDescription>
                    Como preparar seus arquivos para upload
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Formatos aceitos</h3>
                    <ul className="list-disc pl-5 text-sm text-foreground/70 space-y-1">
                      <li>Excel (.xlsx, .xls)</li>
                      <li>CSV (.csv)</li>
                      <li>PDF (.pdf)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Tamanho máximo</h3>
                    <p className="text-sm text-foreground/70">
                      Os arquivos devem ter no máximo 10MB cada.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Estrutura de dados</h3>
                    <p className="text-sm text-foreground/70">
                      Para melhor análise, seus arquivos devem conter cabeçalhos claros e dados organizados.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Após o Upload</h3>
                    <p className="text-sm text-foreground/70">
                      Cada arquivo enviado será processado automaticamente. O relatório de 
                      análise em PDF estará disponível para download na aba "Histórico de Uploads".
                    </p>
                  </div>

                  <div className="rounded-md bg-primary/10 p-4 mt-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-primary">Importante</h3>
                        <div className="mt-2 text-sm text-foreground/80">
                          <p>
                            Os resultados da análise podem levar alguns minutos para serem gerados, dependendo
                            do tamanho e complexidade dos dados.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <FileHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Upload;
