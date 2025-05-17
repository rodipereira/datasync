
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatFileSize } from "@/utils/fileUtils";
import { exportReport } from "@/utils/exportUtils";
import FileIcon from "@/components/FileIcon";

interface FileDetails {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  analysis_path: string | null;
  processing_status?: string;
  processed?: boolean;
}

const AnalysisDetails = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<FileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (fileId) {
      fetchFileDetails(fileId);
    }
  }, [fileId]);

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
        setFile(data as FileDetails);
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

  const handleExportAnalysis = async () => {
    if (!file) return;
    
    setExportLoading(true);
    try {
      // Mock data for demonstration purposes
      const data = [
        { id: 1, name: "Item 1", value: 100 },
        { id: 2, name: "Item 2", value: 200 },
        { id: 3, name: "Item 3", value: 300 },
      ];
      
      await exportReport(data, `analise_${file.filename}`);
      
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar análise:", error);
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
            
            {!loading && file && file.processed && (
              <Button 
                onClick={handleExportAnalysis}
                disabled={exportLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
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
                            file.processed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {file.processed ? "Concluído" : "Pendente"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {file.processed ? (
                    <div className="p-6 bg-secondary/20 rounded-lg">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Resultados da Análise
                      </h3>
                      
                      <div className="space-y-4">
                        <p className="text-gray-300">
                          Os resultados da análise estão disponíveis para visualização e download.
                          Você pode exportar o relatório completo clicando no botão "Exportar Relatório"
                          acima.
                        </p>

                        {/* Mock analysis data display - this would be replaced with actual data */}
                        <Card className="bg-secondary/10 border-0">
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-300">
                              <p className="mb-2">Esta é uma visualização demonstrativa dos resultados da análise.</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Total de itens analisados: 156</li>
                                <li>Anomalias detectadas: 3</li>
                                <li>Pontuação de confiança: 98.2%</li>
                              </ul>
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
                          <p>O arquivo está aguardando processamento.</p>
                          <p className="mt-2">Os resultados estarão disponíveis em breve.</p>
                        </div>
                        <div className="mt-6 flex flex-col items-center">
                          <div className="h-2 w-64 bg-secondary/50 rounded-full">
                            <div className="animate-pulse h-2 bg-primary rounded-full w-1/4"></div>
                          </div>
                          <p className="mt-2 text-sm text-gray-400">Aguardando análise...</p>
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
