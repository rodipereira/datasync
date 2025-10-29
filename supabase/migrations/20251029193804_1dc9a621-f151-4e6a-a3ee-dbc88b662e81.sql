-- Recriar função update_updated_at_column com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recriar função create_stock_notifications com search_path seguro
CREATE OR REPLACE FUNCTION public.create_stock_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT 
    user_id,
    'Estoque Baixo',
    'O produto ' || product_name || ' está abaixo do nível mínimo',
    'warning'
  FROM public.inventory
  WHERE quantity <= minimum_level AND user_id IS NOT NULL;
END;
$$;