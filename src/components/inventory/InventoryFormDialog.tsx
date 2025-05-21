
import React, { useEffect } from "react";
import { InventoryItem } from "@/pages/Inventory";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface InventoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => void;
  item: InventoryItem | null;
}

const formSchema = z.object({
  product_name: z.string().min(1, "O nome do produto é obrigatório"),
  quantity: z.coerce.number().min(0, "Quantidade não pode ser negativa"),
  minimum_level: z.coerce.number().min(0, "Nível mínimo não pode ser negativo"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

const InventoryFormDialog: React.FC<InventoryFormDialogProps> = ({ open, onClose, onSubmit, item }) => {
  const isEditing = !!item;
  const title = isEditing ? "Editar Item" : "Adicionar Item";
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      quantity: 0,
      minimum_level: 0,
      category: "",
    },
  });

  // Atualizar formulário quando item mudar
  useEffect(() => {
    if (item) {
      form.reset({
        product_name: item.product_name,
        quantity: item.quantity,
        minimum_level: item.minimum_level,
        category: item.category,
      });
    } else {
      form.reset({
        product_name: "",
        quantity: 0,
        minimum_level: 0,
        category: "",
      });
    }
  }, [item, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Edite os detalhes do item de inventário abaixo." 
              : "Preencha os detalhes para adicionar um novo item ao inventário."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    A quantidade atual em estoque
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minimum_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível Mínimo</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    O nível mínimo antes de alertar sobre estoque baixo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Salvar Alterações" : "Adicionar Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;
