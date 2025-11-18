# Localização dos Diagramas e Estruturas - DataSync

Este documento fornece a localização exata de cada diagrama e estrutura no arquivo `DOCUMENTACAO.md`.

---

## 1. 📊 Interface do Dashboard

**Arquivo:** `DOCUMENTACAO.md`  
**Localização:** Linhas 81-87  
**Seção:** Recursos e Funcionalidades → Dashboard Inteligente

### Conteúdo:
```
### 1. Dashboard Inteligente
- **Dashboard Clássico**: Visualização tradicional com métricas essenciais
- **Dashboard Inteligente**: Análise avançada com IA e recomendações automáticas
- **Métricas em Tempo Real**: Atualizações automáticas dos dados
- **Filtros de Data**: Seleção de períodos personalizados
- **Gráficos Interativos**: Visualizações responsivas e dinâmicas
```

### Código do Componente:
- **Arquivo:** `src/pages/Dashboard.tsx`
- **Componentes relacionados:**
  - `src/components/dashboard/DashboardHeader.tsx`
  - `src/components/dashboard/DashboardMetrics.tsx`
  - `src/components/dashboard/ChartsSection.tsx`
  - `src/components/dashboard/SmartDashboard.tsx`

---

## 2. 👥 Estrutura de Dados de Funcionários

**Arquivo:** `DOCUMENTACAO.md`  
**Localização:** Linhas 190-237  
**Seção:** Banco de Dados (Supabase) → Tabelas Principais

### Tabela: employees
```sql
- id: uuid (PK)
- user_id: uuid (FK para auth.users)
- name: text
- position: text
- hire_date: date
- avatar_url: text (opcional)
- created_at: timestamp
- updated_at: timestamp
```

### Tabela: employee_metrics
```sql
- id: uuid (PK)
- employee_id: uuid (FK para employees)
- month: date
- revenue: numeric
- clients_acquired: integer
- employees_hired: integer
- created_at: timestamp
- updated_at: timestamp
```

### Componentes relacionados:
- **Gerenciamento:** `src/pages/EmployeeManagement.tsx`
- **Lista:** `src/components/EmployeeList.tsx`
- **Formulário:** `src/components/EmployeeForm.tsx`
- **Métricas:** `src/components/EmployeeMetrics.tsx`
- **Grid:** `src/components/employee/EmployeeGrid.tsx`
- **Tabela:** `src/components/employee/EmployeeTable.tsx`

### Hooks personalizados:
- `src/hooks/useEmployeeData.ts` (linhas 162-167)
- `src/hooks/useEmployeeActions.ts` (linhas 169-177)

---

## 3. 🔄 Fluxograma Geral de Operação do Sistema

**Arquivo:** `DOCUMENTACAO.md`  
**Localização:** Linhas 269-273  
**Seção:** Sistema de Autenticação → Fluxo de Autenticação

### Conteúdo:
```
### Fluxo de Autenticação
1. **Login**: Validação de credenciais via Supabase
2. **Token JWT**: Geração e armazenamento local
3. **RLS**: Aplicação automática de políticas de segurança
4. **Renovação**: Refresh automático de tokens expirados
```

### Fluxo completo expandido:
1. **Acesso ao Sistema** → Página inicial
2. **Login/Registro** → Validação de credenciais
3. **Autenticação Supabase** → Geração de JWT
4. **Carregamento de Sessão** → Aplicação de RLS
5. **Dashboard Principal** → Visualização de dados
6. **Módulos disponíveis:**
   - Gerenciar Funcionários
   - Controlar Inventário
   - Gerar Relatórios
   - Upload de Arquivos
   - Metas e Objetivos
   - Workflows
   - Assistente IA
7. **Sistema de Notificações** → Atualização em tempo real
8. **Logout** → Encerramento de sessão

### Componentes relacionados:
- **Login:** `src/pages/Login.tsx`
- **Registro:** `src/pages/Register.tsx`
- **Rota Protegida:** `src/components/ProtectedRoute.tsx`
- **Cliente Supabase:** `src/integrations/supabase/client.ts`

---

## 4. 🏗️ Arquitetura da Plataforma

**Arquivo:** `DOCUMENTACAO.md`  
**Localização:** Linhas 144-185  
**Seção:** Arquitetura de Componentes → Padrões de Design + Hooks Personalizados

### Padrões de Design (linhas 144-150):
```
## Arquitetura de Componentes

### Padrões de Design
- **Componentização Modular**: Cada funcionalidade em componentes focados
- **Reutilização**: Componentes genéricos para uso em múltiplos contextos
- **Composição**: Combinação de componentes menores para funcionalidades complexas
- **Responsividade**: Design adaptável para todos os dispositivos
```

### Hooks Personalizados (linhas 152-185):

