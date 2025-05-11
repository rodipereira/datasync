
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "joao.silva@empresa.com.br",
    company: "Empresa ABC Ltda",
    phone: "(11) 98765-4321",
    position: "Analista de Dados",
    bio: "Especialista em análise de dados empresariais com 5 anos de experiência em gestão de estoques e vendas."
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você enviaria os dados para o backend
    console.log("Perfil atualizado:", profile);
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
              <Avatar className="h-24 w-24">
                <AvatarImage alt="Foto de perfil" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Alterar foto
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={profile.phone} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input 
                  id="position" 
                  name="position"
                  value={profile.position} 
                  onChange={handleChange} 
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
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
