
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import FileHistoryRow from "@/components/FileHistoryRow";
import EmptyFileHistory from "@/components/EmptyFileHistory";
import FileHistoryLoading from "@/components/FileHistoryLoading";
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow 
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface UploadedFile {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  analysis_path: string | null;
  created_at: string;
  processed?: boolean;
  processing_status?: string;
}

const FileHistory = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
    
    // Inscrever-se em atualizações em tempo real
    const channel = supabase
      .channel('uploaded_files_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'uploaded_files' 
        },
        (payload) => {
          console.log('Alteração em tempo real:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Adicionar novo arquivo à lista
            const newFile = payload.new as UploadedFile;
            setFiles(prev => [newFile, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Atualizar arquivo existente
            const updatedFile = payload.new as UploadedFile;
            setFiles(prev => 
              prev.map(file => 
                file.id === updatedFile.id ? { ...updatedFile } : file
              )
            );
            
            // Mostrar notificação quando um arquivo for processado
            if (updatedFile.processed && !payload.old.processed) {
              toast.success(`Arquivo "${updatedFile.filename}" foi processado`, {
                description: "O relatório de análise está disponível para download."
              });
            }
          } else if (payload.eventType === 'DELETE') {
            // Remover arquivo da lista
            const deletedFileId = payload.old.id;
            setFiles(prev => prev.filter(file => file.id !== deletedFileId));
          }
        }
      )
      .subscribe();
    
    // Limpar inscrição quando componente for desmontado
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Mapear arquivos com status de processamento
      const processedFiles = data?.map(file => ({
        ...file,
        processed: file.analysis_path !== null
      })) || [];
      
      setFiles(processedFiles);
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      toast("Erro ao carregar histórico", {
        description: "Não foi possível carregar o histórico de arquivos."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (fileId: string) => {
    navigate(`/analysis/${fileId}`);
  };

  if (loading) {
    return <FileHistoryLoading />;
  }

  if (files.length === 0) {
    return <EmptyFileHistory />;
  }

  return (
    <Card className="dashboard-chart">
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Arquivo</TableHead>
                <TableHead className="text-muted-foreground">Tamanho</TableHead>
                <TableHead className="text-muted-foreground">Data de Upload</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <FileHistoryRow 
                  key={file.id} 
                  file={file} 
                  onViewDetails={handleViewDetails} 
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileHistory;
