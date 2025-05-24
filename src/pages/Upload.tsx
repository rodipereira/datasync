
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
          <h1 className="text-2xl font-bold accent-text">Upload e Processamento de Dados</h1>
          <p className="text-gray-400">
            Envie seus arquivos para importação automática de dados de estoque e funcionários
          </p>
        </div>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="mb-8 bg-secondary/50">
            <TabsTrigger value="upload" className="data-[state=active]:bg-primary/80">Upload e Processamento</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary/80">Histórico de Uploads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="grid gap-8 md:grid-cols-2">
              <FileUpload />
              
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Como Funciona o Processamento</CardTitle>
                  <CardDescription>
                    O sistema identifica automaticamente o tipo de dados e importa para as tabelas corretas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-green-600">✅ Dados de Estoque</h3>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800 mb-2">Colunas reconhecidas:</p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• <strong>product_name / produto:</strong> Nome do produto</li>
                        <li>• <strong>quantity / quantidade:</strong> Quantidade em estoque</li>
                        <li>• <strong>minimum / mínimo:</strong> Nível mínimo</li>
                        <li>• <strong>category / categoria:</strong> Categoria do produto</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-blue-600">👥 Dados de Funcionários</h3>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">Colunas reconhecidas:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• <strong>name / nome:</strong> Nome do funcionário</li>
                        <li>• <strong>position / cargo:</strong> Cargo/posição</li>
                        <li>• <strong>hire_date / contratação:</strong> Data de contratação</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-amber-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Processamento Inteligente</h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            O sistema detecta automaticamente se o arquivo contém dados de estoque ou funcionários
                            baseado nos nomes das colunas e importa os dados para as tabelas corretas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Atualização em Tempo Real</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Após o processamento, os dados aparecem automaticamente no dashboard, 
                            inventário e gerenciamento de funcionários sem necessidade de recarregar a página.
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
