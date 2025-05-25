
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
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    
    if (!groqApiKey) {
      console.error("GROQ_API_KEY não está configurada nos segredos do Supabase");
      throw new Error('GROQ_API_KEY não está configurada')
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

    // Preparar mensagens para o Groq
    const messages = [
      { 
        role: "system", 
        content: "Você é um assistente de IA especializado em análise de dados e insights para negócios. " +
                 "Você ajuda a interpretar dados, identificar tendências e fornecer insights valiosos. " +
                 "Use linguagem clara e objetiva, mas com precisão técnica. " + 
                 "Quando possível, sugira ações práticas baseadas em dados. " +
                 "Sempre responda em português brasileiro. " +
                 "Seja conciso e direto, focando no que realmente importa para o usuário."
      }
    ]

    // Adicionar histórico limitado (últimas 4 mensagens para economizar tokens)
    if (history && Array.isArray(history)) {
      messages.push(...history.slice(-4))
    }

    // Adicionar nova mensagem do usuário
    messages.push({ role: "user", content: prompt })

    console.log("Enviando requisição para Groq com", messages.length, "mensagens")
    console.log("Conteúdo do prompt:", prompt.substring(0, 100))

    // Chamar a API do Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Modelo rápido e eficiente
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        stream: false
      })
    })

    const responseText = await response.text();
    console.log("Status da resposta Groq:", response.status);

    if (!response.ok) {
      console.error('Erro na API Groq. Status:', response.status);
      console.error('Corpo da resposta:', responseText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            response: "Limite de requisições excedido. Aguarde um momento e tente novamente.",
            status: 429
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      throw new Error(`Erro na API Groq: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Erro ao parsear resposta do Groq:', error);
      throw new Error('Resposta inválida do Groq');
    }

    console.log("Resposta do Groq processada:", JSON.stringify({
      model: data.model,
      usage: data.usage,
      choices_length: data.choices?.length
    }))
    
    const assistantResponse = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua solicitação.";

    return new Response(
      JSON.stringify({ 
        response: assistantResponse,
        usage: data.usage,
        model: data.model
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Erro no processamento da edge function Groq:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
