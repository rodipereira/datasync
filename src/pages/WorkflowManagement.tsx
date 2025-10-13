import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Workflow, 
  Plus, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  UserCheck,
  Settings
} from "lucide-react";
// Temporary simple components to resolve import issues
const WorkflowMetrics = ({ requests, workflows }: { requests: WorkflowRequest[], workflows: WorkflowTemplate[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Solicitações</p>
            <p className="text-2xl font-bold">{requests.length}</p>
          </div>
          <div className="p-3 rounded-full text-blue-600 bg-blue-100">
            <Workflow className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const WorkflowCard = ({ workflow }: { workflow: WorkflowTemplate }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle>{workflow.name}</CardTitle>
      <CardDescription>{workflow.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        {workflow.steps.length} etapas • Categoria: {workflow.category}
      </p>
    </CardContent>
  </Card>
);

const WorkflowBuilder = () => (
  <Card>
    <CardHeader>
      <CardTitle>Construtor de Workflow</CardTitle>
      <CardDescription>Funcionalidade em desenvolvimento</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-center py-12 text-muted-foreground">
        O construtor visual de workflows será implementado aqui
      </p>
    </CardContent>
  </Card>
);

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'condition' | 'action';
  assignee?: string;
  conditions?: Record<string, string | number>;
  timeLimit?: number; // hours
  description: string;
}

export interface WorkflowRequest {
  id: string;
  workflowId: string;
  workflowName: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: Date;
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'expense' | 'leave' | 'document' | 'equipment' | 'training' | 'other';
  data: Record<string, string | number>;
  approvals: WorkflowApproval[];
  history: WorkflowHistory[];
}

export interface WorkflowApproval {
  id: string;
  stepId: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: Date;
}

export interface WorkflowHistory {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  comments?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkflowRequest['category'];
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
}

const WorkflowManagement = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data
  const [workflows] = useState<WorkflowTemplate[]>([
    {
      id: "1",
      name: "Aprovação de Despesas",
      description: "Processo para aprovação de despesas corporativas",
      category: "expense",
      isActive: true,
      createdAt: new Date("2024-01-15"),
      createdBy: "admin@empresa.com",
      steps: [
        {
          id: "step1",
          name: "Solicitação",
          type: "action",
          description: "Funcionário submete a despesa"
        },
        {
          id: "step2", 
          name: "Aprovação do Supervisor",
          type: "approval",
          assignee: "supervisor@empresa.com",
          timeLimit: 24,
          description: "Supervisor imediato aprova a despesa"
        },
        {
          id: "step3",
          name: "Verificação Financeira",
          type: "condition",
          conditions: { amount: 1000 },
          description: "Verificação automática se valor > R$ 1.000"
        },
        {
          id: "step4",
          name: "Aprovação Gerencial",
          type: "approval", 
          assignee: "gerente@empresa.com",
          timeLimit: 48,
          description: "Gerente aprova despesas altas"
        }
      ]
    },
    {
      id: "2",
      name: "Solicitação de Férias",
      description: "Processo para solicitação e aprovação de férias",
      category: "leave",
      isActive: true,
      createdAt: new Date("2024-01-10"),
      createdBy: "rh@empresa.com",
      steps: [
        {
          id: "step1",
          name: "Solicitação de Férias",
          type: "action",
          description: "Funcionário solicita período de férias"
        },
        {
          id: "step2",
          name: "Verificação RH",
          type: "approval",
          assignee: "rh@empresa.com", 
          timeLimit: 72,
          description: "RH verifica disponibilidade e saldo"
        },
        {
          id: "step3",
          name: "Aprovação do Gestor",
          type: "approval",
          assignee: "gestor@empresa.com",
          timeLimit: 48,
          description: "Gestor aprova o período solicitado"
        }
      ]
    }
  ]);

  const [requests] = useState<WorkflowRequest[]>([
    {
      id: "req1",
      workflowId: "1",
      workflowName: "Aprovação de Despesas",
      title: "Reembolso - Viagem SP",
      description: "Solicitação de reembolso para viagem a São Paulo",
      requestedBy: "joao.silva@empresa.com",
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      currentStep: 1,
      status: "pending",
      priority: "medium",
      category: "expense",
      data: {
        amount: 850.50,
        description: "Passagem aérea + hotel",
        receipts: 3
      },
      approvals: [
        {
          id: "app1",
          stepId: "step2",
          approver: "supervisor@empresa.com",
          status: "pending"
        }
      ],
      history: [
        {
          id: "hist1",
          action: "Solicitação criada",
          performedBy: "joao.silva@empresa.com",
          performedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: "req2", 
      workflowId: "2",
      workflowName: "Solicitação de Férias",
      title: "Férias Dezembro",
      description: "Solicitação de férias para dezembro",
      requestedBy: "maria.santos@empresa.com",
      requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      currentStep: 2,
      status: "approved",
      priority: "low",
      category: "leave",
      data: {
        startDate: "2024-12-20",
        endDate: "2024-12-31",
        days: 10
      },
      approvals: [
        {
          id: "app2",
          stepId: "step2",
          approver: "rh@empresa.com",
          status: "approved",
          approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          comments: "Saldo de férias confirmado"
        }
      ],
      history: [
        {
          id: "hist2",
          action: "Solicitação criada",
          performedBy: "maria.santos@empresa.com", 
          performedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: "hist3",
          action: "Aprovado pelo RH",
          performedBy: "rh@empresa.com",
          performedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          comments: "Saldo de férias confirmado"
        }
      ]
    }
  ]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: WorkflowRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: WorkflowRequest['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryIcon = (category: WorkflowRequest['category']) => {
    switch (category) {
      case 'expense': return <DollarSign className="h-4 w-4" />;
      case 'leave': return <Calendar className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'equipment': return <Settings className="h-4 w-4" />;
      case 'training': return <UserCheck className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestão de Workflows</h1>
              <p className="text-muted-foreground mt-2">
                Automatize processos empresariais com aprovações e notificações
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nova Solicitação</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Solicitação de Workflow</DialogTitle>
                </DialogHeader>
                {/* Add form content here */}
                <div className="p-4">
                  <p>Formulário de criação será implementado aqui</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Metrics */}
          <WorkflowMetrics requests={requests} workflows={workflows} />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="requests">Solicitações</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6 mt-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="search"
                        placeholder="Buscar solicitações..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="expense">Despesas</SelectItem>
                        <SelectItem value="leave">Férias</SelectItem>
                        <SelectItem value="document">Documentos</SelectItem>
                        <SelectItem value="equipment">Equipamentos</SelectItem>
                        <SelectItem value="training">Treinamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getCategoryIcon(request.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{request.title}</h3>
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority === 'low' && 'Baixa'}
                              {request.priority === 'medium' && 'Média'} 
                              {request.priority === 'high' && 'Alta'}
                              {request.priority === 'urgent' && 'Urgente'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {request.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Por: {request.requestedBy}</span>
                            <span>Workflow: {request.workflowName}</span>
                            <span>Etapa: {request.currentStep}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'pending' && 'Pendente'}
                          {request.status === 'approved' && 'Aprovado'}
                          {request.status === 'rejected' && 'Rejeitado'}
                          {request.status === 'cancelled' && 'Cancelado'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma solicitação encontrada</h3>
                  <p className="text-muted-foreground text-center">
                    Nenhuma solicitação corresponde aos filtros selecionados.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Templates de Workflow</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Template
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {workflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <WorkflowBuilder />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WorkflowManagement;