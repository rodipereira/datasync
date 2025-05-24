
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

export interface ProcessingResult {
  success: boolean;
  message: string;
  recordsProcessed?: number;
  errors?: string[];
}

// Detectar tipo de dados baseado nas colunas
const detectDataType = (headers: string[]): 'inventory' | 'employees' | 'unknown' => {
  const headerStr = headers.join(' ').toLowerCase();
  
  if (headerStr.includes('product') || headerStr.includes('quantity') || headerStr.includes('stock')) {
    return 'inventory';
  }
  
  if (headerStr.includes('name') || headerStr.includes('employee') || headerStr.includes('position')) {
    return 'employees';
  }
  
  return 'unknown';
};

// Mapear colunas para campos do banco
const mapInventoryColumns = (row: any, headers: string[]) => {
  const mapped: any = {};
  
  headers.forEach((header, index) => {
    const value = row[index];
    const lowerHeader = header.toLowerCase();
    
    if (lowerHeader.includes('product') || lowerHeader.includes('nome')) {
      mapped.product_name = value;
    } else if (lowerHeader.includes('quantity') || lowerHeader.includes('quantidade')) {
      mapped.quantity = parseInt(value) || 0;
    } else if (lowerHeader.includes('minimum') || lowerHeader.includes('minimo')) {
      mapped.minimum_level = parseInt(value) || 0;
    } else if (lowerHeader.includes('category') || lowerHeader.includes('categoria')) {
      mapped.category = value || 'Geral';
    }
  });
  
  return mapped;
};

const mapEmployeeColumns = (row: any, headers: string[]) => {
  const mapped: any = {};
  
  headers.forEach((header, index) => {
    const value = row[index];
    const lowerHeader = header.toLowerCase();
    
    if (lowerHeader.includes('name') || lowerHeader.includes('nome')) {
      mapped.name = value;
    } else if (lowerHeader.includes('position') || lowerHeader.includes('cargo')) {
      mapped.position = value || 'Funcionário';
    } else if (lowerHeader.includes('hire') || lowerHeader.includes('contrat')) {
      mapped.hire_date = value || new Date().toISOString().split('T')[0];
    }
  });
  
  return mapped;
};

export const processFile = async (file: File): Promise<ProcessingResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    let data: any[][] = [];
    
    if (file.type.includes('csv')) {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      data = lines.map(line => line.split(',').map(cell => cell.trim().replace(/"/g, '')));
    } else if (file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    } else {
      throw new Error("Formato de arquivo não suportado");
    }

    if (data.length < 2) {
      throw new Error("Arquivo deve conter pelo menos cabeçalho e uma linha de dados");
    }

    const headers = data[0];
    const rows = data.slice(1).filter(row => row.some(cell => cell));
    const dataType = detectDataType(headers);

    if (dataType === 'unknown') {
      throw new Error("Não foi possível identificar o tipo de dados. Certifique-se de que o arquivo contém colunas para estoque ou funcionários.");
    }

    const errors: string[] = [];
    let successCount = 0;

    if (dataType === 'inventory') {
      for (let i = 0; i < rows.length; i++) {
        try {
          const mapped = mapInventoryColumns(rows[i], headers);
          
          if (!mapped.product_name) {
            errors.push(`Linha ${i + 2}: Nome do produto é obrigatório`);
            continue;
          }

          const { error } = await supabase
            .from('inventory')
            .insert({
              product_name: mapped.product_name,
              quantity: mapped.quantity || 0,
              minimum_level: mapped.minimum_level || 0,
              category: mapped.category || 'Geral'
            });

          if (error) {
            errors.push(`Linha ${i + 2}: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (error) {
          errors.push(`Linha ${i + 2}: Erro ao processar dados`);
        }
      }
    } else if (dataType === 'employees') {
      for (let i = 0; i < rows.length; i++) {
        try {
          const mapped = mapEmployeeColumns(rows[i], headers);
          
          if (!mapped.name) {
            errors.push(`Linha ${i + 2}: Nome do funcionário é obrigatório`);
            continue;
          }

          const { error } = await supabase
            .from('employees')
            .insert({
              name: mapped.name,
              position: mapped.position || 'Funcionário',
              hire_date: mapped.hire_date || new Date().toISOString().split('T')[0],
              user_id: user.id
            });

          if (error) {
            errors.push(`Linha ${i + 2}: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (error) {
          errors.push(`Linha ${i + 2}: Erro ao processar dados`);
        }
      }
    }

    return {
      success: successCount > 0,
      message: `${successCount} registros processados com sucesso${errors.length > 0 ? ` (${errors.length} erros)` : ''}`,
      recordsProcessed: successCount,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao processar arquivo"
    };
  }
};
