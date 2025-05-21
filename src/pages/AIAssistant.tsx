
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Bot, Trash, AlertCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useLocalAssistant } from "@/hooks/useLocalAssistant";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const AIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const { messages, sendMessage, isLoading, clearMessages, error } = useLocalAssistant();
  const [useLocalAI, setUseLocalAI] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    await sendMessage(prompt);
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Assistente de IA</h1>
          <p className="text-muted-foreground">
            Assistente local que responde com base em conhecimento pre-definido
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Assistente Local
            </CardTitle>
            <CardDescription>
              Nosso assistente de IA local especializado em análise de dados e insights para negócios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium text-lg mb-1">Como posso ajudar?</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Pergunte sobre análise de dados, tendências de mercado, ou solicite insights 
                    sobre seu negócio.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Conversa</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={clearMessages}
                    >
                      <Trash className="h-4 w-4" />
                      Limpar
                    </Button>
                  </div>
                  
                  <div className="space-y-4 max-h-[500px] overflow-y-auto p-1">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className={`max-w-[90%]`}>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-muted text-foreground'
                            } max-w-full`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words overflow-hidden max-w-full">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <form 
            onSubmit={handleSubmit} 
            className="max-w-4xl mx-auto flex gap-2"
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Digite sua pergunta aqui..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Enviar</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
