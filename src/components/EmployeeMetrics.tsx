
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { PlusCircle, Download, ArrowLeft, Loader2 } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MetricForm from "@/components/MetricForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  const [dialogOpen, setDialogOpen] = useState(false);

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
    setDialogOpen(false);
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

  const formatChartData = () => {
    // Ordenar por data (mais antiga para mais recente)
    return [...metrics]
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .map((metric) => ({
        name: format(new Date(metric.month), "MMM/yy", { locale: pt }),
        receita: metric.revenue,
        clientes: metric.clients_acquired,
        funcionarios: metric.employees_hired,
      }));
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="flex flex-col">
              <span>{employee.name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {employee.position}
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Adicionar Métrica
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Métrica de Desempenho</DialogTitle>
                  </DialogHeader>
                  <MetricForm
                    employeeId={employeeId}
                    onSaved={handleMetricSaved}
                  />
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="icon"
                disabled={metrics.length === 0 || exporting}
                onClick={handleExportData}
                title="Exportar dados"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : metrics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhuma métrica de desempenho registrada
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Gráficos de desempenho */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Evolução de Desempenho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={formatChartData()}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, "dataMax + 1"]}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="receita"
                          name="Receita (R$)"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="clientes"
                          name="Clientes"
                          stroke="#82ca9d"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="funcionarios"
                          name="Funcionários"
                          stroke="#ffc658"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Tabela de métricas */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead>Clientes Adquiridos</TableHead>
                      <TableHead>Funcionários Contratados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell className="font-medium">
                          {format(new Date(metric.month), "MMMM yyyy", {
                            locale: pt,
                          })}
                        </TableCell>
                        <TableCell>
                          R${" "}
                          {metric.revenue.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>{metric.clients_acquired}</TableCell>
                        <TableCell>{metric.employees_hired}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeMetrics;
