
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, DollarSign, Users, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MetricFormProps {
  employeeId: string;
  onSaved?: () => void;
}

const MetricForm = ({ employeeId, onSaved }: MetricFormProps) => {
  const [loading, setLoading] = useState(false);
  
  const currentMonth = new Date();
  currentMonth.setDate(1); // Primeiro dia do mês atual
  
  const [metric, setMetric] = useState({
    month: currentMonth,
    revenue: 0,
    clients_acquired: 0,
    employees_hired: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Converter para número se for um campo numérico
    const numericFields = ["revenue", "clients_acquired", "employees_hired"];
    const newValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;
    
    setMetric((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Normalizar para o primeiro dia do mês
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      setMetric((prev) => ({ ...prev, month: firstDayOfMonth }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Preparar dados
      const metricData = {
        employee_id: employeeId,
        month: format(metric.month, 'yyyy-MM-dd'),
        revenue: metric.revenue,
        clients_acquired: metric.clients_acquired,
        employees_hired: metric.employees_hired
      };
      
      // Verificar se já existe uma métrica para este mês
      const { data: existingMetric, error: checkError } = await supabase
        .from('employee_metrics')
        .select('id')
        .eq('employee_id', employeeId)
        .eq('month', metricData.month)
        .limit(1);
        
      if (checkError) throw checkError;
      
      let result;
      
      if (existingMetric && existingMetric.length > 0) {
        // Atualizar métrica existente
        result = await supabase
          .from('employee_metrics')
          .update(metricData)
          .eq('id', existingMetric[0].id);
          
        toast.success("Métrica atualizada com sucesso!");
      } else {
        // Inserir nova métrica
        result = await supabase
          .from('employee_metrics')
          .insert([metricData]);
          
        toast.success("Métrica adicionada com sucesso!");
      }
      
      if (result.error) throw result.error;
      
      // Callback
      if (onSaved) {
        onSaved();
      }
      
    } catch (error) {
      console.error("Erro ao salvar métrica:", error);
      toast.error("Erro ao salvar métrica de desempenho");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="month">Mês de referência</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !metric.month && "text-muted-foreground"
              )}
              disabled={loading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {metric.month ? (
                format(metric.month, "MMMM 'de' yyyy", { locale: pt })
              ) : (
                <span>Selecione o mês</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={metric.month}
              onSelect={handleDateSelect}
              initialFocus
              disabled={loading}
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={2030}
              defaultMonth={metric.month}
              locale={pt}
              className="bg-background text-foreground"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="revenue" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Receita gerada (R$)
        </Label>
        <Input
          id="revenue"
          name="revenue"
          type="number"
          min="0"
          step="0.01"
          value={metric.revenue}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clients_acquired" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Clientes adquiridos
        </Label>
        <Input
          id="clients_acquired"
          name="clients_acquired"
          type="number"
          min="0"
          value={metric.clients_acquired}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="employees_hired" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Funcionários contratados
        </Label>
        <Input
          id="employees_hired"
          name="employees_hired"
          type="number"
          min="0"
          value={metric.employees_hired}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Métrica"}
        </Button>
      </div>
    </form>
  );
};

export default MetricForm;
