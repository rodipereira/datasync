
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
  processed: boolean;
}

const FileHistory = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
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
      
      // Simulate some files being processed and others pending
      const processedFiles = data?.map((file, index) => ({
        ...file,
        processed: index % 2 === 0 // Alternate between processed and pending for demonstration
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
