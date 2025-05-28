
import React, { useState } from "react";
import { DownloadCloud, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ExportData {
  columns: string[];
  data: any[];
  title: string;
}

interface ExportButtonProps {
  exportData: ExportData;
  className?: string;
}

export function ExportButton({ exportData, className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      const { columns, data, title } = exportData;
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Exportado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
      
      // Add table
      autoTable(doc, {
        head: [columns],
        body: data.map(row => columns.map(col => String(row[col] || ''))),
        startY: 35,
        theme: 'striped',
        headStyles: {
          fillColor: [92, 45, 211], // Cor primária do sistema
          textColor: [255, 255, 255]
        }
      });
      
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      const { columns, data, title } = exportData;
      
      // Transformar dados para o formato esperado pelo XLSX
      const wsData = [
        columns, // Cabeçalhos
        ...data.map(row => columns.map(col => row[col] || '')) // Linhas de dados
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Dados");
      
      // Salvar arquivo
      XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <DownloadCloud className="h-4 w-4 mr-2" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Escolha o formato</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Exportar como PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} disabled={isExporting}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Exportar como Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
