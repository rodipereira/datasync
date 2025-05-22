import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Loader2 } from "lucide-react";
import NavBar from "@/components/NavBar";

// Adicione esta definição de tipo no início do arquivo para incluir a propriedade 'processing_status'
interface FileDetails {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  analysis_path: string;
  user_id: string;
  processing_status?: string;
}

const AnalysisDetails = () => {
  const { fileId } = useParams();
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (fileId) {
      fetchFileDetails();
    }
  }, [fileId]);

  const fetchFileDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch file details
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();
      
      if (fileError) throw fileError;
      
      setFileDetails(fileData);
      
      // Fetch analysis data if available
      if (fileData.analysis_path) {
        const { data: analysisData, error: analysisError } = await supabase
          .storage
          .from('analyses')
          .download(fileData.analysis_path);
        
        if (analysisError) throw analysisError;
        
        // Parse JSON data
        const jsonData = await analysisData.text();
        setAnalysisData(JSON.parse(jsonData));
      }
      
    } catch (error) {
      console.error('Error fetching file details:', error);
      toast.error('Erro ao carregar detalhes do arquivo');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadOriginal = async () => {
    if (!fileDetails) return;
    
    try {
      setDownloading(true);
      
      const { data, error } = await supabase
        .storage
        .from('uploads')
        .download(fileDetails.file_path);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileDetails.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Download iniciado');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Erro ao baixar arquivo');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!fileDetails) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Arquivo não encontrado</h2>
            <p className="text-muted-foreground mt-2">
              O arquivo solicitado não existe ou você não tem permissão para acessá-lo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{fileDetails.filename}</h1>
          <p className="text-muted-foreground">
            Detalhes e análise do arquivo
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Arquivo</CardTitle>
                <CardDescription>Detalhes sobre o arquivo enviado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Nome do arquivo</p>
                  <p className="text-sm text-muted-foreground">{fileDetails.filename}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Tipo</p>
                  <p className="text-sm text-muted-foreground">{fileDetails.file_type}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Tamanho</p>
                  <p className="text-sm text-muted-foreground">
                    {(fileDetails.file_size / 1024).toFixed(2)} KB
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Data de upload</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(fileDetails.created_at), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                
                {fileDetails && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Status do Processamento</p>
                    <p className="text-sm text-muted-foreground">
                      {fileDetails.processing_status || "Concluído"}
                    </p>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleDownloadOriginal}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Baixando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Baixar arquivo original
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Dados</CardTitle>
                <CardDescription>Resultados da análise automática</CardDescription>
              </CardHeader>
              <CardContent>
                {analysisData ? (
                  <Tabs defaultValue="summary">
                    <TabsList className="mb-4">
                      <TabsTrigger value="summary">Resumo</TabsTrigger>
                      <TabsTrigger value="details">Detalhes</TabsTrigger>
                      <TabsTrigger value="raw">Dados Brutos</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisData.summary && Object.entries(analysisData.summary).map(([key, value]: [string, any]) => (
                          <Card key={key}>
                            <CardContent className="pt-6">
                              <div className="text-2xl font-bold">{value}</div>
                              <p className="text-sm text-muted-foreground capitalize">
                                {key.replace(/_/g, ' ')}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details">
                      <Card>
                        <CardContent className="pt-6">
                          {analysisData.details ? (
                            <pre className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                              {JSON.stringify(analysisData.details, null, 2)}
                            </pre>
                          ) : (
                            <p className="text-muted-foreground">Nenhum detalhe disponível</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="raw">
                      <Card>
                        <CardContent className="pt-6">
                          <pre className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                            {JSON.stringify(analysisData, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">Nenhuma análise disponível</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Este arquivo ainda não foi analisado ou não há dados de análise disponíveis.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetails;
