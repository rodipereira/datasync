
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { X, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadUrl, setUploadUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast("Nenhum arquivo selecionado", {
        description: "Por favor, selecione pelo menos um arquivo para enviar."
      });
      return;
    }

    if (!uploadUrl.trim()) {
      toast("URL de destino não definida", {
        description: "Por favor, informe uma URL de destino para o upload ou conecte ao Supabase."
      });
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    // FormData para enviar arquivos
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });
    
    try {
      // Simulação de upload com progresso real
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });
      
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploading(false);
          toast("Upload completo", {
            description: `${files.length} arquivo(s) enviado(s) com sucesso.`
          });
          // Limpar os arquivos após o upload bem-sucedido
          setFiles([]);
        } else {
          throw new Error(`Erro ${xhr.status}: ${xhr.statusText}`);
        }
      });
      
      xhr.addEventListener("error", () => {
        throw new Error("O upload falhou.");
      });
      
      // Abrir e enviar a requisição
      xhr.open("POST", uploadUrl);
      xhr.send(formData);
      
    } catch (error) {
      setUploading(false);
      toast("Erro no upload", {
        description: error instanceof Error ? error.message : "Ocorreu um erro durante o upload.",
        variant: "destructive"
      });
      console.error("Erro de upload:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload de Arquivos</CardTitle>
        <CardDescription>
          Faça upload de arquivos de planilha (Excel, CSV) para análise automática
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="upload-url" className="text-sm font-medium">
            URL de Destino do Upload
          </label>
          <Input
            id="upload-url"
            placeholder="https://seu-backend.com/upload ou webhook do n8n"
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
            disabled={uploading}
          />
          <p className="text-xs text-muted-foreground">
            Informe a URL do seu backend Python ou um webhook do n8n para processar os arquivos
          </p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">
                Clique para selecionar ou arraste arquivos aqui
              </p>
              <p className="text-xs text-gray-500">
                Suporta arquivos Excel e CSV até 10MB
              </p>
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Arquivos selecionados ({files.length}):</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 rounded p-2">
                  <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={uploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          className="w-full" 
          onClick={handleUpload} 
          disabled={files.length === 0 || uploading || !uploadUrl.trim()}
        >
          {uploading ? "Enviando..." : "Enviar Arquivos"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Os arquivos serão processados conforme as regras definidas no seu backend/fluxo do n8n
        </p>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
