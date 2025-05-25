
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Bot, Trash, AlertCircle, Zap } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useGroqAssistant } from "@/hooks/useGroqAssistant";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useTypewriterEffect } from "@/hooks/useTypewriterEffect";
import { Badge } from "@/components/ui/badge";

const AIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const { messages, sendMessage, isLoading, clearMessages, error } = useGroqAssistant();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Estado para controlar qual mensagem está sendo animada
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [processedMessages, setProcessedMessages] = useState<typeof messages>([]);

  // Efeito para animar a última mensagem recebida
  useEffect(() => {
    if (messages.length > 0 && messages.length > processedMessages.length) {
      // Se chegou uma nova mensagem do assistente, começa a animá-la
      if (messages[messages.length - 1].role === 'assistant') {
        setAnimatingIndex(messages.length - 1);
      } else {
        // Se for mensagem do usuário, apenas adiciona sem animação
        setProcessedMessages(messages);
      }
    }
  }, [messages, processedMessages.length]);

  // Configura o efeito de digitação para a mensagem atual sendo animada
  const currentAnimatingMessage = animatingIndex !== null ? messages[animatingIndex] : null;
  const { displayedText, isTyping } = useTypewriterEffect({
    text: currentAnimatingMessage?.content || "",
    delay: 20, // Mais rápido para mostrar a velocidade do Groq
    speedFactor: 1.5,
    onComplete: () => {
      setAnimatingIndex(null);
      setProcessedMessages(messages);
    }
  });

  // Rola para o final da conversa quando novas mensagens chegam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [processedMessages, displayedText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    await sendMessage(prompt);
    setPrompt("");
  };

  // Determina quais mensagens mostrar
  const displayMessages = processedMessages.map((msg, idx) => {
    if (idx === animatingIndex) {
      return { ...msg, content: displayedText };
    }
    return msg;
  });

  // Adiciona a mensagem animada atual se ainda não estiver em processedMessages
  if (animatingIndex !== null && animatingIndex >= processedMessages.length) {
    displayMessages.push({
      role: 'assistant',
      content: displayedText
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Assistente de IA</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Groq - Ultra Rápido
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Assistente inteligente powered by Groq - respostas instantâneas para análise de dados e insights de negócio
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
              Assistente Groq
            </CardTitle>
            <CardDescription>
              Assistente de IA ultrarrápido especializado em análise de dados e insights para negócios.
              Pergunte sobre tendências, métricas, estratégias ou análises.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {displayMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium text-lg mb-1">Como posso ajudar?</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Pergunte sobre análise de dados, métricas de desempenho, tendências de mercado, 
                    ou solicite insights sobre seu negócio.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">Análise de vendas</Badge>
                    <Badge variant="outline" className="text-xs">Gestão de estoque</Badge>
                    <Badge variant="outline" className="text-xs">Performance de equipe</Badge>
                    <Badge variant="outline" className="text-xs">Insights financeiros</Badge>
                  </div>
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
                    {displayMessages.map((msg, index) => (
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
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground border'
                            } max-w-full`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words overflow-hidden max-w-full">
                              {msg.content}
                              {index === animatingIndex && isTyping && (
                                <span className="animate-pulse text-primary">|</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
              
              {isLoading && animatingIndex === null && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Processando com Groq...</span>
                    </div>
                  </div>
                </div>
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
              placeholder="Digite sua pergunta sobre dados, análises ou insights..."
              disabled={isLoading || isTyping}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !prompt.trim() || isTyping}
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
