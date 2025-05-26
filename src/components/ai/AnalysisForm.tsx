
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Loader2 } from "lucide-react";

interface AnalysisFormProps {
  question: string;
  setQuestion: (question: string) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({
  question,
  setQuestion,
  isAnalyzing,
  onAnalyze
}) => {
  const predefinedQuestions = [
    "Como está a saúde do meu estoque?",
    "Quais produtos devo comprar primeiro?",
    "Como posso melhorar minha eficiência?",
    "Qual a previsão de vendas para próximo mês?",
    "Onde posso reduzir custos?"
  ];

  return (
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
          onClick={onAnalyze} 
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
  );
};

export default AnalysisForm;
