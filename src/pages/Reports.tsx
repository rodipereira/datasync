import { useState } from "react";
import { Calendar, Download, FileText, TrendingUp, Users, Package, DollarSign } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ReportsChart from "@/components/reports/ReportsChart";
import ReportPreview from "@/components/reports/ReportPreview";
import { toast } from "sonner";

interface ReportConfig {
  type: string;
  title: string;
  description: string;
  dateRange: DateRange | undefined;
  metrics: string[];
  filters: Record<string, string | number | boolean>;
  format: 'PDF' | 'Excel' | 'CSV';
}

const Reports = () => {

  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: "",
    title: "",
    description: "",
    dateRange: undefined,
    metrics: [],
    filters: {},
    format: 'PDF'
  });

  const reportTypes = [
    {
      id: 'performance',
      name: 'Relatório de Performance',
      description: 'Análise de métricas de desempenho da empresa',
      icon: TrendingUp,
      metrics: ['Vendas', 'Lucro', 'ROI', 'Crescimento'],
      color: 'text-blue-500'
    },
    {
      id: 'employees',
      name: 'Relatório de Funcionários',
      description: 'Dados e estatísticas dos recursos humanos',
      icon: Users,
      metrics: ['Total de Funcionários', 'Contratações', 'Demissões', 'Performance'],
      color: 'text-green-500'
    },
    {
      id: 'inventory',
      name: 'Relatório de Estoque',
      description: 'Status e movimentação do inventário',
      icon: Package,
      metrics: ['Total de Produtos', 'Estoque Baixo', 'Movimentação', 'Categorias'],
      color: 'text-purple-500'
    },
    {
      id: 'financial',
      name: 'Relatório Financeiro',
      description: 'Análise financeira e fluxo de caixa',
      icon: DollarSign,
      metrics: ['Receitas', 'Despesas', 'Fluxo de Caixa', 'Lucratividade'],
      color: 'text-orange-500'
    }
  ];

  const handleGenerateReport = () => {
    if (!selectedReportType || !reportConfig.title) {
      toast("Por favor, selecione um tipo de relatório e insira um título.");
      return;
    }

    toast(`O relatório "${reportConfig.title}" foi gerado com sucesso!`);
  };

  const handleMetricToggle = (metric: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const selectedReport = reportTypes.find(r => r.id === selectedReportType);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Sistema de Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Gere relatórios personalizados com dados atualizados do seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuração do Relatório */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seleção do Tipo de Relatório */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tipo de Relatório
                </CardTitle>
                <CardDescription>
                  Escolha o tipo de relatório que deseja gerar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((report) => {
                    const Icon = report.icon;
                    return (
                      <Card
                        key={report.id}
                        className={`cursor-pointer transition-all ${
                          selectedReportType === report.id 
                            ? 'ring-2 ring-primary border-primary' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setSelectedReportType(report.id);
                          setReportConfig(prev => ({
                            ...prev,
                            type: report.id,
                            metrics: []
                          }));
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className={`h-6 w-6 ${report.color} mt-1`} />
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{report.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {report.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {report.metrics.slice(0, 2).map((metric) => (
                                  <Badge key={metric} variant="secondary" className="text-xs">
                                    {metric}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Configurações Detalhadas */}
            {selectedReport && (
              <Tabs defaultValue="config" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="config">Configuração</TabsTrigger>
                  <TabsTrigger value="filters">Filtros</TabsTrigger>
                  <TabsTrigger value="preview">Visualização</TabsTrigger>
                </TabsList>

                <TabsContent value="config">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações do Relatório</CardTitle>
                      <CardDescription>
                        Defina os detalhes e métricas do seu relatório
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="report-title">Título do Relatório</Label>
                          <Input
                            id="report-title"
                            placeholder="Ex: Relatório Mensal de Vendas"
                            value={reportConfig.title}
                            onChange={(e) => setReportConfig(prev => ({
                              ...prev,
                              title: e.target.value
                            }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="report-format">Formato de Saída</Label>
                          <Select
                            value={reportConfig.format}
                            onValueChange={(value: 'PDF' | 'Excel' | 'CSV') => 
                              setReportConfig(prev => ({ ...prev, format: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PDF">PDF</SelectItem>
                              <SelectItem value="Excel">Excel</SelectItem>
                              <SelectItem value="CSV">CSV</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="report-description">Descrição</Label>
                        <Input
                          id="report-description"
                          placeholder="Descrição opcional do relatório"
                          value={reportConfig.description}
                          onChange={(e) => setReportConfig(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Métricas Incluídas</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedReport.metrics.map((metric) => (
                            <div key={metric} className="flex items-center space-x-2">
                              <Checkbox
                                id={metric}
                                checked={reportConfig.metrics.includes(metric)}
                                onCheckedChange={() => handleMetricToggle(metric)}
                              />
                              <Label htmlFor={metric} className="text-sm">
                                {metric}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="filters">
                  <Card>
                    <CardHeader>
                      <CardTitle>Filtros Avançados</CardTitle>
                      <CardDescription>
                        Configure filtros para personalizar os dados do relatório
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Período</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o período" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="today">Hoje</SelectItem>
                              <SelectItem value="week">Esta Semana</SelectItem>
                              <SelectItem value="month">Este Mês</SelectItem>
                              <SelectItem value="quarter">Este Trimestre</SelectItem>
                              <SelectItem value="year">Este Ano</SelectItem>
                              <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Departamento</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Todos os departamentos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="sales">Vendas</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="hr">Recursos Humanos</SelectItem>
                              <SelectItem value="finance">Financeiro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview">
                  <ReportPreview config={reportConfig} reportType={selectedReport} />
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* Painel de Resumo e Ações */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Resumo do Relatório
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedReport ? (
                  <>
                    <div>
                      <h4 className="font-semibold text-sm">Tipo</h4>
                      <p className="text-sm text-muted-foreground">{selectedReport.name}</p>
                    </div>
                    
                    {reportConfig.title && (
                      <div>
                        <h4 className="font-semibold text-sm">Título</h4>
                        <p className="text-sm text-muted-foreground">{reportConfig.title}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-sm">Formato</h4>
                      <p className="text-sm text-muted-foreground">{reportConfig.format}</p>
                    </div>
                    
                    {reportConfig.metrics.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm">Métricas ({reportConfig.metrics.length})</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {reportConfig.metrics.map((metric) => (
                            <Badge key={metric} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Selecione um tipo de relatório para ver o resumo
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={handleGenerateReport}
                  disabled={!selectedReportType || !reportConfig.title}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Relatório
                </Button>
                
                <Button variant="outline" className="w-full">
                  Salvar Configuração
                </Button>
              </CardContent>
            </Card>

            {/* Gráfico de Exemplo */}
            {selectedReport && reportConfig.metrics.length > 0 && (
              <ReportsChart 
                reportType={selectedReport.id}
                metrics={reportConfig.metrics}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;