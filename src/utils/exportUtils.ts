
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

// Extend the jsPDF type with autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface UploadedFile {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  analysis_path: string | null;
  created_at: string;
}

export const exportToPDF = async (file: UploadedFile) => {
  // Download the original file
  const { data, error } = await supabase.storage
    .from('uploads')
    .download(file.file_path);

  if (error) {
    throw error;
  }

  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text("Relatório de Análise", 20, 20);
  doc.setFontSize(12);
  doc.text(`Arquivo: ${file.filename}`, 20, 30);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 40);

  // Read the file content
  if (file.file_type.includes('sheet') || file.file_type.includes('csv')) {
    const arrayBuffer = await data.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Generate table
    doc.autoTable({
      head: [jsonData[0]],
      body: jsonData.slice(1),
      startY: 50,
      theme: 'grid'
    });
  } else {
    doc.text("Arquivo não suporta visualização em tabela", 20, 50);
  }

  // Save the PDF
  doc.save(`analise_${file.filename}.pdf`);
};
