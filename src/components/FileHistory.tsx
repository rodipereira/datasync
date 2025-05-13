
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, File, FileText, FilePdf } from "lucide-react";
import { toast } from "sonner";

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FilePdf className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) {
      return <FileText className="h-6 w-6 text-green-500" />;
    } else {
      return <File className="h-6 w-6 text-blue-500" />;
    }
  };

  const downloadFile = async (path: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .download(path);
        
      if (error) {
        throw error;
      }
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast("Erro ao baixar arquivo", {
        description: "Não foi possível baixar o arquivo selecionado."
      });
    }
  };

  const downloadAnalysis = async (path: string | null, filename: string) => {
    if (!path) {
      toast("Análise indisponível", {
        description: "O relatório de análise ainda não está disponível para este arquivo."
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .download(path);
        
      if (error) {
        throw error;
      }
      
      // Create a download link for the PDF
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analise_${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao baixar análise:', error);
      toast("Erro ao baixar análise", {
        description: "Não foi possível baixar o relatório de análise."
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Carregando histórico de arquivos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Nenhum arquivo encontrado.<br />
              Faça upload de arquivos para começar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Arquivo</th>
                <th className="py-3 text-left">Tamanho</th>
                <th className="py-3 text-left">Data de Upload</th>
                <th className="py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file.file_type)}
                      <span className="truncate max-w-[200px]">{file.filename}</span>
                    </div>
                  </td>
                  <td className="py-4">{formatFileSize(file.file_size)}</td>
                  <td className="py-4">{formatDate(file.created_at)}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadFile(file.file_path, file.filename)}
                        title="Baixar arquivo original"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant={file.analysis_path ? "default" : "outline"}
                        size="sm"
                        onClick={() => downloadAnalysis(file.analysis_path, file.filename)}
                        disabled={!file.analysis_path}
                        title={file.analysis_path ? "Baixar análise em PDF" : "Análise indisponível"}
                      >
                        <FilePdf className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileHistory;
