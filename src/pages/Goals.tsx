import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Target, TrendingUp, Calendar as CalendarIcon, Plus, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import GoalMetrics from "@/components/goals/GoalMetrics";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'growth' | 'efficiency' | 'quality' | 'team' | 'customer';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planning' | 'in-progress' | 'on-track' | 'at-risk' | 'completed' | 'cancelled';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  assignedTo: string;
  kpis: KPI[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  lastUpdated: Date;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    const mockGoals: Goal[] = [
      {
        id: "1",
        title: "Aumentar Receita Mensal",
        description: "Alcançar R$ 100.000 em receita mensal recorrente até o final do trimestre",
        category: "revenue",
        priority: "high",
        status: "in-progress",
        targetValue: 100000,
        currentValue: 75000,
        unit: "R$",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-03-31"),
        assignedTo: "Equipe de Vendas",
        kpis: [
          {
            id: "k1",
            name: "Novos Clientes",
            description: "Número de novos clientes adquiridos",
            targetValue: 50,
            currentValue: 38,
            unit: "clientes",
            lastUpdated: new Date()
          },
          {
            id: "k2",
            name: "Ticket Médio",
            description: "Valor médio por venda",
            targetValue: 2000,
            currentValue: 1850,
            unit: "R$",
            lastUpdated: new Date()
          }
        ],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date()
      },
      {
        id: "2",
        title: "Melhorar Satisfação do Cliente",
        description: "Alcançar NPS de 80 pontos através de melhorias no atendimento",
        category: "customer",
        priority: "medium",
        status: "on-track",
        targetValue: 80,
        currentValue: 72,
        unit: "pontos",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-06-30"),
        assignedTo: "Equipe de Atendimento",
        kpis: [
          {
            id: "k3",
            name: "Tempo de Resposta",
            description: "Tempo médio de resposta ao cliente",
            targetValue: 2,
            currentValue: 3.5,
            unit: "horas",
            lastUpdated: new Date()
          }
        ],
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date()
      },
      {
        id: "3",
        title: "Reduzir Custos Operacionais",
        description: "Diminuir custos operacionais em 15% através de otimização de processos",
        category: "efficiency",
        priority: "high",
        status: "at-risk",
        targetValue: 15,
        currentValue: 8,
        unit: "%",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-04-15"),
        assignedTo: "Equipe de Operações",
        kpis: [],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date()
      }
    ];
    setGoals(mockGoals);
  }, []);

  const handleCreateGoal = (newGoal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setGoals([...goals, goal]);
    setIsCreateDialogOpen(false);
    toast.success("Meta criada com sucesso!");
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, ...updates, updatedAt: new Date() }
        : goal
    ));
    toast.success("Meta atualizada com sucesso!");
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    toast.success("Meta removida com sucesso!");
  };

  const filteredGoals = goals.filter(goal => {
    const matchesCategory = selectedCategory === "all" || goal.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || goal.status === selectedStatus;
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusBadgeColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'at-risk': return 'bg-red-500';
      case 'planning': return 'bg-gray-500';
      case 'cancelled': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'at-risk': return AlertCircle;
      default: return Target;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Metas e Objetivos</h1>
              <p className="text-muted-foreground mt-2">
                Defina, acompanhe e avalie metas empresariais com indicadores de progresso
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nova Meta</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Meta</DialogTitle>
                </DialogHeader>
                <GoalForm onSubmit={handleCreateGoal} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Metrics Summary */}
          <GoalMetrics goals={goals} />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Buscar metas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="revenue">Receita</SelectItem>
                    <SelectItem value="growth">Crescimento</SelectItem>
                    <SelectItem value="efficiency">Eficiência</SelectItem>
                    <SelectItem value="quality">Qualidade</SelectItem>
                    <SelectItem value="team">Equipe</SelectItem>
                    <SelectItem value="customer">Cliente</SelectItem>
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
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="planning">Planejamento</SelectItem>
                    <SelectItem value="in-progress">Em Progresso</SelectItem>
                    <SelectItem value="on-track">No Prazo</SelectItem>
                    <SelectItem value="at-risk">Em Risco</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Relatório
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={(updates) => handleUpdateGoal(goal.id, updates)}
              onDelete={() => handleDeleteGoal(goal.id)}
            />
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma meta encontrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                  ? "Nenhuma meta corresponde aos filtros selecionados."
                  : "Comece criando sua primeira meta empresarial."
                }
              </p>
              {!searchTerm && selectedCategory === "all" && selectedStatus === "all" && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primera Meta
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Goals;