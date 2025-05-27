
# Documentação do Sistema de Gestão de Negócios

## Visão Geral

Este sistema é uma aplicação web desenvolvida para gestão empresarial, oferecendo recursos para monitoramento de métricas de negócio, análise de dados, gerenciamento de funcionários e controle de estoque. A interface é intuitiva e responsiva, permitindo acesso fácil a informações críticas do negócio.

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Componentes UI**: shadcn/ui (biblioteca de componentes baseada em Radix UI e Tailwind)
- **Gráficos**: Recharts (biblioteca para visualização de dados)
- **Backend**: Supabase (autenticação, banco de dados e armazenamento)
- **Gerenciamento de Estado**: React Context API e TanStack Query
- **Roteamento**: React Router Dom
- **Exportação**: jsPDF e XLSX para geração de relatórios

## Estrutura do Projeto

### Principais Diretórios

- **src/components**: Componentes reutilizáveis da interface
  - **src/components/employee**: Componentes específicos para gerenciamento de funcionários
  - **src/components/ui**: Componentes de interface do usuário (shadcn/ui)
- **src/hooks**: Hooks personalizados para lógica de negócio
- **src/pages**: Componentes de página para diferentes rotas
- **src/data**: Dados estáticos e configurações
- **src/types**: Definições de tipos TypeScript
- **src/utils**: Funções utilitárias
- **src/integrations**: Integrações com serviços externos (Supabase)

### Componentes Principais

#### Dashboard

O dashboard é a página principal do sistema, exibindo:
- Métricas de desempenho do negócio
- Gráficos de análise de vendas, lucro e estoque
- Lista de funcionários
- Histórico de arquivos

#### Gráficos

O sistema utiliza diferentes tipos de visualizações:
- **DashboardChart**: Gráfico principal para análise de desempenho
- **LineChartDisplay**: Visualização em formato de linha
- **BarChartDisplay**: Visualização em formato de barras
- **StockAnalysis**: Análise de estoque com visualização por níveis e categorias

#### Gerenciamento de Funcionários

O sistema de gerenciamento de funcionários foi refatorado em componentes menores e mais organizados:

##### Componentes de Interface
- **EmployeeListHeader**: Cabeçalho com título, contador e botões de ação
- **EmployeeSearch**: Componente de busca por nome ou cargo
- **EmployeeGrid**: Grid responsivo para exibição dos cartões de funcionários
- **EmployeeCard**: Cartão individual de funcionário com avatar, informações e ações
- **EmployeeEmptyState**: Estado vazio quando não há funcionários cadastrados
- **EmployeeDeleteDialog**: Modal de confirmação para exclusão de funcionários

##### Hooks Personalizados
- **useEmployeeData**: Gerencia carregamento e estado dos dados de funcionários
- **useEmployeeActions**: Gerencia ações como exportação e visualização de métricas

##### Funcionalidades
- Listar funcionários em grid responsivo
- Buscar funcionários por nome ou cargo
- Adicionar novos funcionários
- Visualizar métricas de desempenho de funcionários
- Exportar dados de funcionários em PDF e Excel
- Excluir funcionários com confirmação

#### Upload e Análise de Arquivos

Sistema para:
- Upload de arquivos
- Visualização do histórico de arquivos enviados
- Análise detalhada dos dados dos arquivos

### Fluxo de Dados

1. Os dados são armazenados no Supabase (banco de dados PostgreSQL)
2. Os dados são requisitados através de hooks personalizados utilizando TanStack Query
3. Os componentes consomem esses dados e renderizam a interface
4. Ações do usuário atualizam o estado local ou enviam atualizações para o banco de dados

## Componentes em Detalhes

### DashboardChart

Componente responsável por exibir gráficos de análise de desempenho com as seguintes características:
- Seletor de período (diário, mensal, trimestral, anual)
- Alternância entre visualização de linha e barras
- Exibição de múltiplas métricas (vendas, lucro, estoque)

```typescript
// Exemplo de uso do DashboardChart
<DashboardChart />
```

### ChartContainer

Componente reutilizável que encapsula os gráficos com um visual consistente:
- Título e descrição
- Conteúdo personalizado no cabeçalho
- Estilo consistente

```typescript
// Exemplo de uso do ChartContainer
<ChartContainer
  title="Título do Gráfico"
  description="Descrição detalhada do gráfico"
  headerContent={<ComponenteAdicional />}
>
  {/* Conteúdo do gráfico */}
</ChartContainer>
```

### Sistema de Funcionários

Os componentes de funcionários foram organizados de forma modular:

```typescript
// Exemplo de uso dos componentes de funcionários
import EmployeeGrid from '@/components/employee/EmployeeGrid';
import EmployeeSearch from '@/components/employee/EmployeeSearch';
import { useEmployeeData } from '@/hooks/useEmployeeData';

const EmployeeManagement = () => {
  const { employees, loading } = useEmployeeData();
  
  return (
    <div>
      <EmployeeSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <EmployeeGrid employees={filteredEmployees} onViewMetrics={handleViewMetrics} />
    </div>
  );
};
```

### ExportButton

Componente reutilizável para exportação de dados:
- Suporte a PDF e Excel
- Menu dropdown para seleção de formato
- Indicador de carregamento durante exportação

```typescript
// Exemplo de uso do ExportButton
<ExportButton
  exportData={{
    columns: ['Nome', 'Cargo', 'Data de Contratação'],
    data: employees,
    title: 'Lista de Funcionários'
  }}
/>
```

