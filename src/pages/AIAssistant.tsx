
import { useState, useRef, useEffect } from 'react';
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Bot, Send, Trash2, User, MessagesSquare, BarChart4 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage, clearMessages } = useAIAssistant();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sugestões de perguntas
  const suggestions = [
    "Qual é a tendência de vendas nos últimos meses?",
    "Como posso melhorar meu estoque?",
    "Quais produtos estão com desempenho abaixo do esperado?",
    "Quais são as projeções para o próximo trimestre?",
  ];

  // Rolagem automática para o fim das mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-1">Assistente de IA</h1>
        <p className="text-muted-foreground mb-6">
          Análise inteligente e assistência para seus dados
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Painel de chat */}
          <Card className="col-span-3 md:col-span-2 h-[calc(100vh-250px)] flex flex-col bg-sidebar">
            <CardHeader className="border-b border-sidebar-border">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>Conversar com IA</CardTitle>
              </div>
              <CardDescription>
                Faça perguntas sobre seus dados e obtenha insights
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <MessagesSquare className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">Assistente de IA</p>
                    <p className="max-w-md">
                      Pergunte sobre tendências de vendas, análise de estoque, desempenho de produtos ou qualquer questão relacionada aos dados do seu negócio.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex items-start gap-3 max-w-[80%] ${
                            msg.role === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <Avatar className={`h-8 w-8 ${
                            msg.role === 'user' ? 'bg-blue-100' : 'bg-primary'
                          }`}>
                            <AvatarFallback className={`${
                              msg.role === 'user' ? 'text-blue-500' : 'text-primary-foreground'
                            }`}>
                              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              msg.role === 'user'
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-muted text-foreground'
                            } max-w-full`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words overflow-hidden">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              <div className="p-4 border-t border-sidebar-border">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Digite sua pergunta..."
                    disabled={isLoading}
                    className="flex-1 bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="shrink-0"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Enviar</span>
                  </Button>
                  {messages.length > 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={clearMessages}
                      className="shrink-0 border-sidebar-border"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Limpar</span>
                    </Button>
                  )}
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Painel lateral */}
          <Card className="col-span-3 md:col-span-1 bg-sidebar">
            <CardHeader>
              <CardTitle>Sugestões</CardTitle>
              <CardDescription>
                Perguntas frequentes que podem ajudar na análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart4 className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-2">Sobre este assistente</h4>
                <p className="text-sm text-muted-foreground">
                  Este assistente de IA pode analisar seus dados, identificar tendências,
                  e fornecer insights para melhorar a tomada de decisões no seu negócio.
                  As respostas são baseadas nos dados disponíveis na plataforma.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
