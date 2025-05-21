
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";
import MetricsHeader from "./employee/MetricsHeader";
import MetricsStateDisplay from "./employee/MetricsStateDisplay";
import PerformanceChart from "./employee/PerformanceChart";
import MetricsTable from "./employee/MetricsTable";

interface EmployeeData {
  id: string;
  name: string;
  position: string;
}

interface MetricData {
  id: string;
  month: string;
  revenue: number;
  clients_acquired: number;
  employees_hired: number;
}

interface EmployeeMetricsProps {
  employeeId: string;
}

const EmployeeMetrics = ({ employeeId }: EmployeeMetricsProps) => {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchEmployeeData();
    fetchEmployeeMetrics();
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("id, name, position")
        .eq("id", employeeId)
        .single();

      if (error) throw error;
      setEmployee(data);
    } catch (error) {
      console.error("Erro ao buscar dados do funcionário:", error);
      toast.error("Erro ao carregar dados do funcionário");
    }
  };

  const fetchEmployeeMetrics = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("employee_metrics")
        .select("*")
        .eq("employee_id", employeeId)
        .order("month", { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error("Erro ao buscar métricas do funcionário:", error);
      toast.error("Erro ao carregar métricas de desempenho");
    } finally {
      setLoading(false);
    }
  };

  const handleMetricSaved = () => {
    fetchEmployeeMetrics();
  };

  const handleExportData = async () => {
    if (!employee) return;

    try {
      setExporting(true);

      // Formatar dados para exportação
      const dataForExport = metrics.map((metric) => ({
        Mês: format(new Date(metric.month), "MMMM yyyy", { locale: pt }),
        Receita: `R$ ${metric.revenue.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        "Clientes Adquiridos": metric.clients_acquired,
        "Funcionários Contratados": metric.employees_hired,
      }));

      // Exportar para Excel
      await exportToExcel(
        dataForExport,
        `metricas_${employee.name.toLowerCase().replace(/\s+/g, "_")}`
      );

      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar dados");
    } finally {
      setExporting(false);
    }
  };

  if (!employee) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <MetricsHeader 
            employee={employee}
            onMetricSaved={handleMetricSaved}
            onExportData={handleExportData}
            isExporting={exporting}
            hasMetrics={metrics.length > 0}
          />
        </CardHeader>
        <CardContent>
          <MetricsStateDisplay 
            loading={loading} 
            isEmpty={metrics.length === 0} 
          />
          
          {!loading && metrics.length > 0 && (
            <div className="space-y-8">
              {/* Gráficos de desempenho */}
              <PerformanceChart metrics={metrics} />

              {/* Tabela de métricas */}
              <MetricsTable metrics={metrics} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeMetrics;
