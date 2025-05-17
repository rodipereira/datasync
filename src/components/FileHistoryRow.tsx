
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatFileSize } from "@/utils/fileUtils";
import { exportReport } from "@/utils/exportUtils";
import FileIcon from "./FileIcon";
import { TableCell, TableRow } from "@/components/ui/table";

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
  
  // Determine if the file has been processed
  const isProcessed = file.processed || file.status === "concluído";

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
    <TableRow className="hover:bg-slate-800/30">
      {/* File Icon & Name */}
      <TableCell className="py-3">
        <div className="flex items-center space-x-3">
          <FileIcon fileType={file.file_type || ""} />
          <div>
            <p className="font-medium text-white line-clamp-1">{file.filename}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>
      </TableCell>

      {/* File Size */}
      <TableCell className="py-3 text-muted-foreground">
        {formatFileSize(file.file_size || 0)}
      </TableCell>

      {/* Upload Date */}
      <TableCell className="py-3 text-muted-foreground">
        {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: ptBR })}
      </TableCell>

      {/* Status */}
      <TableCell className="py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isProcessed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {isProcessed ? "Concluído" : "Pendente"}
        </span>
      </TableCell>

      {/* Analysis & Download buttons */}
      <TableCell className="py-3">
        <div className="flex justify-end space-x-2">
          <Button 
            size="sm" 
            variant="ghost"
            className="text-xs md:text-sm flex items-center gap-1 text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={() => onViewDetails(file.id)}>
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Detalhes</span>
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs md:text-sm flex items-center gap-1 border-primary/30 hover:bg-primary/10"
            disabled={loading || !isProcessed}
            onClick={handleExportAnalysis}>
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FileHistoryRow;
