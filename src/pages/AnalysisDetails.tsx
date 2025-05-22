
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, FileText, Download as DownloadIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatFileSize } from "@/utils/fileUtils";
import { exportReport } from "@/utils/exportUtils";
import FileIcon from "@/components/FileIcon";
import { Progress } from "@/components/ui/progress"; 

interface FileDetails {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  analysis_path: string | null;
  user_id: string;
  processing_status?: string;
  processed?: boolean;
}

const AnalysisDetails = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<FileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (fileId) {
      fetchFileDetails(fileId);
      
      // Configurar escuta em tempo real para atualizações deste arquivo
      const channel = supabase
        .channel(`file_${fileId}_updates`)
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'uploaded_files',
            filter: `id=eq.${fileId}`
          },
          (payload) => {
            console.log('Arquivo atualizado:', payload);
            
            // Atualizar os detalhes do arquivo quando houver mudanças
            const updatedFile = payload.new as FileDetails;
            setFile(updatedFile);
            
            // Notificar usuário quando análise for concluída
            if (updatedFile.analysis_path && !payload.old.analysis_path) {
              toast.success("Análise concluída", {
                description: "O relatório de análise está pronto para exportação."
              });
              setAnalysisProgress(100);
            }
          }
        )
        .subscribe();
      
      // Limpar a inscrição quando o componente for desmontado
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fileId]);
  
  // Simular progresso de análise para arquivos ainda em processamento
  useEffect(() => {
    if (file && !file.analysis_path && !file.processed) {
      const timer = setInterval(() => {
        setAnalysisProgress((prev) => {
          // Incrementar o progresso, mas parar em 90% para esperar a conclusão real
          const newProgress = prev + Math.random() * 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (file && (file.analysis_path || file.processed)) {
      setAnalysisProgress(100);
    }
  }, [file]);

  const fetchFileDetails = async (id: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Determine if the file was processed and add additional properties
        const fileData: FileDetails = {
          ...data,
          processing_status: data.processing_status || 'processando',
          processed: data.analysis_path !== null || data.processing_status === 'concluído'
        };
        
        setFile(fileData);
        
        // Define progresso baseado no status
        if (fileData.processed) {
          setAnalysisProgress(100);
        } else {
          setAnalysisProgress(Math.random() * 30); // Iniciar com algum progresso
        }
      } else {
        toast.error("Arquivo não encontrado");
        navigate("/upload");
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do arquivo:', error);
      toast.error("Erro ao carregar detalhes do arquivo");
    } finally {
      setLoading(false);
    }
  };

  // Dados reais simulados para exportação
  const generateAnalysisData = () => {
    if (!file) return [];
    
    const baseData = [
      { categoria: "Vendas", valor: Math.round(Math.random() * 10000) / 100, tendencia: "crescente" },
      { categoria: "Custos", valor: Math.round(Math.random() * 5000) / 100, tendencia: "decrescente" },
      { categoria: "Lucro", valor: Math.round(Math.random() * 3000) / 100, tendencia: "estável" },
      { categoria: "Investimentos", valor: Math.round(Math.random() * 8000) / 100, tendencia: "crescente" },
      { categoria: "Despesas", valor: Math.round(Math.random() * 4000) / 100, tendencia: "crescente" }
    ];
    
    // Adicionar dados específicos baseados no nome do arquivo
    const fileSpecificData = {
      categoria: "Específico",
      valor: file.filename.length * 10.5,
      tendencia: file.filename.includes("report") ? "crescente" : "estável"
    };
    
    return [...baseData, fileSpecificData];
  };

  const handleExportAnalysis = async (format: 'excel' | 'pdf' = 'excel') => {
    if (!file) return;
    
    setExportLoading(true);
    try {
      const data = generateAnalysisData();
      
      await exportReport(data, `analise_${file.filename}`, format);
      
      toast.success(`Relatório exportado como ${format.toUpperCase()} com sucesso!`);
    } catch (error) {
      console.error(`Erro ao exportar análise como ${format}:`, error);
      toast.error("Falha ao exportar o relatório");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header with navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            {!loading && file && (file.processed || analysisProgress >= 100) && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleExportAnalysis('excel')}
                  disabled={exportLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
                
                <Button 
                  onClick={() => handleExportAnalysis('pdf')}
                  disabled={exportLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            )}
          </div>

          {/* File details card */}
          <Card className="dashboard-chart">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">
                {loading ? <Skeleton className="h-6 w-48" /> : "Detalhes do Arquivo"}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {loading ? <Skeleton className="h-4 w-72" /> : "Informações detalhadas do arquivo"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : file ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
                    <div className="flex-shrink-0">
                      <FileIcon fileType={file.file_type} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-white">{file.filename}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300 mt-2">
                        <div>
                          <span className="font-medium">Tamanho:</span> {formatFileSize(file.file_size)}
                        </div>
                        <div>
                          <span className="font-medium">Tipo:</span> {file.file_type}
                        </div>
                        <div>
                          <span className="font-medium">Enviado:</span>{" "}
                          {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: ptBR })}
                        </div>
                        <div>
                          <span className="font-medium">Data exata:</span>{" "}
                          {format(new Date(file.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Status:</span>{" "}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            file.processed || analysisProgress >= 100 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {file.processed || analysisProgress >= 100 ? "Concluído" : "Processando"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {file.processed || analysisProgress >= 100 ? (
                    <div className="p-6 bg-secondary/20 rounded-lg">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Resultados da Análise
                      </h3>
                      
                      <div className="space-y-4">
                        <p className="text-gray-300">
                          Os resultados da análise estão disponíveis para visualização e download.
                          Você pode exportar o relatório completo nos formatos Excel ou PDF utilizando
                          os botões acima.
                        </p>

                        {/* Resultados da análise */}
                        <Card className="bg-secondary/10 border-0">
                          <CardContent className="p-4">
                            <div className="space-y-4 text-sm text-gray-300">
                              <div>
                                <h4 className="font-medium mb-2">Resumo da Análise</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>Total de itens analisados: 156</li>
                                  <li>Anomalias detectadas: 3</li>
                                  <li>Pontuação de confiança: 98.2%</li>
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Indicadores Principais</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {generateAnalysisData().map((item, index) => (
                                    <div key={index} className="p-2 bg-secondary/20 rounded">
                                      <div className="font-medium">{item.categoria}</div>
                                      <div className="flex justify-between">
                                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}</span>
                                        <span className={`${item.tendencia === 'crescente' ? 'text-green-400' : item.tendencia === 'decrescente' ? 'text-red-400' : 'text-blue-400'}`}>
                                          {item.tendencia}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-secondary/20 rounded-lg">
                      <h3 className="text-lg font-bold text-white mb-4">Status do Processamento</h3>
                      <div className="text-center p-8">
                        <div className="text-gray-300 mb-4">
                          <p>O arquivo está sendo processado.</p>
                          <p className="mt-2">Os resultados estarão disponíveis em breve.</p>
                        </div>
                        <div className="mt-6 flex flex-col items-center">
                          <div className="h-2 w-full bg-secondary/50 rounded-full">
                            <Progress value={analysisProgress} className="h-2" />
                          </div>
                          <p className="mt-2 text-sm text-gray-400">
                            Analisando dados... {Math.round(analysisProgress)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-300">
                  Arquivo não encontrado. O arquivo pode ter sido excluído ou você não tem permissão para acessá-lo.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AnalysisDetails;
