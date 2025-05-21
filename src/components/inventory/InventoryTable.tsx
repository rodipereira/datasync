
import React from "react";
import { InventoryItem } from "@/pages/Inventory";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InventoryItemRow } from "./InventoryItemRow";

interface InventoryTableProps {
  inventory: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, onEdit, onDelete }) => {
  // Ordenar itens por nome
  const sortedInventory = [...inventory].sort((a, b) => 
    a.product_name.localeCompare(b.product_name)
  );

  if (!inventory.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Nenhum item no inventário</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-secondary/30">
          <TableRow>
            <TableHead className="w-[250px]">Nome do Produto</TableHead>
            <TableHead className="text-center">Quantidade</TableHead>
            <TableHead className="text-center">Nível Mínimo</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInventory.map((item) => (
            <InventoryItemRow 
              key={item.id} 
              item={item} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
