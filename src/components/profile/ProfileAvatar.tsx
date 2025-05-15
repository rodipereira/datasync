
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  onAvatarChange: (url: string) => void;
}

const ProfileAvatar = ({ avatarUrl, onAvatarChange }: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
      const filePath = `${user.id}/${uuidv4()}.${fileExt}`;

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
      onAvatarChange(avatarUrl);

      // Atualizar os metadados do usuário com a nova URL do avatar
      await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      });

      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar foto:", error);
      toast.error("Erro ao atualizar foto de perfil");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
        <AvatarImage alt="Foto de perfil" src={avatarUrl || ""} />
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
        variant="outline" 
        size="sm" 
        onClick={handleAvatarClick}
        disabled={uploading}
        className="w-full max-w-[150px]"
      >
        {uploading ? "Enviando..." : "Alterar foto"}
      </Button>
    </div>
  );
};

export default ProfileAvatar;
