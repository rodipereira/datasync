
import { Card, CardContent } from "@/components/ui/card";

const EmptyFileHistory = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Nenhum arquivo encontrado.<br />
            Faça upload de arquivos para começar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyFileHistory;
