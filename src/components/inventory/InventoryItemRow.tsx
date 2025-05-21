
import React, { useState } from "react";
import { InventoryItem } from "@/pages/Inventory";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InventoryItemRowProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export const InventoryItemRow: React.FC<InventoryItemRowProps> = ({ item, onEdit, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Verificar status do item baseado na quantidade vs. nível mínimo
  const isLowStock = item.quantity <= item.minimum_level;
  const stockStatusText = isLowStock 
    ? "Baixo Estoque" 
    : "Estoque OK";
  
  const stockStatusClass = isLowStock
    ? "bg-destructive/20 text-destructive"
    : "bg-green-500/20 text-green-500";
  
  const StockIcon = isLowStock ? AlertTriangle : CheckCircle;

  const handleDelete = () => {
    onDelete(item.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <TableRow key={item.id} className="border-b border-secondary/30 hover:bg-secondary/10">
        <TableCell className="font-medium">{item.product_name}</TableCell>
        <TableCell className="text-center">{item.quantity}</TableCell>
        <TableCell className="text-center">{item.minimum_level}</TableCell>
        <TableCell>
          <div className="flex items-center justify-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatusClass}`}>
              <StockIcon className="h-3 w-3 mr-1" />
              {stockStatusText}
            </span>
          </div>
        </TableCell>
        <TableCell>{item.category}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-primary/30 bg-primary/10 hover:bg-primary/20"
              onClick={() => onEdit(item)}
            >
              <Edit className="h-4 w-4 text-primary" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-destructive/30 bg-destructive/10 hover:bg-destructive/20"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 text-destructive" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir o item "{item.product_name}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              Excluir item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
