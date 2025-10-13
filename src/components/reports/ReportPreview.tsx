import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Users, TrendingUp } from "lucide-react";

interface ReportConfig {
  type: string;
  title: string;
  description: string;
  metrics: string[];
  format: 'PDF' | 'Excel' | 'CSV';
}

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  metrics: string[];
  color: string;
}

interface ReportPreviewProps {
  config: ReportConfig;
  reportType: ReportType | undefined;
}

const ReportPreview = ({ config, reportType }: ReportPreviewProps) => {
  if (!reportType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visualização do Relatório</CardTitle>
          <CardDescription>
            Selecione um tipo de relatório para ver a visualização
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Nenhum relatório configurado
        </CardContent>
      </Card>
    );
  }

  const mockData = {
    performance: {
      summary: {
        totalVendas: "R$ 147.280",
        crescimento: "+12,5%",
        roi: "87%",
        periodo: "Janeiro - Junho 2024"
      },
      sections: [
        "Resumo Executivo",
        "Análise de Vendas",
        "Indicadores de Performance",
        "Tendências e Projeções",
        "Recomendações"
      ]
    },
    employees: {
      summary: {
        totalFuncionarios: "55",
        novasContratacoes: "12",
        rotatividade: "5,2%",
        periodo: "Janeiro - Junho 2024"
      },
      sections: [
        "Resumo de Recursos Humanos",
        "Estatísticas de Contratação",
        "Análise de Performance",
        "Distribuição por Departamento",
        "Plano de Desenvolvimento"
      ]
    },
    inventory: {
      summary: {
        totalProdutos: "526",
        estoqueMinimo: "35",
        valorTotal: "R$ 287.450",
        periodo: "Posição atual"
      },
      sections: [
        "Resumo do Inventário",
        "Análise por Categoria",
        "Produtos com Estoque Baixo",
        "Movimentação do Período",
        "Recomendações de Reposição"
      ]
    },
    financial: {
      summary: {
        receitas: "R$ 353.000",
        despesas: "R$ 225.000",
        lucroLiquido: "R$ 128.000",
        periodo: "Janeiro - Junho 2024"
      },
      sections: [
        "Demonstrativo Financeiro",
        "Análise de Receitas",
        "Controle de Despesas",
        "Fluxo de Caixa",
        "Indicadores de Rentabilidade"
      ]
    }
  };

  const currentData = mockData[config.type as keyof typeof mockData];
  const Icon = reportType.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Visualização do Relatório
        </CardTitle>
        <CardDescription>
          Preview de como será o relatório gerado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cabeçalho do Relatório */}
        <div className="border rounded-lg p-6 bg-secondary/5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-primary/10`}>
                <Icon className={`h-6 w-6 ${reportType.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {config.title || reportType.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {config.description || reportType.description}
                </p>
              </div>
            </div>
            <Badge variant="outline">{config.format}</Badge>
          </div>
          
          {/* Métricas Principais */}
          {currentData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(currentData.summary).map(([key, value], index) => (
                <div key={key} className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estrutura do Relatório */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Estrutura do Relatório
          </h4>
          <div className="space-y-2">
            {currentData?.sections.map((section, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>
                <span className="text-sm">{section}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas Selecionadas */}
        {config.metrics.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Métricas Incluídas
            </h4>
            <div className="flex flex-wrap gap-2">
              {config.metrics.map((metric) => (
                <Badge key={metric} variant="secondary">
                  {metric}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Data de Geração:</span>
              <span className="ml-2 text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="font-medium">Formato:</span>
              <span className="ml-2 text-muted-foreground">{config.format}</span>
            </div>
            <div>
              <span className="font-medium">Páginas Estimadas:</span>
              <span className="ml-2 text-muted-foreground">
                {Math.max(3, config.metrics.length * 2)} páginas
              </span>
            </div>
            <div>
              <span className="font-medium">Tamanho Aproximado:</span>
              <span className="ml-2 text-muted-foreground">
                {config.format === 'PDF' ? '2-5 MB' : '500KB - 1MB'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportPreview;