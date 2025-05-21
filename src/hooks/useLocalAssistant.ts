
import { useState } from 'react';
import { toast } from 'sonner';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// Base de conhecimento para o assistente local
const knowledgeBase = {
  vendas: [
    "Para aumentar as vendas, foque em melhorar a experiência do cliente.",
    "Análise de dados de vendas pode revelar padrões e oportunidades de crescimento.",
    "Implemente estratégias de cross-selling e up-selling com clientes existentes.",
    "Monitore métricas como taxa de conversão, valor médio de pedido e retenção de clientes."
  ],
  estoque: [
    "Um controle de estoque eficiente reduz custos e evita perda de vendas.",
    "O método FIFO (primeiro a entrar, primeiro a sair) é recomendado para gestão de estoque.",
    "Análise ABC pode ajudar a priorizar quais itens precisam de mais atenção.",
    "Utilize previsão de demanda baseada em dados históricos para otimizar níveis de estoque."
  ],
  funcionarios: [
    "Avalie o desempenho dos funcionários usando KPIs claros e mensuráveis.",
    "Feedbacks regulares são essenciais para o desenvolvimento da equipe.",
    "Análise de produtividade deve considerar fatores qualitativos e quantitativos.",
    "Estabeleça metas SMART: específicas, mensuráveis, atingíveis, relevantes e temporais."
  ],
  financas: [
    "Analise regularmente o fluxo de caixa para garantir saúde financeira.",
    "O ROI (Retorno sobre Investimento) é uma métrica essencial para avaliar investimentos.",
    "Mantenha separadas as finanças pessoais e empresariais.",
    "Provisione recursos para períodos sazonais ou de baixa demanda."
  ],
  geral: [
    "Dashboards visuais facilitam a compreensão de dados complexos do negócio.",
    "Tomada de decisão baseada em dados reduz riscos e aumenta chances de sucesso.",
    "Análise de tendências de mercado ajuda a antecipar mudanças e oportunidades.",
    "Um bom sistema de gestão integra dados de todas as áreas do negócio."
  ]
};

export const useLocalAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para identificar o tópico da mensagem
  const identifyTopic = (message: string): string => {
    message = message.toLowerCase();
    
    if (message.includes('venda') || message.includes('cliente') || message.includes('marketing')) {
      return 'vendas';
    } else if (message.includes('estoque') || message.includes('inventário') || message.includes('produto')) {
      return 'estoque';
    } else if (message.includes('funcionário') || message.includes('equipe') || message.includes('desempenho') || message.includes('contratação')) {
      return 'funcionarios';
    } else if (message.includes('finance') || message.includes('dinheiro') || message.includes('lucro') || message.includes('custo')) {
      return 'financas';
    } else {
      return 'geral';
    }
  };

  // Função para gerar uma resposta baseada no tópico
  const generateResponse = (topic: string, userMessage: string): string => {
    const relevantInfo = knowledgeBase[topic] || knowledgeBase.geral;
    
    // Combina algumas informações relevantes em uma resposta coerente
    let response = `Baseado na sua pergunta sobre ${topic}, posso compartilhar que:\n\n`;
    
    // Seleciona entre 2-3 pontos relevantes aleatoriamente
    const numberOfPoints = Math.floor(Math.random() * 2) + 2; // 2 ou 3
    const selectedPoints = new Set<number>();
    
    while (selectedPoints.size < numberOfPoints) {
      selectedPoints.add(Math.floor(Math.random() * relevantInfo.length));
    }
    
    selectedPoints.forEach(index => {
      response += `• ${relevantInfo[index]}\n\n`;
    });
    
    response += "Espero que essas informações ajudem. Há algo específico que você gostaria de saber em mais detalhes?";
    
    return response;
  };

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Adiciona a mensagem do usuário ao histórico
      const userMessage: Message = { role: 'user', content: prompt };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Simula um tempo de processamento para parecer mais natural
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Identifica o tópico da pergunta
      const topic = identifyTopic(prompt);
      
      // Gera uma resposta baseada no tópico
      const responseContent = generateResponse(topic, prompt);
      
      // Adiciona a resposta do assistente ao histórico
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: responseContent
      };
      
      setMessages([...updatedMessages, assistantMessage]);

    } catch (error: any) {
      console.error('Erro ao processar mensagem:', error);
      setError('Ocorreu um erro ao processar sua mensagem');
      toast.error('Erro ao processar sua mensagem');
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
