
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FileType, Database, CheckCircle } from "lucide-react";

const N8nIntegration = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pythonScript, setPythonScript] = useState(`# Exemplo de script Python para análise de dados
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def analise_dados(arquivo_path):
    # Carregar dados
    dados = pd.read_csv(arquivo_path)
    
    # Análise básica
    resumo = dados.describe()
    
    # Cálculos estatísticos
    media = dados.mean()
    mediana = dados.median()
    desvio = dados.std()
    
    # Plotar um gráfico
    plt.figure(figsize=(10,6))
    for coluna in dados.select_dtypes(include=[np.number]).columns:
        plt.plot(dados[coluna], label=coluna)
    plt.legend()
    plt.title('Análise de Variáveis ao Longo do Tempo')
    plt.savefig('analise_grafico.png')
    
    return {
        'resumo': resumo,
        'media': media,
        'desvio': desvio,
        'grafico': 'analise_grafico.png'
    }

# Este script pode ser executado no n8n através de um nó Python`);

  const handleTestWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast("Erro", {
        description: "Por favor, insira a URL do seu webhook n8n"
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
      toast("Requisição Enviada", {
        description: "O teste foi enviado para o n8n. Verifique a execução do seu workflow."
      });
    } catch (error) {
      console.error("Erro ao acionar webhook:", error);
      toast("Erro", {
        description: "Falha ao testar o webhook do n8n. Verifique a URL e tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPython = () => {
    navigator.clipboard.writeText(pythonScript);
    toast("Copiado", {
      description: "Script Python copiado para a área de transferência."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold accent-text">Integração com n8n e Python</h1>
          <p className="text-gray-400">
            Configure fluxos de trabalho automatizados para processar seus dados com Python
          </p>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="mb-8 bg-secondary/50">
            <TabsTrigger value="setup" className="data-[state=active]:bg-primary/80">
              Configuração
            </TabsTrigger>
            <TabsTrigger value="python" className="data-[state=active]:bg-primary/80">
              Python
            </TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-primary/80">
              Exemplos
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="data-[state=active]:bg-primary/80">
              Webhooks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="dashboard-chart">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Como Configurar o n8n</CardTitle>
                  <CardDescription className="text-gray-300">
                    Passos para integrar o n8n com sua aplicação e scripts Python
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-white">Instale o n8n</span>
                      <p className="text-gray-300 mt-1">
                        Instale o n8n localmente ou use a versão em nuvem em{" "}
                        <a href="https://n8n.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          n8n.io
                        </a>
                      </p>
                    </li>
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-white">Crie um fluxo de trabalho</span>
                      <p className="text-gray-300 mt-1">
                        Comece com um nó de webhook e adicione os nós de processamento necessários para analisar seus arquivos.
                      </p>
                    </li>
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-white">Configure um nó Python</span>
                      <p className="text-gray-300 mt-1">
                        Adicione um nó Python para executar scripts personalizados de análise de dados para seu TCC.
                      </p>
                    </li>
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-white">Processe os dados</span>
                      <p className="text-gray-300 mt-1">
                        Use bibliotecas como Pandas, NumPy e Matplotlib para análise estatística e visualização.
                      </p>
                    </li>
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-white">Conecte à aplicação</span>
                      <p className="text-gray-300 mt-1">
                        Utilize a URL do webhook do n8n na página de upload para enviar dados diretamente para o fluxo.
                      </p>
                    </li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card className="dashboard-chart">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Testar Conexão</CardTitle>
                  <CardDescription className="text-gray-300">
                    Verifique se a integração com n8n está funcionando
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleTestWebhook}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-200 mb-1">
                          URL do Webhook n8n
                        </label>
                        <Input
                          id="webhook-url"
                          placeholder="https://your-n8n-instance.com/webhook/..."
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="bg-muted text-foreground"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Cole a URL do webhook gerado pelo nó webhook do n8n
                        </p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isLoading ? "Testando..." : "Testar Webhook"}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="mt-6 p-4 bg-secondary/50 rounded-md border border-primary/20">
                    <h4 className="text-sm font-medium mb-2 text-white">Como usar com a página de Upload</h4>
                    <p className="text-sm text-gray-300">
                      Depois de testar a conexão, copie a URL do webhook e cole-a na página de Upload como URL de destino para enviar arquivos diretamente para o n8n.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="python">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="dashboard-chart">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    <div className="flex items-center">
                      <Code className="mr-2 h-5 w-5 text-primary" />
                      Integração Python para TCC
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Scripts Python para análise de dados no seu TCC
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium text-white mb-2">Bibliotecas Recomendadas</h3>
                      <ul className="grid grid-cols-2 gap-2">
                        {["pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "statsmodels"].map((lib) => (
                          <li key={lib} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary/80" />
                            {lib}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-white mb-2">Configuração no n8n</h3>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-300">
                        <li>Adicione um nó <strong>Python</strong> ao seu fluxo de trabalho</li>
                        <li>Configure o nó para instalar os pacotes necessários</li>
                        <li>Cole o script abaixo ou um personalizado para seu TCC</li>
                        <li>Conecte a saída do nó Python a outros nós (e-mail, dashboard, etc.)</li>
                      </ol>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-medium text-white">Script Python de Exemplo</h3>
                        <Button 
                          variant="outline" 
                          onClick={handleCopyPython}
                          size="sm"
                          className="border-primary/30 bg-primary/10 hover:bg-primary/20 text-xs"
                        >
                          Copiar Script
                        </Button>
                      </div>
                      <div className="bg-gray-900 p-3 rounded-md border border-gray-700 overflow-auto max-h-80">
                        <pre className="text-gray-300 text-xs">
                          {pythonScript}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-chart">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    <div className="flex items-center">
                      <Database className="mr-2 h-5 w-5 text-primary" />
                      Fluxo de Trabalho para TCC
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Processamento de dados automatizado para pesquisa acadêmica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b border-gray-700 pb-4">
                      <h3 className="font-medium text-base text-white mb-2">Coleta de Dados</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Configure o sistema para coletar dados de várias fontes.
                      </p>
                      <ol className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                        <li>Arquivos CSV/Excel enviados pelo usuário</li>
                        <li>Formulários de pesquisa online</li>
                        <li>APIs de serviços externos</li>
                        <li>Bancos de dados e data lakes</li>
                      </ol>
                    </div>

                    <div className="border-b border-gray-700 pb-4">
                      <h3 className="font-medium text-base text-white mb-2">Processamento com Python</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Use scripts Python para análise estatística e preparação de dados.
                      </p>
                      <ol className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                        <li>Limpeza e normalização de dados</li>
                        <li>Análise estatística descritiva e inferencial</li>
                        <li>Aplicação de modelos de machine learning</li>
                        <li>Visualização de resultados com gráficos</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-medium text-base text-white mb-2">Distribuição de Resultados</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Automatize a entrega dos resultados processados.
                      </p>
                      <ol className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                        <li>Geração de relatórios PDF</li>
                        <li>Exportação para planilhas Excel</li>
                        <li>Atualização de dashboards em tempo real</li>
                        <li>Envio de e-mails com resumos executivos</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="examples">
            <Card className="dashboard-chart">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Exemplos de Fluxos no n8n</CardTitle>
                <CardDescription className="text-gray-300">
                  Modelos de workflows para análise de dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h3 className="font-medium text-base text-white mb-2">Análise de Vendas</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Fluxo de trabalho para processar arquivos CSV/Excel de vendas e gerar relatórios.
                    </p>
                    <ol className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                      <li>Webhook recebe o arquivo</li>
                      <li>Nó Python extrai e processa os dados</li>
                      <li>Análise identifica tendências de vendas</li>
                      <li>Gera relatório em PDF</li>
                      <li>Envia por email ou armazena em Google Drive</li>
                    </ol>
                  </div>
                  
                  <div className="border-b border-gray-700 pb-4">
                    <h3 className="font-medium text-base text-white mb-2">Monitoramento de Estoque</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Fluxo para análise de níveis de estoque e alertas automáticos.
                    </p>
                    <ol className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                      <li>Processa arquivo de estoque</li>
                      <li>Compara com níveis ideais</li>
                      <li>Gera alertas para itens com baixo estoque</li>
                      <li>Calcula sugestões de reposição</li>
                      <li>Envia resumo para responsáveis</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-base text-white mb-2">Análise de Clientes</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Fluxo para segmentação e análise de comportamento de clientes.
                    </p>
                    <ol className="list-disc pl-5 text-sm text-gray-300 space-y-1">
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
            <Card className="dashboard-chart">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Configuração de Webhooks</CardTitle>
                <CardDescription className="text-gray-300">
                  Como criar e gerenciar webhooks no n8n
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md bg-blue-900/30 p-4 border border-blue-800/50">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-300">Dica importante</h3>
                        <div className="mt-2 text-sm text-blue-200">
                          <p>
                            Para uso em desenvolvimento local, você pode usar o n8n.cloud ou ferramentas como ngrok 
                            para criar um túnel para sua instância local e ter uma URL pública.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-white">Como criar um webhook no n8n:</h3>
                    <ol className="list-decimal pl-5 text-sm text-gray-300 space-y-3">
                      <li>
                        <p className="font-medium text-white">Crie um novo fluxo de trabalho no n8n</p>
                        <p className="text-gray-300">Acesse o painel do n8n e crie um novo workflow.</p>
                      </li>
                      <li>
                        <p className="font-medium text-white">Adicione um nó "Webhook"</p>
                        <p className="text-gray-300">Nos nós, pesquise por "Webhook" e adicione-o como nó inicial.</p>
                      </li>
                      <li>
                        <p className="font-medium text-white">Configure o webhook</p>
                        <p className="text-gray-300">
                          Selecione o método HTTP (POST para receber arquivos), configure
                          autenticação se necessário e defina o caminho do webhook.
                        </p>
                      </li>
                      <li>
                        <p className="font-medium text-white">Ative o webhook</p>
                        <p className="text-gray-300">
                          Salve o workflow, ative-o e copie a URL do webhook gerada.
                        </p>
                      </li>
                      <li>
                        <p className="font-medium text-white">Adicione a lógica de processamento</p>
                        <p className="text-gray-300">
                          Conecte outros nós para processar os arquivos recebidos (Python, CSV, Google Sheets, etc.).
                        </p>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <h3 className="font-medium text-white">Estrutura recomendada para automação:</h3>
                    <div className="bg-gray-900 text-gray-200 p-4 rounded-md overflow-x-auto border border-gray-700">
                      <pre className="text-xs">
                        {`// Exemplo de fluxo no n8n para seu TCC
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
