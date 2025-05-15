
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatFileSize } from "@/utils/fileUtils";
import { exportReport } from "@/utils/exportUtils";
import FileIcon from "./FileIcon";

type FileHistoryRowProps = {
  file: {
    id: string;
    filename: string;
    file_path: string;
    file_type?: string;
    file_size?: number;
    created_at: string;
    status?: string;
    processed?: boolean;
    analysis_path?: string | null;
  };
  onViewDetails: (fileId: string) => void;
};

const FileHistoryRow = ({ file, onViewDetails }: FileHistoryRowProps) => {
  const [loading, setLoading] = useState(false);

  const handleExportAnalysis = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 py-4 px-4 items-center border-b last:border-b-0 hover:bg-slate-50">
      {/* File Icon & Name */}
      <div className="col-span-5 md:col-span-6 flex items-center space-x-3">
        <FileIcon fileType={file.file_type || ""} />
        <div>
          <p className="font-medium line-clamp-1">{file.filename}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.file_size || 0)} • {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-3 md:col-span-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          file.status === "concluído" || file.processed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {file.status || (file.processed ? "Concluído" : "Pendente")}
        </span>
      </div>

      {/* Analysis & Download buttons */}
      <div className="col-span-4 md:col-span-4 flex justify-end space-x-2">
        <Button 
          size="sm" 
          variant="ghost"
          className="text-xs md:text-sm flex items-center gap-1"
          onClick={() => onViewDetails(file.id)}>
          <FileText className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Detalhes</span>
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          className="text-xs md:text-sm flex items-center gap-1"
          disabled={loading || !file.processed}
          onClick={handleExportAnalysis}>
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
      </div>
    </div>
  );
};

export default FileHistoryRow;
