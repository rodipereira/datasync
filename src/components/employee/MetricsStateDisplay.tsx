
import React from "react";
import { Loader2 } from "lucide-react";

interface MetricsStateDisplayProps {
  loading: boolean;
  isEmpty: boolean;
}

const MetricsStateDisplay = ({ loading, isEmpty }: MetricsStateDisplayProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Nenhuma métrica de desempenho registrada
        </p>
      </div>
    );
  }

  return null;
};

export default MetricsStateDisplay;
