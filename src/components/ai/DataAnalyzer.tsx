
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AnalysisForm from "./AnalysisForm";
import AnalysisResults from "./AnalysisResults";
import DataStatus from "./DataStatus";

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

  return (
    <div className="space-y-6 bg-gray-900 text-white min-h-full">
      <AnalysisForm
        question={question}
        setQuestion={setQuestion}
        isAnalyzing={isAnalyzing}
        onAnalyze={analyzeData}
      />

      <AnalysisResults analysis={analysis} />

      <DataStatus businessData={businessData} />
    </div>
  );
};

export default DataAnalyzer;
