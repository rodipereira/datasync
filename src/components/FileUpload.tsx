import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { X, FileUp, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { processFile, ProcessingResult } from "@/utils/fileProcessor";

interface ProcessedFile {
  file: File;
  result?: ProcessingResult;
  uploading?: boolean;
}

const FileUpload = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({ file }));
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
    
    setUploading(true);
    setProgress(0);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado. Faça login para continuar.");
      }
      
      let processedCount = 0;
      const totalFiles = files.length;
      const results: ProcessedFile[] = [];
      
      for (const fileData of files) {
        // Marcar arquivo como sendo processado
        setFiles(prev => prev.map(f => 
          f.file === fileData.file ? { ...f, uploading: true } : f
        ));
        
        // Upload do arquivo para o storage
        const fileExt = fileData.file.name.split('.').pop();
        const filePath = `${uuidv4()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, fileData.file);
        
        if (uploadError) {
          throw new Error(`Erro ao fazer upload do arquivo ${fileData.file.name}: ${uploadError.message}`);
        }
        
        // Processar conteúdo do arquivo
        const processingResult = await processFile(fileData.file);
        
        // Registrar arquivo no banco
        const { data: fileRecord, error: dbError } = await supabase
          .from('uploaded_files')
          .insert({
            filename: fileData.file.name,
            file_path: filePath,
            file_type: fileData.file.type,
            file_size: fileData.file.size,
            analysis_path: processingResult.success ? `processed_${uuidv4()}.json` : null,
            user_id: user.id
          })
          .select()
          .single();
          
        if (dbError) {
          console.error('Erro ao registrar arquivo:', dbError);
        }
        
        results.push({
          ...fileData,
          result: processingResult,
          uploading: false
        });
        
        // Atualizar arquivo processado
        setFiles(prev => prev.map(f => 
          f.file === fileData.file 
            ? { ...f, result: processingResult, uploading: false }
            : f
        ));
        
        processedCount++;
        setProgress(Math.round((processedCount / totalFiles) * 100));
        
        // Mostrar resultado do processamento
        if (processingResult.success) {
          toast.success(`${fileData.file.name} processado com sucesso`, {
            description: processingResult.message
          });
        } else {
          toast.error(`Erro ao processar ${fileData.file.name}`, {
            description: processingResult.message
          });
        }
      }
      
      toast.success("Upload e processamento completos", {
        description: `${files.length} arquivo(s) processado(s). Os dados foram atualizados automaticamente.`
      });
      
      // Limpar arquivos após 3 segundos para mostrar os resultados
      setTimeout(() => {
        setFiles([]);
      }, 3000);
      
    } catch (error) {
      toast.error("Erro no upload", {
        description: error instanceof Error ? error.message : "Ocorreu um erro durante o upload."
      });
      console.error("Erro de upload:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full dashboard-card border-green-500/15">
      <CardHeader>
        <CardTitle className="text-white">Upload e Processamento Automático</CardTitle>
        <CardDescription className="text-white/70">
          Envie arquivos de planilha (Excel, CSV) para importação automática de dados de estoque e funcionários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-green-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-green-400/50 transition-colors bg-green-500/5">
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
              <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <FileUp className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-sm font-medium text-white">
                Clique para selecionar ou arraste arquivos aqui
              </p>
              <p className="text-xs text-white/60">
                Suporta arquivos Excel e CSV com dados de estoque ou funcionários
              </p>
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">Arquivos ({files.length}):</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map((fileData, index) => (
                <div key={index} className="flex items-center justify-between bg-secondary/30 border border-green-500/20 rounded p-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      {fileData.uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                      ) : fileData.result ? (
                        fileData.result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium text-white">{fileData.file.name}</p>
                      {fileData.result && (
                        <p className={`text-xs ${fileData.result.success ? 'text-green-400' : 'text-red-400'}`}>
                          {fileData.result.message}
                        </p>
                      )}
                      {fileData.uploading && (
                        <p className="text-xs text-blue-400">Processando...</p>
                      )}
                    </div>
                  </div>
                  {!uploading && (
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="text-white/60 hover:text-white">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white">
              <span>Progresso do processamento</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="bg-secondary/30" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white" 
          onClick={handleUpload} 
          disabled={files.length === 0 || uploading}
        >
          {uploading ? "Processando arquivos..." : "Enviar e Processar Arquivos"}
        </Button>
        
        <div className="text-xs text-center text-white/60 space-y-2">
          <p>Os arquivos serão processados automaticamente e os dados importados para o sistema</p>
          <div className="bg-secondary/20 border border-green-500/20 p-3 rounded text-left">
            <p className="font-medium text-green-300 mb-1">Formatos suportados:</p>
            <ul className="text-white/70 space-y-1">
              <li>• <strong className="text-green-400">Estoque:</strong> Colunas: product/produto, quantity/quantidade, minimum/mínimo, category/categoria</li>
              <li>• <strong className="text-blue-400">Funcionários:</strong> Colunas: name/nome, position/cargo, hire_date/contratação</li>
            </ul>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
