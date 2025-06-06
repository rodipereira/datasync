
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    position: "",
    bio: ""
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        
        // Obter o usuário atual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        if (user) {
          console.log("User metadata:", user.user_metadata);
          
          // Obter dados do perfil a partir da tabela de usuários
          setProfile({
            name: user.user_metadata?.name || "",
            email: user.email || "",
            company: user.user_metadata?.company || "",
            phone: user.user_metadata?.phone || "",
            position: user.user_metadata?.position || "",
            bio: user.user_metadata?.bio || ""
          });

          // Verificar se há avatar_url nos metadados
          if (user.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Erro ao carregar os dados do usuário");
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Obter o usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Atualizar os metadados do usuário
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
          company: profile.company,
          phone: profile.phone,
          position: profile.position,
          bio: profile.bio,
          avatar_url: avatarUrl
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
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
      setAvatarUrl(avatarUrl);

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

  const handleResetPassword = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email) {
        throw new Error("Usuário não possui email cadastrado");
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + '/profile'
      });
      
      if (error) throw error;
      
      toast.success("Email de redefinição de senha enviado com sucesso!", {
        description: "Verifique sua caixa de entrada e siga as instruções."
      });
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast.error("Não foi possível enviar o email de redefinição de senha");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Informações do Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <div className="text-center md:w-1/4">
            <div className="flex flex-col items-center space-y-4">
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
              >
                {uploading ? "Enviando..." : "Alterar foto"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 mt-2"
                onClick={handleResetPassword}
              >
                <Key className="h-4 w-4" />
                Alterar senha
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={profile.name} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={profile.email} 
                  onChange={handleChange} 
                  required 
                  disabled={true} // Email não pode ser alterado
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input 
                  id="company" 
                  name="company"
                  value={profile.company} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={profile.phone} 
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input 
                  id="position" 
                  name="position"
                  value={profile.position} 
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio"
                value={profile.bio} 
                onChange={handleChange} 
                rows={3}
                disabled={loading}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
