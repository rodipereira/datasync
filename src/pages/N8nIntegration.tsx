
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const N8nIntegration = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTestWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do seu webhook n8n",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Testando webhook n8n:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Para lidar com CORS
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
          action: "test",
        }),
      });

      // Como estamos usando no-cors, não vamos receber um status de resposta adequado
      toast({
        title: "Requisição Enviada",
        description: "O teste foi enviado para o n8n. Verifique a execução do seu workflow.",
      });
    } catch (error) {
      console.error("Erro ao acionar webhook:", error);
      toast({
        title: "Erro",
        description: "Falha ao testar o webhook do n8n. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Integração com n8n</h1>
          <p className="text-gray-500">
            Configure fluxos de trabalho automatizados para processar seus dados
          </p>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="setup">Configuração</TabsTrigger>
            <TabsTrigger value="examples">Exemplos</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Como Configurar o n8n</CardTitle>
                  <CardDescription>
                    Passos para integrar o n8n com sua aplicação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li className="text-sm text-gray-700">
                      <span className="font-medium">Instale o n8n</span>
                      <p className="text-gray-600 mt-1">
                        Instale o n8n localmente ou use a versão em nuvem em{" "}
                        <a href="https://n8n.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          n8n.io
                        </a>
                      </p>
                    </li>
                    <li className="text-sm text-gray-700">
                      <span className="font-medium">Crie um fluxo de trabalho</span>
                      <p className="text-gray-600 mt-1">
                        Comece com um nó de webhook e adicione os nós de processamento necessários para analisar seus arquivos.
                      </p>
                    </li>
                    <li className="text-sm text-gray-700">
                      <span className="font-medium">Configure um nó webhook</span>
                      <p className="text-gray-600 mt-1">
                        Crie um nó webhook para receber os arquivos enviados pela aplicação.
                      </p>
                    </li>
                    <li className="text-sm text-gray-700">
                      <span className="font-medium">Processe os dados</span>
                      <p className="text-gray-600 mt-1">
                        Adicione nós Python ou nós de planilha para processar os dados conforme suas necessidades.
                      </p>
                    </li>
                    <li className="text-sm text-gray-700">
                      <span className="font-medium">Conecte à aplicação</span>
                      <p className="text-gray-600 mt-1">
                        Utilize a URL do webhook do n8n na página de upload para enviar dados diretamente para o fluxo.
                      </p>
                    </li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Testar Conexão</CardTitle>
                  <CardDescription>
                    Verifique se a integração com n8n está funcionando
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleTestWebhook}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 mb-1">
                          URL do Webhook n8n
                        </label>
                        <Input
                          id="webhook-url"
                          placeholder="https://your-n8n-instance.com/webhook/..."
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Cole a URL do webhook gerado pelo nó webhook do n8n
                        </p>
                      </div>
                      
                      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                        {isLoading ? "Testando..." : "Testar Webhook"}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h4 className="text-sm font-medium mb-2">Como usar com a página de Upload</h4>
                    <p className="text-sm text-gray-600">
                      Depois de testar a conexão, copie a URL do webhook e cole-a na página de Upload como URL de destino para enviar arquivos diretamente para o n8n.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>Exemplos de Fluxos no n8n</CardTitle>
                <CardDescription>
                  Modelos de workflows para análise de dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-base mb-2">Análise de Vendas</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Fluxo de trabalho para processar arquivos CSV/Excel de vendas e gerar relatórios.
                    </p>
                    <ol className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      <li>Webhook recebe o arquivo</li>
                      <li>Nó Python extrai e processa os dados</li>
                      <li>Análise identifica tendências de vendas</li>
                      <li>Gera relatório em PDF</li>
                      <li>Envia por email ou armazena em Google Drive</li>
                    </ol>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-base mb-2">Monitoramento de Estoque</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Fluxo para análise de níveis de estoque e alertas automáticos.
                    </p>
                    <ol className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      <li>Processa arquivo de estoque</li>
                      <li>Compara com níveis ideais</li>
                      <li>Gera alertas para itens com baixo estoque</li>
                      <li>Calcula sugestões de reposição</li>
                      <li>Envia resumo para responsáveis</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-base mb-2">Análise de Clientes</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Fluxo para segmentação e análise de comportamento de clientes.
                    </p>
                    <ol className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      <li>Processa dados de clientes e vendas</li>
                      <li>Segmenta por frequência, valor e recência</li>
                      <li>Identifica clientes VIP e inativos</li>
                      <li>Cria relatórios de oportunidades</li>
                      <li>Exporta segmentos para ferramenta de marketing</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Webhooks</CardTitle>
                <CardDescription>
                  Como criar e gerenciar webhooks no n8n
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Dica importante</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Para uso em desenvolvimento local, você pode usar o n8n.cloud ou ferramentas como ngrok 
                            para criar um túnel para sua instância local e ter uma URL pública.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Como criar um webhook no n8n:</h3>
                    <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-3">
                      <li>
                        <p className="font-medium">Crie um novo fluxo de trabalho no n8n</p>
                        <p className="text-gray-600">Acesse o painel do n8n e crie um novo workflow.</p>
                      </li>
                      <li>
                        <p className="font-medium">Adicione um nó "Webhook"</p>
                        <p className="text-gray-600">Nos nós, pesquise por "Webhook" e adicione-o como nó inicial.</p>
                      </li>
                      <li>
                        <p className="font-medium">Configure o webhook</p>
                        <p className="text-gray-600">
                          Selecione o método HTTP (POST para receber arquivos), configure
                          autenticação se necessário e defina o caminho do webhook.
                        </p>
                      </li>
                      <li>
                        <p className="font-medium">Ative o webhook</p>
                        <p className="text-gray-600">
                          Salve o workflow, ative-o e copie a URL do webhook gerada.
                        </p>
                      </li>
                      <li>
                        <p className="font-medium">Adicione a lógica de processamento</p>
                        <p className="text-gray-600">
                          Conecte outros nós para processar os arquivos recebidos (Python, CSV, Google Sheets, etc.).
                        </p>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <h3 className="font-medium">Estrutura recomendada para automação:</h3>
                    <div className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs">
                        {`// Exemplo de fluxo no n8n
[Webhook] → [Extract File Data] → [Python (análise)] → [Decision]
    ↓              ↓                    ↓               ↓
[Validar]    [Processar CSV]     [Gerar Relatório]   → [Google Sheets] 
                                                      → [Email]
                                                      → [Storage]`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default N8nIntegration;
