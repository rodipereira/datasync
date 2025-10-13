import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Goal } from "@/pages/Goals";
import GoalForm from "@/components/goals/GoalForm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  User, 
  MoreVertical, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onUpdate: (updates: Partial<Goal>) => void;
  onDelete: () => void;
}

const GoalCard = ({ goal, onUpdate, onDelete }: GoalCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const calculateProgress = () => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'on-track': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'at-risk': return 'text-red-600 bg-red-100';
      case 'planning': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-gray-500 bg-gray-50';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'revenue': return 'text-green-600 bg-green-50';
      case 'growth': return 'text-blue-600 bg-blue-50';
      case 'efficiency': return 'text-purple-600 bg-purple-50';
      case 'quality': return 'text-indigo-600 bg-indigo-50';
      case 'team': return 'text-pink-600 bg-pink-50';
      case 'customer': return 'text-teal-600 bg-teal-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4" />;
      case 'planning': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const formatValue = (value: number) => {
    if (goal.unit === 'R$') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    return `${value.toLocaleString('pt-BR')} ${goal.unit}`;
  };

  const isOverdue = new Date() > goal.endDate && goal.status !== 'completed';

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {goal.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {goal.description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className={`text-xs ${getCategoryColor(goal.category)}`}>
              {goal.category === 'revenue' && 'Receita'}
              {goal.category === 'growth' && 'Crescimento'}
              {goal.category === 'efficiency' && 'Eficiência'}
              {goal.category === 'quality' && 'Qualidade'}
              {goal.category === 'team' && 'Equipe'}
              {goal.category === 'customer' && 'Cliente'}
            </Badge>
            <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>
              {goal.priority === 'critical' && 'Crítica'}
              {goal.priority === 'high' && 'Alta'}
              {goal.priority === 'medium' && 'Média'}
              {goal.priority === 'low' && 'Baixa'}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(goal.status)}`}>
              <div className="flex items-center gap-1">
                {getStatusIcon()}
                {goal.status === 'planning' && 'Planejamento'}
                {goal.status === 'in-progress' && 'Em Progresso'}
                {goal.status === 'on-track' && 'No Prazo'}
                {goal.status === 'at-risk' && 'Em Risco'}
                {goal.status === 'completed' && 'Concluída'}
                {goal.status === 'cancelled' && 'Cancelada'}
              </div>
            </Badge>
            {isOverdue && (
              <Badge className="text-xs text-red-700 bg-red-100">
                Atrasada
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-muted-foreground">
                {calculateProgress().toFixed(1)}%
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
              <span>{formatValue(goal.currentValue)}</span>
              <span>{formatValue(goal.targetValue)}</span>
            </div>
          </div>

          {/* KPIs */}
          {goal.kpis && goal.kpis.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">KPIs ({goal.kpis.length})</h4>
              <div className="space-y-1">
                {goal.kpis.slice(0, 2).map((kpi) => (
                  <div key={kpi.id} className="flex items-center justify-between text-xs">
                    <span className="truncate flex-1">{kpi.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {kpi.currentValue}/{kpi.targetValue} {kpi.unit}
                    </span>
                  </div>
                ))}
                {goal.kpis.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{goal.kpis.length - 2} mais KPIs
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{format(goal.endDate, "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span className="truncate">{goal.assignedTo}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
          </DialogHeader>
          <GoalForm 
            initialData={goal}
            onSubmit={(updatedGoal) => {
              onUpdate(updatedGoal);
              setIsEditDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalCard;