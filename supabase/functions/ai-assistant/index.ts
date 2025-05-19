
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, history } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY não está configurada nos segredos do Supabase");
      throw new Error('OPENAI_API_KEY não está configurada')
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt é obrigatório' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Preparar o histórico de mensagens para o OpenAI
    const messages = [
      { 
        role: "system", 
        content: "Você é um assistente de análise de dados especializado em ajudar com dados de negócios. " +
                 "Você ajuda a interpretar dados, identificar tendências e fornecer insights para o usuário. " +
                 "Use linguagem simples e objetiva, mas com precisão técnica. " + 
                 "Quando possível, sugira ações baseadas em dados. " +
                 "Sempre responda em português do Brasil. " +
                 "Mantenha suas respostas concisas e diretas, evitando textos muito longos."
      }
    ]

    // Adicionar histórico de mensagens, se existir
    if (history && Array.isArray(history)) {
      messages.push(...history)
    }

    // Adicionar a nova mensagem do usuário
    messages.push({ role: "user", content: prompt })

    console.log("Enviando requisição para OpenAI com", messages.length, "mensagens")
    console.log("Conteúdo do prompt:", prompt.substring(0, 100))

    // Chamar a API do OpenAI com um modelo mais leve e limitação de tokens
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Usando um modelo mais leve
        messages: messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 300  // Limitando ainda mais o tamanho da resposta
      })
    })

    const responseText = await response.text();
    console.log("Resposta bruta da OpenAI:", responseText.substring(0, 500) + (responseText.length > 500 ? "..." : ""));

    if (!response.ok) {
      console.error('Erro na API OpenAI. Status:', response.status);
      console.error('Corpo da resposta:', responseText);
      
      // Se for erro de cota, forneça uma resposta mais específica
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            response: "Desculpe, o limite de uso da API foi excedido. Por favor, tente novamente mais tarde ou entre em contato com o administrador do sistema para atualizar a cota da API.",
            status: 429
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      throw new Error(`Erro na API OpenAI: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Erro ao parsear a resposta da OpenAI:', error);
      throw new Error('Resposta inválida da OpenAI');
    }

    console.log("Resposta da OpenAI processada:", JSON.stringify({
      model: data.model,
      object: data.object,
      usage: data.usage,
      choices_length: data.choices?.length
    }))
    
    const assistantResponse = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua solicitação.";

    return new Response(
      JSON.stringify({ 
        response: assistantResponse,
        usage: data.usage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Erro no processamento da edge function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