#### useNotifications (linhas 154-160)
```typescript
const { notifications, isLoading, unreadCount, markAsRead } = useNotifications();
```
- Gerencia estado completo das notificações
- Atualizações em tempo real via Supabase
- Cache inteligente com TanStack Query

#### useEmployeeData (linhas 162-167)
```typescript
const { employees, loading, refetchEmployees } = useEmployeeData();
```
- Carregamento otimizado de dados de funcionários
- Integração com sistema de busca e filtros

#### useEmployeeActions (linhas 169-177)
```typescript
const { exporting, handleExportData, handleViewMetrics } = useEmployeeActions({
  employees,
  onSelectEmployee
});
```
- Gerencia ações complexas como exportação
- Estados de loading centralizados

#### useChartData (linhas 179-185)
```typescript
const { period, setPeriod, chartType, setChartType, displayData } = useChartData();
```
- Controle de períodos e tipos de gráficos
- Processamento de dados para visualização

### Camadas da Arquitetura:

1. **Frontend (React)**
   - Interface do Usuário
   - Componentes React (`src/components/`)
   - Páginas/Rotas (`src/pages/`)
   - Custom Hooks (`src/hooks/`)
   - Estado (TanStack Query)

2. **Roteamento**
   - React Router (`src/App.tsx`)
   - Rotas Protegidas (`src/components/ProtectedRoute.tsx`)
   - Rotas Públicas (Login, Register)

3. **Backend (Lovable Cloud / Supabase)**
   - Autenticação (Supabase Auth)
   - Banco de Dados (PostgreSQL)
   - Armazenamento (File Storage)
   - Funções (Edge Functions em `supabase/functions/`)
   - Real-time (Subscriptions)

4. **Segurança**
   - Row Level Security (RLS)
   - JWT Tokens
   - Políticas de Acesso

5. **Integrações**
   - Assistente IA (Groq) - `supabase/functions/groq-assistant/`
   - Exportação (PDF/Excel) - `src/utils/exportUtils.ts`
   - Gráficos (Recharts) - `src/components/charts/`

### Estrutura de Diretórios:
```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes de UI (shadcn/ui)
│   ├── employee/        # Componentes de funcionários
│   ├── notifications/   # Sistema de notificações
│   ├── dashboard/       # Componentes do dashboard
│   ├── charts/          # Componentes de gráficos
│   ├── inventory/       # Componentes de inventário
│   └── ...
├── hooks/               # Hooks personalizados
├── pages/               # Componentes de página/rotas
├── data/                # Dados estáticos e configurações
├── types/               # Definições de tipos TypeScript
├── utils/               # Funções utilitárias
├── integrations/        # Integrações (Supabase)
└── lib/                 # Bibliotecas e configurações
```

---

## 🎯 Como Acessar os Diagramas

### Opção 1: Via Interface Web (Recomendado)
1. Faça login no sistema
2. Acesse o menu superior
3. Clique em **"Docs"** ou **"Documentação"**
4. Navegue pelas abas dos diagramas
5. Use os botões de exportação para:
   - Copiar código Mermaid
   - Exportar SVG
   - Visualizar online

### Opção 2: Via Arquivo
Abra o arquivo `DOCUMENTACAO.md` na raiz do projeto e navegue até as linhas indicadas acima.

### Opção 3: Exportação
Acesse `/documentation` no sistema e use o botão **"Exportar Tudo (Markdown)"** para baixar todos os diagramas em um único arquivo.

---

## 📚 Recursos Adicionais

### Tecnologias Utilizadas (linhas 14-55)
- Frontend: React, TypeScript, Tailwind CSS, Vite
- UI: shadcn/ui, Radix UI, Lucide Icons
- Gráficos: Recharts
- Backend: Lovable Cloud (Supabase)
- Estado: TanStack Query
- Roteamento: React Router
- Exportação: jsPDF, XLSX

### Segurança e RLS (linhas 242-252)
Todas as tabelas implementam políticas RLS que garantem:
- Isolamento de Dados
- Operações Seguras
- Auditoria

### Funções do Banco (linhas 256-260)
- `create_stock_notifications()`: Cria notificações para estoque baixo
- `update_updated_at_column()`: Atualiza timestamps automaticamente

---

## 🔗 Links Úteis

- **Documentação Completa:** `DOCUMENTACAO.md` (492 linhas)
- **Página de Documentação Web:** `/documentation`
- **Mermaid Live Editor:** https://mermaid.live (para visualizar diagramas)
- **Repositório de Componentes:** `src/components/`
- **Banco de Dados:** Lovable Cloud Dashboard

---

*Última atualização: 2024*  
*Equipe de Desenvolvimento: Rodrigo Pereira de Almeida & Álvaro Nóbrega Marques Rolim*
