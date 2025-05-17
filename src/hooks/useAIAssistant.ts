
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

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      
      // Adiciona a mensagem do usuário ao histórico
      const userMessage: Message = { role: 'user', content: prompt };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Filtra apenas as últimas 10 mensagens para enviar para a API
      const historyToSend = updatedMessages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .slice(-10);

      // Chama a edge function do Supabase
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          prompt,
          history: historyToSend
        }
      });

      if (error) throw new Error(error.message);

      // Adiciona a resposta do assistente ao histórico
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data?.response || "Desculpe, ocorreu um erro ao processar sua solicitação." 
      };
      setMessages([...updatedMessages, assistantMessage]);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao se comunicar com o assistente de IA');
      // Adiciona uma mensagem de erro ao histórico para feedback visual ao usuário
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "Desculpe, tive um problema ao processar sua solicitação. Por favor, tente novamente mais tarde."
      };
      setMessages([...messages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};
