
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

interface UploadedFile {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  analysis_path: string | null;
  created_at: string;
}

const FileHistory = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      setFiles(data || []);
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      toast("Erro ao carregar histórico", {
        description: "Não foi possível carregar o histórico de arquivos."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FileHistoryLoading />;
  }

  if (files.length === 0) {
    return <EmptyFileHistory />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Data de Upload</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <FileHistoryRow key={file.id} file={file} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileHistory;
