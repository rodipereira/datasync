
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Trash2, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Secret {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const EdgeFunctionSecrets = () => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSecretName, setNewSecretName] = useState("");
  const [newSecretValue, setNewSecretValue] = useState("");
  const [showValue, setShowValue] = useState<Record<string, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    try {
      // Simula buscar secrets (na prática, você integraria com a API do Supabase)
      // Por segurança, a API não retorna os valores dos secrets
      setSecrets([
        { id: "1", name: "OPENAI_API_KEY", created_at: "2024-01-15", updated_at: "2024-01-15" },
        { id: "2", name: "STRIPE_SECRET_KEY", created_at: "2024-01-10", updated_at: "2024-01-10" },
      ]);
    } catch (error) {
      console.error('Erro ao carregar secrets:', error);
      toast.error('Erro ao carregar secrets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSecret = async () => {
    if (!newSecretName.trim() || !newSecretValue.trim()) {
      toast.error('Nome e valor do secret são obrigatórios');
      return;
    }

    try {
      // Simula adicionar secret (integração com API do Supabase)
      const newSecret: Secret = {
        id: Date.now().toString(),
        name: newSecretName.toUpperCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setSecrets([...secrets, newSecret]);
      setNewSecretName("");
      setNewSecretValue("");
      setIsDialogOpen(false);
      toast.success('Secret adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar secret:', error);
      toast.error('Erro ao adicionar secret');
    }
  };

  const handleDeleteSecret = async (secretId: string) => {
    try {
      setSecrets(secrets.filter(s => s.id !== secretId));
      toast.success('Secret removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover secret:', error);
      toast.error('Erro ao remover secret');
    }
  };

  const toggleShowValue = (secretId: string) => {
    setShowValue(prev => ({
      ...prev,
      [secretId]: !prev[secretId]
    }));
  };

  const commonSecrets = [
    { name: "OPENAI_API_KEY", description: "Chave da API do OpenAI para IA" },
    { name: "STRIPE_SECRET_KEY", description: "Chave secreta do Stripe para pagamentos" },
    { name: "RESEND_API_KEY", description: "Chave da API do Resend para emails" },
    { name: "TWILIO_AUTH_TOKEN", description: "Token do Twilio para SMS" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Edge Function Secrets
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as chaves de API e secrets para suas edge functions
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Secret
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Secret</DialogTitle>
                <DialogDescription>
                  Adicione uma nova chave de API ou secret para suas edge functions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="secretName">Nome do Secret</Label>
                  <Input
                    id="secretName"
                    placeholder="ex: OPENAI_API_KEY"
                    value={newSecretName}
                    onChange={(e) => setNewSecretName(e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <Label htmlFor="secretValue">Valor do Secret</Label>
                  <Input
                    id="secretValue"
                    type="password"
                    placeholder="Insira o valor do secret"
                    value={newSecretValue}
                    onChange={(e) => setNewSecretValue(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddSecret} className="w-full">
                  Adicionar Secret
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Os secrets são armazenados de forma segura e criptografada. Eles ficam disponíveis 
            nas suas edge functions através de <code>Deno.env.get('NOME_DO_SECRET')</code>.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* Secrets atuais */}
          <Card>
            <CardHeader>
              <CardTitle>Secrets Configurados</CardTitle>
              <CardDescription>
                Secrets atualmente disponíveis para suas edge functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Carregando secrets...</p>
                </div>
              ) : secrets.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg mb-1">Nenhum secret configurado</h3>
                  <p className="text-muted-foreground text-sm">
                    Adicione seu primeiro secret para começar a usar APIs externas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {secrets.map((secret) => (
                    <div
                      key={secret.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{secret.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Criado em {new Date(secret.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Configurado</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSecret(secret.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Secrets comuns */}
          <Card>
            <CardHeader>
              <CardTitle>Secrets Comuns</CardTitle>
              <CardDescription>
                Alguns secrets frequentemente utilizados em projetos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {commonSecrets.map((item) => {
                  const isConfigured = secrets.some(s => s.name === item.name);
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge variant={isConfigured ? "default" : "outline"}>
                        {isConfigured ? "Configurado" : "Não configurado"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Documentação */}
          <Card>
            <CardHeader>
              <CardTitle>Como usar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Nas Edge Functions</h4>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">
                    const apiKey = Deno.env.get('OPENAI_API_KEY')
                  </code>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Exemplo de uso</h4>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">
                    {`const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: {
    'Authorization': \`Bearer \${Deno.env.get('OPENAI_API_KEY')}\`
  }
})`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EdgeFunctionSecrets;
