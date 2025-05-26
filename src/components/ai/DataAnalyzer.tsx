
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb,
  BarChart3,
  Send,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface AnalysisResult {
  type: 'insight' | 'recommendation' | 'alert' | 'prediction';
  title: string;
  content: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

const DataAnalyzer = () => {
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult[]>([]);

  // Buscar dados para análise
  const { data: businessData } = useQuery({
    queryKey: ["businessData"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [inventory, employees] = await Promise.all([
        supabase.from("inventory").select("*").eq("user_id", user.id),
        supabase.from("employees").select("*").eq("user_id", user.id)
      ]);

      return {
        inventory: inventory.data || [],
        employees: employees.data || [],
        totalInventoryValue: inventory.data?.reduce((sum, item) => sum + (item.quantity * 50), 0) || 0,
        lowStockItems: inventory.data?.filter(item => item.quantity <= item.minimum_level).length || 0
      };
    }
  });

  const analyzeData = async () => {
    if (!question.trim() || !businessData) {
      toast.error("Digite uma pergunta para analisar");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simular análise de IA (aqui você integraria com uma API de IA real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: AnalysisResult[] = [
        {
          type: 'insight',
          title: 'Padrão de Estoque Identificado',
          content: `Com base nos dados analisados, identifiquei que ${businessData.lowStockItems} itens estão com estoque baixo. Isso representa ${((businessData.lowStockItems / businessData.inventory.length) * 100).toFixed(1)}% do seu inventário total.`,
          confidence: 87,
          impact: 'high'
        },
        {
          type: 'recommendation',
          title: 'Otimização de Compras',
          content: 'Recomendo implementar um sistema de reposição automática para produtos que ficam abaixo de 20% do estoque mínimo. Isso pode reduzir rupturas em até 75%.',
          confidence: 92,
          impact: 'high'
        },
        {
          type: 'prediction',
          title: 'Previsão de Demanda',
          content: 'Baseado no padrão atual, você precisará de R$ 15.000 adiciais em estoque nos próximos 30 dias para manter o nível de serviço.',
          confidence: 78,
          impact: 'medium'
        },
        {
          type: 'alert',
          title: 'Atenção Necessária',
          content: 'Detectei que 3 produtos críticos podem ter ruptura nos próximos 7 dias se não houver reposição imediata.',
          confidence: 95,
          impact: 'high'
        }
      ];

      setAnalysis(mockAnalysis);
      toast.success("Análise concluída!");
      
    } catch (error) {
      toast.error("Erro ao analisar dados");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'insight': return <Lightbulb className="h-4 w-4" />;
      case 'recommendation': return <TrendingUp className="h-4 w-4" />;
      case 'prediction': return <BarChart3 className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'insight': return 'text-blue-400';
      case 'recommendation': return 'text-green-400';
      case 'prediction': return 'text-purple-400';
      case 'alert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const predefinedQuestions = [
    "Como está a saúde do meu estoque?",
    "Quais produtos devo comprar primeiro?",
    "Como posso melhorar minha eficiência?",
    "Qual a previsão de vendas para próximo mês?",
    "Onde posso reduzir custos?"
  ];

  return (
    <div className="space-y-6 bg-gray-900 text-white min-h-full">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5" />
            Analisador de Dados com IA
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">Beta</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">
              Faça uma pergunta sobre seus dados:
            </label>
            <Textarea
              placeholder="Ex: Como posso otimizar meu estoque para reduzir custos?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-20 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-2">Sugestões rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {predefinedQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuestion(q)}
                  className="text-xs bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={analyzeData} 
            disabled={isAnalyzing || !question.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analisando dados...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Analisar com IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados da Análise */}
      {analysis.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-400" />
            Resultados da Análise
          </h3>
          
          {analysis.map((result, index) => (
            <Card key={index} className="border-l-4 border-l-purple-500 bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={getColor(result.type)}>
                      {getIcon(result.type)}
                    </span>
                    <h4 className="font-medium text-white">{result.title}</h4>
                    <Badge 
                      variant={result.impact === 'high' ? 'destructive' : 
                              result.impact === 'medium' ? 'default' : 'secondary'}
                      className={result.impact === 'high' ? 'bg-red-600' : 
                                result.impact === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'}
                    >
                      {result.impact === 'high' ? 'Alto Impacto' : 
                       result.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {result.confidence}% confiança
                  </Badge>
                </div>
                
                <p className="text-gray-300">{result.content}</p>
                
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Aplicar Sugestão
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Status dos Dados */}
      {businessData && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2 text-white">Status dos Dados Disponíveis:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Produtos:</span>
                <span className="ml-2 font-medium text-white">{businessData.inventory.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Funcionários:</span>
                <span className="ml-2 font-medium text-white">{businessData.employees.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Valor Total:</span>
                <span className="ml-2 font-medium text-white">R$ {businessData.totalInventoryValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Estoque Baixo:</span>
                <span className="ml-2 font-medium text-red-400">{businessData.lowStockItems}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataAnalyzer;
