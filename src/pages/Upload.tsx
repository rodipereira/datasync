
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
          <p className="text-muted-foreground">
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
              
              <Card className="dashboard-card border-green-500/15">
                <CardHeader>
                  <CardTitle className="text-white">Como Funciona o Processamento</CardTitle>
                  <CardDescription className="text-white/70">
                    O sistema identifica automaticamente o tipo de dados e importa para as tabelas corretas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-green-400 flex items-center gap-2">
                      ✅ Dados de Estoque
                    </h3>
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                      <p className="text-sm text-green-300 mb-2 font-medium">Colunas reconhecidas:</p>
                      <ul className="text-sm text-green-200 space-y-1">
                        <li>• <strong className="text-green-300">product_name / produto:</strong> Nome do produto</li>
                        <li>• <strong className="text-green-300">quantity / quantidade:</strong> Quantidade em estoque</li>
                        <li>• <strong className="text-green-300">minimum / mínimo:</strong> Nível mínimo</li>
                        <li>• <strong className="text-green-300">category / categoria:</strong> Categoria do produto</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-blue-400 flex items-center gap-2">
                      👥 Dados de Funcionários
                    </h3>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-300 mb-2 font-medium">Colunas reconhecidas:</p>
                      <ul className="text-sm text-blue-200 space-y-1">
                        <li>• <strong className="text-blue-300">name / nome:</strong> Nome do funcionário</li>
                        <li>• <strong className="text-blue-300">position / cargo:</strong> Cargo/posição</li>
                        <li>• <strong className="text-blue-300">hire_date / contratação:</strong> Data de contratação</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-amber-300 mb-2">Processamento Inteligente</h3>
                    <p className="text-sm text-amber-200">
                      O sistema detecta automaticamente se o arquivo contém dados de estoque ou funcionários
                      baseado nos nomes das colunas e importa os dados para as tabelas corretas.
                    </p>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-300 mb-2">Atualização em Tempo Real</h3>
                    <p className="text-sm text-blue-200">
                      Após o processamento, os dados aparecem automaticamente no dashboard, 
                      inventário e gerenciamento de funcionários sem necessidade de recarregar a página.
                    </p>
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
