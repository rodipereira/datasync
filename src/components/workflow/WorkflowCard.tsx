import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowTemplate } from "@/pages/WorkflowManagement";
import { 
  Settings, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Users,
  Clock,
  CheckCircle
} from "lucide-react";

interface WorkflowCardProps {
  workflow: WorkflowTemplate;
}

const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const getCategoryColor = (category: WorkflowTemplate['category']) => {
    switch (category) {
      case 'expense': return 'bg-green-100 text-green-800';
      case 'leave': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-purple-100 text-purple-800';
      case 'equipment': return 'bg-orange-100 text-orange-800';
      case 'training': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (category: WorkflowTemplate['category']) => {
    switch (category) {
      case 'expense': return 'Despesas';
      case 'leave': return 'Férias';
      case 'document': return 'Documentos';
      case 'equipment': return 'Equipamentos';
      case 'training': return 'Treinamento';
      default: return 'Outros';
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'notification': return <Users className="h-4 w-4 text-green-600" />;
      case 'condition': return <Settings className="h-4 w-4 text-purple-600" />;
      case 'action': return <Play className="h-4 w-4 text-orange-600" />;
      default: return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{workflow.name}</CardTitle>
              <Badge className={getCategoryColor(workflow.category)}>
                {getCategoryName(workflow.category)}
              </Badge>
              <Badge variant={workflow.isActive ? "default" : "secondary"}>
                {workflow.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <CardDescription>
              {workflow.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              {workflow.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Workflow Steps */}
        <div>
          <h4 className="text-sm font-medium mb-2">Etapas do Processo ({workflow.steps.length})</h4>
          <div className="space-y-2">
            {workflow.steps.slice(0, 3).map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full text-xs font-medium">
                  {index + 1}
                </div>
                {getStepTypeIcon(step.type)}
                <div className="flex-1">
                  <span className="text-sm font-medium">{step.name}</span>
                  {step.assignee && (
                    <p className="text-xs text-muted-foreground">
                      Responsável: {step.assignee}
                    </p>
                  )}
                </div>
                {step.timeLimit && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {step.timeLimit}h
                  </div>
                )}
              </div>
            ))}
            {workflow.steps.length > 3 && (
              <div className="text-xs text-muted-foreground text-center py-2">
                +{workflow.steps.length - 3} mais etapas
              </div>
            )}
          </div>
        </div>

        {/* Workflow Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
          <div>
            <span>Criado em: {formatDate(workflow.createdAt)}</span>
          </div>
          <div>
            <span>Por: {workflow.createdBy}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Iniciar Processo
          </Button>
          <Button variant="outline" size="sm">
            Ver Estatísticas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;