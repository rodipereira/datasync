
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DataAnalyzer from "@/components/ai/DataAnalyzer";
import { Brain } from "lucide-react";

const AnalysisSection = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold">Análise Inteligente</h2>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Brain className="h-4 w-4 mr-2" />
              Abrir Analisador IA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Análise Inteligente de Dados
              </DialogTitle>
            </DialogHeader>
            <DataAnalyzer />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AnalysisSection;
