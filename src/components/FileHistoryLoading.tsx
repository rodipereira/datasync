
import { Card, CardContent } from "@/components/ui/card";

const FileHistoryLoading = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Carregando histórico de arquivos...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileHistoryLoading;
