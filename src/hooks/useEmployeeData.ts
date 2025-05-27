
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date: string;
  created_at: string;
  avatar_url?: string | null;
}

export const useEmployeeData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log("Buscando funcionários...");
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Usuário não autenticado");
        toast.error("Usuário não autenticado");
        return;
      }
      
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, position, hire_date, created_at, avatar_url')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
        
      if (error) {
        console.error("Erro ao buscar funcionários:", error);
        throw error;
      }
      
      console.log("Funcionários carregados:", data);
      setEmployees(data || []);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      toast.error("Erro ao carregar lista de funcionários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    refetchEmployees: fetchEmployees
  };
};
