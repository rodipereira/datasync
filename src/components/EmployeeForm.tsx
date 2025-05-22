
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Camera, User } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuidv4 } from "uuid";

interface EmployeeFormProps {
  onSaved?: () => void;
}

const EmployeeForm = ({ onSaved }: EmployeeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    position: "",
    hire_date: new Date(),
    avatar_url: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setEmployee((prev) => ({ ...prev, hire_date: date }));
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP.");
        return;
      }

      // Validar tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Tamanho máximo: 2MB.");
        return;
      }

      setUploading(true);

      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Usuário não autenticado");

      // Criar caminho único para a imagem
      const fileExt = file.name.split('.').pop();
      const filePath = `employees/${uuidv4()}.${fileExt}`;

      // Fazer upload da imagem para o bucket
      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter a URL pública da imagem
      const { data: publicUrlData } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;
      setEmployee(prev => ({ ...prev, avatar_url: avatarUrl }));

      toast.success("Foto adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      toast.error("Erro ao fazer upload da foto");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validar dados
      if (!employee.name.trim() || !employee.position.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      // Obter usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Inserir funcionário
      const { error } = await supabase.from('employees').insert([
        {
          name: employee.name,
          position: employee.position,
          hire_date: format(employee.hire_date, 'yyyy-MM-dd'),
          user_id: user.id,
          avatar_url: employee.avatar_url || null
        }
      ]);
      
      if (error) throw error;
      
      toast.success("Funcionário cadastrado com sucesso!");
      
      // Limpar formulário
      setEmployee({
        name: "",
        position: "",
        hire_date: new Date(),
        avatar_url: ""
      });
      
      // Callback
      if (onSaved) {
        onSaved();
      }
      
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      toast.error("Erro ao cadastrar funcionário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Funcionário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <Avatar 
              className="h-24 w-24 cursor-pointer mb-4" 
              onClick={handleAvatarClick}
            >
              <AvatarImage alt="Foto do funcionário" src={employee.avatar_url || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={handleAvatarClick}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              {uploading ? "Enviando..." : <>
                <Camera className="h-4 w-4" />
                Adicionar foto
              </>}
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo*</Label>
            <Input
              id="name"
              name="name"
              value={employee.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Cargo*</Label>
            <Input
              id="position"
              name="position"
              value={employee.position}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hire_date">Data de contratação</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !employee.hire_date && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {employee.hire_date ? (
                    format(employee.hire_date, "dd/MM/yyyy")
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={employee.hire_date}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={loading}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
