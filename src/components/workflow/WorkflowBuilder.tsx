import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Settings, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Play,
  ArrowRight,
  Save
} from "lucide-react";
import { WorkflowStep, WorkflowTemplate } from "@/pages/WorkflowManagement";

interface WorkflowBuilderProps {
  initialWorkflow?: WorkflowTemplate;
  onSave?: (workflow: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'createdBy'>) => void;
}

const WorkflowBuilder = ({ initialWorkflow, onSave }: WorkflowBuilderProps) => {
  const [workflowName, setWorkflowName] = useState(initialWorkflow?.name || "");
  const [workflowDescription, setWorkflowDescription] = useState(initialWorkflow?.description || "");
  const [workflowCategory, setWorkflowCategory] = useState<WorkflowTemplate['category']>(initialWorkflow?.category || "other");
  const [steps, setSteps] = useState<WorkflowStep[]>(initialWorkflow?.steps || []);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      name: "Nova Etapa",
      type: "approval",
      description: "Descrição da etapa"
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, updatedStep: Partial<WorkflowStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updatedStep };
    setSteps(newSteps);
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    const newSteps = [...steps];
    const [removed] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, removed);
    setSteps(newSteps);
  };

  const handleDragStart = (index: number) => {
    setDraggedStep(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedStep !== null && draggedStep !== dropIndex) {
      moveStep(draggedStep, dropIndex);
    }
    setDraggedStep(null);
  };

  const getStepIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'notification': return <Users className="h-5 w-5 text-green-600" />;
      case 'condition': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'action': return <Play className="h-5 w-5 text-purple-600" />;
      default: return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStepTypeColor = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'approval': return 'bg-blue-100 text-blue-800';
      case 'notification': return 'bg-green-100 text-green-800';
      case 'condition': return 'bg-orange-100 text-orange-800';
      case 'action': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = () => {
    if (!workflowName.trim() || steps.length === 0) {
      return;
    }

    const workflow = {
      name: workflowName,
      description: workflowDescription,
      category: workflowCategory,
      steps,
      isActive: true
    };

    onSave?.(workflow);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Construtor de Workflow
          </CardTitle>
          <CardDescription>
            Crie e personalize fluxos de trabalho para automatizar processos empresariais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workflow Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="workflowName">Nome do Workflow *</Label>
              <Input
                id="workflowName"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Ex: Aprovação de Despesas"
              />
            </div>
            <div>
              <Label htmlFor="workflowCategory">Categoria *</Label>
              <Select value={workflowCategory} onValueChange={(value: WorkflowTemplate['category']) => setWorkflowCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Despesas</SelectItem>
                  <SelectItem value="leave">Férias</SelectItem>
                  <SelectItem value="document">Documentos</SelectItem>
                  <SelectItem value="equipment">Equipamentos</SelectItem>
                  <SelectItem value="training">Treinamento</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="workflowDescription">Descrição</Label>
            <Textarea
              id="workflowDescription"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Descreva o propósito deste workflow..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Etapas do Workflow</CardTitle>
              <CardDescription>
                Arraste e solte para reordenar as etapas
              </CardDescription>
            </div>
            <Button onClick={addStep}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Etapa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma etapa adicionada ainda</p>
                <p className="text-sm">Clique em "Adicionar Etapa" para começar</p>
              </div>
            ) : (
              steps.map((step, index) => (
                <div key={step.id}>
                  <div
                    className="border rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        {getStepIcon(step.type)}
                        <div className="flex-1 space-y-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <Label>Nome da Etapa</Label>
                              <Input
                                value={step.name}
                                onChange={(e) => updateStep(index, { name: e.target.value })}
                                placeholder="Nome da etapa"
                              />
                            </div>
                            <div>
                              <Label>Tipo de Etapa</Label>
                              <Select 
                                value={step.type} 
                                onValueChange={(value: WorkflowStep['type']) => updateStep(index, { type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="action">Ação</SelectItem>
                                  <SelectItem value="approval">Aprovação</SelectItem>
                                  <SelectItem value="notification">Notificação</SelectItem>
                                  <SelectItem value="condition">Condição</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <Label>Responsável</Label>
                              <Input
                                value={step.assignee || ""}
                                onChange={(e) => updateStep(index, { assignee: e.target.value })}
                                placeholder="email@empresa.com"
                              />
                            </div>
                            <div>
                              <Label>Prazo (horas)</Label>
                              <Input
                                type="number"
                                value={step.timeLimit || ""}
                                onChange={(e) => updateStep(index, { timeLimit: Number(e.target.value) })}
                                placeholder="24"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Descrição</Label>
                            <Textarea
                              value={step.description}
                              onChange={(e) => updateStep(index, { description: e.target.value })}
                              placeholder="Descreva esta etapa..."
                              rows={2}
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={getStepTypeColor(step.type)}>
                              {step.type === 'action' && 'Ação'}
                              {step.type === 'approval' && 'Aprovação'}
                              {step.type === 'notification' && 'Notificação'}
                              {step.type === 'condition' && 'Condição'}
                            </Badge>
                            {step.timeLimit && (
                              <Badge variant="outline">
                                Prazo: {step.timeLimit}h
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave} disabled={!workflowName.trim() || steps.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Workflow
        </Button>
      </div>
    </div>
  );
};

export default WorkflowBuilder;