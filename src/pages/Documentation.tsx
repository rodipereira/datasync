import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Database, GitBranch, Box } from "lucide-react";
import { toast } from "sonner";

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const diagramas = {
    dashboard: {
      titulo: "Interface do Dashboard",
      localizacao: "DOCUMENTACAO.md - Linhas 81-87",
      descricao: "Estrutura visual e componentes da interface do dashboard",
      mermaid: `graph TB
    Dashboard[Dashboard Page]
    Dashboard --> Header[Dashboard Header]
    Dashboard --> Toggle[Dashboard Mode Toggle]
    Dashboard --> Metrics[Dashboard Metrics]
    Dashboard --> Charts[Charts Section]
    Dashboard --> Actions[Dashboard Actions]
    Dashboard --> AI[AI Recommendations]
    
    Header --> Title[Título e Filtros de Data]
    Toggle --> Classic[Dashboard Clássico]
    Toggle --> Smart[Dashboard Inteligente]
    
    Metrics --> Sales[Total de Vendas]
    Metrics --> Profit[Lucro Líquido]
    Metrics --> Inventory[Contagem de Estoque]
    Metrics --> Customers[Novos Clientes]
    
    Charts --> Line[Gráfico de Linha]
    Charts --> Bar[Gráfico de Barras]
    Charts --> Distribution[Gráfico de Distribuição]
    Charts --> Predictive[Gráfico Preditivo]
    
    Actions --> Export[Botão Exportar]
    Actions --> Refresh[Atualizar Dados]
    
    AI --> RealTime[Analytics em Tempo Real]
    AI --> Insights[Painel de Insights]
    AI --> BI[Business Intelligence]`,
      icon: Box
    },
    employees: {
      titulo: "Estrutura de Dados de Funcionários",
      localizacao: "DOCUMENTACAO.md - Linhas 190-237",
      descricao: "Modelo de dados e relacionamentos das tabelas de funcionários",
      mermaid: `erDiagram
    EMPLOYEES ||--o{ EMPLOYEE_METRICS : "possui"
    USERS ||--o{ EMPLOYEES : "gerencia"
    
    EMPLOYEES {
        uuid id PK
        uuid user_id FK
        text name
        text position
        date hire_date
        text avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    EMPLOYEE_METRICS {
        uuid id PK
        uuid employee_id FK
        text month
        numeric revenue
        integer clients_acquired
        integer employees_hired
        timestamp created_at
        timestamp updated_at
    }
    
    USERS {
        uuid id PK
        text email
        timestamp created_at
    }`,
      icon: Database
    },
    fluxograma: {
      titulo: "Fluxograma Geral de Operação",
      localizacao: "DOCUMENTACAO.md - Linhas 269-273 (Autenticação)",
      descricao: "Fluxo completo de operação do sistema desde login até módulos",
      mermaid: `flowchart TD
    Start([Usuário Acessa Sistema]) --> Login{Possui Credenciais?}
    
    Login -->|Não| Register[Página de Registro]
    Register --> CreateAccount[Criar Conta]
    CreateAccount --> ValidateEmail[Validar Email]
    ValidateEmail --> LoginPage[Ir para Login]
    
    Login -->|Sim| Auth[Autenticar no Supabase]
    Auth --> ValidAuth{Credenciais Válidas?}
    
    ValidAuth -->|Não| Error[Exibir Erro]
    Error --> Login
    
    ValidAuth -->|Sim| LoadSession[Carregar Sessão JWT]
    LoadSession --> ApplyRLS[Aplicar Políticas RLS]
    ApplyRLS --> Dashboard[Dashboard Principal]
    
    Dashboard --> Modules{Escolher Módulo}
    
    Modules --> Employees[Gerenciar Funcionários]
    Modules --> Inventory[Controlar Inventário]
    Modules --> Reports[Gerar Relatórios]
    Modules --> Upload[Upload de Arquivos]
    Modules --> Goals[Metas e Objetivos]
    Modules --> Workflows[Gerenciar Workflows]
    Modules --> AI[Assistente IA]
    
    Employees --> CRUD1[CRUD Funcionários]
    Inventory --> CRUD2[CRUD Inventário]
    Reports --> Export[Exportar PDF/Excel]
    Upload --> Process[Processar Arquivo]
    Goals --> Track[Acompanhar Metas]
    Workflows --> Automate[Automatizar Processos]
    AI --> Analyze[Analisar Dados]
    
    CRUD1 --> Notify[Sistema de Notificações]
    CRUD2 --> Notify
    Process --> Notify
    
    Notify --> RealTime[Atualização em Tempo Real]
    RealTime --> Dashboard
    
    Dashboard --> Logout[Sair]
    Logout --> End([Fim da Sessão])`,
      icon: GitBranch
    },
    arquitetura: {
      titulo: "Arquitetura da Plataforma",
      localizacao: "DOCUMENTACAO.md - Linhas 144-185 (Componentes e Hooks)",
      descricao: "Arquitetura completa do sistema incluindo frontend, backend e integrações",
      mermaid: `graph TB
    subgraph "Frontend - React"
        UI[Interface do Usuário]
        Components[Componentes React]
        Pages[Páginas/Rotas]
        Hooks[Custom Hooks]
        State[TanStack Query]
    end
    
    subgraph "Roteamento"
        Router[React Router]
        Protected[Rotas Protegidas]
        Public[Rotas Públicas]
    end
    
    subgraph "Backend - Lovable Cloud / Supabase"
        Auth[Supabase Auth]
        DB[(PostgreSQL Database)]
        Storage[File Storage]
        Functions[Edge Functions]
        RealTime[Realtime Subscriptions]
    end
    
    subgraph "Segurança"
        RLS[Row Level Security]
        JWT[JWT Tokens]
        Policies[Políticas de Acesso]
    end
    
    subgraph "Integrações"
        AI_Service[Assistente IA - Groq]
        Export[Exportação PDF/Excel]
        Charts[Recharts - Visualização]
    end
    
    UI --> Components
    Components --> Pages
    Pages --> Hooks
    Hooks --> State
    
    State --> Router
    Router --> Protected
    Router --> Public
    
    Protected --> Auth
    Public --> Auth
    
    Auth --> JWT
    JWT --> RLS
    RLS --> Policies
    
    Policies --> DB
    DB --> Functions
    DB --> RealTime
    DB --> Storage
    
    Functions --> AI_Service
    State --> Export
    Components --> Charts
    
    RealTime -.->|WebSocket| State
    Functions -.->|API Calls| State`,
      icon: FileText
    }
  };

  const handleExportSVG = (diagramKey: string) => {
    const diagrama = diagramas[diagramKey as keyof typeof diagramas];
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${diagrama.titulo} -->
<!-- ${diagrama.localizacao} -->
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <text x="50" y="50" font-size="20" font-weight="bold">${diagrama.titulo}</text>
  <text x="50" y="80" font-size="14">${diagrama.descricao}</text>
  <text x="50" y="110" font-size="12" fill="#666">Localização: ${diagrama.localizacao}</text>
  <rect x="50" y="130" width="1100" height="600" fill="none" stroke="#333" stroke-width="2"/>
  <text x="550" y="450" font-size="16" text-anchor="middle" fill="#999">
    Para visualizar o diagrama completo, use uma ferramenta Mermaid online
  </text>
  <text x="550" y="480" font-size="14" text-anchor="middle" fill="#999">
    ou copie o código Mermaid abaixo:
  </text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagramKey}-diagrama.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("SVG exportado com sucesso!");
  };

  const handleCopyMermaid = (mermaidCode: string, titulo: string) => {
    navigator.clipboard.writeText(mermaidCode);
    toast.success(`Código Mermaid de "${titulo}" copiado!`);
  };

  const handleExportAllInfo = () => {
    const info = Object.entries(diagramas).map(([key, value]) => 
      `## ${value.titulo}\n` +
      `**Localização:** ${value.localizacao}\n` +
      `**Descrição:** ${value.descricao}\n\n` +
      `**Código Mermaid:**\n\`\`\`mermaid\n${value.mermaid}\n\`\`\`\n\n`
    ).join('\n---\n\n');

    const blob = new Blob([info], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagramas-completos.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Todos os diagramas exportados em Markdown!");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Documentação Técnica - DataSync</h1>
        <p className="text-muted-foreground">
          Diagramas e estruturas do sistema com localização no arquivo de documentação
        </p>
        
        <div className="flex gap-4 mt-6">
          <Button onClick={handleExportAllInfo} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Tudo (Markdown)
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(diagramas).map(([key, value]) => {
            const Icon = value.icon;
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{value.titulo.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(diagramas).map(([key, value]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {value.titulo}
                </CardTitle>
                <CardDescription>{value.descricao}</CardDescription>
                <div className="pt-2 space-y-1">
                  <p className="text-sm font-semibold text-primary">
                    📍 Localização: {value.localizacao}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed">
                    <p className="text-sm font-mono text-muted-foreground mb-2">
                      Diagrama Mermaid:
                    </p>
                    <pre className="text-xs overflow-x-auto p-4 bg-background rounded">
                      {value.mermaid}
                    </pre>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => handleCopyMermaid(value.mermaid, value.titulo)}
                      variant="outline"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Copiar Código Mermaid
                    </Button>
                    
                    <Button 
                      onClick={() => handleExportSVG(key)}
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exportar SVG
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => {
                        window.open('https://mermaid.live', '_blank');
                        toast.info("Abrindo Mermaid Live Editor");
                      }}
                    >
                      Visualizar Online
                    </Button>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold mb-2">💡 Como usar:</p>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Copie o código Mermaid acima</li>
                      <li>Cole em <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mermaid.live</a> para visualizar</li>
                      <li>Exporte como PNG/SVG diretamente do Mermaid Live</li>
                      <li>Ou use o botão "Exportar SVG" para download rápido</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📋 Resumo das Localizações</CardTitle>
          <CardDescription>
            Todas as referências no arquivo DOCUMENTACAO.md
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(diagramas).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <value.icon className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{value.titulo}</p>
                  <p className="text-sm text-muted-foreground">{value.localizacao}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setActiveTab(key)}
                >
                  Ver
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;
