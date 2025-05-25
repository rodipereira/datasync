
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const useGroqAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Adiciona mensagem do usuário
      const userMessage: Message = { role: 'user', content: prompt };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Filtra histórico para enviar apenas as conversas recentes
      const historyToSend = updatedMessages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .slice(-6); // Últimas 6 mensagens (3 pares de pergunta/resposta)

      console.log("Enviando requisição para Groq com histórico:", historyToSend.length, "mensagens");

      // Chama a edge function do Groq
      const { data, error } = await supabase.functions.invoke('groq-assistant', {
        body: {
          prompt,
          history: historyToSend
        }
      });

      if (error) {
        console.error('Erro da edge function Groq:', error);
        throw new Error(`Erro ao chamar o assistente Groq: ${error.message}`);
      }

      if (!data) {
        console.error('Resposta inválida da API Groq:', data);
        throw new Error('Resposta inválida recebida do assistente Groq');
      }

      console.log("Resposta recebida do Groq:", data);

      // Verifica se há erro de limite
      if (data.status === 429) {
        setError(data.response);
        const errorMessage: Message = { role: 'assistant', content: data.response };
        setMessages([...updatedMessages, errorMessage]);
        return;
      }

      // Adiciona resposta do assistente
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response
      };
      setMessages([...updatedMessages, assistantMessage]);

      // Log de uso (opcional)
      if (data.usage) {
        console.log("Tokens utilizados:", data.usage);
      }

    } catch (error: any) {
      console.error('Erro ao enviar mensagem para Groq:', error);
      setError(error.message || "Erro desconhecido ao se comunicar com o assistente Groq");
      toast.error('Erro ao se comunicar com o assistente de IA');
      
      // Adiciona mensagem de erro ao histórico
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "Desculpe, tive um problema ao processar sua solicitação. Por favor, tente novamente."
      };
      setMessages([...messages, { role: 'user', content: prompt }, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};
