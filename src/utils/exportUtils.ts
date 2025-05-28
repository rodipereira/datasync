
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exporta dados para um arquivo Excel
 * @param data Array de objetos para exportar
 * @param fileName Nome do arquivo sem extensão
 */
export const exportToExcel = async (data: any[], fileName: string): Promise<void> => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
  
  // Aplicar auto-tamanho para colunas
  const maxWidth = 50;
  const columnsWidth = [];
  
  // Converter para binário
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Criar Blob e download
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  
  // Limpeza
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Exporta dados para PDF usando jsPDF
 * @param data Array de objetos para exportar
 * @param fileName Nome do arquivo sem extensão
 */
export const exportToPDF = async (data: any[], fileName: string): Promise<void> => {
  const doc = new jsPDF();
  
  // Adicionar título
  doc.setFontSize(18);
  doc.text(fileName, 14, 22);
  doc.setFontSize(11);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
  
  // Preparar dados para tabela
  const headers = Object.keys(data[0] || {});
  const rows = data.map(item => headers.map(key => String(item[key] || '')));
  
  // Usar autoTable corretamente
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 40,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Salvar o PDF
  doc.save(`${fileName}.pdf`);
};

/**
 * Exporta relatório para o formato solicitado
 */
export const exportReport = async (data: any[], fileName: string, format: 'excel' | 'pdf' = 'excel'): Promise<void> => {
  if (format === 'pdf') {
    return exportToPDF(data, fileName);
  } else {
    return exportToExcel(data, fileName);
  }
};
