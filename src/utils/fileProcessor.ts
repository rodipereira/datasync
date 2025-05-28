
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
  
  if (headerStr.includes('product') || headerStr.includes('quantity') || headerStr.includes('stock') || headerStr.includes('produto') || headerStr.includes('quantidade') || headerStr.includes('estoque')) {
    return 'inventory';
  }
  
  if (headerStr.includes('name') || headerStr.includes('employee') || headerStr.includes('position') || headerStr.includes('nome') || headerStr.includes('funcionario') || headerStr.includes('cargo')) {
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
    
    if (lowerHeader.includes('product') || lowerHeader.includes('nome') || lowerHeader.includes('produto')) {
      mapped.product_name = value;
    } else if (lowerHeader.includes('quantity') || lowerHeader.includes('quantidade') || lowerHeader.includes('qtd')) {
      mapped.quantity = parseInt(value) || 0;
    } else if (lowerHeader.includes('minimum') || lowerHeader.includes('minimo') || lowerHeader.includes('min')) {
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
    } else if (lowerHeader.includes('hire') || lowerHeader.includes('contrat') || lowerHeader.includes('data')) {
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

    console.log("Processando arquivo:", file.name, "para usuário:", user.id);

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

    console.log("Cabeçalhos detectados:", headers);
    console.log("Tipo de dados detectado:", dataType);
    console.log("Número de linhas a processar:", rows.length);

    if (dataType === 'unknown') {
      throw new Error("Não foi possível identificar o tipo de dados. Certifique-se de que o arquivo contém colunas para estoque ou funcionários.");
    }

    const errors: string[] = [];
    let successCount = 0;

    if (dataType === 'inventory') {
      console.log("Processando dados de inventário...");
      
      for (let i = 0; i < rows.length; i++) {
        try {
          const mapped = mapInventoryColumns(rows[i], headers);
          console.log(`Linha ${i + 2} mapeada:`, mapped);
          
          if (!mapped.product_name) {
            errors.push(`Linha ${i + 2}: Nome do produto é obrigatório`);
            continue;
          }

          // CORREÇÃO: Adicionar user_id obrigatório para inventário
          const inventoryData = {
            product_name: mapped.product_name,
            quantity: mapped.quantity || 0,
            minimum_level: mapped.minimum_level || 0,
            category: mapped.category || 'Geral',
            user_id: user.id // Adicionando user_id obrigatório
          };

          console.log(`Inserindo no inventário:`, inventoryData);

          const { error } = await supabase
            .from('inventory')
            .insert(inventoryData);

          if (error) {
            console.error(`Erro na linha ${i + 2}:`, error);
            errors.push(`Linha ${i + 2}: ${error.message}`);
          } else {
            console.log(`Linha ${i + 2} inserida com sucesso`);
            successCount++;
          }
        } catch (error) {
          console.error(`Erro ao processar linha ${i + 2}:`, error);
          errors.push(`Linha ${i + 2}: Erro ao processar dados`);
        }
      }
    } else if (dataType === 'employees') {
      console.log("Processando dados de funcionários...");
      
      for (let i = 0; i < rows.length; i++) {
        try {
          const mapped = mapEmployeeColumns(rows[i], headers);
          console.log(`Linha ${i + 2} mapeada:`, mapped);
          
          if (!mapped.name) {
            errors.push(`Linha ${i + 2}: Nome do funcionário é obrigatório`);
            continue;
          }

          const employeeData = {
            name: mapped.name,
            position: mapped.position || 'Funcionário',
            hire_date: mapped.hire_date || new Date().toISOString().split('T')[0],
            user_id: user.id
          };

          console.log(`Inserindo funcionário:`, employeeData);

          const { error } = await supabase
            .from('employees')
            .insert(employeeData);

          if (error) {
            console.error(`Erro na linha ${i + 2}:`, error);
            errors.push(`Linha ${i + 2}: ${error.message}`);
          } else {
            console.log(`Linha ${i + 2} inserida com sucesso`);
            successCount++;
          }
        } catch (error) {
          console.error(`Erro ao processar linha ${i + 2}:`, error);
          errors.push(`Linha ${i + 2}: Erro ao processar dados`);
        }
      }
    }

    console.log(`Processamento concluído. Sucessos: ${successCount}, Erros: ${errors.length}`);

    return {
      success: successCount > 0,
      message: `${successCount} registros processados com sucesso${errors.length > 0 ? ` (${errors.length} erros)` : ''}`,
      recordsProcessed: successCount,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error("Erro geral no processamento:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao processar arquivo"
    };
  }
};
