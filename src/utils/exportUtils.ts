
import * as XLSX from 'xlsx';

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
 * Exporta dados para PDF (usando jsPDF)
 * Esta função será implementada posteriormente com jsPDF
 */
export const exportToPDF = async (data: any[], fileName: string): Promise<void> => {
  // Implementação de exportação para PDF será adicionada posteriormente
  
  // Por enquanto, usamos o Excel como fallback
  return exportToExcel(data, fileName);
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