## Hooks Personalizados

### useChartData

Hook que gerencia os dados e estados dos gráficos:
- Gerenciamento do período selecionado
- Gerenciamento do tipo de gráfico
- Filtragem de dados baseada no período

```typescript
// Exemplo de uso
const { period, setPeriod, chartType, setChartType, displayData } = useChartData();
```

### useEmployeeData

Hook para gerenciamento de dados de funcionários:
- Carregamento automático dos funcionários
- Estado de loading
- Função para recarregar dados

```typescript
// Exemplo de uso
const { employees, loading, refetchEmployees } = useEmployeeData();
```

### useEmployeeActions

Hook para gerenciamento de ações de funcionários:
- Exportação de dados
- Navegação para métricas
- Estado de carregamento das ações

```typescript
// Exemplo de uso
const { exporting, handleExportData, handleViewMetrics } = useEmployeeActions({
  employees,
  onSelectEmployee
});
```

## Tipos de Dados

### Employee

```typescript
interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date: string;
  created_at: string;
  avatar_url?: string | null;
}
```

### ChartDataPoint

```typescript
type ChartDataPoint = {
  name: string;
  vendas: number;
  lucro: number;
  estoque: number;
};
```

### ChartPeriod e ChartType

```typescript
type ChartPeriod = "diario" | "mensal" | "trimestral" | "anual";
type ChartType = "line" | "bar";
```

### ExportData

```typescript
interface ExportData {
  columns: string[];
  data: any[];
  title: string;
}
```

## Fluxo de Autenticação

1. Usuário acessa a página de login
2. Insere credenciais que são validadas pelo Supabase Auth
3. Após autenticação, um token JWT é armazenado localmente
4. Rotas protegidas verificam a presença do token válido
5. Row Level Security (RLS) garante que os dados sejam filtrados por usuário

## Integração com Supabase

O sistema utiliza o Supabase para:
- Autenticação de usuários
- Armazenamento de dados em tabelas PostgreSQL com RLS
- Armazenamento de arquivos
- Políticas de segurança a nível de linha

### Tabelas Principais
- **employees**: Dados dos funcionários
- **employee_metrics**: Métricas de desempenho dos funcionários
- **profiles**: Perfis dos usuários (se implementado)

## Segurança

- Row Level Security (RLS) implementado em todas as tabelas
- Políticas de acesso baseadas no usuário autenticado
- Validação de permissões antes de operações de CRUD
- Verificação de propriedade dos dados antes de exclusão

## Desenvolvimento e Manutenção

### Padrões de Arquitetura

O projeto segue os seguintes padrões:
- **Componentes pequenos e focados**: Cada componente tem uma responsabilidade específica
- **Hooks personalizados**: Lógica de negócio separada dos componentes de UI
- **Organização por feature**: Componentes relacionados agrupados em diretórios específicos
- **Reutilização**: Componentes genéricos para funcionalidades comuns

### Adicionando Novas Funcionalidades

Para adicionar novas funcionalidades ao sistema:
1. Crie componentes reutilizáveis em `src/components` (organizados por feature)
2. Adicione novos hooks se necessário em `src/hooks`
3. Implemente políticas RLS no Supabase se envolver dados
4. Integre os componentes nas páginas existentes ou crie novas páginas
5. Atualize as rotas em `App.tsx` se necessário
6. Documente as mudanças neste arquivo

### Refatoração e Manutenção

- **Mantenha componentes pequenos**: Se um componente passar de ~50 linhas, considere refatorá-lo
- **Use TypeScript**: Aproveite a tipagem para evitar erros
- **Aproveit componentes shadcn/ui**: Para manter consistência visual
- **Utilize Tailwind CSS**: Para estilização consistente
- **Implemente testes**: Para garantir qualidade (quando necessário)

### Convenções de Código

- **Nomes de arquivos**: PascalCase para componentes, camelCase para hooks
- **Organização de imports**: Externos primeiro, depois internos
- **Props interfaces**: Sempre tipadas e documentadas quando necessário
- **Estados loading**: Implementar feedback visual para operações assíncronas
- **Error handling**: Tratar erros e mostrar mensagens apropriadas ao usuário

### Exportação e Relatórios

O sistema possui funcionalidades robustas de exportação:
- **PDF**: Usando jsPDF com tabelas formatadas
- **Excel**: Usando biblioteca XLSX
- **Componente reutilizável**: ExportButton para implementação consistente
- **Dados estruturados**: Interface ExportData para padronização

## Estrutura de Componentes de Funcionários

```
src/components/employee/
├── EmployeeCard.tsx          # Cartão individual de funcionário
├── EmployeeDeleteDialog.tsx  # Modal de confirmação de exclusão
├── EmployeeEmptyState.tsx    # Estado vazio
├── EmployeeGrid.tsx          # Grid responsivo de funcionários
├── EmployeeListHeader.tsx    # Cabeçalho com ações
├── EmployeeSearch.tsx        # Componente de busca
└── ...                       # Outros componentes relacionados
```

## Performance e Otimização

- **Lazy loading**: Componentes carregados conforme necessário
- **Memoização**: Uso de React.memo em componentes apropriados
- **Queries otimizadas**: Apenas dados necessários são carregados
- **Debounce**: Implementado na busca para evitar requisições excessivas
- **Grid responsivo**: Adaptação automática para diferentes tamanhos de tela

Esta documentação será atualizada conforme o sistema evolui e novas funcionalidades são adicionadas.
