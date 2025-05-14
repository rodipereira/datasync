
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatFileSize } from "@/utils/fileUtils";
import FileIcon from "@/components/FileIcon";
import { supabase } from "@/integrations/supabase/client";
import { exportToPDF } from "@/utils/exportUtils";

interface UploadedFile {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  analysis_path: string | null;
  created_at: string;
}

interface FileHistoryRowProps {
  file: UploadedFile;
}

const FileHistoryRow = ({ file }: FileHistoryRowProps) => {
  const downloadFile = async (path: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .download(path);
        
      if (error) {
        throw error;
      }
      
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
      toast.error("Erro ao baixar arquivo", {
        description: "Não foi possível baixar o arquivo selecionado."
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(file);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar PDF", {
        description: "Não foi possível gerar o PDF."
      });
    }
  };

  return (
    <tr key={file.id} className="border-b hover:bg-gray-50">
      <td className="py-4">
        <div className="flex items-center space-x-2">
          <FileIcon fileType={file.file_type} />
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
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            title="Exportar como PDF"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default FileHistoryRow;
