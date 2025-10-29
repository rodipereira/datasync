-- Criar tabela de perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de funcionários
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de métricas de funcionários
CREATE TABLE public.employee_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  revenue DECIMAL NOT NULL DEFAULT 0,
  clients_acquired INTEGER NOT NULL DEFAULT 0,
  employees_hired INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de inventário
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  minimum_level INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de métricas do dashboard
CREATE TABLE public.dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sales DECIMAL,
  net_profit DECIMAL,
  inventory_count INTEGER,
  new_customers INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela de arquivos enviados
CREATE TABLE public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  analysis_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de notificações
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir seu próprio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para employees
CREATE POLICY "Usuários podem ver seus próprios funcionários" ON public.employees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar funcionários" ON public.employees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus funcionários" ON public.employees FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus funcionários" ON public.employees FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para employee_metrics
CREATE POLICY "Usuários podem ver métricas de seus funcionários" ON public.employee_metrics FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.employees WHERE employees.id = employee_metrics.employee_id AND employees.user_id = auth.uid()));
CREATE POLICY "Usuários podem criar métricas" ON public.employee_metrics FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.employees WHERE employees.id = employee_metrics.employee_id AND employees.user_id = auth.uid()));
CREATE POLICY "Usuários podem atualizar métricas" ON public.employee_metrics FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.employees WHERE employees.id = employee_metrics.employee_id AND employees.user_id = auth.uid()));
CREATE POLICY "Usuários podem deletar métricas" ON public.employee_metrics FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.employees WHERE employees.id = employee_metrics.employee_id AND employees.user_id = auth.uid()));

-- Políticas RLS para inventory
CREATE POLICY "Usuários podem ver seu próprio inventário" ON public.inventory FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Usuários podem criar itens de inventário" ON public.inventory FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Usuários podem atualizar seu inventário" ON public.inventory FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Usuários podem deletar seu inventário" ON public.inventory FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Políticas RLS para dashboard_metrics (público para leitura, admin para escrita)
CREATE POLICY "Todos podem ver métricas do dashboard" ON public.dashboard_metrics FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem criar métricas" ON public.dashboard_metrics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem atualizar métricas" ON public.dashboard_metrics FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem deletar métricas" ON public.dashboard_metrics FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas RLS para uploaded_files
CREATE POLICY "Usuários podem ver seus próprios arquivos" ON public.uploaded_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem fazer upload de arquivos" ON public.uploaded_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus arquivos" ON public.uploaded_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus arquivos" ON public.uploaded_files FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para notifications
CREATE POLICY "Usuários podem ver suas próprias notificações" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar notificações" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas notificações" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas notificações" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_metrics_updated_at BEFORE UPDATE ON public.employee_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dashboard_metrics_updated_at BEFORE UPDATE ON public.dashboard_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar notificações de estoque baixo
CREATE OR REPLACE FUNCTION public.create_stock_notifications()
RETURNS void AS $$
BEGIN
  -- Esta função pode ser chamada para criar notificações quando o estoque está baixo
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT 
    user_id,
    'Estoque Baixo',
    'O produto ' || product_name || ' está abaixo do nível mínimo',
    'warning'
  FROM public.inventory
  WHERE quantity <= minimum_level AND user_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql;