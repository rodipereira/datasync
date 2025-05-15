
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
                 "Quando possível, sugira ações baseadas em dados."
      }
    ]

    // Adicionar histórico de mensagens, se existir
    if (history && Array.isArray(history)) {
      messages.push(...history)
    }

    // Adicionar a nova mensagem do usuário
    messages.push({ role: "user", content: prompt })

    // Chamar a API do OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro na API OpenAI: ${error}`)
    }

    const data = await response.json()
    const assistantResponse = data.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação."

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
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
