
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const useAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Adiciona a mensagem do usuário ao histórico
      const userMessage: Message = { role: 'user', content: prompt };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Filtra apenas as últimas 10 mensagens para enviar para a API
      const historyToSend = updatedMessages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .slice(-10);

      console.log("Enviando requisição para a edge function com histórico:", historyToSend.length, "mensagens");

      // Tenta enviar uma mensagem simples sem histórico primeiro, para reduzir custo de tokens
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          prompt,
          history: historyToSend.length > 2 ? historyToSend.slice(-2) : historyToSend // Envia apenas as últimas 2 mensagens
        }
      });

      if (error) {
        console.error('Erro da edge function:', error);
        throw new Error(`Erro ao chamar o assistente: ${error.message}`);
      }

      if (!data) {
        console.error('Resposta inválida da API:', data);
        throw new Error('Resposta inválida recebida do assistente');
      }

      console.log("Resposta recebida da edge function:", data);

      // Verifica se há erro de cota excedida
      if (data.status === 429) {
        setError(data.response);
        // Adiciona também como mensagem do assistente para ficar visível na conversa
        const errorMessage: Message = { role: 'assistant', content: data.response };
        setMessages([...updatedMessages, errorMessage]);
        return;
      }

      // Adiciona a resposta do assistente ao histórico
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response
      };
      setMessages([...updatedMessages, assistantMessage]);

    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      setError(error.message || "Erro desconhecido ao se comunicar com o assistente");
      toast.error('Erro ao se comunicar com o assistente de IA');
      // Adiciona uma mensagem de erro ao histórico para feedback visual ao usuário
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "Desculpe, tive um problema ao processar sua solicitação. Por favor, tente novamente mais tarde."
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
