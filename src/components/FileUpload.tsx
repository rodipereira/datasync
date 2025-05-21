
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { X, FileUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Simular processamento de análise do arquivo
  const simulateProcessing = async (fileId: string, filename: string) => {
    // Em um ambiente real, este seria um webhook ou processo separado
    // que seria acionado após o upload e realizaria a análise
    
    // Aguardar um tempo para simular processamento
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 5000));
    
    // Atualizar registro para indicar que o arquivo foi processado
    const analysisPath = `analysis_${uuidv4()}.pdf`;
    
    const { error } = await supabase
      .from('uploaded_files')
      .update({
        analysis_path: analysisPath,
        processing_status: 'concluído'
      })
      .eq('id', fileId);
      
    if (error) {
      console.error('Erro ao atualizar status de processamento:', error);
    }
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
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado. Faça login para continuar.");
      }
      
      let uploadedCount = 0;
      const totalFiles = files.length;
      const uploadedFileIds: { id: string, filename: string }[] = [];
      
      for (const file of files) {
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const filePath = `${uuidv4()}.${fileExt}`;
        const fullPath = `${filePath}`;
        
        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(fullPath, file);
        
        if (uploadError) {
          throw new Error(`Erro ao fazer upload do arquivo ${file.name}: ${uploadError.message}`);
        }
        
        // Get public URL for the file
        const { data: publicUrlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(fullPath);
          
        // Create record in uploaded_files table
        const { data: fileRecord, error: dbError } = await supabase
          .from('uploaded_files')
          .insert({
            filename: file.name,
            file_path: fullPath,
            file_type: file.type,
            file_size: file.size,
            analysis_path: null, // Will be updated when analysis is complete
            processing_status: 'processando',
            user_id: user.id // Add the user_id field
          })
          .select()
          .single();
          
        if (dbError) {
          throw new Error(`Erro ao registrar arquivo no banco de dados: ${dbError.message}`);
        }
        
        if (fileRecord) {
          uploadedFileIds.push({ id: fileRecord.id, filename: fileRecord.filename });
        }
        
        uploadedCount++;
        setProgress(Math.round((uploadedCount / totalFiles) * 100));
      }
      
      toast.success("Upload completo", {
        description: `${files.length} arquivo(s) enviado(s) com sucesso.`
      });
      
      // Clear the files after successful upload
      setFiles([]);
      
      // Iniciar processamento simulado para cada arquivo
      for (const file of uploadedFileIds) {
        simulateProcessing(file.id, file.filename);
      }
      
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload de Arquivos</CardTitle>
        <CardDescription>
          Faça upload de arquivos de planilha (Excel, CSV) para análise automática
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls,.pdf"
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">
                Clique para selecionar ou arraste arquivos aqui
              </p>
              <p className="text-xs text-gray-500">
                Suporta arquivos Excel, CSV e PDF até 10MB
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
          disabled={files.length === 0 || uploading}
        >
          {uploading ? "Enviando..." : "Enviar Arquivos"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Os arquivos serão armazenados e processados para análise em tempo real
        </p>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
