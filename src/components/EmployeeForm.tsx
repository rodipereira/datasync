
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmployeeFormProps {
  onSaved?: () => void;
}

const EmployeeForm = ({ onSaved }: EmployeeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    position: "",
    hire_date: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setEmployee((prev) => ({ ...prev, hire_date: date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validar dados
      if (!employee.name.trim() || !employee.position.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      // Obter usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Inserir funcionário
      const { error } = await supabase.from('employees').insert([
        {
          name: employee.name,
          position: employee.position,
          hire_date: format(employee.hire_date, 'yyyy-MM-dd'),
          user_id: user.id
        }
      ]);
      
      if (error) throw error;
      
      toast.success("Funcionário cadastrado com sucesso!");
      
      // Limpar formulário
      setEmployee({
        name: "",
        position: "",
        hire_date: new Date()
      });
      
      // Callback
      if (onSaved) {
        onSaved();
      }
      
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      toast.error("Erro ao cadastrar funcionário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Funcionário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo*</Label>
            <Input
              id="name"
              name="name"
              value={employee.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Cargo*</Label>
            <Input
              id="position"
              name="position"
              value={employee.position}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hire_date">Data de contratação</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !employee.hire_date && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {employee.hire_date ? (
                    format(employee.hire_date, "dd/MM/yyyy")
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={employee.hire_date}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={loading}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
