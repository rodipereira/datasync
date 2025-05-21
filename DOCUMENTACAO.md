
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

## Estrutura do Projeto

### Principais Diretórios

- **src/components**: Componentes reutilizáveis da interface
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

Interface para:
- Listar funcionários
- Adicionar novos funcionários
- Visualizar métricas de desempenho de funcionários
- Exportar dados de desempenho

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

### EmployeeList e EmployeeMetrics

Componentes para gerenciamento de funcionários:
- Tabela de listagem com ações
- Métricas de desempenho individual
- Formulário para adição de novos funcionários

```typescript
// Exemplo de uso
<EmployeeList onSelectEmployee={handleSelectEmployee} />
<EmployeeMetrics employeeId={selectedEmployeeId} />
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

## Tipos de Dados

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

## Fluxo de Autenticação

1. Usuário acessa a página de login
2. Insere credenciais que são validadas pelo Supabase Auth
3. Após autenticação, um token JWT é armazenado localmente
4. Rotas protegidas verificam a presença do token válido

## Integração com Supabase

O sistema utiliza o Supabase para:
- Autenticação de usuários
- Armazenamento de dados em tabelas PostgreSQL
- Armazenamento de arquivos

## Desenvolvimento e Manutenção

### Adicionando Novas Funcionalidades

Para adicionar novas funcionalidades ao sistema:
1. Crie componentes reutilizáveis em `src/components`
2. Adicione novos hooks se necessário em `src/hooks`
3. Integre os componentes nas páginas existentes ou crie novas páginas
4. Atualize as rotas em `App.tsx` se necessário

### Dicas de Manutenção

- Mantenha os componentes pequenos e focados
- Utilize TypeScript para garantir segurança de tipos
- Aproveite os componentes da biblioteca shadcn/ui para manter consistência visual
- Utilize o sistema de classes do Tailwind CSS para estilização
